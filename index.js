const dotenv = require('dotenv').config()
const TodoItem = require('./models/todolist_item')
const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body',  (req) => JSON.stringify(req.body) )

app.use(express.static('front_end/build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan(':response-time :body'))


app.post('/api/todolist', (request, response, next) => {

  const body = request.body

  if (!body.title) {
    return response.status(400).json({ 
      error: 'invalid body' 
    })
  }

  const item = new TodoItem({
    title: body.title,
    done: false
})

  item.save()
    .then(saved => {
      console.log(`Added ${saved.title} to todolist`)
      response.json(saved)
    })
    .catch(error => next(error))
})

app.put('/api/todolist/:id', (request, response, next) => {

  const body = request.body

  if (!body.title) {
    return response.status(400).json({ 
      error: 'invalid body' 
    })
  }

  const item = {
    title: body.title,
    done: body.done
  }

  TodoItem.findByIdAndUpdate(request.params.id, item, { new: true })
    .then(x => {
      response.json(x)
    })
    .catch(error => next(error))
})

app.get('/api/todolist', (request, response) => {

  console.log(request.headers)

  TodoItem.find({}).then(x => {
    response.json(x)
  })
})

app.delete('/api/todolist/:id', (request, response, next) => {
  TodoItem.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()})
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
  else if (error.name === 'ValidationError') {
    return response.status(400).send( error.message )
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})