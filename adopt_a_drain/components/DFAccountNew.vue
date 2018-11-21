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
        data: {
          email: '',
          password: ''
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
    newAccountOptions: function () {
      this.options.path = '/api/v2/adopt_a_thing_development/_func/add_user'
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
    submit: function () {

      this.$v.$touch()
      if (this.$v.$invalid) {
        this.form.submitStatus = 'ERROR'
      } else {
        // do your submit logic here
        this.form.submitStatus = 'PENDING'

        this.$axios( this.guestOptions )
          .then((response) => {
            this.headers['X-DreamFactory-Session-Token']=response.data.session_token

            this.$axios( this.newAccountOptions )
              .then((response) => {
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
