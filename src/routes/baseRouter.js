import express from 'express'
import { xprod, omit, invertObj } from 'ramda'
// import { fchmodSync } from 'fs'

// Folder: 5b191da63c7e6e0b55ceaa23
// Document: 5b1921363c7e6e0b55ceaa24

const router = express.Router()

const routeNames = ['/snippet/(:id)?', '/document/(:id)?', '/folder/(:id)?']
const httpVerbs = ['get', 'put', 'post', 'delete']
const parentMapper = {
  snippet: 'document',
  document: 'folder'
}

const Resolver = route => model => {
  return {
    get: id => model.findById(id)
      .populate(invertObj(parentMapper)[route] + 's')
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
        // .exec()
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
  console.log('sdfsdfs')
  if (req.parent && (method === 'post' || method === 'delete')) {
    Resolver(route)(model)[method](req.params.id, req.body)
      .then(async childId => {
        // Create entity payload here
        console.log('childId: ' + childId)
        const parentModel = await require('../models/' + parentMapper[route] + 'Model.js').default
        const parentObj = await parentModel.findById(req.body.parentId).exec()
        console.log('parentObj: ' + parentObj)
        if (method === 'post') {
          parentObj[route + 's'] = [...parentObj[route + 's'], childId]
        }
        else {
          parentObj[route + 's'] = parentObj[route + 's'].filter(childId => childId != req.params.id)
        }
        return Resolver(route)(parentModel)['put'](req.body.parentId, parentObj) // Promise
      })
      .then(x => {
        req.result = x
        next()
      })
  }
  else {
    console.log(req.params.id)
    Resolver(route)(model)[method](req.params.id, req.body).then(x => {
      console.log(x)
      req.result = x
      next()
    })
  }
}

const responseContructor = (req, res) => req.error ? res.send('failed') : res.send(req.result)

xprod(routeNames, httpVerbs)
  .map(combo =>
    router[combo.last()](combo.first(),  // route path,
      checkParent(combo[0].split('/')[1]), // attach req.parent
      resolveResolver(combo[0].split('/')[1], combo[1], require('../models/' + combo[0].split('/')[1] + 'Model.js').default)
      // , createdefaultdocument()
      , responseContructor
    ))

export default router
