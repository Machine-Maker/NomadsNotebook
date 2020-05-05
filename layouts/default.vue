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
      <v-toolbar-title v-text="title ? `${defTitle} - ${title}` : defTitle" />
      <v-spacer />
      <account-window />
    </v-app-bar>
    <loading-overlay :value="uLoading">
      Loading Account...
    </loading-overlay>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <snackbar />
    <v-footer fixed app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>
<script>
import { mapState } from 'vuex'

import Snackbar from '@/components/Snackbar'
import AccountWindow from '@/components/AccountWindow'
import LoadingOverlay from '@/components/LoadingOverlay'

export default {
  components: {
    snackbar: Snackbar,
    'account-window': AccountWindow,
    'loading-overlay': LoadingOverlay
  },
  data() {
    return {
      drawer: false,
      allItems: [
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
          to: '/maps/',
          perm: 'VIEW_MAPS'
        },
        {
          icon: 'mdi-account-supervisor',
          title: 'Users',
          to: '/users',
          perm: 'VIEW_USERS'
        }
      ],
      defTitle: "Nomad's Notebook"
    }
  },
  computed: {
    ...mapState({
      uLoading: (state) => state.loading.user,
      title: (state) => state.title
    }),
    items() {
      return this.allItems.filter((i) => (i.perm ? this.$store.getters['auth/hasPermission'](i.perm) : true))
    }
  },
  mounted() {
    this.$auth.verifyAuth()
  },
  methods: {
    login() {
      this.$auth.login()
    }
  }
}
</script>
