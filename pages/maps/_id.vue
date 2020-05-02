<template>
  <div>
    <fetch-header type="map" />

    <v-card v-if="!$fetchState.pending">
      <v-toolbar color="secondary" text class="justify-end">
        <v-tooltip bottom>
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
        <v-col cols="3">
          <v-select
            v-model="locationFilter"
            label="Material Filter"
            prepend-icon="mdi-filter"
            hide-details
            max-width="150px"
            :items="$store.state.materials"
            item-text="name"
            item-value="name"
            clearable
          />
        </v-col>
        <v-col class="shrink">
          <v-btn :color="marker.visible ? 'error' : 'success'" @click="marker.visible = !marker.visible">
            <v-icon left v-text="marker.visible ? 'mdi-cancel' : 'mdi-plus'" />
            {{ marker.visible ? 'Cancel' : 'Add Location' }}
          </v-btn>
        </v-col>
        <v-col class="shrink">
          <client-only>
            <data-dialog ref="editDialog" action="Edit" type="Map" @refresh="$fetch()">
              <map-form v-bind="map" :parent="this" ref-name="editDialog" />
            </data-dialog>
          </client-only>
        </v-col>
        <v-col class="shrink">
          <v-btn icon small class="info" @click="$fetch()"><v-icon>mdi-refresh</v-icon></v-btn>
        </v-col>
      </v-toolbar>

      <client-only>
        <div id="map-wrap" style="height: calc(100vh - 36px - 64px - 12px - 12px - 64px); width: 100%; z-index: 0">
          <l-map
            ref="map"
            :options="options"
            :crs="options.crs"
            :center="options.center"
            style="z-index: 0"
            @zoomend="zoomEnd"
            @click="click"
          >
            <l-image-overlay :url="`/maps/${map.type}.png`" :bounds="bounds" />
            <l-marker ref="clickedMarker" :lat-lng.sync="marker.latLng" :visible="marker.visible" :draggable="true">
              <l-popup>
                <data-dialog
                  ref="newLocation"
                  action="New"
                  type="Location"
                  :tabs="['Quality', 'POI']"
                  @refresh="$fetch()"
                >
                  <template v-slot:default="props">
                    <location-form
                      v-bind="{ ...props, map_id: map.id }"
                      ref-name="newLocation"
                      :location="$refs.clickedMarker.latLng"
                    />
                  </template>
                </data-dialog>
              </l-popup>
            </l-marker>
            <l-marker
              v-for="location in locationsFiltered"
              :ref="`location-${location.id}`"
              :key="location.id"
              :lat-lng="location.location"
            >
              <l-popup class="location-info">
                <v-card width="200">
                  <v-btn
                    absolute
                    top
                    right
                    fab
                    x-small
                    color="error"
                    @click.stop="$refs[`location-${location.id}`][0].mapObject.closePopup()"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-card-text>
                    Location: {{ location.material }}<br />
                    Max Quality: {{ location.quality }}
                  </v-card-text>
                </v-card>
              </l-popup>
            </l-marker>
          </l-map>
        </div>
      </client-only>
    </v-card>
  </div>
</template>
<script>
import DataDialog from '@/components/data/DataDialog'
import MapForm from '@/components/data/maps/Form'
import LocationForm from '@/components/data/locations/Form'
import FetchHeader from '@/components/FetchHeader'

const isBrowser = typeof window !== 'undefined'
let L = null
if (isBrowser) L = require('leaflet')

export default {
  middleware: ['map'],
  components: {
    'data-dialog': DataDialog,
    'map-form': MapForm,
    'location-form': LocationForm,
    'fetch-header': FetchHeader
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  fetchOnServer: false,
  async fetch() {
    this.marker.visible = false
    const { data, status } = await this.$api.get(`/maps/${this.$route.params.id}`)
    if (status === 204) {
      this.$nuxt.context.error({
        message: 'Invalid map ID',
        statusCode: 400
      })
    } else if (status === 200) {
      this.map = data
    }
    this.locations = []
    const {
      data: { locations }
    } = await this.$api.get(`/maplocations/${this.$route.params.id}`)
    for (const loc of locations) {
      this.locations.push({
        ...loc,
        location: L.latLng(loc.location.split(', ')[0], loc.location.split(', ')[1])
      })
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
      map: null,
      locations: [],
      locationFilter: null,
      marker: {
        latLng: [0, 0],
        visible: false
      }
    }
  },
  computed: {
    locationsFiltered() {
      return this.locations.filter((l) => (this.locationFilter ? l.material === this.locationFilter : true))
    }
  },
  watch: {
    'marker.visible'(val, oldVal) {
      if (val) {
        this.marker.latLng = this.$refs.map.mapObject.getCenter()
      }
    }
  },
  beforeMount() {
    this.options.crs = L.CRS.Simple
  },
  methods: {
    zoomEnd(event) {
      console.log(`Zoom: ${event.target._zoom}`)
    },
    click(event) {
      if (this.marker.visible) {
        this.marker.latLng = event.latlng
      }
    }
  }
}
</script>
<style lang="scss">
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

.leaflet-popup {
  .leaflet-popup-content-wrapper {
    padding: 0;
    border-radius: 0;
    background: transparent;

    .leaflet-popup-content {
      margin: 0;
    }
  }

  .leaflet-popup-close-button {
    display: none;
  }
}
.v-btn--icon.v-size--small {
  height: 36px;
  width: 36px;
}
</style>
