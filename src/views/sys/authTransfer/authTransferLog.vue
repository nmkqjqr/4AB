<template>
<div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            label-width="90px"
            :model="query"
            @submit.prevent
          >
            <el-form-item label="来源名称" prop="fromName$VLK">
              <el-input
                v-model="query.fromName$VLK"
                placeholder="请输入来源名称"
              />
            </el-form-item>
            <el-form-item label="目标名称" prop="targetName$VLK">
              <el-input
                v-model="query.targetName$VLK"
                placeholder="请输入目标名称"
              />
            </el-form-item>

            

            <el-form-item>
              <el-button :icon="Search" type="primary" @click="search()">
                查询
              </el-button>
              <el-button :icon="RefreshRight" @click="reset()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
       
      </el-row>
    </div>

    <ab-table
      ref="abTable"
      v-model="selectedData"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="sysApi.authTransfer.queryTransferLogUrl"
    >
      <ab-column label="来源类型" min-width="130" prop="fromType"   ab-text-formatter="user-用户-success-dark|" />
      <ab-column label="来源名称" min-width="130" prop="fromName" />
      <ab-column label="目标类型" min-width="130" prop="targetType"  ab-text-formatter="user-用户-success-dark|"/>
      <ab-column label="目标名称" min-width="120" prop="targetName" />
      <ab-column
          ab-text-formatter="move-移动-success-dark|copy-复制-draft-dark|del-移除-danger-dark|"
          label="动作类型"
          min-width="138"
          prop="actionType"
        />

      <ab-column label="操作时间" min-width="100" prop="createTime" />
      <ab-column ab-template="edit" fixed="right" label="操作" width="230" />
      <template #edit="{ scope }">
   
          <el-button text type="primary" @click="openDialogOne(scope.row.transferJson)">查看明细</el-button>
     
      
      </template>
    </ab-table>

    <el-dialog
      v-model="info.dialogOneVisible"
      :destroy-on-close="true"
      :before-close="handleClose()"
      title="操作明细"
      width="888px"
      append-to-body
    >
    <el-table
      border
      :data="info.respData"
      empty-text="请先选择要查询的人员"
      style="width: 100%"
    >
      <el-table-column label="转移类型" prop="transferType" width="150" >
        <template #default="scope">
          <span v-if="scope.row.transferType ==='role'">角色</span>
          <span v-else-if="scope.row.transferType === 'approve'">已办事项</span>
          <span v-else-if="scope.row.transferType === 'todotask'">待办事项</span>
        </template>
      </el-table-column>
      <el-table-column label="转移内容" min-width="150" prop="transferType">
        <template #default="scope">

          <el-tag
              v-for="transferName in scope.row.transferNameList"
              :key="transferName"
              type="success"
            >
              {{ transferName }}
            </el-tag>
        </template>
      </el-table-column>
     
    </el-table>
 
  
    </el-dialog>
  
</div>

    


  
</template>
<script lang="ts">
  import { abTableMix } from '~/agilebpm'
  export default {
    name: 'authTransferLog',
    mixins: [abTableMix],
  }
</script>
<script setup lang="ts">
  import { reactive, defineComponent,getCurrentInstance } from 'vue'
  import { sysApi } from '~/agilebpm'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { Search, Plus, Delete, Edit } from '@element-plus/icons-vue'

  const fromType = [{ key: 'user', value: '人员' }]
  const query = reactive({
    fromName$VLK: '',
    targetName$VLK: '',
      })
  const transferType = [
    { key: 'move', value: '转移' },
    { key: 'copy', value: '复制' },
    { key: 'del', value: '删除' },
  ]
  const { proxy } = getCurrentInstance()

  const info: any = reactive({
    data: {
      fromType: 'user',
      fromId: '',
      fromName: '',
      transferType: 'move',
      targetId: '',
      targetName: '',
      targetType: 'user',
    },
    respData: [],
    transferDetail: [],
    dialogData: [],
    targetDialogData: [],
    dialogOneVisible: false,
    dialogTwoVisible: false,
    lineData: {},
    authTransferData: {},
  })


  let index = -1
  const showDialog = (data: any, indexNum: number) => {
    info.dialogVisible = true
    info.lineData = abUtil.clone(data)
    index = indexNum
  }
  const openDialogOne = (data:any) =>{
    info.respData = JSON.parse(data)
    info.dialogOneVisible = true;
  }
  const setChecked = (data: any,rowData : any,index: any) => {
    rowData.transferIds =  data.map((a: any) => a.transferId)
    rowData.transferNames =  data.map((a: any) => a.transferName).join(',')
    rowData.checkData = data;
    info.respData.splice(index, 1, rowData)
  }
  const setFromUser = (users: Array<any>, type: number) => {
    info.data.fromId = users.map((a: any) => a.id).join(',')
    info.data.fromName = users.map((a: any) => a.name).join(',')
    //查询数据
    queryTransfer()
  }
  const queryTransfer = () => {
    sysApi.authTransfer.queryTransfer(info.data).then((resp) => {
      if (resp.isOk && resp.data) {
        info.respData = {}
        info.respData = resp.data
      }
    })
  }

  const authTransfer = () => {
    info.data.transFerList = info.respData
    if (!info.data.fromId) {
      ElMessage({
        message: '请先选择要查询的人员',
        type: 'warning',
      })
    }
    if (!info.data.targetId && info.data.transferType != 'del') {
      ElMessage({
        message: '请先选择转移的接收人',
        type: 'warning',
      })
      return
    }
    sysApi.authTransfer.authTransfer(info.data).then((resp: any) => {
      if (resp.isOk) {
        ElMessage({
          message: '转移成功！',
          type: 'success',
        })
        queryTransfer()
      } else {
        ElMessage({
          message: resp.msg,
          type: 'warning',
        })
      }
    })
  }

  const handleClose = () => {}
  const save = (data: any) => {
    const newData = abUtil.clone(data)
    info.respData.splice(index, 1, newData)
  }

  const setTargetUser = (users: Array<any>, type: number) => {
    info.data.targetId = users.map((a: any) => a.id).join(',')
    info.data.targetName = users.map((a: any) => a.name).join(',')
  }

  const deleteUser = () => {
    info.data.fromId = ''
    info.data.fromName = ''
  }
  const deleteTargetUser = () => {
    info.data.targetId = ''
    info.data.targetName = ''
  }
</script>
