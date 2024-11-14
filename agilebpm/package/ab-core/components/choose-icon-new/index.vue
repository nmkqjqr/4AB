<template>
  <div>
    <div>
      <el-popover
        :disabled="props.disabled"
        placement="top"
        popper-class="popStyle"
        trigger="click"
        width="450"
        @show="info.popoverShow"
      >
        <template #reference>
          <el-input
            v-model="info.data.icon"
            :disabled="props.disabled"
            placeholder="请选择"
            suffix-icon="data-icon"
            clearable
            @clear="clearIcon"
          >
            <template
              #append
              v-if="info.data.icon && info.data.icon.length > 0"
            >
              <vab-icon :icon="info.data.icon" />
            </template>
          </el-input>
        </template>
        <el-input
          v-model="info.search"
          class="input-with-select"
          placeholder="输入关键字查询"
          clearable
          style="position: absolute; left: 0; padding: 0 10px"
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
        <div class="iconList">
          <vab-icon
            v-for="(item, index) in iconListNew"
            :key="index"
            class="icon"
            :icon="item"
            @click="saveicon(item)"
          />
        </div>
      </el-popover>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { relative } from 'path/posix'
  import { Search } from '@element-plus/icons-vue'
  import { ref, watch, reactive } from 'vue'
  import { iconList } from './iconList'
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
    popoverShow: false,
    data: {
      icon: props.modelValue,
    },
    iconList: iconList,
    search: '',
  })
  //监听父组件的值
  watch(
    () => props.modelValue,
    (now) => {
      info.data.icon = now
    }
  )
  const iconListNew = computed(() => {
    return info.iconList.filter((p: any) => {
      return p.indexOf(info.search) !== -1
    })
  })
  const saveicon = (ic: string) => {
    info.data.icon = ic
    info.popoverShow = false
    emit('update:modelValue', ic)
  }
  const clearIcon = () => {
    info.data.icon = ''
    emit('update:modelValue', info.data.icon)
  }
</script>
<style lang="scss">
  .popStyle {
    position: relative;
    width: 400px !important;
    height: 360px !important;
  }
</style>

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

  .iconList {
    display: flex;
    flex-wrap: wrap; //一定要换行
    justify-content: flex-start;
    width: 360px;
    height: 300px;
    margin-top: 40px;
    margin-right: 0px !important;
    overflow: auto;
    .icon {
      display: inline-block;
      width: 60px;
      height: 45px;
      margin: 5px;
      font-size: 20px;
      line-height: 45px;
      color: #000000;
      text-align: center;
      cursor: pointer;
      border: 1px solid #e6e6e6;
      border-radius: 4px;

      &:hover {
        color: blue;
        border-color: blue;
      }
    }

    :deep(.el-tabs__content) {
      height: 270px;
      overflow-x: hidden; //x轴溢出隐藏
      overflow-y: scroll; //y轴显示滚动条
    }
  }
</style>
