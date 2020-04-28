<template>
  <v-dialog v-model="dialog" persistent max-width="700px" transition="dialog-transition" style="z-index: 2000">
    <template v-if="!externalButton" v-slot:activator="{ on: openDialog }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            :fab="!$vuetify.breakpoint.lgAndUp"
            :icon="!$vuetify.breakpoint.lgAndUp"
            :color="$vuetify.breakpoint.lgAndUp ? 'primary' : 'white'"
            :class="{ primary: !$vuetify.breakpoint.lgAndUp }"
            :small="!$vuetify.breakpoint.lgAndUp"
            elevation="4"
            v-on="{ ...openDialog, ...tooltip }"
          >
            <v-icon v-if="action === 'Edit'" :left="$vuetify.breakpoint.lgAndUp">mdi-pencil</v-icon>
            <v-icon v-else-if="action === 'New'" :left="$vuetify.breakpoint.lgAndUp">mdi-plus</v-icon>
            <template v-if="$vuetify.breakpoint.lgAndUp">
              <span v-if="action === 'Edit'">Edit</span>
              <span v-else>Add {{ type }}</span>
            </template>
          </v-btn>
        </template>
        <span>{{ action }} {{ type }}</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-toolbar color="secondary">
        <template v-if="tabs.length" v-slot:extension>
          <v-tabs v-model="tabSelect" fixed-tabs>
            <v-tab v-for="tab in tabs" :key="tab" v-text="tab" />
          </v-tabs>
        </template>

        <v-toolbar-title :class="{ 'font-italic': !type }">{{ action }} {{ type || 'Unamed' }}</v-toolbar-title>
        <v-spacer />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="action === 'Edit'"
              icon
              color="success"
              :disabled="!form"
              :loading="loading"
              v-on="on"
              @click.stop="submit"
            >
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn v-else icon color="success" :disabled="!form" :loading="loading" v-on="on" @click.stop="create">
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </template>
          <span v-if="action === 'Edit'">Submit Changes</span>
          <span v-else>Create</span>
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
        <slot :tab="tabSelect" />
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    action: {
      type: String,
      default: 'New',
      validator: (value) => value === 'Edit' || value === 'New'
    },
    type: {
      type: String,
      default: null
    },
    tabs: {
      type: Array,
      default: () => []
    },
    externalButton: Boolean
  },
  data() {
    return {
      form: false,
      loading: false,
      dialog: false,
      tabSelect: null
    }
  },
  watch: {
    dialog(newVal, oldVal) {
      if (newVal) {
        this.$emit('reset', false)
      } else this.$emit('reset', true)
    }
  },
  methods: {
    submit() {
      this.loading = true
      this.$emit('submit')
    },
    create() {
      this.loading = true
      this.$emit('create')
    },
    success(msg) {
      this.loading = false
      this.$store.commit('snackbar/success', msg)
      setTimeout(
        () => {
          this.$emit('refresh')
          this.dialog = false
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
<style lang="scss" scoped>
.v-btn--icon.v-size--small {
  height: 36px;
  width: 36px;
}
</style>
