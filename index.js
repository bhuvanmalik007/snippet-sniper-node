if(process.env.NODE_ENV==='development'){
  process.env.PUBLICKEY = require('./secrets')
  require('./scripts/start.js')
}

if(process.env.NODE_ENV==='production'){
  require('./main')
}
