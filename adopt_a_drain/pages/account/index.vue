<template>
  <section class="container" id="account">
    <!-- Banner / -->
    <DFGuest />
    <DFAccount />
  </section>
</template>

<script>
import DFGuest from '@/components/DFGuest.vue'
import DFAccount from '@/components/DFAccount.vue'

export default {
  components: {
    DFGuest,
    DFAccount
  },
  computed: {
    authorized: function () {
      if ( !this.$store.state.authenticated ){ return false }
      return true
    }
  }
}
</script>
