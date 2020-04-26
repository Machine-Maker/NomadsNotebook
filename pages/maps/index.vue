<template>
  <div>
    <fetch-header />
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
        <data-dialog ref="newDialog" action="New" type="Map" @refresh="$fetch()">
          <map-form :parent="this" ref-name="newDialog" />
        </data-dialog>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon small fab elevation="4" class="info ml-2 mr-n1" v-on="on" @click.stop="$fetch()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Refresh</span>
        </v-tooltip>
      </v-toolbar>
      <v-container>
        <v-data-iterator :items="maps">
          <template v-slot:default="props">
            <v-row justify="center">
              <v-col v-for="item in props.items" :key="item.id" cols="12" sm="6" md="4" lg="3">
                <v-card color="secondary lighten-1" max-width="266">
                  <v-toolbar text color="primary">
                    <v-toolbar-title class="ellipsis-block" v-text="item.name" />
                    <v-spacer />
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn small text icon color="error" v-on="on" @click.stop="del(item)">
                          <v-icon>mdi-delete-forever</v-icon>
                        </v-btn>
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn small text icon color="accent lighten-2" v-on="on" @click="edit(item)">
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
      <data-dialog ref="editDialog" action="Edit" type="Map" :external-button="true" @refresh="$fetch()">
        <map-form v-bind="selectedMap" :parent="this" ref-name="editDialog" />
      </data-dialog>
    </v-card>
  </div>
</template>
<script>
import DataDialog from '@/components/data/DataDialog'
import MapForm from '@/components/data/maps/Form'
import FetchHeader from '@/components/FetchHeader'

export default {
  middleware: ['map'],
  components: {
    'data-dialog': DataDialog,
    'map-form': MapForm,
    'fetch-header': FetchHeader
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
      this.$refs.editDialog.dialog = true
    },
    del(map) {
      if (!map.id) return console.error(`${map.id} is not a valid Map ID`)
      this.$confirm(`Do you really want to delete "${map.name}"?`, {
        buttonTrueText: 'Delete',
        buttonFalseText: 'Cancel'
      })
        .then((value) => {
          if (value) {
            this.$api.delete(`/maps/${map.id}`).then(({ status }) => {
              if (status === 204) console.log(`No map found with ID: ${map.id}`)
              this.$refs.newDialog.success(`Successfully deleted ${map.name}`)
            })
          }
        })
        .catch(({ response: { data, status } }) => {
          if (status === 404) this.parent.$refs[this.refName].error(new Error('404 Not Found'), '404 Not Found')
          else this.parent.$refs[this.refName].error(data.err || data, `${data.type}: ${data.msg}`)
        })
    },
    refresh() {
      this.$fetch()
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
<style lang="scss" scoped>
.v-btn--icon.v-size--small {
  height: 36px;
  width: 36px;
}
</style>
