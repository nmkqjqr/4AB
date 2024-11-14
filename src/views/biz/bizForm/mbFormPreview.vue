<template>
  <div class="comprehensive-table-container">
    <el-container>
      <el-header>
        <el-button :icon="Back" @click="back">返回</el-button>
      </el-header>
      <el-divider class="dividermar" />
      <el-main>
        <iframe
          v-if="info.src"
          frameborder="no"
          :src="info.src"
          :style="info.style"
        ></iframe>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { Back } from '@element-plus/icons-vue'
  import { useTabsStore } from '@/store/modules/tabs'
  import { abTools } from '~/agilebpm'

  const { proxy } = abTools.useCurrentInstance()
  //页面用到的双向绑定的信息
  const info: any = reactive({
    style: {
      width: '800px',
      height: `${window.innerHeight * 0.8}px`,
      position: 'relative',
      left: '25%',
    },
    formCode: proxy.$route.query.code || proxy.$route.params.code,
    src: '',
  })

  onMounted(() => {
    info.src = `http://localhost:8888/#/biz/form/preview?code=${info.formCode}`
  })

  const route = useRoute()
  const { delVisitedRoute } = useTabsStore()
  const back = () => {
    delVisitedRoute(route.path)
    proxy.$router ? proxy.$router.back() : window.history.back()
  }
</script>

<style lang="scss" scoped></style>
