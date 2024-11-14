<template>
  <el-input
    v-bind="$attrs"
    :model-value="props.modelValue"
    @blur="pinyin(false)"
    @input="emit('update:modelValue', $event)"
  >
    <template #append v-if="manual">
      <el-button :icon="DArrowRight" @click="pinyin(true)" />
    </template>
  </el-input>
</template>

<script lang="ts">
  export default { name: 'AbPinyin' }
</script>

<!--<ab-pinyin v-model="data.comment" v-model:to="data.name" v-model:to1="data.code" />-->
<script lang="ts" setup>
  //import { ref, watch } from 'vue'
  import { sysApi, postData } from '@agilebpm/api'
  import { DArrowRight } from '@element-plus/icons-vue'
  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    to: {
      type: String,
      default: '',
    },
    to1: {
      type: String,
      default: '',
    },
    to2: {
      type: String,
      default: '',
    },
    /**
     * 设置后缀
     * {
     *  to:'_'
     *  to1:'$'
     * }
     */
    suffix: {
      required: false,
      type: Object,
      default: () => {
        return {}
      },
    },
    /**
     * 设置前缀
     * {
     *  to:'_'
     *  to1:'$'
     * }
     */
    prefix: {
      required: false,
      type: Object,
      default: () => {
        return {}
      },
    },
    copy: {
      type: String,
      default: '',
    },
    /**
     * 1 拼音全拼 2 拼音首字母 3 百度翻译成英文
     */
    type: {
      type: Number,
      default: 3,
    },
    /**
     * 是否支持手动翻译
     */
    manual: {
      type: Boolean,
      default: false,
    },
    /**
     * 格式化：1 首字母小写；2 首字母大写 ；3驼峰转下划线
     * {
     *  to : 1,
     *  to1: 2,
     *  to2:1
     * }
     */
    format: {
      required: false,
      type: Object,
      default: () => {
        return {}
      },
    },
  })

  //用最笨的方式，预留三个翻译名额。。
  const emit = defineEmits([
    'update:modelValue',
    'update:to',
    'update:to1',
    'update:to2',
    'update:copy',
  ])

  const pinyin = (b: any) => {
    if (!props.modelValue) {
      return
    }
    if (!props.copy) {
      emit('update:copy', props.modelValue)
    }
    postData(sysApi.tools.PinyinUrl, {
      chinese: props.modelValue,
      type: props.type,
    }).then((resp: any) => {
      const data = `${resp.data}`
      if (!props.to1 || b) {
        emit(
          'update:to1',
          (props.prefix.to1 || '') +
            formate('to1', data) +
            (props.suffix.to1 || '')
        )
      }
      if (!props.to2 || b) {
        emit(
          'update:to2',
          (props.prefix.to2 || '') +
            formate('to2', data) +
            (props.suffix.to2 || '')
        )
      }
      if (!props.to || b) {
        emit(
          'update:to',
          (props.prefix.to || '') +
            formate('to', data) +
            (props.suffix.to || '')
        )
      }
    })
  }

  const formate = (key: string, str: any) => {
    const f = props.format[key] || 1
    if (f == 1) {
      return str.lowerFirst()
    }
    if (f == 2) {
      return str.upperFirst()
    }
    if (f == 3) {
      return str.toUnderlineCase()
    }
    return str
  }
</script>
