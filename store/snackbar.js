export const state = () => ({
  msg: '',
  color: undefined,
  icon: undefined
})

export const mutations = {
  error(state, msg) {
    state.msg = msg
    state.color = 'error'
    state.icon = 'mdi-alert'
  },
  success(state, msg) {
    state.msg = msg
    state.color = 'success'
    state.icon = 'mdi-check-circle'
  },
  reset(state) {
    state.msg = ''
  }
}
