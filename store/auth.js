export const state = () => ({
  loggedIn: false,
  access_token: null,
  refresh_token: null,
  user: {
    id: '',
    username: '',
    avatar: '',
    permissions: []
  }
})

export const getters = {
  hasPermission: (state) => (perm) => {
    return state.user.permissions.includes(perm)
  }
}

export const mutations = {
  login(state, { access_token, refresh_token }) {
    state.loggedIn = true
    state.access_token = access_token
    state.refresh_token = refresh_token
  },
  setUser(state, user) {
    state.user.id = user.id
    state.user.username = user.username
    state.user.avatar = user.avatar
  },
  setPerms(state, permissions) {
    state.user.permissions = permissions
  },
  logout(state) {
    state.loggedIn = false
    state.access_token = null
    state.refresh_token = null
    state.user = {
      id: '',
      username: '',
      avatar: '',
      permissions: []
    }
  }
}
