<template>
  <div v-if="permission !== 'n'">
    <span>
      <el-steps
        :active="viewValue"
        :class="
          (permission == 'w' || permission == 'b') && !disabled ? 'click' : ''
        "
        finish-status="success"
        process-status="finish"
        simple
        v-bind="$attrs"
      >
        <el-step
          v-for="(s, index) in props.param"
          :key="s.value"
          :title="s.label"
          @click.enter="clickFn(index)"
        />
      </el-steps>
    </span>
  </div>
</template>

<script lang="ts">
  export default { name: 'AbSteps' }
</script>

<script lang="ts" setup>
  const props = defineProps({
    //选中项绑定值:
    modelValue: {
      type: Number,
      required: true,
    },
    //是否禁用: true/false  默认false
    disabled: {
      type: Boolean,
      default: false,
    },
    //权限:w/r/n/b(编辑/只读/无权限/必填)   默认值 W （与element内置是否只读属性readonly绑定， 无需自己实现）
    permission: {
      type: String,
      default: 'w',
    },
    regression: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Array<{ value: number; label: string; default: boolean }>,
      default: () => [],
    },
  })

  // emit 事件定义
  const emit = defineEmits(['update:modelValue'])

  const viewValue: any = useVModel(props, 'modelValue', emit)
  //将data内的属性转为响应式数据
  const { permission, disabled, regression } = toRefs(props)

  if (viewValue.value == null || viewValue.value == undefined) {
    viewValue.value = props.param.findIndex((s) => s.default)
  }

  const clickFn = (index: number) => {
    if (
      (permission.value == 'w' || permission.value == 'b') &&
      !disabled.value
    ) {
      if (regression.value) {
        if (index > viewValue.value) {
          const title = props.param[index]?.label
          let message
          if (index - viewValue.value == 1) {
            message = '是否进入下个进度'
          } else {
            let titleStr = ''
            for (let i = 1; i <= index - 1 - viewValue.value; i++) {
              titleStr += `${props.param[viewValue.value + i]?.label}，`
            }
            titleStr = titleStr.slice(0, titleStr.length - 1)
            message = `是否跳过【${titleStr}】等节点,直接进入进度`
          }
          ElMessageBox.confirm(
            `${message}【${title}】？ 进入此进度后无法回退！`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          ).then(() => {
            viewValue.value = props.param[index]?.value
          })
        }
      } else {
        viewValue.value = index
      }
    }
  }
</script>
<style lang="scss" scoped>
  :deep(.el-step.is-simple .el-step__head) {
    font-size: 20px;
  }

  :deep(.click .el-step.is-simple) {
    cursor: pointer;
  }
</style>
