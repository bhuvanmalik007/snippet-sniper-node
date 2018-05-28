import express from 'express'
import roleModel from '../models/roleModel'
// import snippet from '../models/snippetModel'

const router = express.Router()

// const importer = async (modelName) => await import(`../models/${modelName}`)

function Resolver(model) {
  return {
    _get: (req, res) => model.findById(req.id, function (err, item) {
      res.send(item)
    })
    // _save: async () => await .
  }
}

['snippet'].map(
  x => {
    // console.log(roleModel(require('../models/' + x + 'Model.js'), x).fold(true))
    return router.get(x, Resolver(roleModel(require('../models/' + x + 'Model.js'), x).fold(true))._get)
  }
)

console.log(router)

export default router
