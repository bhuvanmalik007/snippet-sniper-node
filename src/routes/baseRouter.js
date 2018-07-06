import express from 'express'
import { xprod, omit, invertObj } from 'ramda'
// import { fchmodSync } from 'fs'

// Folder: 5b191da63c7e6e0b55ceaa23
// Document: 5b1921363c7e6e0b55ceaa24
//

const router = express.Router()

const routeNames = ['/snippet/(:id)?', '/document/(:id)?', '/folder/(:id)?', '/user/(:id)?']
const httpVerbs = ['get', 'put', 'post', 'delete']
const parentMapper = {
  snippet: 'document',
  document: 'folder',
  folder: 'user'
}

const Resolver = route => model => {
  return {
    get: id => model.findById(id)
      // .populate(({ path: 'documents', populate: {path:'snippets'}}))
      .populate(invertObj(parentMapper)[route] + 's')
      // .populate('snippets')
      .catch(err => console.log(err)),
    post: (_, entity) => {
      const item = new model(entity)
      return item.save()
        .then(savedItem => savedItem._id)
        .catch(err => console.log(err))
    },
    put: (id, entity) =>
      model.findOneAndUpdate({ _id: id }, omit(['createdAt', 'updatedAt'], entity), { new: true })
        .catch(err => console.log(err))
    ,
    delete: id =>
      model.findOneAndDelete({ _id: id })
        .then(() => id)
        .catch(err => console.log(err))
  }
}

const checkParent = route => (req, _, next) => {
  if (parentMapper[route]) {
    req.parent = true
    next()
    return
  }
  req.parent = false
  next()
}

const resolveResolver = (route, method, model) => (req, _, next) => {
  if (req.parent && (method === 'post' || method === 'delete')) {
    Resolver(route)(model)[method](req.params.id, req.body)
      .then(async childId => {
        // Create payload for parent here
        const parentModel = await require('../models/' + parentMapper[route] + 'Model.js').default
        const parentObj = await parentModel.findById(req.body.parentId).exec()
        // Handle POST and DELETE
        if (method === 'post') {
          parentObj[route + 's'] = [...parentObj[route + 's'], childId]
        }
        else {
          parentObj[route + 's'] = parentObj[route + 's'].filter(childId => childId != req.params.id)
        }
        // PUT in parent
        return Resolver(route)(parentModel)['put'](req.body.parentId, parentObj) // Promise
      })
      .then(x => {
        req.result = x
        next()
      })
  }
  else {
    Resolver(route)(model)[method](req.params.id, req.body).then(x => {
      req.result = x
      next()
    })
  }
}

const responseContructor = (req, res) => req.error ? res.send('failed') : res.send(req.result)

xprod(routeNames, httpVerbs)
  .map(combo =>
    router[combo.last()](combo.first(),  // route path
      // All route middlewares here
      checkParent(combo[0].split('/')[1]), // attach req.parent
      resolveResolver(combo[0].split('/')[1], combo[1], require('../models/' + combo[0].split('/')[1] + 'Model.js').default)
      // , createdefaultdocument()
      , responseContructor
    ))

export default router
