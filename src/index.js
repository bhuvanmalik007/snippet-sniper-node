import createError from 'http-errors'
import express from 'express'
import indexRouter from './routes/index'
import serverConfig from './serverconfig'
import attachAppWithMongoose from './utils/attachAppWithMongoose'
// import upgradeResponse from './utils/attachResponseObjectToApp'
import jwtcheckr from './utils/authentication'
import baseRouter from './routes/baseRouter'

import { binder } from '@elementary/proper'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const use = (...args) => app => app.use(...args)


binder()
  .add(attachAppWithMongoose)
  // .add(upgradeResponse)
  .add(use('/', indexRouter))
  .add(use(jwtcheckr))
  .add(use('/ty', (_, res) => res.send('Verified')))
  .add(use('/auth', baseRouter))
  .invoke(app) // fold

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// start app
app.connectThenListen(serverConfig.port, (error) => {
  if (error) {
    console.log('Something Went Wrong')
    return
  }
  console.log(`Server running at ${serverConfig.port}`)
})

