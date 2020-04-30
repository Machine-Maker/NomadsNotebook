<template>
  <v-container>
    <v-tabs-items v-model="tab">
      <v-tab-item key="Quality">
        <v-row justify="center">
          <v-col cols="12" md="6">
            <v-select
              v-model="qualityForm.material"
              :items="$store.state.materials"
              item-text="name"
              item-value="name"
              label="Material"
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="qualityForm.quality" label="Max Quality" :rules="[rules.required, rules.quality]" />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="latLng" readonly label="Location" />
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
import formMixin from '@/components/mixins/form'

export default {
  mixins: [formMixin],
  props: {
    tab: {
      type: Number,
      default: null
    },
    map_id: {
      type: Number,
      default: null,
      validate: (v) => !!v
    },
    material: {
      type: String,
      default: null
    },
    quality: {
      type: Number,
      default: null
    },
    location: {
      type: [Object],
      default: null
    }
  },
  data() {
    return {
      model: null,
      qualityForm: {
        map_id: null,
        material: null,
        quality: null,
        location: null
      }
    }
  },
  computed: {
    latLng: {
      get() {
        return `${this.location.lat}, ${this.location.lng}`
      },
      set(val) {
        this.qualityForm.location = val
      }
    }
  },
  methods: {
    create() {
      if (this.tab === 0) {
        this.$api
          .post('/locations/quality', {
            ...this.qualityForm,
            location: `${this.qualityForm.location.lat}, ${this.qualityForm.location.lng}`
          })
          .then(({ data }) => {
            this.parentRef.success(`Successfully add a location`)
          })
          .catch(this._onError)
      }
    },
    reset(toNull = false) {
      this.$nextTick(() => {
        this.qualityForm.map_id = toNull ? null : this.map_id
        this.qualityForm.material = toNull ? null : this.material
        this.qualityForm.quality = toNull ? null : this.quality
        this.qualityForm.location = this.location
      })
    }
  }
}
</script>
