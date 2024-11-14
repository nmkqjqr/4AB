<template>
  <div
    class="center_designer"
    :class="setDesignTheme()"
    style="width: 100%"
    :style="setDashboardBg(props.isAssembly)"
  >
    <!-- col 隐藏掉，然后-->
    <GridLayout
      ref="ViewLayout"
      v-model:layout="list"
      :col-num="24"
      :horizontal-move="true"
      :is-draggable="false"
      :is-resizable="false"
      :responsive="false"
      :restore-on-drag="true"
      :row-height="1"
      :use-css-transforms="true"
      :vertical-compact="true"
    >
      <!-- :h="element.h" -->
      <template v-for="(element, index) in list" :key="element.i">
        <grid-item
          class="dragableItemView"
          :h="element.h"
          :i="element.i"
          :w="element.w"
          :x="element.x"
          :y="element.y"
          :class="{'gridHeightAuto' : element.heightAuto ? true : false}"
          v-if="showTabCollapse(element, index)"
        >
          <template v-if="element.type == 'tabs'">
            <div class="form-tabs groupsTabsBox">
              <el-tabs
                v-bind="element.control"
                :model-value="element.default"
                style="height: 100%"
              >
                <template v-for="(item, tIndex) in element.columns" :key="tIndex">
                  <el-tab-pane
                    class="componentBox"
                    :label="item.name"
                    :lazy="true"
                    :name="item.key"
                  >
                    <div style="width: 100%">
                      <preview-group
                        data-type="not-nested"
                        :design-json="designJson"
                        :is-assembly="true"
                        :list="item.list"
                      />
                    </div>
                  </el-tab-pane>
                </template>
              </el-tabs>
            </div>
          </template>
          <template v-else-if="element.type === 'grid'">
            <el-row class="preview_grid-row componentBox">
              <template v-for="(col, tIndex) in element.columns" :key="tIndex">
                <el-col
                  class="preview_grid-col"
                  v-bind="col.attr"
                  :class="{ gridBorder: element.border }"
                >
                  <preview-group
                    :design-json="designJson"
                    :is-assembly="true"
                    :list="col.list"
                  />
                  <span class="griditem_del">
                    <el-icon size="14">
                      <Delete />
                    </el-icon>
                  </span>
                </el-col>
              </template>
            </el-row>
          </template>
          <template v-else-if="element.type === 'collapse'">
            <el-collapse
              class="componentBox"
              :model-value="element.expand"
              @change="changeCollapse($event, element?.columns)"
            >
              <template v-for="(item, tIndex) in element.columns" :key="item.key">
                <el-collapse-item
                  :name="item.key"
                  :title="item.name"
                >
                  <el-row style="box-sizing: border-box; width: 100%">
                    <preview-group
                      :design-json="designJson"
                      :is-assembly="true"
                      :list="item.list"
                    />
                  </el-row>
                </el-collapse-item>
              </template>
            </el-collapse>
          </template>
          <template v-else-if="element.type === 'card'">
            <el-card
              class="box-card groupsCardBox"
              style="width: 100%; height: 100%"
            >
              <template #header>
                <div class="card-header">
                  {{ element.label }}
                </div>
              </template>
              <el-row
                class="componentBox"
                style="box-sizing: border-box; width: 100%"
              >
                <preview-group
                  data-type="not-nested"
                  :design-json="designJson"
                  :is-assembly="true"
                  :list="element.list"
                />
              </el-row>
            </el-card>
          </template>
          <template v-else-if="element.type === 'divider'">
            <div
              class="bgBox"
              :style="{
                ...setChartBg(element),
              }"
            ></div>
            <div
              class="bgBoxContent"
              style="height: 100%; padding-top: 10px; margin: 0"
            >
              <el-divider :content-position="element.control.align">
                {{ element.label }}
              </el-divider>
            </div>
          </template>
          <template v-else-if="element.type === 'title'">
            <div
              class="bgBox"
              :style="{
                ...setChartBg(element),
              }"
            ></div>
            <div class="custom_title bgBoxContent">
              <h2 :style="{ justifyContent: element.control.align }">
                {{ element.label }}
              </h2>
            </div>
          </template>
          <template v-else-if="element.type === 'tip'">
            <div
              class="bgBox"
              :style="{
                  ...setChartBg(element),
                }"
            ></div>
            <div class="custom_title bgBoxContent">
              <div style="padding:15px;">
                <el-alert
                  :style="{ justifyContent: element.control.align }"
                  :title="element.control.text"
                  class="alertForm"
                  :type="element.control.textType"
                  :effect="element.control.effect"
                  :show-icon="element.control.showIcon"
                  :closable="false"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <div
              class="bgBox"
              :style="{
                ...setChartBg(element),
              }"
            ></div>
            <div class="componentBox bgBoxContent">
              <component :is="element.component" :component-config="element" />
            </div>
          </template>
          <!-- <div v-else style="width: 100%; height: 100%">
            <div
              class="bgBoxContent"
              style="width: 100%"
              :style="{
                height:
                  element.type.indexOf('Echarts') !== -1 ||
                  element.type.indexOf('AbMap') !== -1 ||
                  element.type.indexOf('AbRich') !== -1
                    ? '100%'
                    : '',
              }"
            >
              <div
                class="bgBox"
                :style="{
                  ...setChartBg(element),
                }"
              ></div>
              <component :is="element.component" :component-config="element" />
            </div>
          </div> -->
        </grid-item>
      </template>
    </GridLayout>
  </div>
