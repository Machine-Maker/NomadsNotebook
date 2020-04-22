<template>
  <div>
    <div id="map-wrap" style="height: calc(100vh - 36px - 64px - 12px - 12px); width: 100%; z-index: 0">
      <client-only>
        <l-map ref="map" :options="options" :crs="options.crs" :center="options.center" @zoomend="zoomEnd">
          <l-image-overlay url="/maps/3Canyons.png" :bounds="bounds" />
        </l-map>
      </client-only>
    </div>
  </div>
</template>
<script>
const isBrowser = typeof window !== 'undefined'
let L = null
if (isBrowser) L = require('leaflet')

export default {
  middleware: ['map'],
  data() {
    return {
      bounds: [
        [0, 0],
        [2000, 2000]
      ],
      options: {
        maxBounds: [
          [-500, -500],
          [2500, 2500]
        ],
        maxBoundsViscosity: 1,
        center: [1000, 1000],
        crs: null,
        minZoom: -1.5,
        maxZoom: 1.8,
        zoom: -1.5,
        zoomSnap: 0
      }
    }
  },
  beforeMount() {
    this.options.crs = L.CRS.Simple
  },
  methods: {
    zoomEnd(event) {
      console.log(`Zoom: ${event.target._zoom}`)
    }
  }
}
</script>
