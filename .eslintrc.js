// prettier-ignore
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'vuetify',
    '@nuxtjs',
    'plugin:vue/recommended',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    'no-console': 'off',
    camelcase: 'off',
    'no-unused-vars': 'warn',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': [
      'warn',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    'vue/no-unused-components': 'warn',
    'vue/prop-name-casing': 'off'
  }
}
