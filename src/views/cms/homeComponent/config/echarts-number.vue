<template>
  <el-form-item>
    <template #label>
      <div>
        {{ $abT('page.homeComponent.indicatorFields', '指标字段') }}
        <el-tooltip
          class="box-item"
          :content="
            $abT(
              'page.homeComponent.fieldTip',
              '可以选择数据字段，也可以手动输入自定义指标卡'
            )
          "
          effect="dark"
          placement="top-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-select
      v-model="info.custOpition.xzhou"
      allow-create
      clearable
      :disabled="onlyRead"
      filterable
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

  <el-form-item :label="$abT('page.homeComponent.fontSize', '字体大小')">
    <el-slider
      v-model="info.custOpition.fontSize"
      :disabled="onlyRead"
      :max="400"
      :min="30"
      :step="5"
      style="width: 90%"
      @change="transFontSize"
    />
  </el-form-item>
  <el-form-item :label="$abT('page.homeComponent.bold', '加粗')">
    <el-switch
      v-model="info.custOpition.jiacu"
      :disabled="onlyRead"
      style="width: 90%"
      @change="transJiacu"
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

  if (!info.value.custOpition.fontSize) {
    info.value.custOpition.fontSize = 60
  }

  const chartObj = ref({
    ztitle: '',
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: '',
            fontSize: 60,
          },
        },
      ],
    },
  })

  const transY = () => {
    if (info.value.custOpition.xzhou) {
      const opeition =
        info.value.echarsData &&
        info.value.echarsData.length > 0 &&
        Reflect.has(info.value.echarsData[0], info.value.custOpition.xzhou)

      const style = {
        text: opeition
          ? info.value.echarsData[0][info.value.custOpition.xzhou]
          : info.value.custOpition.xzhou,
        fontSize: info.value.custOpition.fontSize,
      }
      chartObj.value.graphic.elements[0].style = style
    }
  }

  //y轴名称变化时转换数据
  const transZtitle = (ztitle: string) => {
    chartObj.value.ztitle = ztitle
  }

  //y轴名称变化时转换数据
  const transFontSize = () => {
    chartObj.value.graphic.elements[0].style.fontSize =
      info.value.custOpition.fontSize
  }

  const transJiacu = () => {
    chartObj.value.graphic.elements[0].style['fontWeight'] = info.value
      .custOpition.jiacu
      ? 'bold'
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
            transFontSize()
            transJiacu()
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
