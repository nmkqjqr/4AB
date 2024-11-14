<template>
  <div style="position: absolute; top: 30%; left: 40%">
    <el-result
      :icon="pageData.icon"
      :sub-title="pageData.msg"
      :title="pageData.title"
    />
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, Ref } from 'vue'
  const vueContext = getCurrentInstance()
  const status = vueContext?.proxy?.$route.query.status
  const action = vueContext?.proxy?.$route.query.action

  const pageData: any = ref({})

  onMounted(() => {
    pageData.value = getInfo()
  })

  const getInfo = () => {
    if (!action || action === 'open') {
      return {
        icon: getIcon(),
        title: '打开链接失败',
        msg: '打开链接失败，请联系相关人员处理！',
      }
    }

    if (action === 'submit' && status === '-1') {
      return {
        icon: getIcon(),
        title: '提交失败',
        msg: '提交事项失败，请联系相关人员处理！',
      }
    }

    if (action === 'submit' && status === '1') {
      return {
        icon: getIcon(),
        title: '提交成功',
        msg: '提交事项成功，祝您生活愉快，再见！',
      }
    }

    if (action === 'done') {
      return {
        icon: getIcon(),
        title: '无需办理',
        msg: '事项已提交或状态发生变更，无需办理！',
      }
    }

    if (action === 'openMobile' && status === '-1') {
      return {
        icon: getIcon(),
        title: '移动端跳转失败',
        msg: '移动端跳转失败，请使用电脑打开链接或者联系相关人员！',
      }
    }

    return {
      icon: getIcon(),
      title: '迷路了！',
      msg: '请原路返回！',
    }
  }

  const getIcon = () => {
    if (!status || status === '-1') {
      return 'warning'
    }

    return status === '0' ? 'info' : 'success'
  }
</script>
