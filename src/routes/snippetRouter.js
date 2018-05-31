import express from 'express'
// import roleModel from '../models/roleModel'

const router = express.Router()

// const importer = async (modelName) => await import(`../models/${modelName}`)

function Resolver(model) {

  return {
    _findById: (req, res) => model.default.findById(req.id, function (err, item) {
      res.send(item)
    }),
    _save: (req, res) => {
      const item = new model.default(req.body.payload)
      item.save()
      res.send(item)
    }
  }
}

['/snippet'].map(
  x => router.get(x, Resolver(require('../models/' + x.slice(1) + 'Model.js'))._findById)
)

;['/snippet'].map(
  x => router.post(x, Resolver(require('../models/' + x.slice(1) + 'Model.js'))._save)
)

// ;['snippet'].map(
//   x => router.post(x, Resolver(roleModel(require('../models/' + x + 'Model.js'), x).fold())._save)
// )

export default router
