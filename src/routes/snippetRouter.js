import express from 'express'
import { xprod } from 'ramda'

const router = express.Router()

const routeNames = ['/snippet']
const httpVerbs = ['get', 'post']

// const importer = async (modelName) => await import(`../models/${modelName}`)

function Resolver(model) {

  return {
    get: (req, res) => model.default.findById(req.id, function (err, item) {
      res.send(item)
    }),
    post: (req, res) => {
      const item = new model.default(req.body.payload)
      item.save()
      res.send(item)
    }
  }
}

xprod(routeNames, httpVerbs).map(combo => router[combo[1]](combo[0],
  Resolver(require('../models/' + combo[0].slice(1) + 'Model.js'))[combo[1]]))

// ['/snippet'].map(
//   x => router.get(x, Resolver(require('../models/' + x.slice(1) + 'Model.js'))._findById)
// )

export default router
