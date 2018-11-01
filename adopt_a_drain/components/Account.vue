<template>
  <div class="band">
    <!-- Banner / -->
    <h1 class="title">
      {{ account.title }}
    </h1>
    <h2 class="subtitle">
      {{ account.subtitle }}
    </h2>
    <div v-if="!authorized">
      <h1>Create Account</h1>
    </div>
    <div v-if="authorized">
      <h1>Your Account</h1>
    </div>

    <form @submit.prevent="submit">
      <div class="form-group" :class="{ 'form-group--error': $v.form.name.$error }">
        <label class="form__label">Name</label>
        <input class="form__input" v-model.trim="$v.form.name.$model"/>
      </div>
      <div class="error" v-if="!$v.form.name.required">Name is required</div>
      <div class="error" v-if="!$v.form.name.minLength">Name must have at least {{$v.form.name.$params.minLength.min}} letters.</div>

      <div class="form-group" :class="{ 'form-group--error': $v.form.password.$error }">
        <label class="form__label">Password</label>
        <input class="form__input" v-model.trim="$v.form.password.$model"/>
      </div>
      <div class="error" v-if="!$v.form.password.required">Password is required</div>
      <div class="error" v-if="!$v.form.password.minLength">Password must have at least {{$v.form.password.$params.minLength.min}} letters.</div>
      <div class="error" v-if="!$v.form.password.caps">Password must have at least 1 capital letter.</div>
      <div class="error" v-if="!hasLowercase(form.password)">Password must have at least 1 lowercase letter.</div>

      <div class="error" v-if="!hasSymbol(form.password)">Password must have at least 1 symbol.</div>
      <div class="error" v-if="!hasNumber(form.password)">Password must have at least 1 number.</div>

      <button class="button" type="submit" :disabled="form.submitStatus === 'PENDING'">Submit!</button>
      <p class="typo__p" v-if="form.submitStatus === 'OK'">Thanks for your submission!</p>
      <p class="typo__p" v-if="form.submitStatus === 'ERROR'">Please fill the form correctly.</p>
      <p class="typo__p" v-if="form.submitStatus === 'PENDING'">Sending...</p>
    </form>

  </div>
</template>

<script>

import { validationMixin } from 'vuelidate'
import { required, minLength , helpers } from 'vuelidate/lib/validators'
const caps = helpers.regex('caps',/[A-Z]/)

export default {
  data() {
    return {
      form: {
        name: '',
        password: '',
        submitStatus: null
      },
      account: {
        title: 'Account',
        subtitle: 'A little about you.'
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(4)
      },
      password: {
        required,
        minLength: minLength(8)
      }
    }
  },
  methods: {
    submit() {
      console.log('submit!')
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        // do your submit logic here
        this.submitStatus = 'PENDING'
        setTimeout(() => {
          this.submitStatus = 'OK'
        }, 500)
      }
    },
    hasLowercase: function (astr) {
      // [a-z]
      let test = /[a-z]/
      return test.test(astr)
    },
    hasSymbol: function (astr) {
      // [!@#$%^&*()_+=-|?.,]
      let test = /\W/
      return test.test(astr)
    },
    hasNumber: function (astr) {
      // [0-9]
      let test = /[0-9]/
      return test.test(astr)
    },

  },
  computed: {
    authorized: function () {
      if ( !this.$store.state.authenticated ){ return false }
      return true
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;

}
</style>
