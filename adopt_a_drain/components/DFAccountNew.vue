<template>
  <div class="band">

    <!-- Banner / -->
    <h1 class="title">
      {{ page.title }}
    </h1>

    <h2 class="subtitle">
      {{ page.subtitle }}
    </h2>

    <div v-if="isAuthenticated">
      <h2>Your Account</h2>
      <br>
      <div>{{ getUserName }}</div>
    </div>

    <div v-if="!isAuthenticated">
      <h2>Create Account</h2>
      <br>
    </div>

    <form v-if="!isAuthenticated" @submit.prevent="submit">
      <div
        :class="{ 'form-group--error': $v.form.data.email.$error }"
        class="form-group">
        <label class="form__label">Email</label>
        <input
          v-model.trim="$v.form.data.email.$model"
          class="form__input">

      </div>

      <div
        v-if="!$v.form.data.email.goodemail"
        class="error">Bad email address format</div>

      <div
        v-if="!$v.form.data.email.required"
        class="error">Email is required</div>

      <div
        v-if="!$v.form.data.email.minLength"
        class="error">Email must have at least {{ $v.form.data.email.$params.minLength.min }} letters.</div>

      <div
        :class="{ 'form-group--error': $v.form.data.password.$error }"
        class="form-group" >
        <label class="form__label">Password</label>
        <input
          v-model.trim="$v.form.data.password.$model"
          class="form__input">
      </div>

      <div
        v-if="!$v.form.data.password.required"
        class="error">Password is required</div>

      <div
        v-if="!$v.form.data.password.minLength"
        class="error">{{ $v.form.data.password.$params.minLength.min }} characters required.</div>

      <div
        v-if="!$v.form.data.password.onecap"
        class="error">A capital letter is required.</div>

      <div
        v-if="!$v.form.data.password.onelowercase"
        class="error">A lowercase letter is required.</div>

      <div
        v-if="!$v.form.data.password.onesymbol"
        class="error">Symbol is required.</div>

      <div
        v-if="!$v.form.data.password.onenumber"
        class="error">A number is required.</div>

      <button
        :disabled="form.submitStatus === 'PENDING'"
        class="button"
        type="submit">Submit!</button>
      <p
        v-if="form.submitStatus === 'OK'"
        class="typo__p">Thanks for your submission!</p>
      <p
        v-if="form.submitStatus === 'ERROR'"
        class="typo__p">Please fill the form correctly.</p>
      <p
        v-if="form.submitStatus === 'DUPLICATE'"
        class="typo__p">Account already exists.</p>
      <p
        v-if="form.submitStatus === 'PENDING'"
        class="typo__p">Sending...</p>
    </form>

  </div>
</template>

<script>
// import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required, minLength, helpers } from 'vuelidate/lib/validators'

