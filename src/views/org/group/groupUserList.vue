<template>
  <div ref="titleForm">
    <el-row class="vab-query-form">
      <el-col class="top-panel">
        <el-form
          ref="queryForm"
          :inline="true"
          label-width="62px"
          :model="query"
        >
          <el-form-item :label="$abT('page.userList.fullname','姓名')" prop="fullname$VLK">
            <el-input
              v-model="query.fullname$VLK"
              clearable
              :placeholder="$abT('page.userList.pleaseEnterName','请输入姓名')"
              type="text"
            />
          </el-form-item>

          <el-form-item :label="$abT('page.userList.account','账户')" prop="account$VLK">
            <el-input
              v-model="query.account$VLK"
              clearable
              :placeholder="$abT('page.userList.pleaseEnterAccount','请输入帐户')"
              type="text"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" @click="search()">
              {{ $abT('page.common.search',  '查询' ) }}
            </el-button>
            <el-button :icon="RefreshRight" @click="reset()">
              {{ $abT('page.common.reset','重置') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col class="left-panel">
        <el-space>
          <el-button
            v-ab-btn-rights:groupUserList_add
            :icon="Plus"
            type="primary"
            @click="info.showAddDialog = true"
          >
            {{ $abT('page.groupList.addPostUser','新增岗位用户') }}
          </el-button>
          <el-button
            v-ab-btn-rights:groupUserList_del
            :disabled="!selectedData || selectedData.length == 0"
            :icon="Delete"
            type="danger"
            @click="delBySeletedIds(orgApi.post.removeGroupUserUrl)"
          >
            {{ $abT('page.common.batchDel','批量删除') }}
          </el-button>
        </el-space>
      </el-col>
    </el-row>
  </div>

  <ab-table
    ref="abTable"
    v-model="selectedData"
    :height="tableHeight"
    :query-param="query"
    row-key="id"
    :url="orgApi.post.queryGroupUserUrl"
  >
    <ab-column :label="$abT('page.userList.fullname','姓名')" min-width="100" prop="userFullname" />

    <ab-column :label="$abT('page.userList.account','账户')" min-width="100" prop="userAccount" />

    <ab-column :label="$abT('page.common.group','组织')" min-width="130" prop="groupName" />


    <ab-column ab-template="groupRole" :label="$abT('page.common.post','岗位')" min-width="280" prop="groupUserRoles"/>
    <template #groupRole="{ scope }">
      <el-tag
        v-for="item in scope.row.groupUserRoles"
        :key="item.relId"
        class="mx-1"
      >
        {{ item.roleName }}
      </el-tag>
    </template>

    <ab-column ab-template="masterTemplate" :label="$abT('page.groupList.masterOrg','主组织')" min-width="70" prop="isMaster"
    />
    <template #masterTemplate="{ scope }">
      <el-switch
        v-model="scope.row.isMaster"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        inline-prompt
        :active-value = "1"
        :inactive-value = "0"
        :active-text = "$abT('page.common.yes','是')"
        :inactive-text = "$abT('page.common.no','否')"
        :before-change="beforeChangeMaster.bind(this,scope.row)"
      />
    </template>


    <ab-column  ab-template="statusTemplate"  :label="$abT('page.common.status','状态')"  min-width="100" prop="status"/>
    <template #statusTemplate="{ scope }">
        <el-switch
          v-model="scope.row.status"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          inline-prompt
          :active-value = "1"
          :inactive-value = "0"
          :active-text = "$abT('page.common.enable','启用')"
          :inactive-text = "$abT('page.common.disable','禁用')"
          :before-change="beforeChangeStatus.bind(this,scope.row)"
        />
    </template>


    <ab-column
      ab-date-formatter="yyyy-MM-dd HH:mm"
      :label="$abT('page.common.updateTime','更新时间')"
      min-width="140"
      prop="updateTime"
    />

    <ab-column
      :label="$abT('page.common.updater','更新人')"
      min-width="120"
      prop="updater"
    />

    <ab-column
      ab-template="edit"
      fixed="right"
      :label="$abT('page.common.manage','管理')"
      temp="action"
      width="140"
    />
    <template #edit="{ scope }">
      <el-button
        v-ab-btn-rights:groupUserList_edit
        type="text"
        @click="showEditDialogFn(scope.row)"
      >
        {{ $abT('page.common.edit','编辑') }}
      </el-button>

      <el-button
        v-ab-btn-rights:groupUserList_del
        text
        type="primary"
        @click="
          sendAction(
            orgApi.post.removeGroupUserUrl + scope.row.id,
              $abT('page.common.delMsg','确定删除 {a} 吗？',{ a: scope.row.userFullname })
          )
        "
      >
        {{ $abT('page.common.del','删除') }}
      </el-button>
    </template>
  </ab-table>

  <addGroupUser
    :current-org="currentOrg"
    name="addGroupRoleUser"
    :show-dialog="info.showAddDialog"
    @close="closeSaveDialogFn"
    @reSearch="reSearchFn"
  />
  <editGroupUserRole
    :current-rel="info.currentGroupUserRole"
    name="editGroupUserRole"
    :show-dialog="info.showEditDialog"
    @close="closeEditDialogFn"
    @reSearch="reSearchFn"
  />
</template>

<script lang="ts">
  import { abT } from '@/i18n'
  import { reactive, defineComponent } from 'vue'
  import {abTableMix, orgApi} from '~/agilebpm'
  import addGroupUser from '@/views/org/group/addGroupUser.vue'
  import editGroupUserRole  from '@/views/org/group/editGroupUserRole.vue'
  import { Delete, Plus, RefreshRight, Search } from '@element-plus/icons-vue'
  import {ElMessage, ElMessageBox} from 'element-plus'

  export default defineComponent({
    name: 'GroupUserList',
    components: { addGroupUser,editGroupUserRole },
    mixins: [abTableMix],
    props: {
      orgId: {
        type: String,
        required: true,
      },
      currentOrg: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      // @ts-ignore
      const { proxy } = getCurrentInstance()

      const query: any = reactive({
        groupId: props.orgId,
      })

      const info: any = reactive({
        showAddDialog: false,
        showEditDialog: false,
        selectedData: [],
        currentGroupUserRole:{}
      })

      const reSearchFn = () => {
        proxy.search()
      }

      const showEditDialogFn = (row: any) => {
        info.currentGroupUserRole=row
        info.showEditDialog = true
      }

      const closeEditDialogFn = () => {
        info.showEditDialog = false
      }

      const closeSaveDialogFn = (isAdd: any) => {
        info.showAddDialog = false
        if (isAdd) {
          // search();
        }
      }

      const beforeChangeMaster = (row:any) => {
        ElMessageBox.confirm(
          row.isMasterDesc === '是'?
            abT('page.common.removeMainOrgMsg','确定{a}取消主组织吗？',{ a:row.groupName})
            :abT('page.common.setMainOrgMsg','确定{a}设为主组织吗？',{ a:row.groupName}),
          abT('page.common.prompt','提示'), {
          confirmButtonText: abT('page.common.ok','确定'),
          cancelButtonText: abT('page.common.cancel','取消'),
          type: 'warning',
        }).then(async () => {
          const isMaster = row.isMasterDesc != "是"
          await orgApi.post.updateGroupUserMaster(row.id, isMaster).then(
            (result: any) => {
              proxy.search()
              ElMessage({
                type: 'success',
                message:  abT('page.groupList.switchMainOrgSuccess','主组织切换成功'),
                onClose: () => {},
              })
              return new Promise((resolve) => {
                return resolve(true)
              })
            },
            () => {}
          )
        }).catch(() => {
          return new Promise((_, reject) => {
            setTimeout(() => {
              ElMessage.warning(abT('page.groupList.cancelSwitchMainOrg','取消切换主组织'))
              return reject(new Error('Error'))
            }, 500)
          })
        })

      }

      const beforeChangeStatus = (row:any) => {
        ElMessageBox.confirm(
          row.statusDesc=="禁用" ?
            abT('page.common.confirmEnable','确定启用{b}吗？',{a:row.userFullnam})
            :abT('page.common.confirmDisable','确定禁用{a}吗？',{a:row.userFullnam}) ,
          abT('page.common.prompt','提示'), {
          confirmButtonText: abT('page.common.ok','确定'),
          cancelButtonText: abT('page.common.cancel','取消'),
          type: 'warning',
        }).then(async () => {
          const status = row.statusDesc == "禁用"
          await orgApi.post.updateGroupUserStatus(row.id, status).then(
            (result: any) => {
              proxy.search()
              ElMessage({
                type: 'success',
                message: result.msg ||  abT('page.groupList.switchStateSuccess','状态切换成功'),
                onClose: () => {},
              })
              return new Promise((resolve) => {
                return resolve(true)
              })
            },
            () => {}
          )
        }).catch(() => {
          return new Promise((_, reject) => {
            setTimeout(() => {
              ElMessage.warning(abT('page.groupList.cancelSwitchState','取消切换状态'))
              return reject(new Error('Error'))
            }, 500)
          })
        })
      }

      watch(
        () => props.orgId,
        (orgId) => {
          if (orgId) {
            query.groupId = orgId
            proxy.search()
          }
        }
      )
      onMounted(() => {
        query.groupId = props.orgId
      })
      return {
        query,
        info,
        reSearchFn,
        closeSaveDialogFn,
        orgApi,
        Delete,
        Plus,
        RefreshRight,
        Search,
        showEditDialogFn,
        closeEditDialogFn,
        beforeChangeMaster,
        beforeChangeStatus,
      }
    },
  })
</script>
