<template>
  <el-container v-if="!info.createFormpath" class="layout-container-demo"
  v-loading="info.loading"
  element-loading-text="正在解析中...">
  <el-header>
    <!-- :after-save-stay="true" -->
    <ab-save
      back-name="FormCustSqlList"
      :before-save-fn="handlebeforesaveFn"
      :save-data="info.data"
      :url="bizApi.custGrid.saveCustUrl"
    >
      <el-button
        v-if="info.data.designType === 'advanced'"
        :loading="info.saveviewloading"
        type="primary"
        @click="saveAndView"
      >
        保存并预览
      </el-button>
      <el-radio-group
        v-model="info.data.designType"
        style="margin-right:12px;margin-left: 12px; vertical-align: middle"
      >
        <!-- list:列表  report:报表 -->
        <template
          v-if="
            info.data.gridType === 'list' || info.data.gridType === 'report'
          "
        >
          <el-radio-button
            v-for="item in info.designOptions"
            :key="item.type"
            :label="item.type"
          >
            {{ item.desc }}
          </el-radio-button>
        </template>
      </el-radio-group>
      <!-- simple:简单模式 -->
      <!-- <el-select
        v-if="
          info.data.designType === 'simple' &&
          (info.data.gridType === 'list' || info.data.gridType === 'report')
        "
        v-model="info.data.tableName"
        class="m-2"
        filterable
        placeholder="请选择表"
        style="margin-right: 12px"
        @change="extNameChange"
      >
        <el-option
          v-for="item in info.objNameOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->
      <el-tag
        v-if="
          info.data.designType === 'simple' &&
          (info.data.gridType === 'list' ||
            info.data.gridType === 'report') &&
          info.data.relatedName &&
          info.data.relatedName.length > 0
        "
        style="margin-left: 12px;"
      >
        {{ info.data.relatedName }}
      </el-tag>
      <ab-cust-dialog
        v-if="
          info.data.designType === 'simple' &&
          (info.data.gridType === 'list' || info.data.gridType === 'report')
        "
        v-model="info.data.relatedName"
        dialog-key="formSelector"
        :param="{
          type_: 'pc',
        }"
        style="display: inline-block; margin:0 6px;"
        @ok="choosecslb"
      >
        关联在线表单
      </ab-cust-dialog>
      <el-tag
        v-if="
          info.data.gridType === 'app' &&
          info.data.relatedName &&
          info.data.relatedName.length > 0 ||
          info.data.gridType === 'bpmReport' &&
          info.data.relatedName &&
          info.data.relatedName.length > 0
        "
        style="margin-right: 12px"
      >
        {{ info.data.relatedName }}
      </el-tag>
      <ab-cust-dialog
        v-if="info.data.gridType === 'app' || info.data.gridType === 'bpmReport'"
        v-model="info.data.relatedName"
        dialog-key="bpmDefinitionSelector"
        style="display: inline-block;margin-right:6px;"
        :dialogSetting="{multiple:0}"
        @ok="chooselcdycx"
      >
        关联流程
      </ab-cust-dialog>
    </ab-save>
  </el-header>
  <el-divider class="dividermar" />
  <el-main>
    <el-scrollbar>
      <div v-if="info.data.designType === 'advanced'">
        <advanced
          :data="info.data"
          @fields-list-init="fieldsListInit"
          @search-obj-name="searchObjName"
        >
          <template #tableName>
            <el-select
              v-model="info.data.tableName"
              class="m-2"
              filterable
              placeholder="请选择表"
              @change="extNameChange"
            >
              <el-option
                v-for="item in info.objNameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </advanced>
      </div>
      <div
        v-if="info.data.designType === 'simple'"
        style="padding: 10px 0 0 0"
      >
        <simple
          v-if="info.data.fieldsList && info.data.fieldsList.length > 0"
          ref="simpleRef"
          v-model="info.data"
          @ext-name-change="extNameChange"
          @fields-list-init="fieldsListInit"
          @search-obj-name="searchObjName"
        />
        <div
          v-if="
            !info.data.fieldsList ||
            (info.data.fieldsList <= 0 && !proxy.$route.query.code)
          "
          style="margin-top: 50px; color: #666; text-align: center"
        >
          <p>请选择关联在线表单的流程</p>
          <ab-cust-dialog
            v-if="info.data.gridType === 'app' || info.data.gridType === 'bpmReport'"
            v-model="info.data.relatedName"
            dialog-key="bpmDefinitionSelector"
            style="display: inline-block"
            :dialogSetting="{multiple:0}"
            @ok="chooselcdycx"
          >
            关联流程
          </ab-cust-dialog>
          <ab-cust-dialog
            v-if="
              info.data.designType === 'simple' &&
              (info.data.gridType === 'list' ||
                info.data.gridType === 'report')
            "
            v-model="info.data.relatedName"
            dialog-key="formSelector"
            :param="{
              type_: 'pc',
            }"
            style="display: inline-block;"
            @ok="choosecslb"
          >
            关联在线表单
          </ab-cust-dialog>
        </div>
      </div>
    </el-scrollbar>
  </el-main>
  </el-container>
  <simple
    v-else
    v-loading="info.createAppLoading"
    element-loading-text="关联表单中..."
    ref="simpleRef"
    v-model="info.data"
    @ext-name-change="extNameChange"
    @fields-list-init="fieldsListInit"
    @search-obj-name="searchObjName"
    :is-app-design="true"
  />
</template>

