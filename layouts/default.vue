<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact nuxt>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn v-if="loggedIn" color="warning" class="mr-2 accent--text" @click="$auth.logout">
        <v-icon left>mdi-power</v-icon>
        Logout
      </v-btn>
      <v-btn color="primary" :disabled="loggedIn" :loading="uLoading" @click="login">
        <v-icon left>mdi-account</v-icon>
        {{ loggedIn ? $store.state.auth.user.username : 'Login' }}
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <snackbar />
    <v-footer fixed app z-index="1000">
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>
<script>
import { mapState } from 'vuex'

import Snackbar from '@/components/Snackbar'

export default {
  components: {
    snackbar: Snackbar
  },
  data() {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        },
        {
          icon: 'mdi-map',
          title: 'Maps',
          to: '/maps'
        }
      ],
      title: "Nomad's Notebook"
    }
  },
  computed: {
    ...mapState({
      loggedIn: (state) => state.auth.loggedIn,
      username: (state) => state.auth.user.username,
      avatar: (state) => state.auth.user.avatar,
      uLoading: (state) => state.loading.user
    })
  },
  mounted() {
    this.$auth.verifyAuth()
  },
  methods: {
    login() {
      this.$store.commit('loading', { t: 'user', v: true })
      this.$auth.login()
    }
  }
}
</script>
