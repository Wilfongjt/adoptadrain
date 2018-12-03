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
let guest_payload =  {
    email: process.env.GUEST_USER,
    password: process.env.GUEST_PW
  }
let form = {
    data: {
      "name": "John",
      "email": "deleteme" + (Math.random()) + "@app.com",
      "password": "aA1!aaaa",
      "first_name": "appy",
      "last_name": "appy"
    },
    submitStatus: null
  }
  // add_user params
let computed = {
  params: [
      { "name":"email_","value": form.data.email },
      { "name":"password_","value": form.data.password }
    ]
  }

let layers = [
  {
    name: "guest",
    description: "",
    type: "user-session",
    data_tmpl: {
      "email": "%e",
      "password": "%p"
    },
    source: {
      type: "dreamfactory",
      connector: {
        url_tmpl: 'http://%h:%p/api/v2/user/session'
      }
    }
  },
  {
    name: "df-new-user",
    description: "",
    type: "new-user",
    source: {
      type: "dreamfactory",
      connector: {
        url_tmpl: 'http://%h:%p/api/v2/system/user'
      }
    }
  },
  {
    name: "pg-add-user",
    description: "",
    type: "func",
    dependent: "df-new-user",
    source: {
      type: "dreamfactory",
      connector: {
        url_tmpl: 'http://%h:%p/api/v2/adopt_a_drain/_func/add_user'
      }
    }
  }
]

let requestify = function( lyr, sessionToken ) {
  //console.log('requestify sessionToken: ' + lyr.name+ '  ' + sessionToken)
  let df_request = {
    rejectUnauthorized: false,
    dataType: 'json',
    port: 433,
    method: 'POST',
    headers: {},
    data: {}
  }
  try {
    if(lyr.source.type==='dreamfactory'){

      // HEADERS
      let headers = {
        "Content-Type": 'application/json; charset=utf-8',
        "Accept": "application/json; charset=utf-8",
        "User-Agent": 'Mozilla/5.0',
        "X-DreamFactory-Api-Key": process.env.DF_API_KEY,
        "X-DreamFactory-Session-Token": null
      }
      //console.log('headers 1: ' + JSON.stringify(headers))
      df_request.headers=headers

      df_request.url=lyr.source.connector.url_tmpl
        .replace('%h',process.env.DF_HOST)
        .replace('%p',process.env.DF_PORT)
      // add_user
      if(lyr.type==='func'){
          // Data
          df_request.data= {
              //"resource": [ form.data ],
              "params": computed.params,
              "returns": "string"
          }
          df_request.headers["X-DreamFactory-Session-Token"]=sessionToken
      }
      // USER SESSION
      if(lyr.type==='user-session'){
        // Data
        df_request.data= {
            "resource": [ form.data ],
        }
        // have to have token befor calling
        // token passed with requestify(lyr, sesssionToken)
        df_request.headers['X-DreamFactory-Session-Token']=sessionToken
        // console.log('header 2: ' + JSON.stringify(headers))
        if(lyr.source.connector.method){
          df_request.method = lyr.source.connector.method
        } else {
          df_request.method = 'GET'
        }
        //console.log('df_request: ' + JSON.stringify(df_request))
      }
      // NEW USER
      if(lyr.type==='new-user'){
        // Data
        df_request.data= {
            "resource": [ form.data ],
        }
        // have to have token befor calling
        // token passed with requestify(lyr, sesssionToken)
        df_request.headers['X-DreamFactory-Session-Token']=sessionToken
        // console.log('header 2: ' + JSON.stringify(headers))
      }

       // GUEST SIGNIN
      if(lyr.type==='user-session'){
        df_request.url=lyr.source.connector.url_tmpl
          .replace('%h',process.env.DF_HOST)
          .replace('%p',process.env.DF_PORT)
        // Data
        df_request.data={
          email: process.env.GUEST_USER,
          password: process.env.GUEST_PW
        }
      }
    }
  }catch(err){
    console.log('ERROR requestify ')
    console.log('ERROR requestify ' + err)
    show_object(df_request)
  }
  show_object(df_request)
  //console.log('requestify: ' + df_request )
  return df_request
}

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
/*
let show_user_session = function(title, sessionToken){
  console.log('----- %t show_user_session -----'.replace('%t', title))
  let layer = {
    name: "get-user-session",
    description: "",
    type: "user-session",
    dependent: "guest",
    source: {
      type: "dreamfactory",
      connector: {
        url_tmpl: 'http://%h:%p/api/v2/user/session',
        method: 'GET'
      }
    }
  }
  return axios( requestify(layer, sessionToken ) )
    .then((response) => {
      console.log('----------- show_user_session' )
      console.log('** show_user_session response.status: ' + response.status)
      show_object(response)
      //console.log('response.data: ' + JSON.stringify(response.data))

    })
    .catch((response) => {
      console.log("** show_user_session failed.")
      console.log("** show_user_session failed response: " + response )
      //let resource = response.response.data.error.context.resource
      let item = 0
      form.submitStatus = 'ERROR'
      t.true(1 === 2)
    })
}
*/
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

