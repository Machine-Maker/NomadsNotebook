<template>
  <v-snackbar v-model="show" :color="color" top>
    <div>
      <v-icon v-if="icon" class="pr-3">{{ icon }}</v-icon>
      {{ message }}
    </div>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      show: false,
      message: ''
    }
  },
  computed: {
    ...mapState({
      color: (state) => state.snackbar.color,
      icon: (state) => state.snackbar.icon
    })
  },
  mounted() {
    this.$store.watch(
      (state) => state.snackbar.msg,
      () => {
        const msg = this.$store.state.snackbar.msg
        if (msg !== '') {
          this.show = true
          this.message = this.$store.state.snackbar.msg
          this.$store.commit('snackbar/reset')
        }
      }
    )
  }
}
</script>
