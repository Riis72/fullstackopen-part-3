const mongoose = require('mongoose')
const {mongo} = require('mongoose')

if (process.argv.length<3) {
  console.log('Anna salasana')
  process.exit(1)
}


const password = process.argv[2]

const url = `mongodb+srv://kriskaelep:${password}@fullstackopen.jye7hwq.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length>4) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log('saved', person)
    mongoose.connection.close()
  })

}
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}