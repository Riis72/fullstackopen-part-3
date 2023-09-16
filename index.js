const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const Person = require('./models/person')

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

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })

    }

    next (error)
}




app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})
app.get('/info', async  (request, response) => {
    const count = await  Person.countDocuments({}).exec()
    response.send(`<p>Phonebook has info for ${count} people</p> <p>${new Date()}</p> `)
})
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next (error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next (error))

    response.status(204).end()
  })

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(412).json( {
            error: 'You need to give name and number to the person'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
        .catch(err => next (err))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next (error))
})



app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

