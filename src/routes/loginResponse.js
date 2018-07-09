import user from '../models/userModel'
import folderModel from '../models/folderModel'

export default (req, res) => {
  user.findOne({ sub: req.user.sub })
    .populate(({
      path: 'folders',
      populate: {
        path: 'documents',
        populate: {
          path: 'snippets'
        }
      }
    }))
    .then(async userObj => {
      if (userObj) {
        console.log('User exists')
        res.send(userObj)
        return
      }
      const rootFolder = new folderModel({
        documents: [],
        name: 'root',
        starred: false
      })
      const savedRootFolder = await rootFolder.save()
      const newUser = new user({ ...req.user, folders: [savedRootFolder._id] })
      const savedNewUser = await newUser.save()
      console.log('New user created')
      res.send(savedNewUser)
    })
    .catch(e => console.log(e))
}
