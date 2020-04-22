export default ({ app, env }, inject) => {
  const api = app.$axios.create({
    baseURL: `${env.baseUrl}/api`
  })

  inject('api', api)
}
