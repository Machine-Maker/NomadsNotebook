<template>
  <div>
    <v-alert type="error" :value="!!$fetchState.error" transition="slide-y-transition">
      {{ $fetchState.error ? $fetchState.error.message : 'Error' }}
    </v-alert>
    <v-alert type="info" :value="$fetchState.pending" transition="slide-y-transition">
      Fetching latest map data...
    </v-alert>
    <v-card v-if="!$fetchState.error && !$fetchState.pending">
      <v-data-iterator :items="maps">
        <template v-slot:header>
          <v-toolbar color="secondary" flat>
            <v-toolbar-title>Maps</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:default="props">
          <v-row>
            <v-col v-for="item in props.items" :key="item.id" cols="12" sm="6" md="4" lg="3">
              {{ item.name }}
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
      {{ maps }}
    </v-card>
  </div>
</template>
<script>
export default {
  middleware: ['map'],
  async fetch() {
    const { data } = await this.$api.get('/maps')
    this.maps = data.results
  },
  data() {
    return {
      maps: []
    }
  }
}
</script>
