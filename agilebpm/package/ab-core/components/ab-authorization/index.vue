<template>
  <div>
    <el-dialog
      v-model="info.dialogVisible"
      :title="$abT('page.common.authorization', '授权')"
      width="40%"
    >
      <el-form
        ref="authorizationFormRef"
        v-loading="info.loading"
        class="demo-ruleForm"
        label-width="85px"
        :model="info.data"
      >
        <el-form-item :label="$abT('page.common.all', '全部')">
          <el-switch
            v-model="info.all"
            :active-value="true"
            :inactive-value="false"
            style="margin-left: 20px"
          />
        </el-form-item>
        <v-if v-if="!info.all">
          <el-form-item :label="$abT('page.groupList.orgUser', '用户')">
            <div v-if="info.data.user.length > 0" style="margin-left: 20px">
              <el-tag
                v-for="item in info.data.user"
                :key="item"
                closable
                @close="closeUser(item)"
              >
                {{ item['name'] }}
              </el-tag>
            </div>
            <ab-cust-dialog
              v-model="info.data.user"
              dialog-key="userSelector"
              :icon="Search"
              round
              size="small"
              style="margin-left: 10px"
              type="primary"
            >
              {{ $abT('page.common.select','选择') }}
            </ab-cust-dialog>
          </el-form-item>
          <el-form-item :label="$abT('page.common.role', '角色')">
            <div v-if="info.data.role.length > 0" style="margin-left: 20px">
              <el-tag
                v-for="item in info.data.role"
                :key="item"
                closable
                @close="closeRole(item)"
              >
                {{ item['name'] }}
              </el-tag>
            </div>
            <ab-cust-dialog
              v-model="info.data.role"
              dialog-key="roleSelector"
              :icon="Search"
              round
              size="small"
              style="margin-left: 10px"
              type="primary"
            >
              {{ $abT('page.common.select','选择') }}
            </ab-cust-dialog>
          </el-form-item>
          <el-form-item :label="$abT('page.common.group', '组织')">
            <div v-if="info.data.org.length > 0" style="margin-left: 20px">
              <el-tag
                v-for="item in info.data.org"
                :key="item"
                closable
                @close="closeOrg(item)"
              >
                {{ item['name'] }}
              </el-tag>
            </div>
            <ab-cust-dialog
              v-model="info.data.org"
              dialog-key="orgSelector"
              :icon="Search"
              round
              size="small"
              style="margin-left: 10px"
              type="primary"
            >
              {{ $abT('page.common.select','选择') }}
            </ab-cust-dialog>
          </el-form-item>
          <el-form-item :label="$abT('page.common.post', '岗位')">
            <div v-if="info.data.post.length > 0" style="margin-left: 20px">
              <el-tag
                v-for="item in info.data.post"
                :key="item"
                closable
                @close="closePost(item)"
              >
                {{ item['name'] }}
              </el-tag>
            </div>
            <ab-cust-dialog
              v-model="info.data.post"
              dialog-key="postSelector"
              :icon="Search"
              round
              size="small"
              style="margin-left: 10px"
              type="primary"
              :value-mapping="{ key: 'id', name: 'name' }"
            >
              {{ $abT('page.common.select','选择') }}
            </ab-cust-dialog>
          </el-form-item>
          <el-form-item
            :label="$abT('page.common.currentOrg', '当前组织(含下级)')"
          >
            <div
              v-if="info.data.currentOrg?.length > 0"
              style="margin-left: 20px"
            >
              <el-tag
                v-for="item in info.data.currentOrg"
                :key="item"
                closable
                @close="closeCurrentOrg(item)"
              >
                {{ item['name'] }}
              </el-tag>
            </div>
            <ab-cust-dialog
              v-model="info.data.currentOrg"
              dialog-key="orgSelector"
              :icon="Search"
              round
              size="small"
              style="margin-left: 10px"
              type="primary"
            >
              {{ $abT('page.common.select','选择') }}
            </ab-cust-dialog>
          </el-form-item>
        </v-if>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-space wrap>
            <el-button text type="primary" @click="info.dialogVisible = false">
              {{ $abT('page.common.cancel','取消') }}
            </el-button>
            <el-button
              :loading="info.saveLoading"
              type="primary"
              @click="saveSubmit(authorizationFormRef)"
            >
              {{
                props.saveFlsg
                  ? $abT('page.common.save', '保存')
                  : $abT('page.common.ok', '确定')
              }}
            </el-button>
          </el-space>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  export default { name: 'AbAuthorization' }
