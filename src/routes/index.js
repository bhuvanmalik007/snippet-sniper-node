import express from 'express'
var router = express.Router()
import jwt from 'jsonwebtoken'
const publicKey = process.env.NODE_ENV === 'development' ? require('../../secrets') : process.env.PUBLICKEY

/* GET home page. */
router.get('/', function (req, res) {
  res.send({ title: 'Express' })
})


const jwtcheckr = async (req, res) => {
  if (!req.headers['authorization']) {
    res.send({ 'boo': 'No Token' })
  }
  try {
    await jwtverifyPromise(req.headers['authorization'].split(' ')[1])
    res.send({ authenticated: true })
  } catch (e) {
    console.log(e)
    res.send({ 'boo': 'Authentication Failed' })
  }
}

router.get('/verify', jwtcheckr)

const jwtverifyPromise = token => new Promise((resolve, reject) => {
  jwt.verify(token, publicKey.default, { algorithms: ['HS256'] }, function (err, decoded) {
    if (err) {
      console.log(err)
      reject(err)
      return
    }
    resolve(decoded)
  })
})

export default router
