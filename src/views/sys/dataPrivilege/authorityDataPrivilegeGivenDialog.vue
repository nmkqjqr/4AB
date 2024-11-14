<template>
  <el-dialog
    v-model="info.dialogVisible"
    :append-to-body="true"
    draggable
    :title="$abT('page.roleList.setDataPermissions', '设置数据权限')"
    width="450px"
  >
    <el-form>
      <el-form-item :label="$abT('page.roleList.dataScope', '数据范围')">
        <el-row style="width: 100%">
          <el-col :span="16">
            <el-select v-model="info.privilegeGive.dataScope">
              <el-option
                v-for="dataScope in dataScopeOptions"
                :key="dataScope.key"
                :label="dataScope.value"
                :value="dataScope.key"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <ab-cust-dialog
              v-if="info.privilegeGive.dataScope === 'customize'"
              dialog-key="orgSelector"
              :dialog-setting="{ multiple: 1 }"
              style="margin-left: 10px"
              @ok="orgSelectorOk"
            >
              {{ $abT('page.groupList.selectOrg', '选择组织') }}
            </ab-cust-dialog>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        v-if="info.privilegeGive.dataScope === 'customize'"
        :label="$abT('page.roleList.appointOrg', '指定组织')"
      >
        <el-tag
          v-for="(item, index) in info.privilegeGive.orgNames"
          :key="index"
          closable
          type="success"
          @close="removeOrg(index)"
        >
          {{ item }}
        </el-tag>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button text @click="info.dialogVisible = false">
        {{ $abT('page.common.cancel', '取消') }}
      </el-button>
      <el-button type="primary" @click="confirm">
        {{ $abT('page.common.ok', '确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  export default defineComponent({
    name: 'AuthorityDataPrivilegeGivenDialog',
  })
</script>

<script lang="ts" setup>
  import { abUtil, sysApi, getData, postData } from '~/agilebpm'
  import { ElMessage } from 'element-plus'
  import { abT } from '@/i18n'

  const emit = defineEmits(['ok'])

  const info = reactive({
    dialogVisible: false,
    loading: false,
    privilegeGive: {
      dataPrivilegeId: '',
      authority: '',
      dataScope: '',
      orgIds: [] as any[],
      orgNames: [] as any[],
    },
  })

  const removeOrg = (index: number) => {
    abUtil.Arrays.del(index, info.privilegeGive.orgNames)
    abUtil.Arrays.del(index, info.privilegeGive.orgIds)
  }

  const orgSelectorOk = (dataList: any[]) => {
    const orgIds: any[] = []
    const orgNames: any[] = []

    if (dataList) {
      dataList.forEach(({ id, name }) => {
        orgIds.push(id)
        orgNames.push(name)
      })
      info.privilegeGive.orgIds = orgIds
      info.privilegeGive.orgNames = orgNames
    }
  }

  // 数据权限选项
  const dataScopeOptions = ref<any[]>()

  onMounted(() => {
    sysApi.tools
      .getEnum(
        'com.dstz.component.data.privilege.enums.DataPrivilegeScope',
        true
      )
      .then(({ data }) => (dataScopeOptions.value = data))
  })

  const show = async (authority: string, dataPrivilegeId: string) => {
    info.loading = true
    info.dialogVisible = true
    try {
      const { data } = await getData(
        sysApi.dataPrivilege.dataPrivilegeGivenGetDetailUrl,
        {
          dataPrivilegeId,
          authority,
        }
      )
      info.privilegeGive = data
      info.privilegeGive.dataPrivilegeId = dataPrivilegeId
      info.privilegeGive.authority = authority
    } catch (error) {
      info.dialogVisible = false
      throw error
    } finally {
      info.loading = false
    }
  }

  const confirm = async () => {
    info.loading = true
    try {
      await postData(
        sysApi.dataPrivilege.dataPrivilegeGivenUrl,
        info.privilegeGive
      )
    } finally {
      info.loading = false
    }
    info.dialogVisible = false
    ElMessage({
      type: 'success',
      message: abT('page.common.operateSuccess', '操作成功'),
    })
    emit('ok')
  }

  defineExpose({ show })
</script>
