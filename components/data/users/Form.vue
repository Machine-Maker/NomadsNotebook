<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model.trim="formId"
          label="Snowflake"
          autofocus
          required
          filled
          :readonly="!!snowflake"
          :rules="[rules.required]"
        />
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
    snowflake: {
      type: String,
      default: null
    },
    permissions: {
      type: Array,
      default: () => ['USE_API']
    }
  },
  data() {
    return {
      formPerms: ['USE_API'],
      formId: null
    }
  },
  computed: {
    ...mapState({
      perms: (state) => state.permissions
    })
  },
  methods: {
    create() {
      this.$api
        .post(`/users/${this.formId}`, { permissions: this.formatPerms(this.formPerms) })
        .then(({ data }) => {
          this.parentRef.success(`Successfully created a user with id: ${data.snowflake}`)
        })
        .catch(this._onError)
    },
    submit() {
      this.$api
        .put(`/users/${this.formId}`, { permissions: this.formatPerms(this.formPerms) })
        .then(({ data }) => {
          this.parentRef.success(`Successfully updated user (ID: ${data.snowflake})`)
        })
        .catch(this._onError)
    },
    reset(toNull = false) {
      this.$nextTick(() => {
        this.formId = toNull ? null : this.snowflake
        this.formPerms = toNull ? ['USE_API'] : this.permissions
      }, this)
    },
    formatPerms(perms) {
      let state = 0b0000000000
      for (const perm of perms) {
        state |= this.$store.state.permissions.find((p) => p.perm === perm).value
      }
      return state.toString(2).padStart(10, '0')
    }
  }
}
</script>
