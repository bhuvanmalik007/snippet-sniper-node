import roleModel from './roleModel'
import mongoose from 'mongoose'

const documentObj = {
  name: String,
  description: String,
  starred: Boolean,
  snippets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'snippet' }]
}

export default roleModel(documentObj, 'document').fold()
