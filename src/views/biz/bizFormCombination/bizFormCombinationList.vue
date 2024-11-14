<template>
  <div>
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
          <!--查询区域-->
          <div ref="titleForm">
            <el-row>
              <el-col class="top-panel" :span="24">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  label-width="62px"
                  :model="query"
                >
                  <el-form-item label="名称" prop="name$VLK">
                    <el-input
                      v-model="query.name$VLK"
                      placeholder="请输入名称"
                    />
                  </el-form-item>
                  <el-form-item label="编码" prop="code$VLK">
                    <el-input
                      v-model="query.code$VLK"
                      placeholder="请输入编码"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      查询
                    </el-button>
                    <el-button :icon="Refresh" @click="reset()">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>

            <!--按钮区域-->
            <el-button
              v-ab-btn-rights:bizFormCombination_add
              :icon="Plus"
              type="primary"
              @click="showDesign()"
            >
              添加
            </el-button>

            <span
              v-ab-btn-rights:bizFormCombination_import
              style="margin-left: 7px"
            >
              <ab-upload-dialog
                accept=".chart"
                :after-save="importSave"
                :data="uploadData"
                :search="search"
                :timeout="2 * 60 * 1000"
              />
            </span>

            <el-button
              v-ab-btn-rights:bizFormCombination_export
              :disabled="!selectedData || selectedData.length == 0"
              style="margin-left: 7px"
              type="primary"
              @click="exportFn()"
            >
              导出
            </el-button>

            <el-button
              v-ab-btn-rights:bizFormCombination_resource
              :disabled="!selectedData || selectedData.length == 0"
              :icon="Plus"
              style="margin-left: 7px"
              type="primary"
              @click="addBulkMenuFn"
            >
              批量加菜单
            </el-button>

            <el-button
              v-ab-btn-rights:bizFormCombination_del
              :disabled="!selectedData || selectedData.length == 0"
              :icon="Delete"
              style="margin-left: 7px"
              type="danger"
              @click="removeResource(selectedData)"
            >
              批量删除
            </el-button>
          </div>
          <!--列表区域-->
          <ab-table
            ref="abTable"
            v-model="selectedData"
            :checkable="true"
            :height="tableHeight"
            highlight-current-row
            is-have-tree
            :query-param="query"
            row-key="id"
            :url="bizApi.formCombination.BizFormListJson"
          >
            <ab-column label="名称" prop="name" />
            <ab-column label="编码" prop="code" />
            <ab-column label="描述" prop="desc" />
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="更新时间"
              min-width="160"
              prop="updateTime"
            />
            <ab-column label="更新人" min-width="120" prop="operator" />
            <ab-column ab-template="edit" label="操作" width="330" />
            <template #edit="{ scope }">
              <el-button
                v-ab-btn-rights:bizFormCombination_edit
                text
                type="primary"
                @click="showDesign(scope.row.id)"
              >
                设计
              </el-button>
              <router-link
                v-ab-btn-rights:bizFormCombination_preview
                :to="{ path: '/biz/bizFormCombinationView/' + scope.row.code }"
              >
                <el-button text type="primary">预览</el-button>
              </router-link>

              <el-button
                v-ab-btn-rights:bizFormCombination_resource
                style="margin-left: 0px"
                text
                type="primary"
                @click="addMenuFn(scope.row)"
              >
                加入菜单
              </el-button>
              <el-button
                v-ab-btn-rights:bizFormCombination_del
                style="margin-left: 0px"
                text
                type="primary"
                @click="removeResource([scope.row])"
              >
                删除
              </el-button>
            </template>
          </ab-table>
          <ab-layout-designer
            v-if="designInfo.show"
            :id="designInfo.defId"
            v-model="designInfo.show"
            @close="closeDefinition()"
          />
        </el-main>
      </el-container>
    </div>
    <div>
      <el-dialog
        v-model="state.dialogVisible"
        class="mystyle"
        :show-close="false"
        width="400px"
      >
        <el-select
          v-model="state.selectvalue"
          class="selectstyle"
          placeholder="请选择"
          @change="changeSelect"
        >
          <el-option
            v-for="item in state.selectoption"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        <div
          class="treeBoxHeight"
          style="height: 500px; padding: 8px 6px; border: 1px solid #dcdfe6"
        >
          <el-tree
            :current-node-key="state.nodekey"
            :data="state.data"
            :default-expanded-keys="state.defaultExpanded"
            empty-text="加载中。。。"
            :expand-on-click-node="false"
            :highlight-current="true"
            node-key="code"
            @node-click="handleNodeClick"
          >
            <template #default="{ data }">
              <div
                class="custom-tree-node"
                @mouseenter="data.isshow = true"
                @mouseleave="data.isshow = false"
              >
                <p>
                  <vab-icon :icon="data.icon" />
                  {{ data.name }}
                </p>
                <span v-if="state.codeList.includes(data.code)">
                  <Delete class="iconStyle" @click.stop="deleteNode(data)" />
                </span>
              </div>
            </template>
          </el-tree>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button text type="primary" @click="state.dialogVisible = false">
              取消
            </el-button>
            <el-button type="primary" @click="submit">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
  import { abTableMix } from '~/agilebpm'
  import { abDictTree, abUploadDialog } from '~/agilebpm'
  import { abLayoutDesigner } from '~/agilebpm/build/combinationApp'

  export default {
    name: 'BizFormCombinationList',
    components: { abLayoutDesigner, abDictTree, abUploadDialog },
    mixins: [abTableMix],
  }
