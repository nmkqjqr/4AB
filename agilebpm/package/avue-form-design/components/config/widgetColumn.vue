<template>
  <div class="widget-config">
    <el-form
      :model="data"
      label-suffix="："
      v-if="this.data && Object.keys(this.data).length > 0"
      labelPosition="right"
      labelWidth="95px"
    >
      <el-collapse v-model="collapse">
        <el-collapse-item name="1" title="基本属性">
          <el-form-item
            label="字段描述"
            prop="label"
            :rules="[{ required: true, message: '必填' }]"
          >
            <ab-pinyin
              :manual="!isBo"
              v-model="data.label"
              v-model:to="data.code"
              clearable
              placeholder="请输入字段描述"
              maxlength="20"
              show-word-limit
              :type="isOracle ? 2 : 3"
            ></ab-pinyin>
          </el-form-item>
          <el-form-item
            label="字段编码"
            prop="code"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input
              v-model="data.code"
              :disabled="isBo || (!isBo && form.isMb)"
              clearable
              placeholder="请输入字段编码"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            label="字段类型"
            v-if="BizColumnCtrlTypeKeyMap[data.type]"
          >
            <el-tag v-if="isBo">{{ ColumnType[data.fieldType] }}</el-tag>
            <el-select
              v-else
              v-model="data.fieldType"
              @change="fieldTypeChange"
            >
              <el-option
                v-for="val in BizColumnCtrlTypeKeyMap[data.type].supports"
                :key="val"
                :label="ColumnType[val]"
                :value="val"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="['varchar', 'number'].includes(data.fieldType)"
            label="字段长度"
            prop="maxlength"
            :rules="[{ required: true, message: '必填' }]"
          >
            <span v-if="isBo && abColumn">{{ abColumn.length }}</span>
            <el-input-number
              v-if="!isBo"
              v-model="data.maxlength"
              controls-position="right"
              :min="1"
              placeholder="最大长度"
              :max="5000"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            v-if="['number'].includes(data.fieldType)"
            label="小数位"
            prop="decimal"
            :rules="[{ required: true, message: '必填' }]"
          >
            <span v-if="isBo">{{ abColumn.decimal }}</span>
            <el-input-number
              v-else
              v-model="data.decimal"
              controls-position="right"
              :min="0"
              placeholder="小数位"
              :max="5000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="控件栅格">
            <el-slider
              v-model="data.span"
              :max="24"
              :min="4"
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
          <el-form-item label="标签宽度">
            <el-input-number
              v-model="data.labelWidth"
              :min="90"
              :step="5"
              controls-position="right"
              placeholder="为空时取表单默认宽度"
            ></el-input-number>
          </el-form-item>
          <!-- <el-form-item label="隐藏lable">
            <el-switch
              v-model="data.hideLable"
              inline-prompt
              active-text="是"
              inactive-text="否"
            />
          </el-form-item> -->
        </el-collapse-item>

        <el-collapse-item name="2" title="控件配置">
          <el-form-item label="控件类型">
            <el-popover
              placement="left"
              title=""
              :width="410"
              :visible="ctrlTypeVisible"
            >
              <template #reference>
                <el-input
                  @click="ctrlTypeVisible = !ctrlTypeVisible"
                  v-if="BizColumnCtrlTypeKeyMap[data.type]"
                  v-model="BizColumnCtrlTypeKeyMap[data.type].desc"
                  readonly
                  placeholder="选择"
                  class="input-with-select"
                >
                  <template #append>
                    <el-button
                      @click="ctrlTypeVisible = !ctrlTypeVisible"
                      :icon="Search"
                    >
                      选择
                    </el-button>
                  </template>
                </el-input>
              </template>

              <span
                v-for="(group, index) in [
                  { desc: '基础组件', key: 'basic' },
                  { desc: '高级组件', key: 'senior' },
                  { desc: '动态组件', key: 'dynamic' },
                ]"
              >
                <el-divider
                  :style="{ 'margin-top': index > 0 ? '20px' : '0px' }"
                  v-if="
                    BizColumnCtrlTypeMap[data.fieldType].filter(
                      (item) => item.group == group.key
                    ).length > 0
                  "
                >
                  {{ group.desc }}
                </el-divider>
                <el-space wrap>
                  <el-check-tag
                    style="width: 120px"
                    v-for="val in BizColumnCtrlTypeMap[data.fieldType].filter(
                      (item) => item.group == group.key
                    )"
                    :checked="data.type == val.key"
                    @click="ctrlTypeChange(val.key)"
                  >
                    {{ val.desc }}
                  </el-check-tag>
                </el-space>
              </span>
            </el-popover>
            <!-- <el-tag v-else-if="BizColumnCtrlTypeKeyMap[data.type]">
              {{ BizColumnCtrlTypeKeyMap[data.type].desc }}
            </el-tag> -->
          </el-form-item>
          <el-form-item
            label="占位符"
            v-if="
              [
                'onetext',
                'multitext',
                'select',
                'serialno',
                'dynamicSelect',
                'cascadeSelect',
                'number',
                'region',
                'customDialog',
                'treeSelect',
                'multiSelect',
                'date',
                'dateRange',
                'dateMulti',
                'dic',
              ].includes(data.type)
            "
          >
            <el-input
              v-model="data.placeholder"
              clearable
              maxlength="20"
              show-word-limit
              :placeholder="getPlaceholder"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="是否只读"
            v-if="!['hidden', 'scanTrans', 'ocr'].includes(data.type)"
          >
            <el-switch
              v-model="data.readOnly"
              inline-prompt
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
          <el-form-item
            label="校验"
            v-if="!['hidden', 'steps', 'followerQuote'].includes(data.type)"
          >
            <el-select
              multiple
              clearable
              v-model="data.rules"
              :placeholder="getRulesPlaceholder"
            >
              <el-option
                v-for="val in BizValidatorMap"
                :key="val.key"
                :label="val.name"
                :value="val.key"
              />
            </el-select>
          </el-form-item>

          <!-- 各组件类型特有配置 -->
          <component :is="getComponent" :data="data" :form="form"></component>
        </el-collapse-item>

        <el-collapse-item name="3" title="高级特性">
          <el-alert
            v-if="collapse.includes('3')"
            :title="`数据路径：${getModelPath}`"
            type="warning"
            :closable="false"
          />
          <el-form-item label="change事件" label-width="100">
            <el-input
              v-model="data.change"
              clearable
              placeholder="请输入change事件脚本"
            ></el-input>
          </el-form-item>
          <el-form-item label="blur事件" label-width="100">
            <el-input
              v-model="data.blur"
              clearable
              placeholder="请输入blur事件脚本"
            ></el-input>
          </el-form-item>

          <el-form-item label="排序方式" v-if="!isBo">
            <el-tooltip
              class="box-item"
              content="配置仅在子表时生效"
              effect="dark"
              placement="top-start"
            >
              <el-select v-model="data.orderBy">
                <el-option
                  v-for="item in [
                    { val: '', label: '无' },
                    { val: 'desc', label: '降序' },
                    { val: 'asc', label: '升序' },
                  ]"
                  :key="item.val"
                  :label="item.label"
                  :value="item.val"
                />
              </el-select>
            </el-tooltip>
          </el-form-item>

          <el-tabs model-value="first" class="demo-tabs">
            <el-tab-pane label="拓展属性" name="first">
              <div
                style="margin-bottom: 5px"
                v-for="item in data.expandAttrs || []"
              >
                <el-input
                  style="width: 150px"
                  v-model="item.key"
                  clearable
                  placeholder="请输入属性名"
                ></el-input>
                <el-input
                  style="width: 150px; margin-left: 5px"
                  v-model="item.val"
                  clearable
                  autosize
                  type="textarea"
                  placeholder="请输入属性值"
                ></el-input>
                <el-button
                  @click="abUtil.Arrays.remove(item, data.expandAttrs)"
                  style="margin-left: 5px"
                  circle
                  :icon="CloseBold"
                ></el-button>
              </div>
              <el-button type="text" @click="addAttr">添加</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <el-empty
      v-else
      description="拖拽字段进行配置"
      style="margin-top: 90%"
    ></el-empty>
  </div>
