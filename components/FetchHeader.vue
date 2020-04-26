<template>
  <div v-if="!!$parent.$fetchState">
    <v-alert type="error" :value="!!$parent.$fetchState.error" transition="slide-y-transition">
      {{ $parent.$fetchState.error ? $parent.$fetchState.error.message : 'Error' }}
    </v-alert>
    <v-alert type="info" :value="$parent.$fetchState.pending" transition="slide-y-transition">
      Fetching latest map data...
    </v-alert>
  </div>
</template>
