const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(cors())
app.use(express.static('build'))

morgan.token('body', function (req, res) { return req.method === 'POST' ? JSON.stringify(req.body) : ' ' })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let data = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ];

  app.get('/api/info', (req, res) => {
        res.write(`<p>Phonebook has info for ${data.length} people</p>`);
        res.write(`<p>${new Date()}</p>`);
        res.end();
  })
  
  app.get('/api/persons', (req, res) => {
      res.json(data);
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

    if (data.find(entry => entry.name === body.name)) {
      return res.status(400).json({
        error: 'name must be unique'
      })
    }

    if (!body.number) {
      return res.status(400).json({
        error: 'number missing'
      })
    }

    const entry = {
      "name": body.name,
      "number": body.number,
      "id": Math.floor(Math.random() * 100000)
    }

    data = data.concat(entry);
  
    res.json(entry);
  })

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    data = data.filter(entry => entry.id !== id);
  
    res.status(204).end();
  })

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })