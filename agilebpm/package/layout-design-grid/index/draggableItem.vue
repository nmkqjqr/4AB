<template>
  <el-col
    :class="
      props.activeId == element.formId
        ? ' active_form_item dragableItem'
        : 'dragableItem'
    "
    :span="element.config.span || 24"
    @click="ActiveItemClick"
  >
    <el-form-item :label="element.label">
      <component
        :is="currentComponent"
        v-bind="config"
        v-model="props.element.control.modelValue"
      />
    </el-form-item>
    <span class="dragableItem_copy">
      <el-icon size="14">
        <CopyDocument />
      </el-icon>
    </span>
    <span class="dragableItem_del" @click="delClick">
      <el-icon size="14">
        <Delete />
      </el-icon>
    </span>
  </el-col>
</template>
<script lang="ts" setup>
  import { CopyDocument, Delete } from '@element-plus/icons-vue'
  import { defineProps, inject, computed, ref } from 'vue'
  const props = defineProps({
    element: Object,
    activeId: String,
    formConf: Object,
  })
  const config = ref(props.element.config)

  const activeItem = inject('activeItem')
  const removeItem = inject('removeItem')
  const ActiveItemClick = () => {
    activeItem(props.element)
  }

  const delClick = () => {
    removeItem(props.element)
  }
  const currentComponent = computed(() => {
    return props.element.config.tag
  })
</script>
<style lang="scss">
  @import '../styles/index.scss';
</style>
