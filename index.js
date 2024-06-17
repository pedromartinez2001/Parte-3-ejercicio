const morgan = require('morgan')
const cors = require('cors')
const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/mongo')



let personas = [

]
app.use(express.static('dist'))
app.use(cors())
app.get('/api/personas', (request, response) => {
    Person.find({}).then(person =>
        response.json(person)
    )
})
app.get('/api/info', (request, response) => {
    const info = personas.length
    const time = Date(request.headers.date)
    console.log(time);
    const text = `<p>Phonebook has info for ${info} persons</p>
                  <p>Tiempo: ${time}</p>  `
    console.log(info);
    response.send(text)
})
app.get('/api/personas/:id', (request, response) => {

    Person.findById(request.params.id).then(person =>
        response.json(person)
    )


})
app.delete('/api/personas/:id', (request, response) => {
    const id = Number(request.params.id)
    personas = personas.filter(n => n.id !== id)
    response.json(personas)
})
const randomId = () => {
    return Math.floor(Math.random() * 9999)
}
morgan.token('msg', (req, res) => { console.log(req.body); })
app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan('msg'))
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.post('/api/personas', (request, response) => {
    const body = request.body
    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })


})
app.use(unknownEndpoint)



const PORT = process.env.PORT
app.listen(PORT, () => console.log(PORT))