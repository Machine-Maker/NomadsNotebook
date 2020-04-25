<template>
  <v-dialog v-model="dialog" persistent max-width="700px" transition="dialog-transition" style="z-index: 2000">
    <template v-if="!externalButton" v-slot:activator="{ on: openDialog }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn color="primary" v-on="{ ...openDialog, ...tooltip }">
            <v-icon left>mdi-pencil</v-icon>
            Edit
          </v-btn>
        </template>
        <span>Edit Map</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-toolbar color="secondary" text>
        <v-toolbar-title :class="{ 'font-italic': !name }">Editing {{ name || 'Unnamed' }} </v-toolbar-title>
        <v-spacer />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn color="success" icon :disabled="!form" :loading="loading" v-on="on" @click.stop="submit">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </template>
          <span>Submit Changes</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn color="warning" icon v-on="on" @click.stop="reset(false)">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Reset</span>
        </v-tooltip>
        <v-btn icon color="error" @click.stop="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-form ref="form" v-model="form">
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
      </v-form>
    </v-card>
  </v-dialog>
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
    externalButton: Boolean
  },
  data() {
    return {
      dialog: false,
      loading: false,
      form: false,
      formData: {
        name: null,
        region: null,
        type: null
      },
      rules: [(v) => !!v || 'This field is required'],
      types: [
        { text: 'Medium - 4 Canyons', value: '4Canyons' },
        { text: 'Medium - 3 Canyons', value: '3Canyons' },
        { text: 'Hard - Volcano', value: 'Volcano' }
      ]
    }
  },
  watch: {
    dialog(newVal, oldVal) {
      if (newVal) {
        this.reset()
        this.$nextTick(() => {
          this.$refs.nameInput.focus()
        }, this)
      } else {
        this.reset(true)
      }
    }
  },
  methods: {
    open() {
      this.dialog = true
    },
    close() {
      this.formData.name = null
      this.dialog = false
    },
    reset(toNull = false) {
      this.formData.name = toNull ? null : this.name
      this.formData.type = toNull ? null : this.type
      this.formData.region = toNull ? null : this.region
    },
    submit() {
      this.loading = true
      if (!this.id) return console.error(`${this.id} is not a valid map ID. Report to Machine Maker.`)
      this.$api
        .put(`/maps/${this.id}`, this.formData)
        .then(({ data }) => {
          this.$store.commit('snackbar/success', `Successfully updated ${data.name}`)

          setTimeout(
            () => {
              this.dialog = false
              this.$router.go()
            },
            500,
            this
          )
        })
        .catch(({ response: { data } }) => {
          console.error(data.err || data)
          this.$store.commit('snackbar/error', `${data.type}: ${data.msg}`)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