</script>

<script lang="ts" setup>
  import { reactive, getCurrentInstance } from 'vue'
  import { abUtil, postData } from '~/agilebpm'
  import { bizApi, orgApi, sysApi, authApi, registerApi } from '~/agilebpm'
  import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'
  import { useRoutesStore } from '@/store/modules/routes'
  import { useAclStore } from '@/store/modules/acl'
  import { ElMessage } from 'element-plus'

  import './icons/icon.js'
  import './icons/layout-left.js'

  const state = reactive({
    //加入菜单或批量加入的区分标识
    type: 0,
    //code集合，用来区分哪些标识可以删除的标识
    codeList: [] as string[],
    //加入菜单时所需的当前门户对象
    portalObj: {} as any,
    //弹出加入菜单树的对话框
    dialogVisible: false,

    selectoption: [] as any[],
    //当前选中的应用
    selectvalue: localStorage.getItem('application') as string,

    data: [],

    defaultExpanded: [] as string[],
    nodekey: '',

    //加入的父菜单对象
    treeRow: {} as any,
  })
  // @ts-ignore
  const { proxy } = getCurrentInstance()
  const vueInst = getCurrentInstance()
  const designInfo = reactive({
    show: false,
    defId: '',
  })

  const uploadData = {
    btnText: '导入',
    tip: '请选择.chart文件',
    url: bizApi.formCombination.importBizFormCombinationUrl,
  }
  const showDesign = (defId: string) => {
    if (defId) {
      designInfo.defId = defId
    }
    designInfo.show = true
  }

  const importSave = (result: any) => {
    if (!result.isOk) {
      ElMessage({
        message: '导入失败',
        type: 'error',
      })
      return
    }
    ElMessage({
      message: result.data,
      type: 'success',
      dangerouslyUseHTMLString: true,
    })
  }
  const closeDefinition = () => {
    designInfo.show = false
    designInfo.defId = ''
    proxy.search()
  }
  window.setTimeout(() => {
    abUtil.checkIsPublicProject()
  }, 1000)

  const exportFn = () => {
    const codes = proxy.selectedData.map((row: any) => row.code).join(',')
    bizApi.formCombination.exportBizFormCombination(codes, () => {
      proxy.selectedData.splice(0, proxy.selectedData.length)
      proxy.search()
    })
  }

  //刷新内存中的菜单
  const refreshStore = () => {
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
  }

  //加入菜单
  const addMenuFn = (row: any) => {
    refreshApplication()
    refreshTree()
    if (row) {
      state.portalObj = row
      state.type = 1
      state.codeList = []
      state.codeList.push(`bizFormCombinationView_${row.code}`)
      state.dialogVisible = true
    }
  }

  // 批量加入菜单
  const addBulkMenuFn = () => {
    refreshApplication()
    refreshTree()
    const arr: any = vueInst?.data.selectedData
    if (arr.length > 0) {
      state.codeList = []
      for (const item in arr) {
        state.codeList.push(`bizFormCombinationView_${arr[item].code}`)
      }
      state.type = 2
      state.dialogVisible = true
    }
  }

  //如果应用系统不存在，则请求应用系统分页获取
  const refreshApplication = () => {
    if (!state.selectoption || state.selectoption.length == 0) {
      postData(sysApi.authApplication.applicationListJson, {
        limit: 99,
      }).then((res) => (state.selectoption = res.data.rows))
    }
  }

  // 首次加载，或选择应用系统后获取刷新树信息
  const refreshTree = () => {
    orgApi.resourse.getTreeDataByCode(state.selectvalue).then((data) => {
      state.data = data.data
      refreshExpanded()
    })
  }

  // 点击单个tree属性菜单
  const handleNodeClick = (row: any) => {
    state.treeRow = row
  }

  // 刷新展开项目
  const refreshExpanded = () => {
    if (state.data) {
      const idArr: Array<string> = []
      expandTwoLevels(state.data, idArr)
      const array = idArr.concat(abUtil.expandTwoLevels(state.data, 'code'))
      state.defaultExpanded = array
    }
  }

  //从树中找到需要展开的项
  const expandTwoLevels = (treeData: any, idArr: Array<string>) => {
    treeData.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
        expandTwoLevels(item.children, idArr)
      }
      if (state.codeList.includes(item.code)) {
        idArr.push(item['code'])
      }
    })
  }

  // 选择流程平台 / 后台
  const changeSelect = (select: string) => {
    state.selectvalue = select
    refreshTree()
  }

  //删除相关的资源项
  const deleteNode = (row: any) => {
    ElMessageBox.confirm(`确定删除【${row.name}】菜单吗`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      authApi.removeResource({ id: row.id }).then(({ msg }) => {
        ElMessage({
          type: 'success',
          message: '已删除',
          onClose: () => {},
        })

        refreshTree()
        refreshStore()
        state.treeRow = null
        proxy.clearSelectedData()
      })
    })
  }

  //删除相关的资源项（单纯删除，无其他操作）
  const removeResource = (row: any) => {
    const confirmMsg =
      row.length == 1
        ? `确定删除${row[0].name}吗?`
        : `确定批量删除${row.length}条数据吗?`

    ElMessageBox.confirm(confirmMsg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      bizApi.formCombination
        .removeForm(row.map((s) => s.id).join(','))
        .then(() => {
          ElMessage({
            type: 'success',
            message: '删除组联式应用成功',
            onClose: () => {},
          })
          refreshTree()
          refreshStore()
          state.treeRow = null
          proxy.search()
          proxy.clearSelectedData()
        })
    })
  }

  //加入菜单弹窗选择确定提交时触发的方法
  const submit = () => {
    if (!state.treeRow || JSON.stringify(state.treeRow) === '{}') {
      ElMessage({
        message: '请选择菜单',
        type: 'error',
      })
    } else if (state.treeRow.id == '0') {
      ElMessage({ message: '加入菜单失败：禁止添加到根菜单', type: 'error' })
    } else {
      state.dialogVisible = false
      if (state.type === 1) {
        voView([state.portalObj], state.treeRow)
      }
      if (state.type === 2) {
        const arr: any = vueInst?.data.selectedData
        if (arr.length > 0) {
          voView(arr, state.treeRow)
        }
      }
    }
    refreshStore()
  }

  //加入菜单以及路由
  const voView = (datas: any[], list: any) => {
    debugger
    const dataList = datas.map((dataRow) => {
      return {
        name: dataRow.name,
        code: `bizFormCombinationView_${dataRow.code}`,
        url: `/biz/bizFormCombinationView/${dataRow.code}`,
        type: 'menu',
        enable: 1,
        opened: 1,
        icon: '',
        appId: list.appId,
        parentId: list.id,
        children: [],
      }
    })
    authApi.saveBatchResource(dataList).then(
      (result) => {
        ElMessage({
          message: '加入成功',
          type: 'success',
        })
        const routers = useRoutesStore()
        registerApi.getUserInfo().then((dataIfnfo) => {
          if (dataIfnfo.data.userMenuList) {
            routers.setMenus(dataIfnfo.data.userMenuList)
          }
        })
      },
      () => {}
    )
  }
  
</script>
<style scoped lang="scss">
  :deep(.mystyle .el-dialog__header) {
    display: none;
    padding-bottom: 0px;
    margin-right: 0px;
  }
  :deep(.el-dialog__body) {
    padding: 20px;
    padding-top: 30px;
    padding-bottom: 5px;
  }

  $base: '.menu-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
  .selectstyle {
    width: 100%;
    margin: 0px 0;
    margin-bottom: 10px;
    margin-bottom: 20px;
  }
  .custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    font-size: 14px;
  }
  .treeBoxHeight {
    overflow: auto;
  }

  .iconStyle {
    width: 1em;
    height: 1em;
    margin-right: 5px;
    color: #ff4d4f;
  }
</style>
