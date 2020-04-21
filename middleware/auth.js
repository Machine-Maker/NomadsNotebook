export default function({ app }) {
  if (process.client) {
    return app.$auth.verifyAuth()
  }
}