</template>

<script>
  import { QuestionFilled, Search, CloseBold } from '@element-plus/icons-vue'
  import fields from '../field/index'
  import { sysApi, bizApi } from '@agilebpm/api'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { ElCheckTag } from 'element-plus'

  export default {
    name: 'widget-column',
    props: ['data', 'form', 'isOracle'],
    components: {},
    setup() {
      return {
        Search,
        CloseBold,
        abUtil,
      }
    },
    computed: {
      getComponent() {
        if (['onetext'].includes(this.data.type)) {
          return 'ab-common-config'
        }
        if (['multiSelect', 'checkbox', 'radio'].includes(this.data.type)) {
          return 'ab-select-config'
        }
        if ('file' === this.data.type) {
          return 'ab-upload-config'
        }
        if ('cascadeSelect' === this.data.type) {
          return 'ab-cascader-select-config'
        }
        if ('signatureOpinion' === this.data.type) {
          return 'ab-signature-opinion-config'
        }
        if ('region' === this.data.type) {
          return 'ab-region-select-config'
        }
        if (
          [
            'customDialog',
            'dateMulti',
            'dateRange',
            'dynamicSelect',
            'treeSelect',
            'followerQuote',
            'userSelect',
            'orgSelect',
            'roleSelect',
            'postSelect',
            'dataSelector',
            'onlineDoc',
            'formReference',
          ].includes(this.data.type)
        ) {
          return (
            'ab-' +
            this.data.type.replace(/([A-Z])/g, '-$1').toLowerCase() +
            '-config'
          )
        }
        return 'ab-' + this.data.type + '-config'
      },
      getRulesPlaceholder() {
        if (!this.isBo || this.data.rules.length > 0 || !window.ab_bo) {
          return ''
        }

        let msg = []
        if (this.abColumn && this.abColumn.validRule) {
          this.abColumn.validRule.split(',').forEach((v) => {
            if (this.BizValidatorMap[v]) {
              msg.push(this.BizValidatorMap[v].name)
            }
          })
        }

        if (msg.length == 0) {
          return '请选择'
        }
        return '后端校验：' + msg.join(',')
      },
      getModelPath() {
        const parent = this.getParent()
        let bo = window.getBo()
        if (!parent.children || !parent.subTable) {
          //主表
          return `data.${bo.code}.${this.data.code}`
        } else {
          return `${this.form.code}_${parent.code}_AbTable.${this.data.code}`
        }
      },
      getPlaceholder() {
        return this.form.defaultPlaceholder
          ? `默认：请输入${this.data.label}`
          : '请输入占位符'
      },
    },
    data() {
      return {
        fields,
        collapse: ['1', '2'],
        BizValidatorMap: {},
        BizColumnCtrlTypeMap: {
          varchar: [],
          number: [],
          date: [],
          clob: [],
        },
        BizColumnCtrlTypeKeyMap: {},
        ColumnType: {},
        ctrlTypeVisible: false,
        isBo: abTools.useCurrentInstance().proxy.$route.query.mode != 'diyBo',
        abColumn: null,
      }
    },
    mounted() {
      if (window.ab_bo) {
        this.abColumn = window.ab_bo.getCol(
          this.data.tableCode,
          this.data.code,
          true
        )
      }
      bizApi.bizPattern.getAllBizValidator().then((data) => {
        this.BizValidatorMap = data
      })
      sysApi.tools
        .getEnum('com.dstz.biz.api.constant.BizColumnCtrlType', true)
        .then((resp) => {
          resp.data.forEach((item) => {
            this.BizColumnCtrlTypeKeyMap[item.key] = item
            Object.keys(this.BizColumnCtrlTypeMap).forEach((ite) => {
              if (item.supports.includes(ite)) {
                this.BizColumnCtrlTypeMap[ite].push(item)
              }
            })
          })
        })

      sysApi.tools
        .getEnum('com.dstz.jdbc.api.enums.ColumnType', true)
        .then((resp) => {
          resp.data.forEach((item) => {
            this.ColumnType[item.key] = item.desc
          })
        })
    },
    methods: {
      ctrlTypeChange(key) {
        //演示环境才拦截
        if (
          abUtil.checkIsPublicProject(true) &&
          ['senior', 'dynamic'].includes(
            this.BizColumnCtrlTypeKeyMap[key].group
          )
        ) {
          ElMessageBox.confirm(
            '体验高级功能需要技术指导，即将跳转客服联系页...',
            '注意',
            {
              distinguishCancelAndClose: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }
          )
            .then(() => {
              window.location.href = 'https://www.tongzhouyun.com/contact'
            })
            .catch((action) => {})
          return
        }

        this.data.type = key
        this.data.defaultValue = ''
        this.ctrlTypeVisible = false
      },
      getParent(obj, list) {
        let rtn
        obj = obj || this.form
        list = list || this.form.column

        list.forEach((c) => {
          if (['group', 'dynamic'].includes(c.type)) {
            rtn = rtn || this.getParent(c, c.children.column)
          } else if (c.type == 'tabs') {
            c.tabsColumn.forEach((cc) => {
              rtn = rtn || this.getParent(obj, cc.children.column)
            })
          } else if (c.prop == this.data.prop) {
            rtn = obj
          }
        })
        return rtn
      },
      fieldTypeChange() {
        if (this.data.fieldType == 'number') {
          this.data.maxlength = 8
          this.data.decimal = 2
        }
        if (this.data.fieldType == 'varchar') {
          this.data.maxlength = 64
        }
      },
      addAttr() {
        this.data.expandAttrs = this.data.expandAttrs || []
        this.data.expandAttrs.push({})
      },
    },
  }
</script>