const field_validate = function (astr, test) {
  let rc = false
  if(astr.length === 0){ // suppress warnings when field is blank
    rc = true
  } else {
    rc = test.test(astr)
  }
  return rc
}
const goodemail = function (astr) {
  let email_regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  return field_validate(astr, email_regex)
}
const onecap = function (astr) {
  let test = /[A-Z]/
  return field_validate(astr, test)
}
const onelowercase = function (astr) {
  let test = /[a-z]/
  return field_validate(astr, test)
}
const onesymbol = function (astr) {
  let test = /\W/
  return field_validate(astr, test)
}
const onenumber = function (astr) {
  let test = /[0-9]/
  return field_validate(astr, test)
}
export default {
  data() {
    return {
      form: {
        tmp: {},
        data: {
          email: "del_me" + (Math.random()).toString() + "@del.com",
          password: 'aA1!aaaa'
        },
        submitStatus: null
      },

      page: {
        title: 'Account',
        subtitle: 'A little about you.'
      },
      payload: {
        email: process.env.GUEST_USER,
        password: process.env.GUEST_PW
      },
      headers: {
          "Content-Type": 'application/json; charset=utf-8',
          "Accept": "application/json; charset=utf-8",
          "User-Agent": 'Mozilla/5.0',
          "X-DreamFactory-Api-Key": process.env.DF_API_KEY,
          "X-DreamFactory-Session-Token": null
      },
      options: {
        rejectUnauthorized: false,
        host: process.env.DF_HOST,
        port: process.env.DF_PORT,
        ssl_port: 443,
        path: 'reset based on use',
        method: 'POST',
        responseType: 'json'
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    form: {
      data: {
        email: {
          required,
          goodemail,
          minLength: minLength(7)
        },
        password: {
          required,
          onecap,
          onelowercase,
          onesymbol,
          onenumber,
          minLength: minLength(8)
        }
      }
    }
  },
  computed: {
    add_user_params: function() {

      return [
          { "name": "email_", "value": this.form.data.email },
          { "name": "password_", "value": this.form.data.password }
        ]

/*
      return {"params": [
          { "name": "email_", "value": this.form.data.email },
          { "name": "password_", "value": this.form.data.password }
        ],
        "returns": "string"
      }
*/
    },
    store: function () {
      return this.$store.state
    },
    guest_session_token: function () {
      return this.$store.state.guest_session_token
    },
    isAuthenticated: function () {
      return this.$store.getters.isAuthenticated
    },
    getUserName: function () {
      return this.$store.getters.getUserName
    },
    /*
    guestOptions: function () {
      this.options.path = '/api/v2/user/session'
      return {
        rejectUnauthorized: false,
        dataType: 'json',
        url: 'http://'
          + this.options.host
          + ':'
          + this.options.port
          + this.options.path,
        port: this.options.ssl_port,
        method: this.options.method,
        data: this.payload,
        headers: this.headers
      }
    },
    */
    /*
    newAccountOptions: function () {
      this.options.path = '/api/v2/adopt_a_drain/_func/add_user'
      return {
        rejectUnauthorized: false,
        dataType: 'json',
        url: 'http://'
          + this.options.host
          + ':'
          + this.options.port
          + this.options.path,
        port: this.options.ssl_port,
        method: this.options.method,
        headers: this.headers,
        data: {
            "resource": [ this.form.data ],
            "params": [
              { "name":"email_","value": this.form.data.email },
              { "name":"password_","value": this.form.data.password }
            ],
            "returns": "string"
        },
      }
    }*/
  },
  methods: {
    field_validate: function (astr, test) {
      // let test = /[0-9]/
      let rc = false
      if(astr.length === 0){
        rc = true // this is not correct but works...suppresses message
      } else {
        rc = test.test(astr)
      }
      return rc
    },

    requestify: function(lyr, lyrData) {
      /*
       * the guest login doesn't require a lyr = {}
      */
      //console.log('requestify 1')
      let rest_request = {
        rejectUnauthorized: false,
        dataType: 'json',
        port: 433,
        method: 'POST',
        url: null,
        headers: null,
        data: {},
      }

    //  console.log('requestify 2')
      try {
        if(lyr.source.type==='dreamfactory') {
          //console.log('requestify 2.1')
          // HEADERS
          let headers = {
            "Content-Type": 'application/json; charset=utf-8',
            "Accept": "application/json; charset=utf-8",
            "User-Agent": 'Mozilla/5.0',
            "X-DreamFactory-Api-Key": process.env.DF_API_KEY
          }

          //console.log('requestify 2.1')
          //  "X-DreamFactory-Session-Token": null
          // ADD-User TO DB
          if(lyr.type === 'func'){
              console.log('requestify 2.2.1')

              rest_request.url=lyr.source.connector.url_tmpl
                .replace('%h',process.env.DF_HOST)
                .replace('%p',process.env.DF_PORT)
                console.log('requestify 2.2.2')
            // Data
            if(lyrData.data){
              console.log('requestify 2.2.3')
              console.log('lyrData.data: ' + lyrData.data)
              rest_request.data = {resource: [ lyrData.data ] }
              //rest_equest.data['xxxresource']=lyrData.data
            }

            if(lyrData.params){
              console.log('requestify 2.2.4')
              console.log('requestify 2.2.4.1 params: ' + JSON.stringify(lyrData.params))

              rest_request.data['params']=lyrData.params
            }

            if(lyr.name === 'add-user'){
              console.log('requestify 2.2.5')
              rest_request.data['returns']="string"
            }
            console.log('requestify 2.2.6')
            rest_request.headers = headers
            rest_request.headers['X-DreamFactory-Session-Token']=lyrData.sessionToken
            console.log('requestify 2.2.7')
          }

          // GUEST SIGNIN
          if(lyr.type==='user-session'){
            //console.log('requestify 2.1.1')
            // HEADERS
            rest_request.headers=headers
            //console.log('requestify 2.1.2')
            // URL
            rest_request.url=lyr.source.connector.url_tmpl
              .replace('%h',process.env.DF_HOST)
              .replace('%p',process.env.DF_PORT)
            //console.log('requestify 2.1.3')
            // DATA
            rest_request.data['email']= ' '
            rest_request.data['password']= ' '
            rest_request.data.email = lyr.data_tmpl.email.replace('%e',process.env.GUEST_USER)
            rest_request.data.password = lyr.data_tmpl.password.replace('%p',process.env.GUEST_PW)
            //console.log('requestify 2.1.4')
            //df_request['data']['password'] = lyr['password'].replace('%e',process.env.GUEST_PW)
          }
        }
        if(! rest_request.url ){
          throw new Error('requestify is missing url')
        }
        if(! rest_request.headers ){
          throw new Error('requestify is missing headers')
        }
        if(! rest_request.data ){
          throw new Error('requestify is missing data')
        }
      }catch(err){
        // console.log('ERROR $restify A: ' + JSON.stringify(lyr))
        // console.log('ERROR $restify B:' + JSON.stringify(lyrData))
        //console.log('-----')
        console.error('ERROR requestify:' + err)

        //show_object(df_request)
      }
      //show_object(df_request)
      //console.log('resttify out: ' + JSON.stringify( df_request ))
      //console.log('requestify out')

      return rest_request
    },
    submit: function () {
console.log('submit 1')
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.form.submitStatus = 'ERROR'
      } else {
        // do your submit logic here
        this.form.submitStatus = 'PENDING'
        //console.log('submit 2 this.guestOptions: ' + this.guestOptions)
        // LOGIN as GUEST
        // console.log('this.guestOptions: ' + JSON.stringify(this.guestOptions))
        // console.log('--')
        let guest_tmpl = this.$getLayerTemplate('guest')
        let user_session_request = this.requestify( guest_tmpl )
        this.$axios( user_session_request )
          .then((response) => {


            let add_user_tmpl = this.$getLayerTemplate('add-user')
            let add_user_data = {
              sessionToken: response.data.session_token,
              data: this.form.data,
              params: this.add_user_params
            }
            let add_user_request = this.requestify( add_user_tmpl, add_user_data)

            this.$axios( add_user_request )
              .then((response) => {
                console.log('submit 2.1.1 success')
                let rc = JSON.parse(response.data)
                switch ( rc.id ) {
                  case -23505:
                    this.form.submitStatus = 'DUPLICATE'
                    break
                  default:
                    this.form.submitStatus = 'OK'
                    this.$store.commit('set_user', rc)
                }
              })
              .catch((response) => {
                console.log("page submit err2")
                this.form.submitStatus = 'ERROR'
              })

              
          })

          .catch((response) => {
            console.log("page submit err1 " + response)
            this.form.submitStatus = 'ERROR'
          })
      }
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;
}
</style>
