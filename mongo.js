const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]


const url =
  `mongodb+srv://fullstack-admin:${password}@puhelinluettelo-db.t5hor.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const entrySchema = new mongoose.Schema({
  name: String,
  number: String
})

const Entry = mongoose.model('Entry', entrySchema)


if (process.argv.length === 3) {
    console.log('phonebook:')
    Entry.find({}).then(result => {
        result.forEach(entry => {
          console.log(entry.name, entry.number)
        })
        mongoose.connection.close()
      })
} else {
    const name = process.argv[3]
    const number = process.argv[4]

    const entry = new Entry({
    name,
    number
    })

    entry.save().then(res => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
    })
 }
