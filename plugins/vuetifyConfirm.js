import Vue from 'vue'
import Confirm from '@/components/Confirm.vue'

export default ({ app }, inject) => {
  const globalOptions = {
    buttonTrueText: 'Confirm',
    buttonFalseText: 'Deny',
    color: 'warning',
    title: 'Warning',
    width: 350,
    property: 'confirm'
  }

  const Ctor = Vue.extend(Object.assign({ vuetify: app.vuetify }, Confirm))
  function createDialog(options) {
    const container = document.querySelector('[data-app=true]') || document.body
    return new Promise((resolve) => {
      const cmp = new Ctor(
        Object.assign(
          {},
          {
            propsData: Object.assign({}, globalOptions, options),
            destroyed: () => {
              container.removeChild(cmp.$el)
              resolve(cmp.value)
            }
          }
        )
      )
      container.appendChild(cmp.$mount().$el)
    })
  }

  function show(message, options = {}) {
    options.message = message
    return createDialog(options)
  }

  inject(globalOptions.property, show)
  inject(`${globalOptions.property}Options`, globalOptions || {})
}
