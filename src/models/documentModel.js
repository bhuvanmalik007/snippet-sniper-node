import roleModel from './roleModel'

const documentObj = {
  name: String,
  description: String,
  starred: Boolean
}

export default roleModel(documentObj, 'document').fold()


