<template>
  <section class="container">
    <!-- Banner / -->
    <Account />

  </section>
</template>

<script>

import Account from '@/components/Account.vue'
// import Banner from "@/components/Banner.vue"
export default {
  components: {
    /* Banner, */
    Account
  },
  computed: {
    authorized: function () {
      if ( !this.$store.state.authenticated ){ return false }
      return true
    }
  }
}
</script>
