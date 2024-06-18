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
    const info = Person.length
    const time = Date(request.headers.date)
    console.log(time);
    const text = `<p>Phonebook has info for ${info} persons</p>
                  <p>Tiempo: ${time}</p>  `
    console.log(info);
    response.send(text)
})
app.get('/api/personas/:id', (request, response, next) => {

    Person.findById(request.params.id).then(person =>
        response.json(person)
    ).catch(error => next(error))

})
app.delete('/api/personas/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => response.status(204).end())
        .catch(error => next(error))
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
app.post('/api/personas', (request, response, next) => {
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
    }).catch(error => next(error))


})
app.put('/api/personas/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(request.params.id, { name, number },
        { new: true, runValidators: true, context: 'query' })
        .then(updatedPersons =>
            response.json(updatedPersons)
        ).catch(error => next(error))
})
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'id malformado' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => console.log(PORT))