import Vue from 'vue'

if (!Vue.__updateTitleMixin__) {
  Vue.mixin({
    mounted() {
      if (this.$metaInfo && this.$metaInfo.title) {
        this.$store.commit('setTitle', this.$metaInfo.title)
      } else if (this.$options.name && this.$options.name.startsWith('pages/')) {
        this.$store.commit('setTitle', '')
      }
    }
  })

  Vue.__updateTitleMixin__ = true
}
