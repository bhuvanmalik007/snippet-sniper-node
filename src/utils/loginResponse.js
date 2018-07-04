import user from '../models/userModel'

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
    .then(userObj => {
      if (userObj) {
        console.log('User exists')
        res.send(userObj)
        return
      }
      const newUser = new user(req.user)
      newUser.save()
        .then(newUser => {
          console.log('New user created')
          res.send(newUser)
        })
    })
    .catch(e => console.log(e))
}
