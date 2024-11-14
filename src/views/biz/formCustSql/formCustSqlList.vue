<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query.typeCode$VIN"
          type-code="biz"
          @node-click="searchResetPage()"
        />
      </el-aside>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <el-row class="vab-query-form">
              <el-col class="top-panel">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  label-width="62px"
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item label="名称" prop="name$VLK">
                    <el-input
                      v-model="query.name$VLK"
                      placeholder="请输入名称"
                      @keyup.enter.native="search()"
                    />
                  </el-form-item>
                  <el-form-item label="编码" prop="code$VLK">
                    <el-input
                      v-model="query.code$VLK"
                      placeholder="请输入编码"
                      @keyup.enter.native="search()"
                    />
                  </el-form-item>
                  <el-form-item
                    v-show="collapse"
                    label="数据源"
                    prop="dsKey$VLK"
                    @keyup.enter.native="search()"
                  >
                    <!-- clearable 失效 使用下面 -->
                    <el-select
                      v-model="query.dsKey$VLK"
                      :placeholder="$abT('page.common.all','全部')"
                      clearable
                    >
                      <el-option
                        v-for="item in state.dataSourcesOptions"
                        :key="item.alias"
                        :label="`${item.name}(${item.alias})`"
                        :value="item.alias"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-show="collapse"
                    label="表名"
                    prop="tableName$VLK"
                  >
                    <el-input
                      v-model="query.tableName$VLK"
                      placeholder="请输入表名"
                      @keyup.enter.native="search()"
                    />
                  </el-form-item>
                  <el-form-item
                    v-show="collapse"
                    label="手机端"
                    prop="enableApp$NEQ"
                    @keyup.enter.native="search()"
                  >
                    <el-select
                      v-model="query.enableApp$NEQ"
                      clearable
                      :placeholder="$abT('page.common.all','全部')"
                    >
                      <el-option label="否" value="0" />
                      <el-option label="是" value="1" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      查询
                    </el-button>
                    <el-button :icon="RefreshRight" @click="reset()">
                      重置
                    </el-button>
                    <el-button link type="primary" @click="handleCollapse()">
                      <span v-if="!collapse" type="primary">展开</span>
                      <span v-else type="primary">合并</span>
                      <el-icon class="el-icon--right">
                        <arrow-down v-if="!collapse" />
                        <ArrowUp v-else/>
                      </el-icon>
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <!-- 新增不同 -->
              <el-col class="left-panel">
                <el-space wrap>
                  <el-dropdown
                    v-ab-btn-rights:formCustSql_addList
                    split-button
                    trigger="click"
                    type="primary"
                    @click="handleClick"
                  >
                    新增列表
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>
                          <router-link
                            v-if="state.addTypeOption.length > 0"
                            v-ab-btn-rights:formCustSql_addApp
                            style="width: 100%"
                            :to="
                              '/biz/formCustSql/formCustSqlEdit?gridType=' +
                              state.addTypeOption[0].type
                            "
                          >
                            新增 流程应用
                          </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <router-link
                            v-if="state.addTypeOption.length > 0"
                            v-ab-btn-rights:formCustSql_addbpmReport
                            style="width: 100%"
                            :to="
                              '/biz/formCustSql/formCustSqlEdit?gridType=' +
                              state.addTypeOption[3].type
                            "
                          >
                            新增 流程报表
                          </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <router-link
                            v-if="state.addTypeOption.length > 0"
                            v-ab-btn-rights:formCustSql_addReport
                            style="width: 100%"
                            :to="
                              '/biz/formCustSql/formCustSqlEdit?gridType=' +
                              state.addTypeOption[2].type
                            "
                          >
                            新增 数据报表
                          </router-link>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                  <!-- 导入 -->
                  <span v-ab-btn-rights:formCustSql_import>
                    <ab-upload-dialog
                      accept=".grid"
                      :data="state.uploadData"
                      :search="search"
                    />
                  </span>
                  <!-- 导出json格式列表 -->
                  <el-button
                    v-ab-btn-rights:formCustSql_export
                    :disabled="!selectedData || selectedData.length == 0"
                    type="primary"
                    @click="exportFn()"
                  >
                    导出
                  </el-button>
                  <el-button
                    v-ab-btn-rights:formCustSql_addMenu
                    :disabled="!selectedData || selectedData.length == 0"
                    :loading="state.loadingMenu"
                    @click="chooseresDialog"
                  >
                    添加到菜单
                  </el-button>
                  <el-button
                    v-ab-btn-rights:formCustSql_addMenu
                    :disabled="!selectedData || selectedData.length == 0"
                    :loading="state.loadingUpdateMenuAuth"
                    @click="updateMenuAuth"
                  >
                    更新菜单权限
                  </el-button>
                  <el-button
                    v-ab-btn-rights:formCustSql_del
                    :disabled="!selectedData || selectedData.length == 0"
                    type="danger"
                    @click="allDel()"
                  >
                    批量删除
                  </el-button>
                </el-space>
              </el-col>
            </el-row>
          </div>
          <ab-table
            ref="abTable"
            v-model="selectedData"
            :checkable="true"
            :height="tableHeight"
            is-have-tree
            :query-param="query"
            row-key="id"
            :url="bizApi.custGrid.bizCustGridListUrl"
          >
            <ab-column label="名称" min-width="160" prop="name" />
            <ab-column label="编码" min-width="120" prop="code" />
            <ab-column label="数据源" prop="dsName" width="160" />
            <ab-column
              ab-text-formatter="app-应用-success-dark|list-列表-warning-dark|report-报表-default-dark|bpmReport-流程报表-default-dark"
              align="center"
              label="类型"
              prop="gridType"
              width="120"
            />

            <ab-column
              ab-text-formatter="0-禁用-warning-dark|1-启用-success-dark"
              align="center"
              label="状态"
              prop="status"
              width="100"
            />

            <ab-column
              ab-text-formatter="0-否-warning-dark|1-是-success-dark"
              align="center"
              label="是否支持手机"
              prop="enableApp"
              width="120"
            />
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="更新时间"
              prop="updateTime"
              width="140"
            />
            <ab-column label="更新人" prop="operator" width="120" />
            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="220"
            />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:formCustSql_edit
                :to="{
                  name: 'FormCustSqlEdit',
                  query: { gridType: scope.row.gridType, code: scope.row.code },
                }"
              >
                <el-button text type="primary">设计</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:formCustSql_preview
                text
                type="primary"
                @click="previewFn(scope.row)"
              >
                预览
              </el-button>
              <el-popover
                placement="bottom"
                :popper-style="{
                  minWidth: '120px',
                  padding: '0',
                  textAlign: 'center',
                }"
                trigger="click"
                :width="120"
              >
                <div v-ab-btn-rights:formCustSql_addMenu>
                  <el-button
                    class="m-2"
                    text
                    type="primary"
                    @click="addMenuFn(scope.row)"
                  >
                    加入菜单
                  </el-button>
                  <el-button
                    class="m-2"
                    style="margin-left:0;"
                    text
                    type="primary"
                    @click="updateMenuAuthTable(scope.row)"
                  >
                    更新菜单权限
                  </el-button>
                </div>
                <div v-ab-btn-rights:formCustSql_copy>
                  <el-button
                    class="m-2"
                    text
                    type="primary"
                    @click="copyFn(scope.row)"
                  >
                    复制
                  </el-button>
                </div>
                <div
                  v-if="scope.row.status === 1"
                  v-ab-btn-rights:formCustSql_disabled
                >
                  <el-button
                    class="m-2"
                    text
                    type="primary"
                    @click="jinyong(scope.row)"
                  >
                    禁用
                  </el-button>
                </div>
                <div
                  v-if="scope.row.status === 0"
                  v-ab-btn-rights:formCustSql_publish
                >
                  <el-button
                    class="m-2"
                    text
                    type="primary"
                    @click="qiyong(scope.row)"
                  >
                    启用
                  </el-button>
                </div>
                <div v-if="!scope.row.system" v-ab-btn-rights:formCustSql_del>
                  <el-button
                    class="m-2"
                    text
                    type="primary"
                    @click="delBizForm(scope.row)"
                  >
                    删除
                  </el-button>
                </div>
                <template #reference>
                  <el-button class="m-2" text type="primary">更多...</el-button>
                </template>
              </el-popover>
            </template>
          </ab-table>
          <el-dialog
            v-if="state.dialogVisible"
            v-model="state.dialogVisible"
            width="400px"
          >
            <div v-if="state.dialogVisible">
              <add-menu ref="addMenuRef" @is-app="isApp" @set-row="setRow" />
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button
                  text
                  type="primary"
                  @click="state.dialogVisible = false"
                >
                  取消
                </el-button>
                <el-button type="primary" @click="addMenuOk">确定</el-button>
              </span>
            </template>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import {
    abTableMix,
    abDsSelector,
    abUploadDialog,
    registerApi,
    postData,
    bizApi,
    orgApi,
    abTools,
    getData,
    authApi,
    sysApi,
    abDictTree,
  } from '~/agilebpm'
  export default {
    name: 'FormCustSqlList',
    mixins: [abTableMix],
  }
