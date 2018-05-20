if(process.env.NODE_ENV==='development'){
  require('./scripts/start.js')
}

if(process.env.NODE_ENV==='production'){
  require('./main')
}
