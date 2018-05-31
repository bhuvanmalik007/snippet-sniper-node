import roleModel from './roleModel'

const snippetObj = {
  fileName: String,
  extension: String,
  code: String,
  annotations: [String],
  colorCode: String,
  starred: Boolean
}

export default roleModel(snippetObj, 'snippet').fold()


