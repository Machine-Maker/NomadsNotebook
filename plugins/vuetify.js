import colors from 'vuetify/es5/util/colors'

export default {
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
}
