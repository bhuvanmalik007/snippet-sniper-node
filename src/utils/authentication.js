import jwt from 'jsonwebtoken'
import { pick } from 'ramda'
const publicKey =  process.env.PUBLICKEY

const jwtcheckr = async (req, res, next) => {
  if (!req.headers['authorization']) {
    res.send({ 'boo': 'No Token' })
    return
  }
  try {
    const userObj = await jwtverifyPromise(req.headers['authorization'].split(' ')[1])
    req.user = pick(['given_name', 'family_name', 'nickname', 'name', 'picture', 'gender', 'email', 'sub'], userObj)
    req.user.sub = req.user.sub.split('|')[1]
    // console.log(req.user)
    next()
  } catch (e) {
    console.log(e)
    res.send({ 'boo': 'Authentication Failed' })
  }
}

const jwtverifyPromise = token => new Promise((resolve, reject) => {
  jwt.verify(token, publicKey, { algorithms: ['HS256'] }, function (err, decoded) {
    if (err) {
      reject(err)
      return
    }
    resolve(decoded)
  })
})

export default jwtcheckr
