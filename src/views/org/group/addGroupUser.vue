<template>
  <el-dialog v-model="info.show" :title="$abT('page.groupList.orgPostAllocation','组织岗位分配')" width="40%">
    <el-form ref="groupForm" :label-width="100" :model="info.group"  label-suffix="：">
      <el-form-item :label="$abT('page.common.group','组织')" prop="group.name">
        {{ info.group.name }}
      </el-form-item>
      <el-form-item
        :label="$abT('page.groupList.orgUser','用户')"
        prop="name"
        :rules="{ required: true, message: $abT('rules.required','必填'), trigger: 'blur' }"
      >
        <el-tag
          v-for="(item, index) in info.userList"
          :key="index"
          :closable="true"
          :name="index"
          @close="delectGroupUserList(index)"
        >
          {{ item.name }}
        </el-tag>

        <ab-cust-dialog
          v-model="info.userList"
          dialog-key="userSelector"
          :param="{}"
          size="small"
          style="margin-left: 3px"
          @ok="pushGroupUserList"
        >
          {{ $abT('page.common.select','选择') }}
        </ab-cust-dialog>
      </el-form-item>
      <el-form-item :label="$abT('page.common.post','岗位')" prop="roleIds">
        <el-checkbox-group v-model="info.group.roleIds">
          <el-checkbox
            v-for="item in info.postList"
            :key="item.key"
            :label="item.key"
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
        <el-button text type="primary" @click="info.show = false">
           {{ $abT('page.common.cancel','取消') }}
        </el-button>
        <el-button type="primary" @click="saveOrgPostFn()">{{ $abT('page.common.ok','确定') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, defineProps, defineEmits } from 'vue'
  import { orgApi, abUtil, abTools, getData } from '~/agilebpm'
  import { WarningFilled } from '@element-plus/icons-vue'

  const props = defineProps({
    showDialog: {
      type: Boolean,
      required: true,
    },
    currentOrg: {
      type: Object,
      required: true,
    },
  })
  const emit = defineEmits(['reSearch'])
  const { proxy } = abTools.useCurrentInstance()
  const info: any = reactive({
    group: {
      groupId: '',
      name: '',
      userIds: [],
      userNames: [],
      roleIds: [],
    },
    roleId: '',
    postList: [],
    userList: [],
    show: false,
  })

  //删除用户方法
  const delectGroupUserList = (index: number) => {
    abUtil.Arrays.del(index, info.group.userIds)
    abUtil.Arrays.del(index, info.group.userNames)
    abUtil.Arrays.del(index, info.userList)
  }

  //添加用户方法
  const pushGroupUserList = (dataArr: any[]) => {
    if (!dataArr) return
    if (!info.group) {
      info.group.userIds = []
      info.group.userNames = []
    }
    info.group.userNames.splice(0)
    info.group.userIds.splice(0)
    dataArr.forEach((item: any) => {
      info.group.userIds.push(item.id)
      info.group.userNames.push(item.name)
    })
  }

  const saveOrgPostFn = () => {
    orgApi.post.saveOrgPost(info.group).then((result) => {
      if (result.isOk) {
        info.show = false
        emit('reSearch')
      }
    })
  }

  onMounted(() => {
    if (props.currentOrg) {
      info.group.groupId = props.currentOrg.id
      info.group.name = props.currentOrg.name
    }
  })

  watch(
    () => props.currentOrg.id,
    (id) => {
      if (!id) return
      info.group.groupId = props.currentOrg.id
      info.group.name = props.currentOrg.name
    }
  )
  watch(
    () => props.showDialog,
    (showDialog) => {
      if (showDialog) {
        info.postList.splice(0)
        info.group.userNames.splice(0)
        info.group.userIds.splice(0)
        info.group.roleIds.splice(0)
        info.userList.splice(0)
        if (info.group.groupId) {
          getData(orgApi.post.getOrgPostUrl + info.group.groupId).then(
            (result) => {
              if (result.isOk && result.data.length > 0) {
                /*   let defaultType = []*/
                for (const index in result.data) {
                  info.postList.push({
                    key: result.data[index].roleId,
                    text: result.data[index].roleName,
                  })
                  /* if (result[index].isDefault) {
                        defaultType.push(result[index].type)
                      }*/
                }
                /*   info.selectValue = defaultType.join(',')*/
              }
            }
          )
        }
        info.show = true
      }
    }
  )
</script>
