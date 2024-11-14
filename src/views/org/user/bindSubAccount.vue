<script lang="ts">
  import { abTableMix } from '~/agilebpm'

  export default { mixins: [abTableMix] }
</script>
<script setup lang="ts">
  import { Search, RefreshRight } from '@element-plus/icons-vue'
  import { orgApi, abUtil, abTools, request, postData } from '~/agilebpm'
  import { PropType } from 'vue'
  import { ElMessage } from 'element-plus'

  interface DialogData {
    visible: boolean
    userId: string
    title: string
  }

  const props = defineProps({
    data: { required: true, type: Object as PropType<DialogData> },
  })

  const emit = defineEmits(['saveOk'])

  const userTable = ref()

  const { data: dialogData } = toRefs(props)

  watch(
    () => dialogData.value.visible,
    (val) => {
      if (val) {
        fetchSelectedData(dialogData.value.userId)
      }
    }
  )

  const dialogClose = () => {
    dialogData.value.visible = false
  }

  const info = reactive({
    saveLoading: false,
    queryParam: {
      account$VLK: '',
      fullname$VLK: '',
    },
    selectedData: [],
    selectedLoading: false,
  })

  const fetchSelectedData = (userId: string) => {
    info.selectedLoading = true
    postData(orgApi.user.OrgUserListUrl, {
      currentPage: 1,
      pageSize: 100,
      queryParam: { bossUserId$VEQ: userId },
    })
      .then(({ data }) => {
        reAbTableSelected(data.rows)
      })
      .finally(() => (info.selectedLoading = false))
  }

  const removeSelectedData = (index: number) => {
    abUtil.Arrays.del(index, info.selectedData)
    reAbTableSelected([...info.selectedData])
  }

  const reAbTableSelected = (selectedData: Array<any>) => {
    userTable.value.clearSelectedData()
    userTable.value.selectedData = selectedData
    userTable.value.handleSelectedData()
  }

  const dialogHeight = computed(() =>
    Math.max(abTools.getClientHeight() / 2, 500)
  )

  const dialogOk = () => {
    info.saveLoading = true
    const userIds = info.selectedData.map((item: any) => item.id)
    const bossUserId = dialogData.value.userId
    orgApi.user
      .bindSubAccount(bossUserId, userIds)
      .then(({ msg }) => {
        ElMessage({
          type: 'success',
          message: msg,
        })
        dialogClose()
        emit('saveOk')
      })
      .finally(() => (info.saveLoading = false))
  }
</script>

<template>
  <div>
    <el-dialog
      v-model="dialogData.visible"
      :title="dialogData.title"
      width="980px"
      v-loading="info.saveLoading"
      :append-to-body="true"
      @close="dialogClose"
    >
      <div class="dialog-content" v-if="dialogData.visible">
        <div class="search-params">
          <el-form
            ref="searchForm"
            :inline="true"
            :label-width="100"
            :model="info.queryParam"
            style="width: 100%"
          >
            <el-form-item  :label="$abT('page.userList.account','账户')" prop="account$VLK">
              <el-input
                v-model="info.queryParam.account$VLK"
                :placeholder="$abT('page.userList.pleaseEnterAccount','请输入帐户')"
              />
            </el-form-item>
            <el-form-item :label="$abT('page.userList.fullname','姓名')" prop="fullname$VLK">
              <el-input
                v-model="info.queryParam.fullname$VLK"
                :placeholder="$abT('page.userList.pleaseEnterName','请输入姓名')"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                :icon="Search"
                type="primary"
                @click="search('userTable')"
              >
                {{ $abT('page.common.search',  '查询' ) }}
              </el-button>
              <el-button
                :icon="RefreshRight"
                @click="reset('userTable', 'searchForm')"
              >
                {{ $abT('page.common.reset','重置') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-row :gutter="10">
          <el-col :span="16">
            <ab-table
              ref="userTable"
              v-model="info.selectedData"
              :height="dialogHeight - 140"
              :query-param="info.queryParam"
              row-key="id"
              :url="orgApi.user.OrgUserListUrl"
            >
              <ab-column  :label="$abT('page.userList.account','账户')" prop="account" />
              <ab-column  :label="$abT('page.userList.fullname','姓名')" prop="fullname" />
            </ab-table>
          </el-col>
          <el-col :span="8">
            <el-card class="selected-card">
              <template #header>
                <span>{{ $abT('page.common.selected','已选择') }}</span>
              </template>
              <el-scrollbar
                native
                :height="dialogHeight - 182"
                v-loading="info.selectedLoading"
              >
                <div class="selected-items">
                  <el-alert
                    :title="user.fullname"
                    type="success"
                    v-for="(user, index) in info.selectedData"
                    :key="user.account"
                    @close="removeSelectedData(index)"
                  />
                </div>
              </el-scrollbar>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogClose">{{ $abT('page.common.cancel','取消') }}</el-button>
          <el-button type="primary" @click="dialogOk">{{ $abT('page.common.ok','确定') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  .dialog-content {
    .search-params {
      border-bottom: 1px var(--el-border-color) var(--el-border-style);
    }
    .selected-card {
      margin-top: 20px;

      .selected-items {
        width: calc(100% - 20px);
      }
    }
  }
  .dialog-footer {
    padding-top: 5px;
    border-top: 1px var(--el-border-color) var(--el-border-style);
  }
</style>
