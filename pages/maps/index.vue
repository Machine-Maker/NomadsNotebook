<template>
  <div>
    <v-alert type="error" :value="!!$fetchState.error" transition="slide-y-transition">
      {{ $fetchState.error ? $fetchState.error.message : 'Error' }}
    </v-alert>
    <v-alert type="info" :value="$fetchState.pending" transition="slide-y-transition">
      Fetching latest map data...
    </v-alert>
    <!-- <v-card> -->
    <v-card v-if="!$fetchState.error && !$fetchState.pending">
      <v-toolbar color="secondary" text>
        <v-text-field
          v-model="search"
          class="mr-2"
          clearable
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search Maps"
        />
        <v-btn color="primary">
          <v-icon left>mdi-plus</v-icon>
          Add Map
        </v-btn>
      </v-toolbar>
      <v-container>
        <v-data-iterator :items="maps">
          <template v-slot:default="props">
            <v-row>
              <v-col v-for="item in props.items" :key="item.id" cols="12" sm="6" md="4" lg="3">
                <v-card color="secondary lighten-1" max-width="266">
                  <v-toolbar text color="primary">
                    <v-toolbar-title class="ellipsis-block" v-text="item.name" />
                    <v-spacer />
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn text icon color="accent" v-on="on" @click="edit(item)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span>Edit</span>
                    </v-tooltip>
                  </v-toolbar>
                  <v-img class="mx-auto my-2" height="250" width="250" :src="`/maps/small_${item.type}.png`" />
                  <v-card-actions class="justify-center">
                    <v-btn color="primary" :to="`/maps/${item.id}`" exact nuxt>View</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-container>
    </v-card>
    <edit-map ref="editDialog" v-bind="selectedMap" :external-button="true" />
  </div>
</template>
<script>
import EditMap from '@/components/EditMap'

export default {
  middleware: ['map'],
  components: {
    'edit-map': EditMap
  },
  async fetch() {
    const { data } = await this.$api.get('/maps')
    this.maps = data.results
  },
  data() {
    return {
      maps: [],
      search: '',
      selectedMap: null
    }
  },
  methods: {
    edit(map) {
      this.selectedMap = map
      this.$refs.editDialog.open()
    }
  },
  head() {
    return {
      title: 'Maps'
    }
  }
}
</script>
<style lang="scss">
.ellipsis-block {
  white-space: normal;
  max-height: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
