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
      <h1>Sign Out</h1>
      <button @click="$store.commit('set_user', false)">Sign Out</button>
    </div>

    <div v-if="!isAuthenticated">
      <h1>Sign In</h1>
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
        v-if="!$v.form.data.email.required"
        class="error">Email is required</div>

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

      <button
        :disabled="form.submitStatus === 'PENDING'"
        class="button"
        type="submit">Submit!</button>
      <p
        v-if="form.submitStatus === 'OK'"
        class="typo__p">Thanks for your submission!</p>
      <p
        v-if="form.submitStatus === 'ERROR'"
        class="typo__p">Email or password is incorrect.</p>

      <p
        v-if="form.submitStatus === 'PENDING'"
        class="typo__p">Sending...</p>
    </form>
    <div>
      guest session token: {{ guest_session_token }}
    </div>
  </div>
</template>

<script>
//import axios from 'axios'
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

export default {

  data() {
    return {
      form: {
        data: {
          email: '',
          password: ''
        },
        submitStatus: null
      },
      page: {
        title: 'Sign In',
        subtitle: 'Because.'
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
          required
        },
        password: {
          required
        }
      }
    }
  },
  computed: {
    store: function () {
      return this.$store.state
    },
    guest_session_token: function () {
      return this.$store.state.guest_session_token
    },
    isAuthenticated: function () {
      return this.$store.getters.isAuthenticated
    },
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
    signInOptions: function () {
      this.options.path = '/api/v2/adopt_a_drain/_func/sign_in'
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
        // WTF is this extra data?
        data: { resource: [ this.form.data ] },
        headers: this.headers,
        data: {
            "resource": [ this.form.data ],
            "params": [
              { "name":"email_","value":this.form.data.email },
              { "name":"password_","value": this.form.data.password }
            ],
            "returns": "string"
        },
      }
    }
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

    submit: function(){

      this.$v.$touch()
      if (this.$v.$invalid) {
        this.form.submitStatus = 'ERROR'
      } else {
        this.form.submitStatus = 'PENDING'

        this.$axios( this.guestOptions )
          .then((response) => {
            this.headers['X-DreamFactory-Session-Token']=response.data.session_token

            this.$axios( this.signInOptions )
              .then((response) => {
                let rc = JSON.parse(response.data)
                switch ( rc.id ) {
                  case -1:
                    this.form.submitStatus = 'NOTFOUND'
                    break
                  default:
                    this.form.submitStatus = 'OK'
                    this.$store.commit('set_user', rc)
                }
              })
              .catch((response) => {
                console.log("page submit err2")
                console.log("response: " + response)
                this.form.submitStatus = 'ERROR'
              })

          })
          .catch((response) => {
            console.log("page submit err1")
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
