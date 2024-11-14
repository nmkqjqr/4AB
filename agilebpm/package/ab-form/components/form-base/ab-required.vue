<template>
  <span v-if="permission == 'b'" style="color: red">*</span>
</template>

<script lang="ts">
  export default { name: 'AbRequired' }
</script>

<!-- <ab-required :permission=''/> -->
<script lang="ts" setup>
  import { ref, watch } from 'vue'
  const props = defineProps({
    permission: {
      type: String,
      default: 'b',
    },
  })
</script>
