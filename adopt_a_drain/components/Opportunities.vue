<template>
  <div class="band">
    <!-- Banner / -->
    <h1 class="title">
      {{ opportunities.title }}
    </h1>
    <h2 class="subtitle">
      {{ opportunities.subtitle }}
    </h2>

    <!-- custom stuff -->
    <div class="description">{{ opportunities.details.description }}</div>
    <div class="subtitle">{{ opportunities.details.item.title }}</div>
    <ul>
      <li v-for="item in opportunities.details.item.list">{{ item.description }}</li>
    </ul>
  </div>
</template>

<script>
// import Banner from "@/components/Banner.vue"

export default {
  /* components: {
    Banner
  }, */
  data() {
    return {
      opportunities: {
        title: 'Opportunities',
        subtitle: 'We care about what you want to do.',
        details: {
          description: 'Are you a programmer with Nuxtjs experience who wants to help improve and maintain the Adopt a Drain application? Dont be shy! We are always seeking assistance with the code! Get involved and follow our GitHub page.',
          item: {
            title: 'Always looking for: ',
            list: [
              { title: 'x', description: 'Beginners and Experts' },
              { title: 'x', description: 'Coders' },
              { title: 'x', description: 'Domain Experts' },
              { title: 'x', description: 'Designers' },
              { title: 'x', description: 'Developers' },
              { title: 'x', description: 'Hackers' },
              { title: 'x', description: 'Speakers' },
              { title: 'x', description: 'Teachers' },
              { title: 'x', description: 'Testers' },
              { title: 'x', description: 'Writers' }
            ]
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;
}

ul {
  /* list-style: none; */
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow:row wrap;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0px 10px 0px 20px;
}
</style>
