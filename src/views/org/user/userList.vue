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
            @submit.prevent
          >
            <el-form-item
              :label="$abT('page.userList.fullname', '姓名')"
              prop="fullname$VLK"
            >
              <el-input v-model="query.fullname$VLK" />
            </el-form-item>
            <el-form-item
              :label="$abT('page.userList.account', '账户')"
              prop="account$VLK"
            >
              <el-input v-model="query.account$VLK" />
            </el-form-item>

            <el-form-item
              v-show="collapse"
              :label="$abT('page.common.status', '状态')"
              prop="status$NEQ"
            >
              <el-select
                v-model="query.status$NEQ"
                clearable
                :placeholder="$abT('page.common.all', '全部')"
              >
                <el-option
                  :label="$abT('page.common.disable', '禁用')"
                  value="0"
                />
                <el-option
                  :label="$abT('page.common.enable', '启用')"
                  value="1"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-show="collapse"
              :label="$abT('page.userList.mobile', '手机号')"
              prop="mobile$VLK"
            >
              <el-input v-model="query.mobile$VLK" />
            </el-form-item>
            <el-form-item>
              <!--  abTableMix 提供了search,reset,handleCollapse 这些通用方法-->
              <el-button :icon="Search" type="primary" @click="search()">
                {{ $abT('page.common.search',  '查询' ) }}
              </el-button>
              <el-button :icon="RefreshRight" @click="reset()">
                {{ $abT('page.common.reset','重置') }}
              </el-button>
              <el-button link type="primary" @click="handleCollapse()">
                <span v-if="!collapse" type="primary">
                  {{ $abT('page.common.expand','展开') }}
                </span>
                <span v-else type="primary">
                  {{ $abT('page.common.packup','收起') }}
                </span>
                <el-icon class="el-icon--right">
                  <arrow-down v-if="!collapse" />
                  <ArrowUp v-else />
                </el-icon>
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="left-panel">
          <router-link v-ab-btn-rights:userList_add to="/org/user/userEdit">
            <el-button :icon="Plus" type="primary">
              {{ $abT('page.common.add','添加') }}
            </el-button>
          </router-link>
          <el-button
            v-if="workHoverData.ddShow"
            v-ab-btn-rights:userList_add
            :disabled="workHoverData.isClick"
            :icon="Plus"
            style="margin-left: 12px"
            type="primary"
            @click="sycnDdData(true, false)"
          >
            {{ $abT('page.userList.syncDDUser','同步钉钉用户') }}
          </el-button>
          <el-button
            v-if="workHoverData.ddShow"
            v-ab-btn-rights:userList_add
            :disabled="workHoverData.isClick"
            :icon="Plus"
            type="primary"
            @click="sycnDdData(true, true)"
          >
            {{ $abT('page.userList.syncDDUser&Org','同步钉钉用户及部门') }}
          </el-button>
          <el-button
            v-ab-btn-rights:userList_del
            :disabled="!selectedData || selectedData.length === 0"
            :icon="Delete"
            style="margin-left: 12px"
            type="danger"
            @click="delBySeletedIds(orgApi.user.OrgUserRemoveUrl)"
          >
            {{ $abT('page.common.batchDel','批量删除') }}
          </el-button>

          <span v-ab-btn-rights:userList_import style="margin-left: 12px">
            <ab-upload-dialog
              accept=".xls, .xlsx"
              :after-save="afterImp"
              :after-save-need-download="true"
              :data="uploadData"
              :search="search"
              :timeout="2 * 60 * 1000"
            />
          </span>
          <el-button
            v-ab-btn-rights:userList_exportTemplate
            style="margin-left: 12px"
            type="primary"
            @click="exportTemplate()"
          >
            {{ $abT('page.common.exportTemplate','导出模版') }}
          </el-button>
        </el-col>
      </el-row>
    </div>

    <ab-table
      ref="abTable"
      v-model="selectedData"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="orgApi.user.OrgUserListUrl"
    >
      <ab-column
        :label="$abT('page.userList.fullname', '姓名')"
        min-width="80"
        prop="fullname"
      />
      <ab-column
        :label="$abT('page.userList.account', '账户')"
        min-width="100"
        prop="account"
      />
      <ab-column
        ab-effect="plain"
        ab-key="type"
        ab-text="desc"
        ab-type="success"
        :label="$abT('page.userList.sex', '性别')"
        min-width="60"
        prop="sex"
      />
      <ab-column
        :label="$abT('page.userList.email', '邮箱')"
        min-width="100"
        prop="email"
      />
      <ab-column
        :label="$abT('page.userList.mobile', '手机号')"
        min-width="100"
        prop="mobile"
      />
      <ab-column
        :label="$abT('page.common.status', '状态')"
        min-width="80"
        ab-template="status"
      />
      <template #status="{ scope }">
        <el-tag v-if="scope.row.status === 0" type="danger">
          {{ $abT('page.common.disable','禁用') }}
        </el-tag>
        <el-tag v-if="scope.row.status === 1" type="success">
          {{ $abT('page.common.enable','启用') }}
        </el-tag>
      </template>
      <ab-column
        ab-template="bossUserId"
        :label="$abT('page.userList.master/subAccount', '主/子账户')"
        width="90"
      />
      <template #bossUserId="{ scope }">
        <el-tag v-if="scope.row.bossUserId === '-1'" type="info">-</el-tag>
        <el-tag v-else-if="scope.row.bossUserId === '0'" type="success">
          {{ $abT('page.userList.main','主') }}
        </el-tag>
        <el-tag v-else>{{ $abT('page.userList.lesser','子') }}</el-tag>
      </template>
      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        :label="$abT('page.common.updateTime', '更新时间')"
        min-width="120"
        prop="updateTime"
      />
      <ab-column
        :label="$abT('page.common.updater', '更新人')"
        min-width="80"
        prop="updater"
      />
      <ab-column
        ab-template="edit"
        fixed="right"
        :label="$abT('page.common.operate', '操作')"
        width="420"
      />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:userList_edit
          :to="{ name: 'userEdit', query: { id: scope.row.id } }"
        >
          <el-button text type="primary">
            {{ $abT('page.common.edit','编辑') }}
          </el-button>
        </router-link>

        <el-button
          v-ab-btn-rights:userList_updateStatus
          text
          type="primary"
          @click="
            sendAction(
              orgApi.user.OrgUserUpdateStatusUrl + scope.row.id,
              $abT('page.common.confimMsg','确定 {a} 吗？', {
                a:
                  scope.row.status === 1
                    ? $abT('page.common.disable', '禁用')
                    : $abT('page.common.enable', '启用'),
              })
            )
          "
        >
          {{
            scope.row.status === 1
              ? $abT('page.common.disable', '禁用')
              : $abT('page.common.enable', '启用')
          }}
        </el-button>
        <el-button
          v-ab-btn-rights:userList_resetPassword
          text
          type="primary"
          @click="
            sendAction(
              orgApi.user.OrgUserResetPwdUrl + scope.row.id,
              $abT('page.userList.confimResetPwd','确定重置密码吗？')
            )
          "
        >
          {{ $abT('page.userList.resetPwd','重置密码') }}
        </el-button>
        <el-button
          v-ab-btn-rights:userList_del
          text
          type="primary"
          @click="
            sendAction(
              orgApi.user.OrgUserRemoveUrl + scope.row.id,
              $abT('page.common.delMsg','确定删除 {a} 吗？',{ a: scope.row.fullname })
            )
          "
        >
          {{ $abT('page.common.del','删除') }}
        </el-button>
        <el-button
          v-ab-btn-rights:userList_subAccount
          text
          type="primary"
          @click="openBindSubAccountDialog(scope.row)"
        >
          {{ $abT('page.userList.subAccount','子账户') }}
        </el-button>
      </template>
    </ab-table>
    <bind-sub-account :data="bindSubAccountDialogData" @save-ok="search" />
  </div>
