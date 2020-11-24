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



app.get('/api/info', (req, res) => {
      res.write(`<p>Phonebook has info for ${data.length} people</p>`);
      res.write(`<p>${new Date()}</p>`);
      res.end();
})

app.get('/api/persons', (req, res) => {
  Entry.find({}).then(result => {
    res.json(result);
  })
})


app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const entry = data.find(entry => entry.id === id);

    if (entry) {
        res.json(entry);
    } else {
        res.status(404).json({
          error: 'not found'
        })
    }

})

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  // if (data.find(entry => entry.name === body.name)) {
  //   return res.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

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
    // console.log(response)
    res.json(response);
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  data = data.filter(entry => entry.id !== id);

  res.status(204).end();
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})