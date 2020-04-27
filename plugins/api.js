import { parse, stringify } from 'querystring'

export default ({ app, env, store }, inject) => {
  const api = app.$axios.create({
    baseURL: `${env.baseUrl}/api`
  })

  class ApiService {
    post(url, body, auth = true) {
      return api.post(this._format(url), body, this._getAuth(auth))
    }

    get(url, auth = true) {
      return api.get(this._format(url), this._getAuth(auth))
    }

    put(url, body, auth = true) {
      return api.put(this._format(url), body, this._getAuth(auth))
    }

    delete(url, auth = true) {
      return api.delete(this._format(url), this._getAuth(auth))
    }

    _getAuth(auth = true) {
      if (!auth) return {}
      return {
        headers: {
          Authorization: `Bearer ${store.state.auth.access_token || app.$cookies.get('auth-access-token')}`
        }
      }
    }

    _format(url) {
      if (!url.includes('?')) {
        if (url.endsWith('refresh') || url.endsWith('token')) return url
        return env.nodeEnv === 'development' ? url + '?test=true' : url
      }
      const host = url.split('?')[0]
      if (host.endsWith('refresh') || host.endsWith('token')) return url
      const string = url.split('?')[1]
      const query = parse(string)
      if (query.test !== undefined) return url
      if (env.nodeEnv === 'development') query.test = 'true'
      return `${host}?${stringify(query)}`
    }
  }

  inject('api', new ApiService())
}
