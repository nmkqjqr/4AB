<template>
  <el-space wrap>
    <el-button type="primary" text @click="openAuthDialog()">
      设置数据权限
    </el-button>
  </el-space>
  <el-dialog
    v-model="info.dialogVisible"
    title="数据权限配置"
    width="60%"
    destroy-on-close
    @close="cancleAuthDialog"
  >
    <el-empty
      v-if="info.treeData.length === 0"
      description="暂无授权资源，请先分配资源"
    />
    <div class="demo-collapse" v-else>
      <el-form>
        <el-form-item label="全局配置">
          <el-space>
            <el-switch
              v-model="info.gloabal.isOpne"
              inline-prompt
              active-text="是"
              inactive-text="否"
            />
            <span v-if="info.gloabal.isOpne" style="margin-left: 30px">
              <label>数据范围：</label>

              <el-select style="width: 250px" v-model="info.gloabal.dataScope">
                <el-option
                  v-for="dataScope in dataScopeOptions"
                  :key="dataScope.key"
                  :label="dataScope.value"
                  :value="dataScope.key"
                />
              </el-select>
            </span>
          </el-space>
        </el-form-item>

        <el-table
          :data="info.treeData"
          :border="true"
          style="width: 100%; margin-top: 10px"
        >
          <el-table-column label="资源名称" prop="name" />
          <el-table-column label="数据范围" prop="dataSope">
            <template #default="scope">
              <el-select
                :disabled="info.gloabal.isOpne"
                style="width: 200px"
                v-model="scope.row.dataScope"
                :placeholder="
                  $abT(
                    'page.dataAuth.dataScope',
                    '请选择数据权限范围，默认为全部数据'
                  )
                "
              >
                <el-option
                  v-for="dataScope in dataScopeOptions"
                  :key="dataScope.key"
                  :label="dataScope.value"
                  :value="dataScope.key"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancleAuthDialog">取消</el-button>
        <el-button type="primary" @click="authDialogOk(auth)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import {
    getDataPrivilege,
    dataPrivilege,
  } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-authGroup'

  import { ElMessage } from 'element-plus'
  import { abT } from '@/i18n'
  import { abUtil, sysApi } from '~/agilebpm'

  //双向绑定
  const emit = defineEmits(['grantSuccess'])

  const props = defineProps({
    authGroup: {
      type: Object,
      required: true,
    },
    saveData: {
      type: Boolean,
      default: true,
    },
    projectId: { required: true, type: String },
  })

  const { authGroup } = toRefs(props)

  const info = reactive({
    gloabal: {
      isOpne: false,
      dataScope: 'notConfig',
    },
    conditionFields: [],
    treeData: [],
    dialogVisible: false,
    currentResourceId: null,
    activeName: '',
  })

  const setTreeData = (allResources: any) => {
    info.treeData.splice(0, info.treeData.length)
    if (allResources && allResources.length > 0) {
      info.treeData.push(...allResources)
    }
  }

  const refreshTree = () => {
    info.treeData.splice(0, info.treeData.length)
    getDataPrivilege(props.authGroup.id).then((res) => {
      setTreeData(res.data)
      if (info.treeData.length > 0) {
        info.currentResourceId = info.treeData[0].id
      }
    })
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

  const authDialogOk = () => {
    const data = {
      authId: props.authGroup.id,
      dataScope: info.gloabal.dataScope,
      dataPrivileges: info.treeData,
      global: info.gloabal.isOpne,
    }
    dataPrivilege(data).then((res) => {
      info.dialogVisible = false
    })
  }

  const openAuthDialog = () => {
    info.dialogVisible = true
  }

  const cancleAuthDialog = () => {
    info.treeData = []
    info.dialogVisible = false
  }

  watch(
    () => info.dialogVisible,
    (newValue) => {
      setTreeData([])
      if (newValue) {
        refreshTree()
      }
    }
  )
</script>

<style scoped>
  .pad {
    padding: 0px 0px 0 160px;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 1px;
  }

  .perBtn {
    margin-left: 12px;
  }
</style>
