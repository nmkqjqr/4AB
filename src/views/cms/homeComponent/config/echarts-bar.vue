<template>
  <el-form-item :label="$abT('page.homeComponent.dimensionField', '维度字段')">
    <el-select
      v-model="info.custOpition.xzhou"
      :disabled="onlyRead"
      placeholder=" "
      style="width: 90%"
      @change="transX"
    >
      <el-option
        v-for="item in info.custSelect"
        :key="item.key"
        :label="item.name"
        :value="item.key"
      />
    </el-select>
  </el-form-item>
  <el-form-item :label="$abT('page.homeComponent.indicatorFields', '指标字段')">
    <el-select
      v-model="info.custOpition.yzhou"
      :disabled="onlyRead"
      multiple
      placeholder=" "
      style="width: 90%"
      @change="transY"
    >
      <el-option
        v-for="item in info.custSelect"
        :key="item.key"
        :label="item.name"
        :value="item.key"
      />
    </el-select>
  </el-form-item>
  <el-form-item :label="$abT('page.homeComponent.dimensionName', '维度名称')">
    <el-input
      v-model="info.custOpition.xname"
      :disabled="onlyRead"
      style="width: 90%"
      @change="transXname"
    />
  </el-form-item>
  <el-form-item :label="$abT('page.homeComponent.indicatorName', '指标名称')">
    <el-input
      v-model="info.custOpition.yname"
      :disabled="onlyRead"
      style="width: 90%"
      @change="transYname"
    />
  </el-form-item>

  <el-form-item :label="$abT('page.common.title', '标题')">
    <el-input
      v-model="info.custOpition.ztitle"
      :disabled="onlyRead"
      style="width: 90%"
      @change="transZtitle"
    />
  </el-form-item>

  <el-form-item :label="$abT('page.homeComponent.colorStyle', '颜色风格')">
    <EchartsStyleSelect
      v-model="info.custOpition.style"
      clearable
      :disabled="onlyRead"
      style="width: 90%"
      @change="transStyle"
    />
  </el-form-item>
  <el-form-item :label="$abT('page.homeComponent.limit', '数据量限制')">
    <el-input
      v-model="info.custOpition.limit"
      clearable
      :disabled="onlyRead"
      :min="1"
      placeholder=" "
      style="width: 90%"
      type="number"
      @change="
        () => {
          if (!info.custOpition.limit || info.custOpition.limit < 1) {
            info.custOpition.limit = 1
          }
        }
      "
    />
  </el-form-item>
</template>

<script lang="ts">
  export default {
    name: 'BarEcharts',
  }
</script>

<script lang="ts" setup>
  import { bizApi } from '~/agilebpm'
  import colorJson from './config'
  import EchartsStyleSelect from './style.vue'
  //继承的属性data
  const props = defineProps({
    info: {
      type: Object as any,
      required: true,
    },
    //是否只读
    onlyRead: {
      type: Boolean,
      required: true,
    },
    initEcharts: {
      type: Function,
      default: null,
    },
  })
  //将data内的属性转为响应式数据
  const { info, onlyRead } = toRefs(props)

  const chartObj = ref({
    tooltip: {},
    ztitle: '',
    legend: {},
    xAxis: {},
    yAxis: {},
    series: [] as any[],
  })

  //x轴变化时转换数据
  const transX = (x: string) => {
    const xAxisData =
      info.value.data.cmsChart.type == 'area'
        ? { data: [] as any[], boundaryGap: false }
        : { data: [] as any[] }
    info.value.echarsData.forEach((e: any) => {
      xAxisData.data.push(e[x])
    })
    chartObj.value['xAxis'] = xAxisData
  }

  //Y轴变化时转换数据
  const transY = (y: string[]) => {
    if (info.value.custSelect && info.value.custSelect.length > 0) {
      const series = [] as any[]
      const legendData = { data: [] as any[], align: 'left', right: 30 }
      if (y && y.length > 0) {
        y.forEach((s: string) => {
          const name = info.value.custSelect.find((vo: any) => vo.key == s).name
          legendData.data.push(name)
          if (info.value.data.cmsChart.type == 'area') {
            series.push({
              name: name,
              type: 'line',
              data: info.value.echarsData.map((m: any) => m[s]),
              stack: 'Total',
              areaStyle: {},
              smooth: true,
            })
          } else {
            series.push({
              name: name,
              type: info.value.data.cmsChart.type,
              data: info.value.echarsData.map((m: any) => m[s]),
            })
          }
        })
      }
      chartObj.value.legend = legendData
      chartObj.value.series = series
    }
  }

  //x轴名称变化时转换数据
  const transXname = (xname: string) => {
    chartObj.value.xAxis['name'] = xname
  }

  //y轴名称变化时转换数据
  const transYname = (yname: string) => {
    chartObj.value.yAxis['name'] = yname
  }

  //y轴名称变化时转换数据
  const transZtitle = (ztitle: string) => {
    chartObj.value.ztitle = ztitle
  }

  //y轴名称变化时转换数据
  const transStyle = (style: string) => {
    chartObj.value['color'] = colorJson[style]
  }
  const init = () => {
    nextTick(() => {
      //填充下echarst的数据
      if (info.value.data.cmsChart.relCode) {
        info.value.custSelect = []
        bizApi.custChart
          .custGridDataByCode(
            info.value.data.cmsChart.relCode,
            info.value.data.cmsChart.source,
            null,
            info.value.custOpition.limit
          )
          .then((rel) => {
            info.value.custSelect = rel.data.fieldList
            info.value.echarsData = rel.data.custData
            transX(info.value.custOpition.xzhou)
            transY(info.value.custOpition.yzhou)
            transXname(info.value.custOpition.xname)
            transYname(info.value.custOpition.yname)
            transZtitle(info.value.custOpition.ztitle)
            transStyle(info.value.custOpition.style)
          })
      }
    })
  }

  init()

  //检测到图表配置改变就实时渲染
  watch(() => info.value.custOpition.limit, init)

  //检测到图表配置改变就实时渲染
  watch(
    () => chartObj.value,
    (newVal) => {
      //根据返回的配置项，转换成真正的echars数据
      props.initEcharts(newVal)
    },
    { deep: true }
  )

  //y轴名称变化时转换数据
  const initXY = () => {
    transX('')
    transY([])
  }
  //y轴名称变化时转换数据
  const changeType = () => {
    transX(info.value.custOpition.xzhou)
    transY(info.value.custOpition.yzhou)
  }

  defineExpose({
    initXY,
    changeType,
  })
</script>
