<template>
  <div class="band">
    <Banner />
    <h1 class="title">
      {{ authenticate.title }}
    </h1>
    <h2 class="subtitle">
      {{ authenticate.subtitle }}
    </h2>
    <div v-if="authorized">
      Authorize
      <button @click="$store.commit('set_authenticated', false)">{{ $store.state.authenticated }}</button>

    </div
    <div v-else>
      <h1>Temporary sign in </h1>
      <button @click="$store.commit('set_authenticated',true)">Sign In</button>

    </div>
  </div>
</template>

<script>
import Banner from "@/components/Banner.vue"

export default {
  components: {
    Banner
  },
  data() {
    return {
      authenticate: {
        title: 'Authenticate',
        subtitle: 'Because.'
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
