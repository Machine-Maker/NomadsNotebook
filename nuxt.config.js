const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
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
    bodyParser.json(),
    { path: '/oauth2-redirect.html', handler: express.static(path.join(__dirname, '/docs/oauth2-redirect.html')) },
    '~/api'
  ],
  // Server
  server: {
    host: process.env.HOST
  },
  // context.env
  env: {
    baseUrl: process.env.BASE_URL,
    clientId: process.env.CLIENT_ID,
    oauth2Url: process.env.OAUTH2_URL,
    nodeEnv: process.env.NODE_ENV
  },
  loading: {
    color: '#ff9100',
    height: '3px'
  },
  // Global css
  css: [],
  // Plugins
  plugins: [{ src: '~/plugins/auth.js', mode: 'client' }, '~/plugins/api.js', '~/plugins/updateTitle.js'],
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
          secondary: colors.grey.darken3,
          accent: colors.amber.darken3,
          info: colors.lightGreen.darken2,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent4
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
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
