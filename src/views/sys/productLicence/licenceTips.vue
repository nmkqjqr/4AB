<template>
  <div>
    <el-dialog
      v-model="info.advanceDialogVisible"
      center
      title="产品授权到期提醒"
      width="20%"
    >
      <span>您的产品授权即将到期，请联系管理员</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="info.licence.confirmOk">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { sysApi, abUtil } from '~/agilebpm'

  const name = 'LicenceTips'

  const props = defineProps({
    globalWaterMark: { type: Object, required: true },
  })

  const { globalWaterMark } = toRefs(props)

  const info = reactive({
    advanceDialogVisible: false,
    licence: {
      isExpire: false,
      waterMark: '',
      okFlag: '0918d580265c14f56f304326115f3b8d',
      showDialog() {
        if (!sessionStorage.getItem(info.licence.okFlag)) {
          info.advanceDialogVisible = true
        }
      },
      confirmOk() {
        info.advanceDialogVisible = false
        sessionStorage.setItem(
          info.licence.okFlag,
          new Date().getTime().toString()
        )
      },
    },
  })

  const showWaterMark = () => {
    let text = ''
    if (info.licence?.isExpire) {
      text = '产品授权已过期，请联系管理员'
    } else if (info.licence.waterMark) {
      text = info.licence.waterMark
    }

    if (text) {
      globalWaterMark.value.text = text
      globalWaterMark.value.visible = true
    }
  }

  onMounted(() => checkLicenceStatus())

  const startCheckLicenceInterval = () => {
    let retryCount = 0
    const checkAbPast = () => {
      if (window['abPast']) {
        info.licence.isExpire = true
      }
      retryCount++
      // 未过期超过检查次数跳出
      if (info.licence.isExpire || retryCount > 15) {
        showWaterMark()
      } else {
        setTimeout(checkAbPast, Math.random() * 5000 + 1000)
      }
    }
    setTimeout(checkAbPast, Math.random() * 5000 + 1000)
  }

  const checkLicenceStatus = () => {
    sysApi.productLicence
      .getProductLicenceInfo()
      .then(({ isOk, data }) => {
        if (isOk) {
          abUtil.easyClone(data, info.licence)
          showWaterMark()
          // 到期提醒
          if (!data.isExpire && data.freeDay <= 7) {
            info.licence.showDialog()
          }
        } else {
          startCheckLicenceInterval()
        }
      })
      .catch((err) => startCheckLicenceInterval())
  }
</script>
