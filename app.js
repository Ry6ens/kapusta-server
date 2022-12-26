const express = require('express')
const logger = require('morgan')
const cors = require('cors')
require('dotenv').config() 

const transitionsRouter = require('./routes/api/transitions')
const authRouter = require('./routes/api/auth')
const balancesRouter = require('./routes/api/balances')
const avatarsRouter = require('./routes/api/avatars')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/transitions', transitionsRouter)
app.use('/api/users', authRouter)
app.use('/api/balances', balancesRouter)
app.use('/api/avatars', avatarsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({
    message,
  })
})

module.exports = app
