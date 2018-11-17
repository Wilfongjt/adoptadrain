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
      <h1>Temporary Sign In</h1>
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
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    form: {
      data: {
        email: {
          required,
          minLength: minLength(7)
        },
        password: {
          required,
          minLength: minLength(8)
        }
      }
    }
  },
  computed: {
    isAuthenticated: function () {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    submit(){
      console.log("login 1")
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log("login 1 error")
        this.form.submitStatus = 'ERROR'
      } else {
        console.log("login 2")
        this.form.submitStatus = 'PENDING'
        /*
        sign in code goes here
        */

        this.form.submitStatus = 'OK'
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
