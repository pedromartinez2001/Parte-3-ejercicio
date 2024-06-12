const morgan = require('morgan')
const cors = require('cors')

const express = require('express')
const app = express()

let personas = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
app.use(cors())
app.get('/api/personas', (request, response) => {
    response.json(personas)
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
    const id = Number(request.params.id)
    const person = personas.find(n => n.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
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
    const person = {
        id: randomId(),
        name: request.body.name,
        number: request.body.number

    }
    console.log(personas.some(b => b.name === body.name));
    if (body.name && body.number && !personas.some(b => b.name === body.name)) {
        personas = personas.concat(person)
        return response.json(personas)
    } else {
        return response.status(404).json({ error: 'error grave' })

    }


})
app.use(unknownEndpoint)



const PORT = process.env.PORT || 3001
app.listen(PORT)