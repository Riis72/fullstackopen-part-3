const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))

//

app.use(express.json())

morgan.token("json", function(req, res) {
    return JSON.stringify(
        req.body
    )
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))



let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }


]


app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p> `)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
        id: maxId + 1
    }
    if (persons.some(p => p.name === body.name)) {
        return response.status(409).json({
            error: 'Person is already in phonebook'
        })
    }
    if (body.name === undefined || body.number === undefined) {
        return response.status(412).json( {
            error: 'You need to give name and number to the person'
        })
    }

    persons = persons.concat(person)

    response.json(person)
})






const PORT = process.env.PORT || 3002
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

