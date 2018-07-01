import user from '../models/userModel'

export default (req, res) => {
  const reqId = req.user.sub.split('|')[1]
  user.findOne({ sub: reqId })
    .then(userObj => {
      if(userObj){
        res.send(userObj)
        return
      }
      res.send({message: 'user not found'})
    })
    .catch(e => console.log(e))

}
