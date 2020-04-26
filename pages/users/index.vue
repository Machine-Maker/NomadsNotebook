<template>
  <div>
    <fetch-header />
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
        <data-dialog ref="newDialog" action="New" type="User" @refresh="$fetch()">
          <user-form :parent="this" ref-name="newDialog" />
        </data-dialog>
      </v-toolbar>
    </v-card>
  </div>
</template>

<script>
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
    this.users = data.results
  },
  data() {
    return {
      users: [],
      search: ''
    }
  }
}
</script>
