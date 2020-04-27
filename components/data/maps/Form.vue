<template>
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
          :rules="[rules.required]"
        />
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
          :rules="[rules.required]"
        />
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
          :rules="[rules.required]"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import formMixin from '@/components/mixins/form'

export default {
  mixins: [formMixin],
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
    }
  },
  data() {
    return {
      formData: {
        name: null,
        region: null,
        type: null
      }
    }
  },
  methods: {
    create() {
      this.$api
        .post('/maps', this.formData)
        .then(({ data }) => {
          this.parent.$refs[this.refName].success(`Successfully created ${data.name}`)
        })
        .catch(this._onError)
    },
    submit() {
      if (!this.id) return console.error(`${this.id} is not a valid map ID. Report to Machine Maker.`)
      this.$api
        .put(`/maps/${this.id}`, this.formData)
        .then(({ data }) => {
          this.parent.$refs[this.refName].success(`Successfully updated ${data.name}`)
        })
        .catch(this._onError)
    },
    reset(toNull = false) {
      this.$nextTick(() => {
        this.formData.name = toNull ? null : this.name
        this.formData.type = toNull ? null : this.type
        this.formData.region = toNull ? null : this.region
        if (this.$refs.nameInput) this.$refs.nameInput.focus()
      }, this)
    }
  }
}
</script>
