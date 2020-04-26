export default ({ app, env, store }, inject) => {
  const api = app.$axios.create({
    baseURL: `${env.baseUrl}/api`
  })

  class ApiService {
    post(url, body) {
      return api.post(url, body, this._getAuth())
    }

    get(url) {
      return api.get(url, this._getAuth())
    }

    put(url, body) {
      return api.put(url, body, this._getAuth())
    }

    delete(url) {
      return api.delete(url, this._getAuth())
    }

    _getAuth() {
      return {
        headers: {
          Authorization: `Bearer ${store.state.auth.access_token || app.$cookies.get('auth-access-token')}`
        }
      }
    }
  }

  inject('api', new ApiService())
}
