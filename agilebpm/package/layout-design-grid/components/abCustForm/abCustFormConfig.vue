<template>
  <div>
    <el-divider content-position="center">在线表单配置</el-divider>
    <el-form-item label="表单选择">
      <el-input v-model="config.control.formName" readonly>
        <template #append>
          <ab-cust-dialog
            v-model="config.control"
            dialog-key="formSelector"
            :param="{ type_: 'pc' }"
            type="primary"
            :value-mapping="{ code: 'formKey', name: 'formName' }"
            @ok="chooseform"
          >
            选择
          </ab-cust-dialog>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="赋值设置">
      <el-select
        v-model="config.control.formAssignment"
        multiple
        placeholder="请选择"
        style="width: 100%"
        value-key="code"
      >
        <el-option
          v-for="item in config.control.formAssignmentList"
          :key="item.code"
          :label="item.comment"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <div style="width: 100%;padding:0 0 0 16px;">
      <el-alert
        v-if="
          config.control.formAssignment &&
          config.control.formAssignment.length > 0
        "
        :closable="false"
        style="padding:2px 6px;margin-bottom:6px;"
        title="全局参数发生变化将赋值给表单字段"
        type="warning"
      />
      <el-table
        v-if="
          config.control.formAssignment &&
          config.control.formAssignment.length > 0
        "
        border
        :data="config.control.formAssignment" 
        style="width: 100%; margin-top: 10px;margin-bottom: 18px;"
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
              @clear="clearFormNameparam($event, row)"
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
    <el-form-item label="反向赋值">
      <el-select
        v-model="config.control.reverseFormAssignment"
        multiple
        placeholder="请选择"
        style="width: 100%"
        value-key="code"
      >
        <el-option
          v-for="item in config.control.reverseFormAssignmentList"
          :key="item.code"
          :label="item.comment"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <div style="width: 100%;padding:0 0 0 16px;">
      <el-alert
        v-if="
          config.control.reverseFormAssignment &&
          config.control.reverseFormAssignment.length > 0
        "
        :closable="false"
        style="padding:2px 6px;margin-bottom:6px;"
        title="表单字段发生变化，将赋值给全局参数"
        type="warning"
      />
      <el-table
        v-if="
          config.control.reverseFormAssignment &&
          config.control.reverseFormAssignment.length > 0
        "
        border
        :data="config.control.reverseFormAssignment" 
        style="width: 100%; margin-top: 10px;margin-bottom: 18px;"
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
              @clear="clearFormNameparam($event, row)"
            >
              <el-option
                v-for="item in formCombination.designJson.params.filter((it) => config.control.formAssignment.filter((cl) => row.comment == cl.comment)[0] ? it.name !== config.control.formAssignment.filter((cl) => row.comment == cl.comment)[0].nameParam : it)"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-form-item label="主键入参">
      <el-select
        v-model="config.control.idKey"
        clearable
        placeholder="请选择主键对应的参数"
      >
        <el-option
          v-for="item in formCombination.designJson.params"
          :key="item.name"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="是否只读">
      <el-switch v-model="config.control.isReadonly" />
    </el-form-item>
    <el-form-item label="表单按钮">
      <template
        v-if="config.control.formButton && config.control.formButton.length > 0"
      >
        <el-tag
          v-for="item in config.control.formButton"
          :key="item.desc"
          type="success"
          style="margin:6px 6px 6px 0"
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
      title="表单按钮"
      width="50%"
    >
      <el-button :icon="Plus" text type="primary" @click="openDialog(null)">
        添加
      </el-button>
      <el-table border :data="config.control.formButton" row-key="alias">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="类型" prop="type">
          <template #default="{ row }">
            <span v-if="row.type == '1'">保存</span>
            <span v-if="row.type == '2'">自定义事件</span>
            <span v-if="row.type == '3'">弹窗表单</span>
            <span v-if="row.type == '4'">返回</span>
            <span v-if="row.type == '5'">对话框赋值并保存</span>
            <span v-if="row.type == '6'">打印</span>
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
      width="500px"
    >
      <el-form label-suffix="：" label-width="110px">
        <el-form-item label="类型" required>
          <el-select
            v-model="info.buttonform.type"
            placeholder=""
            style="width: 100%"
          >
            <el-option label="保存" value="1" />
            <el-option label="自定义事件" value="2" />
            <el-option label="对话框赋值并保存" value="5" />
            <el-option label="弹窗表单" value="3" />
            <el-option label="打印" value="6" />
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
                >
                  <el-option
                    v-for="item in config.control.formAssignmentList"
                    :key="item.code"
                    :label="item.comment"
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
    <el-form-item label="定时刷新">
      <el-switch v-model="config.control.timedRefresh" />
    </el-form-item>
    <el-form-item
      v-if="config.control.timedRefresh"
      prop="control.refreshCycle"
      :rules="[
        {
          pattern: /^[1-9]\d*$/,
          message: '请输入1以上的正整数（单位/秒）',
          trigger: 'change',
        },
      ]"
    >
      <template #label>
        <div>
          <el-tooltip
            class="box-item"
            content="刷新周期为1以上的正整数（单位/秒）"
            effect="dark"
            placement="top-start"
          >
            <el-icon style="width: 100%; font-style: normal">
              <QuestionFilled />
              刷新周期：
            </el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-input
        v-model="config.control.refreshCycle"
        type="number"
        @change="
          () => {
            if (config.control.refreshCycle < 1) {
              config.control.refreshCycle = 1
            } else {
              if (!Number.isInteger(config.control.refreshCycle))
                // 如果输入值有小数部分，则省略小数部分
                config.control.refreshCycle = Math.floor(
                  config.control.refreshCycle
                )
            }
          }
        "
      />
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { defineProps, PropType, toRefs } from 'vue'
  import { Edit, Plus, DocumentCopy, Delete } from '@element-plus/icons-vue'
  import { bizApi, getData } from '~/agilebpm/api'
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
    formAssignment: [],
    dialogVisible: false,
    editDialog: false,
    buttonform: {} as any,
    isEdit: false,
  })

  const getFlatComponentList = inject('getFlatComponentList') as any
  onMounted(() => {
    if (!config.value.control.formButton) {
      config.value.control.formButton = [
        { name: '保存', type: '1', css: 'primary', desc: '保存接口' },
        { name: '返回', type: '4', css: '', desc: '返回' },
      ]
    }
    //兼容老数据，对于之前没有过定时时间的都默认10
    if (!config.value.control.refreshCycle) {
      config.value.control.refreshCycle = 10
    }
  })

  watch(
    () => config.value.control.formName,
    (newValue) => {
      if (newValue) {
        config.value.control.formAssignmentList = []
        config.value.control.reverseFormAssignmentList = []
        config.value.label = `${newValue}-表单`
        if (!config.value.control.boCode) {
          bizApi.customDialog
            .listDataByCode('formSelector', {
              queryParam: {
                code_$VLK: config.value.control.formKey,
                type_$VEQ: 'pc',
              },
            })
            .then(
              (res) => {
                const list = res.data.rows
                config.value.control.boCode =
                  list[0].boCode || list[0].bo_Code_ || list[0].bo_code_
                getFormAssignmentHtml(config.value.control.boCode)
              },
              () => {}
            )
        } else {
          getFormAssignmentHtml(config.value.control.boCode)
        }
      }
    }
  )

  const chooseform = (list: any) => {
    config.value.control.formAssignment = []
    config.value.control.reverseFormAssignment = []
    config.value.control.formAssignmentList = []
    config.value.control.reverseFormAssignmentList = []
    config.value.control.boCode = list[0].boCode || list[0].bo_Code_
    getFormAssignmentHtml(config.value.control.boCode)
    getDesignCode(list[0].code)
  }

  const getDesignCode = async (code:any) => {
    const resultDesign = await bizApi.bizForm.getDesignCode(code)
    if (resultDesign.data && resultDesign.data.pcJson && resultDesign.data.pcJson.buttonform) {
      config.value.control.formButton = JSON.parse(JSON.stringify(resultDesign.data.pcJson.buttonform))
    }else{
      config.value.control.formButton = [
        { name: '保存', type: '1', css: 'primary', desc: '保存接口' },
        { name: '返回', type: '4', css: '', desc: '返回' },
      ]
    }
  }

  const chooseButtonform = (list: any) => {
    info.buttonform.assignment = []
    config.value.control.assignment = []
    info.buttonform.boCode = list[0].boCode || list[0].bo_Code_
    getKey(info.buttonform.boCode)
  }

  const clearFormNameparam = (item: any, row: any) => {
    if (row.value && row.value.length > 0) {
      row.value = ''
    }
  }

  const clearNameparam = (item: any, row: any) => {
    if (row.value && row.value.length > 0) {
      row.value = ''
    }
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

  const getFormAssignmentHtml = (boCode: any) => {
    // 获取在线表单后，再渲染在线表单
    bizApi.bizObject.getBizObject(boCode).then(({ data }) => {
      if (data.rel.table.columns && data.rel.table.columns.length > 0) {
        config.value.control.formAssignmentList = JSON.parse(
          JSON.stringify(data.rel.table.columns)
        )
        config.value.control.reverseFormAssignmentList = JSON.parse(
          JSON.stringify(data.rel.table.columns)
        )
      }
    })
  }

  if (config.value.control.boCode) {
    getFormAssignmentHtml(config.value.control.boCode)
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

  const addfzzd = () => {
    if (!info.buttonform.dialogList) {
      info.buttonform.dialogList = []
    }
    info.buttonform.dialogList.push({
      key: '',
      value: '',
    })
  }
</script>
