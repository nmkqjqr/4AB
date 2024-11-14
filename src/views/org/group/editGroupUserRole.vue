<template>
  <el-dialog v-model="info.showDialog" :title="$abT('page.groupList.editUserPost','编辑用户岗位')" width="40%">
    <el-form ref="groupUserRoleForm" :label-width="100" :model="info.groupUserRol"  label-suffix="：">
      <el-form-item  :label="$abT('page.userList.fullname','姓名')" prop="userFullname">
        {{ info.groupUserRol.userFullname }}
      </el-form-item>

      <el-form-item :label="$abT('page.userList.account','账户')" prop="userAccount">
        {{ info.groupUserRol.userAccount }}
      </el-form-item>

      <el-form-item :label="$abT('page.common.group','组织')" prop="groupName">
        {{ info.groupUserRol.groupName }}
      </el-form-item>

      <el-form-item :label="$abT('page.common.post','岗位')" >
        <el-checkbox-group v-model="info.groupUserRole.roleIds">
          <el-checkbox
            v-for="item in info.postList"
            :key="item.key"
            :label="item.key"
            :checked="item.isCheck"
          >
            {{ item.text }}
          </el-checkbox>
        </el-checkbox-group>
        <el-tooltip class="box-item" effect="light" placement="right-start">
          <template #content>
            {{ $abT('page.groupList.addPostUserTips1','组织下的岗位，可以在编辑组织的时候定义，') }}
            <br />
            {{ $abT('page.groupList.addPostUserTips2','可以绑定用户到部门岗位，') }}
            <br />
            {{ $abT('page.groupList.addPostUserTips3','若不选择岗位、默认添加至该部门下') }}
          </template>
          <el-icon color="#409EFF" size="20" style="margin-left: 12px">
            <WarningFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>


    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :text="true" type="primary" @click="info.showDialog = false">
          {{ $abT('page.common.cancel','取消') }}
        </el-button>
        <el-button type="primary" @click="saveOrgPostFn()">{{ $abT('page.common.ok','确定') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {abT} from "@/i18n";
import { reactive, defineProps, defineEmits } from 'vue'
import { orgApi, abTools, getData } from '~/agilebpm'
import {ElMessage, ElMessageBox} from 'element-plus';
const props = defineProps({
  showDialog: {
    type: Boolean,
    required: true,
  },
  currentRel: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['reSearch'])


const info: any = reactive({
  groupUserRol: {},
  showDialog: false,
  postList: [],
  roleIds:[],
  groupUserRole: {
    groupId: '',
    userId: '',
    isMaster: 1,
    status: 1,
    roleIds: [],
  },
})



const saveOrgPostFn = () => {
  orgApi.group.saveGroupUserRole(info.groupUserRole).then(
        (result: any) => {
          if (result.isOk){
            ElMessage({
              type: 'success',
              message: result.msg ||  abT('page.common.operateSuccess','操作成功'),
              onClose: () => {},
            })
          }
          emit('reSearch')
          info.showDialog = false
        }
  )
  info.roleIds = info.groupUserRole.roleIds
}



watch(
  () => props.currentRel,
  (currentRel) => {
    if (currentRel) {
      info.groupUserRole.roleIds.splice(0)
      info.roleIds.splice(0)
      info.groupUserRol = props.currentRel
      info.groupUserRole.groupId = props.currentRel.groupId
      info.groupUserRole.userId = props.currentRel.userId
      info.groupUserRole.isMaster = props.currentRel.isMaster
      info.groupUserRole.status = props.currentRel.status
      if (props.currentRel.groupUserRoles.length>0){
        props.currentRel.groupUserRoles.forEach((item: any) => {
          info.roleIds.push(item.roleId)
        })
      }
    }
  }
)


watch(
  () => props.showDialog,
  (showDialog) => {
    if (showDialog) {
      info.postList.splice(0)
      if (props.currentRel.groupId) {
        getData(orgApi.post.getOrgPostUrl + props.currentRel.groupId).then(
          (result) => {
            if (result.isOk && result.data.length > 0) {
              for (const index in result.data) {
                info.postList.push({
                  isCheck: info.roleIds.indexOf(result.data[index].roleId) > -1,
                  key: result.data[index].roleId,
                  text: result.data[index].roleName,
                })
              }

            }
          }
        )
      }
      info.showDialog = true
    }
  }
)
</script>
