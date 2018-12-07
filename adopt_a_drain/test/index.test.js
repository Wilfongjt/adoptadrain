import test from 'ava'
import { Nuxt, Builder } from 'nuxt'
import { resolve } from 'path'

import axios from 'axios'
//const restTemplate = require('../components/mixins/rest-templates.js')
require('dotenv').config() // get .env variables
// doenst work import { restTemplates } from '../components/mixins/rest-templates.js'
// We keep a reference to Nuxt so we can close
// the server at the end of the test
let nuxt = null

let show_object = function (obj_){
  console.log("----- show obj -----")
  let i = 0
  let keys = Object.keys(obj_);
  //console.log('keys: ' + keys)
  for(i in keys){
    let msg = ''
    try{
      msg = JSON.stringify(obj_[keys[i]])
      console.log( '    - key: ' + keys[i] + ': ' + JSON.stringify(obj_[keys[i]]) )
    }catch(err){
      msg = err
      //console.log('ERROR show_object: ' + err)
      console.log( '    - key: ' + keys[i] + ': ' + msg )
    }
  }
  console.log('show_object out')
}

test.before('Init Nuxt.js', async t => {
  const rootDir = resolve(__dirname, '..')

  let config = {}
  try { config = require(resolve(rootDir, 'nuxt.config.js')) } catch (e) {}

  config.rootDir = rootDir // project folder
  config.dev = false // production build
  config.mode = 'universal' // Isomorphic application

  console.log('Start docker-compose up before running this test')

  // console.log('config: ' + JSON.stringify(config))
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()

  nuxt.listen(4000, 'localhost')
})



test('getRestTemplate', async t => {
  console.log('###########')
  console.log("# getRestTemplate")
  console.log('###########')
  t.true(1===1)
})

// DOM checking
test('Route / exits and render HTML with CSS applied', async t => {
  console.log('###########')
  console.log("/")
  console.log('###########')
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/')
  const element = window.document.querySelector('#home')
  t.not(element, null)
  console.log('/.ok')
})

test('Route /adopt exits and render HTML with CSS applied', async t => {
  console.log('###########')
  console.log("/adopt")
  console.log('###########')
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/adopt')
  const element = window.document.querySelector('#adopt')
  t.not(element, null)
  console.log('/adopt.ok')
})

test('Route /sign_in exits and render HTML with CSS applied', async t => {
  console.log('###########')
  console.log("/sign_in")
  console.log('###########')
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/sign_in')
  const element = window.document.querySelector('#sign_in')
  t.not(element, null)
  console.log('/sign_in.ok')
})

test('Environment Variables', async t => {
  console.log('###########')
  console.log("/environment variables")
  console.log('###########')

  t.not(process.env.DF_API_KEY, undefined)
  t.not(process.env.GUEST_USER, undefined)
  t.not(process.env.GUEST_PW, undefined)
  t.not(process.env.DF_HOST, undefined)
  t.not(process.env.DF_PORT, undefined)
  t.not(process.env.GOOGLE_MAPS_JAVASCRIPT_API_KEY, undefined)
  console.log('ev.ok')
})


// Close the Nuxt server
test.after('Closing server', t => {
  nuxt.close()
})
