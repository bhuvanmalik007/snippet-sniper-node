import roleModel from './roleModel'
import mongoose from 'mongoose'

const userModel = {
  given_name: String,
  family_name: String,
  sub: String,
  nickname: String,
  name: String,
  picture: String,
  email: String,
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'folder' }]
}

export default roleModel(userModel, 'user').fold()
