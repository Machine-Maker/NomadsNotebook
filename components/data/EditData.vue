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
        <span>Edit {{ type }}</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-toolbar color="secondary">
        <v-toolbar-title :class="{ 'font-italic': !type }">Editing {{ type || 'Unamed' }}</v-toolbar-title>
        <v-spacer />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon color="success" :disabled="!form" :loading="loading" v-on="on" @click.stop="submit">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </template>
          <span>Submit Changes</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon color="warning" v-on="on" @click.stop="$emit('reset', false)">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Reset</span>
        </v-tooltip>
        <v-btn icon color="error" @click.stop="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="form" v-model="form">
        <slot />
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: null
    },
    firstInput: {
      type: Object,
      default: null
    },
    externalButton: Boolean
  },
  data() {
    return {
      form: false,
      loading: false,
      dialog: false
    }
  },
  watch: {
    dialog(newVal, oldVal) {
      if (newVal) {
        this.$emit('reset', false)
        if (this.firstInput) {
          this.$nextTick(() => {
            this.firstInput.focus()
          }, this)
        }
      } else this.$emit('reset', true)
    }
  },
  methods: {
    submit() {
      this.loading = true
      this.$emit('submit')
    },
    success(msg) {
      this.loading = false
      this.$store.commit('snackbar/success', msg)
      setTimeout(
        () => {
          this.dialog = false
          this.$router.go()
        },
        500,
        this
      )
    },
    error(err, msg) {
      console.error(err)
      this.loading = false
      this.$store.commit('snackbar/error', msg)
    }
  }
}
</script>
