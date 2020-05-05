<template>
  <v-row justify="center" align="center">
    <v-col v-for="i in items" :key="i.title" cols="12" sm="8" md="6">
      <v-btn block class="auto-height pb-5" color="primary" :to="i.to" nuxt exact>
        <v-icon size="200" v-text="i.icon" /><br />
        <div>{{ i.title }}</div>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      allItems: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'About',
          to: '/about'
        },
        {
          icon: 'mdi-map',
          title: 'Maps',
          to: '/maps/',
          perm: 'VIEW_MAPS'
        },
        {
          icon: 'mdi-account-supervisor',
          title: 'Users',
          to: '/users',
          perm: 'VIEW_USERS'
        }
      ]
    }
  },
  computed: {
    items() {
      return this.allItems.filter((i) => (i.perm ? this.$store.getters['auth/hasPermission'](i.perm) : true))
    }
  },
  head() {
    return {
      title: 'Home'
    }
  }
}
</script>
<style lang="scss">
.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined).auto-height {
  height: auto;
}

.auto-height .v-btn__content {
  flex-direction: column;
}
</style>