<script setup lang="ts">
  import { provide } from 'vue';
  import {
    advanced,
    simple,
    abTools,
    sysApi,
    postData,
    getData,
    bizApi,
    abUtil,
    appsquareApi
  } from '~/agilebpm'

  // 检查是否演示环境
  import { checkIsPublicProject, AbRandom } from '~/agilebpm/utils/ab-util'

  window.setTimeout(() => {
    checkIsPublicProject()
  }, 1000)

  const emit = defineEmits(['appSquareAppSave','setDefaultCustGridData'])
  const props = defineProps({
    isAppSquareApp: { default: false, type:Boolean}
  })

  const { proxy } = abTools.useCurrentInstance()
  const simpleRef = ref()

  const info: any = reactive({
    saveviewloading: false,
    loading:false,
    createAppLoading:false,
    data: {
      typeCode: '',
      tableName: '',
      gridType: '',
      designType: 'simple',
      name: '',
      code: '',
      relatedId: '',
      relatedName: '',
      sqlContent: '',
      dsKey: 'dataSourceDefault',
      initQuery: 1,
      pageSize: '10',
      showRowsNum: 1,
      chooseType: 0,
      pkName: '',
      status: 1,
      fixTool: 1,
      operationWidth: 220,
      fieldsList: [],
      sqlConditionVOS: [],
      sqlButtonVO: [],
      leftTreeMap: {},
      enableApp: 0,
      appConfMap: {},
      boCode: '',
      columnData: [],
      columnDataShow: false,
    },
    objNameOptions: [],
    getTableStr: '',
    designOptions: [],
    related: {},
    relColumns:[],
    createFormpath:proxy.$route.name == 'CreateForm' ? true : false
  })

  // 模式
  sysApi.tools
    .getEnum('com.dstz.biz.chart.enums.CustDesignTypeEnum', true)
    .then(({ data }) => {
      info.designOptions = data
      info.data.designType = info.designOptions[0].type
      // 新增报表时 默认高级模式
      if (!proxy.$route.query.code && proxy.$route.query.gridType == 'report') {
        info.data.designType = 'advanced'
      }
    })

  const getDetails = () => {
    // 应用列表设计使用
    if(proxy.$route.name !== 'CreateForm'){
      if (proxy.$route.query.code) {
        getData(
          bizApi.custGrid.custGetByCodeUrl + proxy.$route.query.code,
          {}
        ).then(
          async ({ data }) => {
            if(data){
              setDetailsData(data)
            }
          },
          (error) => {}
        )
      }
    }
    // 应用广场使用
    if(proxy.$route.name == 'CreateForm'){
      if(proxy.$route.params.custGridId){
        // 有了custGridId才允许查询 通过resourceId去查询后台处理
        let id = proxy.$route.params.resourceId
        info.createAppLoading = true
        appsquareApi.thirdParty.getBizCustGridThirdParty(id).then((resp) => {
          info.createAppLoading = false
          if(resp.data){
            setDetailsData(resp.data)
          }
          emit('setDefaultCustGridData',resp.data)
        })
      }
    }
  }
  getDetails()

  const setDetailsData = (data:any) => {
    info.data = data
    if(info.data.extendConf && info.data.extendConf.length > 0){
      if(JSON.parse(info.data.extendConf).code){
        setExtendRelated(JSON.parse(info.data.extendConf).code)
      }
    }
    fieldsListInit(info.data.fieldsList)
    info.data.sqlConditionVOS.forEach((item: any) => {
      if (item.val == '${currentDateTime}') {
        item.val = getNowTime()
      }
    })
    if (proxy.$route.query.copy) {
      info.data.id = ''
      info.data.fieldsList.forEach((element: any) => {
        element.id = ''
      })
      if (info.data.name.indexOf('-复制') === -1) {
        info.data.name = `${info.data.name}-复制`
      }
      if (info.data.code.indexOf('-copy') === -1) {
        info.data.code = `${info.data.code}-copy`
      }
    }
  }

  const getNowTime = () => {
    const myDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
    // const time = myDate.toJSON().split('T').join(' ').substr(0, 19) 年月日时分秒
    const time = myDate.toJSON().split('T')[0]
    return time
  }
  const defaultHidden = (item: any) => {
    if (
      item.fieldName == 'id' ||
      item.fieldName == 'id_' ||
      item.fieldName == 'rev' ||
      item.fieldName == 'rev_' ||
      item.fieldName == 'Id' ||
      item.fieldName == 'Rev' ||
      item.fieldName == 'Id_' ||
      item.fieldName == 'Rev_' ||
      item.fieldName == 'ID' ||
      item.fieldName == 'REV' ||
      item.fieldName == 'ID_' ||
      item.fieldName == 'REV_'
    ) {
      item.hidden = 1
    }
  }

  const bpmReportFieldsListPush = () => {
    info.data.fieldsList.push(
      {
        fieldDesc:'实例标题',
        fieldName:'instTitle',
        name:'title_',
        tableAlias:'bpm_instance',
        tableName:'bpm_instance',
        dataType:"varchar",
        hidden:0,
        exportAble:1,
        sn: info.data.fieldsList.length + 1,
        additionConfMap:{
          listWidth:120,
        },
      },
      {
        fieldDesc:'实例状态',
        fieldName:'instanceStatus',
        name:'status_',
        tableAlias:'bpm_instance',
        tableName:'bpm_instance',
        dataType:"varchar",
        hidden:0,
        exportAble:1,
        align:'c',
        additionConfMap:{
          listWidth:120,
        },
        sn: info.data.fieldsList.length + 1,
      },
      {
        fieldDesc:'当前环节',
        fieldName:'abInstValMapLoader_abTaskUserJson',
        name:'abInstValMapLoader_abTaskUserJson',
        dataType:"varchar",
        hidden:0,
        exportAble:1,
        align:'c',
        additionConfMap:{
          listWidth:160,
        },
        sn: info.data.fieldsList.length + 1,
      },
      {
        fieldDesc:'归档时间',
        fieldName:'endTime',
        name:'end_time_',
        tableAlias:'bpm_instance',
        tableName:'bpm_instance',
        dataType:"datetime",
        formatType:'date_picker',
        hidden:0,
        exportAble:1,
        sn: info.data.fieldsList.length + 1,
        formatDefault:{
          value:"yyyy-MM-dd HH:mm:ss"
        },
        additionConfMap:{
          listWidth:120,
        },
      },
      )
  }

  // 查询ObjName
  const searchObjName = () => {
    getData(bizApi.bizTable.BizTableSearchObjName, {
      dsKey: info.data.dsKey || 'dataSourceDefault',
      objType: 'table',
      objName: '',
    }).then(
      ({ data }) => {
        const arr = []
        for (const key in data) {
          arr.push({
            value: key,
            label:
              data[key] && data[key].length > 0 ? `${data[key]}[${key}]` : key,
          })
        }
        info.objNameOptions = arr
      },
      () => {}
    )
  }
  const extNameChange = (value: any) => {
    if (!info.data.tableName) {
      return
    }
    postData(bizApi.customDialog.bizCustDialogGetTable, {
      dsKey: info.data.dsKey,
      objName: info.data.tableName,
      objType: 'table',
      dataSource: 'database',
    }).then((resp: any) => {
      if (resp.data) {
        const table = resp.data
        let str = ''
        // 拼接sqlTableList列表
        // const sqlTableListStr = [
        //   { tableAlias: table.name, tableName: table.name },
        // ]
        // info.data.sqlTableList = JSON.stringify(sqlTableListStr)
        /**
         * 合并字段信息
         */
        table.columns.forEach((item: any) => {
          str += `${item.name},`
        })
        info.getTableStr = `select  ${str.slice(0, -1)} from ${table.name}`
        addAliases()
      } else {
        ElMessage.error(`找不到该表${info.data.tableName}`)
      }
    })
  }

  // subTableSql 添加子表的sql
  const addAliases = (subTableSql:string) => {
    postData(bizApi.custGrid.addAliasesUrl, {
      sqlContent: subTableSql || info.getTableStr,
    }).then(
      ({ data }) => {
        info.data.sqlContent = data
        // advanced:高级模式
        if (info.data.designType === 'advanced') {
          console.log(data)
        } else {
          parseSqlFn(subTableSql ? true : false)
        }
      },
      () => {}
    )
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

    let arr = extraInArr1.concat(extraInArr2)
    arr = arr.filter(item => item.fieldName !== 'instTitle' && item.fieldName !== 'instanceStatus' && item.fieldName !== 'abInstValMapLoader_abTaskUserJson' && item.fieldName !=='endTime');
    // 合并两个数组并返回结果
    return arr;
  }

  const parseSqlFn = (addSubtable:any) => {
    if (info.data.sqlContent.length <= 0) {
      ElMessage({
        message: '请输入sql',
        type: 'warning',
      })
      return false
    }
    let url = proxy.$route.params.resourceId ? appsquareApi.thirdParty.parseSqlThirdPartyUrl + proxy.$route.params.resourceId : bizApi.custGrid.parseSqlUrl
    postData(url, {
      dsKey: info.data.dsKey,
      sqlContent: info.data.sqlContent,
    }).then(
      async (result) => {
        const resultDesign = await bizApi.bizForm.getDesignCode(
          info.data.gridType === 'app' || info.data.gridType === 'bpmReport'
            ? JSON.parse(info.data.extendConf).formCode
            : info.related.code || JSON.parse(info.data.extendConf).code
        )
        const relColumns = await bizApi.bizObject.getBizObject(
           info.data.gridType === 'app' || info.data.gridType === 'bpmReport'
            ? JSON.parse(info.data.extendConf).boCode
            : info.data.appConfMap.boCode
        )

        if(relColumns.data && relColumns.data.rel){
          info.relColumns = mergeArraysInObject(relColumns.data.rel)
        }

        if (info.data.gridType !== 'app' && info.data.gridType !== 'bpmReport') {
          info.data.relatedId = resultDesign.data.code
          info.data.relatedName = resultDesign.data.name
        }

        if (resultDesign.data.pcJson && resultDesign.data.pcJson.column) {
          info.data.columnData = resultDesign.data.pcJson.column
        }
        if (resultDesign.data.mbJson && resultDesign.data.mbJson.column) {
          info.data.columnData = resultDesign.data.mbJson.column
        }
        // 如果是添加子表时的fieldsList列表更新 并且带过来格式类型
        if(addSubtable){
          let oldFieldList = abUtil.clone(info.data.fieldsList)
          let newFieldList = result.data
          // 创建一个映射，以arr1中的fieldName作为键
          const fieldNameMap = new Map(oldFieldList.map(item => [item.fieldName, item]));
          // 初始化结果数组
          const resultF = [] as any;
          // 遍历arr2，根据fieldName进行覆盖或添加
          newFieldList.forEach(item2 => {
            if (fieldNameMap.has(item2.fieldName)) {
              // 如果fieldName相同，arr1覆盖arr2
              resultF.push(fieldNameMap.get(item2.fieldName));
            } else {
              // 如果fieldName不同，直接添加到结果数组
              resultF.push(item2);
            }
          });
          info.data.fieldsList = abUtil.clone(resultF)
          fieldsListInit(info.data.fieldsList)
        }else{
          // 如果是关联在线表单或者是关联流程时的fieldsList列表更新 并且带过来格式类型
          info.data.fieldsList = result.data
          fieldsListInit(info.data.fieldsList)
        }

        if(info.data.gridType == 'bpmReport'){
          bpmReportFieldsListPush()
        }

        if (info.data.fieldsList.length > 0) {
          const arr: any = []
          // info.data.code = info.data.fieldsList[0].tableName.tuoFeng()
          info.data.pkName = info.data.fieldsList[0].fieldName
          info.data.fieldsList.forEach((item: any, index: any) => {
            if (index == 0) {
              info.data.tableName = item.tableName
            }
            defaultHidden(item)
            if (!item.hrefConfMap) {
              item.hrefConfMap = {
                url: '',
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
              alias: `${info.data.code}_add_${AbRandom.GetRandomStr(6)}`,
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
              name: '办理',
              alias: `${info.data.code}_todoTask_detail_${AbRandom.GetRandomStr(
                6
              )}`,
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
              name: '已办详情',
              alias: `${info.data.code}_approve_detail_${AbRandom.GetRandomStr(
                6
              )}`,
              type: '1',
              mustSelect: null,
              btncss: 'primary',
              warnTxt: '',
              successTxt: '',
              url: '/bpm/bpm/instanceDetail?id=${opId}&type=opId', // 流程key
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
              name: '抄送详情',
              alias: `${info.data.code}_receive_detail_${AbRandom.GetRandomStr(
                6
              )}`,
              type: '1',
              mustSelect: null,
              btncss: 'primary',
              warnTxt: '',
              successTxt: '',
              url: '/bpm/bpm/instanceDetail?id=${carbonId}&type=carbonId', // 流程key
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
              name: '实例详情',
              alias: `${
                info.data.code
              }_applyTask_detail_${AbRandom.GetRandomStr(6)}`,
              type: '1',
              mustSelect: null,
              btncss: 'primary',
              warnTxt: '',
              successTxt: '',
              url: '/bpm/bpm/instanceDetail?id=${instId}&type=instIdStart', // 流程key
              exp: 'true',
              joinBtnRight: 1,
              hrefSetting: {
                openType: 'tab',
              },
              expand: {
                appQueryType: 'applyTask',
              },
            })
          } else if(info.data.gridType == 'bpmReport'){
            // 我发起的
            info.data.sqlButtonVO.push({
              name: '实例详情',
              alias: `${
                info.data.code
              }_applyTask_detail_${AbRandom.GetRandomStr(6)}`,
              type: '1',
              mustSelect: null,
              btncss: 'primary',
              warnTxt: '',
              successTxt: '',
              url: '/bpm/bpm/bpmInstanceListDetail/' + info.data.relatedId + '?id=${instId}&type=instIdStart', // 流程key
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
                  alias: `${info.data.code}_add_${AbRandom.GetRandomStr(6)}`,
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
                  alias: `${info.data.code}_edit_${AbRandom.GetRandomStr(6)}`,
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
                    FormSeletorName:JSON.parse(info.data.extendConf) && JSON.parse(info.data.extendConf).related ? JSON.parse(info.data.extendConf).related.name : '',
                    FormSeletorCode:JSON.parse(info.data.extendConf) && JSON.parse(info.data.extendConf).related ? JSON.parse(info.data.extendConf).related.code : ''
                  },
                })
                info.data.sqlButtonVO.push({
                  name: '详情',
                  alias: `${info.data.code}_detail_${AbRandom.GetRandomStr(6)}`,
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
                    FormSeletorName:JSON.parse(info.data.extendConf) && JSON.parse(info.data.extendConf).related ? JSON.parse(info.data.extendConf).related.name : '',
                    FormSeletorCode:JSON.parse(info.data.extendConf) && JSON.parse(info.data.extendConf).related ? JSON.parse(info.data.extendConf).related.code : ''
                  },
                })
                info.data.sqlButtonVO.push({
                  name: '删除',
                  alias: `${info.data.code}_del_${AbRandom.GetRandomStr(6)}`,
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
        info.loading = false
        info.createAppLoading = false
      },
      (error) => {
        info.loading = false
        info.data.fieldsList = []
        info.data.name = ''
        info.data.code = ''
      }
    )
  }

  // 请求对话框详情 查看存下的表单
  const setExtendRelated = (code:any) => {
    postData(bizApi.customDialog.listSimpleData + 'formSelector', {
      pageSize: 10,
      currentPage: 1,
      queryParam: {code_$VLK:code},
    }).then(
      (result) => {
        if(result.data){
          let data = result.data[0]
          const extendConfObj = {
            code: data.code,
            related: data,
          }
          info.data.extendConf = JSON.stringify({...extendConfObj,...JSON.parse(info.data.extendConf)})
        }
      },
      () => {}
    )
  }

  // 请求对话框详情数据
  const getDialogData = (dialogKey: any, row: any, column: any) => {
    getData(bizApi.customDialog.getByCode + dialogKey, {}).then(
      (result: any) => {
        const fileds = [] as any[]
        row.custDialogBackList = []
        //如果数据源是接口的话取返回值和条件字段的交集
        if (result.data.dataSource === 'interface') {
          if (
            result.data.conditionFields?.length === 0 ||
            result.data.returnFields?.length === 0
          ) {
            return
          }
          result.data.returnFields.forEach((rf: any) => {
            const filed = result.data.conditionFields.find((cf: any) => {
              return rf.columnName === cf.columnName
            })
            if (filed) {
              fileds.push(rf)
            }
          })

          if (fileds.length === 0) {
            return
          }
        } else {
          fileds.push(...result.data.returnFields)
        }
        //处理返回字段和显示字段
        if (result.data.displayFields) {
          fileds.forEach((rf: any) => {
            const item = result.data.displayFields.find((df: any) => {
              return df.columnName === rf.columnName
            })
            rf.showName = rf.returnName
            if (item) {
              rf.showName = `${item.showName}(${rf.returnName})`
            }
          })
        }
        fileds.forEach((item: any) => {
          row.custDialogBackList.push({
            returnName: item.returnName,
            showName: item.showName,
            columnName: item.columnName,
          })
        })
        if (column) {
          if (row.custDialogBackList.length > 0) {
            if(column.type == 'cascadeSelect' || column.type == 'region'){
              row.formatConf.labelField = column.labelField
              row.formatConf.valueField = column.valueField
            }else{
              row.formatConf.labelField = column.dataSelectorConfig.labelField || column.labelField
              row.formatConf.valueField = column.dataSelectorConfig.valueField || column.valueField
              row.formatConf.labelColumn = column.dataSelectorConfig.labelColumn || column.labelColumn
              row.formatConf.param = column.dataSelectorConfig.param || column.param
            }
          }
        }
      },
      () => {}
    )
  }

  const setDefaultDialog = (column: any, item: any) => {
    if (column.type == 'onetext') {
      item.formatType = ''
    }
    if (column.type == 'file' && column.listType == 'text') {
      item.formatType = 'file'
    }
    if (column.type == 'file' && column.listType == 'picture-card') {
      item.formatType = 'picture'
    }
    if (
      column.type == 'select' ||
      column.type == 'radio' ||
      column.type == 'checkbox' ||
      column.type == 'multiSelect' ||
      column.type == 'steps'
    ) {
      if (column.dicCode && column.dicCode.length > 0) {
        item.formatType = 'dic'
        item.formatConf = {}
        item.formatConf.code = column.dicCode
        item.formatConf.name = column.dicCodeName
        item.formatDefault.code = column.dicCode
        item.formatDefault.name = column.dicCodeName
        sysApi.dict
          .getDictTreeByCodeNoRoot(item.formatConf.code)
          .then((data) => {
            item.formatConf.dictList = []
          })
      } else {
        item.formatType = 'json'
        item.formatConfJsonList = []
        let jsonList = []
        if(column.type == 'steps'){
          jsonList = column.param && column.param.length > 0 ? column.param : []
        }else{
          jsonList = column.dicData && column.dicData.length > 0 ? column.dicData : []
        }
        if (jsonList.length > 0) {
          jsonList.forEach((dicItem: any, indexItem: any) => {
            item.formatConfJsonList.push({
              key: dicItem.label,
              value: String(dicItem.value),
            })
          })
        }
      }
    }
    if (column.type == 'date' || (column.type == 'hidden' && column.fieldType == 'date')) {
      item.formatType = 'date_picker'
      item.formatDefault = {}
      if (column.dateFormat && column.dateFormat.length > 0 || column.dateType && column.dateType.length > 0) {
        if (column.dateFormat == 'YYYY-MM-DD' || column.dateType == 'date') {
          item.formatDefault.value = 'yyyy-MM-dd'
        }
        if (column.dateFormat == 'YYYY-MM-DD HH:mm:ss' || column.dateType == 'datetime') {
          item.formatDefault.value = 'yyyy-MM-dd HH:mm:ss'
        }
        if (column.dateFormat == 'YYYY' || column.dateType == 'year') {
          item.formatDefault.value = 'yyyy'
        }
        if (column.dateFormat == 'YYYY-MM' || column.dateType == 'month') {
          item.formatDefault.value = 'yyyy-MM'
        }
      } else {
        item.formatDefault.value = 'yyyy-MM-dd'
      }
    }

    if (column.type == 'region') {
      item.formatType = 'region'
      item.formatConf = {}
      item.formatConf.dialogKey = column.dialogKey
      item.formatConf.dialogName =
        column.dialogName || column.label
      item.formatConf.labelField = ''
      item.formatConf.valueField = ''
      item.formatConf.dialogType = column.type
      getDialogData(item.formatConf.dialogKey, item, column)
    }
    if (column.type == 'cascadeSelect') {
      item.formatType = 'cascadeSelect'
      item.formatConf = {}
      item.formatConf.dialogKey = column.dialogKey
      item.formatConf.dialogName =
        column.dialogName || column.label
      item.formatConf.labelField = ''
      item.formatConf.valueField = ''
      item.formatConf.labelColumn = ''
      item.formatConf.param = ''
      item.formatConf.dialogType = column.type
      getDialogData(item.formatConf.dialogKey, item, column)
    }
    if (column.type == 'treeSelect') {
      if (column.dicCode && column.dicCode.length > 0) {
        item.formatType = 'dic'
        item.formatConf = {}
        item.formatConf.code = column.dicCode
        item.formatConf.name = column.dicCodeName
        if (item.formatConf) {
          if (typeof item.formatConf == 'string') {
            item.formatDefault = JSON.parse(item.formatConf)
          } else {
            item.formatDefault = item.formatConf
          }
        }
        sysApi.dict
          .getDictTreeByCodeNoRoot(item.formatConf.code)
          .then((data) => {
            item.formatConf.dictList = []
          })
      }
    }
    if (
      (column.type == 'dataSelector' ||
        column.type == 'userSelect' ||
        column.type == 'roleSelect' ||
        column.type == 'orgSelect' ||
        column.type == 'postSelect') &&
      column.dataSelectorConfig
    ) {
      item.formatType = 'dialog'
      item.formatConf = {}
      item.formatConf.dialogKey = column.dataSelectorConfig.dialogKey
      item.formatConf.dialogName =
        column.dataSelectorConfig.dialogName || column.label
      item.formatConf.labelField = ''
      item.formatConf.valueField = ''
      item.formatConf.labelColumn = ''
      item.formatConf.param = ''
      item.formatConf.dialogType = column.type
      getDialogData(item.formatConf.dialogKey, item, column)
    }
  }

  const fieldsListInit = (arrList: any,relColumns:any) => {
    arrList.forEach((item: any, index: any) => {
      if (
        item.dataType &&
        (item.dataType == 'longtext' ||
          item.dataType == 'mediumtext' ||
          item.dataType == 'tinytext' ||
          item.dataType == 'text' ||
          item.dataType == 'blob' ||
          item.dataType == 'mediumblob' ||
          item.dataType == 'longblob' ||
          item.dataType == 'tinyblob' ||
          item.dataType == 'BLOB' ||
          item.dataType == 'nclob')
      ) {
        item.exportAble = 0
      }
      if (!item.additionConfMap) {
        item.additionConfMap = {
          isFix: 0,
          miniListWidth: item.fieldDesc.length <= 3 ? 90 : 140,
        }
      }
      if (item.additionConfMap.listWidth) {
        item.additionConfMap.listWidth = Number(item.additionConfMap.listWidth)
      }
      if (item.additionConfMap.miniListWidth) {
        item.additionConfMap.miniListWidth = Number(
          item.additionConfMap.miniListWidth
        )
      }
      if (!item.hrefConfMap) {
        item.hrefConfMap = {}
      }

      if(item.hrefConfMap && item.hrefConfMap.openType == 'drawer' && !item.hrefConfMap.openDrawerOrDialog){
        item.hrefConfMap.openDrawerOrDialog = 'drawerOpen'
      }
      if (!item.cssConfList) {
        item.cssConfList = []
      }
      if (!item.formatConf) {
        if (item.formatType === 'decimal') {
          item.formatDefault = {
            coinValue: '',
            isDecimal: false,
            decimalValue: 0,
          }
        } else {
          item.formatDefault = {
            value: '',
          }
        }
      } else {
        if (item.formatType && item.formatType !== 'javascript') {
          if (typeof item.formatConf == 'string') {
            item.formatDefault = JSON.parse(item.formatConf)
          } else {
            item.formatDefault = item.formatConf
          }
        }
      }
      if (
        item.formatType &&
        (item.formatType === 'date_picker' || item.formatType === 'decimal')
      ) {
        if (item.formatConf && item.formatConf.length > 0) {
          item.formatDefault = JSON.parse(item.formatConf)
        }
      }

      if (item.formatType && item.formatType === 'dic') {
        if (item.formatConf) {
          if (typeof item.formatConf == 'string') {
            item.formatDefault = JSON.parse(item.formatConf)
          }
        }
      }
      if (item.formatType && item.formatType === "region") {
        if (item.formatConf) {
          if (typeof item.formatConf == 'string') {
            item.formatConf = JSON.parse(item.formatConf)
          }
        }
      }
      if (item.formatType && item.formatType === 'dialog' || item.formatType && item.formatType === 'cascadeSelect') {
        if (item.formatConf) {
          if (typeof item.formatConf == 'string') {
            item.formatConf = JSON.parse(item.formatConf)
          }
        }
        getDialogData(item.formatConf.dialogKey, item, false)
      }
      if (item.formatType && item.formatType === 'json') {
        if (!item.formatConfJsonList) {
          item.formatConfJsonList = []
        }
        if (item.formatConf && item.formatConf.length > 0) {
          item.formatConfJsonList = JSON.parse(item.formatConf)
        }
      } else {
        item.formatConfJsonList = []
      }

      if (item.formatType && item.formatType == 'timestamp') {
        if (!item.formatConf) {
          item.formatConf = {
            timeType:'YYYY-MM-DD'
          }
        }
        if (item.formatConf) {
          if (typeof item.formatConf == 'string') {
            item.formatConf = JSON.parse(item.formatConf)
          }
        }
      }

      let columnN = {} as any
      if(relColumns){
        info.relColumns = relColumns
      }
      if(info.relColumns && info.relColumns.length > 0){
        info.relColumns.forEach((relColumn: any) => {
          if(item.name.toLowerCase() == relColumn.name.toLowerCase()){
            if (info.data.columnData && info.data.columnData.length > 0) {
              info.data.columnData.forEach((column:any) => {
                if (
                  (column.type == 'dynamic' || column.type == 'group') &&
                  column.children &&
                  column.children.column &&
                  column.children.column.length > 0
                ) {
                  column.children.column.forEach(
                    (columnGroup: any) => {
                      columnN = columnGroup
                      if (columnN.code == relColumn.code) {
                        setDefaultDialog(columnN, item)
                      }
                    }
                  )
                } else if (
                  column.type == 'tabs' &&
                  column.tabsColumn &&
                  column.tabsColumn.length > 0
                ) {
                  column.tabsColumn.forEach((tabsColumnItem: any) => {
                    if (
                      tabsColumnItem.children &&
                      tabsColumnItem.children.column &&
                      tabsColumnItem.children.column.length > 0
                    ) {
                      tabsColumnItem.children.column.forEach(
                        (tabsColumnItemColumn: any) => {
                          columnN = tabsColumnItemColumn
                          if (
                            columnN.code == relColumn.code
                          ) {
                            setDefaultDialog(columnN, item)
                          }
                        }
                      )
                    }
                  })
                }else{
                  columnN = column
                  if (columnN.code == relColumn.code) {
                    setDefaultDialog(columnN, item)
                  }
                }
              })
            }
          }
        })
      }
    })
  }

  const compareStringsIgnoreCase = (str1: any, str2: any) => {
    // 去除特殊字符并转为小写
    const cleanStr1 = str1.replace(/[_\W]/g, '').toLowerCase()
    const cleanStr2 = str2.replace(/[_\W]/g, '').toLowerCase()

    // 使用正则表达式进行对比
    const regex = new RegExp(`^${cleanStr1}$`)
    return regex.test(cleanStr2)
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

  // 添加应用 选择流程
  const chooselcdycx = async (list: any) => {
    if (list[0]) {
      const resultD = await bizApi.custGrid.getFormInfoByDefKey(list[0] ? list[0].key : '')
      info.data.extendConf = {}
      const extendConfObj = {
        definitionId: list[0].key,
        formCode: resultD.data.formCode,
        boCode:resultD.data.boCode
      }
      info.data.extendConf = JSON.stringify(extendConfObj)
      info.data.relatedId = list[0].key
      info.data.relatedName = resultD.data.defName
      info.loading = true
      getData(bizApi.custGrid.getFormUrl + resultD.data.formCode, {}).then(
        ({ data }) => {
          if (data) {
            info.data.appConfMap.boCode = data.boCode
          }
        },
        () => {}
      )
      getData(
        bizApi.custGrid.getTableNameByFormKeyUrl + resultD.data.formCode,
        {}
      ).then(
        ({ data }) => {
          if (data) {
            // info.data.tableName = data
            for (const i in data) {
              info.data.tableName = data[i]
              info.data.dsKey = i
            }
            extNameChange()
          } else {
            ElMessage({
              message: `根据表单key：${list[0].target_id_}未查询出关联业务对象的主表`,
              type: 'error',
            })
            info.data.fieldsList = []
          }
        },
        () => {}
      )
      // 拿到表明请求
    } else {
      info.data.relatedId = ''
      info.data.relatedName = ''
    }
  }

  const setForm = (data:any) => {
    if(data){
      getTableNameByFormKeyFn(data)
    }else{
      info.data.appConfMap.boCode = ''
    }
  }

  const getTableNameByFormKeyFn = (obj:any) => {
    info.related = obj
    info.data.extendConf = {}
    let code = obj.code || obj.pcFormCode
    const extendConfObj = {
      code: code,
      related: obj,
    }
    info.data.extendConf = JSON.stringify(extendConfObj)
    info.data.appConfMap.boCode = obj.boCode
    info.loading = true
    info.createAppLoading = true
    if (info.data.designType === 'simple') {
      getData(
        bizApi.custGrid.getTableNameByFormKeyUrl + code,
        {}
      ).then(
        ({ data }) => {
          if (data) {
            for (const i in data) {
              info.data.tableName = data[i]
              info.data.dsKey = i
            }
            extNameChange()
          } else {
            ElMessage({
              message: `根据表单key：${code}未查询出关联业务对象的主表`,
              type: 'error',
            })
          }
        },
        () => {}
      )
    }
  }

  const choosecslb = (list: any) => {
    if (list[0]) {
      getTableNameByFormKeyFn(list[0])
    } else {
      info.data.appConfMap.boCode = ''
    }
  }

  const setparams = () => {
    info.data.fieldsList.forEach((item: any) => {
      if (item.formatType && item.formatType === 'json') {
        if (item.formatConfJsonList && item.formatConfJsonList.length > 0) {
          item.formatConf = JSON.stringify(item.formatConfJsonList)
        }
      }
      if (
        item.formatType &&
        (item.formatType === 'date_picker' || item.formatType === 'decimal')
      ) {
        if (item.formatDefault) {
          item.formatConf = JSON.stringify(item.formatDefault)
        }
      }

      if (item.formatType && item.formatType === 'dic') {
        if (item.formatDefault) {
          item.formatConf = JSON.stringify(item.formatDefault)
        }
        if (typeof item.formatConf == 'object') {
          item.formatConf = JSON.stringify(item.formatConf)
        }
      }
      if (item.formatType && (item.formatType === 'region' || item.formatType === 'timestamp' || item.formatType === 'dialog' || item.formatType === "cascadeSelect")) {
        if (typeof item.formatConf == 'object') {
          item.formatConf = JSON.stringify(item.formatConf)
        }
      }
      // 其他配置 列宽 最小列宽 左侧固定
      item.additionConf = JSON.stringify(item.additionConfMap)
      item.bgColorConf = JSON.stringify(item.bgColorConfMap)
    })
    info.data.sqlConditionVOS.forEach((item: any) => {
      if (item.controlType) {
        if (typeof item.formatConf == 'object') {
          item.formatConf = JSON.stringify(item.formatConf)
        }
        if (item.controlType && item.controlType == 'dic') {
          if (item.formatDefault) {
            item.formatConf = JSON.stringify(item.formatDefault)
          }
          if (typeof item.formatConf == 'object') {
            item.formatConf = JSON.stringify(item.formatConf)
          }
        }
      }
    })
    if (proxy.$route.query.copy == '1') {
      if (info.data.sqlButtonVO && info.data.sqlButtonVO.length > 0) {
        info.data.sqlButtonVO.forEach((item: any) => {
          item.alias = item.alias.substring(0, item.alias.length - 6)
          item.alias = item.alias + AbRandom.GetRandomStr(6)
        })
      }
    }
    // 默认排序转成JSON格式
    if(typeof info.data.fieldSort == 'object'){
      info.data.fieldSort = JSON.stringify(info.data.fieldSort)
    }
    if(props.isAppSquareApp){
      info.data.gridType = 'list'
      emit('appSquareAppSave',info.data)
    }
  }
  const handlebeforesaveFn = () => {
    if(info.data.designType === 'simple' && (info.data.gridType === 'list' || info.data.gridType === 'app' || info.data.gridType === 'bpmReport')){
      if (!info.data.relatedName || info.data.relatedName.length <= 0) {
        ElMessage({
          message: info.data.gridType === 'list' ? '请关联在线表单' : '请关联流程',
          type: 'warning',
        })
        return false
      }
    }

    if(!props.isAppSquareApp){
      if (info.data.name.length <= 0 || info.data.code.length <= 0 || info.data.code.length > 50) {
        ElMessage({
          message: '表单填写不正确,请完善名称或编码',
          type: 'warning',
        })
        simpleRef.value.setActiveNameBasic()
        return false
      }
      if (info.data.typeCode.length <= 0) {
        ElMessage({
          message: '请选择分类',
          type: 'warning',
        })
        return false
      }
      if (info.data.pkName.length <= 0) {
        ElMessage({
          message: '请选择主键',
          type: 'warning',
        })
        return false
      }
    }

    if (info.data.gridType !== 'app') {
      if (info.data.sqlContent && info.data.sqlContent.length <= 0) {
        ElMessage({
          message: '表单填写不正确',
          type: 'warning',
        })
        return false
      }
    }
    // 拓展字段添加
    if (info.data.extendConf) {
      const extendConf = JSON.parse(info.data.extendConf)
      extendConf.operationWidth = info.data.operationWidth
      info.data.extendConf = JSON.stringify(extendConf)
    }
    // 拓展字段添加
    if (!info.data.extendConf) {
      info.data.extendConf = {}
      info.data.extendConf.operationWidth = info.data.operationWidth
      info.data.extendConf = JSON.stringify(info.data.extendConf)
    }
    // 数据字典 对话框是否配置格式化
    let isSave = true
    let isSaveText = ''
    try {
      info.data.sqlConditionVOS.forEach((item: any, index: any) => {
        if (item.controlType && item.controlType == 'dic') {
          if (item.formatConf) {
            if (typeof item.formatConf == 'string') {
              item.formatConf = JSON.parse(item.formatConf)
            }
          }
          if (!item.formatDefault.code || item.formatDefault.code.length <= 0) {
            isSave = false
            isSaveText = `列表查询【${item.fieldDesc}】` + `数据字典配置异常`
            throw Error()
          }
        }
        if (item.controlType && item.controlType == 'dialog') {
          if (
            !item.dialogConf.showValue ||
            item.dialogConf.showValue.length <= 0
          ) {
            isSave = false
            isSaveText =
              `列表查询【${item.fieldDesc}】` + `对话框显示字段不能为空`
          }
          if (!item.dialogConf.value || item.dialogConf.value.length <= 0) {
            isSave = false
            isSaveText =
              `列表查询【${item.fieldDesc}】` + `对话框返回字段不能为空`
          }
          if (
            !item.dialogConf.custDialogList ||
            item.dialogConf.custDialogList.length <= 0
          ) {
            isSave = false
            isSaveText = `列表查询【${item.fieldDesc}】` + `对话框配置异常`
          }
        }
      })
      info.data.fieldsList.forEach((item: any, index: any) => {
        if (!item.fieldDesc || item.fieldDesc.length <= 0) {
          isSave = false
          isSaveText = `请完善字段备注`
        }

        if (item.formatType && item.formatType === 'dic') {
          if (item.formatConf) {
            if (typeof item.formatConf == 'string') {
              item.formatDefault = JSON.parse(item.formatConf)
            }
          }
          if (!item.formatDefault.code || item.formatDefault.code.length <= 0) {
            isSave = false
            isSaveText = `字段配置【${item.fieldDesc}】` + `数据字典配置异常`
          }
        }

        if (item.formatType && item.formatType === 'region') {
          if (item.formatConf) {
            if (typeof item.formatConf == 'string') {
              item.formatConf = JSON.parse(item.formatConf)
            }
          }
        }
        if (item.formatType && item.formatType === 'dialog' || item.formatType && item.formatType === 'cascadeSelect') {
          if (item.formatConf) {
            if (typeof item.formatConf == 'string') {
              item.formatConf = JSON.parse(item.formatConf)
            }
          }
          if (
            !item.formatConf.valueField ||
            item.formatConf.valueField.length <= 0
          ) {
            isSave = false
            isSaveText = `请完善字段配置【${item.fieldDesc}】` + `值字段`
          }
          if (
            !item.formatConf.labelField ||
            item.formatConf.labelField.length <= 0
          ) {
            isSave = false
            isSaveText = `请完善字段配置【${item.fieldDesc}】` + `展示字段`
          }
        }
      })
    } catch (e) {}

    for (let i = 0; i < info.data.fieldsList.length; i++) {
      for (let j = i + 1; j < info.data.fieldsList.length; j++) {
        if (
          info.data.fieldsList[i].fieldDesc == info.data.fieldsList[j].fieldDesc
        ) {
          isSave = false
          isSaveText = `字段备注不能相同【${info.data.fieldsList[i].fieldDesc}】`
        }
      }
    }
    // 查询条件相同的话
    if(info.data.sqlConditionVOS && info.data.sqlConditionVOS.length > 0){
      for (let i = 0; i < info.data.sqlConditionVOS.length; i++) {
        for (let j = i + 1; j < info.data.sqlConditionVOS.length; j++) {
          if (
            info.data.sqlConditionVOS[i].fieldDesc == info.data.sqlConditionVOS[j].fieldDesc
          ) {
            isSave = false
            isSaveText = `查询条件不能相同【${info.data.sqlConditionVOS[i].fieldDesc}】`
          }
        }
      }
    }

    if (!isSave) {
      ElMessage({
        message: isSaveText,
        type: 'error',
      })
      return false
    }
    setparams()
  }

  const saveAndView = () => {
    if(!props.isAppSquareApp){
      if (info.data.name.length <= 0 || info.data.code.length <= 0) {
        ElMessage({
          message: '表单填写不正确,请完善名称或编码',
          type: 'warning',
        })
        return false
      }
      if (info.data.typeCode.length <= 0) {
        ElMessage({
          message: '请选择分类',
          type: 'warning',
        })
        return false
      }
      if (info.data.pkName.length <= 0) {
        ElMessage({
          message: '请选择主键',
          type: 'warning',
        })
        return false
      }
    }

    if (info.data.gridType !== 'app') {
      if (info.data.sqlContent.length <= 0) {
        ElMessage({
          message: '表单填写不正确',
          type: 'warning',
        })
        return false
      }
    }

    // 拓展字段添加
    if (info.data.extendConf) {
      const extendConf = JSON.parse(info.data.extendConf)
      extendConf.operationWidth = info.data.operationWidth
      info.data.extendConf = JSON.stringify(extendConf)
    }
    // 拓展字段添加
    if (!info.data.extendConf) {
      info.data.extendConf = {}
      info.data.extendConf.operationWidth = info.data.operationWidth
      info.data.extendConf = JSON.stringify(info.data.extendConf)
    }

    setparams()
    info.saveviewloading = true
    postData(bizApi.custGrid.saveCustUrl, info.data).then(
      (result) => {
        info.saveviewloading = false
        proxy.$router.push({
          path: `/biz/formCustSql/formCustSqlPreView/${info.data.code}`,
        })
      },
      (error) => {
        info.saveviewloading = false
      }
    )
  }

  onMounted(() => {
    info.data.gridType = proxy.$route.query.gridType
    searchObjName()
  })

  // 使用provide时，可以直接提供函数
  provide('addAliases', addAliases);

  defineExpose({
    setForm,
    handlebeforesaveFn,
    info
  })
</script>
<style lang="scss">
  .btnBox1 {
    margin-top: 6px;
  }
  .tooltipp {
    margin: 0;
  }
  .singleton-tooltip {
    width: 600px !important;
    // border: 1px solid #e4e7ed !important;
  }
  .pl16 {
    padding-left: 16px;
  }
  .redColor {
    color: rgb(241, 97, 97);
  }
  .mb8 {
    margin-bottom: 8px;
  }
</style>
