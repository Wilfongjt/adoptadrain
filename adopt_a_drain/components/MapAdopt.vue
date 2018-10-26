<template>

  <div v-if="authorized">
    <Banner />
    !Use for google key confirmation!
    <h1 class="title">
      {{ adopt.title }}
    </h1>

    <h2 class="subtitle">
      {{ adopt.subtitle }}
    </h2>

    <gmap-map
      v-bind:center = "adopt.center"
      v-bind:zoom="10"
      style="height: 550px"
    >
      <gmap-marker
        v-for="(item, index) in adopt.markers"
        v-bind:key="index"
        v-bind:position="item.position"
        v-on:click="center=item.position"/>
    </gmap-map>

  </div>

</template>

<script>
/*
  MapAdopt is a placeholder for a map.
  Use it to test your google map key configuration
*/
import Banner from '@/components/Banner.vue'
export default {
  components: {
    Banner
  },
  data() {
    return {
      adopt: {
        title: 'Adopt',
        subtitle: 'Find a drain near you and adopt it.',
        center: { lat: 42.9634, lng: -85.6681 },
        markers: [
          { position: { lat: -0.48585, lng: 117.1466 } },
          { position: { lat: -6.21462, lng: 106.84513 } }
        ]
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
