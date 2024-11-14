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

  <el-form-item :label="$abT('page.common.title', '标题')">
    <el-input
      v-model="info.custOpition.ztitle"
      :disabled="onlyRead"
      style="width: 90%"
      @change="transZtitle"
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
</template>

<script lang="ts">
  export default {
    name: 'BarEcharts',
  }
</script>

<script lang="ts" setup>
  import { bizApi } from '~/agilebpm'

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

    series: [
      {
        type: 'gauge',
        data: [
          {
            value: 0,
            name: '',
          },
        ],
      },
    ],
    tooltip: {
      trigger: 'item',
    },
  })

  const transY = () => {
    if (
      info.value.custOpition.xzhou &&
      ySelect.value &&
      info.value.custSelect &&
      info.value.custSelect.length > 0 &&
      info.value.echarsData &&
      info.value.echarsData.length > 0
    ) {
      const seriesData = {
        value: info.value.echarsData[0][ySelect.value],
        name: info.value.custOpition.biaozhu
          ? info.value.echarsData[0][info.value.custOpition.xzhou]
          : '',
      }

      info.value.custOpition.yzhou = [ySelect.value]
      chartObj.value.series[0].data[0] = seriesData
    }
  }

  //y轴名称变化时转换数据
  const transZtitle = (ztitle: string) => {
    chartObj.value.ztitle = ztitle
  }

  const transBiaozhu = (biaozhu: any) => {
    chartObj.value.series[0].data[0].name = info.value.custOpition.biaozhu
      ? info.value.echarsData[0][info.value.custOpition.xzhou]
      : ''
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
            transBiaozhu(info.value.custOpition.biaozhu)
          })
      }
    })
  }

  init()

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
