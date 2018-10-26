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
  </div>
</template>

<script>
// import Banner from "@/components/Banner.vue"

export default {
  /* components: {
    Banner
  },
  */
  data() {
    return {
      account: {
        title: 'Account',
        subtitle: 'A little about you.'
      }
    }
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
