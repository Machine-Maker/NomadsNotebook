<template>
  <l-marker ref="marker" :key="id" :lat-lng="location">
    <l-popup class="no-borders">
      <v-card width="200">
        <v-btn absolute top fab x-small color="error" style="right: -16px;" @click.stop="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn
          v-if="hasPermission('EDIT_MAP')"
          absolute
          bottom
          fab
          x-small
          color="accent"
          style="left: 4px;"
          @click.stop="$emit('open', id)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="hasPermission('EDIT_MAP')"
          absolute
          bottom
          fab
          x-small
          color="error"
          style="left: 40px;"
          @click.stop="$emit('delete', id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-card-text>
          Location: {{ material }}<br />
          Max Quality: {{ quality }}
        </v-card-text>
      </v-card>
    </l-popup>
  </l-marker>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    id: {
      type: Number,
      default: null,
      validate: (v) => !!v
    },
    location: {
      type: Object,
      default: null,
      validate: (v) => !!v
    },
    material: {
      type: String,
      default: null,
      validate: (v) => !!v
    },
    quality: {
      type: String,
      default: null,
      validate: (v) => !!v
    },
    dialog: {
      type: Object,
      default: () => {}
    },
    selectedMarker: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters({
      hasPermission: 'auth/hasPermission'
    })
  },
  methods: {
    close() {
      this.$refs.marker.mapObject.closePopup()
    }
  }
}
</script>
