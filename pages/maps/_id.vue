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
        <v-col v-if="$store.state.auth.loggedIn && hasPermission('EDIT_MAP')" class="shrink">
          <v-btn :color="marker.visible ? 'error' : 'success'" @click="marker.visible = !marker.visible">
            <v-icon left v-text="marker.visible ? 'mdi-cancel' : 'mdi-plus'" />
            {{ marker.visible ? 'Cancel' : 'Add Location' }}
          </v-btn>
        </v-col>
        <v-col v-if="$store.state.auth.loggedIn && hasPermission('EDIT_MAP')" class="shrink">
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
              <l-popup class="no-borders">
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
            <location-marker
              v-for="l in locationsFiltered"
              :key="l.id"
              v-bind="l"
              :dialog="$refs.editLocationDialog"
              :selected-marker.sync="selectedMarker"
              @open="edit"
              @delete="del"
            />
          </l-map>
        </div>
      </client-only>
    </v-card>
    <data-dialog ref="editLocationDialog" action="Edit" type="Location" external-button @refresh="$fetch()">
      <template v-slot:default="props">
        <location-form v-bind="{ ...props, ...selectedMarker }" :tab="0" />
      </template>
    </data-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import DataDialog from '@/components/data/DataDialog'
import MapForm from '@/components/data/maps/Form'
import LocationForm from '@/components/data/locations/Form'
import FetchHeader from '@/components/FetchHeader'
import LocationMarker from '@/components/markers/LocationMarker'

const isBrowser = typeof window !== 'undefined'
let L = null
if (isBrowser) L = require('leaflet')

export default {
  middleware: ['map'],
  components: {
    'data-dialog': DataDialog,
    'map-form': MapForm,
    'location-form': LocationForm,
    'fetch-header': FetchHeader,
    'location-marker': LocationMarker
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
      },
      selectedMarker: null
    }
  },
  computed: {
    locationsFiltered() {
      return this.locations.filter((l) => (this.locationFilter ? l.material === this.locationFilter : true))
    },
    ...mapGetters({
      hasPermission: 'auth/hasPermission'
    })
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
    },
    edit(id) {
      this.selectedMarker = this.locations.find((l) => l.id === id)
      if (!this.selectedMarker) {
        return console.error(`Invalid ID: ${id}`)
      }
      this.$refs.editLocationDialog.dialog = true
    },
    del(id) {
      this.$confirm('Do you really want to delete this location?', {
        buttonTrueText: 'Delete',
        buttonFalseText: 'Cancel'
      }).then((value) => {
        if (value) {
          this.$api
            .delete(`/locations/quality/${id}`)
            .then(({ status }) => {
              if (status === 204) console.log(`No location found with ID: ${id}`)
              this.$refs.editDialog.success('Successfully deleted location')
            })
            .catch(({ response: { data, status } }) => {
              if (status === 404) this.$refs.editDialog.error(new Error('404 Not Found'), '404 Not Found')
              else if (status === 401) this.$refs.editDialog.error(new Error('401 Unauthorized'), 'Unauthorized')
              else this.$refs.editDialog.error(data.err || data, `${data.type}: ${data.msg}`)
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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

.v-btn--icon.v-size--small {
  height: 36px;
  width: 36px;
}
.v-toolbar__title {
  white-space: unset;
  line-height: 1;
}
</style>
