<template>
  <el-container class="layout-container-demo">
    <el-header>
      <el-button type="primary" @click="editHandover">
        {{ $abT('page.common.save', '保存') }}
      </el-button>
      <el-button @click="goBack">
        {{ $abT('page.common.back', '返回') }}
      </el-button>
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          :model="info.data"
          label-position="right"
          label-width="auto"
        >
          <el-form-item
            :label="$abT('page.workHandover.handoverPersonnel', '交接人员')"
            :rules="[
              { required: true, message: $abT('page.common.required', '必填') },
            ]"
          >
            <el-tag v-if="info.userName" type="success">
              {{ info.userName }}
            </el-tag>
            <el-tag v-else type="warning">
              {{ $abT('page.common.notSelect', '未选择') }}
            </el-tag>

            <ab-cust-dialog
              v-if="!proxy.$route.query.userId"
              v-model="info.handoverUser"
              dialog-key="userSelector"
              :dialog-setting="{ multiple: 0 }"
              size="small"
              style="margin-left: 10px"
              type="primary"
              :value-mapping="{ id: 'userId', name: 'userName' }"
            >
              {{ `${abT('page.common.choose', '请选择')} ` }}
            </ab-cust-dialog>
          </el-form-item>

          <el-form-item
            :label="$abT('page.workHandover.receivingPersonnel', '接收人员')"
            :rules="[
              { required: true, message: $abT('page.common.required', '必填') },
            ]"
          >
            <el-tag v-if="info.receiverList.length === 0" type="warning">
              {{ $abT('page.common.notSelect', '未选择') }}
            </el-tag>
            <el-tag
              v-for="(receiver, index) in info.receiverList"
              :key="index"
              closable
              type="success"
              @close="deletefn(index)"
            >
              {{ receiver.receiveUserName }}
            </el-tag>
            <ab-cust-dialog
              v-model="info.receiverList"
              dialog-key="userSelector"
              :dialog-setting="{ multiple: 1 }"
              size="small"
              style="margin-left: 10px"
              type="primary"
              :value-mapping="{ id: 'receiveUserId', name: 'receiveUserName' }"
            >
              {{ `${abT('page.common.choose', '请选择')} ` }}
            </ab-cust-dialog>
          </el-form-item>
          <el-form-item :label="$abT('page.common.remark', '备注')" prop="desc">
            <el-input
              v-model="info.desc"
              :placeholder="`${abT('abform.placeholderPre', '请输入')} ${abT(
                'page.common.remark',
                '备注'
              )}`"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { sysApi, abTools } from '~/agilebpm'
  import { abT } from '@/i18n'

  const formRef = ref()
  const info: any = reactive({
    userId: '',
    userName: '',
    receiverList: [] as any[],
    handoverUser: {},
    desc: '',
  })
  const { proxy } = abTools.useCurrentInstance()
  info.userId = proxy.$route.query.userId

  const deletefn = (index: number) => {
    info.receiverList.splice(index, 1)
  }

  const editHandover = () => {
    const receiverIds = [] as string[]

    let userId = info.userId
    let userName = info.userName
    if (!userId) {
      userId = info.handoverUser.userId
      userName = info.handoverUser.userName
    }

    if (!userId) {
      ElMessage.error('请选择交接人员')
      return
    }

    if (info.receiverList.length === 0) {
      ElMessage.error('请选择接收人员')
      return
    }

    const userIndex = info.receiverList.findIndex((e: any) => {
      return userId == e.receiveUserId
    })

    if (userIndex > -1) {
      ElMessage.warning(`${userName}是交接人员，不可再作为接收人员！`)
      return
    }

    info.receiverList.forEach((e: any) => {
      receiverIds.push(e.receiveUserId)
    })

    const param = {
      userId: userId,
      receiveUserId: receiverIds,
      desc: info.desc,
    }

    sysApi.workHandover.edit(param).then((res: any) => {
      if (res.isOk) {
        ElMessage.success(res.msg)
        goBack()
      }
    })
  }

  const getReceiverList = (userId: string) => {
    sysApi.workHandover.getReceiverList(info.userId).then((res: any) => {
      if (res.isOk && res.data) {
        info.receiverList = res.data
        info.userName = res.data[0].handoverUserName
        info.desc = res.data[0].desc
      }
    })
  }

  if (info.userId) {
    getReceiverList(info.userId)
  }

  watch(
    () => info.handoverUser.userId,
    (newValue: string) => {
      if (newValue) {
        info.userId = newValue
        info.userName = info.handoverUser.userName
        getReceiverList(info.userId)
      }
    }
  )

  const goBack = () => {
    abTools.closeTab(proxy.$route.fullPath)
    proxy.$router ? proxy.$router.back() : window.history.back()
  }
</script>
