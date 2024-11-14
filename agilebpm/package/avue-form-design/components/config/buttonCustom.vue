<template>
  <div>
    <br/>
    <el-divider content-position="left">自定义按钮</el-divider>
    <el-button type="primary" :icon="Plus" style="margin-bottom:12px;" @click="openDialog">
      添加
    </el-button>
    <el-table :data="data.buttonform">
      <el-table-column prop="name" label="名字"/>
      <el-table-column prop="type" label="类型">
        <template #default="{ row }">
          <span v-if="row.type == '1'">保存</span>
          <span v-if="row.type == '2'">自定义事件</span>
          <span v-if="row.type == '3'">弹窗表单</span>
          <span v-if="row.type == '4'">返回</span>
          <span v-if="row.type == '5'">对话框赋值</span>
          <span v-if="row.type == '6'">打印</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="93">
        <template #default="{ row , $index}">
          <el-button link type="primary" >
            <el-icon :size="22" @click="editButton(row, $index)">
              <Edit />
            </el-icon>
          </el-button>
          <el-button link type="danger" @click="data.buttonform.splice($index, 1)">
            <el-icon :size="22">
              <Delete />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="info.dialogVisible"
      append-to-body
      destroy-on-close
      title="设置"
      width="500px"
    >
      <el-form label-suffix="：" label-width="110px">
        <el-form-item label="类型" required>
          <el-select
            v-model="info.buttonform.type"
            placeholder=""
            style="width: 100%"
            clearable
          >
            <el-option label="保存" value="1" />
            <el-option label="自定义事件" value="2" />
            <el-option label="对话框赋值" value="5" />
            <el-option label="弹窗表单" value="3" />
            <el-option label="打印" value="6" />
            <el-option label="返回" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="名字" required>
          <el-input v-model="info.buttonform.name" placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item label="样式">
          <el-select
            v-model="info.buttonform.css"
            placeholder=""
            style="width: 100%"
            clearable
          >
            <el-option label="danger" value="danger">
              <span style="float: left">danger</span>
              <div
                style="
                  float: right;
                  width: 10px;
                  height: 10px;
                  margin-top: 13px;
                  background: #f56c6c;
                "
              ></div>
            </el-option>
            <el-option label="default" value="default">
              <span style="float: left">default</span>
              <div
                style="
                  float: right;
                  width: 11px;
                  height: 11px;
                  margin-top: 13px;
                  background: #ffffff;
                  border: 1px solid #dcdfe6;
                "
              ></div>
            </el-option>
            <el-option label="info" value="info">
              <span style="float: left">info</span>
              <div
                style="
                  float: right;
                  width: 10px;
                  height: 10px;
                  margin-top: 13px;
                  background: #909399;
                "
              ></div>
            </el-option>
            <el-option label="primary" value="primary">
              <span style="float: left">primary</span>
              <div
                style="
                  float: right;
                  width: 10px;
                  height: 10px;
                  margin-top: 13px;
                  background: #409eff;
                "
              ></div>
            </el-option>
            <el-option label="success" value="success">
              <span style="float: left">success</span>
              <div
                style="
                  float: right;
                  width: 10px;
                  height: 10px;
                  margin-top: 13px;
                  background: #67c23a;
                "
              ></div>
            </el-option>
            <el-option label="warning" value="warning">
              <span style="float: left">warning</span>
              <div
                style="
                  float: right;
                  width: 10px;
                  height: 10px;
                  margin-top: 13px;
                  background: #e6a23c;
                "
              ></div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="info.buttonform.type == '5'" label="对话框">
          <el-tag
            v-if="
              info.buttonform.codeValue && info.buttonform.codeValue.length > 0
            "
            closable
            style="margin-right: 10px"
            @close="handleClose(info.buttonform)"
          >
            {{ info.buttonform.nameValue }}
          </el-tag>
          <ab-cust-dialog
            dialog-key="custDialog"
            :dialog-setting="{ multiple: false }"
            size="small"
            style="display: inline-block"
            @ok="chooseDialog($event, info.buttonform)"
          >
            选 择
          </ab-cust-dialog>
        </el-form-item>
        <el-form-item v-if="info.buttonform.type == '5'" label="添加赋值字段">
          <el-button size="small" type="primary" @click="addfzzd">
            添加+
          </el-button>
        </el-form-item>
        <el-form-item
          v-if="
            info.buttonform.type == '5' &&
            info.buttonform.dialogList &&
            info.buttonform.dialogList.length > 0
          "
          label=""
        >
          <el-table border :data="info.buttonform.dialogList">
            <el-table-column label="赋值字段" prop="css">
              <template #default="{ row }">
                <el-select
                  v-model="row.key"
                  placeholder="请选择"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="item in data.column"
                    :key="item.code"
                    :label="item.label"
                    :value="item.code"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="取值" prop="desc">
              <template #default="{ row }">
                <el-select
                  v-model="row.value"
                  allow-create
                  clearable
                  default-first-option
                  filterable
                  placeholder="手输固定值"
                  :reserve-keyword="false"
                >
                  <el-option label="当前时间" value="${curTime}" />
                  <el-option label="当前用户ID" value="${currentUserId}" />
                  <el-option label="Null" value="Null" />
                  <el-option
                    v-for="item in info.buttonform.returnFields"
                    :key="item.returnName"
                    :label="item.showName"
                    :value="item.returnName"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="删除" width="80">
              <template #default="{ row, $index }">
                <el-button
                  :icon="Delete"
                  text
                  type="primary"
                  @click="abUtil.Arrays.del($index, info.buttonform.dialogList)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item
          v-if="info.buttonform.type == '2'"
          label="接口地址"
          required
        >
          <el-input v-model="info.buttonform.url" placeholder="填写接口地址" />
        </el-form-item>
        <!-- <el-form-item v-if="info.buttonform.type == '2'" label="主键入参">
          <el-select
            v-model="info.buttonform.params"
            multiple
            placeholder="请选择(可多选)"
            style="width: 100%"
          >
            <el-option
              v-for="item in formCombination.designJson.params"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item
          v-if="info.buttonform.type == '3'"
          label="表单选择"
          required
        >
          <el-input v-model="info.buttonform.formName" clearable readonly>
            <template #append>
              <ab-cust-dialog
                v-model="info.buttonform"
                dialog-key="formSelector"
                :param="{ type_: 'pc' }"
                type="primary"
                :value-mapping="{ code: 'formKey', name: 'formName' }"
                @ok="chooseButtonform"
              >
                选择
              </ab-cust-dialog>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="info.buttonform.type == '3'" label="赋值设置">
          <el-select
            v-model="info.buttonform.assignment"
            multiple
            placeholder="请选择"
            style="width: 100%"
            value-key="code"
          >
            <el-option
              v-for="item in info.buttonform.assignmentList"
              :key="item.code"
              :label="item.comment"
              :value="item"
            />
          </el-select>
          <el-table
            v-if="
              info.buttonform.type == '3' &&
              info.buttonform.assignment &&
              info.buttonform.assignment.length > 0
            "
            border
            :data="info.buttonform.assignment"
            style="width: 100%; margin-top: 10px"
          >
            <el-table-column label="字段名称" prop="comment">
              <template #default="scope">
                <span>{{ scope.row.comment }}</span>
              </template>
            </el-table-column>
            <el-table-column label="赋值入参" prop="nameParam">
              <template #default="{ row }">
                <el-select
                  v-model="row.nameParam"
                  class="m-2"
                  clearable
                  placeholder="请选择"
                  @clear="clearNameparam($event, row)"
                >
                  <el-option
                    v-for="item in data.column"
                    :key="item.code"
                    :label="item.label"
                    :value="item.code"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-if="info.buttonform.type == '3'" label="是否只读">
          <el-switch v-model="info.buttonform.isReadonly" />
        </el-form-item>
        <!-- <el-form-item v-if="info.buttonform.type == '3'" label="主键入参">
          <el-select
            v-model="info.buttonform.idKey"
            clearable
            placeholder="请选择主键对应的参数"
            style="width: 100%"
          >
            <el-option
              v-for="item in formCombination.designJson.params"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="备注">
          <el-input v-model="info.buttonform.desc" clearable placeholder="请输入"/>
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
  </div>
