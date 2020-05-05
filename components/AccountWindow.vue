<template>
  <div>
    <client-only>
      <v-dialog v-if="loggedIn" v-model="dialog" max-width="300px" overlay-opacity="0.6">
        <template v-slot:activator="{ on: openDialog }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn v-if="loggedIn" x-large color="primary" class="px-3" v-on="{ ...openDialog, ...tooltip }">
                {{ username }}
                <v-avatar class="ml-2">
                  <v-img v-if="id && avatar" :src="`${avatarUrl}?size=128`" class="avatar-img" />
                </v-avatar>
              </v-btn>
            </template>
            <span>View Account</span>
          </v-tooltip>
        </template>
        <v-card>
          <v-card-title class="justify-center primary">
            Your Account
          </v-card-title>
          <v-img height="128" width="128" :src="`${avatarUrl}?size=128`" class="mx-auto mt-2 avatar-img" />
          <v-card-subtitle class="text-center pb-1" v-text="username" />
          <v-card-actions class="justify-center">
            <v-btn v-if="loggedIn" color="warning" class="grey--text text--darken-3" @click="logout">
              <v-icon left>
                mdi-logout
              </v-icon>
              Logout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn v-else color="primary" :loading="uLoading" @click="login">
        <v-icon left>
          mdi-account
        </v-icon>
        Login
      </v-btn>
    </client-only>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      dialog: false
    }
  },
  computed: {
    ...mapState({
      loggedIn: (state) => state.auth.loggedIn,
      avatar: (state) => state.auth.user.avatar,
      username: (state) => state.auth.user.username,
      id: (state) => state.auth.user.id,
      uLoading: (state) => state.loading.user
    }),
    avatarUrl() {
      return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.jpg`
    }
  },
  methods: {
    login() {
      this.$auth.login()
    },
    logout() {
      this.dialog = false
      this.$auth.logout()
    }
  }
}
</script>

<style lang="scss" scoped>
.v-avatar {
  cursor: pointer;
}
</style>
<style lang="scss">
.avatar-img > .v-image__image.v-image__image--cover {
  border-radius: 50%;
  border: 2px var(--v-primary-base) solid;
}
</style>
