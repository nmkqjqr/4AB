<template>
  <div style="padding:8px 8px 8px 8px;">
    <el-row>
      <el-col :span="8">
        <el-card style="max-width: 360px">
          <template #header>
            <div class="card-header">
              <span>选择要操作的人员</span>
            </div>
          </template>

          <el-row>
            <el-col style="margin-bottom: 5px">
              <el-select
                v-model="info.data.fromType"
                class="m-2"
                style="width: 160px"
              >
                <el-option
                  v-for="(item, index) in fromType"
                  :key="index"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-col>
            <el-col>
              <ab-cust-dialog
                v-model="info.dialogData"
                dialog-key="userSelector"
                size="small"
                style="margin-right: 10px"
                type="primary"
                :dialogSetting="{ multiple: 0 }"
                :value-mapping="{ userId: 'userId', username: 'username' }"
                @ok="setFromUser"
              >
                选择
              </ab-cust-dialog>
              <el-tag
                v-if="info.data.fromName"
                class="mx-2"
                closable
                type="success"
                @close="deleteUser"
              >
                {{ info.data.fromName }}
              </el-tag>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-icon style="margin-top: 60px; margin-left: -70px" :size="65">
          <Right />
        </el-icon>
      </el-col>
      <el-col :span="8">
        <el-card style="max-width: 360px">
          <template #header>
            <div class="card-header">
              <span>目标人员</span>
            </div>
          </template>

          <el-row>
            <el-col style="margin-bottom: 5px">
              <el-select
                v-model="info.data.transferType"
                class="m-2"
                style="width: 160px"
              >
                <el-option
                  v-for="(item, index) in transferType"
                  :key="index"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-col>

            <el-col>
              <ab-cust-dialog
                v-model="info.targetDialogData"
                dialog-key="userSelector"
                size="small"
                style="margin-right: 10px"
                type="primary"
                :dialogSetting="{ multiple: 0 }"
                :value-mapping="{ userId: 'userId', username: 'username' }"
                @ok="setTargetUser"
              >
                选择
              </ab-cust-dialog>
              <el-tag
                v-if="info.data.targetName"
                class="mx-2"
                closable
                type="success"
                @close="deleteTargetUser"
              >
                {{ info.data.targetName }}
              </el-tag>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="3">
        <el-button
          type="primary"
          style="margin-top: 60px; margin-left: -60px"
          @click="authTransfer"
        >
          转移
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        border
        :data="info.respData"
        empty-text="请先选择要查询的人员"
        style="width: 100%;margin-top:8px;"
      >
        <el-table-column label="转移类型" prop="transferName" width="150" />
        <el-table-column label="转移内容" min-width="150" prop="transferType">
          <template #default="scope">
            <ab-cust-dialog
              v-model="scope.row.checkData"
              dialog-key="dstz_authTransfer"
              size="small"
              :icon="Search"
              :param="{
                fromId$VEQ: info.data.fromId,
                fromType$VEQ: info.data.fromType,
                transferType$VEQ: scope.row.transferType,
              }"
              type="primary"
              @ok="setChecked($event, scope.row, scope.$index)"
            >
              选择
            </ab-cust-dialog>
            {{ scope.row?.transferNames?.substring(0, 80)
            }}{{ scope.row?.transferNames?.length > 80 ? '...' : '' }}
          </template>
        </el-table-column>
        <el-table-column label="已选" prop="transferName" width="150">
          <template #default="scope">
            {{ scope.row?.transferIds ? scope.row?.transferIds.length : 0 }}
          </template>
        </el-table-column>
        <el-table-column label="总计" prop="transferName" width="150">
          <template #default="scope">
            {{ scope.row?.total ? scope.row?.total : 0 }}
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="info.dialogVisible"
        :destroy-on-close="true"
        :before-close="handleClose()"
        title="转移明细"
        width="788px"
        append-to-body
      >
        <div>
          <el-button type="primary" @click="checkAllInLine(info.lineData)">
            全选
          </el-button>
        </div>
        <div>
          <el-checkbox-group
            v-model="info.lineData.transferIds"
            size="small"
            style="margin-top: 4px"
          >
            <el-checkbox
              v-for="item in info.lineData.transFerInfoList"
              :key="item.transferId"
              border
              class="checkBoxItem"
              @change="save(info.lineData)"
              :label="item.transferId"
            >
              {{ item.transferName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { reactive, defineComponent } from 'vue'
  import { abTableMix } from '~/agilebpm'
  import { sysApi } from '~/agilebpm'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { Search, Plus, Delete, Edit } from '@element-plus/icons-vue'

  const fromType = [{ key: 'user', value: '人员' }]

  const transferType = [
    { key: 'move', value: '转移' },
    { key: 'copy', value: '复制' },
    { key: 'del', value: '删除' },
  ]

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
    dialogVisible: false,
    lineData: {},
    authTransferData: {},
  })

  const checkAllInLine = (data: any) => {
    if (data.isCheckAll) {
      data.transferIds = []
      data.isCheckAll = false
    } else {
      data.transferIds = data.transFerInfoList.map((a: any) => a.transferId)
      data.transferNameList = data.transFerInfoList.map(
        (a: any) => a.transferName
      )
      data.isCheckAll = true
    }
    if (index != -1) {
      info.respData.splice(index, 1, data)
    }
  }
  let index = -1
  const showDialog = (data: any, indexNum: number) => {
    info.dialogVisible = true
    info.lineData = abUtil.clone(data)
    index = indexNum
  }
  const setChecked = (data: any, rowData: any, index: any) => {
    rowData.transferIds = data.map((a: any) => a.transferId)
    rowData.transferNames = data.map((a: any) => a.transferName).join(',')
    rowData.transferNameList = data.map((a: any) => a.transferName)
    rowData.checkData = data
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

    const filteredTransFerList = info.data.transFerList.filter((item: { hasOwnProperty: (arg0: string) => any }) => {
      return item.hasOwnProperty('transferIds')
    })
    info.data.transFerList = filteredTransFerList
    if (info.data.transFerList.length == 0 ) {
      ElMessage({
        message: '请先选择要转移的数据',
        type: 'warning',
      })
      return
    }

    sysApi.authTransfer.authTransfer(info.data).then((resp: any) => {
      if (resp.isOk) {
        ElMessage({
          message: '操作成功！',
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
    info.respData = {}
  }
  const deleteTargetUser = () => {
    info.data.targetId = ''
    info.data.targetName = ''
  }
</script>
