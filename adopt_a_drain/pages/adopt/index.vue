<template>
  <section class="section-map" id="adopt">
    <Authenticate v-if="!authorized"/>
    <DrainAdoption v-if="authorized" />
  </section>
</template>

<script>
import DrainAdoption from '@/components/DWDrainAdoption.vue'
import Authenticate from '@/components/DFSignIn.vue'
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
