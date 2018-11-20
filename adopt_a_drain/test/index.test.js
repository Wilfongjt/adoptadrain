import test from 'ava'
import { Nuxt, Builder } from 'nuxt'
import { resolve } from 'path'
import axios from 'axios'
require('dotenv').config() // get .env variables
// import axios from '~/plugins/axios'
// We keep a reference to Nuxt so we can close
// the server at the end of the test
let nuxt = null
let guest_session_token = null
let payload =  {
    email: process.env.GUEST_USER,
    password: process.env.GUEST_PW
  }
let headers = {
      "Content-Type": 'application/json; charset=utf-8',
      "Accept": "application/json; charset=utf-8",
      "User-Agent": 'Mozilla/5.0',
      "X-DreamFactory-Api-Key": process.env.DF_API_KEY,
      "X-DreamFactory-Session-Token": null
  }

let guest_options = {
        rejectUnauthorized: false,
        dataType: 'json',
        url: 'http://' + process.env.DF_HOST
        + ':'
        + process.env.DF_PORT
        + '/api/v2/user/session',
        port: 433,
        method: 'POST',
        data: payload,
        headers: headers
      }
// Init Nuxt.js and start listening on localhost:4000


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

// DOM checking
test('Route / exits and render HTML with CSS applied', async t => {
  console.log('###########')
  console.log("/")
  console.log('###########')
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/')
  const element = window.document.querySelector('#home')
  t.not(element, null)
})

test('Route /adopt exits and render HTML with CSS applied', async t => {
  console.log('###########')
  console.log("/adopt")
  console.log('###########')
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/adopt')
  const element = window.document.querySelector('#adopt')
  t.not(element, null)
})
test('Route /sign_in exits and render HTML with CSS applied', async t => {
  console.log('###########')
  console.log("/sign_in")
  console.log('###########')
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/sign_in')
  const element = window.document.querySelector('#sign_in')
  t.not(element, null)
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
})

test('axios guest test', function (t) {
  console.log('###########')
  console.log('axios guest test')
  console.log('###########')

  let form = {
      data: {
        email: 'test@test.com',
        password: 'aA1!aaaa'
      },
      submitStatus: null
    }

  return axios( guest_options )
    .then((response) => {
      console.log('* guest Start docker-compose up before running this test')
      console.log('* guest Needs a mockup for dreamfactory')
      console.log("* guest response")

      const data = response.data
      // returns a sesssion token
      var regex = /./;
      t.true(regex.test(data.session_token))

      headers['path']='/api/v2/adopt_a_thing_development/_func/add_user'
      headers['X-DreamFactory-Session-Token'] = data.session_token

      let sessionOptions = {
        rejectUnauthorized: false,
        dataType: 'json',
        url: 'http://' + process.env.DF_HOST
        + ':'
        + process.env.DF_PORT
        + headers.path,
        port: 433,
        method: 'POST',
        data: {
            "resource": [ form.data ],
            "params": [
              { "name":"email_","value": form.data.email },
              { "name":"password_","value": form.data.password }
            ],
            "returns": "string"
        },
        headers: headers
      }

      return axios( sessionOptions )
        .then((response) => {
          let rc = JSON.parse(response.data)
          switch ( rc.id ) {
            case -23505:
              form.submitStatus = 'DUPLICATE'
              break
            default:
              form.submitStatus = 'OK'
          }
        })
        .catch((response) => {
          console.log("** new account failed.")
          console.log("** response: " + response )
          //let resource = response.response.data.error.context.resource
          let item = 0
          form.submitStatus = 'ERROR'
          t.true(1 === 2)
        })
    })
    .catch((response) => {
      // guest_session_token = null
      console.log("** guest sign in failed")
      console.log("* error response: " + response)
        t.true(1 === 2)
    })
})

// Close the Nuxt server
test.after('Closing server', t => {
  nuxt.close()
})
