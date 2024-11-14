<template>
  <div ref="main" :class="['widgets-home', customizing ? 'customizing' : '']">
    <div class="widgets-content">
      <div class="widgets-top">
        <div class="widgets-top-title">控制台</div>
        <div class="widgets-top-actions">
          <el-button v-if="customizing" round type="primary" @click="save">
            <el-icon style="vertical-align: middle"><Check /></el-icon>
            <span style="vertical-align: middle">完成</span>
          </el-button>
          <!-- <el-button v-if="customizing" size="small" @click="backDefaul()">
            恢复默认
          </el-button> -->
          <el-button v-else round type="default" @click="custom">
            <el-icon style="vertical-align: middle"><Edit /></el-icon>
            <span style="vertical-align: middle">自定义</span>
          </el-button>
        </div>
      </div>
      <div ref="widgets" class="widgets">
        <div class="widgets-wrapper">
          <div
            v-if="grid.copmsList && grid.copmsList.length <= 0"
            class="no-widgets"
          >
            <el-empty
              :description="$abT('page.portal.noComponents','没有部件啦')"
              :image-size="280"
            />
          </div>
          <el-row :gutter="15">
            <el-col
              v-for="(item, index) in grid.layout"
              :key="index"
              :md="item"
              style="margin-bottom: 15px"
              :xs="24"
              @click="clickFn(item, index)"
            >
              <draggable
                ref="draggableRef"
                v-model="grid.copmsList[index]"
                animation="200"
                class="draggable-box"
                fallback-on-body
                force-fallback
                group="people"
                handle=".customize-overlay"
                item-key="com"
                @choose="choose"
                @click="draggableClick"
                @sort="sort"
              >
                <template #item="{ element }" style="overflow: hidden">
                  <div
                    class="widgets-item"
                    :style="{
                      float: 'left',
                      width: element.width + '%',
                      padding: '6px',
                    }"
                  >
                    <template v-if="element.type === 'iFrame'">
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
                    />
                    <div v-if="customizing" class="customize-overlay">
                      <el-button
                        class="close"
                        plain
                        size="small"
                        type="danger"
                        @click="removez(element.code)"
                      >
                        <el-icon>
                          <Close />
                        </el-icon>
                      </el-button>
                      <label>
                        {{ handleTitle(element.code) }}
                      </label>
                      <div class="slider-demo-block">
                        <el-card>
                          <span class="demonstration">宽度调整</span>
                          <el-slider
                            v-model="element.width"
                            show-input
                            show-stops
                            :step="10"
                          />
                          <span
                            v-if="
                              element.objName ==
                                ['AbEcharts'].includes(element.objName) ||
                              element.type == 'iFrame'
                            "
                          >
                            <span class="demonstration">高度调整</span>
                            <el-slider
                              v-model="element.height"
                              :min="10"
                              show-input
                              show-stops
                              :step="10"
                            />
                          </span>
                        </el-card>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div v-if="customizing" class="widgets-aside">
      <el-container>
        <el-header>
          <div class="widgets-aside-title">首页定制</div>
          <div class="widgets-aside-close" @click="close()">
            <el-icon><Close /></el-icon>
          </div>
        </el-header>
        <div class="themeBox">
          <theme @restore-default="restoreDefault" @save-theme="saveTheme" />
        </div>
        <el-header>
          <div class="widgets-aside-title">
            <el-icon><CirclePlusFilled /></el-icon>
            添加部件
          </div>
        </el-header>
        <el-header style="height: auto">
          <div class="selectLayout">
            <div
              class="selectLayout-item item01"
              :class="{ active: grid.layout.join(',') == '12,6,6' }"
              @click="setLayout([12, 6, 6])"
            >
              <el-row :gutter="2">
                <el-col :span="12"><span></span></el-col>
                <el-col :span="6"><span></span></el-col>
                <el-col :span="6"><span></span></el-col>
              </el-row>
            </div>
            <div
              class="selectLayout-item item02"
              :class="{ active: grid.layout.join(',') == '24,16,8' }"
              @click="setLayout([24, 16, 8])"
            >
              <el-row :gutter="2">
                <el-col :span="24"><span></span></el-col>
                <el-col :span="16"><span></span></el-col>
                <el-col :span="8"><span></span></el-col>
              </el-row>
            </div>
            <div
              class="selectLayout-item item03"
              :class="{ active: grid.layout.join(',') == '24' }"
              @click="setLayout([24])"
            >
              <el-row :gutter="2">
                <el-col :span="24"><span></span></el-col>
                <el-col :span="24"><span></span></el-col>
                <el-col :span="24"><span></span></el-col>
              </el-row>
            </div>
            <div
              class="selectLayout-item item04"
              :class="{ active: grid.layout.join(',') == '24,12,12' }"
              @click="setLayout([24, 12, 12])"
            >
              <el-row :gutter="2">
                <el-col :span="24"><span></span></el-col>
                <el-col :span="12"><span></span></el-col>
                <el-col :span="12"><span></span></el-col>
              </el-row>
            </div>
          </div>
        </el-header>
        <el-main class="nopadding" :style="{ height: widgetHeight }">
          <div class="widgets-list">
            <div v-if="myCompsList.length <= 0" class="widgets-list-nodata">
              <el-empty
                :description="$abT('page.portal.noComponents','没有部件啦')"
                :image-size="60"
              />
            </div>
            <div class="demo-collapse">
              <el-collapse v-model="activeNames" accordion>
                <el-collapse-item
                  v-for="item in myCompsList"
                  :key="item.key"
                  :name="item.key"
                  :title="item.typeCodeName"
                >
                  <template
                    v-for="(listitem, index) in item.list"
                    :key="listitem.code"
                  >
                    <div v-if="!listitem.disabled" class="widgets-list-item">
                      <div class="item-info">
                        <h2>{{ listitem.name }}</h2>
                        <p>{{ listitem.remark }}</p>
                      </div>
                      <div class="item-actions">
                        <el-button
                          size="small"
                          type="primary"
                          @click="push(listitem, index)"
                        >
                          <el-icon><Plus /></el-icon>
                        </el-button>
                      </div>
                    </div>
                  </template>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import { get, set } from '@/utils/tool'
  import {
    Check,
    CirclePlusFilled,
    Close,
    Edit,
    Plus,
  } from '@element-plus/icons-vue'
  import draggable from 'vuedraggable'
  import { cmsApi, getData, postData } from '~/agilebpm'
  import theme from '../theme/index.vue'
  import allComps from './components'
  export default {
    components: {
      draggable,
      theme,
      Check,
      Edit,
      CirclePlusFilled,
      Close,
      Plus,
    },
    emits: ['on-mounted'],
    data() {
      return {
        value1: 0,
        activeNames: '',
        containerHeight: '100%',
        customizing: false,
        allComps: allComps,
        selectLayout: [],
        defaultGrid: {
          //默认分栏数量和宽度 例如 [24] [18,6] [8,8,8] [6,12,6]
          layout: [12, 6, 6],
          //小组件分布，com取值:views/home/components 文件名
          copmsList: [[], [], []],
        },
        grid: [],
        //个人配置对象，用来保存时候用的
        gribObj: {},
        layout: '',
        widgetHeight: `${window.innerHeight - 587}px`,
        boxIndex: 0,
        myCompsList: [],
      }
    },

    created() {
      getData(cmsApi.homeComponent.getCmsUserConfig).then(
        ({ data }) => {
          this.gribObj = data
          this.grid = JSON.parse(data.contentJson)
        },
        () => {}
      )
    },
    mounted() {
      this.$emit('on-mounted')
    },
    methods: {
      handleTitle(element) {
        let _value
        const arr = this.gribObj.cmsHomeList || []
        if (arr && arr.length > 0) {
          arr.forEach((item) => {
            if (item.code === element) {
              _value = item.name
            }
          })
        }
        return _value
      },
      saveTheme(theme) {
        this.saveFn(theme)
      },
      async restoreDefault() {
        const result = await cmsApi.portal.getDynamicPortal()
        if (result.data.contentJson) {
          this.grid = JSON.parse(result.data.contentJson)
        }
      },
      getuserConfig() {
        cmsApi.homeComponent.getCmsUserConfigAndHomeList(true).then(
          async ({ data }) => {
            this.gribObj = data
            this.grid = JSON.parse(data.contentJson)
            // 缓存中的组件列表
            const myCopmsList = this.grid.copmsList.reduce(function (a, b) {
              return a.concat(b)
            })
            // 给已缓存的组件加上disabled
            this.gribObj.cmsHomeList.forEach((item) => {
              item.width = 100
              const _item = myCopmsList.find((myCopmsListitem) => {
                if (myCopmsListitem && myCopmsListitem.code) {
                  return myCopmsListitem.code === item.code
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

            this.myCompsList = []
            const list = this.setArr(this.gribObj.cmsHomeList)
            for (const key in list) {
              const lista = []
              for (const s in list[key]) {
                if (list[key][s].mobile == 0) {
                  lista.push(list[key][s])
                }
              }
              this.myCompsList.push({
                key: key,
                typeCode: key,
                typeCodeName: list[key][0].typeCodeName,
                list: lista,
              })
            }

            this.activeNames = this.myCompsList[0].key
            // this.saveFn()
          },
          () => {}
        )
      },
      //处理数据
      setArr(data) {
        const newData = {}
        data.forEach((e) => {
          if (Object.keys(newData).indexOf(`${e.typeCode}`) === -1) {
            newData[e.typeCode] = []
          }
          // 对应插入属性值
          newData[e.typeCode].push(e)
        })
        return newData
      },
      //开启自定义
      custom() {
        this.getuserConfig()
        this.customizing = true
        const oldWidth = this.$refs.widgets.offsetWidth
        this.$nextTick(() => {
          const scale = this.$refs.widgets.offsetWidth / oldWidth
          this.$refs.widgets.style.setProperty('transform', `scale(${scale})`)
        })
      },
      //设置布局
      setLayout(layout) {
        this.grid.layout = layout
        if (layout.join(',') == '24') {
          this.grid.copmsList[0] = [
            ...this.grid.copmsList[0],
            ...this.grid.copmsList[1],
            ...this.grid.copmsList[2],
          ]
          this.grid.copmsList[1] = []
          this.grid.copmsList[2] = []
        }
      },
      // 追加
      push(item, index) {
        const target = this.grid.copmsList[this.boxIndex]
        target.push({
          objName: item.objName,
          code: item.code,
          width: item.width,
          type: item.type,
        })
        this.myCompsList.forEach((element, index) => {
          element.list.forEach((el, elIndex) => {
            if (item.code === el.code) {
              el.disabled = true
            }
          })
        })
      },
      //隐藏组件
      removez(item) {
        this.myCompsList.forEach((element, index) => {
          element.list.forEach((el, elIndex) => {
            if (el.code === item) {
              el.disabled = false
            }
          })
        })
        const newCopmsList = this.grid.copmsList
        newCopmsList.forEach((obj, index) => {
          const newObj = obj.filter((o) => o.code != item)
          newCopmsList[index] = newObj
        })
      },
      //保存
      save() {
        this.customizing = false
        this.$refs.widgets.style.removeProperty('transform')
        this.saveFn(get('theme'))
      },
      saveFn(theme) {
        postData(cmsApi.homeComponent.saveOrUpdateCmsUserConfig, {
          id: this.gribObj.id,
          layout: theme.layout || 'column',
          themeName: theme.themeName || 'blue-white',
          language: 'c',
          dark: '0',
          contentJson: JSON.stringify(this.grid),
        }).then(
          (result) => {
            set('grid', this.grid)
          },
          () => {}
        )
      },
      //恢复默认
      // backDefaul() {
      //   this.customizing = false
      //   this.$refs.widgets.style.removeProperty('transform')
      //   this.grid = JSON.parse(JSON.stringify(this.defaultGrid))
      //   remove('grid')
      // },
      //关闭
      close() {
        this.customizing = false
        this.$refs.widgets.style.removeProperty('transform')
      },
      //
      sort(item) {},
      clickFn(item, index) {
        if (this.customizing) {
          const box = document.getElementsByClassName('draggable-box')
          box.forEach((a) => {
            a.style.borderColor = '#1890ff'
          })
          this.boxIndex = index
          box[index].style.borderColor = 'red'
        }
      },
    },
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
    padding: 15px;
    overflow: auto;
    overflow-x: hidden;
  }
  .widgets-aside {
    position: relative;
    width: 360px;
    overflow: auto;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    .el-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 13px 15px;
      background: #fff;
      border-bottom: 1px solid #e6e6e6;
    }
    .el-footer {
      padding: 13px 15px;
      background: #fff;
      border-top: 1px solid #e6e6e6;
    }
  }
  .widgets-aside-title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }
  .widgets-aside-title i {
    margin-right: 10px;
    font-size: 18px;
  }
  .widgets-aside-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 3px;
  }
  .widgets-aside-close:hover {
    background: rgba(180, 180, 180, 0.1);
  }

  .widgets-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .widgets-top-title {
    font-size: 18px;
    font-weight: bold;
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
    padding-bottom: 15px;
  }
  .customizing .widgets-wrapper .draggable-box {
    padding: 15px;
    border: 1px dashed var(--el-color-primary);
  }
  .customizing .widgets-wrapper .no-widgets {
    display: none;
  }
  .customizing .widgets-item {
    position: relative;
    margin-bottom: 15px;
  }
  .customize-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: move;
    background: rgba(255, 255, 255, 0.9);
  }
  .customize-overlay label {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    padding: 0 30px;
    font-size: 18px;
    color: #fff;
    cursor: move;
    background: var(--el-color-primary);
    border-radius: 40px;
  }
  .customize-overlay label i {
    margin-right: 15px;
    font-size: 24px;
  }
  .customize-overlay .close {
    position: absolute;
    top: 15px;
    right: 15px;
  }
  .customize-overlay .close:focus,
  .customize-overlay .close:hover {
  }
  .themeBox {
    padding: 13px 15px;
  }
  .nopadding {
    padding: 0;
  }
  .widgets-list {
    padding: 13px 15px;
  }
  .widgets-list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px;
  }
  .widgets-list-item .item-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-right: 15px;
    font-size: 18px;
    color: #6a8bad;
    background: rgba(180, 180, 180, 0.1);
    border-radius: 50%;
  }
  .widgets-list-item .item-info {
    flex: 1;
  }
  .widgets-list-item .item-info h2 {
    margin: 4px 0 0 0;
    font-size: 14px;
    font-weight: normal;
    cursor: default;
  }
  .widgets-list-item .item-info p {
    margin: 0;
    font-size: 12px;
    color: #999;
    cursor: default;
  }
  .widgets-list-item:hover {
    background: rgba(180, 180, 180, 0.1);
  }

  .widgets-wrapper .sortable-ghost {
    opacity: 0.5;
  }

  .selectLayout {
    display: flex;
    width: 100%;
  }
  .selectLayout-item {
    width: 60px;
    height: 60px;
    padding: 5px;
    margin-right: 15px;
    cursor: pointer;
    border: 2px solid var(--el-border-color-light);
  }
  .selectLayout-item span {
    display: block;
    height: 46px;
    background: var(--el-border-color-light);
  }
  .selectLayout-item.item02 span {
    height: 30px;
  }

  .selectLayout-item.item02 .el-col:nth-child(1) span {
    height: 14px;
    margin-bottom: 2px;
  }
  .selectLayout-item.item03 span {
    height: 14px;
    margin-bottom: 2px;
  }

  .selectLayout-item.item04 span {
    height: 30px;
  }
  .selectLayout-item.item04 .el-col:nth-child(1) span {
    height: 14px;
    margin-bottom: 2px;
  }
  .selectLayout-item:hover {
    border-color: var(--el-color-primary);
  }
  .selectLayout-item.active {
    border-color: var(--el-color-primary);
  }
  .selectLayout-item.active span {
    background: var(--el-color-primary);
  }

  [data-theme='dark'] {
    .widgets-aside {
      background: #2b2b2b;
    }
    .customize-overlay {
      background: rgba(43, 43, 43, 0.9);
    }
  }

  @media (max-width: 992px) {
    .customizing .widgets {
      transform: scale(1) !important;
    }
    .customizing .widgets-aside {
      position: absolute;
      top: 50%;
      right: 0;
      bottom: 0;
      width: 100%;
    }
    .customizing .widgets-wrapper {
      margin-right: 0;
    }
  }
  .slider-demo-block {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 350px;
    padding: 10px;
    margin-top: 20px;
    .demonstration {
      font-size: 16px;
    }
  }
  // .slider-demo-block .el-slider {
  //   margin-top: 0;
  //   margin-left: 12px;
  // }
  // .slider-demo-block .demonstration {
  //   flex: 1;
  //   margin-bottom: 0;
  //   overflow: hidden;
  //   font-size: 14px;
  //   line-height: 44px;
  //   color: var(--el-text-color-secondary);
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  // }
  // .slider-demo-block .demonstration + .el-slider {
  //   flex: 0 0 70%;
  // }
</style>
