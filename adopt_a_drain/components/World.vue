<template>
  <div class="band">
    <Banner />
    <h1 class="title">
      {{ dataworld.title }}
    </h1>
    <h2 class="subtitle">
      {{ dataworld.subtitle }}
    </h2>


    <div v-for="drain in dataworld.markers">{{drain}}</div>
  </div>
</template>

<script>
import Banner from "@/components/Banner.vue"
import axios from 'axios'
export default {
  components: {
    Banner
  },
  data() {
    return {
      dataworld: {
        title: 'Data World ',
        subtitle: 'Share.',
        markers: []
      }
    }
  },
  methods: {
    getDataWorld: function () {
      let resp = ''

      this.$axios({
        method: 'post',
        url: process.env.OPEN_SOURCE,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.DW_AUTH_TOKEN
        },
        data: { query: "select * from grb_drains LIMIT 10", includeTableSchema: false }
      })
        .then((response) => {
          // console.log(JSON.stringify(response.data))
          let dr = {}
          for( dr in response.data) {
            console.log("json: " + JSON.stringify(response.data[dr]))
            let lt = response.data[dr].dr_lat
            let ln = response.data[dr].dr_lon
            let sync_id = response.data[dr].dr_sync_id
            this.dataworld.markers.push({ id: sync_id, position: { lat: lt, lng: ln } })
          }
        })
        .catch((response) => {console.log("error" + JSON.stringify(response))})

      return 'done'
    }
  },
  mounted () {
    // At this point, the child GmapMap has been mounted, but
    // its map has not been initialized.
    // Therefore we need to write mapRef.$mapPromise.then(() => ...)

    this.getDataWorld()
  }
}
</script>

<style scoped>
.band {
  width: 100%;

}
</style>
