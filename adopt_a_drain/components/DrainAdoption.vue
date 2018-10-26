<template>

  <div v-if="authorized">
    <!-- Banner / -->
    <h1 class="title">
      {{ adopt.title }}
    </h1>

    <h2 class="subtitle">
      {{ adopt.subtitle }}
    </h2>

    <GmapMap ref="mapRef"
      @dragend="doDragEnd()"
      v-bind:center="adopt.center"
      v-bind:map-type-id="adopt.map_type_id"
      v-bind:zoom=adopt.zoom
      style="height: 550px"
    >
      <GmapMarker
        ref="mapMarker"
        :key="index"
        v-for="(m, index) in adopt.markers"
          :animation="m.animation"

          :position="m.position"

          :draggable="m.draggable"
          :clickable="m.clickable"

          @click="center=m.position"
      />

    </GmapMap>

  </div>

</template>

<script>

// import Banner from '@/components/Banner.vue'
import {gmapApi} from '~/node_modules/vue2-google-maps/src/main'

import World from '@/components/World.vue'
export default {
  /* components: {
    Banner
  },
  */
  data() {
    return {
      adopt: {
        randy: 'X',
        title: 'Adoption',
        subtitle: 'Find a drain near you and adopt it.',
          map_type_id: 'terrain',
          center: { lat: 42.9634, lng: -85.6681 },
          zoom: 16,
          zoomMax: 10,
          zoomMin: 18,
          disableDoubleClickZoom: false,
          keyboardShortcuts: false,
          mapTypeControl: false,
          panControl: false,
          rotateControl: false,
          scaleControl: false,
          streetViewControl: true,
          zoomControl: true,

        markers: [],
        // map.getBounds() doesn't inialize in time to load this...had to hand code it
        center_box: {"south":42.95463738503886,"west":-85.69627392349241,"north":42.971910162437084,"east":-85.63666451034544},
        dx: 0.0,
        dy: 0.0
      }
    }
  },
  methods: {
    boundary_box: function () {
      return JSON.stringify(this.$refs.mapRef.$mapObject.getBounds())
    },
    loadDims () {
      this.adopt.center_box = JSON.stringify(this.$refs.mapRef.$mapObject.getBounds())
    },
    doDragEnd () {
      /*
      Objective:
      * Avoid downloading all drains at one time. Gives the illusion of a fast UI
      * Have data appear as user pans around screen
      Strategy: Use a boundary rectangle as a filter for download of drain
      */

      this.adopt.center = this.$refs.mapRef.$mapObject.getCenter()

      this.adopt.center_box.north = this.adopt.center.lat() + this.adopt.dy
      this.adopt.center_box.south  = this.adopt.center.lat() - this.adopt.dy
      this.adopt.center_box.west  = this.adopt.center.lng() - this.adopt.dx
      this.adopt.center_box.east  = this.adopt.center.lng() + this.adopt.dx

      this.loadDrains()
    },
    /*addDrain: function (drain) {

        Objective: add marker to list without duplcation
        Strategy: check new drains against all drains in markers to prevent dups
        improvement: do query with a NOT IN [] clause, check dataworld api


      let fd = true
      let drn_i = 0
      for(drn_i in this.adopt.markers){
        if(drain.id === this.adopt.markers[drn_i].id){
           // mark drain for adding
           fd = false
        }
      }
      if(fd){
        // add drain
        this.adopt.markers.push(drain)
      }
    },*/

    loadDrains: function () {
      /*
      Objective: Keep from downloading all the drains at one time
      Strategy:
      * Limit the number of drains with a rectangle in middle of map screen
      * only download when panning
      * cache already downloaded drains
      */
      let resp = ''

      let query_str = "select * from grb_drains where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n) %d"
        .replace('%w',this.adopt.center_box.west)
        .replace('%e',this.adopt.center_box.east)
        .replace('%n',this.adopt.center_box.north)
        .replace('%s',this.adopt.center_box.south)
        .replace('%d',this.getDownloadedDrains())

      console.log('q= ' + query_str)

      this.$axios({
        method: 'post',
        url: process.env.OPEN_SOURCE,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.DW_AUTH_TOKEN
        },
        data: { query: query_str, includeTableSchema: false }
        //data: { query: "select * from grb_drains LIMIT 10", includeTableSchema: false }
      })
        .then((response) => {
          let dr = {}
          for( dr in response.data) {
            let lt = response.data[dr].dr_lat
            let ln = response.data[dr].dr_lon
            let sync_id = response.data[dr].dr_sync_id
            let marker = new google.maps.Marker({
              id: sync_id,

              position: { lat: lt, lng: ln },

              draggable: false,
              clickable: true,
              animation: google.maps.Animation.DROP
              /*icon: '~/assets/markers/tosewer.png',*/
              //shadow: '~/assets/markers/shadow.png'
            })
            this.adopt.markers.push(marker)
            // this.addDrain(marker)
            //this.addDrain({ id: sync_id, position: { lat: lt, lng: ln } })
          }
        })
        .catch((response) => {console.log("error" + JSON.stringify(response))})
    },
    getDownloadedDrains: function () {
      let lst = ''
      let i = 0
      for(i in this.adopt.markers){
        if( lst.length > 0){
          lst += ", "
        }
        lst += '"' + this.adopt.markers[i].id + '"'
      }
      if(lst.length == 0 ){
        return " "
      }
      return "and dr_sync_id NOT IN (%d)".replace("%d", lst)
    }
  },
  computed: {
    authorized: function () {
      if ( !this.$store.state.authenticated ){ return false }
      return true
    }
  },
  mounted () {

    // At this point, the child GmapMap has been mounted, but
    // its map has not been initialized.
    // Therefore we need to write mapRef.$mapPromise.then(() => ...)
    this.$refs.mapRef.$mapPromise.then((map) => {
      map.panTo({ lat: 42.9634, lng: -85.6681 })
      this.adopt.randy = 'Y'
      this.adopt.center = map.getCenter()
    })

    this.adopt.center_box = {"south":42.96232044414465,"west":-85.67127841768263,"north":42.96447953691185,"east":-85.66492158231733}
    this.adopt.dy = Math.abs(this.adopt.center_box.north - this.adopt.center_box.south) / 3.0
    this.adopt.dx = Math.abs(this.adopt.center_box.west - this.adopt.center_box.east) / 3.0

    this.loadDrains()
  }
}
</script>
