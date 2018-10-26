<template>
  <section class="section-map">
    <Authenticate v-if="!authorized"/>
    <!-- MapAdopt v-if="authorized" / -->
    <DrainAdoption v-if="authorized" />
  </section>
</template>

<script>
// import MapAdopt from '@/components/MapAdopt.vue'
import DrainAdoption from '@/components/DrainAdoption.vue'
import Authenticate from '@/components/Authenticate.vue'
export default {
  components: {
    DrainAdoption,
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

<style scoped>

.section-map {
  min-height: 50vh;
  /*display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  */
  text-align: center;

}

</style>
