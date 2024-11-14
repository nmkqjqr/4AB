<template>
  <div
    ref="divRef"
    class="pack"
    :style="{
      '--height': height ? height + 'px' : '100%',
      '--maxHeight': maxHeight ? maxHeight + 'px' : '100%',
      'border-top': disabled ? '1px solid #d1d5db' : '',
    }"
  >
    <p class="pText" v-if="queryName == 'BpmInstancePrintHome'">
      {{removeHtmlTags(viewValue)}}
    </p>
    <QuillEditor
      v-else
      ref="quillRef"
      v-model:content="viewValue"
      :content-type="contentType"
      :modules="modules"
      :options="options"
      :toolbar="toolbar"
      @update:content="changeFn"
    />
  </div>
</template>
<script lang="ts">
  export default { name: 'AbRichEditor' }
</script>

<script lang="ts" setup>
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { reactive, ref, watch } from 'vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  const { proxy } = abTools.useCurrentInstance()
  const props = defineProps({
    //选中项绑定值:
    modelValue: {
      type: String,
      default: '',
      required: true,
    },
    //是否禁用: true/false  默认false
    disabled: {
      type: Boolean,
      default: false,
    },
    //富文本的默认高度
    height: {
      type: Number,
      default: 250,
    },
    //富文本的最大高度
    maxHeight: {
      type: Number,
      default: 420,
    },
    contentType: {
      type: String as () => 'delta' | 'html' | 'text',
      default: 'html',
    },
  })
  const queryName = proxy.$route.name
  //富文本ref对象
  const quillRef = ref()
  const divRef = ref()
  // update: 需要双向绑定的属性名
  const emit = defineEmits(['update:modelValue'])

  const viewValue = ref()

  //富文本常规配置
  const options = reactive({
    debug: 'warn', //控制台监控富文本底层的日志级别
    placeholder: '', //默认占位符
    readOnly: props.disabled, //是否只读
    theme: 'snow', //主题样式
    //保存富文本编辑的历史，ctrl+z 方便撤回 （会占用内存不宜过大）
    history: {
      delay: 2000, // 2s记录一次操作历史
      maxStack: 100, // 最大记录200次操作历史
    },
  })

  //富文本框工具栏
  const toolbar = [
    ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
    ['blockquote', 'code-block'], // 引用
    [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
    [{ script: 'sub' }, { script: 'super' }], // 上标/下标
    [{ indent: '-1' }, { indent: '+1' }], // 缩进
    [{ direction: 'rtl' }], // 文本方向
    [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
    [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
    [{ font: [] }], // 字体种类
    [{ align: [] }], // 对齐方式
    ['clean'], // 清除文本格式
    ['link', 'image', 'video'], // 链接、图片、视频
  ]

  //富文本框的模块配置
  const modules = ref()

  onMounted(() => {
    if (props.disabled) {
      nextTick(() => {
        divRef.value.children[0].style.display = 'none'
      })
    }
  })

  watch(
    () => props.disabled,
    (newValue) => {
      if (newValue) {
        divRef.value.children[0].style.display = 'none'
      } else {
        divRef.value.children[0].style.display = ''
      }
    }
  )

  const changeFn = () => {
    if (!viewValue.value || viewValue.value == '<p><br></p>') {
      viewValue.value = ''
    }
    emit('update:modelValue', viewValue.value)
  }

  watch(
    () => props.modelValue,
    (val) => {
      viewValue.value = props.modelValue
    },
    { immediate: true }
  )
  // 去除字符串内标签
  const removeHtmlTags = (str:any) => {
    return str.replace(/<[^>]*>/g, '');
  }
</script>

<style scoped lang="scss">
  .pack {
    max-width: 100%;
    .pText{
      display: block !important;
    }
    //通过props的传参变量传参方式修改css
    :deep(.ql-editor) {
      min-height: var(--height);
      max-height: var(--maxHeight);
    }
  }
</style>
