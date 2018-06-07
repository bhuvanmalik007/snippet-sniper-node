import express from 'express'
import { xprod, omit, invertObj } from 'ramda'

const router = express.Router()

const routeNames = ['/snippet/(:id)?', '/document/(:id)?', '/folder/(:id)?']
const httpVerbs = ['get', 'put', 'post', 'delete']
const parentMapper = {
  snippet: 'document',
  document: 'folder'
}

const middleWareSpitter = (child, Resolver, method) => parentMapper[child] ?
  [
    Resolver(require('../models/' + child + 'Model.js').default)[method],
    Resolver(require('../models/' + parentMapper[child] + 'Model.js').default).put
  ]
  :
  Resolver(require('../models/' + child + 'Model.js').default)[method]

function Resolver(model) {
  return {
    get: (req, res) => model.findById(req.params.id)
      .populate(invertObj(parentMapper)[req.path.split('/')[1]] + 's')
      .then(x => res.send(x))
      .catch(res.send),
    post: (req, res, next) => {
      const item = new model(req.body)
      item.save()
        .then(async savedItem => {
          if (req.body.parentId) {
            const childName = req.path.split('/')[1]
            const parentModel = await require('../models/' + parentMapper[childName] + 'Model.js')
              .default
              .findById(req.body.parentId)
              .exec()
            req.params.id = req.body.parentId
            req.body = {}
            req.body[childName + 's'] = [...parentModel[childName + 's'], savedItem._id]
            next()
          }
          else res.send(savedItem)
        })
        .catch(res.send)
    },
    put: (req, res) => {
      model.findOneAndUpdate({ _id: req.params.id }, omit(['createdAt', 'updatedAt'], req.body), { new: true })
        .exec()
        .then(item => {
          res.send(item)
        })
        .catch(res.send)
    },
    delete: (req, res, next) => {
      model.findOneAndDelete({ _id: req.params.id })
        .exec()
        .then(async deletedItem => {
          if (req.body.parentId) {
            const childName = req.path.split('/')[1]
            const parentModel = await require('../models/' + parentMapper[childName] + 'Model.js')
              .default
              .findById(req.body.parentId)
              .exec()
            req.params.id = req.body.parentId
            req.body = {}
            req.body[childName + 's'] = parentModel[childName + 's'].filter(childId => childId != req.params.id)
            next()
          }
          else res.send(deletedItem)
        })
        .catch(res.send)
    }
  }
}

xprod(routeNames, httpVerbs).map(combo =>
  router[combo[1]](combo[0],  // route path,
    middleWareSpitter(combo[0].split('/')[1], Resolver, combo[1]) // middleware array
  ))

export default router
