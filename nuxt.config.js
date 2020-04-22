const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'universal',
  // vue-meta
  head: {
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} - Nomad's Notebook` : "Nomad's Notebook"
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  // Server middleware (api)
  serverMiddleware: [
    { path: '/api/auth/token', handler: '~/server/api/auth/token.js' },
    {
      path: '/api',
      handler: '~/server/middleware/auth.js'
    },
    {
      path: '/api',
      handler: '~/server/api/index.js'
    }
  ],
  // Server
  server: {
    host: process.env.HOST
  },
  // context.env
  env: {
    baseUrl: process.env.BASE_URL,
    clientId: process.env.CLIENT_ID,
    oauth2Url: process.env.OAUTH2_URL
  },
  loading: {
    color: '#ff9100',
    height: '3px'
  },
  // Global css
  css: [],
  // Plugins
  plugins: [{ src: '~/plugins/auth.js', mode: 'client' }, '~/plugins/api.js'],
  // Dev plugins
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  // Modules
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    'cookie-universal-nuxt',
    'nuxt-leaflet'
  ],
  // Axios
  axios: {},
  // Vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  // vue-router
  router: {
    middleware: ['auth']
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
