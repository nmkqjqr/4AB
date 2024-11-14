<template>
  <div>
    <div>
      <el-input
        v-model="info.data.icon"
        placeholder="请选择"
        readonly
        style="width: 130px"
      >
        <template #append>
          <el-button
            :disabled="props.disabled"
            :icon="Search"
            @click="chooseico"
          />
        </template>
      </el-input>
    </div>
    <RemixIcon ref="RemixIconref" @save="saveicon" />
  </div>
</template>
<script setup lang="ts">
  import { relative } from 'path/posix'
  import { Search } from '@element-plus/icons-vue'
  import { ref, watch, reactive } from 'vue'
  import RemixIcon from './remixIcon.vue'
  const RemixIconref = ref('RemixIconref')
  // update: 需要双向绑定的属性名
  const emit = defineEmits(['update:modelValue'])
  //v-model 默认的值为 value 可以通过 : 自定义
  const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    modelValue: {
      type: String,
      require: true,
    },
    disabled: {
      type: Boolean,
      require: false,
    },
  })
  const str = ref(props.modelValue)
  const info: any = reactive({
    data: {
      icon: props.modelValue,
    },
  })
  //监听父组件的值
  watch(
    () => props.modelValue,
    (now) => {
      info.data.icon = now
    }
  )
  // 选择图标
  const chooseico = () => {
    RemixIconref.value.open(info.data.icon)
  }
  const saveicon = (ic: string) => {
    info.data.icon = ic
    emit('update:modelValue', ic)
  }
</script>

<style lang="scss" scoped>
  .rich-text-editor-container {
    max-width: 800px;
    .news {
      &-title {
        text-align: center;
      }

      &-content {
        :deep() {
          p {
            line-height: 30px;

            img {
              display: block;
              margin-right: auto;
              margin-left: auto;
            }
          }
        }
      }
    }

    .vab-quill-content {
      :deep() {
        .el-form-item__content {
          line-height: normal;
        }
      }
    }

    :deep() {
      .vab-quill {
        .ql-vab-upload-image {
          font-family: 'remixicon', sans-serif !important;
          font-size: 16px;
          font-weight: 580;

          &:before {
            content: '\ee46';
          }
        }
      }
    }
  }
</style>
