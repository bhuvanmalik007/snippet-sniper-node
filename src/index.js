import createError from 'http-errors'
import express from 'express'
import indexRouter from './routes/index'
import usersRouter from './routes/index'
import serverConfig from './serverconfig'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRouter)
app.use('/users', usersRouter)

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
app.listen(serverConfig.port, (error) => {
  if (error) {
    console.log('Something Went Wrong')
    return
  }
  console.log(`Server running at ${serverConfig.port}`)
})

