const mixin = {
  props: {
    parent: {
      type: Object,
      default: null
    },
    refName: {
      type: String,
      default: null,
      validate: (v) => !!v
    }
  },
  methods: {
    _onError({ response: { data, status } }) {
      if (status === 404) this.parentRef.error(new Error('404 Not Found'), 'Endpoint Not Found')
      else if (status === 401) this.parentRef.error(new Error('401 Unauthorized'), 'Unauthorized')
      else this.parentRef.error(data.err || data, `${data.type}: ${data.msg}`)
    }
  },
  data() {
    return {
      parentRef: null,
      rules: {
        required: (v) => !!v || 'This field is required'
      }
    }
  },
  mounted() {
    this.parentRef = this.parent.$refs[this.refName]
    this.parentRef.$on('submit', this.submit)
    this.parentRef.$on('reset', this.reset)
    this.parentRef.$on('create', this.create)
    if (!this.reset) console.error('This component must implement a reset function!')
    else this.reset(false)
  }
}

export default mixin
