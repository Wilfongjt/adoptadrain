<template>
  <div class="band">
    <Banner />
    <h1 class="title">
      {{ about.title }}
    </h1>
    <h2 class="subtitle">
      {{ about.subtitle }}
    </h2>

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
      about: {
        title: 'About',
        subtitle: 'We are concerned citizens.'
      }
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;

}
</style>
