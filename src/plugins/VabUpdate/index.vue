<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    class="vab-update"
    width="410px"
    @close="close"
  >
    <div class="vab-update-icon">
      <vab-icon icon="upload-cloud-2-fill" />
    </div>
    <vab-icon class="vab-update-cup" icon="cup-line" />
    <h3>版本更新：</h3>
    <p>
      {{ title }}
      V{{ version }}
    </p>
    <p>
      更新时间：最近更新
      <!-- {{ updateTime }} -->
    </p>
    <p
      v-text="
        `${
          '如遇更' +
          '新失败' +
          '请手' +
          '动点击' +
          'Ctr' +
          'l + F' +
          '5' +
          '重试'
        }`
      "
    ></p>
    <template #footer>
      <el-button v-loading="loading" size="large" type="primary" @click="save">
        {{ button }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { useSettingsStore } from '@/store/modules/settings'

  export default defineComponent({
    name: 'VabUpdate',
    setup() {
      const $sub = inject('$sub')
      const $baseMessage = inject('$baseMessage')

      const { getTitle } = useSettingsStore()

      const state = reactive({
        title: getTitle,
        version: __APP_INFO__['version'],
        updateTime: __APP_INFO__['lastBuildTime'],
        dialogVisible: false,
        loading: false,
        button: '立即升级',
      })

      onBeforeMount(() => {
        $sub('vab-update', () => {
          state.dialogVisible = true
          setTimeout(() => {
            save()
          }, 1000 * 3)
        })
      })

      const close = () => {
        state.dialogVisible = false
      }

      const save = () => {
        state.button = '正在更新'
        state.loading = true
        $baseMessage(
          '正在更新，预计10S后更新完成',
          'success',
          'vab-hey-message-success'
        )
        setTimeout(() => {
          state.loading = false
          state.button = '更新完成'
        }, 1000 * 6)

        setTimeout(() => {
          location.reload()
        }, 1000 * 7)
      }

      return {
        ...toRefs(state),
        close,
        save,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .vab-update {
    position: relative;

    &-icon {
      position: absolute;
      top: -50px;
      left: 50%;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      background: linear-gradient(
        50deg,
        var(--el-color-primary),
        var(--el-color-primary-light-7)
      );
      border-radius: 50%;
      transform: translateX(-50%);

      i {
        font-size: 50px;
        color: #fff;
      }
    }

    &-cup {
      position: absolute;
      right: 20px;
      bottom: 70px;
      font-size: 80px;
      -webkit-text-fill-color: transparent;
      background-image: linear-gradient(
        var(--el-color-primary-light-7),
        var(--el-color-primary-light-9)
      );
      background-clip: text;
    }
  }
</style>

<style lang="scss">
  .vab-update {
    &.el-dialog {
      margin-top: 30vh !important;
      border-radius: 15px;

      .el-dialog__body {
        margin: 0 40px 0 40px;
      }

      .el-dialog__footer {
        text-align: center !important;

        .el-button {
          width: 200px;
          margin-bottom: 20px;
          background: linear-gradient(
            50deg,
            var(--el-color-primary-light-3),
            var(--el-color-primary)
          );
          border: 0;
          border-radius: 20px;
        }
      }
    }
  }
</style>
