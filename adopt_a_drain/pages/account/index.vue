<template>
  <section class="container" id="account">
    
    <Guest />
    <Account />
  </section>
</template>

<script>
import Guest from '@/components/DFGuest.vue'
import Account from '@/components/DFAccount.vue'

export default {
  components: {
    Guest,
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