test('axios guest', function (t) {
  console.log('###########')
  console.log('axios guest')
  console.log('###########')
  console.log('1.')
  //return axios( guest_options )
  try{
    return axios( requestify(layers[0]) ) // guest options
      .then((response) => {
        //console.log('1.1')
        //console.log("response: " + response)
        const data = response.data
        // returns a sesssion token
        let regex = /./;
        t.true(regex.test(data.session_token))
        //console.log('1.ok')
      })
      .catch((response) => {
        console.log('1.1.err')
        // guest_session_token = null
        console.log("1.1 * guest sign in failed")
        console.log("1.1 * error response: " + response)
        t.true(1 === 2)
      })
  }catch(err){
    console.log('1.1.err ' + err)
    console.log('1.1.err  run again')
  }
})

test('axios DF and PG new user', function (t) {
  console.log('###########')
  console.log('axios DF and PG new user')
  console.log('###########')
  console.log('5.')
  // use guest account to Token
  // use token to create new DF user_id
  // use token to create new application account
  //   new-account is dependent on the guest account
  //   new-account uses a axios chain
  // get guest privileges
  let sessToken = ''
  //console.log('-----------5.1' )
  try{
  return axios(  requestify(layers[0])  )
    .then((response) => {
      //console.log('-----------5.1.1' )

      let data = response.data
      sessToken = data.session_token

      t.not(data.session_token, undefined)
      let regex = /./;
      t.true(regex.test(data.session_token))

      //console.log('----------- 5.1.ok')
      //console.log('----------- 5.2')
      return axios( requestify(layers[1], data.session_token) )
        .then((response) => {

          //console.log('5.2.1 response.status ')
          t.not(sessToken, undefined)
          t.not(data.session_token, undefined)
          t.not(response.status, undefined)
          t.true(response.status === 201)
          //console.log('5.2.5.ok')
          //console.log('5.2.6')
          return axios( requestify(layers[2], sessToken) )
            .then((response) => {
              t.true(response.status===200)

            })
            .catch((response) => {
              console.log('5.2.6.err')
              console.log("5.2.6 ** PG new PG account failed.")
              console.log("5.2.6 ** PG new PG account failed response: " + response )
              //let resource = response.response.data.error.context.resource
              let item = 0
              form.submitStatus = 'ERROR'
              t.true(1 === 2)
            })


        })
        .catch((response) => {
          console.log('5.2.err')
          console.log("5.2.err ** new df account failed.")
          console.log("5.2.err ** new df account failed response: " + response )
          //let resource = response.response.data.error.context.resource
          let item = 0
          form.submitStatus = 'ERROR'
          t.true(1 === 2)
        })
    })
    .catch((response) => {
      // guest_session_token = null
      console.log('5.1.err')
      console.log("5.1.err ** guest sign in failed")
      console.log("5.1.err ** guest sign in error response: " + response)
        t.true(1 === 2)
    })
  } catch(err){
    console.log('5.err ' + err)
    console.log('5.err  run again...DF hasnt spun up yet')
  }
})


/*
test('axios sign-in', function (t) {
  console.log('###########')
  console.log('axios sign-in')
  console.log('###########')

  //   new-account is dependent on the guest account
  //   new-account uses a axios chain

  let form = {
      data: {
        name: 'tester',
        email: 'test@test.com',
        password: 'aA1!aaaa'
      },
      submitStatus: null
    }

  // get
  return axios( guest_options )
    .then((response) => {
      console.log('* guest Start docker-compose up before running this test')
      console.log('* guest Needs a mockup for dreamfactory')
      console.log("* guest response")

      const data = response.data
      // returns a sesssion token
      var regex = /./;
      t.true(regex.test(data.session_token))

      headers['path']='/api/v2/adopt_a_drain/_func/sign_in'
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
          //console.log('response: ' + JSON.stringify(response))
          // t.not(response.data, undefined)
          let rc = JSON.parse(response.data)

          t.not(rc.id, undefined)
          t.not(rc.name, undefined)
          t.true(rc.id > 0)
          t.true(rc.name === form.data.email)

        })
        .catch((response) => {
          console.log("** sign-in failed.")
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
    */
//})

/*
      let postressOptions = {
        rejectUnauthorized: false,
        dataType: 'json',
        url: 'http://' + process.env.DF_HOST
        + ':'
        + process.env.DF_PORT
        + '/api/v2/adopt_a_drain/_func/add_user',
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
        headers: {
          "X-DreamFactory-Api-Key": process.env.DF_API_KEY,
          "X-DreamFactory-Session-Token": data.session_token
        }
      }
*/




// Close the Nuxt server
test.after('Closing server', t => {
  nuxt.close()
})
