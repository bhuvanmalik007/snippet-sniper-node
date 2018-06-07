import roleModel from './roleModel'
import mongoose from 'mongoose'

const folderObj = {
  name: String,
  starred: Boolean,
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'document' }]
}

export default roleModel(folderObj, 'folder').fold()
