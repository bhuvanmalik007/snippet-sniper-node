import mongoose from 'mongoose'
import { map } from '@elementary/proper'

const MSchema = mongoose.Schema

const roleModel = (modelObject, modelName) => ({
  fold: () => {
    return mongoose.model(modelName, new MSchema(modelObject, { timestamps: true }))
  },
  concat: newKeys => {
    return { ...modelObject, ...newKeys }
  },
  map: fn => map(modelObject, fn)
})

// class Schema extends Transformer {
//   constructor(object) {
//     super()
//     this.schemaObject = object
//   }

//   fold() {
//     const MSchema = mongoose.Schema
//     return mongoose.model('userModel', new MSchema(this.object))
//   }

//   concat(newKeys) {
//     return { ...this.schemaObject, ...newKeys }
//   }

//   map(fn){
//     return map(this.schemaObject, fn)
//   }
// }

export default roleModel
