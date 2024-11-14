<template>
  <div>
    <el-drawer
      v-model="drawer"
      class="styleDrawerClass"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :show-close="false"
      size="350"
      title="仪表盘样式"
    >
      <template #header>
        <span>仪表盘样式</span>
      </template>
      <template #default>
        <div>
          <el-divider content-position="left">主题</el-divider>
          <el-form-item label="主题：" label-width="80px">
            <el-radio-group v-model="info.theme">
              <el-radio border label="1" style="margin-right: 10px">
                表单主题
              </el-radio>
              <el-radio border label="2" style="margin-right: 10px">
                门户主题
              </el-radio>
              <el-radio
                border
                label="3"
                style="margin-top: 10px; margin-right: 10px"
              >
                大屏主题
              </el-radio>
              <el-radio
                border
                label="4"
                style="margin-top: 10px; margin-right: 10px"
              >
                红色主题
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-divider content-position="left" style="margin-top: 28px">
            仪表盘整体
          </el-divider>
          <el-form-item label="背景：" label-width="80px">
            <el-radio-group v-model="info.dashboardBg">
              <el-radio label="color">颜色</el-radio>
              <el-radio label="picture">图片</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="info.dashboardBg == 'color'"
            label="颜色："
            label-width="80px"
          >
            <el-color-picker
              v-model="info.dashboardBgColor"
              popper-class="colorDiaStyle"
              :predefine="predefineColors"
              show-alpha
            />
          </el-form-item>
          <el-form-item
            v-if="info.dashboardBg == 'picture'"
            label="图片："
            label-width="80px"
          >
            <ab-upload-file
              v-model="info.dashboardBgPicture"
              accept=".jpg,.jpeg,.png,.gif"
              dic-code="property"
              :limit="1"
              list-type="picture-card"
              size="small"
              style="max-width: 100%"
              :upload-style-class="true"
            />
          </el-form-item>
          <!-- <el-form-item
            v-if="info.dashboardBg == 'picture'"
            label="透明度："
            label-width="80px"
          >
            <el-slider
              v-model="info.dashboardTransparency"
              :max="1"
              :min="0"
              show-stops
              :step="0.1"
              style="width: 80%"
            />
          </el-form-item> -->
          <el-divider content-position="left" style="margin-top: 28px">
            图表整体
          </el-divider>
          <el-form-item label="背景：" label-width="80px">
            <el-radio-group v-model="info.chartBg">
              <el-radio label="color">颜色</el-radio>
              <el-radio label="picture">图片</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="info.chartBg == 'color'"
            label="颜色："
            label-width="80px"
          >
            <el-color-picker
              v-model="info.chartBgColor"
              popper-class="colorDiaStyle"
              :predefine="predefineColors"
              show-alpha
            />
          </el-form-item>
          <el-form-item
            v-if="info.chartBg == 'picture'"
            label="图片："
            label-width="80px"
          >
            <ab-upload-file
              v-model="info.chartBgPicture"
              accept=".jpg,.jpeg,.png,.gif"
              dic-code="property"
              :limit="1"
              list-type="picture-card"
              size="small"
              style="max-width: 100%"
              :upload-style-class="true"
            />
          </el-form-item>
          <el-form-item
            v-if="info.chartBg == 'picture'"
            label="透明度："
            label-width="80px"
          >
            <el-slider
              v-model="info.chartTransparency"
              :max="1"
              :min="0"
              show-stops
              :step="0.1"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="配色方案：" label-width="80px">
            <el-select v-model="info.chartStyle">
              <el-option label="系统默认" value="xtmr">
                系统默认
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #509ee3"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #9cc177"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #a989c5"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #f9d45c"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #f1b556"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #a6e7f3"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #7172ad"
                ></span>
              </el-option>
              <el-option label="绚丽多彩" value="xldc">
                绚丽多彩
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #578af2"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #62e075"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #42b36f"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #ffd660"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #b3de36"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #fa914e"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #f25252"
                ></span>
              </el-option>
              <el-option label="蓝橙撞色" value="lczs">
                蓝橙撞色
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #4d8cae"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #ad5601"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #324498"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #2b5b75"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #0fa8e0"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #ff8500"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #006bc2"
                ></span>
              </el-option>
              <el-option label="英伦酒红" value="yljh">
                英伦酒红
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #db5545"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #784029"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #e39970"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #e0d09f"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #a5a187"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #474844"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #984337"
                ></span>
              </el-option>
              <el-option label="清新草绿" value="qxcl">
                清新草绿
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #8ac98b"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #a4ded9"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #67b9cd"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #d6d6d7"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #8d9e69"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #eb4b5c"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #b7d62e"
                ></span>
              </el-option>
              <el-option label="神秘魅紫" value="smmz">
                神秘魅紫
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #c366a1"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #503491"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #daa6d6"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #a999c9"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #d3c3db"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #a563ac"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #7260af"
                ></span>
              </el-option>
              <el-option label="热情暖阳" value="rqny">
                热情暖阳
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #ff9090"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #d53872"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #b91515"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #bba588"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #ffd54f"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #ff9800"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #fbe8e1"
                ></span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="文字颜色：" label-width="80px">
            <el-color-picker
              v-model="info.chartTextColor"
              :predefine="predefineColors"
              show-alpha
            />
          </el-form-item> -->
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { abUploadFile } from '@ab-core'
  const emit = defineEmits(['closeDrawer'])
  const props = defineProps({
    drawer: {
      default: false,
      type: Boolean,
    },
    config: {
      required: true,
      type: Object as any,
    },
  })
  const info = reactive({
    theme: '1',
    dashboardBg: 'color',
    dashboardBgColor: '',
    dashboardBgPicture: '',
    dashboardTransparency: 1,
    chartBg: 'color',
    chartBgColor: '',
    chartBgPicture: '',
    chartTransparency: 1,
    chartStyle: '',
    // chartTextColor: '',
  })
  const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
  ])
  const { drawer, config } = toRefs(props)

  const cancel = () => {
    closeDrawer()
  }

  const save = () => {
    setUpdateData()
    closeDrawer()
  }

  const setUpdateData = () => {
    config.value.theme = info.theme
    config.value.dashboardBg = info.dashboardBg
    config.value.dashboardBgColor = info.dashboardBgColor
    config.value.dashboardBgPicture = info.dashboardBgPicture
    config.value.dashboardTransparency = info.dashboardTransparency
    config.value.chartBg = info.chartBg
    config.value.chartBgColor = info.chartBgColor
    config.value.chartBgPicture = info.chartBgPicture
    config.value.chartTransparency = info.chartTransparency
    config.value.chartStyle = info.chartStyle
    // config.value.chartTextColor = info.chartTextColor
  }

  const setInfoData = () => {
    info.theme = config.value.theme ? config.value.theme : '1'
    info.dashboardBg = config.value.dashboardBg
      ? config.value.dashboardBg
      : 'color'
    info.dashboardBgColor = config.value.dashboardBgColor
      ? config.value.dashboardBgColor
      : ''
    info.dashboardBgPicture = config.value.dashboardBgPicture
      ? config.value.dashboardBgPicture
      : ''
    info.dashboardTransparency = config.value.dashboardTransparency
      ? config.value.dashboardTransparency
      : 1
    info.chartBg = config.value.chartBg ? config.value.chartBg : 'color'
    info.chartBgColor = config.value.chartBgColor
      ? config.value.chartBgColor
      : ''
    info.chartBgPicture = config.value.chartBgPicture
      ? config.value.chartBgPicture
      : ''
    info.chartTransparency = config.value.chartTransparency
      ? config.value.chartTransparency
      : 1
    info.chartStyle =
      config.value.chartStyle && config.value.chartStyle.length > 0
        ? config.value.chartStyle
        : 'xtmr'
    // info.chartTextColor = config.value.chartTextColor
    //   ? config.value.chartTextColor
    //   : ''
  }

  const closeDrawer = () => {
    emit('closeDrawer')
  }

  watch(
    () => {
      return props.drawer
    },
    (newValue) => {
      if (newValue) {
        setInfoData()
      }
    }
  )
</script>
<style lang="scss">
  .styleDrawerClass {
    .el-drawer__header {
      margin-bottom: 0 !important;
    }
  }
  .colorDiaStyle {
    width: 320px;
  }
  .color-span {
    position: absolute;
    width: 20px;
    height: 20px;
    margin-top: 7px;
    margin-left: 90px;
    background: #999999;
    border-radius: 100%;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.4);
  }
</style>
