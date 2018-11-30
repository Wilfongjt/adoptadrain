<template>

  <div v-if="authorized" >
    <!-- Banner / -->
    <h1 class="title">
      {{ adopt.title }}
    </h1>

    <h2 class="subtitle">
      {{ adopt.subtitle }}
    </h2>

    <GmapMap ref="mapRef"
      @dragend="doDragEnd()"
      @zoom_changed="doZoomChange()"
      v-bind:center="adopt.center"
      v-bind:map-type-id="adopt.map_type_id"
      v-bind:zoom="adopt.zoom"
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
          :icon="{ url: require('assets/markers/tosewer.png')}"
      />

    </GmapMap>

  </div>

</template>

<script>

import {gmapApi} from '~/node_modules/vue2-google-maps/src/main'

import World from '@/components/World.vue'
export default {

  data() {
    return {
      adopt: {
        title: 'Adoption',
        subtitle: 'Find a drain near you and adopt it.',
        map_type_id: 'terrain',
        center: { lat: 42.9634, lng: -85.6681 },
        zoom: 18,
        zoomMax: 10,
        zoomMin: 20,
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
        // unfortunately, this means app has to open at same place everytime
        center_box:  { "south": 42.96229110492215, "west": -85.67236663627625, "north": 42.964450198718986, "east": -85.66582204627991 },
        dx: 0.0,
        dy: 0.0
      },
      marker_type: {
         adopted: {
           icon: "{ url: require('assets/markers/adopted.png')}"
         },
         available: {
           icon: "{ url: require('assets/markers/tosewer.png')}"
         },
         adoptedbyyou: {
           icon: "{ url: require('assets/markers/adoptedbyyou.png')}"
         }
      },
      layers: [
        {
          name: "available",
          description: "all drains within the screen i.e. viewtangle",
          viewtangle: {},
          source: {
            name: "data.world",
            connector: {
              service_service: process.env.OPEN_SOURCE,
              query_tmpl: "select * from grb_drains where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n) %d"
            }
          }
        },
        {
          name: "adopted",
          description: "all adopted and adopted by you drains within the viewtangle",
          viewtangle: {},
          source: {
            name: "dreamfactory",
            connector: {
              service_url: process.env.DF_SOURCE + "/api/v2/adopt_a_drain/_func/",
              // query_tmpl: "select * from things where (user_id isNot NULL and user_id > 0) and (lon > %w and lon < %e) and (lat > %s and lat < %n) %d"
              func_tmpl: "get_adopted(%w, %e, %n, %s, %v)"
            }
          }
        }
      ]
    }
  },
  methods: {

    doZoomChange() {
      /*
      Objective: load drains as zoom changes
      Strategy: intercept the zoom_changed event to initiat doZoomChanged
      */
      console.log('doZoomChange')
      this.adopt.center = this.$refs.mapRef.$mapObject.getCenter()

      let json_ = JSON.stringify(this.$refs.mapRef.$mapObject.getBounds())
      let tmp = JSON.parse(json_)

      this.adopt.center_box.north = tmp.north
      this.adopt.center_box.south  = tmp.south
      this.adopt.center_box.west  = tmp.west
      this.adopt.center_box.east  = tmp.east

      this.loadLayers()
    },
    doDragEnd () {
      /*
      Objective:
      * Avoid downloading all drains at one time. Gives the illusion of a fast UI
      * Have data appear as user pans around screen
      Strategy: Use a boundary rectangle as a filter for download of drain
      intercept the dragend event to initate doDragEnd function
      */

      this.adopt.center = this.$refs.mapRef.$mapObject.getCenter()

      let json_ = JSON.stringify(this.$refs.mapRef.$mapObject.getBounds())
      let tmp = JSON.parse(json_)

      this.adopt.center_box.north = tmp.north
      this.adopt.center_box.south  = tmp.south
      this.adopt.center_box.west  = tmp.west
      this.adopt.center_box.east  = tmp.east

      this.loadLayers()
    },

    restify: function (lyr) {
      /*
        Objective: Keep all the rest call configurations in one spot for easy comparison
        Strategy:
        * Use a handler pattern
        * Use a key value to indicate which service to call
      */
      console.log('restify')
      let rest = {}
      // All services
      // exclude drains already downloaded
      let query_str = lyr.source.connector.query_tmpl
        .replace('%w',this.adopt.center_box.west)
        .replace('%e',this.adopt.center_box.east)
        .replace('%n',this.adopt.center_box.north)
        .replace('%s',this.adopt.center_box.south)
        .replace('%d',this.getDownloadedDrains())
      // DATA.WORLD
      if(lyr.source.name === "data.world"){
        rest = {
          method: 'post',
          url: lyr.service_url,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.DW_AUTH_TOKEN
          },
          data: { query: query_str, includeTableSchema: false }
        }
      }
      // dreamfactory load things
      if(lyr.source.name === 'dreamfactory'){
        console.log('restify dreamfactory')
        // exclude drains already downloaded
        rest = {
          method: 'post',
          rejectUnauthorized: false,
          dataType: 'json',
          url: lyr.service_url,
          port: 433,
          headers: {
            "Content-Type": 'application/json; charset=utf-8',
            "Accept": "application/json; charset=utf-8",
            "User-Agent": 'Mozilla/5.0',
            "X-DreamFactory-Api-Key": process.env.DF_API_KEY
          },
          data: {}

        }
      }
      return rest
    },
    responseHandler: function (lyr,response){
      /*
      Objective:
      * Keep all response code in same place for easy comparison
      Strategy:
      * Use a handler pattern
      * Use a key value to indicate which response to process
      */
      console.log('responseHandler: ' )
      ///////
      /// DATA.WORLD
      ////////
      if(lyr.source.name === 'data.world'){
        // console.log('responseHandler data.world')
        let dr = {}
        var iconBase = this.marker_url //'https://maps.google.com/mapfiles/kml/shapes/';
        //console.log('XXXXX Data Found')
        for( dr in response.data) {
          let lt = response.data[dr].dr_lat
          let ln = response.data[dr].dr_lon
          let sync_id = response.data[dr].dr_sync_id

          let marker = new google.maps.Marker({
            id: sync_id,
            position: { lat: lt, lng: ln },
            draggable: false,
            clickable: true,
            animation: google.maps.Animation.DROP,
            icon: this.marker_type.adopted.icon
            //shadow: '~/assets/markers/shadow.png'
          })
          this.adopt.markers.push(marker)
        }
      }
      if(lyr.source.name === 'dreamfactory'){
        console.log('responseHandler dreamfactory')
      }
    },
    loadLayer: function (lyr) {
      console.log('loadLayer')
      if(lyr.viewtangle){ // devloper configured a center view port
        // set a view port for the query
        lyr.viewtangle = JSON.parse(JSON.stringify(this.adopt.center_box))
      }
      this.$axios(this.restify(lyr))
        .then((response) => {
          this.responseHandler(lyr, response)
        })
        .catch((response) => {
          console.log("error" + JSON.stringify(response))
        })
    },
    loadLayers: function () {
      console.log('loadLayers')

      let lyrNo = {}
      for(lyrNo in this.layers){
        // get the data
        this.loadLayer(this.layers[lyrNo])
      }
    },
    getDownloadedDrains: function () {
      console.log('getDownloadedDrains')
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
    console.log('mounting 1')
    // At this point, the child GmapMap has been mounted, but
    // its map has not been initialized.
    // Therefore we need to write mapRef.$mapPromise.then(() => ...)
    this.$refs.mapRef.$mapPromise
    .then((map) => {
      this.$refs.mapRef.$mapObject.panTo({ lat: 42.9634, lng: -85.6681 })

      this.adopt.center = this.$refs.mapRef.$mapObject.getCenter()

      let json_ = JSON.stringify(this.$refs.mapRef.$mapObject.getBounds())

      if(json_ === undefined){  // still waiting for google to init
        json_ = this.adopt.center_box
      } else {

        let tmp = JSON.parse(json_)

        this.adopt.center_box.north = tmp.north
        this.adopt.center_box.south  = tmp.south
        this.adopt.center_box.west  = tmp.west
        this.adopt.center_box.east  = tmp.east

      }

      this.loadLayers()
    })
    .catch((map) => {
      console.log("map error: " + JSON.stringify(map))
    })
    // this.loadDrains()
    // this.loadLayers()
  }
}
</script>
