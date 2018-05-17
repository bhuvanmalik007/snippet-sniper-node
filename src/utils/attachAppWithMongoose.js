import mongoose from 'mongoose'
import config from '../config'

mongoose.Promise = global.Promise

export default app => {
  console.log(config.mongo)
  app.connectThenListen =  async (port, errorCb) => await mongoose.connect(config.mongo).then(() => {
    app.listen(port, errorCb)
  }).catch(e => console.log(e))
  return app
}
