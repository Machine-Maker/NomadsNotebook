<template>
  <v-container>
    <v-tabs-items v-model="tab">
      <v-tab-item key="Quality">
        <v-row justify="center">
          <v-col cols="6">
            <v-select :items="$store.state.materials" item-text="name" item-value="name" required label="Material" />
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item key="POI">
        POI
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
export default {
  props: {
    tab: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      model: null
    }
  }
}
</script>
