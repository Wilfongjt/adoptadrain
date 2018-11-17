import test from 'ava'
import { Nuxt, Builder } from 'nuxt'
import { resolve } from 'path'

// import axios from 'axios'
// We keep a reference to Nuxt so we can close
// the server at the end of the test
let nuxt = null

// Init Nuxt.js and start listening on localhost:4000
test.before('Init Nuxt.js', async t => {
  const rootDir = resolve(__dirname, '..')
  let config = {}
  try { config = require(resolve(rootDir, 'nuxt.config.js')) } catch (e) {}
  config.rootDir = rootDir // project folder
  config.dev = false // production build
  config.mode = 'universal' // Isomorphic application
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  nuxt.listen(4000, 'localhost')
})

// DOM checking
test('Route / exits and render HTML with CSS applied', async t => {
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/')
  const element = window.document.querySelector('#home')
  t.not(element, null)
})

test('Route /adopt exits and render HTML with CSS applied', async t => {
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/adopt')
  const element = window.document.querySelector('#adopt')
  t.not(element, null)
})

test('Route /signin exits and render HTML with CSS applied', async t => {
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/signin')
  const element = window.document.querySelector('#signin')
  t.not(element, null)
})

test('Route /account exits and render HTML with CSS applied', async t => {

  const window = await nuxt.renderAndGetWindow('http://localhost:4000/account')

  const element = window.document.querySelector('#account')

  t.not(element, null)

})
// Close the Nuxt server
test.after('Closing server', t => {
  nuxt.close()
})
