<template>
  <el-tag
    v-for="(user, index) in info.userList"
    :key="index"
    closable
    style="margin-right: 10px"
    @close="closeUserTag(index)"
  >
    {{ user.name }}
  </el-tag>
  <el-tag v-if="info.userList.length === 0" type="warning">
    {{ $abT('page.common.notSelect', '未选择') }}
  </el-tag>
  <ab-cust-dialog
    v-model="info.userList"
    :dialog-key="props.dialogKey"
    :dialog-setting="{ multiple: props.isMultiple ? 1 : 0 }"
    :icon="Search"
    size="small"
    style="margin-left: 5px"
    type="primary"
    @ok="chooseUser"
  >
    {{ $abT('page.common.personnelSelection', '人员选择') }}
  </ab-cust-dialog>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { Search } from '@element-plus/icons-vue'

  const props = defineProps({
    modelValue: { type: Object, required: true, default: null },
    isMultiple: { required: false, type: Boolean, default: false },
    dialogKey: { type: String, required: false, default: 'userSelector' },
  })
  const emit = defineEmits(['update:modelValue'])

  const info: any = reactive({
    viewValue: '',
    userList: [],
  })

  //用户选择
  const chooseUser = (list: any) => {
    if (!list && list.length == 0) {
      return
    }
    const users = []
    const userNames = []
    for (const index in list) {
      userNames.push(list[index].name)
      users.push({
        id: list[index].id,
        name: list[index].name,
        type: 'user',
      })
    }
    info.viewValue = userNames.join(',')
    emit('update:modelValue', users)
  }

  //用户选择
  const closeUserTag = (index: number) => {
    info.userList.splice(index, 1)
    emit('update:modelValue', info.userList)
  }
</script>
