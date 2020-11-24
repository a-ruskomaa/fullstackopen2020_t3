const express = require('express')
const app = express()

app.use(express.json())

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
          res.status(404).end();
      }

  })

  app.post('/api/persons', (req, res) => {
    const entry = req.body;
    entry.id = Math.floor(Math.random() * 100000);
    console.log(entry);

    data = data.concat(entry);
  
    res.json(entry);
  })

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    data = data.filter(entry => entry.id !== id);
  
    res.status(204).end();
  })

  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })