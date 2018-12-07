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
import { restTemplates } from './mixins/rest-templates.js'

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
      // think about attaching these to layers
      marker_type: { // this.marker_type.available.icon
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
      
    }
  },
  mixins: [restTemplates],
  methods: {

    doZoomChange() {
      /*
      Objective: load drains as zoom changes
      Strategy: intercept the zoom_changed event to initiat doZoomChanged
      */
      console.log('doZoomChange 1')
      this.adopt.center = this.$refs.mapRef.$mapObject.getCenter()

      let json_ = JSON.stringify(this.$refs.mapRef.$mapObject.getBounds())
      let tmp = JSON.parse(json_)

      this.adopt.center_box.north = tmp.north
      this.adopt.center_box.south  = tmp.south
      this.adopt.center_box.west  = tmp.west
      this.adopt.center_box.east  = tmp.east

      try {
        this.loadLayers()
      } catch(err){
        console.error('Error doZoomChange ' + err)
      }
    },
    doDragEnd () {
      console.log('doDragEnd 1')
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

      try {
        this.loadLayers()
      } catch(err){
        console.error('Error doDragEnd ' + err)
      }
    },

    responseHandler: function (lyr,response){
      /*
      Objective:
      * Keep all response code in same place for easy comparison
      Strategy:
      * Use a handler pattern
      * Use a key value to indicate which response to process
      */
      //console.log('responseHandler: 1' )
      ///////
      /// DATA.WORLD
      ////////
      if(lyr.source.name === 'data.world'){
        //console.log('responseHandler: 2')
        let dr = {}

        for( dr in response.data) {
          //if(dr > 4){break}
          //console.log('responseHandler: 4')
          //console.log('dr: ' + response.data[dr])
          let lt = response.data[dr].dr_lat
          let ln = response.data[dr].dr_lon
          let sync_id = response.data[dr].dr_sync_id
          //console.log('responseHandler: 5')
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
          //console.log('responseHandler: 6')
        }
        //console.log('responseHandler: 7')
      }
      if(lyr.source.name === 'dreamfactory'){
        console.log('responseHandler: 2 ')
      }
      //console.log('responseHandler: out' )
    },
    loadLayer: function (lyr) {

      //console.log('loadLayer: 1')
      //console.log('loadLayer: 1 ' + lyr)
      if(lyr.viewtangle){ // devloper configured a center view port
        //console.log('loadLayer: 1.1 viewtangle')
        // set a view port for the query
        lyr.viewtangle = JSON.parse(JSON.stringify(this.adopt.center_box))
        //console.log('loadLayer: 1.2')
      }else{
        throw Error('loadLayer unable to find viewtangle')
        //console.log('loadLayer: no viewtangle')
      }
      //console.log('loadLayer 2')

      let loadlayer_request = this.requestify(lyr)
      this.$axios(loadlayer_request)
        .then((response) => {

          this.responseHandler(lyr, response)

        })
        .catch((response) => {
          console.log("loadLayer error" + JSON.stringify(response))
        })

    },
    loadLayers: function () {
      //console.log('loadLayers 1')

      let lyrNo = {}
      for(lyrNo in this.layers){

        if(lyrNo > 0){break}

        ////console.log('loadLayers 2')
        if(!this.layers[lyrNo]){
          // console.log('this.layers[lyrNo]: ' +this.layers[lyrNo])
          // console.log('layer undefined')
          throw new Error('loadLayers found undefined layer at index ' + lyrNo)
        }
        // get the data
        this.loadLayer(this.layers[lyrNo])
      }
      //console.log('loadLayers: out')
    },
    getDownloadedDrains: function () {
      //console.log('getDownloadedDrains 1')
      let lst = ''
      let i = 0
      for(i in this.adopt.markers){
        if( lst.length > 0){
          lst += ", "
        }
        lst += "'" + this.adopt.markers[i].id + "'"
      }
      if(lst.length == 0 ){
        //console.log('getDownloadedDrains early out')
        return " "
      }
      //console.log('getDownloadedDrains: 2' + "and dr_sync_id NOT IN (%d)".replace("%d", lst))
      //console.log('getDownloadedDrains out')
      return "and dr_sync_id NOT IN (%d)".replace("%d", lst)
    }

  },

  computed: {
    authorized: function () {
      if ( !this.$store.state.authenticated ){ return false }
      return true
    },
    layers: function () { return [ // map layers... think about adding extra layer attributes
        this.getRestTemplate('available'),
        this.getRestTemplate('adopted')
      ]
    }
  },

  mounted () {
    //console.log('mounting 1')
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
      try {
        //console.log('mounted this.getRestTemplate(\'available\')' + JSON.stringify(this.getRestTemplate('available')))
        this.loadLayers()
      } catch(err){
        console.error('Error mounted ' + err)
      }
    })
    .catch((map) => {
      console.log("map error: " + JSON.stringify(map))
    })
    // this.loadDrains()
    // this.loadLayers()
    //console.log('mounting out')
  }
}
</script>
