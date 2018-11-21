<template>
  <section class="container" id="account">

    <!-- Guest /-->
    <Account />
  </section>
</template>

<script>

import Account from '@/components/DFAccountNew.vue'

export default {
  components: {
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
