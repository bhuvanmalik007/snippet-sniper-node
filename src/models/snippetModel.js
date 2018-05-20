import mongoose from 'mongoose'

const Schema = mongoose.Schema

const snippetModel = new Schema({
  fileName: String,
  extension: String,
  annotations: Array,
  dateCreated: Date
}, { timestamps: true })

export default snippetModel
