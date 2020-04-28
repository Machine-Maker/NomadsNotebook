<template>
  <v-overlay :value="value" absolute opacity="0.9" class="text-center" z-index="2000">
    <v-progress-circular indeterminate color="primary" :size="128" :width="8" />
    <br />
    <slot />
  </v-overlay>
</template>

<script>
export default {
  props: {
    value: Boolean
  }
}
</script>