</template>
<script setup lang="ts">
import * as abUtil from '~/agilebpm/utils/ab-util'
import { Plus,Delete,Edit } from '@element-plus/icons-vue'
import { bizApi, getData } from '~/agilebpm/api'
import * as abTools from '~/agilebpm/utils/ab-tools'

const props = defineProps({
  data: {
    type: Object,
    required : true,
  },
})

const info = reactive({
  dialogVisible: false,
  buttonform: {} as any,
  index:null
})

const { data } = toRefs(props)


if(!data.value.buttonform){
  data.value.buttonform = [{type:'1',name:'保存',css:'primary',desc:'保存',nodel:true},{type:'4',name:'返回',css:'',desc:'返回',nodel:true}]
}

const openDialog = () => {
  info.dialogVisible = true
  info.index = null
  info.buttonform = {}
}

const editButton = (row:any,index:any) => {
  info.dialogVisible = true
  info.index = index
  info.buttonform = JSON.parse(JSON.stringify(row))
}

const ok = () => {
  if(info.index !== null){
    data.value.buttonform[info.index] = JSON.parse(JSON.stringify(info.buttonform))
  }else{
    data.value.buttonform.push(info.buttonform)
  }
  info.dialogVisible = false
}

const addfzzd = () => {
  if (!info.buttonform.dialogList) {
    info.buttonform.dialogList = []
  }
  info.buttonform.dialogList.push({
    key: '',
    value: '',
  })
}

const chooseDialog = (list: any, item: any) => {
  item.codeValue = list[0].code
  item.nameValue = list[0].name
  getData(bizApi.customDialog.getByCode + list[0].code, {}).then(
    (result: any) => {
      if (result.data) {
        item.returnFields = result.data.returnFields
      }
    },
    () => {}
  )
}

const handleClose = (item: any) => {
  item.codeValue = ''
  item.nameValue = ''
  item.dialogList = []
  item.returnFields = []
}

const chooseButtonform = (list: any) => {
    info.buttonform.assignment = []
    info.buttonform.assignmentList = []
    info.buttonform.boCode = list[0].boCode || list[0].bo_Code_
    getKey(info.buttonform.boCode)
  }

const getKey = (boCode: any) => {
  bizApi.bizObject.getBizObject(boCode).then(({ data }) => {
    if (data.rel.table.columns && data.rel.table.columns.length > 0) {
      info.buttonform.assignmentList = JSON.parse(
        JSON.stringify(data.rel.table.columns)
      )
    }
  })
}


</script>
<style lang="scss" scoped>

</style>
