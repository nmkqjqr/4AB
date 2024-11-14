<template>
  <el-form-item :label="$abT('page.homeComponent.dimensionField', '维度字段')">
    <el-select
      v-model="info.custOpition.xzhou"
      :disabled="onlyRead"
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
  <el-form-item :label="$abT('page.homeComponent.indicatorFields', '指标字段')">
    <el-select
      v-model="ySelect"
      :disabled="onlyRead"
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
  <!-- <el-form-item :label="$abT('page.homeComponent.dimensionName','维度名称')">
    <el-input
      v-model="info.custOpition.xname"
      :disabled="onlyRead"
      style="width: 90%"
      @change="transXname"
    />
  </el-form-item>
  <el-form-item :label="$abT('page.homeComponent.indicatorName','指标名称')">
    <el-input
      v-model="info.custOpition.yname"
      :disabled="onlyRead"
      style="width: 90%"
      @change="transYname"
    />
  </el-form-item> -->

  <el-form-item :label="$abT('page.common.title', '标题')">
    <el-input
      v-model="info.custOpition.ztitle"
      :disabled="onlyRead"
      style="width: 90%"
      @change="transZtitle"
    />
  </el-form-item>

  <el-form-item :label="$abT('page.homeComponent.annular', '环形')">
    <el-switch
      v-model="info.custOpition.huanxing"
      :disabled="onlyRead"
      style="width: 90%"
      @change="transHuanxing"
    />
  </el-form-item>
  <el-form-item :label="$abT('page.homeComponent.label', '标注')">
    <el-switch
      v-model="info.custOpition.biaozhu"
      :disabled="onlyRead"
      style="width: 90%"
      @change="transBiaozhu"
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
  //Y轴下拉框的对象
  const ySelect = ref(info.value.custOpition.yzhou[0] as string)

  const chartObj = ref({
    ztitle: '',
    legend: { orient: 'vertical', left: 'right' },
    series: [
      {
        label: {
          show: false,
        },

        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
      },
    ] as any[],
    tooltip: {
      trigger: 'item',
    },
  })

  const transY = () => {
    if (
      info.value.custOpition.xzhou &&
      ySelect.value &&
      info.value.custSelect &&
      info.value.custSelect.length > 0
    ) {
      const series = [
        {
          name: info.value.custSelect.find((vo: any) => vo.key == ySelect.value)
            .name,
          type: 'pie',
          data: [] as any[],

          label: {
            normal: {
              show: info.value.custOpition.biaozhu,
              formatter: '{b}:({d}%)',
            },
          },
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
        },
      ]
      if (info.value.custOpition.huanxing) {
        series[0]['radius'] = ['40%', '75%']
      }
      info.value.echarsData.map((m: any) => {
        series[0].data.push({
          name: m[info.value.custOpition.xzhou],
          value: m[ySelect.value],
        })
      })

      info.value.custOpition.yzhou = [ySelect.value]
      chartObj.value.series = series
    }
  }

  //y轴名称变化时转换数据
  const transZtitle = (ztitle: string) => {
    chartObj.value.ztitle = ztitle
  }

  //y轴名称变化时转换数据
  const transStyle = (style: string) => {
    chartObj.value['color'] = colorJson[style]
  }

  const transHuanxing = (huanxing: any) => {
    if (info.value.custOpition.huanxing) {
      chartObj.value.series[0]['radius'] = ['40%', '73%']
    } else {
      delete chartObj.value.series[0]['radius']
    }
  }

  const transBiaozhu = (biaozhu: any) => {
    chartObj.value.series[0].label.normal.show = info.value.custOpition.biaozhu
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
            transY()
            transZtitle(info.value.custOpition.ztitle)
            transStyle(info.value.custOpition.style)
            transHuanxing(info.value.custOpition.huanxing)
            transBiaozhu(info.value.custOpition.biaozhu)
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
    transY()
  }
  //y轴名称变化时转换数据
  const changeType = () => {
    transY()
  }

  defineExpose({
    initXY,
    changeType,
  })
</script>
