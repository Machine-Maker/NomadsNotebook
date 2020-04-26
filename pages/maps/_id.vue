<template>
  <div>
    <fetch-header />
    <v-card v-if="!$fetchState.pending">
      <v-toolbar color="secondary" text>
        <v-tooltip bottom z-index="1000">
          <template v-slot:activator="{ on: hover }">
            <v-btn color="light-green darken-2" to="/maps" exact nuxt class="mr-3" v-on="hover">
              <v-icon left>mdi-arrow-left</v-icon>
              Maps
            </v-btn>
          </template>
          <span>Back to all maps</span>
        </v-tooltip>

        <v-toolbar-title :class="{ 'font-italic': !map.name }">
          {{ map.name || 'Unnamed' }}
          <span :class="`info-bg difficulty ${map.difficulty.toLowerCase()}`">{{ map.difficulty }}</span>
          <span class="info-bg region">{{ map.region }}</span>
        </v-toolbar-title>
        <v-spacer />
        <data-dialog ref="editDialog" action="Edit" type="Map" @refresh="$fetch">
          <map-form v-bind="map" :parent="this" ref-name="editDialog" />
        </data-dialog>
      </v-toolbar>
      <div id="map-wrap" style="height: calc(100vh - 36px - 64px - 12px - 12px - 64px); width: 100%; z-index: 0">
        <client-only>
          <l-map ref="map" :options="options" :crs="options.crs" :center="options.center" @zoomend="zoomEnd">
            <l-image-overlay :url="`/maps/${map.type}.png`" :bounds="bounds" />
          </l-map>
        </client-only>
      </div>
    </v-card>
  </div>
</template>
<script>
import DataDialog from '@/components/data/DataDialog'
import MapForm from '@/components/data/maps/Form'
import FetchHeader from '@/components/FetchHeader'

const isBrowser = typeof window !== 'undefined'
let L = null
if (isBrowser) L = require('leaflet')

export default {
  middleware: ['map'],
  components: {
    'data-dialog': DataDialog,
    'map-form': MapForm,
    'fetch-header': FetchHeader
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async fetch() {
    const { data, status } = await this.$api.get(`/maps/${this.$route.params.id}`)
    if (status === 204) {
      this.$nuxt.context.error({
        message: 'Invalid map ID',
        statusCode: 400
      })
    } else if (status === 200) {
      this.map = data
    }
  },
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
      },
      map: null
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
<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

#map-wrap {
  padding: 0;
}

.info-bg {
  background-color: map-get($grey, darken-4);
  padding: 0 4px;
  border-radius: 3px;
  font-size: 70%;
}

.difficulty {
  &.hard {
    color: map-get($red, base);
  }

  &.medium {
    color: map-get($orange, lighten-1);
  }
}
</style>
