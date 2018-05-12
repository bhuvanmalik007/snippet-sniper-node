const EnhancerCommonutils = require('@lectro/enhancer-commonutils')
const Lectro = require('@lectro/core')
const WebpackBar = require('webpackbar') // eslint-disable-line

const NodeTakeoff = new Lectro('node')
module.exports = NodeTakeoff.use(EnhancerCommonutils)
  .extend((config) => {
    config.plugins.push(new WebpackBar({ name: 'NodeTakeoff' }))
    return config
  })
