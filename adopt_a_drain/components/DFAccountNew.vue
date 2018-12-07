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
    <hr>
    <div> {{ guest_template }}</div>
    <hr>
    <div> {{ add_user_template }}</div>
    <hr>
    <div> {{ guest_template }}</div>
    <hr>
  </div>
</template>
<script>
// import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required, minLength, helpers } from 'vuelidate/lib/validators'
// import { hello } from './mixins/test_mixin.js'
import { restTemplates } from './mixins/rest-templates.js'
//import { requestify } from './mixins/requestify.js'
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
        tmp: {}, // ??
        data: {
          email: "del_me" + (Math.random()).toString() + "@del.com",
          password: 'aA1!aaaa'
        },
        submitStatus: null
      },
      page: {
        title: 'Account',
        subtitle: 'A little about you.'
      }
    }
  },

  mixins: [validationMixin, restTemplates],
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
    guest_template: function() { // mixin
      return this.getRestTemplate('guest')
    },
    new_system_user_template: function() { // mixin
      return this.getRestTemplate('new-system-user')
    },
    add_user_template: function() { // mixin
      return this.getRestTemplate('add-user')
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
      let sessionToken = null
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.form.submitStatus = 'ERROR'
      } else {
        // do your submit logic here
        this.form.submitStatus = 'PENDING'
        // LOGIN as GUEST

        //if(! this.$getLayerTemplate){
          //throw Error('this.$getLayerTemplate not in root')
        //}
        // this.$axios( this.$requestify( this.guest_template ) )
        this.$axios( this.requestify( this.guest_template ) )
          .then((response) => {
            sessionToken = response.data.session_token
            let new_system_user_tmpl = this.new_system_user_template
            let new_system_user_data = {
              sessionToken: sessionToken,
              data: this.form.data
            }
            // let new_system_user_request = this.$requestify( new_system_user_tmpl, new_system_user_data)
            let new_system_user_request = this.requestify( new_system_user_tmpl, new_system_user_data)

            /////////////////////

            this.$axios( new_system_user_request ) // add database user
              .then((response) => {
                //console.log('Made it')
                //let add_user_tmpl = this.$getLayerTemplate('add-user')
                let add_user_tmpl = this.add_user_template
                let add_user_data = {
                  sessionToken: sessionToken,
                  data: this.form.data,
                  params: [
                      { "name": "email_", "value": this.form.data.email },
                      { "name": "password_", "value": this.form.data.password }
                    ]
                }
                // let add_user_request = this.$requestify( add_user_tmpl, add_user_data)
                let add_user_request = this.requestify( add_user_tmpl, add_user_data)

                this.$axios( add_user_request )
                  .then((response) => {
                    //console.log('submit 2.1.1 success')

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
                    console.log("page submit err3")
                    this.form.submitStatus = 'ERROR'
                  })

              })
              .catch((response) => {
                console.log("page submit err2")
                this.form.submitStatus = 'ERROR'
              })
            ///////////////////
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
