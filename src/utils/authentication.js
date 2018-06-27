import jwt from 'jsonwebtoken'
const publicKey = process.env.NODE_ENV === 'development' ? require('../../secrets') : process.env.PUBLICKEY

const jwtcheckr = async (req, res, next) => {
  if (!req.headers['authorization']) {
    res.send({ 'boo': 'No Token' })
  }
  try {
    req.user = await jwtverifyPromise(req.headers['authorization'].split(' ')[1])
    console.log(req.user)
    next()
  } catch (e) {
    res.send({ 'boo': 'Authentication Failed' })
  }
}

const jwtverifyPromise = token => new Promise((resolve, reject) => {
  jwt.verify(token, publicKey.default, { algorithms: ['HS256'] }, function (err, decoded) {
    if (err) {
      reject(err)
      return
    }
    resolve(decoded)
  })
})

export default jwtcheckr
