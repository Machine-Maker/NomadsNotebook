import { stringify } from 'querystring'
import crypto from 'crypto'

const ACCESS_TOKEN = 'auth-access-token'
const REFRESH_TOKEN = 'auth-refresh-token'

export default ({ app, store, redirect, $axios, env }, inject) => {
  class AuthService {
    verifyAuth() {
      return new Promise((resolve, reject) => {
        if (!store.state.auth.loggedIn) {
          const access_token = app.$cookies.get(ACCESS_TOKEN)
          const refresh_token = app.$cookies.get(REFRESH_TOKEN)
          if (access_token && refresh_token) {
            store.commit('loading', { t: 'user', v: true })
            store.commit('auth/login', { access_token, refresh_token })
            this.setUser()
              .then(() => resolve({ status: 'logged in ' }))
              .catch((err) => {
                this.refreshLogin()
                  .then(() => resolve({ status: 'refreshed token' }))
                  .catch((err) => reject(err))
                  .finally(() => store.commit('loading', { t: 'user', v: false }))
                reject(err)
              })
              .finally(() => store.commit('loading', { t: 'user', v: false }))
          } else if (!access_token && refresh_token) {
            // refresh token
            store.commit('loading', { t: 'user', v: true })
            this.refreshLogin()
              .then(() => resolve({ status: 'refreshed token' }))
              .catch((err) => reject(err))
              .finally(() => store.commit('loading', { t: 'user', v: false }))
          } else {
            store.commit('auth/logout')
            resolve({ status: 'invalid cookies' })
          }
        } else {
          resolve({ status: 'not logged in' })
        }
      }).catch((err) => {
        console.error(err.error || err)
        this.logout()
      })
    }

    login() {
      store.commit('loading', { t: 'user', v: true })
      const nonce = crypto.randomBytes(16).toString('base64')
      const params = {
        client_id: env.clientId,
        redirect_uri: `${env.baseUrl}/login`,
        response_type: 'code',
        scope: 'identify',
        state: nonce
      }
      sessionStorage.removeItem('nonce')
      sessionStorage.setItem('nonce', nonce)
      setTimeout(() => {
        location.replace(`${env.oauth2Url}/authorize?${stringify(params)}`)
      }, 500)
    }

    async handleCallback(queryParams) {
      if (queryParams.state !== sessionStorage.getItem('nonce')) throw new Error('Invalid state!')
      const code = queryParams.code
      const { data } = await app.$api.get(`/auth/token?${stringify({ code })}`, false)
      this.setTokens(data)
      await this.setUser()
      return { status: 'logged in' }
    }

    async refreshLogin() {
      const refresh_token = app.$cookies.get(REFRESH_TOKEN)
      const { data } = await app.$api.get(`/auth/refresh?${stringify({ refresh_token })}`, false)
      this.setTokens(data)
      await this.setUser()
      return { status: 'token refreshed' }
    }

    setTokens({ access_token, refresh_token, expires_in }) {
      app.$cookies.set(ACCESS_TOKEN, access_token, {
        path: '/',
        maxAge: expires_in
      })
      app.$cookies.set(REFRESH_TOKEN, refresh_token, {
        path: '/',
        maxAge: expires_in * 52
      })
      store.commit('auth/login', { access_token, refresh_token })
    }

    getAccessToken() {
      if (!store.state.auth.loggedIn) return 'None'
      return app.$cookies.get(ACCESS_TOKEN) || 'None'
    }

    async setUser() {
      if (!store.state.auth.loggedIn || !store.state.auth.access_token) throw new Error('Not logged in!')
      const { data: discordData } = await $axios.get('https://discordapp.com/api/users/@me', app.$api._getAuth())
      store.commit('loading', { t: 'perms', v: true })
      app.$api
        .get(`/@me`)
        .then(({ data: userData }) => {
          store.commit('auth/setPerms', this.computePerms(parseInt(userData.permissions, 2)))
        })
        .finally(() => store.commit('loading', { t: 'perms', v: false }))
      store.commit('auth/setUser', discordData)
    }

    async refreshPerms() {
      if (!store.state.auth.loggedIn || !store.state.auth.access_token) throw new Error('Not logged in!')
      store.commit('loading', { t: 'perms', v: true })
      const { data } = await app.$api.get(`/@me`)
      store.commit('auth/setPerms', this.computePerms(parseInt(data.permissions, 2)))
      store.commit('loading', { t: 'perms', v: false })
    }

    logout() {
      store.commit('auth/logout')
      app.$cookies.remove(ACCESS_TOKEN)
      app.$cookies.remove(REFRESH_TOKEN)
      redirect('/')
    }

    computePerms(bitfield) {
      const userPerms = []
      for (const perm of store.state.permissions) {
        if (bitfield & perm.value) userPerms.push(perm.perm)
      }
      return userPerms
    }
  }

  inject('auth', new AuthService())
}
