<template>
  <tr>
    <slot
      :permission="info.permission"
      :table-permission="info.tablePermission"
    ></slot>
  </tr>
</template>
<script lang="ts" setup>
  // TODO 发布壹点灵后删掉他
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const props = defineProps({
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
    tablePermission: abUtil.clone(props.tablePermission),
    permission: abUtil.clone(props.permission),
  })

  onMounted(() => {
    console.info(info)
  })
</script>
