<template>
  <div class="band">
    <Banner />
    <h1 class="title">
      {{ title }}
    </h1>
    <h2 class="subtitle">
      {{ subtitle }}
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
      title: 'Stats',
      subtitle: 'How much do we care?'
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;
  /*background-color: #ffffff;*/
}
</style>
