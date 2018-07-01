import { omit, invertObj } from 'ramda'
import { parentMapper } from '../constants'


export default route => model => {
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
        .then(() => id)
        .catch(err => console.log(err))
  }
}
