<template>
  <div class="band">
    <!-- Banner / -->
    <h1 class="title">
      {{ authenticate.title }}
    </h1>
    <h2 class="subtitle">
      {{ authenticate.subtitle }}
    </h2>
    <div v-if="isAuthenticated">
      <h1>Sign Out</h1>
      <button @click="$store.commit('set_user', false)">Sign Out</button>
    </div>
    <div v-if="!isAuthenticated">
      <h1>Temporary Sign In</h1>
      <button @click="$store.commit('set_authenticated',true)">Sign In</button>
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
      authenticate: {
        title: 'xAuthenticate',
        subtitle: 'Because.'
      }
    }
  },
  computed: {
    isAuthenticated: function () {
      return this.$store.getters.isAuthenticated
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;

}
</style>
