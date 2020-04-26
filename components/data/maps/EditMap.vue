<template>
  <edit-data ref="editMap" type="Map" @submit="submit" @reset="reset">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-text-field
            ref="nameInput"
            v-model.trim="formData.name"
            filled
            label="Name"
            autofocus
            required
            :rules="rules"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="formData.type"
            :items="$store.state.mapTypes"
            item-text="desc"
            item-value="type"
            filled
            label="Type"
            required
            :rules="rules"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="formData.region"
            :items="$store.state.regions"
            item-text="fullRegion"
            item-value="region"
            filled
            label="Region"
            required
            :rules="rules"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>
  </edit-data>
</template>
<script>
import EditData from '@/components/data/EditData'

export default {
  components: {
    'edit-data': EditData
  },
  props: {
    name: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    region: {
      type: String,
      default: null
    },
    id: {
      type: Number,
      default: null
    },
    externalButton: Boolean
  },
  data() {
    return {
      formData: {
        name: null,
        region: null,
        type: null
      },
      rules: [(v) => !!v || 'This field is required']
    }
  },
  methods: {
    open() {
      this.$refs.editMap.dialog = true
    },
    submit() {
      if (!this.id) return console.error(`${this.id} is not a valid map ID. Report to Machine Maker.`)
      this.$api
        .put(`/maps/${this.id}`, this.formData)
        .then(({ data }) => {
          this.$refs.editMap.success(`Successfully updated ${data.name}`)
        })
        .catch(({ response: { data } }) => {
          this.$refs.editMap.error(data.err || data, `${data.type}: ${data.msg}`)
        })
    },
    reset(toNull = false) {
      this.formData.name = toNull ? null : this.name
      this.formData.type = toNull ? null : this.type
      this.formData.region = toNull ? null : this.region
    }
  }
}
</script>
