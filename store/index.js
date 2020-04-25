export const state = () => ({
  loading: {
    user: false
  },
  title: ''
})

export const mutations = {
  loading(state, { t, v }) {
    state.loading[t] = v
  },
  setTitle(state, title) {
    state.title = title
  }
}
