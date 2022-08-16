const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const session = require('express-session')
const dotenv = require('dotenv')
const MongoStore = require('connect-mongo')
const logger = require('morgan')
const { getMongoDBUrl } = require('./utils')
const authRoutes = require('./routes/authRoutes')
const registriesRoutes = require('./routes/registriesRoutes')
const usersRoutes = require('./routes/usersRoutes')
const { frontEndBaseURL } = require('./constants')

dotenv.config()

const app = express()
const apiRouter = express.Router()

app.use(
  cors({
    origin: frontEndBaseURL,
    credentials: true
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(logger('dev'))

MongoClient.connect(
  getMongoDBUrl(process.env.MONGO_DB_USER, process.env.MONGO_DB_PASSWORD)
)
  .then(client => {
    app.locals.db = client.db('gift-registry')

    app.use(
      session({
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_SECRET_KEY,
        saveUninitialized: true,
        resave: false,
        store: MongoStore.create({ client, dbName: 'gift-registry' }),
        cookie: {
          sameSite: 'lax',
          secure: false,
          maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
        }
      })
    )

    app.use('/api', apiRouter)
    apiRouter.use('/auth', authRoutes)
    apiRouter.use('/registries', registriesRoutes)
    apiRouter.use('/users', usersRoutes)

    app.listen(8080, () =>
      console.log('API is running on http://localhost:8080')
    )
  })
  .catch(console.error)
