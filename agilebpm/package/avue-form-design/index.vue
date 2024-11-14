<template>
  <div class="avue-form-design no-vab-theme">
    <el-container v-if="inited">
      <el-aside :width="leftAsideWidth">
        <!-- 左侧字段区 -->
        <afd-field
          :mb-data="widgetMb.option"
          @field-click="handleFieldClick"
          :data="widget.option"
          :tab="activeName"
          @click="widget.select = {}"
          :designCode="designCode"
          :designName="designName"
        ></afd-field>
      </el-aside>
      <el-container direction="vertical">
        <!-- 头部工具栏 -->
        <!-- isAppsquareForm 是否应用广场 -->
        <afd-toolbar
          :data="widget.option"
          :toolbar="toolbar"
          @import="$refs.importDrawer.show()"
          @generate="handleGenerateJson"
          @clear="handleClear"
          @createForm="createForm"
          @save="save"
          :isWf="isWf"
          :isAppsquareForm="isAppsquareForm"
          :loading="loading"
        ></afd-toolbar>
        <!-- 主设计区 -->
        <el-tabs
          type="border-card"
          v-model="activeName"
          v-if="widget.option.formMode == 'both'"
        >
          <el-tab-pane label="PC端" name="pc" :style="{ height: height }">
            <afd-widget
              style=""
              ref="widgetForm"
              :data="widget.option"
              v-model:select="widget.select"
              @click="widget.select = {}"
            ></afd-widget>
          </el-tab-pane>
          <el-tab-pane label="移动端" name="mb" :style="{ height: height }">
            <afd-widget
              style=""
              ref="widgetMbForm"
              :data="widgetMb.option"
              v-model:select="widgetMb.select"
              @click="widgetMb.select = {}"
            ></afd-widget>
          </el-tab-pane>
        </el-tabs>
        <afd-widget
          v-else
          style=""
          ref="widgetForm"
          :data="widget.option"
          v-model:select="widget.select"
          @click="widget.select = {}"
        ></afd-widget>
      </el-container>
      <el-aside :width="rightAsideWidth">
        <!-- 右侧设计区 -->
        <afd-config
          v-show="activeName == 'pc'"
          :is-oracle="isOracle"
          :form="widget.option"
          :widget-select="widget.select"
          :default-values="defaultValues"
        ></afd-config>
        <afd-config
          v-show="activeName == 'mb'"
          :form="widgetMb.option"
          :widget-select="widgetMb.select"
          :default-values="defaultValues"
          :is-oracle="isOracle"
        ></afd-config>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
  import { ElMessage, ElMessageBox } from 'element-plus'
  import widgetEmptyImg from './assets/widget-empty.png' // 空白图片
  import AfdField from './components/field/index.vue' // 左侧字段区
  import AfdToolbar from './components/toolbar/index.vue' // 顶部工具栏
  import AfdWidget from './components/widget/index.vue' // 中间主设计区
  import AfdConfig from './components/config/index.vue' // 右侧配置区
  import useTransform from './composables/use-transform' // json转换
  import { bizApi, sysApi, appsquareApi } from '@agilebpm/api'
  import * as abUtil from '@agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { provide } from 'vue'

  export default {
    name: 'avue-form-design',
    components: {
      AfdField,
      AfdToolbar,
      AfdWidget,
      AfdConfig,
    },
    props: {
      options: {
        type: [Object, String],
        default: () => {
          return {
            column: [],
          }
        },
      },
      asideLeftWidth: {
        type: [String, Number],
        default: '300px',
      },
      asideRightWidth: {
        type: [String, Number],
        default: '380px',
      },
      defaultValues: {
        type: Object,
      },
      isWf: {
        type: Boolean,
        default: false,
      },
      isAppsquareForm: {
        type: Boolean,
        default: false,
      },
      designId: {
        type: String,
        default: '',
      },
    },
    watch: {
      options: {
        handler() {},
        deep: true,
        immediate: true,
      },
    },
    setup() {
      const { transformToAvueOptions, transAvueOptionsToFormDesigner } =
        useTransform()
      return {
        transformToAvueOptions,
        transAvueOptionsToFormDesigner,
      }
    },
    computed: {
      leftAsideWidth() {
        if (typeof this.asideLeftWidth == 'string') {
          return this.asideLeftWidth
        } else {
          return `${this.asideLeftWidth}px`
        }
      },
      rightAsideWidth() {
        if (typeof this.asideRightWidth == 'string') {
          return this.asideRightWidth
        } else {
          return `${this.asideRightWidth}px`
        }
      },
    },
    data() {
      return {
        widgetEmptyImg,
        form: {},
        option: { column: [] },
        widget: {
          option: {
            column: [],
            labelPosition: 'right',
            labelSuffix: '：',
            readonlyShowText: 'true',
            labelWidth: 120,
            gutter: 0,
            menuBtn: true,
            submitBtn: true,
            submitText: '提交',
            emptyBtn: true,
            emptyText: '清空',
            menuPosition: 'center',
            //以下属性跟ab相关
            span: 12, //默认栏格
            typeCode: this.$route.query.typeCode || '', //分类编码
            name: '', //表单名称
            code: '', //表单编码
            desc: '', //描述
            boCode: this.$route.query.boCode || '', //业务对象编码
            mode: this.$route.query.mode || 'byBo', //模式
            formMode: this.$route.query.formMode || 'compate', //表单模式
            pcTemplateCode: 'elementFlowDesign', //默认模板
            mbTemplateCode: 'elementDesignMb', //默认模板
            isMb: false, //是否手机端
            sn: 0, //给diyBo时全局的字段序号
            defaultPlaceholder: true, //当placeholder为空时是否显示默认placeholder
            buttonform: [
              {
                type: '1',
                name: '保存',
                css: 'primary',
                desc: '保存',
                nodel: true,
              },
              {
                type: '4',
                name: '返回',
                css: '',
                desc: '返回',
                nodel: true,
              },
            ],
            version: 1,
          },
          select: {},
        },
        //以下属性跟ab有关
        activeName: 'pc',
        widgetMb: {}, //移动端数据
        inited: false, //是否已初始化结束
        height: `${window.innerHeight * 0.8}px`,
        pcFormStatus: 'design',
        mbFormStatus: 'design',
        isBo: abTools.useCurrentInstance().proxy.$route.query.mode != 'diyBo',
        TABLE_SUFFIX: '_abt',
        BIZ_TABLE_SUFFIX: '_AbTable',
        BO_SUFFIX: '_AbBo',
        DESIGN_CODE: '$AbDesignCode$',
        DESIGN_NAME: '$设计临时名称$',
        id: '',
        BizValidatorMap: null,
        loading: false,
        copyId: this.$route.query.copyId || '',
        isOracle: false,
      }
    },
    mounted() {
      window.TABLE_SUFFIX = this.TABLE_SUFFIX
      window.BIZ_TABLE_SUFFIX = this.BIZ_TABLE_SUFFIX
      window.BO_SUFFIX = this.BO_SUFFIX
      window.DESIGN_CODE = this.DESIGN_CODE
      window.DESIGN_NAME = this.DESIGN_NAME

      this.widgetMb = abUtil.clone(this.widget)
      this.widgetMb.option.isMb = true
      this.widgetMb.option.span = 24

      if (this.isWf) {
        this.id = this.designId || ''
      } else if (this.$route.name == 'CreateForm') {
        if (this.$route.params.formDesignId) {
          this.id = this.$route.params.resourceId || ''
        }
      } else {
        this.id = this.$route.query.id || ''
      }
      provide('isWf', this.isWf)
      provide('isAppsquareForm', this.isAppsquareForm)
      provide('loading', this.loading)
      provide('getParent', this.getParent)
      provide('getDiyTable', this.getDiyTable)
      provide('getBo', this.getBo)
      provide('jsonToBo', this.jsonToBo)

      bizApi.bizPattern.getAllBizValidator().then((data) => {
        this.BizValidatorMap = data
      })
      if (this.id || this.copyId) {
        // 初始化表单设计器（应用广场编辑表单）
        if (this.$route.name == 'CreateForm') {
          if (this.$route.params.formDesignId) {
            appsquareApi.thirdParty
              .getDesignThirdParty(this.id)
              .then((resp) => {
                let more = {
                  boName: resp.data.boName,
                  boCode: resp.data.boCode,
                  createBy: resp.data.createBy,
                  createTime: resp.data.createTime,
                  createOrgId: resp.data.createOrgId,
                  pcFormCode: resp.data.pcFormCode,
                  mbFormCode: resp.data.mbFormCode,
                  rev: resp.data.rev,
                }
                this.$emit('setDefaultPcJson', { ...resp.data.pcJson, ...more })
                this.getDesignFn(resp)
              })
          }
        } else {
          // 初始化表单设计器
          bizApi.bizForm.getDesign(this.id, this.copyId).then((resp) => {
            if (resp.data) {
              this.getDesignFn(resp)
            } else {
              ElMessage.error('返回结果为空')
            }
          })
        }
      } else {
        this.inited = true
      }

      //获取当前数据库类型
      sysApi.tools.getCurrentDataSource().then((resp) => {
        this.isOracle = resp.data.dbType == 'oracle'
      })
      window.getBo = this.getBo
      window.getJson = this.getJson
      window.jsonToBo = this.jsonToBo
      window.getDiyTable = this.getDiyTable
      window.getCopyCode = this.getCopyCode
    },
    methods: {
      getDesignFn(resp) {
        if (resp.data.formMode == 'pc' || resp.data.formMode == 'compate') {
          this.widget.option = resp.data.pcJson
        }
        if (resp.data.formMode == 'mobile') {
          this.widget.option = resp.data.mbJson
        }
        if (resp.data.formMode == 'both') {
          this.widget.option = resp.data.pcJson
          this.widgetMb.option = resp.data.mbJson
        }
        this.widget.option.boCode =
          this.widget.option.boCode || resp.data.boCode
        this.widget.option.boName =
          this.widget.option.boName || resp.data.boName

        this.widget.option.createBy = resp.data.createBy
        this.widget.option.createTime = resp.data.createTime
        this.widget.option.createOrgId = resp.data.createOrgId
        this.widget.option.pcFormCode = resp.data.pcFormCode
        this.widget.option.mbFormCode = resp.data.mbFormCode
        this.widget.option.rev = resp.data.rev
        this.widget.option.sn = this.widget.option.sn || 0
        this.inited = true
        this.pcFormStatus = resp.data.pcFormStatus
        this.mbFormStatus = resp.data.mbFormStatus

        if (this.copyId) {
          this.widget.option.mode = this.$route.query.mode || 'byBo'
          this.widget.option.id = ''
          this.widget.option.rev = 0
          if (this.isBo) {
            this.widget.option.code = this.getCopyCode(resp.data.code)
            this.widget.option.name = this.getCopyCode(resp.data.name)
          } else {
            if (resp.data.formMode == 'both') {
              this.widgetMb.option = this.jsonReplace(
                this.widgetMb.option,
                true
              )
            }
            this.widget.option = this.jsonReplace(this.widget.option, true)
            this.widget.option.code = ''
            this.widget.option.name = ''
          }
        }
      },
      // 左侧字段点击
      handleFieldClick(item) {
        const activeIndex =
          this.widget.option.column.findIndex(
            (c) => c.prop == this.widget.select.prop
          ) + 1
        let newIndex = 0
        if (activeIndex == -1) {
          this.widget.option.column.push(item)
          newIndex = this.widget.option.column.length - 1
        } else {
          this.widget.option.column.splice(activeIndex, 0, item)
          newIndex = activeIndex
        }

        this.$refs.widgetForm.handleWidgetAdd({ newIndex })
      },
      // 生成JSON
      handleGenerateJson() {
        let option =
          this.activeName == 'pc' ? this.widget.option : this.widgetMb.option
        console.info(option)
      },
      // 清空
      handleClear() {
        let option =
          this.activeName == 'pc' ? this.widget.option : this.widgetMb.option
        if (option && option.column && option.column.length > 0) {
          ElMessageBox.confirm('确定要清空表单吗？', '警告', {
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          })
            .then(() => {
              option.column = []
              option.select = {}
            })
            .catch(() => {})
        } else ElMessage.error('没有需要清空的内容')
      },
      save() {
        if (!this.check(this.widget)) return
        if (
          this.widget.option.formMode == 'both' &&
          !this.check(this.widgetMb)
        ) {
          return
        }

        let form = this.jsonReplace(this.widget.option)
        form.id = this.id
        let mbJson = this.jsonReplace(this.widgetMb.option)
        this.loading = true
        bizApi.bizForm.saveDesignJson(form, mbJson).then(
          (resp) => {
            ElMessage({
              message: '保存成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                let id = this.id
                if (!id) {
                  window.location.href =
                    window.location.origin +
                    window.location.pathname +
                    '?id=' +
                    resp.data.id +
                    '&mode=' +
                    this.widget.option.mode
                } else {
                  this.loading = false
                  this.widget.option.rev = resp.data.rev
                }
              },
            })
          },
          () => {
            this.loading = false
          }
        )
      },
      createForm() {
        if (!this.check(this.widget)) return
        if (
          this.widget.option.formMode == 'both' &&
          !this.check(this.widgetMb)
        ) {
          return
        }
        var list = []
        if (
          this.pcFormStatus == 'change' &&
          this.widget.option.formMode != 'mobile'
        ) {
          list.push('PC端')
        }
        if (
          this.mbFormStatus == 'change' &&
          this.widget.option.formMode != 'pc'
        ) {
          list.push('移动端')
        }
        if (list.length == 0) {
          this.createFormPost()
          return
        }

        ElMessageBox.confirm(
          list.join('、') +
            '表单已在源码模式修改过，重新生成会导致源码修改的内容丢失',
          '注意',
          {
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }
        ).then(() => {
          this.createFormPost()
        })
      },
      createFormPost() {
        let form = this.jsonReplace(this.widget.option)
        form.id = this.id
        let mbJson = this.jsonReplace(this.widgetMb.option)
        this.loading = true
        if (this.isAppsquareForm) {
          if (this.$route.name == 'CreateForm') {
            if (this.$route.params.formDesignId) {
              form.id = this.$route.params.formDesignId || ''
            }
          }
          this.$emit('appSquareSaveAvueFormData', form, mbJson)
          return
        }
        bizApi.bizForm.createForm(form, mbJson).then(
          (resp) => {
            ElMessage({
              message: '生成表单成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                let id = this.id
                if (!id) {
                  window.location.href =
                    window.location.origin +
                    window.location.pathname +
                    '?id=' +
                    resp.data.id +
                    '&mode=' +
                    this.widget.option.mode
                } else {
                  this.loading = false
                  this.widget.option.rev = resp.data.rev
                  this.widget.option.pcFormCode = resp.data.pcFormCode
                  this.widget.option.mbFormCode = resp.data.mbFormCode
                  this.pcFormStatus = 'design' //生成后肯定是design模式
                  this.mbFormStatus = 'design'
                }
              },
            })
          },
          () => {
            this.loading = false
          }
        )
      },
      setRev(data) {
        this.widget.option.rev = data.rev
      },
      check(widget, isReturnMsg) {
        let form = widget.option
        let msg = []
        if (!widget.option.isMb) {
          if (!this.isWf && !this.isAppsquareForm) {
            if (!form.code) {
              msg.push('表单编码不能为空')
            } else if (!this.BizValidatorMap.varirule.check(form.code)) {
              msg.push('表单编码' + this.BizValidatorMap.varirule.message)
            } else if (this.isOracle && form.code.length > 20) {
              msg.push('表单编码长度不能大于20')
            } else if (form.code.length > 100) {
              msg.push('表单编码长度不能大于100')
            }
            if (!form.typeCode) {
              msg.push('表单分类不能为空')
            }
            if (!form.name) {
              msg.push('表单名称不能为空')
            }
          }

          if (!form.labelWidth) {
            msg.push('标签默认宽度不能为空')
          }
          if (
            ['pc', 'compate', 'both'].includes(form.formMode) &&
            !form.pcTemplateCode
          ) {
            msg.push('PC端表单模板不能为空')
          }
          if (
            ['mobile', 'compate'].includes(form.formMode) &&
            !form.mbTemplateCode
          ) {
            msg.push('移动端表单模板不能为空')
          }
        }

        if (!this.isBo) {
          let rels = this.getAllRels()
          rels.forEach((rel) => {
            if (rel.table.columnsWithoutPrimary.length == 0) {
              msg.push(`业务表【${rel.tableComment}】字段不能为空`)
            }
          })
        }

        let tableName = '【主表】'
        if (widget.option.column.length == 0) {
          msg.push(`表单内容不能为空`)
        }
        this.checkColumn(
          widget.option.column,
          msg,
          tableName,
          '',
          widget.option
        )

        if (isReturnMsg) {
          return msg
        }

        if (msg.length > 0) {
          let typeName =
            widget.option.isMb || this.widget.option.formMode == 'mobile'
              ? '移动端'
              : 'PC端'
          ElMessage({
            dangerouslyUseHTMLString: true,
            type: 'error',
            message:
              `${typeName} 表单校验失败：<div style='margin-top:5px'>` +
              msg.join("</div><div style='margin-top:5px'>"),
          })
          widget.select = {}
          return false
        }
        return true
      },
      getAllRels(rel) {
        if (!rel) {
          rel = this.getBo().rel
        }
        let rels = []
        rels.push(rel)
        rel.children.forEach((re) => {
          this.getAllRels(re).forEach((r) => {
            rels.push(r)
          })
        })

        return rels
      },
      checkColumn(column, msg, tableName, typeName, option) {
        column.forEach((c) => {
          // if (typeof c.check === 'function') {
          //   let message = c.check()
          //   if (message) {
          //     msg.push(message)
          //   }
          // }

          if (['title', 'divider', 'alert', 'content'].includes(c.type)) {
            return
          }
          if (c.type == 'tabs') {
            if (!c.label) {
              msg.push(`tabs描述不能为空`)
            }
            c.tabsColumn.forEach((cc) => {
              if (!cc.label) {
                msg.push(`tabs【${c.label}】标签卡【${cc.index}】标题不能为空`)
              }
              this.checkColumn(
                cc.children.column,
                msg,
                `tabs【${c.label}】标签卡【${cc.label}】`,
                typeName,
                option
              )
            })
          } else if (['group', 'dynamic'].includes(c.type)) {
            //子表
            //子表信息的基础校验
            if (!c.label) {
              msg.push(`${typeName}子表（${c.code}）描述不能为空`)
            }
            if (c.subTable) {
              if (!c.code) {
                msg.push(`${typeName}子表【${c.label}】编码不能为空`)
              } else if (!this.BizValidatorMap.varirule.check(c.code)) {
                msg.push(
                  `${typeName}子表【${c.label}（${c.code}）】编码${this.BizValidatorMap.varirule.message}`
                )
              }
              if (this.isBo && !window.ab_bo.getRel(c.code, null, false)) {
                msg.push(`当前业务对象已不存在表【${c.label}（${c.code}）】`)
              }
              if (
                this.isOracle &&
                !this.isBo &&
                c.code &&
                this.widget.option.code
              ) {
                let tableCode = `${this.widget.option.code}_${c.code}${this.BIZ_TABLE_SUFFIX}`
                if (tableCode.length > 25) {
                  msg.push(
                    `${typeName}子表（${c.code}）对应自动生成的数据库表名【${tableCode}】超过25字符`
                  )
                }
              }
              if (c.type == 'group' && c.subtableMode) {
                //块子表检查弹框模式的字段配置
                if (!c.subtableModeList || c.subtableModeList.length == 0) {
                  msg.push(
                    `${typeName}子表【${c.label}（${c.code}）】行子表模式字段未配置`
                  )
                } else {
                  let tableCode = !this.isBo
                    ? `${this.widget.option.code}_${c.code}${this.BIZ_TABLE_SUFFIX}`
                    : c.code
                  c.subtableModeList.forEach((item) => {
                    if (
                      !window.ab_bo_getCol(
                        tableCode,
                        item.code,
                        false,
                        this.getBo().rel
                      )
                    ) {
                      msg.push(
                        `${typeName}子表【${c.label}（${c.code}）】行子表模式字段【${item.label}】已被删除`
                      )
                    }
                  })
                }
              }

              this.checkColumn(
                c.children.column,
                msg,
                `子表【${c.label}（${c.code}）】`,
                typeName,
                option
              )
            } else {
              this.checkColumn(
                c.children.column,
                msg,
                `分组【${c.label}）】`,
                typeName,
                option
              )
            }
          } else if (c.type == 'iframe') {
            if (!c.url) {
              msg.push(`外部页面url地址不能为空`)
            }
          } else if (c.type == 'button') {
            if (['dialog', 'query'].includes(c.action) && !c.dialog) {
              msg.push(`${tableName}按钮【${c.title}】配置不能为空`)
            }
          } else if (c.type == 'verificationCode') {
            if (!c.sendSmsColumn) {
              msg.push(`验证码组件未配置发送字段！`)
            }
          } else if (c.type == 'ocr') {
            if (!c.ocrType) {
              msg.push('请选择文字识别组件的识别类型！')
            } else if (!c.param || c.param.length == 0) {
              msg.push('请添加文字识别组件的识别配置！')
            } else {
              let filterParam = c.param.filter((s) => !s.key || !s.value)
              if (filterParam && filterParam.length > 0) {
                msg.push('文字识别组件中识别配置里存在未选择的数据！')
              }
            }
          } else {
            if (c.tableCode) {
              tableName = window.ab_bo_getRel(c.tableCode).tableComment
            }
            if (this.isBo && !window.ab_bo.getCol(c.tableCode, c.code, false)) {
              msg.push(`${typeName}${tableName}已经不存在字段【${c.code}】`)
            }
            if (!this.isBo && option.isMb) {
              //简式模式移动端需要校验
              let p = this.getParent(
                this.widgetMb.option,
                this.widgetMb.option.column,
                c.prop
              )
              let designCode = this.id
                ? this.widget.option.code
                : this.DESIGN_CODE
              let tableCode = p.subTable
                ? `${designCode}_${p.code}${this.BIZ_TABLE_SUFFIX}`
                : `${designCode}${this.BIZ_TABLE_SUFFIX}`
              if (
                !window.ab_bo_getCol(tableCode, c.code, false, this.getBo().rel)
              ) {
                msg.push(`${typeName}${tableName}已经不存在字段【${c.code}】`)
              }
            }

            //字段
            if (!c.code) {
              msg.push(`${typeName}${tableName}字段编码不能为空`)
            } else if (!this.BizValidatorMap.varirule.check(c.code)) {
              msg.push(
                `${typeName}${tableName}字段编码${this.BizValidatorMap.varirule.message}`
              )
            }

            if (!this.isBo && ['id', 'parentId'].includes(c.code)) {
              msg.push(
                `${typeName}${tableName}字段不能使用特殊编码：id、parentId`
              )
            }

            //基础属性的校验
            if (!c.label) {
              msg.push(`${typeName}${tableName}字段（${c.code}）描述不能为空`)
            }

            //赋值数据库字段名逻辑
            if (c.code && c.isName) {
              c.name = c.code.toUnderlineCase() + '_'
              //console.info(c.code + "====>" + c.name)
            }

            let columnName = c.label
              ? `【${c.label}（${c.code}）】`
              : `（${c.code}）`

            if (
              !this.isBo &&
              column.filter((item) => item.code == c.code).length != 1
            ) {
              let m = `${typeName}${tableName}字段${columnName}字段编码重复`
              if (!msg.includes(m)) {
                msg.push(m)
              }
            }

            if (
              ['varchar', 'number'].includes(c.fieldType) &&
              (c.maxlength == null || c.maxlength < 0)
            ) {
              msg.push(
                `${typeName}${tableName}字段${columnName}字段长度需大于等于0`
              )
            }

            if (
              ['number'].includes(c.fieldType) &&
              (!c.decimal || c.decimal < 0) &&
              c.decimal != 0
            ) {
              msg.push(
                `${typeName}${tableName}字段${columnName}小数位需大于等于0`
              )
            }

            if (c.type == 'serialno') {
              if (c.serialnoConfig && !c.serialnoConfig.serialCode) {
                msg.push(`${typeName}${tableName}字段${columnName}未选择流水号`)
              }

              if (!c.serialnoConfig && !c.serialCode) {
                msg.push(`${typeName}${tableName}字段${columnName}未选择流水号`)
              }
            }

            if (
              ['select', 'multiSelect', 'checkbox', 'radio'].includes(c.type) &&
              c.dicType === 'dicData' &&
              !c.dicCode
            ) {
              msg.push(`${typeName}${tableName}字段${columnName}未选择数据字典`)
            }

            if (
              ['dynamicSelect', 'cascadeSelect'].includes(c.type) &&
              (!c.labelField || !c.valueField || !c.dialogKey)
            ) {
              msg.push(
                `${typeName}${tableName}字段${columnName}动态选择配置异常`
              )
            }

            if (c.type === 'dynamicSelect' && c.filterable && !c.filterField) {
              msg.push(
                `${typeName}${tableName}字段${columnName}动态选择过滤条件字段不能为空`
              )
            }

            if (c.type === 'file' && !c.uploadType) {
              msg.push(`${typeName}${tableName}字段${columnName}未选择分类目录`)
            }

            if (c.type == 'customDialog') {
              if (
                !c.ctrDialogConfig.dialogKey ||
                !c.ctrDialogConfig.mappingBo
              ) {
                msg.push(
                  `${typeName}${tableName}字段${columnName}自定义对话框配置异常`
                )
              }

              if (
                !c.ctrDialogConfig.mappingFields ||
                c.ctrDialogConfig.mappingFields.length === 0
              ) {
                msg.push(
                  `${typeName}${tableName}字段${columnName}自定义对话框字段映射配置不能为空`
                )
              } else {
                c.ctrDialogConfig.mappingFields.forEach((item) => {
                  if (!item.boField || !item.dialogField) {
                    msg.push(
                      `${typeName}${tableName}字段${columnName}自定义对话框字段映射配置异常`
                    )
                    return
                  }
                })
              }
              //展示详情要配置 详情表单 和主键字段
              if (c.ctrDialogConfig.showDetail) {
                if (
                  (!c.ctrDialogConfig.detailFormName &&
                    !c.ctrDialogConfig.detailFormNameMobile) ||
                  !c.ctrDialogConfig.detailKey
                ) {
                  msg.push(
                    `${typeName}${tableName}字段${columnName}请完善自定义对话框详情展示配置信息`
                  )
                }
              }
            }

            if (c.type === 'treeSelect' && !c.dicCode) {
              msg.push(
                `${typeName}${tableName} 字段${columnName}未选择字典，请配置字典`
              )
            }
            if (c.type == 'dateRange' && !c.valueRangeMapping) {
              msg.push(
                `${typeName}${tableName} 字段${columnName}为时间范围类型, 请配置结束时间字段`
              )
            }
            if (c.type === 'multitext' && c.rows) {
              let num = +c.rows
              if (!num) {
                msg.push(
                  `${typeName}${tableName} 字段${columnName}多行文本控件中行数只能输入数字`
                )
              } else {
                if (num > 100 || num < 1) {
                  msg.push(
                    `${typeName}${tableName} 字段${columnName}多行文本控件行数最小为1，最大为100`
                  )
                }
              }
            }
            if (
              [
                'dataSelector',
                'userSelect',
                'roleSelect',
                'orgSelect',
                'postSelect',
              ].includes(c.type)
            ) {
              if (!c.dataSelectorConfig) {
                msg.push(
                  `${typeName}${tableName}字段${columnName}数据选择配置异常`
                )
              }
              if (
                !c.dataSelectorConfig.labelField ||
                !c.dataSelectorConfig.valueField ||
                !c.dataSelectorConfig.dialogKey
              ) {
                msg.push(
                  `${typeName}${tableName}字段${columnName}数据选择配置有未填必填选项`
                )
              }
              if (
                c.dataSelectorConfig.labelField ===
                c.dataSelectorConfig.valueField
              ) {
                msg.push(
                  `${typeName}${tableName}字段${columnName}展示字段和值字段不能相同`
                )
              }
              if (
                c.dataSelectorConfig.mappingFields &&
                c.dataSelectorConfig.mappingFields.length > 0
              ) {
                c.dataSelectorConfig.mappingFields.forEach((item) => {
                  if (!item.boField || !item.dialogField) {
                    msg.push(
                      `${typeName}${tableName}字段${columnName}数据选择映射配置异常，请检查`
                    )
                    return
                  }
                })
              }
            }
            if (['formReference'].includes(c.type)) {
              if (!c.fromRefConfig) {
                msg.push(
                  `${typeName}${tableName}字段${columnName}表单引用配置异常`
                )
              }
              if (c.fromRefConfig.dialogKey && !c.fromRefConfig.valueField) {
                msg.push(
                  `${typeName}${tableName}字段${columnName}表单引用配置：配置了对话框，请选择对应的值字段`
                )
              }

              if (
                !c.fromRefConfig.formCode &&
                !c.fromRefConfig.formCodeMobile
              ) {
                msg.push(
                  `${typeName}${tableName}字段${columnName}表单引用配置 ：请配置表单`
                )
              }
            }
            return /*进行验证*/
          }
        })
      },
      getBo() {
        if (this.isBo) {
          console.info(window.ab_bo)
          return window.ab_bo
        } else {
          return this.jsonToBo()
        }
      },
      jsonToBo(isMb = false) {
        let json = this.widget.option
        if (isMb) {
          json = this.widgetMb.option
        }
        let designCode = this.id ? this.widget.option.code : this.DESIGN_CODE
        let designName = this.id ? this.widget.option.name : this.DESIGN_NAME
        let bo = {
          code: `${designCode}${this.BO_SUFFIX}`,
          name: designName,
        }
        let rel = {
          children: [],
          tableCode: `${designCode}${this.BIZ_TABLE_SUFFIX}`,
          tableComment: designName,
          type: 'main',
          table: {
            code: `${designCode}${this.BIZ_TABLE_SUFFIX}`,
            columns: [],
            comment: designName,
            dsKey: 'dataSourceDefault',
            dsName: '本地数据源',
            external: 0,
            name: `${designCode}${this.TABLE_SUFFIX}`,
            pkCode: 'id',
          },
          json: json,
        }
        bo.rel = rel
        rel.table.columns.push(this.jsonToBoNewPk(rel.table))
        this.jsonToBoHandleColumn(json.column, rel, designCode, designName)
        rel.table.columnsWithoutPrimary = rel.table.columns.filter(
          (cc) => !['id', 'parentId'].includes(cc.code)
        )
        //console.info(bo)
        bo.designCode = designCode
        bo.designName = designName
        return bo
      },
      jsonToBoHandleColumn(list, rel, designCode, designName) {
        if (!list) {
          return
        }
        list.forEach((c) => {
          let type = c.type
          if (type == 'tabs') {
            c.tabsColumn.forEach((t) => {
              this.jsonToBoHandleColumn(
                t.children.column,
                rel,
                designCode,
                designName
              )
            })
          } else if (['group', 'dynamic'].includes(type)) {
            //子表
            if (!c.subTable) {
              this.jsonToBoHandleColumn(
                c.children.column,
                rel,
                designCode,
                designName
              )
              return
            }
            if (!c.code) {
              console.info('无编码则无法构建子表')
              return
            }
            let r = {
              children: [],
              tableCode: `${designCode}_${c.code}${this.BIZ_TABLE_SUFFIX}`,
              tableComment: `${designName}_${c.label}`,
              type: 'oneToMany',
              fks: [
                {
                  from: 'parentId',
                  type: 'parentField',
                  value: 'id',
                },
              ],
              table: {
                code: `${designCode}_${c.code}${this.BIZ_TABLE_SUFFIX}`,
                columns: [],
                comment: `${designName}_${c.label}`,
                dsKey: 'dataSourceDefault',
                dsName: '本地数据源',
                external: 0,
                name: `${designCode}_${c.code}${this.TABLE_SUFFIX}`,
                pkCode: 'id',
              },
              json: c,
              parent: rel,
            }
            rel.children.push(r)
            r.table.columns.push(this.jsonToBoNewPk(r.table))
            r.table.columns.push(this.jsonToBoNewFk(r.table))
            this.jsonToBoHandleColumn(
              c.children.column,
              r,
              designCode,
              designName
            )
            r.table.columnsWithoutPrimary = r.table.columns.filter(
              (cc) => !['id', 'parentId'].includes(cc.code)
            )
          } else if (
            ![
              'divider',
              'title',
              'alert',
              'iframe',
              'button',
              'verificationCode',
            ].includes(c.type)
          ) {
            let column = {
              name: c.code,
              type: c.fieldType,
              length: c.maxlength,
              decimal: c.decimal,
              defaultValue: c.defaultValue,
              comment: c.label,
              code: c.code,
              validRule: c.rules.join(','),
              table: rel.table,
              json: c,
            }
            rel.table.columns.push(column)
          }
        })
      },
      jsonToBoNewPk(table) {
        return {
          name: 'id_',
          code: 'id',
          comment: '主键',
          primary: 1,
          table: table,
        }
      },
      jsonToBoNewFk(table) {
        return {
          name: 'parent_id_',
          code: 'parentId',
          comment: '外键',
          table: table,
        }
      },
      jsonReplace(json, b = false) {
        if (this.id && !b) {
          return json
        }
        let code = this.widget.option.code
        let name = this.widget.option.name
        let str = JSON.stringify(json)
        if (b) {
          str = str.replaceAll(code, this.DESIGN_CODE)
          str = str.replaceAll(name, this.DESIGN_NAME)
        } else {
          str = str.replaceAll(this.DESIGN_CODE, code)
          str = str.replaceAll(this.DESIGN_NAME, name)
        }

        return JSON.parse(str)
      },
      getJson(code, name) {
        this.widget.option.code = code
        this.widget.option.name = name
        let msg = this.check(this.widget, true)
        if (this.widget.option.formMode == 'both') {
          msg.push(...this.check(this.widgetMb, true))
        }

        let form = this.jsonReplace(this.widget.option)
        form.id = this.id
        let mbJson = this.jsonReplace(this.widgetMb.option)
        return {
          json: form,
          mbJson: mbJson,
          msg: msg,
        }
      },
      /**
       * 获取指定元素的父
       */
      getParent(obj, list, prop) {
        let rtn
        list.forEach((c) => {
          if (c.prop == prop) {
            rtn = obj
          } else if (['group', 'dynamic'].includes(c.type)) {
            rtn = rtn || this.getParent(c, c.children.column, prop)
          } else if (c.type == 'tabs') {
            c.tabsColumn.forEach((cc) => {
              rtn = rtn || this.getParent(obj, cc.children.column, prop)
            })
          }
        })
        return rtn
      },
      /**
       * 简式表单才能用
       * @param {*} prop
       * @param {*} isMb
       */
      getDiyTable(prop, isMb = false, rel) {
        rel = rel || this.jsonToBo(isMb).rel
        //比较自身
        if (rel.json && rel.json.prop == prop) {
          return rel
        }
        //比较字段
        if (rel.table) {
          for (let i in rel.table.columnsWithoutPrimary) {
            let c = rel.table.columnsWithoutPrimary[i]
            if (c.json && c.json.prop == prop) {
              return rel
            }
          }
        }
        //比较子表
        if (rel.children) {
          for (let i in rel.children) {
            let r = rel.children[i]
            let result = getDiyTable(prop, isMb, r)
            if (result) {
              return result
            }
          }
        }

        return null
      },
      getCopyCode(code) {
        try {
          if (code.includes('_')) {
            const v = code.substring(code.lastIndexOf('_'))
            if (v.startsWith('_V')) {
              const num = parseInt(v.substring(2))
              return code.substring(0, code.lastIndexOf('_')) + '_V' + (num + 1)
            }
          }
        } catch (e) {
          console.error(e)
        }
        return `${code}_V1`
      },
    },
  }
</script>

<style lang="scss">
  @import './styles/index.scss';
</style>
