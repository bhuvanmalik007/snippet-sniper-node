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
    res.send(res, 403, ({ 'boo': 'No Token' }))
  }
  try {
    await jwtverifyPromise(req.headers['authorization'].split(' ')[1])
  } catch (e) {
    res.send(res, 403, ({ 'boo': 'Authentication Failed' }))
  }
}

router.get('/verify', jwtcheckr)

const jwtverifyPromise = token => new Promise((resolve, reject) => {
  jwt.verify(token, publicKey, { algorithms: ['HS256'] }, function (err, decoded) {
    if (err) {
      reject(err)
      return
    }
    resolve(decoded)
  })
})

export default router
