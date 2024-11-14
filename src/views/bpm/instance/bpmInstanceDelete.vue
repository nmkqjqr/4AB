<template>
  <el-dialog
    v-model="delInfo.dialogVisible"
    title="请确认"
    width="450"
    destroy-on-close
  >
    确定删除{{ delInfo.name }}吗？
    <br />
    <el-switch
      v-model="delInfo.isData"
      active-text="删除业务数据"
      class="ml-2"
      inactive-text="不删除"
      inline-prompt
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="delInfo.dialogVisible = false">
          {{ $abT('page.common.cancel', '取消') }}
        </el-button>
        <el-button type="primary" @click="ok()">
          {{ $abT('page.common.ok', '确定') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { abTableMix, bpmApi, abUtil, BpmImageDialog } from '~/agilebpm'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
  } from '@element-plus/icons-vue'
  import { abT } from '@/i18n'

  const emit = defineEmits(['deleteSuccess'])
  //删除信息
  const delInfo = reactive({
    dialogVisible: false,
    isData: true,
    name: '',
    id: '',
  })

  const open = (row: any) => {
    delInfo.id = row.id
    delInfo.dialogVisible = true
    delInfo.isData = true
    delInfo.name = `实例【${row.title}】`
  }
  const openIds = (ids: any) => {
    if (!ids || ids.length == 0) {
      return
    }
    delInfo.id = ids.join(',')
    delInfo.dialogVisible = true
    delInfo.isData = true
    delInfo.name = `${ids.length}条实例数据`
  }
  const ok = () => {
    bpmApi.instance.remove(delInfo.id, delInfo.isData).then((result: any) => {
      ElMessage({
        type: 'success',
        message: result.msg || abT('page.common.operateSuccess', '操作成功'),
        onClose: () => {},
      })
      delInfo.dialogVisible = false
      emit('deleteSuccess')
    })
  }

  defineExpose({ open, openIds })
</script>
