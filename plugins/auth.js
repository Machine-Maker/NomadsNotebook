import { stringify } from 'querystring'
import crypto from 'crypto'

const ACCESS_TOKEN = 'auth-access-token'
const REFRESH_TOKEN = 'auth-refresh-token'

export default ({ app, store, redirect, $axios, env }, inject) => {
  const api = $axios.create({
    baseURL: `${env.baseUrl}/api`
  })

  class AuthService {
    verifyAuth(login = false) {
      return new Promise((resolve, reject) => {
        if (!store.state.auth.loggedIn) {
          const access_token = app.$cookies.get(ACCESS_TOKEN)
          const refresh_token = app.$cookies.get(REFRESH_TOKEN)
          if (access_token && refresh_token) {
            store.commit('loading', { t: 'user', v: true })
            store.commit('auth/login', { access_token, refresh_token })
            this.setUser()
              .then(() => resolve({ status: 'logged in ' }))
              .catch((err) => reject(err))
              .finally(() => store.commit('loading', { t: 'user', v: false }))
          } else if (!access_token && refresh_token) {
            // refresh token
            store.commit('loading', { t: 'user', v: true })
            this.refreshLogin()
              .then(() => resolve({ status: 'refreshed token' }))
              .catch((err) => reject(err))
              .finally(() => store.commit('loading', { t: 'user', v: false }))
          } else {
            this.logout()
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

    handleCallback(queryParams) {
      return new Promise((resolve, reject) => {
        // check state
        if (queryParams.state !== sessionStorage.getItem('nonce')) return reject(new Error('Invalid state!'))
        const code = queryParams.code
        api
          .get(`/auth/token?${stringify({ code })}`)
          .then(({ data }) => {
            this.setTokens(data)
            return this.setUser()
          })
          .then(() => {
            resolve({ status: 'logged in' })
          })
          .catch((err) => {
            reject(err.response.data)
          })
      })
    }

    refreshLogin() {
      return new Promise((resolve, reject) => {
        const refresh_token = app.$cookies.get(REFRESH_TOKEN)
        api
          .get(`/auth/refresh?${stringify({ refresh_token })}`)
          .then(({ data }) => {
            this.setTokens(data)
            return this.setUser()
          })
          .then(() => {
            resolve({ status: 'token refreshed' })
          })
          .catch((err) => reject(err.response.data))
      })
    }

    setTokens({ access_token, refresh_token, expires_in }) {
      app.$cookies.set(ACCESS_TOKEN, access_token, {
        maxAge: expires_in
      })
      app.$cookies.set(REFRESH_TOKEN, refresh_token, {
        maxAge: expires_in * 52
      })
      store.commit('auth/login', { access_token, refresh_token })
    }

    setUser() {
      return new Promise((resolve, reject) => {
        if (!store.state.auth.loggedIn || !store.state.auth.access_token) reject(new Error('Not logged in!'))
        else {
          $axios
            .get('https://discordapp.com/api/users/@me', {
              headers: {
                Authorization: `Bearer ${store.state.auth.access_token}`
              }
            })
            .then(({ data }) => {
              store.commit('auth/setUser', data)
              resolve({ status: 'set user' })
            })
            .catch((err) => reject(err.response.data))
        }
      })
    }

    logout() {
      store.commit('auth/logout')
      app.$cookies.remove(ACCESS_TOKEN)
      app.$cookies.remove(REFRESH_TOKEN)
    }
  }

  inject('auth', new AuthService())
}
