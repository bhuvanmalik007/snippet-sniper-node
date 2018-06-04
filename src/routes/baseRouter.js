import express from 'express'
import { xprod, omit } from 'ramda'

const router = express.Router()

const routeNames = ['/snippet/(:id)?', '/document/(:id)?']
const httpVerbs = ['get', 'put', 'post', 'delete']

function Resolver(model) {
  return {
    get: (req, res) => model.findById(req.params.id)
      .then(x => res.send(x)).catch(res.send),
    post: (req, res) => {
      const item = new model(req.body)
      item.save()
        .then(savedItem => res.send(savedItem))
        .catch(res.send)
    },
    put: (req, res) => {
      model.findOneAndUpdate({ _id: req.params.id }, omit(['createdAt', 'updatedAt'], req.body), { new: true })
        .exec()
        .then(item => {
          console.log(item)
          res.send(item)
        })
        .catch(res.send)
    },
    delete: (req, res) => {
      model.findOneAndDelete({ _id: req.params.id })
        .exec()
        .then(deletedItem => res.send(deletedItem))
        .catch(res.send)
    }
  }
}

xprod(routeNames, httpVerbs).map(combo => router[combo[1]](combo[0],
  Resolver(require('../models/' + combo[0].split('/')[1] + 'Model.js').default)[combo[1]]))

export default router