</script>
<script lang="ts" setup>
  import { abT } from '@/i18n'
  import { sysApi } from '@agilebpm/api'
  import { ElMessage, FormInstance } from 'element-plus'

  import { Search } from '@element-plus/icons-vue'

  //监听父组件传入的值
  const props = defineProps({
    //是否打开授权窗口
    modelValue: {
      type: Boolean,
      default: false,
    },
    //列表中的选中数据的编码/key/code
    rightsCode: {
      type: String,
      default: null,
    },
    //保存的模块类型
    authorizationType: {
      type: String,
      default: null,
    },
    //是否自动保存
    saveFlsg: {
      type: Boolean,
      default: true,
    },
    //默认打开展示的授权集合
    authorizationList: {
      type: Array,
      default: [] as any,
    },
  })

  //提交按钮所需的ref变量
  const authorizationFormRef = ref<FormInstance>()

  //常用变量
  const info = reactive({
    //是否打开对话框
    dialogVisible: false,
    //加载图标的展示
    loading: false,
    //保存中图标的展示
    saveLoading: false,
    //授权是否是所有人的标记
    all: true,
    //保存授权需要转换成的参数对象
    authorization: {
      rightsTarget: '',
      rightsObject: '',
      authorizationList: [] as Array<{
        rightsType: string
        rightsIdentity: string
        rightsIdentityName: string
      }>,
    },
    //获取授权后需要转换成的页面对象
    data: {
      user: [] as string[],
      role: [] as string[],
      post: [] as string[],
      org: [] as string[],
      currentOrg: [] as string[],
    },
  })

  //清除之前残留的数据
  const clearOldData = () => {
    info.data.user = []
    info.data.role = []
    info.data.post = []
    info.data.org = []
    info.data.currentOrg = []
  }

  //声明事件
  const emit = defineEmits(['update:modelValue', 'authorizationData'])

  //关闭对话框后,同步关闭标记父组件
  watch(
    () => info.dialogVisible,
    () => emit('update:modelValue', info.dialogVisible)
  )

  //监听选中的数据，并修改成请求参数的格式
  watch(info.data, () => {
    info.authorization.authorizationList = []
    for (const key in info.data)
      for (const i in info.data[key]) {
        if (!info.data[key][i].id) {
          alert(
            `error：identityType: ${key} - 选择数据的 id 为空，请检查对话框配置`
          )
          return
        }

        info.authorization.authorizationList.push({
          rightsType: key,
          rightsIdentity: info.data[key][i].id,
          rightsIdentityName: info.data[key][i].name,
        })
      }
  })

  //监听父组件传入的参数,并执行操作
  watch(
    () => props.modelValue,
    () => {
      clearOldData()
      info.dialogVisible = props.modelValue
      if (info.dialogVisible && props.authorizationType) {
        info.loading = true
        info.authorization.rightsTarget = props.rightsCode
        info.authorization.rightsObject = props.authorizationType
        for (const i in info.data) info.data[i] = []
        sysApi.sysAuthorization
          .getAuthorization(info.authorization)
          .then((rel) => {
            let relsult = rel.data
            if (!props.saveFlsg) {
              relsult = props.authorizationList
            }
            info.all = false
            for (const i in relsult)
              for (const key in info.data) {
                if (relsult[i].rightsType == 'all') {
                  info.all = true
                }
                if (relsult[i].rightsType == key)
                  info.data[key].push({
                    id: relsult[i].rightsIdentity,
                    name: relsult[i].rightsIdentityName,
                  })
              }
            info.loading = false
          })
      }
    }
  )

  //保存授权
  const saveSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
      if (valid) {
        info.loading = true
        info.saveLoading = true
        if (info.all) {
          info.authorization.authorizationList = [
            {
              rightsType: 'all',
              rightsIdentity: 'user',
              rightsIdentityName: '所有人',
            },
          ]
        }
        if (props.saveFlsg) {
          sysApi.sysAuthorization
            .saveAuthorization(info.authorization)
            .then((rel) => {
              ElMessage({
                showClose: true,
                message: abT('page.common.operateSuccess', '操作成功'),
                type: 'success',
              })
              info.loading = false
              info.dialogVisible = false
              info.saveLoading = false
            })
            .catch(() => (info.saveLoading = false))
        } else {
          emit('authorizationData', info.authorization.authorizationList)
          info.loading = false
          info.saveLoading = false
          info.dialogVisible = false
        }
        info.authorization.authorizationList = []
      }
    })
  }

  //用户角色岗位组织选中的集合标签点击关闭后,同步删除对应的数据
  const closeUser = (item: string) =>
    info.data.user.splice(info.data.user.indexOf(item), 1)

  const closeRole = (item: string) =>
    info.data.role.splice(info.data.role.indexOf(item), 1)

  const closePost = (item: string) =>
    info.data.post.splice(info.data.post.indexOf(item), 1)

  const closeOrg = (item: string) =>
    info.data.org.splice(info.data.org.indexOf(item), 1)

  const closeCurrentOrg = (item: string) =>
    info.data.currentOrg.splice(info.data.currentOrg.indexOf(item), 1)
</script>
