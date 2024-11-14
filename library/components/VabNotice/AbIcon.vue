<template>
  <svg aria-hidden="true" class="icon" @click="emit('click', $event)">
    <use :xlink:href="`#icon-${icon}`" />
  </svg>
</template>

<script lang="ts">
  export default {
    name: 'AbIcon',
  }
</script>

<script lang="ts" setup>
  import './icon'
  const props = defineProps({
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '50px',
    },
  })

  const emit = defineEmits(['click'])
</script>

<style scoped lang="scss">
  $width: v-bind(size);
  $height: v-bind(size);
  .icon {
    width: $width;
    height: $height;
    overflow: hidden;
    vertical-align: middle;
    fill: currentColor;
  }
</style>
