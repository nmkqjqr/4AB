<script setup>
  import { useTabsStore } from '@/store/modules/tabs'
  import { onBeforeRouteLeave } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  const tabsStore = useTabsStore()
  const { delVisitedRoute } = tabsStore

  let timer
  const state = reactive({
    oops: '抱歉!',
    headline: '您没有访问权限...',
    info: '当前帐号没有访问系统资源的权限,请联系管理员。或者切换账户登录！',
    btn: '退出登录',
  })

  onBeforeRouteLeave((to, from, next) => {
    delVisitedRoute(route.path)
    clearInterval(state.timer)
    next()
  })

  onBeforeMount(() => {})
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <el-row :gutter="20">
        <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
          <div class="pic-error">
            <el-image
              class="pic-error-parent"
              :src="require('@/assets/error_images/403.png')"
            />
            <el-image
              class="pic-error-child left"
              :src="require('@/assets/error_images/cloud.png')"
            />
          </div>
        </el-col>

        <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
          <div class="bullshit">
            <div class="bullshit-oops">{{ state.oops }}</div>
            <div class="bullshit-headline">{{ state.headline }}</div>
            <div class="bullshit-info">{{ state.info }}</div>
            <router-link v-slot="{ navigate }" custom to="/">
              <a class="bullshit-return-home" @click="navigate">
                {{ state.btn }}
              </a>
            </router-link>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .error-container {
    position: relative;
    min-height: 100vh;

    .error-content {
      position: absolute;
      top: 55%;
      left: 50%;
      width: 40vw;
      height: 400px;
      transform: translate(-50%, -50%);

      .pic-error {
        position: relative;
        float: left;
        width: 100%;
        overflow: hidden;

        &-parent {
          width: 100%;
        }

        &-child {
          position: absolute;

          &.left {
            top: 17px;
            left: 220px;
            width: 80px;
            opacity: 0;
            animation-name: cloudLeft;
            animation-duration: 2s;
            animation-timing-function: linear;
            animation-delay: 1s;
            animation-fill-mode: forwards;
          }

          @keyframes cloudLeft {
            0% {
              top: 17px;
              left: 220px;
              opacity: 0;
            }

            20% {
              top: 33px;
              left: 188px;
              opacity: 1;
            }

            80% {
              top: 81px;
              left: 92px;
              opacity: 1;
            }

            100% {
              top: 97px;
              left: 60px;
              opacity: 0;
            }
          }
        }
      }

      .bullshit {
        position: relative;
        float: left;
        width: 300px;
        padding: 30px 0;
        overflow: hidden;

        &-oops {
          margin-bottom: 20px;
          font-size: 32px;
          font-weight: bold;
          line-height: 40px;
          color: var(--el-color-primary);
          opacity: 0;
          animation-name: slideUp;
          animation-duration: 0.5s;
          animation-fill-mode: forwards;
        }

        &-headline {
          margin-bottom: 10px;
          font-size: 20px;
          font-weight: bold;
          line-height: 24px;
          color: #222;
          opacity: 0;
          animation-name: slideUp;
          animation-duration: 0.5s;
          animation-delay: 0.1s;
          animation-fill-mode: forwards;
        }

        &-info {
          margin-bottom: 30px;
          font-size: 13px;
          line-height: 21px;
          color: var(--el-color-grey);
          opacity: 0;
          animation-name: slideUp;
          animation-duration: 0.5s;
          animation-delay: 0.2s;
          animation-fill-mode: forwards;
        }

        &-return-home {
          display: block;
          float: left;
          width: 110px;
          height: 36px;
          font-size: 14px;
          line-height: 36px;
          color: #fff;
          text-align: center;
          cursor: pointer;
          background: var(--el-color-primary);
          border-radius: 100px;
          opacity: 0;
          animation-name: slideUp;
          animation-duration: 0.5s;
          animation-delay: 0.3s;
          animation-fill-mode: forwards;
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(60px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      }
    }
  }
</style>
