<template>
      <ab-save
        v-ab-btn-rights:batchSave
        :after-save-fn="saveAfter"
        :back-btn="false"
        back-name="groupRelBatchSave"
        :before-save-fn="handleBeforeSaveFn"
        :form-ref="formRef"
        :save-data="info.initData"
        :url="orgApi.post.groupBatchSaveUrl"
      />

    <el-main>
      <el-form
        ref="formRef"
        label-suffix="："
        label-width="120px"
        :model="info.orgRelationList"
        :status-icon="true"
      >
        <el-form-item :label="$abT('page.groupList.selectRole','选择角色')">
          <div>
            <el-tag
              v-for="(relation, index) in info.orgRelationList"
              v-show="relation.type === 'role'"
              :key="index"
              :closable="true"
              @close="deleteRel(index)"
            >
              {{ relation.name }}
            </el-tag>
          </div>
          <div  style="display: block;">
            <ab-cust-dialog
              v-model="info.orgRoleList"
              dialog-key="roleSelector"
              :param="{}"
              size="small"
              style="margin-left: 5px"
            >
              {{ $abT('page.common.select','选择') }}
            </ab-cust-dialog>
          </div>
        </el-form-item>

        <el-form-item :label="$abT('page.groupList.selectUser','选择用户')">
          <div>
            <el-tag
              v-for="(relation, index) in info.orgRelationList"
              v-show="relation.type === 'user'"
              :key="index"
              :closable="true"
              @close="deleteRel(index)"
            >
              {{ relation.name }}
            </el-tag>
          </div>
          <div  style="display: block;">
            <ab-cust-dialog
              v-model="info.orgUserList"
              dialog-key="userSelector"
              :param="{}"
              size="small"
              style="margin-left: 5px"
            >
              {{ $abT('page.common.select','选择') }}
            </ab-cust-dialog>
          </div>
        </el-form-item>
      </el-form>

    </el-main>


</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { abUtil,orgApi} from '~/agilebpm'
import { ElMessage } from 'element-plus'
import {abT} from "@/i18n";

const props = defineProps({
  roleUserType: {
    type: String,
    required: true,
    default: 'userRole',
  },
})
const formRef = ref()
const info: any = reactive({
  initData: {
    roleIds: '',
    strIds: '',
    operationType: 'userRole'
  },
  roleId: [],
  userId: [],
  orgRelationList:[],
  orgRoleList: [],
  orgUserList: [],
})

const deleteRel = (index: number) =>{
  abUtil.Arrays.del(index, info.orgRelationList)
  info.initData.roleIds = ''
  info.initData.strIds = ''
  info.roleId.splice(0)
  info.userId.splice(0)
  info.orgRoleList.splice(0)
  info.orgUserList.splice(0)
}

const pushRelationList = (dataArr: any[], type: string) => {
  if (!dataArr) return
  if (!info.orgRelationList) {
    info.orgRelationList = []
  }
  dataArr.forEach((item: any) => {
    //校验是否重复存在
    for (let i = 0, relation; (relation = info.orgRelationList[i++]); ) {
      if (relation.id === item.id) {
        if (type === 'role' || type === 'user') {
          return
        }
      }
    }
    info.orgRelationList.push({
      type: type,
      id: item.id,
      name: item.name,
    })
  })
}

const handleBeforeSaveFn = () => {
  if (info.orgRelationList.length == 0) {
    ElMessage({
      type: 'error',
      message: abT('page.groupList.pleaseSelectRoleUser','请选择角色用户'),
    })
    return false
  }
  info.orgRelationList.forEach((item: any) => {
    if (item.type === 'role') {
      if (info.roleId.indexOf(item.id) === -1){
        info.roleId.push(item.id)
      }
    }
    if (item.type === 'user') {
      if ( info.userId.indexOf(item.id) === -1){
        info.userId.push(item.id)
      }
    }
  })
  if (info.roleId.length >0){
    info.initData.roleIds = info.roleId.join(',')
  }
  if(info.userId.length >0){
    info.initData.strIds = info.userId.join(',')
  }


  if (info.initData.roleIds.length == 0){
    ElMessage({
      type: 'error',
      message: abT('page.groupList.pleaseSelectRole','请选择角色'),
    })
    return  false
  }
  if (info.initData.strIds.length == 0 ){
    ElMessage({
      type: 'error',
      message: abT('page.groupList.pleaseSelectUser','请选择用户'),
    })
    return  false
  }
}

const  cleanData = () =>{
  info.initData.roleIds = ''
  info.initData.strIds = ''
  info.roleId.splice(0)
  info.userId.splice(0)
  info.orgRelationList.splice(0)
  info.orgRoleList.splice(0)
  info.orgUserList.splice(0)
}

const saveAfter = () => {
  cleanData()
}

watch(
  () => info.orgRoleList,
  (val: any) => {
    if (val) {
      pushRelationList(val, 'role')
    }
    info.orgRoleList.splice(0)
  }
)

watch(
  () => info.orgUserList,
  (val: any) => {
    if (val) {
      pushRelationList(val, 'user')
    }
    info.orgUserList.splice(0)
  }
)


watch(
  () => props.roleUserType,
  () => {
    cleanData()
  }
)

</script>
