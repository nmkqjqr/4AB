<template>
  <div>
    <slot
      :scope-permission="info.permission"
      :scope-table-permission="info.tablePermission"
    ></slot>
  </div>
</template>
<script lang="ts" setup>
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const pops = defineProps({
    tablePermission: {
      type: Object,
      required: true,
    },
    permission: {
      type: Object,
      required: true,
    },
  })

  const info = reactive({
    tablePermission: abUtil.clone(pops.tablePermission),
    permission: abUtil.clone(pops.permission),
  })
</script>