</script>
<script setup>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { reactive, defineComponent, onMounted, nextTick } from 'vue'
  import {
    Search,
    RefreshRight,
    Close,
    Check,
    Plus,
    ArrowDown,
  } from '@element-plus/icons-vue'

  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useRoutesStore } from '@/store/modules/routes'
  import { useAclStore } from '@/store/modules/acl'
  import AddMenu from './components/addMenu.vue'

  const vueInst = getCurrentInstance()
  const addMenuRef = ref()

  // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
  const query = reactive({
    dsKey$VLK: '',
    typeCode$VIN: '',
  })
  const state = reactive({
    uploadData: {
      btnText: '导入',
      tip: '请选择.grid文件',
      url: bizApi.custGrid.importbizCustGridUrl,
    },
    previewDialogVisible: false,
    tableData: [],
    previewDialogTitle: '',
    dialog: {},
    querydia: {
      pageSize: 10,
      currentPage: 1,
      queryParam: {},
    },
    dataString: '',
    addTypeOption: [],
    dialogVisible: false,
    listRow: {},
    treeRow: {},
    type: 0,
    dataSourcesOptions: [],
    loadingMenu: false,
    loadingUpdateMenuAuth:false,
    isAppObj: {},
    extendConf: {},
    selectedData: [],
    isDone:false,
    updateMenuArr:[]
  })
  // 新增类型
  sysApi.tools
    .getEnum('com.dstz.biz.chart.enums.CustGridTypeEnum', true)
    .then(({ data }) => {
      state.addTypeOption = data
    })
  //获取数据库列表
  postData(sysApi.dataSource.dataSourceList, {
    limit: 100,
    offset: 0,
  }).then((resp) => {
    state.dataSourcesOptions = resp.data.rows
  })
  const watchFn = (data) => {
    state.StringdialogVisible = true
    state.dataString = JSON.stringify(data)
  }
  const previewDialog = (row) => {
    state.previewDialogVisible = true
    state.dialog = row
  }
  const handleClick = () => {
    vueInst.proxy.$router.push({
      name: 'FormCustSqlEdit',
      query: { gridType: state.addTypeOption[1].type },
    })
  }
  // 导出
  const exportFn = () => {
    bizApi.custGrid.exportbizCustGridUrl(
      vueInst?.data.selectedData.map((row) => row.code).join(',')
    )
  }
  // 复制
  const copyFn = (row) => {
    vueInst.proxy.$router.push({
      name: 'FormCustSqlEdit',
      query: {
        gridType: row.gridType,
        copy: '1',
        code: row.code,
      },
    })
  }
  // 加入菜单
  const chooseresDialog = () => {
    state.dialogVisible = true
    state.type = 2
    if (addMenuRef.value) {
      addMenuRef.value.getapplicationListJson()
    }
  }
  // 更新菜单权限
  const updateMenuAuth = () => {
    ElMessageBox.confirm('您确定要更新菜单权限吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        if (vueInst?.data.selectedData.length > 0) {
          state.selectedData = JSON.parse(
            JSON.stringify(vueInst?.data.selectedData)
          )
          state.loadingUpdateMenuAuth = true
          allVoView(state.selectedData, {}, 'upDateMenuAuth')
        }
      })
      .catch(() => {

      })
  }
  const previewFn = (row) => {
    if (row.status === 0) {
      ElMessageBox.alert('禁用的列表不可预览', '提示信息', {
        confirmButtonText: 'OK',
        type: 'error',
        callback: () => {},
      })
      return
    }
    vueInst.proxy.$router.push({
      path: `/biz/formCustSql/formCustSqlPreView/${row.code}`,
    })
  }
  // 加入菜单
  const addMenuList = (list, item) => {
    voView(item, list)
  }
  const isApp = (obj) => {
    state.isAppObj = obj
  }
  const getFieldsResources = (item,data) => {
    let resources = []
    let url = item.hrefConfMap.url
    let isHave = false
    if (url && url.length > 0) {
      if(url.indexOf(`/biz/bizForm/formViewAdd/`) > -1){
        isHave = true
        let lastSlashIndex = url.lastIndexOf("/");
        let questionMarkIndex = url.indexOf("?");
        let result = url.substring(lastSlashIndex + 1, questionMarkIndex);
        resources = [
          {
            url: `/ab-bpm/biz/bizForm/save/${result}_pc`,
            name: '保存接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/save/${result}_mobile`,
            name: '保存接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_pc`,
            name: '详情接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_mobile`,
            name: '详情接口',
          },
        ]
      }

      if (url.indexOf(`/biz/bizForm/formViewEdit/`) > -1) {
        isHave = true
        let lastSlashIndex = url.lastIndexOf("/");
        let questionMarkIndex = url.indexOf("?");
        let result = url.substring(lastSlashIndex + 1, questionMarkIndex);
        resources = [
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_pc`,
            name: '详情接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/save/${result}_pc`,
            name: '保存接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_mobile`,
            name: '详情接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/save/${result}_mobile`,
            name: '保存接口',
          },
        ]
      }

      if(url.indexOf(`/biz/bizForm/formViewDetail/`) > -1){
        isHave = true
        let lastSlashIndex = url.lastIndexOf("/");
        let questionMarkIndex = url.indexOf("?");
        let result = url.substring(lastSlashIndex + 1, questionMarkIndex);
        resources = [
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_pc`,
            name: '详情接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_mobile`,
            name: '详情接口',
          },
        ]
      }

      if (item.hrefConfMap.openType !== "drawer" && url.indexOf('bizFormCombinationView') > -1) {
        isHave = true
        resources = [
          {
            url:url.indexOf('?') > -1 ? url.split('?')[0] : url,
            name:'组联式表单Url'
          }
        ]
      }

      if(item.hrefConfMap.openType == "drawer" && item.hrefConfMap.component == 'url'){
        isHave = true
        resources = [{
          url:url.indexOf('?') > -1 ? url.split('?')[0] : url,
          name:'url地址'
        }]
      }
      if (!isHave) {
        resources = [{
          url:url.indexOf('?') > -1 ? url.split('?')[0] : url,
          name:'url地址'
        }]
      }
    }
    if(item.hrefConfMap.openType == "drawer" && item.hrefConfMap.component == 'FormViewCombination' && item.hrefConfMap.combinationCode && item.hrefConfMap.combinationCode.length > 0){
        resources = [
          {
            url: `/biz/bizFormCombinationView/${item.hrefConfMap.combinationCode}`,
            name: '组联式表单',
          },
        ]
    }

    if(item.hrefConfMap.openType == "drawer" && item.hrefConfMap.component !== 'FormViewCombination' && item.hrefConfMap.component !== 'url'){
      resources = [
        {
          url: item.hrefConfMap.FormSeletorCode ? '/ab-bpm/biz/bizForm/get/' + item.hrefConfMap.FormSeletorCode : '/ab-bpm/biz/bizForm/get/' ,
          name: '详情接口',
        },
      ]
    }

    return resources
  }
  const getBtnResources = (item,data) => {
    let resources = []
    let isHave = false
    if (item.url && item.url.length > 0) {
      if(item.url.indexOf(`/biz/bizForm/formViewAdd/`) > -1){
        isHave = true
        let lastSlashIndex = item.url.lastIndexOf("/");
        let questionMarkIndex = item.url.indexOf("?");
        let result = item.url.substring(lastSlashIndex + 1, questionMarkIndex);
        resources = [
          {
            url: `/ab-bpm/biz/bizForm/save/${result}_pc`,
            name: '保存接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/save/${result}_mobile`,
            name: '保存接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_pc`,
            name: '详情接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_mobile`,
            name: '详情接口',
          },
        ]
      }
      if (item.url.indexOf(`/biz/bizForm/formViewEdit/`) > -1) {
        isHave = true
        let lastSlashIndex = item.url.lastIndexOf("/");
        let questionMarkIndex = item.url.indexOf("?");
        let result = item.url.substring(lastSlashIndex + 1, questionMarkIndex);
        resources = [
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_pc`,
            name: '详情接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/save/${result}_pc`,
            name: '保存接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_mobile`,
            name: '详情接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/save/${result}_mobile`,
            name: '保存接口',
          },
        ]
      }
      if(item.url.indexOf(`/biz/bizForm/formViewDetail/`) > -1){
        isHave = true
        let lastSlashIndex = item.url.lastIndexOf("/");
        let questionMarkIndex = item.url.indexOf("?");
        let result = item.url.substring(lastSlashIndex + 1, questionMarkIndex);
        resources = [
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_pc`,
            name: '详情接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_mobile`,
            name: '详情接口',
          },
        ]
      }
      if (item.url.indexOf(`/ab-bpm/biz/bizObject/remove/${data.appConfMap.boCode}`) > -1) {
        isHave = true
        resources = [
          {
            url: `/ab-bpm/biz/bizObject/remove/${data.appConfMap.boCode}`,
            name: '删除接口',
          },
        ]
      }
      if(item.url.indexOf(`/ab-bpm/biz/bizObject/remove/`) > -1 && item.url.indexOf(`/ab-bpm/biz/bizObject/remove/${data.appConfMap.boCode}`) == -1){
        isHave = true
        resources = [
          {
            url: item.url.indexOf('?') > -1 ? item.url.split('?')[0] : item.url,
            name: '删除接口',
          },
        ]
      }
      if (item.hrefSetting.openType !== 'drawer' && item.url.indexOf('bizFormCombinationView') > -1) {
        isHave = true
        resources = [
          {
            url:item.url.indexOf('?') > -1 ? item.url.split('?')[0] : item.url,
            name:'组联式表单Url'
          }
        ]
      }
      if(item.url.indexOf(`/bpm/bpm/instanceDetail`) > -1 || item.url.indexOf(`/bpm/bpm/bpmInstanceListDetail/`) > -1){
        isHave = true
        resources = [
          {
            url: '/ab-bpm/bpm/instance/getInstDataByKey/' + data.relatedId,
            name: '实例详情',
          },
        ]
      }
      if (!isHave) {
        resources = [{
          url:item.url.indexOf('?') > -1 ? item.url.split('?')[0] : item.url,
          name:'url地址'
        }]
      }
    }

    if(item.hrefSetting.openType == 'drawer' &&  item.hrefSetting.component == 'FormViewCombination' && item.hrefSetting.combinationCode && item.hrefSetting.combinationCode.length > 0){
        resources = [
          {
            url: `/biz/bizFormCombinationView/${item.hrefSetting.combinationCode}`,
            name: '组联式表单',
          },
        ]
    }

    if(item.hrefSetting.openType && item.hrefSetting.openType == 'eventBtn'){
      resources = [
        {
          url: `/biz/bizCustGrid/view/changeData/${data.code}`,
          name: '事件',
        },
      ]
    }
    return resources
  }
  const voView = (dataRow, list, type) => {
    postData(bizApi.custGrid.voUrl + dataRow.code, {}).then(
      ({ data }) => {
        const form = {
          name: data.name,
          code: state.isAppObj.appType ? `${data.code}_app` : `${data.code}`,
          url: `/biz/formCustSql/formCustSqlView/${data.code}`,
          type: 'menu',
          enable: 1,
          opened: 1,
          icon:
            state.isAppObj.appType &&
            state.listRow.appConf.length > 0 &&
            JSON.parse(state.listRow.appConf).icon
              ? JSON.parse(state.listRow.appConf).icon
              : '',
          appId: list.appId || '',
          parentId: list.id || '',
          children: [],
          resources: [
            {
              name: '列表查询接口',
              url: `/ab-bpm/biz/bizCustGrid/view/list_${data.code}`,
            },
            {
              name: '获取配置',
              url: `/ab-bpm/biz/bizCustGrid/view/vo_${data.code}`,
            },
          ],
        }
        if(type == 'addMenu'){
          authApi.saveResource(form).then(
            (result) => {
              const children = []
              if (data.sqlButtonVO && data.sqlButtonVO.length > 0) {
                data.sqlButtonVO.forEach((item, index) => {
                  let resources = []
                  resources = getBtnResources(item,data)
                  children.push({
                    name: item.name,
                    code: state.isAppObj.appType
                      ? `${item.alias}_app`
                      : `${item.alias}`,
                    url: item.url.indexOf('remove') > -1 ? '' : item.url,
                    type: 'button',
                    appId: list.appId || '',
                    enable: 1,
                    opened: 0,
                    icon: '',
                    parentId: result.data,
                    parentName: dataRow.name,
                    resources: resources,
                  })
                })
              }
              if (data.fieldsList && data.fieldsList.length > 0) {
                data.fieldsList.forEach((item, index) => {
                  let resources = []
                  resources = getFieldsResources(item,data)
                  if(resources.length > 0){
                    item.fieldName = item.fieldName + '_' + data.code
                    children.push({
                      name: item.fieldDesc,
                      code: state.isAppObj.appType
                        ? `${item.fieldName}_app`
                        : `${item.fieldName}`,
                      url:'',
                      type: 'button',
                      appId: list.appId || '',
                      enable: 1,
                      opened: 0,
                      icon: '',
                      parentId: result.data,
                      parentName: dataRow.name,
                      resources: resources,
                    })
                  }
                })
              }
              form.id = result.data
              form.children = children
              saveFn(form, type)
            },
            () => {}
          )
        }else{
          const children = []
          if (data.sqlButtonVO && data.sqlButtonVO.length > 0) {
            data.sqlButtonVO.forEach((item, index) => {
              let resources = []
              resources = getBtnResources(item,data)
              children.push({
                name: item.name,
                code: state.isAppObj.appType
                  ? `${item.alias}_app`
                  : `${item.alias}`,
                url: item.url.indexOf('remove') > -1 ? '' : item.url,
                type: 'button',
                appId: list.appId || '',
                enable: 1,
                opened: 0,
                icon: '',
                parentName: dataRow.name,
                resources: resources,
              })
            })
          }
          if (data.fieldsList && data.fieldsList.length > 0) {
            data.fieldsList.forEach((item, index) => {
              let resources = []
              resources = getFieldsResources(item,data)
              if(resources.length > 0){
                item.fieldName = item.fieldName + '_' + data.code
                children.push({
                  name: item.fieldDesc,
                  code: state.isAppObj.appType
                    ? `${item.fieldName}_app`
                    : `${item.fieldName}`,
                  url:'',
                  type: 'button',
                  appId: list.appId || '',
                  enable: 1,
                  opened: 0,
                  icon: '',
                  parentName: dataRow.name,
                  resources: resources,
                })
              }
            })
          }
          form.children = children
          saveFn([form], type)
        }

      },
      () => {}
    )
  }

  const allVoView = (dataRowList, list, type) => {
    list.children = []
    let paramList = []
    dataRowList.forEach((itemd, index) => {
      paramList.push(itemd.code)
    })
    postData(
        bizApi.custGrid.custGetGetByCodesUrl + paramList,{}).then((result) => {
      if(result.data){
        let dataList = result.data
        dataList.forEach((itemData, index) => {
          const children = []
          let sqlButtonVO = []
          let appConfMap = {}
          if (itemData.appConf && itemData.appConf.length > 0) {
            appConfMap = JSON.parse(itemData.appConf)
          }
          if (itemData.buttons && itemData.buttons.length > 0) {
            sqlButtonVO = JSON.parse(itemData.buttons)
          }
          if (sqlButtonVO && sqlButtonVO.length > 0) {
            sqlButtonVO.forEach((item, index) => {
              let resources = []
              resources = getBtnResources(item,itemData)
              children.push({
                name: item.name,
                code: state.isAppObj.appType
                  ? `${item.alias}_app`
                  : `${item.alias}`,
                url: item.url.indexOf('remove') > -1 ? '' : item.url,
                type: 'button',
                appId: list.appId || '',
                enable: 1,
                opened: 0,
                icon: '',
                resources: resources,
              })
            })
          }
          if (itemData.fieldsList && itemData.fieldsList.length > 0) {
            itemData.fieldsList.forEach((item, index) => {
              let resources = []
              resources = getFieldsResources(item,itemData)
              if(resources.length > 0){
                item.fieldName = item.fieldName + '_' + itemData.code
                children.push({
                  name: item.fieldDesc,
                  code: state.isAppObj.appType
                    ? `${item.fieldName}_app`
                    : `${item.fieldName}`,
                  url: '',
                  type: 'button',
                  appId: list.appId || '',
                  enable: 1,
                  opened: 0,
                  icon: '',
                  resources: resources,
                })
              }
            })
          }

          list.children.push({
            name: itemData.name,
            code: state.isAppObj.appType ? `${itemData.code}_app` : `${itemData.code}`,
            url: `/biz/formCustSql/formCustSqlView/${itemData.code}`,
            type: 'menu',
            enable: 1,
            opened: 1,
            icon:
              state.isAppObj.appType && itemData.appConf.length > 0 && JSON.parse(itemData.appConf).icon
                ? JSON.parse(itemData.appConf).icon
                : '',
            appId: list.appId || '',
            parentId: list.id || '',
            children: children,
            resources: [
              {
                name: '列表查询接口',
                url: `/ab-bpm/biz/bizCustGrid/view/list_${itemData.code}`,
              },
              {
                name: '获取配置',
                url: `/ab-bpm/biz/bizCustGrid/view/vo_${itemData.code}`,
              },
            ],
          })
        })
        if(type == "addMenu"){
          saveFn(list,type)
        }else{
          state.updateMenuArr.push(list.children)
          if(!state.isDone){
            state.isAppObj.appType = !state.isAppObj.appType
            allVoView(state.selectedData, {}, 'upDateMenuAuth')
            state.isDone = true
          }
          let arr = []
          if(state.updateMenuArr.length >= 2){
            state.updateMenuArr.forEach((itP) => {
              itP.forEach((itC) => {
                arr.push(itC)
              })
            })
            saveFn(arr,type)
          }
        }
      }
    })
  }

  const saveFn = (form,type) => {
    if(type == 'addMenu'){
      state.loadingMenu = true
      postData(orgApi.resourse.saveTreeUrl, form).then(
        (res) => {
          ElMessage({
            message: '加入成功',
            type: 'success',
          })
          proxy.clearSelectedData()
          proxy.search()
          state.isAppObj = {}
          state.loadingMenu = false
          const routers = useRoutesStore()
          const aclStore = useAclStore()
          registerApi.getUserInfo().then((dataInfo) => {
            if (dataInfo.data.userMenuList) {
              routers.setMenus(dataInfo.data.userMenuList)
            }
            if (dataInfo.data.buttonPermission) {
              aclStore.setButtonPermission(dataInfo.data.buttonPermission)
            }
          })
        },
        () => {
          state.loadingMenu = false
        }
      )
    }

    if(type == 'upDateMenuAuth'){
      postData(orgApi.resourse.updateTreeUrl, form).then(
        (res) => {
          state.isAppObj.appType = !state.isAppObj.appType
          state.isDone = false
          state.updateMenuArr = []
          ElMessage({
            message: '更新成功',
            type: 'success',
          })
          proxy.clearSelectedData()
          proxy.search()
          state.loadingUpdateMenuAuth = false
          const routers = useRoutesStore()
          const aclStore = useAclStore()
          registerApi.getUserInfo().then((dataInfo) => {
            if (dataInfo.data.userMenuList) {
              routers.setMenus(dataInfo.data.userMenuList)
            }
            if (dataInfo.data.buttonPermission) {
              aclStore.setButtonPermission(dataInfo.data.buttonPermission)
            }
          })
        },
        () => {
          state.loadingUpdateMenuAuth = false
          state.isAppObj.appType = !state.isAppObj.appType
          state.isDone = false
          state.updateMenuArr = []
        }
      )
    }
  }

  const addMenuFn = (row) => {
    if (row) {
      state.listRow = row
      state.dialogVisible = true
      state.type = 1
      if (addMenuRef.value) {
        addMenuRef.value.getapplicationListJson()
      }
    }
  }

  const updateMenuAuthTable = (row) => {
    if (row) {
      voView(row,{},'upDateMenuAuth')
    }
  }

  const setRow = (row) => {
    if (row) {
      state.treeRow = row
    }
  }
  const addMenuOk = () => {
    if (state.treeRow && JSON.stringify(state.treeRow) !== '{}') {
      if (state.type === 1) {
        voView(state.listRow, state.treeRow,'addMenu')
      }
      if (state.type === 2) {
        if (vueInst?.data.selectedData.length > 0) {
          state.selectedData = JSON.parse(
            JSON.stringify(vueInst?.data.selectedData)
          )
          allVoView(state.selectedData, state.treeRow,'addMenu')
        }
      }
      state.dialogVisible = false
    } else {
      ElMessage({
        message: '请选择',
        type: 'error',
      })
    }
  }
  const { proxy } = getCurrentInstance()
  const delBizForm = (row) => {
    ElMessageBox.confirm(`确定删除吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        getData(bizApi.custGrid.bizCustGridRemoveUrl + row.id).then(
          (result) => {
            ElMessage({
              type: 'success',
              message: result.msg || '操作成功',
              onClose: () => {},
            })
            const routers = useRoutesStore()
            registerApi.getUserInfo().then((dataIfnfo) => {
              if (dataIfnfo.data.userMenuList) {
                routers.setMenus(dataIfnfo.data.userMenuList)
              }
            })
            proxy.search()
          }
        )
      })
      .catch(() => {})
  }

  const allDel = () => {
    if (vueInst?.data.selectedData.length > 0) {
      ElMessageBox.confirm(
        `确定批量删除${vueInst?.data.selectedData.length}条数据吗?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          getData(
            bizApi.custGrid.bizCustGridRemoveUrl +
              vueInst?.data.selectedData.map((row) => row.id).join(',')
          ).then((result) => {
            ElMessage({
              type: 'success',
              message: result.msg || '操作成功',
              onClose: () => {},
            })
            const routers = useRoutesStore()
            registerApi.getUserInfo().then((dataIfnfo) => {
              if (dataIfnfo.data.userMenuList) {
                routers.setMenus(dataIfnfo.data.userMenuList)
              }
            })
            proxy.clearSelectedData()
            proxy.search()
          })
        })
        .catch(() => {})
    }
  }

  const qiyong = (row) => {
    ElMessageBox.confirm(`确定启用吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        getData(bizApi.custGrid.publishUrl + row.id).then((result) => {
          ElMessage({
            type: 'success',
            message: result.msg || '操作成功',
            onClose: () => {},
          })
          const routers = useRoutesStore()
          registerApi.getUserInfo().then((dataIfnfo) => {
            if (dataIfnfo.data.userMenuList) {
              routers.setMenus(dataIfnfo.data.userMenuList)
            }
          })
          proxy.search()
        })
      })
      .catch(() => {})
  }

  const jinyong = (row) => {
    ElMessageBox.confirm(`确定禁用吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        getData(bizApi.custGrid.disabledUrl + row.id).then((result) => {
          ElMessage({
            type: 'success',
            message: result.msg || '操作成功',
            onClose: () => {},
          })
          const routers = useRoutesStore()
          registerApi.getUserInfo().then((dataIfnfo) => {
            if (dataIfnfo.data.userMenuList) {
              routers.setMenus(dataIfnfo.data.userMenuList)
            }
          })
          proxy.search()
        })
      })
      .catch(() => {})
  }
</script>
<style lang="scss">
  .abTable {
    .el-radio {
      .el-radio__label {
        display: none;
      }
    }
  }
</style>
