<template>
  <div class="common-layout">
    <el-form
      class="demo-ruleForm"
      :inline="true"
      label-position="left"
      label-width="100px"
      :model="info.data"
      :rules="rules"
    >
      <el-form-item label="名称" prop="name">
        <ab-pinyin
          v-model="info.data.name"
          v-model:to="info.data.code"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <ab-code
          v-model="info.data.code"
          :disabled="$route.query.code && !info.iscopy"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item v-if="info.data.gridType === 'list'" label="关联在线表单">
        <el-tag
          v-if="
            (info.related.name && info.related.name.length > 0) ||
            info.data.relatedName
          "
          style="margin-right: 12px"
        >
          {{ info.related.name || info.data.relatedName }}
        </el-tag>
        <ab-cust-dialog
          v-model="info.related.name"
          dialog-key="formSelector"
          :param="{
            type_: 'pc',
          }"
          @ok="choosecslb"
        >
          选择
        </ab-cust-dialog>
      </el-form-item>
    </el-form>
    <!-- advanced:高级模式 -->
    <codemirror
      v-model="info.data.sqlContent"
      :autofocus="true"
      :indent-with-tab="true"
      placeholder="SQL"
      :style="{
        height: `150px`,
        border: `1px solid #e4e7ed`,
        width: `90%`,
      }"
    />
    <div class="btnBox1">
      <el-button
        :loading="info.parseSqlLoading"
        style="margin: 0 6px 0 0"
        type="primary"
        @click="parseSqlFn"
      >
        解析
      </el-button>
      <!-- <el-button
        :loading="info.updateLoading"
        style="margin: 0 6px 0 0"
        type="primary"
        @click="fieldsListUpdate"
      >
        数据库字段更新
      </el-button> -->
      <el-button style="margin: 0 6px 0 0" type="primary" @click="addCode">
        添加别名
      </el-button>
      <el-button style="margin: 0 6px 0 0" type="primary" @click="formatSql">
        美化脚本
      </el-button>
      <help-tool-tip />
      <slot name="tableName"></slot>
      <el-tabs
        v-if="info.data.fieldsList && info.data.fieldsList.length > 0"
        v-model="info.activeName"
        class="demo-tabs"
      >
        <el-tab-pane name="first">
          <template #label>
            <span class="custom-tabs-label">
              <span>列表基础设置</span>
            </span>
          </template>
          <list-basic-settings
            v-if="info.data"
            v-model="info.data"
            @search-obj-name="searchObjName"
          />
        </el-tab-pane>
        <el-tab-pane name="second">
          <template #label>
            <span class="custom-tabs-label">
              <span>列表字段设置</span>
            </span>
          </template>
          <list-field-settings
            v-model="info.data"
            @fields-list-init="fieldsListInit"
          />
        </el-tab-pane>
        <el-tab-pane name="third">
          <template #label>
            <span class="custom-tabs-label">
              <span>列表查询设置</span>
            </span>
          </template>
          <list-query-settings v-model="info.data" />
        </el-tab-pane>
        <el-tab-pane v-if="info.data.gridType !== 'report'" name="fourth">
          <template #label>
            <span class="custom-tabs-label">
              <span>列表功能按钮设置</span>
            </span>
          </template>
          <list-function-settings v-model="info.data" />
          <!-- <div v-else style="margin-top: 10px; text-align: center">
            请先关联在线表单
          </div> -->
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Codemirror } from 'vue-codemirror'
  import { getData, bizApi, postData } from '~/agilebpm/api'
  import sqlFormatter from 'sql-formatter'
  import leftTreeSettings from './leftTreeSettings.vue'
  import phoneListSettings from './phoneListSettings.vue'
  import listBasicSettings from './listBasicSettings.vue'
  import listFieldSettings from './listFieldSettings.vue'
  import listQuerySettings from './listQuerySettings.vue'
  import listFunctionSettings from './listFunctionSettings.vue'
  import helpToolTip from './helpToolTip.vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  const emit = defineEmits([
    'update:modelValue',
    'searchObjName',
    'fieldsListInit',
  ])
  const { proxy } = abTools.useCurrentInstance()
  const rules = reactive<FormRules>({
    name: [
      {
        required: true,
        message: '必填',
        trigger: 'blur',
      },
    ],
    code: [
      {
        required: true,
        message: '必填',
        trigger: 'blur',
      },
    ],
    typeCode: [
      {
        required: true,
        message: '必填',
        trigger: 'change',
      },
    ],
  })
  const props = defineProps({
    data: { required: true, type: Object }, // 赋值目标对象
  })
  const info: any = reactive({
    data: props.data,
    updateLoading: false,
    activeName: 'first',
    columnData: [],
    iscopy: proxy.$route.query.copy,
    related: {},
    parseSqlLoading: false,
    relColumns:[]
  })

  watch(
    () => info.data.code,
    (val, oldValue) => {
      info.data.sqlButtonVO.forEach((item: any) => {
        if (item.alias.indexOf(oldValue) !== -1) {
          item.alias = item.alias.replace(oldValue, '')
        }
        item.alias = val + item.alias
        if (item.url.indexOf('/ab-bpm/biz/bizCustGrid/view/export_') !== -1) {
          item.url = `/ab-bpm/biz/bizCustGrid/view/export_${val}`
        }
        if (item.url.indexOf('/ab-bpm/biz/bizCustGrid/view/import_') !== -1) {
          item.url = `/ab-bpm/biz/bizCustGrid/view/import_${val}`
        }
      })
    }
  )

  const choosecslb = async (list: any) => {
    if (list[0]) {
      info.related = list[0]
      info.data.extendConf = {}
      const extendConfObj = {
        code: info.related.code,
        related: list[0],
      }
      info.data.extendConf = JSON.stringify(extendConfObj)
      info.data.appConfMap.boCode = list[0].boCode
      const resultDesign = await bizApi.bizForm.getDesignCode(info.related.code)
      info.data.relatedId = resultDesign.data.code
      info.data.relatedName = resultDesign.data.name
      // info.data.boCode = list[0].boCode
      // parseSqlFn()
    } else {
      info.data.relatedId = ''
      info.data.relatedName = ''
      info.data.appConfMap.boCode = ''
    }
  }

  const defaultHidden = (item: any) => {
    if (
      item.fieldName == 'id' ||
      item.fieldName == 'id_' ||
      item.fieldName == 'rev' ||
      item.fieldName == 'rev_' ||
      item.fieldName == 'Id' ||
      item.fieldName == 'Rev'
    ) {
      item.hidden = 1
    }
  }

  // 合并数组
  const mergeArraysInObject = (obj:any) => {
  // 递归函数来合并字段值
    function merge(obj:any) {
      const result = obj.table.columns || [];
      if (obj.children && Array.isArray(obj.children)) {
        obj.children.forEach((child:any) => {
          // 递归合并子元素的字段值
          result.push(...merge(child));
        });
      }
      return result;
    }

    return merge(obj);
  }

  
  // 抽离出添加或是删除后的那几条数据
  const findExtraElements = (arr1:any, arr2:any, fieldName:any) => {
    // 找出arr1中在arr2中不存在的元素
    const extraInArr1 = arr1.filter((item1:any) => !arr2.some((item2:any) => item1[fieldName] === item2[fieldName]));

    // 找出arr2中在arr1中不存在的元素
    const extraInArr2 = arr2.filter((item2:any) => !arr1.some((item1:any) => item1[fieldName] === item2[fieldName]));

    // 合并两个数组并返回结果
    return extraInArr1.concat(extraInArr2);
  }

  const parseSqlFn = (subTableSql:string) => {
    // 先设置oldFieldList
    let oldFieldList = abUtil.clone(info.data.fieldsList)
    if(subTableSql && subTableSql.length > 0){
      info.data.sqlContent = subTableSql
    }
    if (info.data.sqlContent.length <= 0) {
      ElMessage({
        message: '请输入sql',
        type: 'warning',
      })
      return false
    }
    info.parseSqlLoading = true
    postData(bizApi.custGrid.parseSqlUrl, {
      dsKey: info.data.dsKey,
      sqlContent: info.data.sqlContent,
    }).then(
      async (result) => {
        info.parseSqlLoading = false
        if (info.related.code && info.related.code.length > 0 || info.data.extendConf && JSON.parse(info.data.extendConf).code && JSON.parse(info.data.extendConf).code.length > 0) {
          const resultDesign = await bizApi.bizForm.getDesignCode(
            info.related.code || JSON.parse(info.data.extendConf).code
          )
          info.data.relatedId = resultDesign.data.code
          info.data.relatedName = resultDesign.data.name
          if (resultDesign.data.pcJson && resultDesign.data.pcJson.column) {
            info.data.columnData = resultDesign.data.pcJson.column
          }
          if (resultDesign.data.mbJson && resultDesign.data.mbJson.column) {
            info.data.columnData = resultDesign.data.mbJson.column
          }
        }

        if(info.data.appConfMap.boCode && info.data.appConfMap.boCode.length > 0){
          let relColumns = await bizApi.bizObject.getBizObject(
            info.data.appConfMap.boCode
          )
          if(relColumns.data && relColumns.data.rel){
            info.relColumns = mergeArraysInObject(relColumns.data.rel)
          }
        }

        // 如果是添加子表时的fieldsList列表更新 并且带过来格式类型
        if(subTableSql){
          let list = findExtraElements(oldFieldList,result.data,'fieldName')
          if(list && list.length > 0){
            if(result.data && result.data.length > oldFieldList.length){
              fieldsListInit(list)
              info.data.fieldsList = info.data.fieldsList.concat(list)
            }
            if(result.data && result.data.length < oldFieldList.length){
              // 使用filter方法过滤array1中的元素
              info.data.fieldsList = oldFieldList.filter((oldItem:any) => {
                // 检查array2中是否存在与item1字段fieldName相同的元素
                return !list.some((listItem:any) => listItem.fieldName === oldItem.fieldName);
              });
            }
          }
        }else{
          // 如果是关联在线表单或者是关联流程时的fieldsList列表更新 并且带过来格式类型
          info.data.fieldsList = result.data
          fieldsListInit(info.data.fieldsList)
        }

        if (info.data.fieldsList.length > 0) {
          const arr: any = []
          info.data.pkName = ''
          if(info.data.fieldsList[0].fieldName.includes("id") || info.data.fieldsList[0].fieldName.includes("ID")){
            info.data.pkName = info.data.fieldsList[0].fieldName
          }
          if (!info.data.tableName || info.data.tableName.length <= 0) {
            info.data.tableName = info.data.fieldsList[0].tableName
          }
          info.data.fieldsList.forEach((item: any) => {
            defaultHidden(item)
            if (!item.hrefConfMap) {
              item.hrefConfMap = {
                url: '',
              }
            }
            if (!item.additionConfMap) {
              item.additionConfMap = {
                isFix: 0,
                miniListWidth: item.fieldDesc.length <= 3 ? 90 : 140,
              }
            }
            arr.push({
              tableAlias: item.tableAlias,
              tableName: item.tableName,
            })
          })
          info.data.sqlTableList = JSON.stringify(deWeightThree(arr))
          // 默认加个新增按钮
          info.data.sqlButtonVO = []
          if (info.data.gridType == 'app') {
            info.data.sqlButtonVO.push({
              name: '发起流程',
              alias: `${info.data.code}_add_${abUtil.AbRandom.GetRandomStr(6)}`,
              type: '2',
              mustSelect: 0,
              btncss: 'primary',
              warnTxt: '',
              successTxt: '',
              url: `/bpm/flowStart/${info.data.relatedId}`, // 流程key
              exp: '',
              joinBtnRight: 1,
              hrefSetting: {
                openType: 'tab',
              },
            })
            // 待办视图
            info.data.sqlButtonVO.push({
              name: '详情',
              alias: `${
                info.data.code
              }_todoTask_detail_${abUtil.AbRandom.GetRandomStr(6)}`,
              type: '1',
              mustSelect: null,
              btncss: 'primary',
              warnTxt: '',
              successTxt: '',
              url: '/bpm/bpm/taskComplate?id=${taskId}', // 流程key
              exp: 'true',
              joinBtnRight: 1,
              hrefSetting: {
                openType: 'tab',
              },
              expand: {
                appQueryType: 'todoTask',
              },
            })
            // 已办视图
            info.data.sqlButtonVO.push({
              name: '详情',
              alias: `${
                info.data.code
              }_approve_detail_${abUtil.AbRandom.GetRandomStr(6)}`,
              type: '1',
              mustSelect: null,
              btncss: 'primary',
              warnTxt: '',
              successTxt: '',
              url: '/bpm/bpm/instanceDetail?opId=${opId}', // 流程key
              exp: 'true',
              joinBtnRight: 1,
              hrefSetting: {
                openType: 'tab',
              },
              expand: {
                appQueryType: 'approve',
              },
            })
            // 抄送视图
            info.data.sqlButtonVO.push({
              name: '详情',
              alias: `${
                info.data.code
              }_receive_detail_${abUtil.AbRandom.GetRandomStr(6)}`,
              type: '1',
              mustSelect: null,
              btncss: 'primary',
              warnTxt: '',
              successTxt: '',
              url: '/bpm/bpm/instanceDetail?instId=${instId}&carbonId=${carbonId}&nodeKey=${nodeKey}', // 流程key
              exp: 'true',
              joinBtnRight: 1,
              hrefSetting: {
                openType: 'tab',
              },
              expand: {
                appQueryType: 'receive',
              },
            })
            // 我发起的
            info.data.sqlButtonVO.push({
              name: '详情',
              alias: `${
                info.data.code
              }_applyTask_detail_${abUtil.AbRandom.GetRandomStr(6)}`,
              type: '1',
              mustSelect: null,
              btncss: 'primary',
              warnTxt: '',
              successTxt: '',
              url: '/bpm/bpm/instanceDetail?instId=${instId}', // 流程key
              exp: 'true',
              joinBtnRight: 1,
              hrefSetting: {
                openType: 'tab',
              },
              expand: {
                appQueryType: 'applyTask',
              },
            })
          } else {
            if (info.data.gridType !== 'report') {
              if (info.data.relatedId.length > 0) {
                info.data.sqlButtonVO.push({
                  name: '新增',
                  alias: `${info.data.code}_add_${abUtil.AbRandom.GetRandomStr(
                    6
                  )}`,
                  type: '2',
                  mustSelect: 0,
                  btncss: 'primary',
                  warnTxt: '',
                  successTxt: '',
                  url: `/biz/bizForm/formViewAdd/${info.data.relatedId}?saveBack=1`, // 表单别名
                  exp: '',
                  joinBtnRight: 1,
                  hrefSetting: {
                    openType: 'tab',
                  },
                })
                info.data.sqlButtonVO.push({
                  name: '编辑',
                  alias: `${info.data.code}_edit_${abUtil.AbRandom.GetRandomStr(
                    6
                  )}`,
                  type: '1',
                  mustSelect: null,
                  btncss: 'primary',
                  warnTxt: '',
                  successTxt: '',
                  url: `/biz/bizForm/formViewEdit/${info.data.relatedId}?id=\${${info.data.pkName}}&saveBack=1`, // 编码
                  exp: 'true',
                  joinBtnRight: 1,
                  hrefSetting: {
                    openType: 'drawer',
                    openDrawerOrDialog:'drawerOpen',
                    component:"FormViewEdit",
                    paramsList:[{name:'id',paramsValue:info.data.pkName},{name:'saveClose',paramsValue:"1"}],
                    FormSeletorName:info.data.extendConf && JSON.parse(info.data.extendConf) && JSON.parse(info.data.extendConf).related ? JSON.parse(info.data.extendConf).related.name : '',
                    FormSeletorCode:info.data.extendConf && JSON.parse(info.data.extendConf) && JSON.parse(info.data.extendConf).related ? JSON.parse(info.data.extendConf).related.code : ''
                  },
                })
                info.data.sqlButtonVO.push({
                  name: '详情',
                  alias: `${
                    info.data.code
                  }_detail_${abUtil.AbRandom.GetRandomStr(6)}`,
                  type: '1',
                  mustSelect: null,
                  btncss: 'primary',
                  warnTxt: '',
                  successTxt: '',
                  url: `/biz/bizForm/formViewDetail/${info.data.relatedId}?id=\${${info.data.pkName}}&saveBack=1`, // 编码
                  exp: 'true',
                  joinBtnRight: 1,
                  hrefSetting: {
                    openType: 'drawer',
                    openDrawerOrDialog:'drawerOpen',
                    component:"FormViewDetail",
                    paramsList:[{name:'id',paramsValue:info.data.pkName},{name:'saveClose',paramsValue:"1"},{name:'isReadOnly',paramsValue:"1"}],
                    FormSeletorName:info.data.extendConf && JSON.parse(info.data.extendConf) && JSON.parse(info.data.extendConf).related ? JSON.parse(info.data.extendConf).related.name : '',
                    FormSeletorCode:info.data.extendConf && JSON.parse(info.data.extendConf) && JSON.parse(info.data.extendConf).related ? JSON.parse(info.data.extendConf).related.code : ''
                  },
                })
                info.data.sqlButtonVO.push({
                  name: '删除',
                  alias: `${info.data.code}_del_${abUtil.AbRandom.GetRandomStr(
                    6
                  )}`,
                  type: '1',
                  mustSelect: null,
                  btncss: 'primary',
                  warnTxt: '确认删除',
                  successTxt: '',
                  url: `/ab-bpm/biz/bizObject/remove/${info.data.appConfMap.boCode}?dataId=\${${info.data.pkName}}`,
                  exp: 'true',
                  joinBtnRight: 1,
                  hrefSetting: {
                    openType: 'directRequest',
                  },
                })
              }
            }
          }
        }
      },
      (error) => {
        info.parseSqlLoading = false
      }
    )
  }

  //数组对象去重
  const deWeightThree = (arr: any) => {
    const map = new Map()
    for (const item of arr) {
      if (!map.has(item.tableName)) {
        map.set(item.tableName, item)
      }
    }
    return [...map.values()]
  }
  const fieldsListUpdate = () => {
    if (info.data.sqlContent.length <= 0) {
      ElMessage({
        showClose: true,
        message: '缺少sql查询脚本',
        type: 'warning',
      })
      return false
    }
    if (info.data.dsKey.length <= 0) {
      ElMessage({
        showClose: true,
        message: '缺少数据源',
        type: 'warning',
      })
      return false
    }
    info.updateLoading = true
    postData(bizApi.custGrid.parseSqlUrl, {
      dsKey: info.data.dsKey,
      sqlContent: info.data.sqlContent,
    }).then(
      (result) => {
        info.data.fieldsList = result.data
        info.updateLoading = false
        ElMessage({
          showClose: true,
          message: '更新成功！',
          type: 'success',
        })
      },
      (error) => {
        info.updateLoading = false
      }
    )
  }

  // 自定义列表处理sql别名
  const addCode = () => {
    if (info.data.sqlContent.length <= 0) {
      ElMessageBox.alert('请输入sql查询脚本', '提示信息', {
        confirmButtonText: 'OK',
        type: 'error',
        callback: (action: Action) => {},
      })
      return false
    }
    postData(bizApi.custGrid.addAliasesUrl, {
      sqlContent: info.data.sqlContent,
    }).then(
      ({ data }) => {
        info.data.sqlContent = data
      },
      () => {}
    )
  }

  // 格式化sql
  const formatSql = () => {
    info.data.sqlContent = sqlFormatter.format(info.data.sqlContent)
  }
  const searchObjName = () => {
    emit('searchObjName')
  }
  const fieldsListInit = (arr: any) => {
    emit('fieldsListInit', arr,info.relColumns)
  }

  // 使用provide时，可以直接提供函数
  provide('parseSqlFn', parseSqlFn);
</script>
