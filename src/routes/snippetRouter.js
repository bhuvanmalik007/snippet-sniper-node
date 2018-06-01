import express from 'express'
import { xprod, omit } from 'ramda'

const router = express.Router()

const routeNames = ['/snippet/(:id)?']
const httpVerbs = ['get', 'put', 'post']
// const bodyVerbs = ['post']

// const importer = async (modelName) => await import(`../models/${modelName}`)

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
      console.log('put')
      model.findOneAndUpdate({ _id: req.params.id }, omit(['createdAt', 'updatedAt'], req.body), { new: true })
        .exec()
        .then(item => {
          console.log(item)
          res.send(item)
        })
        .catch(res.send)
    }
  }
}

xprod(routeNames, httpVerbs).map(combo => router[combo[1]](combo[0],
  Resolver(require('../models/' + combo[0].split('/')[1] + 'Model.js').default)[combo[1]]))

// ['/snippet'].map(
//   x => router.get(x, Resolver(require('../models/' + x.slice(1) + 'Model.js'))._findById)
// )

export default router
