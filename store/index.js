export const state = () => ({
  loading: {
    user: false,
    perms: false
  },
  title: '',
  mapTypes: [],
  regions: [],
  permissions: []
})

export const mutations = {
  loading(state, { t, v }) {
    state.loading[t] = v
  },
  setTitle(state, title) {
    state.title = title
  },
  setRegions(state, regions) {
    state.regions = regions
  },
  setPermissions(state, perms) {
    state.permissions = perms
  },
  setMapTypes(state, types) {
    state.mapTypes = types
  }
}

export const actions = {
  async nuxtServerInit({ state, commit }, { app }) {
    if (Array.isArray(state.regions) && !state.regions.length) {
      const { data } = await app.$api.get(`/regions`)
      commit('setRegions', data)
    }
    if (Array.isArray(state.permissions) && !state.permissions.length) {
      const { data } = await app.$api.get(`/permissions`)
      commit('setPermissions', data)
    }
    if (Array.isArray(state.mapTypes) && !state.mapTypes.length) {
      const { data } = await app.$api.get(`/maptypes`)
      commit('setMapTypes', data)
    }
  }
}
