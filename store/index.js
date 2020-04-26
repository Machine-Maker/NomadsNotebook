export const state = () => ({
  loading: {
    user: false
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
    let query = ''
    if (process.env.NODE_ENV === 'development') {
      query = '?test=true'
    }
    if (Array.isArray(state.regions) && !state.regions.length) {
      const { data } = await app.$api.get(`/regions${query}`)
      commit('setRegions', data)
    }
    if (Array.isArray(state.permissions) && !state.permissions.length) {
      const { data } = await app.$api.get(`/permissions${query}`)
      commit('setPermissions', data)
    }
    if (Array.isArray(state.mapTypes) && !state.mapTypes.length) {
      const { data } = await app.$api.get(`/maptypes${query}`)
      commit('setMapTypes', data)
    }
  }
}
