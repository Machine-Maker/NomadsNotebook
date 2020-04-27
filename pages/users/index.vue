<template>
  <div>
    <fetch-header type="user" />
    <v-card v-if="!$fetchState.error && !$fetchState.pending">
      <v-toolbar color="secondary" text>
        <v-text-field
          v-model="search"
          class="mr-2"
          label="Search Users"
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
        />
        <data-dialog
          v-if="$store.state.auth.loggedIn && hasPermission('ADD_USER')"
          ref="newDialog"
          action="New"
          type="User"
          @refresh="$fetch()"
        >
          <user-form :parent="this" ref-name="newDialog" />
        </data-dialog>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon small fab elevation="4" class="info ml-2 mr-n1" v-on="on" @click.stop="$fetch()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Refresh</span>
        </v-tooltip>
      </v-toolbar>
      <v-container>
        <v-data-iterator :items="users">
          <template v-slot:default="props">
            <v-row justify="center">
              <v-col v-for="item in props.items" :key="item.snowflake" cols="12" xl="2" lg="3" md="4" sm="6">
                <v-card color="secondary lighten-1 pa-1">
                  <v-toolbar text color="primary">
                    <v-toolbar-title v-if="item.username" class="ellipsis-block">
                      {{ item.username }}<span style="font-size: 70%;">#{{ item.discriminator }}</span>
                    </v-toolbar-title>
                    <v-toolbar-title v-else class="font-italic subtitle-2 ellipsis-block pr-1"
                      >User has not logged in yet</v-toolbar-title
                    >
                    <v-spacer />
                    <v-tooltip v-if="$store.state.auth.loggedIn && hasPermission('DELETE_USER')" bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn small icon class="error mr-n1" v-on="on" @click.stop="del(item)">
                          <v-icon>mdi-delete-forever</v-icon>
                        </v-btn>
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
                  </v-toolbar>
                  <v-img
                    v-if="item.avatar"
                    class="mx-auto"
                    :src="`https://cdn.discordapp.com/avatars/${item.snowflake}/${item.avatar}.jpg?size=256`"
                  />
                  <v-img v-else class="mx-auto" src="/user_default.png" />
                  <v-card-actions
                    v-if="$store.state.auth.loggedIn && hasPermission('EDIT_USER')"
                    class="justify-space-around"
                  >
                    <v-btn color="accent lighten-1" @click="edit(item)">
                      <v-icon left>mdi-pencil</v-icon>
                      Edit
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-container>
      <data-dialog ref="editDialog" action="Edit" type="Map" :external-button="true" @refresh="$fetch()">
        <user-form v-bind="selectedUser" :parent="this" ref-name="editDialog" />
      </data-dialog>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import FetchHeader from '@/components/FetchHeader'
import DataDialog from '@/components/data/DataDialog'
import UserForm from '@/components/data/users/Form'

export default {
  middleware: ['user'],
  components: {
    'fetch-header': FetchHeader,
    'data-dialog': DataDialog,
    'user-form': UserForm
  },
  async fetch() {
    const { data } = await this.$api.get('/users')
    this.users = []
    for (const user of data.results) {
      this.users.push({
        ...user,
        permissions: this.computePerms(parseInt(user.permissions, 2))
      })
    }
  },
  data() {
    return {
      users: [],
      search: '',
      selectedUser: null
    }
  },
  computed: {
    ...mapGetters({
      hasPermission: 'auth/hasPermission'
    })
  },
  methods: {
    edit(user) {
      this.selectedUser = user
      this.$refs.editDialog.dialog = true
    },
    del(user) {
      console.log(this.$refs)
      if (!user.snowflake) return console.error(`${user.snowflake} is not a valid User ID`)
      this.$confirm(`Do you really want to delete ${user.username}?`, {
        buttonTrueText: 'Delete',
        buttonFalseText: 'Cancel'
      }).then((value) => {
        if (value) {
          this.$api
            .delete(`/users/${user.snowflake}`)
            .then(({ status }) => {
              if (status === 204) console.log(`No user found with snowflake: ${user.snowflake}`)
              this.$refs.editDialog.success(`Successfully deleted ${user.username}`)
            })
            .catch(({ response: { data, status } }) => {
              if (status === 404) this.$refs.editDialog.error(new Error('404 Not Found'), 'Endpoint Not Found')
              else if (status === 401) this.$refs.editDialog.error(new Error('401 Unauthorized'), 'Unauthorized')
              else this.$refs.editDialog.error(data.err || data, `${data.type}: ${data.msg}`)
            })
        }
      })
    },
    computePerms(bitfield) {
      const userPerms = []
      for (const perm of this.$store.state.permissions) {
        if (bitfield & perm.value) userPerms.push(perm.perm)
      }
      return userPerms
    }
  }
}
</script>
