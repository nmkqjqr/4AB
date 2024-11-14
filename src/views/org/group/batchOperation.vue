<template>
  <el-container class="layout-container-demo">
    <el-main>
      <el-tabs v-model="info.tabName" class="demo-tabs">
          <el-tab-pane   name="groupRole"    :label="$abT('page.groupList.addOrgPost','添加组织岗位')" >
            <batchAddGroupRole
              :group-role-type="info.tabName" >
            </batchAddGroupRole>
          </el-tab-pane>

          <el-tab-pane   name="userRole"    :label="$abT('page.groupList.addRoleUsers','添加角色用户')">
            <batchAddUserRole
              :role-user-type="info.tabName">
            </batchAddUserRole>
          </el-tab-pane>
      </el-tabs>
    </el-main>

  </el-container>
</template>

<script setup lang="ts">
import batchAddGroupRole from '@/views/org/group/components/batchAddGroupRole.vue'
import batchAddUserRole from '@/views/org/group/components/batchAddUserRole.vue'

const info: any = reactive({
  tabName: 'groupRole'
})


</script>
