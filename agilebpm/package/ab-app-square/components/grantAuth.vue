<template>
  <el-space wrap>
    <el-button
      type="primary"
      v-if="showButton"
      text
      @click="openAuthDialog(auth)"
    >
      设置成员
    </el-button>
    <el-tag
      v-for="(identite, index2) in info.selectedIdentity"
      :key="index2"
      type="success"
    >
      {{ handleIdentityName(identite) }}
    </el-tag>
  </el-space>
  <el-dialog
    v-model="info.showAuthDialog"
    title="授权"
    width="50%"
    destroy-on-close
    @close="cancleAuthDialog"
  >
    <div style="margin-bottom: 20px">
      <label>全部：</label>
      <el-switch
        v-model="info.identityAll"
        :active-value="true"
        :inactive-value="false"
        style="margin-left: 20px"
      />
    </div>
    <el-row
      v-for="(item, index) in info.identityData"
      style="margin-bottom: 20px"
    >
      <el-col :span="2">{{ item.typeName }}</el-col>
      <el-col :span="22">
        <el-space wrap>
          <el-tag
            v-if="!info.identityAll"
            v-for="(identite, index3) in item.selected"
            :key="index3"
            closable
            @close="deleteIdentites(item, index3)"
          >
            {{ identite['name'] }}
          </el-tag>

          <ab-cust-dialog
            v-model="item.selected"
            :dialog-key="item.operate"
            :icon="Search"
            style="margin-left: 10px"
            :disabled="info.identityAll"
            type="primary"
            round
            :value-mapping="{ name: 'name', id: 'id' }"
            :dialog-setting="{ multiple: 1 }"
            size="small"
          >
            选择
          </ab-cust-dialog>
        </el-space>
      </el-col>
    </el-row>
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
  import { authorisation } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-authGroup'
  import { ElMessage } from 'element-plus'
  import { abT } from '@/i18n'
  import { Search } from '@element-plus/icons-vue'

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
    showButton: { type: Boolean, default: false },
  })

  const { authGroup } = toRefs(props)

  const info = reactive({
    showAuthDialog: false,
    identityData: [] as any[],
    currentAuthId: null,
    identityAll: false,
    selectedIdentity: [] as any[],
  })

  const initIdentityData = () => {
    return [
      {
        type: 'user',
        typeName: '用户',
        operate: 'userSelector',
        selected: [],
      },
      {
        type: 'role',
        typeName: '角色',
        operate: 'roleSelector',
        selected: [],
      },
      {
        type: 'org',
        typeName: '组织',
        operate: 'orgSelector',
        selected: [],
      },
      {
        type: 'post',
        typeName: '岗位',
        operate: 'postSelector',
        selected: [],
      },
    ]
  }

  const deleteIdentites = (identity: any, index: number) => {
    identity.selected.splice(index, 1)
  }

  const initSelectIdentityData = () => {
    info.selectedIdentity.splice(0, info.selectedIdentity.length)
    if (props.authGroup.rights && props.authGroup.rights.length > 0) {
      props.authGroup.rights.forEach((right) => {
        info.selectedIdentity.push({
          id: right.rightsIdentity,
          name: right.rightsIdentityName,
          type: right.rightsType,
        })
        if (right.rightsType == 'all') {
          info.identityAll = true
        } else {
          info.identityData.forEach((item) => {
            if (item.type == right.rightsType) {
              item.selected.push({
                id: right.rightsIdentity,
                name: right.rightsIdentityName,
                type: right.rightsType,
              })
            }
          })
        }
      })
    }
  }

  onMounted(() => {
    info.identityData = initIdentityData()
    initSelectIdentityData()
  })

  const openAuthDialog = () => {
    info.showAuthDialog = true
    info.identityData = initIdentityData()
    initSelectIdentityData()
  }

  const cancleAuthDialog = () => {
    info.identityData = []
    info.showAuthDialog = false
    info.identityAll = false
  }

  const authDialogOk = () => {
    const identites = []
    if (info.identityAll) {
      identites.push({
        id: 'user',
        name: '所有人',
        type: 'all',
      })
    } else {
      info.identityData.forEach((item) => {
        if (item.selected.length > 0) {
          item.selected.forEach((selected) => {
            identites.push({
              id: selected.id,
              name: selected.name,
              type: item.type,
            })
          })
        }
      })
    }
    info.selectedIdentity = identites
    if (props.saveData && props.authGroup.id) {
      authorisation(props.authGroup.id, identites).then((res) => {
        if (res.isOk) {
          info.showAuthDialog = false
          emit('grantSuccess')
        }
      })
    } else if (!props.saveData) {
      authGroup.value.identities = identites
      info.showAuthDialog = false
    }
  }

  const handleIdentityName = (sysIdentity: any) => {
    if (sysIdentity.type == 'post') {
      return `[岗位]${sysIdentity.name}`
    }
    if (sysIdentity.type == 'user') {
      return `[用户]${sysIdentity.name}`
    }
    if (sysIdentity.type == 'org') {
      return `[组织]${sysIdentity.name}`
    }
    if (sysIdentity.type == 'role') {
      return `[角色]${sysIdentity.name}`
    }
    return sysIdentity.name
  }
</script>
