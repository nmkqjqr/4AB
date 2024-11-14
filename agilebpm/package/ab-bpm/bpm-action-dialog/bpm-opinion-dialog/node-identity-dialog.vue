<template>
  <el-space>
    <el-radio-group
      v-model="pageData.nodeInfo.identityType"
      @change="dialogChange()"
    >
      <el-radio-button label="user">
        {{ $abT('page.groupList.orgUser', '用户') }}
      </el-radio-button>
      <el-radio-button label="org">
        {{ $abT('page.common.group', '组织') }}
      </el-radio-button>
      <el-radio-button label="role">
        {{ $abT('page.common.role', '角色') }}
      </el-radio-button>
      <el-radio-button label="post">
        {{ $abT('page.common.post', '岗位') }}
      </el-radio-button>
    </el-radio-group>
    <ab-cust-dialog
      :dialog-key="pageData.nodeInfo.dialogKey"
      style="margin-left: 10px"
      type="primary"
      @ok="setIdentites"
    >
      {{ pageData.nodeInfo.dialogButtonDesc }}
    </ab-cust-dialog>
  </el-space>
  <p m="t-0 b-2">
    {{ $abT('bpm.office.selectedCandidates', '已选候选人：') }}
    <el-tag
      v-for="(identity, index) in pageData.nodeInfo.identites"
      :key="index"
      closable
      @close="deleteIdentites(index)"
    >
      {{ identity.assign }}
    </el-tag>
  </p>
</template>

<script lang="ts" setup>
  import { abT } from '@/i18n'
  const props = defineProps({
    modelValue: {
      type: Array,
      required: true,
    },
    taskNode: {
      type: Object,
      required: true,
    },
  })

  const pageData = reactive({
    groupDataCache: [] as any[],
    nodeInfo: {} as any,
  })

  const emit = defineEmits(['update:modelValue'])

  const dialogChange = () => {
    if (pageData.nodeInfo.identityType == 'user') {
      pageData.nodeInfo.identityTypeDesc = abT('page.groupList.orgUser', '用户')
      pageData.nodeInfo.dialogKey = 'userSelector'
      pageData.nodeInfo.dialogButtonDesc = abT(
        'page.groupList.pleaseSelectUser',
        '请选择用户'
      )
    }
    if (pageData.nodeInfo.identityType == 'post') {
      pageData.nodeInfo.identityTypeDesc = abT('page.common.post', '岗位')
      pageData.nodeInfo.dialogKey = 'postSelector'
      pageData.nodeInfo.dialogButtonDesc = abT(
        'page.common.selectPost',
        '请选择岗位'
      )
    }
    if (pageData.nodeInfo.identityType == 'org') {
      pageData.nodeInfo.identityTypeDesc = abT('page.common.group', '组织')
      pageData.nodeInfo.dialogKey = 'orgSelector'
      pageData.nodeInfo.dialogButtonDesc = abT(
        'page.groupList.pleaseSelectOrgRole',
        '请选择组织角色'
      )
    }
    if (pageData.nodeInfo.identityType == 'role') {
      pageData.nodeInfo.identityTypeDesc = abT('page.common.role', '角色')
      pageData.nodeInfo.dialogButtonDesc = abT(
        'page.groupList.pleaseSelectRole',
        '请选择角色'
      )
      pageData.nodeInfo.dialogKey = 'roleSelector'
    }
  }

  const setIdentites = (list: any) => {
    if (!list || list.length < 1) {
      return
    }
    list.forEach((item: any) => {
      // 去重
      const ident = pageData.nodeInfo.identites.find((ident: any) => {
        return (
          `${item.id}${pageData.nodeInfo.identityType}` ===
          `${ident.id}${ident.type}`
        )
      })
      if (!ident) {
        pageData.nodeInfo.identites.push({
          id: item.id,
          name: item.name,
          type: pageData.nodeInfo.identityType,
          assign: `(${pageData.nodeInfo.identityTypeDesc})${item.name}`,
        })
      }
    })
    emit('update:modelValue', pageData.nodeInfo.identites)
  }

  const deleteIdentites = (index: number) => {
    pageData.nodeInfo.identites.splice(index, 1)
    emit('update:modelValue', pageData.nodeInfo.identites)
  }

  onMounted(() => {
    //数据初始化
    pageData.nodeInfo.identityType = 'user'
    pageData.nodeInfo.identityTypeDesc = abT('page.groupList.orgUser', '用户')
    pageData.nodeInfo.dialogKey = 'userSelector'
    pageData.nodeInfo.dialogButtonDesc = abT(
      'page.groupList.pleaseSelectUser',
      '请选择用户'
    )
    pageData.nodeInfo.identites = [] as any[]
  })
</script>

<style></style>
