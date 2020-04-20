export const state = () => ({
  loading: {
    user: false
  }
})

export const mutations = {
  loading(state, { t, v }) {
    state.loading[t] = v
  }
}
