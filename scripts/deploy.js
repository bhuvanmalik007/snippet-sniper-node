const ghPages = require('gh-pages')
const fs = require('fs-extra')

const branch = 'master'
const buildfolder = 'build'

// fs.rmdirSync(path.resolve(process.cwd(), 'node_modules/gh-pages/.cache'))
fs.writeFile(`${buildfolder}/Procfile`, 'web npm run heroku', err => (err ? console.log(err) : console.log('Created Procfile for Heroku')))
fs.copyFileSync('package.json', `${buildfolder}/package.json`)
console.log('Copied package.json')
fs.copyFileSync('yarn.lock', `${buildfolder}/yarn.lock`)
console.log('Copied package-lock.json')
fs.copyFileSync('index.js', `${buildfolder}/index.js`)
console.log('Copied index.js')

ghPages.publish('build', { branch, remote: 'heroku' }, (err) => {
  if (err) {
    return console.error(err)
  }
  return console.log('Successfully pushed to ' + branch)
})
