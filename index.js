require('dotenv').config()
const express = require('express')
const app = express()

const cors = require('cors')
const morgan = require('morgan')
const Entry = require('./models/entry')

app.use(cors())

app.use(express.static('build'))
app.use(express.json())

morgan.token('body', function (req, res) { return req.method === 'POST' ? JSON.stringify(req.body) : ' ' })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const PORT = process.env.PORT

app.get('/api/info', (req, res, next) => {
  Entry.find({}).then(result => {
    res.write(`<p>Phonebook has info for ${result.length} people</p>`);
    res.write(`<p>${new Date()}</p>`);
    res.end();
  })
  .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
  Entry.find({}).then(result => {
    res.json(result);
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Entry.findById(req.params.id)
  .then(entry => {
    if (entry) {
      res.json(entry)
    } else {
      res.status(404).json({
        error: 'not found'
      })
    }
  })
  .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  const entry = new Entry({
    name: body.name,
    number: body.number
  })

  entry.save().then(response => {
    res.json(response);
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const entry = {
    name: body.name,
    number: body.number
  }

  Entry.findByIdAndUpdate(req.params.id, entry, {new: true})
  .then(updatedEntry => {
    res.json(updatedEntry)
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
  Entry.findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})