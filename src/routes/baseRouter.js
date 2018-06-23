import express from 'express'
import { xprod, omit, invertObj } from 'ramda'

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
    put: (id, entity) => {
      return model.findOneAndUpdate({ _id: id }, omit(['createdAt', 'updatedAt'], entity), { new: true })
        .exec()
        .catch(err => console.log(err))
    },
    delete: id => {
      return model.findOneAndDelete({ _id: id })
        .exec()
        .then(async deletedItem => deletedItem._id)
        .catch(err => console.log(err))
    }
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
  const fn = (req.parent && method === 'post' || method === 'delete')
    ?
    Resolver(route)(model)[method](req.params.id, req.body).then(x =>
      Resolver(route)((require('../models/' + parentMapper[route] + 'Model.js').default)['put'](x))
    )
      .then(x => {
        req.result = x
        next()
      })
    :
    Resolver(route)(model)[method](req.params.id, req.body).then(x => {
      req.result = x
      next()
    })
}

const responseContructor = (req, res) => req.error ? res.send('failed') : res.send(req.result)

xprod(routeNames, httpVerbs)
  .map(combo =>
    router[combo.last()](combo.first(),  // route path,
      checkParent(combo[0].split('/')[1])
      , resolveResolver(combo[0].split('/')[1], combo[1], require('../models/' + combo[0].split('/')[1] + 'Model.js').default) // middleware array
      // , createdefaultdocument()
      , responseContructor
    ))

export default router
