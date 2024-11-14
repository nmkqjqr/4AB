<template>
  <div class="layout-container-demo">
    <el-container>
      <el-main
        :class="[info.data.type === 'chart' ? 'customizing' : 'customizing2']"
        :style="{ height: info.widgetHeight }"
      >
        <el-container>
          <el-header>
            <router-link
              v-if="onlyRead"
              :to="{
                name: 'HomeComponentList',
              }"
            >
              <el-button :icon="Back">
                {{ $abT('page.common.back', '返回') }}
              </el-button>
            </router-link>
            <ab-save
              v-else
              back-name="HomeComponentList"
              :before-save-fn="beforeSaveFn"
              :form-ref="formRef"
              :save-data="info.data"
              :url="cmsApi.homeComponent.cmsHomeSaveOrUpdateUrl"
            />
          </el-header>
          <el-main>
            <el-form
              ref="formRef"
              label-suffix="："
              label-width="110px"
              :model="info.data"
              :status-icon="false"
              style="min-height: 100%"
            >
              <el-form-item
                :label="$abT('page.common.name', '名称')"
                prop="name"
                :rules="[
                  {
                    required: true,
                    message: $abT('page.common.required', '必填'),
                  },
                ]"
              >
                <ab-pinyin
                  v-model="info.data.name"
                  v-model:to="info.data.code"
                  :disabled="onlyRead"
                  style="width: 90%"
                  :style="[
                    info.data.type === 'chart' ? 'width: 90%' : 'width: 70%',
                  ]"
                />
              </el-form-item>
              <el-form-item
                :label="$abT('page.common.code', '编码')"
                prop="code"
                :rules="[
                  {
                    required: true,
                    message: $abT('page.common.required', '必填'),
                  },
                  info.validatorMap,
                ]"
              >
                <ab-code
                  v-model="info.data.code"
                  :disabled="info.data.id"
                  :style="[
                    info.data.type === 'chart' ? 'width: 90%' : 'width: 70%',
                  ]"
                />
              </el-form-item>
              <el-form-item
                :label="$abT('page.common.enable', '启用')"
                prop="enable"
                :rules="[
                  {
                    required: true,
                    message: $abT('page.common.required', '必填'),
                  },
                ]"
              >
                <el-switch
                  v-model="info.data.enable"
                  :active-value="1"
                  :disabled="onlyRead"
                  :inactive-value="0"
                  :rules="[
                    {
                      required: true,
                      message: $abT('page.common.required', '必填'),
                    },
                  ]"
                />
              </el-form-item>
              <el-form-item
                :label="$abT('page.common.mobile', '移动端')"
                prop="mobile"
                :rules="[
                  {
                    required: true,
                    message: $abT('page.common.required', '必填'),
                  },
                ]"
              >
                <el-switch
                  v-model="info.data.mobile"
                  :active-value="1"
                  :disabled="onlyRead"
                  :inactive-value="0"
                  :rules="[
                    {
                      required: true,
                      message: $abT('page.common.required', '必填'),
                    },
                  ]"
                />
              </el-form-item>
              <el-form-item
                :label="$abT('page.common.dict', '字典分类')"
                prop="typeCode"
                :rules="[
                  {
                    required: true,
                    message: $abT('page.common.required', '必填'),
                  },
                ]"
              >
                <ab-select-tree
                  v-model="info.data.typeCode"
                  :disabled="onlyRead"
                  :style="{ width: info.data.type === 'chart' ? '90%' : '70%' }"
                  type-code="homeType"
                />
              </el-form-item>

              <el-form-item
                :label="$abT('page.common.type', '类型')"
                prop="type"
                :rules="[
                  {
                    required: true,
                    message: $abT('page.common.required', '必填'),
                  },
                ]"
              >
                <el-select
                  v-model="info.data.type"
                  :disabled="onlyRead"
                  :style="[
                    info.data.type === 'chart' ? 'width: 90%' : 'width: 70%',
                  ]"
                  @change="changeType"
                >
                  <el-option
                    :label="$abT('page.homeComponent.chart', '图表')"
                    value="chart"
                  />
                  <el-option
                    :label="
                      $abT('page.homeComponent.innerComponent', '内置组件')
                    "
                    value="inner"
                  />
                  <el-option label="iFrame" value="iFrame" />
                </el-select>
              </el-form-item>

              <el-form-item
                v-if="info.data.type === 'iFrame'"
                label="iFrame"
                prop="objName"
                :rules="[
                  {
                    required: true,
                    message: $abT('page.common.required', '必填'),
                  },
                ]"
              >
                <el-input
                  v-model="info.data.objName"
                  :disabled="onlyRead"
                  :style="[
                    info.data.type === 'chart' ? 'width: 90%' : 'width: 70%',
                  ]"
                />
              </el-form-item>
              <el-form-item
                v-if="info.data.type === 'inner'"
                :label="$abT('page.homeComponent.innerComponent', '内置组件')"
                prop="objName"
                :rules="[
                  {
                    required: true,
                    message: $abT('page.common.required', '必填'),
                  },
                ]"
              >
                <el-input
                  v-model="info.data.objName"
                  :disabled="onlyRead"
                  :style="[
                    info.data.type === 'chart' ? 'width: 90%' : 'width: 70%',
                  ]"
                />
              </el-form-item>
              <el-form-item
                :label="$abT('page.common.remark', '备注')"
                prop="remark"
              >
                <el-input
                  v-model="info.data.remark"
                  :disabled="onlyRead"
                  rows="3"
                  :style="[
                    info.data.type === 'chart' ? 'width: 90%' : 'width: 70%',
                  ]"
                  type="textarea"
                />
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </el-main>
      <el-main
        v-if="info.data.type === 'chart'"
        :class="[info.data.type === 'chart' ? 'customizing' : 'customizing2']"
        :style="{ height: info.widgetHeight }"
      >
        <h2 style="margin-bottom: 15px; margin-left: 8px">
          {{ $abT('page.homeComponent.ChartConfig', '图表配置') }}
        </h2>
        <el-form
          ref="charFormRef"
          label-suffix="："
          label-width="120px"
          :model="info.data.cmsChart"
          :status-icon="false"
        >
          <el-form-item
            :label="$abT('page.homeComponent.dataSources', '数据来源')"
            prop="source"
          >
            <el-select
              v-model="info.data.cmsChart.source"
              :disabled="onlyRead"
              style="width: 90%"
              @change="changeSource"
            >
              <el-option
                :label="$abT('page.common.custDialog', '自定义对话框')"
                value="custDialog"
              />
              <el-option
                :label="$abT('page.common.custGrid', '自定义列表')"
                value="custGrid"
              />
              <el-option
                :label="$abT('page.common.custEchart', '自定义echarts')"
                value="custEchart"
              />
            </el-select>
          </el-form-item>
          <div
            v-if="
              info.data.cmsChart.source &&
              info.data.cmsChart.source != 'custEchart'
            "
          >
            <el-form-item
              :label="
                info.data.cmsChart.source == 'custDialog'
                  ? $abT('page.common.custDialog', '自定义对话框')
                  : $abT('page.common.custGrid', '自定义列表')
              "
            >
              <div v-if="info.data.cmsChart.relCode" style="margin-right: 10px">
                <el-tag :closable="!onlyRead" @close="cleranRel">
                  {{ info.data.cmsChart.relName }}
                </el-tag>
              </div>

              <ab-cust-dialog
                v-model="info.data.cmsChart.relCode"
                :dialog-key="info.data.cmsChart.source"
                :dialog-setting="{ multiple: 0 }"
                :disabled="onlyRead"
                :icon="Search"
                round
                size="small"
                type="primary"
                @ok="dialogOk"
              >
                {{ $abT('page.common.select', '选择') }}
              </ab-cust-dialog>
            </el-form-item>

            <el-form-item :label="$abT('page.common.type', '类型')">
              <span
                v-for="item in echarsType"
                :key="item"
                :label="item"
                style="margin-right: 22px; margin-bottom: 15px"
                :value="item"
              >
                <ab-icon :icon="item" @click="changeEcharsType(item)" />
              </span>
            </el-form-item>

            <!-- 各组件类型特有配置 -->
            <span
              v-if="
                info.data.cmsChart.type &&
                info.data.cmsChart.source &&
                info.data.cmsChart.source != 'custEchart'
              "
            >
              <component
                :is="allEcharts[getComponent()]"
                ref="componentRef"
                :info="info"
                :init-echarts="initEcharts"
                :only-read="onlyRead"
              />
            </span>
          </div>
          <div
            v-if="info.data.cmsChart.source === 'custEchart'"
            style="max-width: 700px; margin-left: 30px"
          >
            <span
              style="
                box-sizing: border-box;
                display: inline-flex;
                flex: 0 0 auto;
                align-items: flex-start;
                justify-content: flex-end;
                height: 32px;
                padding: 0 12px 0 0;
                padding-bottom: 20px;
                font-size: var(--el-form-label-font-size);
                line-height: 32px;
                color: var(--el-text-color-regular);
              "
            >
              {{ $abT('page.homeComponent.chart', '图表') }} Json：
            </span>
            <codemirror
              v-model="info.data.cmsChart.chartsJson"
              :autofocus="true"
              :disabled="onlyRead"
              :indent-with-tab="true"
              :style="{
                height: `500px`,
                border: `1px solid #e4e7ed`,
                width: `92%`,
              }"
              @change="changeCodemirror"
            />
          </div>
        </el-form>
      </el-main>
      <el-main
        style="
          overflow-x: hidden;
          overflow-y: hidden;
          background-color: #f5f7f9;
        "
        :style="{ height: info.widgetHeight }"
      >
        <div
          v-if="info.data.type === 'inner'"
          style="
            align-items: center;
            justify-content: center;
            height: 500px;
            padding: 60px;
            margin: auto;
            pointer-events: none;
          "
        >
          <component :is="allComps[info.data.objName]" />
        </div>
        <span v-if="info.data.type === 'chart'">
          <echarts-view
            v-if="info.data.cmsChart.source == 'custEchart'"
            ref="echartsRef"
            :height="80"
          />
          <echarts-view v-else ref="echartsRef" :height="80" />
        </span>
        <span v-if="info.data.type === 'iFrame'">
          <el-card shadow="hover">
            <iframe
              :src="info.data.objName"
              :style="{
                width: '100%',
                height: 9 * 80 + 'px',
                margin: '0',
                border: '0',
              }"
            ></iframe>
          </el-card>
        </span>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import allComps from '@/views/index/widgets/components'
  import { Back, Search } from '@element-plus/icons-vue'
  import { Codemirror } from 'vue-codemirror'
  import { bizApi, cmsApi } from '~/agilebpm'
  import abIcon from './components/AbIcon.vue'
  import echartsView from './components/echartsView.vue'
  import allEcharts from './config'

  const formRef = ref()
  const echartsRef = ref()
  const charFormRef = ref()
  const componentRef = ref()
  const info: any = reactive({
    widgetHeight: `${window.innerHeight - 205}px`,
    validatorMap: {},
    data: {
      enable: 1,
      mobile: 0,
      cmsChart: {
        source: '',
        chartsJson: '',
      },
    },
    //自定义数据下的属性列表（/x轴Y轴的数据）
    custSelect: [],
    //echars的数据（自定义对话框/列表的数据）
    echarsData: [],
    //echars的配置数据
    custOpition: {
      xzhou: '',
      yzhou: [],
      xname: '',
      yname: '',
      ztitle: '',
      style: 'xtmr',
      huanxing: false,
      biaozhu: false,
      fontSize: 60,
      jiacu: false,
    },
  })

  const echarsType = ref([
    'bar',
    'pie',
    'line',
    'area',
    'funnel',
    'gauge',
    'number',
  ])

  // @ts-ignore
  const { proxy } = getCurrentInstance()
  //获取路由上id
  const id = proxy.$route.query.id
  //获取路由上type (判断只读/修改)
  const onlyRead = !('1' == proxy?.$route.query.type || proxy.$route.query.copy)

  //获取校验
  bizApi.bizPattern
    .getAllBizValidator()
    .then((data: any) => (info.validatorMap = data.varirule.rule))

  // //获取组件分类(数据字典)
  // sysApi.dict.getDictListByCode('homeType').then((result) => {
  //   info.dictTypeArray = result
  // })

  if (!info.custOpition.limit) {
    info.custOpition.limit = 10
  }

  const getComponent = () => {
    if (['bar', 'line', 'area'].includes(info.data.cmsChart.type)) {
      return 'echarts-bar'
    }
    console.log('info.data.cmsChart.type', info.data.cmsChart.type)
    return `echarts-${info.data.cmsChart.type}`
  }

  const beforeSaveFn = () => {
    console.log('info', info)
    if (info.data.type == 'chart' && info.data.cmsChart.source != 'custEchart')
      info.data.cmsChart.chartsJson = JSON.stringify(info.custOpition)
  }

  //获取数据时同步cmsChart

  if (id) {
    cmsApi.homeComponent.cmsHomeGetFn(id).then((rel) => {
      info.data = rel.data
      //复制则覆盖ID名称和编码
      if (proxy.$route.query.copy) {
        info.data.id = null
        info.data.name = `${info.data.name}_复制`
        info.data.code = `${info.data.code}_copy`
        info.data.cmsChart.id = null
        info.data.cmsChart.homeId = null
      }
      if (info.data.type == 'chart' && info.data.cmsChart) {
        if (info.data.cmsChart.source == 'custEchart') {
          changeCodemirror(info.data.cmsChart.chartsJson)
        } else {
          if (echarsType.value.includes(info.data.cmsChart.type)) {
            echarsType.value[
              echarsType.value.indexOf(info.data.cmsChart.type)
            ] = `${info.data.cmsChart.type}_check`
          }

          //再把获取到的数据转换chartObj为实时数据
          info.custOpition = eval(`(${info.data.cmsChart.chartsJson})`)
        }
      }
    })
  }

  //自定义echars代码框改变时，联动前同步cmsChart
  const changeCodemirror = (json: string) => {
    let option
    try {
      initEcharts(eval(`(${json})`))
    } catch (error) {
      try {
        eval(json)
        initEcharts(option)
      } catch (error) {
        console.log(
          `自定义echart的配置格式不正确，请输入正确的json或js,错误数据为：${json}`
        )
      }
    }
  }

  //渲染echars
  const initEcharts = (obj: any) => {
    nextTick(() => echartsRef.value.init(obj))
  }

  //清除关联的自定义对话框/自定义列表 （切换数据来源时触发）
  const changeSource = (type: string) => {
    cleranRel()
    if (type == 'custEchart') {
      info.data.cmsChart.chartsJson = ''
    }
  }

  const changeEcharsType = (type: string) => {
    //如果是只读下，直接返回
    if (onlyRead) {
      return
    }
    const arr = ['bar', 'pie', 'line', 'area', 'funnel', 'gauge', 'number']
    if (!type.includes('check')) {
      if (arr.indexOf(type) >= 0) {
        arr[arr.indexOf(type)] = `${type}_check`
      }
      echarsType.value = arr
      info.data.cmsChart.type = type.substring(type.lastIndexOf('_check') + 1)
      nextTick(() => componentRef.value.changeType())
    }
  }

  //清除关联的自定义对话框/自定义列表 （切换数据来源时触发）
  const cleranChart = () => {
    info.custSelect = []
    info.echarsData = []
    if (info.data.cmsChart.type) {
      componentRef.value.initXY()
    }
  }

  //清除关联
  const cleranRel = () => {
    cleranChart()
    info.data.cmsChart.relCode = ''
    info.data.cmsChart.relName = ''
  }

  //选择对话框后同步数据
  const dialogOk = (list: any) => {
    if (!list || list.length < 1) {
      return
    }
    const dialogNo = list[0]
    info.data.cmsChart.relCode = dialogNo.code
    info.data.cmsChart.relName = dialogNo.name
    bizApi.custChart
      .custGridDataByCode(
        info.data.cmsChart.relCode,
        info.data.cmsChart.source,
        null,
        1
      )
      .then((rel) => {
        console.log(' info.custOpition.limit', info.custOpition.limit)
        info.custSelect = rel.data.fieldList
        info.echarsData = rel.data.custData
      })
  }

  //填充下echarst的数据
  const changeType = (type: string) => {
    if (type == 'chart' && info.data.objName != 'AbEcharts') {
      info.data.objName = 'AbEcharts'
    }
    if (!info.data.cmsChart) {
      info.data.cmsChart = {
        source: '',
        chartsJson: '',
      }
    }
  }
</script>

<style scoped>
  .layout-container-demo {
    padding: 0 !important;
  }

  .customizing {
    min-width: 30%;
    max-width: 30%;
    padding: 20px;
  }

  .customizing2 {
    min-width: 40%;
    max-width: 40%;
    padding: 20px;
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
