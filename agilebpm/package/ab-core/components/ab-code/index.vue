<template>
  <span>
    <span v-if="!disabled">
      <el-input
        v-if="info.scode"
        v-bind="$attrs"
        v-model="info.value"
        :maxlength="info.ml"
        @input="valueChange"
      >
        <template #prepend>
          <el-tooltip
            class="box-item"
            content="用户简码"
            effect="dark"
            placement="top-start"
          >
            {{ info.scode }}
          </el-tooltip>
        </template>
      </el-input>

      <el-input
        v-else
        :maxlength="maxlength"
        v-bind="$attrs"
        :model-value="props.modelValue"
        @input="emit('update:modelValue', $event)"
      />
    </span>

    <el-tag v-else v-bind="$attrs" class="displayEllipsistag">{{ modelValue }}</el-tag>
  </span>
</template>

<script lang="ts">
  export default { name: 'AbCode' }
</script>

<!--<ab-pinyin v-model="data.comment" v-model:to="data.name" v-model:to1="data.code" />-->
<script lang="ts" setup>
  //import { ref, watch } from 'vue'
  import { sysApi, postData } from '@agilebpm/api'
  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: [Number, String],
      default: null,
    },
  })

  //用最笨的方式，预留三个翻译名额。。
  const emit = defineEmits(['update:modelValue'])

  const info: any = reactive({
    value: '',
    scode: '',
    ml: null,
  })

  onMounted(() => {
    if (props.disabled) {
      return
    }
    sysApi.tools.getScode().then(({ data = '' }) => {
      if (data) {
        info.scode = `${data}_`
        if (props.maxlength) {
          info.ml = Number.parseInt(`${props.maxlength}`) - info.scode.length
        }
        model2Value()
      }
    })
  })

  const model2Value = () => {
    if (!info.scode || props.disabled) return

    if (props.modelValue.startsWith(info.scode)) {
      info.value = props.modelValue.substring(info.scode.length)
    } else {
      info.value = props.modelValue
      valueChange()
    }
  }

  const valueChange = () => {
    if (info.value) {
      emit('update:modelValue', info.scode + info.value)
    } else {
      emit('update:modelValue', '')
    }
  }

  watch(
    () => props.modelValue,
    (now, old) => {
      model2Value()
    }
  )

  watch(
    () => props.disabled,
    (now, old) => {
      if (props.disabled) {
        return
      }
      if (info.scode) {
        model2Value()
        return
      }
      sysApi.tools.getScode().then(({ data = '' }) => {
        if (data) {
          info.scode = `${data}_`
          model2Value()
        }
      })
    }
  )
</script>
<style lang="scss" scoped>
:deep(.displayEllipsistag){
  .el-tag__content{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>