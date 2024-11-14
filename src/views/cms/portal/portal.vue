<template>
  <el-container
    class="layout-container-demo"
    style="padding: 0px; background: #f6f8f9"
  >
    <div ref="main" class="widgets-home">
      <div class="widgets-content">
        <div ref="widgetsRef" class="widgets">
          <div class="widgets-wrapper">
            <div
              v-if="
                (info.grid.copmsList &&
                  JSON.stringify(info.grid.copmsList) === '[[],[],[]]') ||
                info.data.status === 0
              "
              class="no-widgets"
            >
              <el-empty
                :description="
                  info.data.status === 0
                    ? $abT('page.portal.portalDisabled','该门户已禁用！')
                    : $abT('page.portal.noComponents','没有部件啦')
                "
                :image-size="280"
              />
            </div>
            <el-row v-else :gutter="15">
              <el-col
                v-for="(item, index) in info.grid.layout"
                :key="index"
                :md="item"
                style="margin-bottom: 15px"
                :xs="24"
              >
                <draggable
                  ref="draggableRef"
                  v-model="info.grid.copmsList[index]"
                  animation="200"
                  class="draggable-box"
                  fallback-on-body
                  force-fallback
                  group="people"
                  handle=".customize-overlay"
                  item-key="com"
                >
                  <template #item="{ element }">
                    <div
                      class="widgets-item"
                      :style="{
                        float: 'left',
                        width: element.width + '%',
                        padding: '6px',
                      }"
                    >
                      <template v-if="element.type == 'iFrame'">
                        <component
                          :is="allComps['AbIframe']"
                          :component-code="element.code"
                          :component-height="element.height"
                          :component-obj-name="element.objName"
                          :component-width="element.width"
                        />
                      </template>
                      <component
                        :is="allComps[element.objName]"
                        v-else
                        :component-code="element.code"
                        :component-height="element.height"
                        :component-width="element.width"
                        :router="code"
                      />
                    </div>
                  </template>
                </draggable>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script lang="ts">
  export default defineComponent({
    name: 'Portal',
  })
</script>

<script setup lang="ts">
  import { useTabsStore } from '@/store/modules/tabs'
  import allComps from '@/views/index/widgets/components'
  import draggable from 'vuedraggable'
  import { abTools, cmsApi } from '~/agilebpm'

  const { proxy } = abTools.useCurrentInstance()
  const { changeTabsMeta } = useTabsStore()
  const widgetsRef = ref()
  const info = reactive({
    customizing: false,
    allComps: allComps,
    defaultGrid: {
      //默认分栏数量和宽度 例如 [24] [18,6] [8,8,8] [6,12,6]
      layout: [24, 16, 8],
      //小组件分布，com取值:views/home/components 文件名
      copmsList: [[], [], []],
    },
    grid: [] as any,
    widgetHeight: `${window.innerHeight - 587}px`,
    data: {} as any,
  })

  info.grid = JSON.parse(JSON.stringify(info.defaultGrid))

  //获取路由上code
  const code = proxy.$route.params.code

  cmsApi.portal.getVoByCode(code).then((rel: any) => {
    info.data = rel.data
    changeTabsMeta({
      fullPath: proxy.$route.fullPath,
      meta: { title: `${info.data.name}` },
    })
    if (info.data.contentJson) {
      info.grid = JSON.parse(info.data.contentJson)
    }
    initComponent()
  })

  const initComponent = () => {
    // 缓存中的组件列表
    const myCopmsList = info.grid.copmsList.reduce(function (
      a: string | any[],
      b: any
    ) {
      return a.concat(b)
    })
    // 给已缓存的组件加上disabled
    if (info.data.cmsHomeList) {
      info.data.cmsHomeList.forEach((item: any) => {
        item.width = 100
        const _item = myCopmsList.find((myCopmsListitem: { objName: any }) => {
          if (myCopmsListitem && myCopmsListitem.objName) {
            return myCopmsListitem.objName === item.objName
          } else {
            return false
          }
        })
        if (_item) {
          item.disabled = true
        } else {
          item.disabled = false
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  .widgets-home {
    display: flex;
    flex: 1;
    flex-direction: row;
    height: 100%;
  }
  .widgets-content {
    flex: 1;
    padding: 0;
    overflow: auto;
    overflow-x: hidden;
    background: #f6f8f9;
  }

  .widgets {
    transition: transform 0.15s;
    transform-origin: top left;
  }

  .draggable-box {
    height: 100%;
  }

  .customizing .widgets-wrapper {
    margin-right: -360px;
  }
  .customizing .widgets-wrapper .el-col {
    padding-bottom: 10px;
  }
  .customizing .widgets-wrapper .draggable-box {
    padding: 15px;
    border: 2px dashed #9a9a9a;
  }
  .customizing .widgets-wrapper .no-widgets {
    display: none;
  }
  .customizing .widgets-item {
    position: relative;
    margin-bottom: 15px;
  }

  @media (max-width: 992px) {
    .customizing .widgets {
      transform: scale(1) !important;
    }
    .customizing .widgets-wrapper {
      margin-right: 0;
    }
  }
</style>
