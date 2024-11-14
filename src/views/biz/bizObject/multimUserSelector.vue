<template>
  <span v-bind="$attrs" @click="open"><slot></slot></span>

  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    destroy-on-close
    title="多维度用户选择器"
    width="600px"
  >
    <el-form ref="formRef" label-suffix="：" label-width="70px">
      <el-form-item
        v-for="type in info.types"
        :key="type.key"
        :label="type.val"
      >
        <el-tag
          v-for="item in info.data[type.key]"
          :key="item"
          closable
          @close="abUtil.Arrays.remove(item, info.data[type.key])"
        >
          {{ item['name'] }}
        </el-tag>

        <ab-cust-dialog
          v-model="info.data[type.key]"
          :dialog-key="type.dialog"
          :icon="Search"
          round
          size="small"
          style="margin-left: 5px"
          type="primary"
          :value-mapping="{ id: 'id', name: 'name' }"
        >
          选择
        </ab-cust-dialog>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-space wrap>
          <el-button text type="primary" @click="info.dialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="ok">确定</el-button>
        </el-space>
      </span>
    </template>
  </el-dialog>
</template>
/** 多维度用户选择器 */
<script setup lang="ts">
  import { reactive } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { Search } from '@element-plus/icons-vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'

  const props = defineProps({
    initData: {
      type: Object,
      default: () => {
        return {}
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  })

  const { proxy } = abTools.useCurrentInstance()
  const info: any = reactive({
    dialogVisible: false,
    data: {
      user: [],
      org: [],
      post: [],
      role: [],
    },
    types: [
      { key: 'user', val: '用户', dialog: 'userSelector' },
      { key: 'org', val: '组织', dialog: 'orgSelector' },
      { key: 'role', val: '角色', dialog: 'roleSelector' },
      { key: 'post', val: '岗位', dialog: 'postSelector' },
    ],
  })
  const formRef = ref<FormInstance>()

  //声明事件
  const emit = defineEmits(['ok'])

  onMounted(() => {})

  const open = () => {
    if (props.disabled) {
      return
    }

    info.dialogVisible = true
    if (props.initData) {
      info.data = abUtil.clone(props.initData)
    } else {
      info.data = {}
    }
    info.types.forEach((type: any) => {
      if (!info.data[type.key]) {
        info.data[type.key] = []
      }
    })
    console.info(props.initData)
  }

  const ok = () => {
    emit('ok', info.data)
    info.dialogVisible = false
  }
</script>
