<template>
  <div
    v-if="list != null"
    id="content"
    :class="setDesignTheme()"
    style="width: 100%; height: 100%"
    :style="{
      ...setDashboardBg(props.isAssembly),
      ...{ minHeight: props.pageHeight + 'px' },
    }"
    @dragleave="dragleave"
    @dragover="allowDrop"
    @drop="drop"
  >
    <GridLayout
      ref="refLayout"
      v-model:layout="list"
      :auto-size="true"
      :col-num="24"
      :horizontal-move="true"
      :responsive="false"
      :restore-on-drag="true"
      :row-height="1"
      style="margin-bottom: 200px"
      :use-css-transforms="true"
      :vertical-compact="true"
    >
      <!--    @layout-updated="handleLayoutUpdated"   -->

      <template v-for="(element, index) in list" :key="element.i">
        <grid-item
          class="test"
          :class="{ gridHeightAuto: element.heightAuto ? true : false }"
          :h="element.h"
          :i="element.i"
          :w="element.w"
          :x="element.x"
          :y="element.y"
        >
          <div
            :class="
              activeId == element.key
                ? 'active_form_item dragableItem'
                : 'dragableItem'
            "
            @click.stop="ActiveItemClick(element)"
          >
            <template v-if="element.type == 'tabs'">
              <div class="form-tabs groupsTabsBox">
                <el-tabs
                  v-bind="element.control"
                  :model-value="element.default"
                  style="height: 100%"
                >
                  <el-tab-pane
                    v-for="(item, tIndex) in element.columns"
                    :key="item.key"
                    class="componentBox"
                    :label="item.name"
                    :lazy="true"
                    :name="item.key"
                  >
                    <el-row
                      :gutter="10"
                      style="
                        box-sizing: border-box;
                        /* padding: 4px; */
                        height: 100%;
                        border: 1px dashed #e2e0e0;
                      "
                    >
                      <!-- <div class="componentBox"> -->
                      <group-container
                        :active-col="props.activeCol"
                        :active-id="props.activeId"
                        data-type="not-nested"
                        :design-json="props.designJson"
                        :is-assembly="true"
                        :list="item.list"
                      />
                      <!-- </div> -->
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </template>
            <template v-else-if="element.type === 'grid'">
              <el-row class="grid-row componentBox" :gutter="8">
                <!-- :class="{
                'active-col': activeKey === col.name,
              }"  -->
                <el-col
                  v-for="(col, i) in element.columns"
                  v-bind="col.attr"
                  :key="i"
                  class="grid-col"
                  :class="{ active_col: props.activeCol == col.key }"
                  @click.stop="gridClick(col, element)"
                >
                  <group-container
                    :active-col="props.activeCol"
                    :active-id="props.activeId"
                    data-type="not-nested"
                    :design-json="props.designJson"
                    :is-assembly="true"
                    :list="col.list"
                  />
                  <span class="griditem_del" @click="delGridClick(element, i)">
                    <el-icon size="14">
                      <Delete />
                    </el-icon>
                  </span>
                </el-col>
              </el-row>
            </template>
            <template v-else-if="element.type === 'collapse'">
              <el-collapse
                class="componentBox"
                :model-value="activeCollapseNames(element)"
              >
                <el-collapse-item
                  v-for="(item, index) in element.columns"
                  :key="item.key"
                  :name="item.key"
                  :title="item.name"
                >
                  <el-row
                    style="box-sizing: border-box; border: 1px dashed #e2e0e0"
                  >
                    <group-container
                      :active-id="props.activeId"
                      data-type="not-nested"
                      :design-json="props.designJson"
                      :is-assembly="true"
                      :list="item.list"
                    />
                    <div
                      style="width: 100%; height: 100%; background-color: aqua"
                    ></div>
                  </el-row>
                </el-collapse-item>
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
                  style="
                    box-sizing: border-box;
                    height: 100%;
                    border: 1px dashed #e2e0e0;
                  "
                >
                  <group-container
                    :active-col="props.activeCol"
                    :active-id="props.activeId"
                    data-type="not-nested"
                    :design-json="props.designJson"
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
                <el-divider
                  class="dividerTextStyle"
                  :content-position="element.control.align"
                >
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
                <div style="padding: 15px">
                  <el-alert
                    class="alertForm"
                    :closable="false"
                    :effect="element.control.effect"
                    :show-icon="element.control.showIcon"
                    :style="{ justifyContent: element.control.align }"
                    :title="element.control.text"
                    :type="element.control.textType"
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
                <component
                  :is="element.component"
                  :component-config="element"
                />
              </div>
            </template>
            <span
              class="dragableItem_del"
              @click.stop="delClick(element, index)"
            >
              <el-icon size="14">
                <Delete />
              </el-icon>
            </span>
            <span
              v-if="element.type == 'grid'"
              class="dragableItem_add"
              @click.stop="addGridClick(element, index)"
            >
              <el-icon size="14">
                <Plus />
              </el-icon>
            </span>
          </div>
        </grid-item>
      </template>
    </GridLayout>
  </div>
