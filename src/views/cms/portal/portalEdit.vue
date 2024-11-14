<template>
  <el-container
    class="layout-container-demo"
    style="padding: 0px; background: #f6f8f9"
  >
    <el-header style="padding: 8px 12px 8px 8px; background: #f6f8f9">
      <ab-save
        back-name="PortalList"
        :before-save-fn="saveFn"
        :disabled="!id && !info.customizing"
        :form-ref="formRef"
        :save-data="info.data"
        :url="cmsApi.portal.cmsPortalSaveOrUpdateUrl"
      >
        <el-button
          v-if="info.customizing"
          :icon="View"
          type="primary"
          @click="view"
        >
          {{ $abT('page.common.preview','预览') }}
        </el-button>
        <el-button v-else :icon="Edit" type="primary" @click="custom">
          {{ $abT('page.common.edit','编辑') }}
        </el-button>
      </ab-save>
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <div
        ref="main"
        :class="['widgets-home', info.customizing ? 'customizing' : '']"
      >
        <el-card v-if="info.customizing" class="widgets-aside" shadow="hover">
          <div v-if="info.customizing">
            <el-container>
              <div class="themeBox">
                <el-form
                  ref="formRef"
                  label-suffix="："
                  label-width="70px"
                  :model="info.data"
                  :status-icon="false"
                >
                  <el-form-item
                    :label="$abT('page.common.name','名称')"
                    prop="name"
                    :rules="[
                      { required: true, message: $abT('page.common.required','必填') },
                    ]"
                  >
                    <ab-pinyin
                      v-model="info.data.name"
                      v-model:to="info.data.code"
                    />
                  </el-form-item>
                  <el-form-item
                    :label="$abT('page.common.code','编码')"
                    prop="code"
                    :rules="[
                      { required: true, message: $abT('page.common.required','必填') },
                      info.validatorMap,
                    ]"
                  >
                    <ab-code
                      v-model="info.data.code"
                      :disabled="$route.query.id && !proxy.$route.query.copy"
                    />
                  </el-form-item>
                  <el-form-item :label="$abT('page.common.enable','启用')" prop="status">
                    <el-switch
                      v-model="info.data.status"
                      :active-value="1"
                      :inactive-value="0"
                    />
                  </el-form-item>
                  <el-form-item prop="mobile">
                    <template #label>
                      <div>
                        {{ $abT('page.common.mobile','移动端') }}
                        <el-tooltip
                          :content="$abT('page.portal.mobileTip','是否为移动端门户。（移动端门户时，必须指定具体的移动端系统应用）')"
                          effect="dark"
                          placement="top-start"
                        >
                          <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-switch
                      v-model="info.data.mobile"
                      :active-value="1"
                      :disabled="info.data.id"
                      :inactive-value="0"
                      @change="changeMobile"
                    />
                  </el-form-item>
                  <el-form-item>
                    <template #label>
                      <div>
                        {{ $abT('page.portal.layout','布局') }}
                        <el-tooltip
                          :content="$abT('page.portal.layoutTip','仅在此门户作为首页时生效')"
                          effect="dark"
                          placement="top-start"
                        >
                          <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-select v-model="info.data.layout">
                      <el-option
                        :label="$abT('page.portal.columns','分栏')"
                        value="column"
                      />
                      <el-option
                        :label="$abT('page.portal.comprehensive','综合')"
                        value="comprehensive"
                      />
                      <el-option
                        :label="$abT('page.portal.portrait','纵向')"
                        value="vertical"
                      />
                      <el-option
                        :label="$abT('page.portal.transverse','横向')"
                        value="horizontal"
                      />
                      <el-option
                        :label="$abT('page.portal.routine','常规')"
                        value="common"
                      />
                      <el-option
                        :label="$abT('page.portal.float','浮动')"
                        value="float"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <template #label>
                      <div>
                        {{ $abT('page.portal.theme','主题') }}
                        <el-tooltip
                          :content="$abT('page.portal.layoutTip','仅在此门户作为首页时生效')"
                          effect="dark"
                          placement="top-start"
                        >
                          <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-select v-model="info.data.themeName">
                      <el-option
                        :label="$abT('page.portal.blueWhite','蓝白')"
                        value="blue-white"
                      />
                      <el-option
                        :label="$abT('page.portal.blueBlack','蓝黑')"
                        value="blue-black"
                      />
                      <el-option
                        :label="$abT('page.portal.greenWhite','绿白')"
                        value="green-white"
                      />
                      <el-option
                        :label="$abT('page.portal.greenBlack','绿黑')"
                        value="green-black"
                      />
                      <el-option
                        :label="$abT('page.portal.purpleWhite','紫白')"
                        value="purple-white"
                      />
                      <el-option
                        :label="$abT('page.portal.purpleBlack','紫黑')"
                        value="purple-black"
                      />
                      <el-option
                        :label="$abT('page.portal.redWhite','红白')"
                        value="red-white"
                      />
                      <el-option
                        :label="$abT('page.portal.redBlack','红黑')"
                        value="red-black"
                      />
                      <el-option
                        :label="$abT('page.portal.gradient','渐变')"
                        value="ocean"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="info.data.mobile"
                    :label="$abT('page.common.system','系统')"
                    prop="mobileApplication"
                    :rules="[
                      { required: true, message: $abT('page.common.required','必填') },
                    ]"
                  >
                    <el-select
                      v-model="info.data.mobileApplication"
                      class="selectstyle"
                    >
                      <el-option
                        v-for="item in info.selectoption"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$abT('page.common.remark','备注')" prop="remark">
                    <el-input
                      v-model="info.data.remark"
                      rows="2"
                      type="textarea"
                    />
                  </el-form-item>
                </el-form>
              </div>

              <el-header style="height: auto">
                <div class="selectLayout">
                  <div
                    class="selectLayout-item"
                    :class="{ active: info.grid.layout.join(',') == '24' }"
                    @click="setLayout([24])"
                  >
                    <el-row :gutter="3">
                      <el-col :span="24"><span></span></el-col>
                    </el-row>
                  </div>
                  <div
                    class="selectLayout-item item02"
                    :class="{ active: info.grid.layout.join(',') == '24,16,8' }"
                    @click="setLayout([24, 16, 8])"
                  >
                    <el-row :gutter="2">
                      <el-col :span="24"><span></span></el-col>
                      <el-col :span="16"><span></span></el-col>
                      <el-col :span="8"><span></span></el-col>
                    </el-row>
                  </div>

                  <div
                    class="selectLayout-item item01"
                    :class="{ active: info.grid.layout.join(',') == '12,6,6' }"
                    @click="setLayout([12, 6, 6])"
                  >
                    <el-row :gutter="2">
                      <el-col :span="12"><span></span></el-col>
                      <el-col :span="6"><span></span></el-col>
                      <el-col :span="6"><span></span></el-col>
                    </el-row>
                  </div>
                  <div
                    class="selectLayout-item item04"
                    :class="{
                      active: info.grid.layout.join(',') == '24,12,12',
                    }"
                    style="margin-right: 0"
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
              <el-main
                v-if="info.data.mobile"
                class="nopadding"
                :style="{ height: info.widgetHeight }"
              >
                <div class="widgets-list">
                  <div v-if="mHasComps()" class="widgets-list-nodata">
                    <el-empty
                      :description="$abT('page.portal.noComponents','没有部件啦')"
                      :image-size="60"
                    />
                  </div>
                  <div v-else class="demo-collapse">
                    <el-collapse v-model="info.activeNames" accordion>
                      <el-collapse-item
                        v-for="item in info.myCompsMobileList"
                        :key="item.key"
                        :name="item.key"
                        :title="item.typeCodeName"
                      >
                        <template
                          v-for="listitem in item.list"
                          :key="listitem.code"
                        >
                          <div
                            v-if="!listitem.disabled"
                            class="widgets-list-item"
                          >
                            <div class="item-info">
                              <h2>{{ listitem.name }}</h2>
                              <p>{{ listitem.remark }}</p>
                            </div>
                            <div class="item-actions">
                              <el-button
                                size="small"
                                type="primary"
                                @click="push(listitem)"
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
              <el-main
                v-else
                class="nopadding"
                :style="{ height: info.widgetHeight }"
              >
                <div class="widgets-list">
                  <div v-if="hasComps()" class="widgets-list-nodata">
                    <el-empty
                      :description="$abT('page.portal.noComponents','没有部件啦')"
                      :image-size="60"
                    />
                  </div>
                  <div v-else class="demo-collapse">
                    <el-collapse v-model="info.activeNames" accordion>
                      <el-collapse-item
                        v-for="item in info.myCompsList"
                        :key="item.key"
                        :name="item.key"
                        :title="item.typeCodeName"
                      >
                        <template
                          v-for="listitem in item.list"
                          :key="listitem.code"
                        >
                          <div
                            v-if="!listitem.disabled"
                            class="widgets-list-item"
                          >
                            <div class="item-info">
                              <h2>{{ listitem.name }}</h2>
                              <p>{{ listitem.remark }}</p>
                            </div>
                            <div class="item-actions">
                              <el-button
                                size="small"
                                type="primary"
                                @click="push(listitem)"
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
        </el-card>
        <div class="widgets-content">
          <div ref="widgetsRef" class="widgets">
            <div class="widgets-wrapper">
              <div
                v-if="
                  info.grid.copmsList &&
                  JSON.stringify(info.grid.copmsList) === '[[],[],[]]'
                "
                class="no-widgets"
              >
                <el-empty
                  :description="$abT('page.portal.noComponents','没有部件啦')"
                  :image-size="280"
                />
              </div>
              <div
                v-if="info.data.mobile && !info.customizing"
                class="no-widgets"
              >
                <el-empty
                  :description="$abT('page.portal.mobileNotPreview','移动端门户不支持预览！')"
                  :image-size="280"
                />
              </div>
              <el-row v-else :gutter="15">
                <el-col
                  v-for="(item, index) in info.grid.layout"
                  :key="index"
                  :md="item"
                  :style="[
                    'margin-bottom: 15px',
                    info.customizing ? '' : 'pointer-events: none',
                  ]"
                  :xs="24"
                  @click="clickFn(item, index)"
                >
                  <draggable
                    v-if="info.flag"
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
                          padding: info.data.mobile ? '50px' : '6px',
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
                        />
                        <div v-if="info.customizing" class="customize-overlay">
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
                              <span class="demonstration">
                                {{ $abT('page.portal.width','宽度调整') }}
                              </span>
                              <el-slider
                                v-model="element.width"
                                :min="10"
                                show-input
                                show-stops
                                :step="10"
                              />
                              <span
                                v-if="
                                  ['AbEcharts'].includes(element.objName) ||
                                  element.type == 'iFrame'
                                "
                              >
                                <span class="demonstration">
                                  {{ $abT('page.portal.height','高度调整') }}
                                </span>
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
                  <div v-else>
                    <el-card shadow="never">
                      <el-skeleton :rows="1" />
                    </el-card>
                    <el-card shadow="never" style="margin-top: 15px">
                      <el-skeleton />
                    </el-card>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import allComps from '@/views/index/widgets/components'
  import {
    Close,
    Edit,
    Plus,
    QuestionFilled,
    View,
  } from '@element-plus/icons-vue'
  import draggable from 'vuedraggable'
  import { abTools, bizApi, cmsApi, sysApi } from '~/agilebpm'
  const { proxy } = abTools.useCurrentInstance()
  const widgetsRef = ref()
  const formRef = ref()
  const info = reactive({
    activeNames: '', //组件的名称
    customizing: false,
    allComps: allComps,
    defaultGrid: {
      //默认分栏数量和宽度 例如 [24] [18,6] [8,8,8] [6,12,6]
      layout: [24],
      //小组件分布，com取值:views/home/components 文件名
      copmsList: [[], [], []],
    },
    grid: [] as any,
    gribObj: {} as any,
    widgetHeight: `${window.innerHeight - 587}px`,
    boxIndex: 0,
    myCompsList: [] as any,
    myCompsMobileList: [] as any,
    flag: false,

    validatorMap: {},
    data: {
      name: '',
      code: '',
      layout: 'column',
      themeName: 'blue-white',
      remark: '',
      mobile: 0,
      status: 1,
      mobileApplication: '',
    } as any,
    selectoption: [] as any[],
  })

  //编码获取校验
  bizApi.bizPattern
    .getAllBizValidator()
    .then((data: any) => (info.validatorMap = data.varirule.rule))

  if (!info.selectoption || info.selectoption.length == 0) {
    sysApi.authApplication
      .mobileApplication()
      .then((res) => (info.selectoption = res.data))
  }

  info.grid = JSON.parse(JSON.stringify(info.defaultGrid))

  //获取路由上id，用来判断是新增还是修改
  const id = proxy.$route.query.id

  //有ID则为编辑或复制则回显数据+组件列表
  if (id) {
    cmsApi.portal.getPortalById(id).then((rel: any) => {
      info.data = rel.data
      if (info.data.contentJson) {
        info.grid = JSON.parse(info.data.contentJson)
      }
      //复制则覆盖ID名称和编码
      if (proxy.$route.query.copy) {
        info.data.id = null
        info.data.name = `${info.data.name}_复制`
        info.data.code = `${info.data.code}_copy`
        info.data.isSystem = 0
      }
      initComponent()
    })
    //新增则只获取组件列表
  } else {
    cmsApi.homeComponent.getHomeComponentList().then((rel: any) => {
      info.data.cmsHomeList = rel.data
      initComponent()
    })
  }

  onMounted(() => {
    custom()
  })

  const handleTitle = (element: any) => {
    const component = info.data.cmsHomeList.find(
      (item: any) => item.code === element
    )
    if (component && component.name) {
      return component.name
    } else return '-'
  }

  //处理数据
  const setArr = (data: any[]) => {
    const newData = {}
    data.forEach((e: { typeCode: string | number }) => {
      if (Object.keys(newData).indexOf(`${e.typeCode}`) === -1) {
        newData[e.typeCode] = []
      }
      // 对应插入属性值
      newData[e.typeCode].push(e)
    })
    return newData
  }

  //设置布局
  const setLayout = (layout: any[]) => {
    info.grid.layout = layout
    if (layout.join(',') == '24') {
      info.grid.copmsList[0] = [
        ...info.grid.copmsList[0],
        ...info.grid.copmsList[1],
        ...info.grid.copmsList[2],
      ]
      info.grid.copmsList[1] = []
      info.grid.copmsList[2] = []
    }
  }

  // 追加
  const push = (item: any) => {
    const target = info.grid.copmsList[info.boxIndex]
    target.push({
      code: item.code,
      objName: item.objName,
      width: item.width,
      height: item.height,
      type: item.type,
    })
    const arr = info.data.mobile ? info.myCompsMobileList : info.myCompsList
    arr.forEach((element: any, index: any) => {
      element.list.forEach((el: any, elIndex: any) => {
        if (item.code === el.code) {
          el.disabled = true
        }
      })
    })
  }

  //隐藏组件
  const removez = (item: any) => {
    const arr = info.data.mobile ? info.myCompsMobileList : info.myCompsList
    arr.forEach((element: { list: any[] }, index: any) => {
      element.list.forEach((el: any, elIndex: any) => {
        if (el.code === item) {
          el.disabled = false
        }
      })
    })
    const newCopmsList = info.grid.copmsList
    newCopmsList.forEach((obj: any[], index: string | number) => {
      const newObj = obj.filter((o: any) => o.code != item)
      newCopmsList[index] = newObj
    })
  }

  //开启自定义
  const custom = () => {
    info.customizing = true
    const oldWidth = widgetsRef.value.offsetWidth
    nextTick(() => {
      const scale = widgetsRef.value.offsetWidth / oldWidth
      widgetsRef.value.style.setProperty('transform', `scale(${scale})`)
    })
  }
  //预览
  const view = () => {
    info.customizing = false
    widgetsRef.value.style.removeProperty('transform')
    // saveFn()
  }
  //保存前的赋值
  const saveFn = () => {
    info.data.contentJson = JSON.stringify(info.grid)
  }
  const clickFn = (item: any, index: number) => {
    if (info.customizing) {
      const box = document.getElementsByClassName('draggable-box')
      box.forEach((a: { style: { borderColor: string } }) => {
        a.style.borderColor = '#9a9a9a'
      })
      info.boxIndex = index
      box[index].style.borderColor = '#1890ff'
    }
  }

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
        item.height = 100
        const flag = myCopmsList.find((copmsItem: any) => {
          if (copmsItem && copmsItem.code) {
            return copmsItem.code === item.code
          } else {
            return false
          }
        })
        item.disabled = flag
      })

      info.myCompsList = []
      info.myCompsMobileList = []
      const list = setArr(info.data.cmsHomeList)

      for (const key in list) {
        const pcList = []
        const mobileList = []
        for (const s in list[key]) {
          if (list[key][s].mobile === 1) {
            mobileList.push(list[key][s])
          } else {
            pcList.push(list[key][s])
          }
        }
        if (mobileList && mobileList.length > 0) {
          info.myCompsMobileList.push({
            key: key,
            typeCode: key,
            typeCodeName: list[key][0].typeCodeName,
            list: mobileList,
          })
        }
        if (pcList && pcList.length > 0) {
          info.myCompsList.push({
            key: key,
            typeCode: key,
            typeCodeName: list[key][0].typeCodeName,
            list: pcList,
          })
        }
      }
      //默认展开组件为移动端还是其他端
      if (
        info.data.mobile &&
        info.myCompsMobileList &&
        info.myCompsMobileList.length > 0
      ) {
        info.activeNames = info.myCompsMobileList[0].key
      }
      if (
        !info.data.mobile &&
        info.myCompsList &&
        info.myCompsList.length > 0
      ) {
        info.activeNames = info.myCompsList[0].key
      }
    }

    // saveFn()
    info.flag = true
  }

  const changeMobile = (val: any) => {
    if (val === 0) {
      info.data.mobileApplication = null
      info.activeNames = info.myCompsList[0].key
    } else {
      if (info.myCompsMobileList && info.myCompsMobileList.length > 0) {
        info.activeNames = info.myCompsMobileList[0].key
      }
    }
    const target = info.grid.copmsList
    for (const s in target) {
      target[s] = []
    }
    const arr = val ? info.myCompsList : info.myCompsMobileList
    arr.forEach((element: any) => {
      element.list.forEach((el: any) => {
        el.disabled = false
      })
    })
  }

  //判断是否有数据
  const hasComps = () => {
    if (info.myCompsList.length === 0) {
      return true
    }
    let flag = true
    info.myCompsList.forEach((element: any) => {
      element.list.forEach((el: any) => {
        if (el.disabled != flag) {
          flag = false
        }
      })
    })
    return flag
  }

  const mHasComps = () => {
    if (info.myCompsMobileList.length === 0) {
      return true
    }
    let flag = true
    info.myCompsMobileList.forEach((element: any) => {
      element.list.forEach((el: any) => {
        if (el.disabled != flag) {
          flag = false
        }
      })
    })
    return flag
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
    padding: 0 0;
    margin-right: 20px;
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
</style>