</template>

<script lang="ts">
  import { abT } from '@/i18n'
  import { defineComponent, onMounted, reactive } from 'vue'
  import {
    abTableMix,
    orgApi,
    sysApi,
    registerApi,
    abUploadDialog,
    abTools,
  } from '~/agilebpm'
  import BindSubAccount from './bindSubAccount.vue'

  import { ElMessage } from 'element-plus'

  import {
    ArrowDown,
    ArrowUp,
    Delete,
    Edit,
    Plus,
    RefreshRight,
    Search,
  } from '@element-plus/icons-vue'
  import { useUserStore } from '@/store/modules/user'
  //当前用户信息
  const userInfo = useUserStore().abUser

  export default defineComponent({
    //页面缓存
    name: 'UserList',
    components: {
      ArrowUp,
      ArrowDown,
      abUploadDialog,
      BindSubAccount,
    },
    mixins: [abTableMix],
    setup() {
      const query = reactive({
        fullname$VLK: '',
        account$VLK: '',
        sex$VEQ: '',
        mobile$VLK: '',
        status$NEQ: '',
      })
      // mounted 时机
      onMounted(() => {})

      const uploadData = reactive({
        btnText: abT('page.common.import', '导入'),
        tip: abT('page.common.pleaseSelectFile', '请选择.xls，.xlsx文件'),
        url: orgApi.user.OrgUserImport,
      })

      const workHoverData = reactive({
        show: false,
        userInfo: {},
        ddShow: false,
        isClick: false,
      })

      sysApi.configuration
        .getConfByCode('quickLoginType')
        .then((result: any) => {
          if (result.isOk && result.data) {
            const conf_obj = JSON.parse(result.data)
            const appLoginType = conf_obj['appLoginType']
            const pcLoginType = conf_obj['pcLoginType']

            if (appLoginType == 'dingTalk' || pcLoginType == 'dingTalk') {
              workHoverData.ddShow = true
            }
          }
        })

      const sycnDdData = (isAdd: boolean, isSycnOrg: boolean) => {
        workHoverData.isClick = true
        registerApi.sycnDdData(isAdd, isSycnOrg).then((result: any) => {
          if (result.isOk) {
            workHoverData.isClick = false
            ElMessage({
              message: abT('page.userList.syncSuccess', '同步成功！'),
              type: 'success',
            })
          }
        })
      }
      const showWorHover = (userInfo: any) => {
        workHoverData.show = true
        workHoverData.userInfo = userInfo
      }

      //导出模版
      const exportTemplate = () => {
        orgApi.user.OrgUserExportTemplate().then((result: any) => {
          abTools.downImgFile(
            abT('page.userList.userExTemp', '用户导出模版.xls'),
            result
          )
        })
      }

      const afterImp = (result: any) => {
        if (result.size == 0) {
          ElMessage({
            message: abT('page.common.importFailed', ' 导入成功'),
            type: 'success',
          })
        } else {
          ElMessage({
            message: abT('page.common.importSomeFailed', '部分导入失败'),
            type: 'error',
          })
          abTools.downImgFile(
            abT('page.common.importFailedData	', '导入失败数据.xls'),
            result
          )
        }
      }

      const openBindSubAccountDialog = (user: any) => {
        bindSubAccountDialogData.userId = user.id
        bindSubAccountDialogData.title =
          `【${user.fullname}】` + abT('page.userList.subAccount', '子账户')
        bindSubAccountDialogData.visible = true
      }

      const bindSubAccountDialogData = reactive({
        visible: false,
        userId: '',
        title: '',
      })

      return {
        query,
        orgApi,
        Delete,
        Edit,
        Search,
        Plus,
        RefreshRight,
        workHoverData,
        showWorHover,
        sycnDdData,
        abUploadDialog,
        uploadData,
        exportTemplate,
        afterImp,
        openBindSubAccountDialog,
        bindSubAccountDialogData,
      }
    },
  })
</script>
