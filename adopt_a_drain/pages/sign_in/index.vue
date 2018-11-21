<template>
  <section class="container" id="sign_in">
    <!-- Guest /-->
    <Authenticate />

  </section>
</template>

<script>
// import Guest from '@/components/DFGuest.vue'
// import Authenticate from '@/components/DFSignIn.vue'
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
