<template>
  <section class="container" id="sign_in">
    <Authenticate />
  </section>
</template>

<script>

import Authenticate from '@/components/DFSignIn.vue'
export default {
  components: {
    Authenticate
  },
  computed: {
    authorized: function () {
      if ( !this.$store.state.authenticated ){ return false }
      return true
    }
  }
}
</script>