</template>
<script setup lang="ts">
  import { GridLayout, GridItem } from 'vue3-grid-layout-next'
  import { Delete } from '@element-plus/icons-vue'
  import { sysApi } from '@agilebpm/api'

  const props = defineProps({
    list: Array<FormCombinationComponent>,
    designJson: Object,
    isAssembly: Boolean,
  })
  const { list, designJson } = toRefs(props)
  
  const globalParams = inject('globalParams') as any

  const activeCollapseNames = (element: any) => {
    if (element.expand) {
      return element.columns.map((item: any) => item.key)
    } else {
      return []
    }
  }

  const changeCollapse = (selectCode: any, dataArr: any) => {
    const list = dataArr.find((s: { key: any }) =>
      selectCode.includes(s.key)
    )?.list
    list?.forEach((element: any) => {
      if (element?.type?.endsWith('Echarts')) {
        setTimeout(() => element.relaod && element.relaod(), 80)
      }
    })
  }

  const showTabCollapse = (item: any, index: any) => {
    if (!item.showCondition){
      return true
    } 
    try {
      if(!eval(item.showCondition)){
        // item.h = 0
        return false
      }
      if(eval(item.showCondition)){
        return true
      }
    } catch (err) {
      console.error(
        `展示脚本执行失败将隐藏该组件[ ${item.name || index} ]",脚本：[ ${
          item.showCondition
        } ]。参数如下：`
      )
    }
    return false
  }

  const showConditionCal = (element: FormCombinationComponent) => {
    if (!element.showCondition) return true
    try {
      return eval(element.showCondition)
    } catch (err) {
      console.error(
        `展示脚本执行失败将隐藏该组件[ ${element.label} ]",脚本：[ ${element.showCondition} ]。参数如下：`
      )
      console.info(err)
    }
    return false
  }

  const setDashboardBg = (isAssembly: any) => {
    if (isAssembly) {
      return
    }
    let backgroundStyle = {}
    // 如果是图片背景
    if (
      designJson.value &&
      designJson.value.dashboardBg &&
      designJson.value.dashboardBg == 'picture'
    ) {
      let url = ''
      if (
        designJson.value.dashboardBgPicture &&
        designJson.value.dashboardBgPicture.length > 0
      ) {
        const dashboardBgPicture = JSON.parse(
          designJson.value.dashboardBgPicture
        )
        if (
          dashboardBgPicture[0] &&
          dashboardBgPicture[0].id &&
          dashboardBgPicture[0].id.length > 0
        ) {
          url = sysApi.sysFile.getViewFileUrl(dashboardBgPicture[0].id)
        }
      } else {
        url = ''
      }
      if (url.length > 0) {
        backgroundStyle = {
          backgroundImage: `url("${url}")`,
          backgroundRepeat: ' no-repeat' /* 设置背景图片不重复 */,
          backgroundSize: 'cover' /* 设置背景图片自适应容器大小 */,
          backgroundPosition: 'center' /* 设置背景图片在容器中居中显示 */,
          opacity: designJson.value.dashboardTransparency,
        }
      } else {
        // backgroundStyle = {
        //   background: `#fff`,
        // }
      }
    }
    // 如果是颜色背景
    if (
      designJson.value &&
      designJson.value.dashboardBg &&
      designJson.value.dashboardBg == 'color'
    ) {
      if (
        designJson.value.dashboardBgColor &&
        designJson.value.dashboardBgColor.length > 0
      ) {
        backgroundStyle = {
          background: designJson.value.dashboardBgColor,
        }
      } else {
        // backgroundStyle = {
        //   background: `#fff`,
        // }
      }
    }
    return backgroundStyle
  }

  const setChartBg = (element: any) => {
    let backgroundStyle = {}
    // 如果是图片背景
    if (
      (element.backgroundType == 'color' &&
        element.backgroundColor &&
        element.backgroundColor.length > 0) ||
      (element.backgroundType == 'picture' &&
        element.backgroundPicture &&
        element.backgroundPicture.length > 0 &&
        element.backgroundPicture !== '[]')
    ) {
      // 如果是图片背景
      if (
        element &&
        element.backgroundType &&
        element.backgroundType == 'picture'
      ) {
        let url = ''
        if (element.backgroundPicture && element.backgroundPicture.length > 0) {
          const backgroundPicture = JSON.parse(element.backgroundPicture)
          if (
            backgroundPicture[0] &&
            backgroundPicture[0].id &&
            backgroundPicture[0].id.length > 0
          ) {
            url = sysApi.sysFile.getViewFileUrl(backgroundPicture[0].id)
          }
        } else {
          url = ''
        }
        if (url.length > 0) {
          backgroundStyle = {
            backgroundImage: `url("${url}") !important`,
            backgroundRepeat:
              element.tcType == 2
                ? ''
                : 'no-repeat !important' /* 设置背景图片不重复 */,
            backgroundSize:
              element.tcType == 2
                ? ''
                : element.tcType == 1
                ? '100% 100%'
                : 'contain' /* 设置背景图片自适应容器大小 */,
            backgroundPosition:
              'center !important' /* 设置背景图片在容器中居中显示 */,
            opacity: `${element.backgroundTransparency} !important`,
            // color: `${designJson.value.chartTextColor} !important`,
          }
        } else {
          if (designJson.value.theme && designJson.value.theme !== '3') {
            backgroundStyle = {
              background: `#fff !important`,
              // color: `${designJson.value.chartTextColor} !important`,
            }
          }
        }
      }
      // 如果是颜色背景
      if (
        element &&
        element.backgroundType &&
        element.backgroundType == 'color'
      ) {
        if (element.backgroundColor && element.backgroundColor.length > 0) {
          backgroundStyle = {
            background: `${element.backgroundColor} !important`,
            // color: `${designJson.value.chartTextColor} !important`,
          }
        } else {
          if (designJson.value.theme && designJson.value.theme !== '3') {
            backgroundStyle = {
              background: `#fff !important`,
              // color: `${designJson.value.chartTextColor} !important`,
            }
          }
        }
      }
    } else {
      if (
        designJson.value &&
        designJson.value.chartBg &&
        designJson.value.chartBg == 'picture'
      ) {
        let url = ''
        if (
          designJson.value.chartBgPicture &&
          designJson.value.chartBgPicture.length > 0
        ) {
          const chartBgPicture = JSON.parse(designJson.value.chartBgPicture)
          if (
            chartBgPicture[0] &&
            chartBgPicture[0].id &&
            chartBgPicture[0].id.length > 0
          ) {
            url = sysApi.sysFile.getViewFileUrl(chartBgPicture[0].id)
          }
        } else {
          url = ''
        }
        if (url.length > 0) {
          backgroundStyle = {
            backgroundImage: `url("${url}") !important`,
            backgroundRepeat: ' no-repeat !important' /* 设置背景图片不重复 */,
            backgroundSize: 'cover !important' /* 设置背景图片自适应容器大小 */,
            backgroundPosition:
              'center !important' /* 设置背景图片在容器中居中显示 */,
            opacity: `${designJson.value.chartTransparency} !important`,
            // color: `${designJson.value.chartTextColor} !important`,
          }
        } else {
          if (designJson.value.theme && designJson.value.theme !== '3') {
            backgroundStyle = {
              background: `#fff !important`,
              // color: `${designJson.value.chartTextColor} !important`,
            }
          }
        }
      }
      // 如果是颜色背景
      if (
        designJson.value &&
        designJson.value.chartBg &&
        designJson.value.chartBg == 'color'
      ) {
        if (
          designJson.value.chartBgColor &&
          designJson.value.chartBgColor.length > 0
        ) {
          backgroundStyle = {
            background: `${designJson.value.chartBgColor} !important`,
            // color: `${designJson.value.chartTextColor} !important`,
          }
        } else {
          if (designJson.value.theme && designJson.value.theme !== '3') {
            backgroundStyle = {
              background: `#fff !important`,
              // color: `${designJson.value.chartTextColor} !important`,
            }
          }
        }
      }
    }
    return backgroundStyle
  }

  const setDesignTheme = () => {
    let theme = 'formThemeClass'
    if (designJson.value && designJson.value.theme) {
      if (designJson.value.theme == '2') {
        theme = 'gatewayThemeClass'
      } else if (designJson.value.theme == '3') {
        theme = 'largeScreenThemeClass'
      } else if (designJson.value.theme == '4') {
        theme = 'redThemeClass'
      } else {
        theme = 'formThemeClass'
      }
    }
    return theme
  }
</script>
<style lang="scss">
  @import '../styles/index.scss';
</style>
