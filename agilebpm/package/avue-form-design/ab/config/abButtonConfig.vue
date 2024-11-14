<template>
  <div class="widget-config">
    <el-form
      :model="data"
      label-suffix="："
      labelPosition="right"
      labelWidth="90px"
      @submit.prevent
    >
      <el-form-item
        label="文案"
        prop="text"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input v-model="data.text" placeholder="请输入文案"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="btnType">
        <el-select v-model="data.btnType">
          <el-option value="" label="默认"></el-option>
          <el-option value="primary" label="主要"></el-option>
          <el-option value="success" label="成功"></el-option>
          <el-option value="info" label="信息"></el-option>
          <el-option value="warning" label="警告"></el-option>
          <el-option value="danger" label="错误"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="形状" prop="round">
        <el-switch
          v-model="data.round"
          inline-prompt
          active-text="圆"
          inactive-text="方"
        />
      </el-form-item>

      <el-form-item label="按钮行为" prop="action">
        <el-select v-model="data.action" @change="actionChange">
          <el-option value="js" label="js" />
          <el-option value="dialog" label="对话框" />
          <el-option value="query" label="联动查询" />
          <el-option value="form" label="弹框表单" />
        </el-select>
      </el-form-item>

      <el-form-item label="js脚本" v-if="data.action == 'js'">
        <el-tooltip placement="top">
          <template #content>
            系统生成按钮事件@click="输入的js脚本"
            <br />
            1.可以直接写js。
            <br />
            eg：a=1+1。系统会生成对应代码：@click="a=1+1"
            <br />
            2.可以调用在表单源码模式上定义的方法。
            <br />
            eg：test(参数1,参数2...)。对应代码：@click="test(参数1,参数2...)"
          </template>
          <el-input v-model="data.js" placeholder="请输入js"></el-input>
        </el-tooltip>
      </el-form-item>

      <span v-else-if="data.action == 'form'">
        <el-form-item label="表单选择">
          <el-input v-model="data.buttonform.formName" clearable readonly>
            <template #append>
              <ab-cust-dialog
                v-model="data.buttonform"
                dialog-key="formDesignSelector"
                type="primary"
                :value-mapping="{ code: 'formCode', name: 'formName' }"
                @ok="chooseButtonform"
              >
                选择
              </ab-cust-dialog>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="赋值设置">
          <el-select
            v-if="formBo"
            v-model="data.buttonform.assignment"
            multiple
            placeholder="请选择"
            style="width: 100%"
            value-key="code"
          >
            <el-option
              v-for="item in formBo.rel.table.columns"
              :key="item.code"
              :label="item.comment"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label-width="0">
          <el-table
            v-if="data.buttonform.assignment.length > 0"
            border
            :data="data.buttonform.assignment"
            style="width: 100%"
          >
            <el-table-column label="外部表单字段" prop="comment">
              <template #default="scope">
                <span>{{ scope.row.comment }}</span>
              </template>
            </el-table-column>
            <el-table-column label="当前表单字段" prop="nameParam">
              <template #default="{ row }">
                <el-select
                  v-model="row.nameParam"
                  class="m-2"
                  clearable
                  placeholder="请选择"
                >
                  <el-option-group
                    v-for="rel in getRels('oneToOne')"
                    :label="rel.table.comment"
                  >
                    <el-option
                      v-for="val in rel.table.columns"
                      :key="`${rel.table.code}.${val.code}`"
                      :label="val.comment"
                      :value="`${rel.table.code}.${val.code}`"
                    />
                  </el-option-group>
                  <el-option-group
                    v-if="getMainRel().parent"
                    :label="getMainRel().parent.table.comment"
                  >
                    <el-option
                      v-for="val in getMainRel().parent.table.columns"
                      :key="`${getMainRel().parent.table.code}.${val.code}`"
                      :label="val.comment"
                      :value="`${getMainRel().parent.table.code}.${val.code}`"
                    />
                  </el-option-group>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="是否只读">
          <el-switch v-model="data.buttonform.isReadOnly" />
        </el-form-item>
      </span>

      <el-form-item label="配置" v-else>
        <el-tag v-if="data.dialog && data.dialog.ctrDialogConfig.dialogName">
          {{ data.dialog.ctrDialogConfig.dialogName }}
        </el-tag>
        <el-button
          style="margin-left: 5px"
          type="primary"
          @click="openDialog"
          size="small"
        >
          配置
        </el-button>
      </el-form-item>

      <el-form-item label="控件栅格">
        <el-slider
          v-model="data.span"
          :max="24"
          :min="2"
          show-stops
          :step="1"
          style="width: 90%"
        />
        <el-radio-group v-model.number="data.span">
          <el-radio-button label="24">一列</el-radio-button>
          <el-radio-button label="12">两列</el-radio-button>
          <el-radio-button label="8">三列</el-radio-button>
          <el-radio-button label="6">四列</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!--自定义对话框-->
    <el-dialog v-model="dialogVisible" title="对话框配置" width="600px">
      <el-form
        :model="dialogData"
        label-suffix="："
        labelPosition="right"
        labelWidth="90px"
      >
        <ab-custom-dialog-config
          v-if="dialogVisible"
          :no-mult="data.action == 'query'"
          no-desc
          :is-dialog="true"
          :data="dialogData"
          :form="form"
        ></ab-custom-dialog-config>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button text type="primary" @click="dialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogOk">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { bizApi, getData } from '~/agilebpm/api'
  import { inject } from 'vue'

  export default {
    name: 'ab-button-config',
    props: ['data', 'form'],
    components: {},
    setup() {
      return {}
    },
    computed: {},
    data() {
      return {
        dialogVisible: false,
        dialogData: {},
        tableCode: '', //按钮所在的表
        formBo: null, //弹框表单选择的表单的bo信息
        bo: null, //表单设计bo
      }
    },
    mounted() {
      const isBo =
        abTools.useCurrentInstance().proxy.$route.query.mode != 'diyBo'
      const getBoFn = inject('getBo')
      this.bo = getBoFn()
      const getParentFn = inject('getParent')
      const parent = getParentFn(this.form, this.form.column, this.data.prop)
      if (!parent.children || !parent.subTable) {
        //主表
        this.tableCode = this.bo.rel.tableCode
      } else {
        this.tableCode = parent.code
        if (!isBo) {
          this.tableCode = `${this.form.code}_${parent.code}${window.BIZ_TABLE_SUFFIX}`
        }
      }
      this.data.buttonform = this.data.buttonform || {}
      this.actionChange()
    },
    methods: {
      openDialog() {
        if (!this.data.dialog) {
          this.data.dialog = {
            tableCode: this.tableCode,
            ctrDialogConfig: {},
          }
        }
        this.dialogData = abUtil.clone(this.data.dialog)
        this.dialogVisible = true
      },
      dialogOk() {
        let conf = this.dialogData.ctrDialogConfig
        if (!conf.dialogName) {
          ElMessage({
            type: 'warning',
            message: '请选择对话框',
          })
          return
        }
        if (!conf.searchDesc) {
          ElMessage({
            type: 'warning',
            message: '请输入搜索文本',
          })
          return
        }
        let b = false
        if (conf.mappingFields) {
          conf.mappingFields.forEach((mf) => {
            if (!mf.boField || !mf.dialogField) {
              b = true
            }
          })
        }
        if (!conf.mappingFields || conf.mappingFields.length == 0) {
          b = true
        }

        if (b) {
          ElMessage({
            type: 'warning',
            message: '请正确配置映射关系',
          })
          return
        }

        this.data.dialog = this.dialogData
        this.dialogVisible = false
      },
      chooseButtonform(list) {
        this.data.buttonform.assignment = []
        this.data.buttonform.boCode = list[0].boCode || list[0].bo_Code_
        this.getFormBo()
      },
      getFormBo() {
        let boCode = this.data.buttonform.boCode
        if (!boCode) {
          return
        }
        this.formBo = null
        bizApi.bizObject.getBizObject(boCode).then(({ data }) => {
          this.formBo = data
        })
      },
      actionChange() {
        if (this.data.action == 'form') {
          this.getFormBo()
        }
      },
      getRel(tableCode, rel) {
        if (!rel) {
          rel = this.bo.rel
        }

        if (rel.tableCode == tableCode) {
          return rel
        }
        let result
        rel.children.forEach((r) => {
          result = this.getRel(tableCode, r) || result
        })

        return result
      },
      getRels(type, rel) {
        if (!rel) {
          rel = this.getMainRel()
        }
        let list = []
        list.push(rel)
        rel.children.forEach((re) => {
          if (!type || re.type == type) {
            list.push(re)
          }
        })

        return list
      },
      getMainRel() {
        return this.getRel(this.tableCode)
      },
    },
  }
</script>
