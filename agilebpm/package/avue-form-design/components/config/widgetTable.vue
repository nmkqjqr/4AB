<template>
  <div class="widget-config">
    <el-form
      label-suffix="："
      v-if="data && Object.keys(data).length > 0"
      labelPosition="left"
      labelWidth="90px"
      :model="data"
      @submit.prevent
    >
      <el-form-item label="子表编码" v-if="data.subTable">
        <el-input
          v-model="data.code"
          :disabled="!!abRel"
          clearable
          placeholder="请输入子表编码"
          maxlength="10"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="分组编码" v-else>
        <el-tag>{{ data.code }}</el-tag>
      </el-form-item>
      <el-form-item label="子表表名" v-if="!isBo && data.subTable && form.code">
        {{ getDiyTableName() }}
      </el-form-item>
      <el-form-item
        prop="label"
        :label="data.subTable ? '子表描述' : '分组描述'"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input
          v-model="data.label"
          clearable
          placeholder="请输入描述"
          maxlength="30"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="关系类型" v-if="abRel">
        <el-tag>{{ abRel.typeDesc }}</el-tag>
      </el-form-item>
      <el-form-item label="子表类型" v-if="data.subTable && isBo">
        <el-radio-group v-model="data.type">
          <el-radio-button label="group" :disabled="dataTypeDisabled()">
            块子表
          </el-radio-button>
          <el-radio-button label="dynamic">行子表</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="data.type != 'dynamic'"
        :label="data.subTable ? '修改子表栅格' : '修改分组栅格'"
        label-width="110px"
      >
        <el-slider
          v-model="span"
          :max="24"
          :min="4"
          show-stops
          :step="2"
          style="width: 90%"
          @change="setSpan"
        />
        <el-radio-group v-model.number="span" @change="setSpan">
          <el-radio-button label="24">一列</el-radio-button>
          <el-radio-button label="12">两列</el-radio-button>
          <el-radio-button label="8">三列</el-radio-button>
          <el-radio-button label="6">四列</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="data.subTable"
        label="初始化一条数据"
        label-width="130px"
      >
        <el-switch
          v-model="data.initFirstRow"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>

      <el-form-item v-if="isThree" label="弹框方式">
        <el-radio-group v-model="data.openType">
          <el-radio-button label="dialog">对话框</el-radio-button>
          <el-radio-button label="drawer">抽屉</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="data.subTable && data.type == 'dynamic'"
        label="子表序号"
      >
        <el-switch
          v-model="data.sn"
          inline-prompt
          active-text="显示"
          inactive-text="隐藏"
        />
      </el-form-item>

      <el-form-item
        v-if="data.subTable && data.type == 'dynamic'"
        label="子表分页"
      >
        <el-switch
          v-model="data.page"
          inline-prompt
          active-text="是"
          inactive-text="否"
          @change="data.pageNum = data.pageNum || 10"
        />

        <span style="margin-left: 10px" v-if="data.page">
          分页大小：
          <el-input-number
            size="small"
            style="width: 80px; margin-left: 0px"
            v-model="data.pageNum"
            controls-position="right"
            :min="1"
            placeholder="分页大小"
            :max="50"
          ></el-input-number>
        </span>
      </el-form-item>

      <!--子表字段-->
      <div class="el-form--label-top" v-if="data.subTable && isBo">
        <div class="el-form-item">
          <label class="el-form-item__label" style="padding: 0">
            子表字段：
          </label>
          <div class="el-form-item__content">
            <el-space wrap>
              <el-button
                v-if="columns.length > 0"
                v-for="c in columns"
                size="small"
                @click="addColumn(c)"
              >
                {{ c.title }}
              </el-button>
              <el-tag v-else>字段都在表单内</el-tag>
            </el-space>
          </div>
        </div>
      </div>

      <!--子表按钮-->
      <div class="el-form--label-top" v-if="data.subTable">
        <div class="el-form-item">
          <label style="font-size: 14px">子表按钮：</label>
          <el-tag v-for="b in buttons" @click="addButton(b)">
            {{ `${b.name}` }}
          </el-tag>

          <!-- <el-button size="small" style="margin-left: 10px;cursor: pointer;" type="primary" :icon="Plus" @click="openDialog()"/> -->
          <el-dropdown @command="handleCommand">
            <el-button type="primary" size="small" style="margin-left: 10px">
              添加
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="Search" command="dialog">
                  对话框按钮
                </el-dropdown-item>
                <el-dropdown-item :icon="Plus" command="js">
                  js按钮
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="el-form-item__content">
            <el-table :data="data.buttons" style="margin-top: 18px">
              <el-table-column prop="name" label="描述" />
              <el-table-column label="类型">
                <template #default="scope">
                  <el-tag>{{ btnDescMap[scope.row.key] }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" align="center">
                <template #default="scope">
                  <el-icon
                    style="margin-right: 5px; cursor: pointer"
                    v-if="scope.row.key == 'dialog'"
                    @click="openDialog(scope.row)"
                  >
                    <Edit />
                  </el-icon>
                  <el-icon
                    style="margin-right: 5px; cursor: pointer"
                    v-if="scope.row.key == 'js'"
                    @click="openJs(scope.row)"
                  >
                    <Edit />
                  </el-icon>
                  <el-icon
                    style="cursor: pointer"
                    @click="abUtil.Arrays.del(scope.$index, data.buttons)"
                  >
                    <Delete />
                  </el-icon>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <el-form-item
        v-if="data.subTable && data.type == 'group'"
        label="行子表模式"
        label-width="94px"
      >
        <el-switch
          v-model="data.subtableMode"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
        <el-button
          v-if="data.subtableMode"
          @click="setdisplayField"
          type="primary"
          size="small"
          style="margin-left: 10px"
        >
          设置显示字段
        </el-button>
      </el-form-item>
      <div v-if="data.subTable && data.type == 'group' && data.subtableMode">
        <draggable
          v-model="data.subtableModeList"
          item-key="code"
          :animation="200"
          style="position: relative; display: flex; flex-wrap: wrap"
        >
          <template #item="{ element: item }">
            <div class="move-btn">
              <el-col :span="24" style="margin-bottom: 5px">
                <el-card body-style="padding: 10px;width:260px" shadow="hover">
                  <el-row>
                    <el-col :span="8">
                      {{ item.label }}
                    </el-col>
                    <el-col class="flex-right" :span="4">
                      <el-icon
                        style="color: #ff4d4f; cursor: pointer"
                        @click="
                          abUtil.Arrays.remove(item, data.subtableModeList)
                        "
                      >
                        <Delete />
                      </el-icon>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </div>
          </template>
        </draggable>
      </div>
      <el-form-item
        v-if="data.subTable && data.type == 'group' && data.subtableMode"
        label="编辑方式"
        :style="{
          marginTop:
            data.subtableModeList && data.subtableModeList.length > 0
              ? '18px'
              : '0',
        }"
      >
        <el-radio-group v-model="data.editType">
          <el-radio-button label="dialog">对话框</el-radio-button>
          <el-radio-button label="drawer">抽屉</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="data.subTable && data.type == 'group' && data.subtableMode"
        label="子表分页"
      >
        <el-switch
          v-model="data.page"
          inline-prompt
          active-text="是"
          inactive-text="否"
          @change="data.pageNum = data.pageNum || 10"
        />
        <span style="margin-left: 10px" v-if="data.page">
          分页大小：
          <el-input-number
            size="small"
            style="width: 80px; margin-left: 0px"
            v-model="data.pageNum"
            controls-position="right"
            :min="1"
            placeholder="分页大小"
            :max="50"
          ></el-input-number>
        </span>
      </el-form-item>

      <table-plugins
        v-if="data.subTable"
        :option="data"
        :form="form"
      ></table-plugins>
    </el-form>
    <el-empty
      v-else
      description="拖拽字段进行配置"
      style="margin-top: 90%"
    ></el-empty>

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

    <!--js-->
    <el-dialog v-model="jsVisible" title="js配置" width="600px">
      <el-form
        :model="jsData"
        label-suffix="："
        labelPosition="right"
        labelWidth="90px"
      >
        <el-form-item label="数据路径">
          <el-tag v-if="!isBo">
            {{
              `data.${designCode}${win.BO_SUFFIX}.${designCode}_${data.code}${win.BIZ_TABLE_SUFFIX}List`
            }}
          </el-tag>
          <el-tag v-else>{{ `data.${form.boCode}.${data.code}List` }}</el-tag>
        </el-form-item>
        <el-form-item label="js脚本">
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
            <el-input
              v-model="jsData.js"
              clearable
              placeholder="请输入js脚本"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="jsData.name"
            clearable
            placeholder="请输入js描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button text type="primary" @click="jsVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="jsOk">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--配置行子表显示字段-->
    <el-dialog v-model="displayFieldsVisible" title="显示字段" width="600px">
      <el-checkbox v-model="checkAll" @change="handleCheckAllChange">
        全选
      </el-checkbox>
      <el-checkbox-group
        v-model="checkedDisplayFields"
        @change="handleDisplayFieldsChange"
      >
        <el-checkbox
          v-for="(checkItem, index) in data.children.column"
          :key="index"
          :label="checkItem.label"
          :value="checkItem.code"
        >
          {{ checkItem.label }}
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <span class="dialog-footer">
          <el-button text type="primary" @click="displayFieldsVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="displayOk">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import tablePlugins from './tablePlugins.vue'
  import { ElMessage } from 'element-plus'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { Search, Plus, Delete, Edit } from '@element-plus/icons-vue'
  import Draggable from 'vuedraggable'
  import { inject } from 'vue'

  export default {
    name: 'widget-table',
    props: ['data', 'form', 'isOracle'],
    components: { tablePlugins, Plus, abUtil, Edit, Delete, Search, Draggable },
    setup() {
      return {
        Plus,
        abUtil,
        Search,
        Delete,
      }
    },
    computed: {
      columns() {
        let list = []
        if (!this.abRel) {
          return list
        }
        window.ab_getColumns(this.abRel).forEach((c) => {
          if (
            c.primary ||
            this.data.children.column.find((item) => item.code == c.code)
          ) {
            //不显示主键 || 已经存在该字段
            return
          }
          let title = c.comment
          if (c.tableType == 'oneToOne') {
            //一对一子表
            title = `${c.comment}（${c.tableComment}）`
          }
          c.title = title
          list.push(c)
        })
        return list
      },
      buttons() {
        let list = []
        if (!this.data.buttons) {
          return list
        }
        this.defaultBtns.forEach((btn) => {
          if (!this.data.buttons.find((b) => b.key == btn.key)) {
            list.push(btn)
          }
        })
        return list
      },
    },
    data() {
      return {
        collapse: ['1'],
        span: 0,
        defaultBtns: [
          {
            key: 'add',
            name: '添加',
          },
          {
            key: 'imp',
            name: '导入',
          },
          {
            key: 'copy',
            name: '复制',
          },
          {
            key: 'exp',
            name: '导出',
          },
          {
            key: 'del',
            name: '移除',
          },
        ],
        btnDescMap: {
          add: '添加',
          del: '移除',
          dialog: '对话框',
          js: 'js按钮',
          imp: '导入',
          exp: '导出',
          copy: '复制',
          move: '移动',
        },
        isBo: abTools.useCurrentInstance().proxy.$route.query.mode != 'diyBo',
        abRel: null,
        dialogVisible: false,
        dialogData: {},
        dialogNewData: false,
        jsVisible: false,
        jsData: {},
        jsNewData: false,
        designCode: '',
        win: window,
        isThree: false, //是否第三层或以上
        displayFieldsVisible: false,
        checkAll: false,
        checkedDisplayFields: [],
      }
    },
    mounted() {
      if (window.ab_bo && this.data.code && this.data.subTable) {
        this.abRel = window.ab_bo.getRel(this.data.code)
        this.isThree =
          this.abRel.type == 'oneToMany' &&
          this.abRel.parent &&
          this.abRel.parent.type == 'oneToMany'
      }
      //行子表且有排序字段
      if (
        this.data.subTable &&
        this.data.type == 'dynamic' &&
        this.data.children.column.find((c) => c.type == 'sn')
      ) {
        this.defaultBtns.push({
          key: 'move',
          name: '移动',
        })
      }
      if (!this.data.buttons && this.data.subTable) {
        this.data.buttons = abUtil.clone(this.defaultBtns)
      }
      this.designCode = this.form.code || window.DESIGN_CODE
      this.data.openType = this.data.openType || 'drawer'
      this.data.editType = this.data.editType || 'dialog'
    },
    methods: {
      setSpan() {
        this.data.children.column.forEach((c) => {
          if (!c.fixSpan) {
            c.span = this.span
          }
        })
        ElMessage({
          message: '修改栅格成功',
          type: 'success',
        })
      },
      addColumn(c) {
        let cjson = {
          prop: 'ab' + Date.now() + Math.ceil(Math.random() * 99999),
          type: 'onetext', //控件类型，这里改用了ab的BizColumnCtrlType枚举
          label: c.comment,
          icon: 'icon-input',
          span: this.form.span,
          display: true,
          maxlength: c.length,
          decimal: c.decimal,
          //placeholder: `请输入${c.comment}`,
          //labelWidth: 120,
          //下面字段由ab定义
          code: c.code, //字段编码
          //abColumn: c, //字段详情
          defaultValue: '', //默认值
          update: 0, //默认值更新
          rules: [], //校验
          fieldType: c.type, //字段类型
          unique: 0, //唯一键
          tableCode: c.tableCode,
        }
        this.data.children.column.push(cjson)
      },
      addButton(b) {
        this.data.buttons.push(b)
      },
      openDialog(data) {
        this.dialogNewData = false
        if (!data) {
          this.dialogNewData = true
          this.dialogData = {
            tableCode: this.data.code,
            ctrDialogConfig: {},
            key: 'dialog',
            name: '对话框',
          }
        } else {
          this.dialogData = data
        }

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

        this.dialogData.name = this.dialogData.ctrDialogConfig.searchDesc
        if (this.dialogNewData) {
          this.data.buttons.push(this.dialogData)
        }
        this.dialogVisible = false
      },
      handleCommand(command) {
        if (command == 'dialog') {
          this.openDialog()
        }
        if (command == 'js') {
          this.openJs()
        }
      },
      openJs(data) {
        this.jsNewData = false
        if (!data) {
          this.jsNewData = true
          this.jsData = {
            key: 'js',
            name: 'js按钮',
            js: '',
          }
        } else {
          this.jsData = data
        }

        this.jsVisible = true
      },
      jsOk() {
        if (!this.jsData.js || !this.jsData.name) {
          ElMessage({
            type: 'warning',
            message: '请输入js脚本和描述',
          })
          return
        }

        if (this.jsNewData) {
          this.data.buttons.push(this.jsData)
        }
        this.jsVisible = false
      },
      getDiyTableName() {
        return `${this.form.code}_${this.data.code}${window.BIZ_TABLE_SUFFIX}`
      },

      setdisplayField() {
        this.displayFieldsVisible = true
        this.checkedDisplayFields = []
        if (
          this.data.subtableModeList &&
          this.data.subtableModeList.length > 0
        ) {
          this.data.subtableModeList.forEach((item) => {
            this.checkedDisplayFields.push(item.code)
          })
        }
        this.checkAll =
          this.checkedDisplayFields.length == this.data.children.column.length
            ? true
            : false
      },

      handleCheckAllChange(val) {
        if (val) {
          this.checkedDisplayFields = []
          this.data.children.column.forEach((item) => {
            this.checkedDisplayFields.push(item.code)
          })
        } else {
          this.checkedDisplayFields = []
        }
      },

      handleDisplayFieldsChange(value) {
        const checkedCount = value.length
        this.checkAll = checkedCount === this.data.children.column.length
      },

      displayOk() {
        this.data.subtableModeList = []
        this.checkedDisplayFields.forEach((code) => {
          this.data.children.column.forEach((item) => {
            if (code == item.code) {
              this.data.subtableModeList.push({
                label: item.label,
                code: item.code,
              })
            }
          })
        })
        this.displayFieldsVisible = false
      },
      dataTypeDisabled() {
        const getParentFn = inject('getParent')
        const parent = getParentFn(this.form, this.form.column, this.data.prop)
        //分组下不支持切换块子表
        if (parent && parent.type == 'group') {
          return true
        }
        return false
      },
    },
  }
</script>
