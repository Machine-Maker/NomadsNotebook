<template>
  <div>Logging in...</div>
</template>
<script>
export default {
  mounted() {
    this.$store.commit('loading', { t: 'user', v: true })
    this.$auth
      .handleCallback(this.$route.query)
      .catch((err) => {
        console.error(err)
        this.$auth.logout()
      })
      .finally(() => {
        this.$store.commit('loading', { t: 'user', v: false })
        this.$router.push('/')
      })
  }
}
</script>
