<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-text-field v-model.number="id" type="number" label="Snowflake" autofocus required filled :readonly="!id" />
      </v-col>
      <v-col cols="12" md="6">
        <v-switch v-for="p in perms" :key="p.perm" v-model="formPerms" :value="p.perm">
          <template v-slot:label>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on" v-text="p.perm" />
              </template>
              <span v-text="p.desc" />
            </v-tooltip>
          </template>
        </v-switch>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import formMixin from '@/components/mixins/form'

export default {
  mixins: [formMixin],
  props: {
    id: {
      type: String,
      default: null
    },
    permissions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formPerms: []
    }
  },
  computed: {
    ...mapState({
      perms: (state) => state.permissions
    })
  },
  methods: {
    create() {
      if (!this.for) this.$api.post(`/users`)
    }
  }
}
</script>