</template>
<script setup lang="ts">
  import { GridLayout, GridItem } from 'vue3-grid-layout-next'
  import { CopyDocument, Delete, Plus } from '@element-plus/icons-vue'
  import { sysApi } from '@agilebpm/api'
  import {
    Ref,
    ref,
    getCurrentInstance,
    inject,
    defineProps,
    PropType,
  } from 'vue'
  import endsWith from 'lodash-es/endsWith'
  const props = defineProps({
    list: Array<FormCombinationComponent>,
    activeId: String,
    formConf: Object,
    activeCol: String,
    designJson: Object,
    pageHeight: Number,
    isAssembly: Boolean,
  })
  const responsive = ref(true)
  const refLayout = ref(null)
  const divRefs = ref(null)
  const { list, formConf, activeId, designJson } = toRefs(props)
  const emits = defineEmits(['clearAll', 'activeItem'])
  const activeItem = inject('activeItem')
  const activeColClick = inject('activeColClick')
  const resetControl = inject('resetControl')
  const globalParams = inject('globalParams') as any

  // const alignYWithPreviousH = (arr:any) => {
  //   // 从数组的第二个元素开始遍历（索引为1）
  //   for (let i = 1; i < arr.length; i++) {
  //     // 检查前一个元素是否存在，并且具有 h 属性
  //     if (arr[i - 1] && 'h' in arr[i - 1]) {
  //       // 将当前元素的 y 属性设置为前一个元素的 h 值
  //       arr[i].y = arr[i - 1].h;
  //     }
  //   }
  // }

  // const handleLayoutUpdated = (arr:any) => {
  //   // alignYWithPreviousH(arr);
  //   list.value = arr
  // }

  // watch(
  //   () => formConf.value.h,
  //   (value, old) => {
  //     if (value) {
  //      handleLayoutUpdated(list.value)
  //     }
  //   }
  // )

  // watch(
  //   () => formConf.value.heightAuto,
  //   (value, old) => {
  //     if (value) {
  //       // handleLayoutUpdated(list.value)
  //       nextTick(() => {
  //         console.log('refLayout',refLayout.value.offsetHeight)
  //       })
  //     }
  //   }
  // )

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
      // 如果是图片背景
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

  // return {
  //   background:
  //     designJson.value.dashboardBg == 'color'
  //       ? designJson.value.dashboardBgColor
  //       : 'white',
  // }

  const ActiveItemClick = (element: any) => {
    activeItem(element)
    // activeColClick({
    //   key: '',
    // })
  }

  // 固定位置放置
  const drop = (ev: any) => {
    ev.stopPropagation()
    ev.preventDefault()
    const data = JSON.parse(ev.dataTransfer.getData('dragItem'))
    console.info('ev.dataTransfer.getData(dragItem)')
    console.info(data)
    if (data) {
      // 部分初始化操作 TODO除了动态的，其他需要迁移到默认JSON配置中
      draggableAdd(data)

      const id = new Date().getTime()
      const item = {
        ...data,
        drag: false,
        i: id,
        key: id.toString(),
        x: 0,
        y: 2,
      }

      list.value?.push(item)
      ActiveItemClick(item)
    } else {
      console.error('ev.dataTransfer.getData(dragItem) == null')
    }
  }

  // 此处实现动态实时展示位置
  const allowDrop = (e: {
    stopPropagation: () => void
    preventDefault: () => void
  }) => {
    e.stopPropagation()
    e.preventDefault()
  }
  // 此处实现动态实时展示位置
  const dragleave = (e: any) => {
    console.log('离开', e)
  }

  const activeCollapse: Ref<Array<string>> = ref([])

  const activeCollapseNames = (element: FormCombinationComponent) => {
    if (activeCollapse.value.length == 0) {
      activeCollapse.value = element.expand || []
    }
    return activeCollapse.value
  }

  const gridClick = (col: any, element: any) => {
    activeColClick(col)
    activeItem(element)
  }

  const delClick = (element: any, index: number) => {
    list.value?.splice(index, 1)
    activeItem({
      key: '',
    })
    resetControl()
  }
  const delGridClick = (element: any, index: number) => {
    element.columns.splice(index, 1)
  }

  const draggableAdd = (item: any) => {
    // 获取当前索引
    const key = new Date().getTime().toString()

    const obj: any = item || undefined
    if (!obj) {
      return
    }
    const conmponent = item.component
    const control = item.control
    item.key = obj.type + key
    if (['tabs', 'grid'].includes(item.type)) {
      item.columns.map((item: { key: string }, index: any) => {
        const str = new Date().getTime().toString()
        item.key = `${obj.type}item${index}${str}`
      })
    }
    if (item.type == 'grid') {
      item.border = true
    }
    if (item.type == 'tabs') {
      item.default = item.columns[0].key || ''
    }
    if (conmponent == 'AbBpmIndicatorCard') {
      control.param = [
        {
          sn: 1,
          code: 'todoTask',
          color: '#4398f0',
        },
        {
          sn: 2,
          code: 'apply',
          color: '#8870b4',
        },
        {
          sn: 3,
          code: 'back',
          color: '#8fc99a',
        },
        {
          sn: 4,
          code: 'approve',
          color: '#f4a074',
        },
        {
          sn: 5,
          code: 'copyMeCount',
          color: '#ffa0c0',
        },
      ]
    }
    // 全局添加默认图表整体
    if (!designJson.value.chartStyle) {
      designJson.value.chartStyle = 'xtmr'
    }
  }
  const groupClick = (element: object) => {
    emits('activeItem', element)
  }
  const addGridClick = (element: any) => {
    const str = new Date().getTime().toString()
    element.columns.push({
      attr: { span: 12 },
      key: `${element.type}item${0}${str}`,
      list: [],
      expand: [],
    })
  }
</script>
<style lang="scss">
  @import '../styles/index.scss';
</style>
