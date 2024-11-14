<template>
  <div>
    <el-divider content-position="center">工具条配置</el-divider>
    <el-form-item label="操作按钮">
      <template
        v-if="config.control.formButton && config.control.formButton.length > 0"
      >
        <el-tag
          v-for="item in config.control.formButton"
          :key="item.desc"
          type="success"
        >
          {{ item.name }}
        </el-tag>
      </template>
      <el-button :icon="Edit" text type="primary" @click="open">设置</el-button>
    </el-form-item>
    <el-alert
      title="主键入参取全局联动参数，如果主键发生变化，会触发表单重新加载"
      type="info"
    />
    <el-dialog
      v-model="info.dialogVisible"
      append-to-body
      destroy-on-close
      title="操作按钮"
      width="50%"
    >
      <el-button :icon="Plus" text type="primary" @click="openDialog(null)">
        添加
      </el-button>
      <el-table border :data="config.control.formButton" row-key="alias">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="类型" prop="type">
          <template #default="{ row }">
            <!-- <span v-if="row.type == '1'">保存</span> -->
            <span v-if="row.type == '2'">自定义事件</span>
            <span v-if="row.type == '3'">弹窗表单</span>
            <span v-if="row.type == '4'">返回</span>
          </template>
        </el-table-column>
        <el-table-column label="样式" prop="css" />
        <el-table-column label="备注" prop="desc" />
        <el-table-column label="管理" width="290">
          <template #default="{ row, $index }">
            <el-button
              :icon="Edit"
              text
              type="primary"
              @click="openDialog(row)"
            >
              修改
            </el-button>
            <el-button
              v-if="!row.defualt"
              :icon="Delete"
              text
              type="danger"
              @click="abUtil.Arrays.del($index, config.control.formButton)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog
      v-model="info.editDialog"
      append-to-body
      :close-on-click-modal="false"
      title="定义按钮"
      width="420px"
    >
      <el-form label-suffix="：" label-width="110px">
        <el-form-item label="类型" required>
          <el-select
            v-model="info.buttonform.type"
            placeholder=""
            style="width: 100%"
          >
            <!-- <el-option label="保存" value="1" /> -->
            <el-option label="自定义事件" value="2" />
            <el-option label="弹窗表单" value="3" />
            <el-option label="返回" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="名字" required>
          <el-input v-model="info.buttonform.name" />
        </el-form-item>
        <el-form-item label="样式">
          <el-select
            v-model="info.buttonform.css"
            placeholder=""
            style="width: 100%"
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
        <el-form-item
          v-if="info.buttonform.type == '2'"
          label="接口地址"
          required
        >
          <el-input v-model="info.buttonform.url" placeholder="填写接口地址" />
        </el-form-item>
        <el-form-item v-if="info.buttonform.type == '2'" label="主键入参">
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
        </el-form-item>
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
          <div v-if="info.assignment && info.assignment.length > 0" style="width:100%;">
            <el-select
              v-model="info.buttonform.assignment"
              multiple
              placeholder="请选择"
              style="width: 100%"
              value-key="key"
              @change="changeAssignment"
            >
              <el-option
                v-for="item in info.assignment"
                :key="item.key"
                :label="item.key"
                :value="item"
              />
            </el-select>
            <el-table
              v-if="info.buttonform.type == '3'"
              border
              :data="info.buttonform.assignment"
              style="width: 100%; margin-top: 10px"
            >
              <el-table-column label="字段名称" prop="key">
                <template #default="scope">
                  <span>{{ scope.row.key }}</span>
                </template>
              </el-table-column>
              <el-table-column label="全局入参" prop="nameParam">
                <template #default="{ row }">
                  <el-select
                    v-model="row.nameParam"
                    class="m-2"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in formCombination.designJson.params"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else style="width:100%;">
            <el-select
              v-model="info.buttonform.assignment"
              multiple
              placeholder="请选择"
              style="width: 100%"
              value-key="code"
            >
              <el-option
                v-for="item in config.control.assignment"
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
              <el-table-column label="全局入参" prop="nameParam">
                <template #default="{ row }">
                  <el-select
                    v-model="row.nameParam"
                    class="m-2"
                    clearable
                    placeholder="请选择"
                    @clear="clearNameparam($event, row)"
                  >
                    <el-option
                      v-for="item in formCombination.designJson.params"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>

        <el-form-item v-if="info.buttonform.type == '3'" label="是否只读">
          <el-switch v-model="info.buttonform.isReadonly" />
        </el-form-item>
        <el-form-item v-if="info.buttonform.type == '3'" label="主键入参">
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
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="info.buttonform.desc" />
        </el-form-item>
        <el-form-item label="联动刷新组件">
          <el-select
            v-model="info.buttonform.linkageRefresh"
            :multiple="true"
            style="width: 100%"
          >
            <template v-for="item in getFlatComponentList()" :key="item.key">
              <el-option :label="item.label" :value="item.key" />
            </template>
          </el-select>
        </el-form-item>
        <!-- <el-collapse v-if="info.buttonform.type == '2'" v-model="activeNames">
          <el-collapse-item name="1" title="后置操作">
            <el-form-item label="是否刷新">
              <el-switch v-model="info.buttonform.reload" />
            </el-form-item>
            <el-form-item label="js">
              <el-input v-model="info.buttonform.js" type="textarea" />
            </el-form-item>
          </el-collapse-item>
        </el-collapse> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-space wrap>
            <el-button text type="primary" @click="info.editDialog = false">
              取消
            </el-button>
            <el-button type="primary" @click="editDialogOk">确定</el-button>
          </el-space>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { defineProps, PropType, toRefs } from 'vue'
  import { Edit, Plus, DocumentCopy, Delete } from '@element-plus/icons-vue'
  import { bizApi } from '~/agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  const props = defineProps({
    config: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
    formCombination: {
      required: true,
      type: Object as PropType<FormCombination>,
    },
  })
  const { config, formCombination } = toRefs(props)
  const activeNames = ref(['0'])
  const info = reactive({
    dialogVisible: false,
    editDialog: false,
    buttonform: {} as any,
    isEdit: false,
    assignment: [],
  })

  const getFlatComponentList = inject('getFlatComponentList') as any
  onMounted(() => {
    if (!config.value.control.formButton) {
      config.value.control.formButton = []
    }
  })

  watch(
    () => config.value.control.formName,
    (newValue) => (config.value.label = `${newValue}-表单`)
  )

  const chooseButtonform = (list: any) => {
    info.assignment = []
    info.buttonform.assignment = []
    config.value.control.assignment = []
    info.buttonform.boCode = list[0].boCode || list[0].bo_Code_
    getKey(info.buttonform.boCode)
  }

  const getKey = (boCode: any) => {
    bizApi.bizObject.getBizObject(boCode).then(({ data }) => {
      if (data.rel.table.columns && data.rel.table.columns.length > 0) {
        config.value.control.assignment = JSON.parse(
          JSON.stringify(data.rel.table.columns)
        )
      }
    })
  }
  

  const clearNameparam = (item: any, row: any) => {
    if (row.value && row.value.length > 0) {
      row.value = ''
    }
  }

  const getFormHtml = (code: any) => {
    // 获取在线表单后，再渲染在线表单
    info.assignment = []
    bizApi.bizForm.getFormData(code).then(({ data }) => {
      const obj = data.data[data.bizForm.boCode]
      for (const key in obj) {
        if (key !== '_loadMap') {
          info.assignment.push({
            key: key,
            value: obj[key],
          })
        }
      }
    })
  }

  const open = () => {
    info.dialogVisible = true
  }
  const ok = () => {
    info.dialogVisible = false
  }
  const openDialog = (row: any) => {
    if (!row) {
      row = {}
      info.isEdit = false
    } else {
      info.isEdit = true
    }
    info.buttonform = row
    info.editDialog = true
    if (row.type == '3') {
      if(row.assignment && row.assignment.length > 0 && row.assignment[0].comment){
        config.value.control.assignment = []
        if (!row.boCode) {
          bizApi.customDialog
            .listDataByCode('formSelector', {
              queryParam: { code_$VLK: row.formKey, type_$VEQ: 'pc' },
            })
            .then(
              (res) => {
                const list = res.data.rows
                row.boCode =
                  list[0].boCode || list[0].bo_Code_ || list[0].bo_code_
                getKey(row.boCode)
              },
              () => {}
            )
        } else {
          getKey(row.boCode)
        }
      }else{
        // 兼容老数据
        getFormHtml(row.formKey)
      }
    }
  }
  const editDialogOk = () => {
    if (!info.buttonform.name || !info.buttonform.type) {
      ElMessage({
        message: '请完善必填项',
        type: 'warning',
      })
      return
    }
    if (info.buttonform.type == '2') {
      if (!info.buttonform.url) {
        ElMessage({
          message: '请完善必填项',
          type: 'warning',
        })
        return
      }
    }
    if (info.buttonform.type == '3') {
      if (!info.buttonform.formName) {
        ElMessage({
          message: '请完善必填项',
          type: 'warning',
        })
        return
      }
    }
    if (!info.isEdit) {
      props.config.control.formButton.push(info.buttonform)
    }
    info.editDialog = false
  }
</script>
