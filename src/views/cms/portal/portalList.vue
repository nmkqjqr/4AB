<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            label-width="62px"
            :model="query"
            style="float: left"
            @submit.prevent
          >
            <el-form-item
              :label="$abT('page.common.name', '名称')"
              prop="name$VLK"
            >
              <el-input v-model="query.name$VLK" />
            </el-form-item>
            <el-form-item
              :label="$abT('page.common.code', '编码')"
              prop="code$VLK"
            >
              <el-input v-model="query.code$VLK" />
            </el-form-item>
            <el-form-item
              :label="$abT('page.common.status', '状态')"
              prop="status$NEQ"
            >
              <el-select v-model="query.status$NEQ" clearable :placeholder="$abT('page.common.all','全部')">
                <el-option
                  :label="$abT('page.common.enable', '启用')"
                  value="1"
                />
                <el-option
                  :label="$abT('page.common.disable', '禁用')"
                  value="0"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="search()">
                {{ $abT('page.common.search', '查询') }}
              </el-button>
              <el-button
                :icon="RefreshRight"
                @click="reset(), () => (query.status$NEQ = '')"
              >
                {{ $abT('page.common.reset', '重置') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="left-panel">
          <el-space wrap>
            <router-link
              v-ab-btn-rights:portal_add
              :to="{
                name: 'PortalEdit',
              }"
            >
              <el-button :icon="Plus" type="primary">
                {{ $abT('page.common.add', '添加') }}
              </el-button>
            </router-link>
            <el-button
              v-ab-btn-rights:portal_addResource
              :disabled="!selectedData || selectedData.length == 0"
              :icon="Plus"
              type="primary"
              @click="addBulkMenuFn"
            >
              {{ $abT('page.common.batchAdd', '批量添加菜单') }}
            </el-button>
            <el-button
              v-ab-btn-rights:portal_roleDefaule
              :icon="User"
              type="primary"
              @click="openRoldDialog()"
            >
              {{ $abT('page.portal.roleBindingHome', '角色绑定默认首页') }}
            </el-button>

            <el-button
              v-ab-btn-rights:portal_del
              :disabled="!selectedData || selectedData.length == 0"
              :icon="Delete"
              type="danger"
              @click="removeResource(selectedData)"
            >
              {{ $abT('page.common.batchDel', '批量删除') }}
            </el-button>
          </el-space>
        </el-col>
      </el-row>
    </div>
    <!-- 关键字段设置minwith，特定枚举字段设置with（管理列、日期、状态、字典等），
         不重要字段放最后，管理列设置 fixed="right"
    -->
    <ab-table
      ref="abTable"
      v-model="selectedData"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="cmsApi.portal.cmsPortalListUrl"
    >
      <ab-column
        :label="$abT('page.common.name', '名称')"
        min-width="120"
        prop="name"
      />
      <ab-column
        :label="$abT('page.common.code', '编码')"
        prop="code"
        width="120"
      />
      <ab-column
        :ab-text-formatter="
          '0-' +
          $abT('page.common.no', '否') +
          '-success|1-' +
          $abT('page.common.yes', '是')
        "
        align="center"
        :label="$abT('page.common.mobile', '移动端')"
        prop="mobile"
        width="85"
      />

      <ab-column
        ab-tag-effect="dark"
        ab-tag-type="statusStyle"
        label="状态"
        prop="statusName"
        width="95"
      />
      <ab-column
        :label="$abT('page.common.desc', '描述')"
        min-width="160"
        prop="remark"
      />
      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        :label="$abT('page.common.updateTime', '更新时间')"
        min-width="140"
        prop="updateTime"
      />
      <ab-column
        :label="$abT('page.common.updater', '更新人')"
        min-width="100"
        prop="updater"
      />
      <ab-column
        ab-template="edit"
        fixed="right"
        :label="$abT('page.common.operate', '操作')"
        width="365"
      />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:portal_edit
          :to="{
            name: 'PortalEdit',
            query: { id: scope.row.id },
          }"
        >
          <el-button text type="primary">
            {{ $abT('page.common.edit', '编辑') }}
          </el-button>
        </router-link>

        <router-link
          v-ab-btn-rights:portal_copy
          :to="{
            name: 'PortalEdit',
            query: {
              copy: '1',
              id: scope.row.id,
            },
          }"
        >
          <el-button text type="primary">
            {{ $abT('page.common.copy', '复制') }}
          </el-button>
        </router-link>
        <el-button
          v-if="scope.row.status === 0"
          v-ab-btn-rights:portal_changeStatus
          text
          type="primary"
          @click="
            sendAction(
              cmsApi.portal.cmsPortalChangeStatus + scope.row.id + `&status=1`,
              $abT('page.portal.sureEnable', '确定启用吗?')
            )
          "
        >
          {{ $abT('page.common.enable', '启用') }}
        </el-button>
        <el-button
          v-if="scope.row.status === 1"
          v-ab-btn-rights:portal_changeStatus
          text
          type="primary"
          @click="
            sendAction(
              cmsApi.portal.cmsPortalChangeStatus + scope.row.id + `&status=0`,
              $abT('page.portal.sureDisable', '确定禁用吗?')
            )
          "
        >
          {{ $abT('page.common.disable', '禁用') }}
        </el-button>
        <el-button
          v-if="scope.row.mobile === 0"
          v-ab-btn-rights:portal_addResource
          style="margin-left: 0px"
          text
          type="primary"
          @click="addMenuFn(scope.row)"
        >
          {{ $abT('page.common.joinMenu', '加入菜单') }}
        </el-button>

        <el-button
          v-if="scope.row.isSystem != 1"
          v-ab-btn-rights:portal_del
          text
          type="primary"
          @click="removeResource([scope.row])"
        >
          {{ $abT('page.common.del', '删除') }}
        </el-button>
      </template>
    </ab-table>
    <div id="infoBox">
      <!-- 此处放具体的弹窗内容 -->
    </div>
    <el-dialog
      v-model="state.dialogVisible"
      class="mystyle"
      :show-close="false"
      width="400px"
    >
      <el-select
        v-model="state.selectvalue"
        class="selectstyle"
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
          :empty-text="$abT('page.common.loading', '加载中...')"
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
            {{ $abT('page.common.cancel', '取消') }}
          </el-button>
          <el-button type="primary" @click="submit">
            {{ $abT('page.common.ok', '确定') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="state.roldDialogVisible"
      :title="$abT('page.portal.defaultHomepage', '角色所属默认首页')"
      width="800px"
    >
      <el-table
        class="dataDictList"
        :data="state.roleTableData"
        height="300"
        row-key="snRowKey"
        style="width: 100%"
      >
        <el-table-column
          :label="$abT('page.common.role', '角色')"
          prop="roleList"
        >
          <template #header>
            <div>
              {{ $abT('page.common.role', '角色') }}
              <el-tooltip
                class="box-item"
                :content="
                  $abT(
                    'page.portal.configuring',
                    '同个角色配置多个默认首页只会取第一条'
                  )
                "
                effect="dark"
                placement="top-start"
              >
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <template #default="scope">
            <div style="float: left">
              <el-tag
                v-for="item in scope.row.roleList"
                :key="item"
                style="margin-bottom: 5px"
              >
                {{ item['name'] }}
              </el-tag>
            </div>
            <ab-cust-dialog
              v-if="true"
              v-model="scope.row.roleList"
              dialog-key="roleSelector"
              :icon="Search"
              round
              size="small"
              style="float: right"
              type="primary"
            >
              {{ $abT('page.common.select', '选择') }}
            </ab-cust-dialog>
          </template>
        </el-table-column>

        <el-table-column
          :label="$abT('page.common.homePage', '首页')"
          prop="code"
        >
          <template #header>
            <div>
              {{ $abT('page.portal.defaultPage', '默认首页') }}
              <el-tooltip
                class="box-item"
                :content="
                  $abT(
                    'page.portal.homeTip',
                    '允许选择被禁用的门户，关联的角色用户登录时若门户被禁用则会忽略此门户。'
                  )
                "
                effect="dark"
                placement="top-start"
              >
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>

          <template #default="scope">
            <el-select
              v-model="scope.row.portalId"
              :placeholder="$abT('page.portal.selectPortal', '请选择门户')"
            >
              <el-option
                v-for="(item, index) in state.portalList"
                :key="index"
                :label="item.name"
                :value="item.id"
                @click="changePortal(item, scope.row)"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column width="90">
          <template #header>
            <span>{{ $abT('page.common.add', '添加') }}</span>
            <el-button
              circle
              :icon="Plus"
              size="small"
              style="margin-left: 12px"
              type="primary"
              @click="addRoleList"
            />
          </template>
          <template #default="scope">
            <el-button
              circle
              :icon="Delete"
              size="small"
              type="danger"
              @click="removeRel(scope.row, scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            text
            type="primary"
            @click="state.roldDialogVisible = false"
          >
            {{ $abT('page.common.cancel', '取消') }}
          </el-button>
          <el-button
            :loading="state.roleSaveLoading"
            type="primary"
            @click="saveRoleRel()"
          >
            {{ $abT('page.common.save', '保存') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {
    abTableMix,
    abUtil,
    authApi,
    cmsApi,
    orgApi,
    postData,
    registerApi,
    sysApi,
  } from '~/agilebpm'
  export default {
    name: 'PortalList',
    mixins: [abTableMix],
  }
</script>

<script setup lang="ts">
  import { abT } from '@/i18n'
  import { useAclStore } from '@/store/modules/acl'
  import { useRoutesStore } from '@/store/modules/routes'
  import {
    Delete,
    Plus,
    RefreshRight,
    Search,
    User,
  } from '@element-plus/icons-vue'
  import { ElMessageBox } from 'element-plus'
  import { getCurrentInstance } from 'vue'
  // @ts-ignore
  const { proxy } = getCurrentInstance()
  const vueInst = getCurrentInstance()

  if (abUtil.checkIsPublicProject(true)) {
    const confim = confirm('体验高级功能需要技术指导，请联系商务一对一服务！')

    window.location.href = '/index'
  }

  // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
  const query = reactive({
    name$VLK: '',
    code$VLK: '',
    status$NEQ: '',
  })

  const state = reactive({
    //加入菜单的弹框
    dialogVisible: false,
    //门户绑定角色的弹框
    roldDialogVisible: false,
    roleSaveLoading: false,
    roleTableData: [] as any[],
    portalList: [] as any[],
    relParam: {
      id: '',
      code: 'relRolePortal',
      json: '',
    },

    //加入菜单时所需的当前门户对象
    portalObj: {} as any,
    //加入的父菜单对象
    treeRow: {} as any,
    //加入菜单或批量加入的区分标识
    type: 0,
    //code集合，用来区分哪些标识可以删除的标识
    codeList: [] as string[],
    //以下为加入菜单弹窗内所需的变量
    selectvalue: localStorage.getItem('application'),
    selectoption: [] as any[],
    defaultExpanded: [] as string[],
    nodekey: '',
    height: `${window.innerHeight - (110 + 32 + 20 + 55 + 50)}px`,
    data: [],
    isshow: false,
    id: null,
  })

  watch(
    () => state.roleTableData,
    (rel) => {
      console.log('roleTableData', rel)
    },
    { deep: true }
  )
  const changePortal = (item: any, row: any) => {
    row.mobile = item.mobile
  }

  //保存关联关系
  const saveRoleRel = () => {
    let isOk = true
    state.roleTableData.forEach((item: any) => {
      if (!item.portalId || !item.roleList || item.roleList.length == 0) {
        isOk = false
      }
    })
    if (!isOk) {
      ElMessage({
        showClose: true,
        message: abT('page.portal.listTip', '请完善列表'),
        type: 'warning',
      })
      return false
    }
    state.roleSaveLoading = true
    state.relParam.json = JSON.stringify(state.roleTableData)
    sysApi.configuration
      .saveSysConfObj(state.relParam)
      .then(
        ({ msg }) => {
          state.roldDialogVisible = false
          state.roleSaveLoading = false
          ElMessage.success(msg)
        },
        () => (state.roleSaveLoading = false)
      )
      .catch(() => (state.roleSaveLoading = false))
  }

  //打开角色关系时请求后台数据
  const openRoldDialog = () => {
    sysApi.configuration.getSysConfObj(state.relParam.code).then((rel) => {
      if (rel.data) {
        state.relParam.id = rel.data.id
        state.roleTableData = JSON.parse(rel.data.json)
      } else {
        state.relParam.id = ''
        state.roleTableData = []
      }
    })

    cmsApi.portal.getList().then((rel) => {
      state.portalList = rel.data
    })

    state.roldDialogVisible = true
  }

  //添加一条中间关系
  const addRoleList = () => {
    state.roleTableData.push({
      portalId: '',
      roleList: [],
    })
  }

  //删除一条中间关系
  const removeRel = (row: any, index: any) => {
    if (row.portalId || (row.roleList && row.roleList.length > 0)) {
      ElMessageBox.confirm(
        abT('page.portal.sureDel', '确定删除吗？'),
        abT('page.common.prompt', '提示'),
        {
          confirmButtonText: abT('page.common.ok', '确定'),
          cancelButtonText: abT('page.common.cancel', '取消'),
          type: 'warning',
        }
      )
        .then(() => {
          state.roleTableData.splice(index, 1)
        })
        .catch(() => {})
    } else {
      state.roleTableData.splice(index, 1)
    }
  }

  //删除相关的资源项（单纯删除，无其他操作）
  const removeResource = (row: any[]) => {
    for (const item in row) {
      if (row[item].isSystem) {
        ElMessage.error(
          abT('page.portal.delTip', '删除失败，门户【{a}】为系统内置门户！', {
            a: row[item].name,
          })
        )

        return
      }
    }

    const confirmMsg =
      row.length == 1
        ? abT('page.common.delMsg', '确定删除 {a} 吗？', { a: row[0].name })
        : abT('page.common.benchDelMsg', '确定批量删除{a}条数据吗?', {
            a: row.length,
          })

    ElMessageBox.confirm(confirmMsg, abT('page.common.prompt', '提示'), {
      confirmButtonText: abT('page.common.ok', '确定'),
      cancelButtonText: abT('page.common.cancel', '取消'),
      type: 'warning',
    }).then(() => {
      cmsApi.portal.removePortal(row.map((s) => s.id).join(',')).then(() => {
        ElMessage({
          type: 'success',
          message: abT('page.common.operateSuccess', '操作成功'),
          onClose: () => {},
        })
        refreshTree()
        refreshStore()
        proxy.clearSelectedData()
        proxy.search()
      })
    })
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

  // 选择流程平台 / 后台
  const changeSelect = (select: string) => {
    state.selectvalue = select
    refreshTree()
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

  //删除相关的资源项
  const deleteNode = (row: any) => {
    ElMessageBox.confirm(
      abT('page.portal.sureDel', '确定删除吗？'),
      abT('page.common.prompt', '提示'),
      {
        confirmButtonText: abT('page.common.ok', '确定'),
        cancelButtonText: abT('page.common.cancel', '取消'),
        type: 'warning',
      }
    ).then(() => {
      authApi.removeResource({ id: row.id }).then(({ msg }) => {
        ElMessage({
          type: 'success',
          message: abT('page.common.removed', '已删除'),
          onClose: () => {},
        })

        refreshTree()
        refreshStore()
        state.treeRow = null
      })
    })
  }

  //加入菜单
  const addMenuFn = (row: any) => {
    refreshApplication()
    refreshTree()
    if (row && !validate(row, '')) {
      state.portalObj = row
      state.type = 1
      state.codeList = []
      state.codeList.push(`portal_${row.code}`)
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
        if (validate(arr[item], abT('page.portal.batch', '批量'))) {
          return
        }
        state.codeList.push(`portal_${arr[item].code}`)
      }
      state.type = 2
      state.dialogVisible = true
    }
  }

  //加入菜单前的校验
  const validate = (item: any, title: string) => {
    if (item.status === 0) {
      ElMessage.error(
        abT('page.portal.addTip', '{a}加入失败，门户【{b}】已被禁用！', {
          a: title,
          b: item.name,
        })
      )
    }
    if (item.mobile === 1) {
      ElMessage.error(
        abT(
          'page.portal.addMobileTip',
          '{a}加入失败，门户【{b}】为移动端门户！',
          { a: title, b: item.name }
        )
      )
    }
    return item.status === 0 || item.mobile === 1
  }

  //加入菜单弹窗选择确定提交时触发的方法
  const submit = () => {
    if (!state.treeRow || JSON.stringify(state.treeRow) === '{}') {
      ElMessage({
        message: abT('page.portal.menuTip', '请选择菜单'),
        type: 'error',
      })
    } else if (state.treeRow.id == '0') {
      ElMessage({
        message: abT('page.portal.joinTip', '加入菜单失败：禁止添加到根菜单'),
        type: 'error',
      })
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

  watch(
    () => state.dialogVisible,
    (newValue) => {
      if (!newValue) state.treeRow = null
    }
  )

  //加入菜单以及路由
  const voView = (datas: any[], list: any) => {
    debugger
    const dataList = datas.map((dataRow) => {
      return {
        name: dataRow.name,
        code: `portal_${dataRow.code}`,
        url: `/cms/portal/portal/${dataRow.code}`,
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
          message: abT('page.portal.joinSuccess', '加入成功'),
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
