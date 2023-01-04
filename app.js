const express = require('express')
const logger = require('morgan')
const cors = require('cors')
require('dotenv').config() 
// const session = require('express-session');
// const MongoStore = require('connect-mongo');

const transitionsRouter = require('./routes/api/transitions')
const authRouter = require('./routes/api/auth')
const balancesRouter = require('./routes/api/balances')
// const { SECRET_KEY, DB_HOST } = process.env;

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use('/static', express.static('public')); // To access a file avatar

// app.use(session({
//   sid: 'user.sid',
//   secret: SECRET_KEY,
//   httpOnly: true,
//   secure: true,
//   maxAge: 1000 * 60 * 60 * 7,
//   resave: false,
//   saveUninitialized: true,
//   store: MongoStore.create({
//       mongoUrl: DB_HOST
//   })
// }));

app.use('/api/transitions', transitionsRouter)
app.use('/api/users', authRouter)
app.use('/api/balances', balancesRouter)


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
