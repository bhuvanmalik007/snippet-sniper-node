import express from 'express'
import roleModel from '../models/roleModel'

const router = express.Router()

// const importer = async (modelName) => await import(`../models/${modelName}`)

function Resolver(model) {
  return {
    _findById: (req, res) => model.findById(req.id, function (err, item) {
      res.send(item)
    }),
    _save: (req, res) => {
      const item = new model(req.body.payload)
      item.save()
      res.send(item)
    }

  }
}

['snippet'].map(
  x => router.get(x, Resolver(roleModel(require('../models/' + x + 'Model.js'), x).fold(true))._findById)
)

['snippet'].map(
  x => router.post(x, Resolver(roleModel(require('../models/' + x + 'Model.js'), x).fold(true))._save)
)

console.log(router)

export default router
