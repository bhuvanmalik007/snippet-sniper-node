import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  id: String
})


export default mongoose.model('userModel',userSchema )
