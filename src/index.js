import createError from 'http-errors'
import express from 'express'
import indexRouter from './routes/index'
import usersRouter from './routes/index'
import serverConfig from './serverconfig'
import attachAppWithMongoose from './utils/attachAppWithMongoose'

import { binder } from '@elementary/proper'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

binder()
  .add(attachAppWithMongoose)
  .add(x => x) // do anything here
  .invoke(app) // fold
  .use('/', indexRouter)
  .use('/users', usersRouter)

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

