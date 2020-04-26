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
</template>
<script>
export default {
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
    parent: {
      type: Object,
      default: null
    },
    refName: {
      type: String,
      default: null,
      validate: (v) => !!v
    }
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
  mounted() {
    this.parent.$refs[this.refName].$on('submit', this.submit)
    this.parent.$refs[this.refName].$on('reset', this.reset)
    this.parent.$refs[this.refName].$on('create', this.create)
    this.reset(false)
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
    },
    _onError({ response: { data, status } }) {
      if (status === 404) this.parent.$refs[this.refName].error(new Error('404 Not Found'), '404 Not Found')
      else this.parent.$refs[this.refName].error(data.err || data, `${data.type}: ${data.msg}`)
    }
  }
}
</script>
