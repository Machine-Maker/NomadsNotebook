<template>
  <div>Logging in...</div>
</template>
<script>
export default {
  mounted() {
    this.$store.commit('loading', { t: 'user', v: true })
    this.$auth
      .handleCallback(this.$route.query)
      .then(() => {
        this.$router.push('/')
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => this.$store.commit('loading', { t: 'user', v: false }))
  }
}
</script>
