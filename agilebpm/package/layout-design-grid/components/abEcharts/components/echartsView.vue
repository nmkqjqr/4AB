<template>
  <div
    ref="divRef"
    :style="{
      width: '100%',
      height: '100%',
    }"
  ></div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts'
  import _ from 'lodash'
  import { abUtil, bizApi } from '~/agilebpm'
  import { nightTheme } from './nightTheme'

  const props = defineProps({
    config: {
      type: Object,
      default: null,
    },
    width: {
      type: Number,
      default: 100,
    },
  })

  const divRef = ref()
  const globalParams = inject('globalParams') as any
  const designJson = inject('designJson') as any

  const { config } = toRefs(props)

  let option: any
  let myChart: any

  interface CustOpition {
    latitudeConfig: any
    xzhou: string
    yzhou: Array<string>
    xname: string
    yname: string
    ztitle: string
    style: string
    huanxing: boolean
    biaozhu: boolean
    fontSize: number
    jiacu: boolean
    source: string
    indicatorConfig: any[]
  }

  const info: any = reactive({
    //自定义数据下的属性列表（/x轴Y轴的数据）
    custSelect: [],
    //表单的List
    formSelect: [],
    //echars的数据（自定义对话框/列表的数据）
    echarsData: [],
  })

  const colorJson = {
    // 系统默认
    xtmr: [
      '#509EE3',
      '#9CC177',
      '#A989C5',
      '#F9D45C',
      '#F1B556',
      '#A6E7F3',
      '#7172AD',
    ],
    // 绚丽多彩
    xldc: [
      '#578AF2',
      '#62E075',
      '#42B36F',
      '#FFD660',
      '#B3DE36',
      '#FA914E',
      '#F25252',
    ],
    // 蓝橙撞色
    lczs: [
      '#4D8CAE',
      '#AD5601',
      '#324498',
      '#2B5B75',
      '#0FA8E0',
      '#FF8500',
      '#006BC2',
    ],
    // 英伦酒红
    yljh: [
      '#DB5545',
      '#784029',
      '#E39970',
      '#E0D09F',
      '#A5A187',
      '#474844',
      '#984337',
    ],
    // 清新草绿
    qxcl: [
      '#8AC98B',
      '#A4DED9',
      '#67B9CD',
      '#D6D6D7',
      '#8D9E69',
      '#EB4B5C',
      '#B7D62E',
    ],
    // 神秘魅紫
    smmz: [
      '#C366A1',
      '#503491',
      '#DAA6D6',
      '#A999C9',
      '#D3C3DB',
      '#A563AC',
      '#7260AF',
    ],
    // 热情暖阳
    rqny: [
      '#FF9090',
      '#D53872',
      '#B91515',
      '#BBA588',
      '#FFD54F',
      '#FF9800',
      '#FBE8E1',
    ],
  }
  const textValue = ref('')

  const init = (obj: any) => {
    if (obj) {
      //全局字体样式
      if (myChart) myChart.dispose()
      if (config.value?.control?.fontStyle) {
        echarts.registerTheme('nightTheme', nightTheme)
        myChart = echarts.init(divRef.value, 'nightTheme')
      } else myChart = echarts.init(divRef.value)

      if (myChart) {
        //全局标题在这里设置
        if (config.value?.control?.ztitle) {
          obj.title = {
            text: config.value.control.ztitle,
            top: '3%',
            left: 'center',
          }
        }
        myChart.setOption(obj, true)
        myChart.on('click', function (param: any) {
          changeglobalParams(param)
        })
        nextTick(() => {
          myChart.resize()
        })
      }
    }
  }
  const changeglobalParams = (param: any) => {
    const ct = config.value.control

    const selectData = info.echarsData[param.dataIndex]

    const newLinkage = ct.linkage?.filter((s: any) => s.linkageParam)
    if (newLinkage && newLinkage.length > 0) {
      newLinkage.forEach((s: any) => {
        if ('custGrid' == ct.source) {
          globalParams[s.linkageParam] =
            selectData[`${s.linkageData}$rel`] || s.linkageData
        } else if ('custDialog' == ct.source) {
          globalParams[s.linkageParam] =
            selectData[s.linkageData] || s.linkageData
        } else if (s.linkageData == 'indicatorKey') {
          globalParams[s.linkageParam] = param.data
        } else if (s.linkageData == 'latitudekey') {
          globalParams[s.linkageParam] = selectData[ct.xzhou]
        } else if (s.linkageData == 'titleValue') {
          globalParams[s.linkageParam] = textValue.value
        } else {
          globalParams[s.linkageParam] = s.linkageData
        }
      })
    }
  }

  const changeHeight = () => {
    if (myChart) {
      nextTick(() => myChart.resize())
    }
  }

  const conversion = (conditionConfig: any[]) => {
    const result: any[] = abUtil.clone(conditionConfig)
    for (const item in result) {
      if (result[item].value) {
        result[item].value = result[item].value.abArgFormat(globalParams)
      }
    }
    return result
  }

  const opeitionInit = () => {
    const ct = abUtil.clone(props.config.control)
    if (ct.ztitle) {
      textValue.value = ct.ztitle
    } else {
      textValue.value = ''
    }
    if (ct && ct.source) {
      if (ct.source == 'custEchart') {
        try {
          option = eval(`(${ct.chartsJson})`)
        } catch (error) {
          try {
            eval(ct.chartsJson)
          } catch (error) {
            console.log(
              `自定义echart的配置格式不正确，请输入正确的json或js,错误数据为：${ct.chartsJson}`
            )
          }
        }
        init(option)
      }
      if (ct.xzhou) {
        if (['custGrid', 'custDialog'].includes(ct.source) && ct.relCode) {
          const clist = ct?.conditionList?.filter((s: { name: any }) => s.name)
          let newlist = []
          if ('custGrid' == ct.source && clist && clist.length > 0) {
            newlist = abUtil.clone(clist)
            newlist.forEach((s: any) => {
              if (/^{.*}$/.test(s.val)) {
                const key = s.val.substring(1, s.val.length - 1)
                if (key in globalParams) {
                  s.val = globalParams[key]
                } else {
                  s.val = undefined
                }
              }
            })
          }
          bizApi.custChart
            .custGridDataByCode(ct.relCode, ct.source, newlist, ct.limit)
            .then(({ data }) => getMethed(data, ct))
        }

        if (
          'formDesignSelector' == ct.source &&
          ct.relCode &&
          ct.formKey &&
          ct.latitudeConfig &&
          ct.latitudeConfig.length > 0 &&
          ct.indicatorConfig &&
          ct.indicatorConfig.length > 0
        ) {
          const form = {
            designCode: ct.relCode,
            tableCode: ct.formKey,
            latitudeList: ct.latitudeConfig,
            indicatorList: ct.indicatorConfig,
            conditionList: conversion(ct.conditionConfig),
            limit: ct.limit,
          }

          ct.xzhou = ct.latitudeConfig.map((s: any) => s.key)[0]
          ct.yzhou = ct.indicatorConfig.map((s: any) => s.key)
          bizApi.custChart.custFormDataByCode(form).then(({ data }) => {
            data.fieldList?.forEach((s: any) => {
              s.key = `${s.tableCode}.${s.key}`
            })
            getMethed(data, ct)
          })
        }
      }
    }
  }
  const getMethed = (data: any, custOpition: any) => {
    info.custSelect = data.fieldList
    info.echarsData = data.custData
    if (info.echarsData) {
      //获取到的数据转换chartObj为实时数据
      const type = props.config.control.type

      if (['bar', 'line', 'area'].includes(type))
        option = transBar(type, custOpition)
      else if (type === 'pie') option = transPie(custOpition)
      else if (type === 'funnel') option = transFunnel(custOpition)
      else if (type === 'gauge') option = transGauge(custOpition)
      else if (type === 'number') option = transNumber(custOpition)
      init(option)
    }
  }
  const getCountField = (custOpition: any, code: string) => {
    const isDesign = custOpition.source == 'formDesignSelector'
    let name
    let field: string
    if (isDesign) {
      const obj = custOpition.indicatorConfig.find((vo: any) => vo.key == code)
      field = `${obj?.summaryType}_${code}`
      name = obj?.name
    } else {
      field = code
      name = info.custSelect.find((vo: any) => vo.key == field).name
    }
    return { name: name, field: field }
  }

  const transBar = (type: string, custOpition: CustOpition) => {
    const chartBarObj = {
      ztitle: '',
      legend: {
        data: [] as any[],
        align: 'left',
        right: 30,
        textStyle: {
          color:
            designJson.value.theme && designJson.value.theme == '3'
              ? '#CFD3DC'
              : '', // Y轴字体颜色
        },
      },
      xAxis: {},
      yAxis: {
        axisLabel: {
          color:
            designJson.value.theme && designJson.value.theme == '3'
              ? '#CFD3DC'
              : '', // Y轴字体颜色
        },
      },
      tooltip: {},
      series: [] as any[],
    }
    if (custOpition.xzhou) {
      const xAxisData =
        type == 'area'
          ? {
              data: [] as any[],
              boundaryGap: false,
              axisLabel: {
                color:
                  designJson.value.theme && designJson.value.theme == '3'
                    ? '#CFD3DC'
                    : '', // X轴字体颜色
              },
            }
          : {
              data: [] as any[],
              axisLabel: {
                color:
                  designJson.value.theme && designJson.value.theme == '3'
                    ? '#CFD3DC'
                    : '', // X轴字体颜色
              },
            }

      const obj = custOpition.latitudeConfig.find(
        (vo: any) => vo.key == custOpition.xzhou
      )
      info.echarsData.forEach((e: any) => {
        xAxisData.data.push(
          e[custOpition.xzhou] ||
            e[`${obj?.summaryType}_${custOpition.xzhou}`] ||
            '未知'
        )
      })
      chartBarObj['xAxis'] = xAxisData
    }
    if (
      custOpition.yzhou &&
      custOpition.yzhou.length > 0 &&
      info.custSelect &&
      info.custSelect.length > 0
    ) {
      custOpition.yzhou.forEach((s: string) => {
        const obj = getCountField(custOpition, s)
        chartBarObj.legend.data.push(obj.name)
        if (type == 'area') {
          chartBarObj.series.push({
            name: obj.name,
            type: 'line',
            data: info.echarsData.map((m: any) => m[obj.field]),
            stack: 'Total',
            areaStyle: {},
            smooth: true,
          })
        } else {
          chartBarObj.series.push({
            name: obj.name,
            type: type,
            data: info.echarsData.map((m: any) => m[obj.field]),
          })
        }
      })
    }
    if (custOpition.xname) {
      chartBarObj.xAxis['name'] = custOpition.xname
    }
    if (custOpition.xname) {
      chartBarObj.yAxis['name'] = custOpition.yname
    }
    if (custOpition.ztitle) {
      chartBarObj.ztitle = custOpition.ztitle
    }
    if (custOpition.style && custOpition.style.length > 0) {
      chartBarObj['color'] = colorJson[custOpition.style]
    } else {
      // 取全局图表配色方案
      if (
        designJson.value.chartStyle &&
        designJson.value.chartStyle.length > 0
      ) {
        chartBarObj['color'] = colorJson[designJson.value.chartStyle]
      }
    }
    return chartBarObj
  }
  const transPie = (custOpition: any) => {
    const chartPieObj = {
      ztitle: '',
      legend: {
        show: custOpition?.tip,
        orient: 'vertical',
        left: 'right',
        textStyle: {
          color:
            (designJson.value.theme && designJson.value.theme == '3') ||
            custOpition.fontStyle
              ? '#CFD3DC'
              : '', // Y轴字体颜色
        },
      },
      series: [
        {
          name: '',
          label: {
            normal: {
              show: true,
              formatter: '{b}:({d}%)',
            },
          },
          type: 'pie',
          roseType: custOpition?.rose ? 'radius' : '',
          data: [] as any[],
          itemStyle: {
            borderRadius: 2,
            borderColor: 'rgba(255,255,255,0)',
            borderWidth: 2,
          },
        },
      ] as any[],
      tooltip: {},
    }
    if (
      custOpition.xzhou &&
      custOpition.yzhou &&
      custOpition.yzhou.length > 0 &&
      info.custSelect &&
      info.custSelect.length > 0
    ) {
      const obj = getCountField(custOpition, custOpition.yzhou[0])

      chartPieObj.series[0].name = obj.name
      if (custOpition.huanxing) {
        chartPieObj.series[0]['radius'] = ['40%', '75%']
      }

      info.echarsData.map((m: any) => {
        chartPieObj.series[0].data.push({
          name: m[custOpition.xzhou] || '未知',
          value: m[obj.field],
        })
      })
    }

    chartPieObj.series[0].label.normal.show = custOpition.biaozhu
    chartPieObj.ztitle = custOpition.ztitle
    if (custOpition.style && custOpition.style.length > 0) {
      chartPieObj['color'] = colorJson[custOpition.style]
    } else {
      // 取全局图表配色方案
      if (
        designJson.value.chartStyle &&
        designJson.value.chartStyle.length > 0
      ) {
        chartPieObj['color'] = colorJson[designJson.value.chartStyle]
      }
    }
    return chartPieObj
  }
  const transFunnel = (custOpition: any) => {
    const chartFunnelObj = {
      ztitle: '',
      legend: {
        orient: 'vertical',
        left: 'right',
        textStyle: {
          color:
            designJson.value.theme && designJson.value.theme == '3'
              ? '#CFD3DC'
              : '', // Y轴字体颜色
        },
      },
      series: [
        {
          name: '',
          type: 'funnel',
          data: [] as any[],
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
      tooltip: {},
    }
    if (
      custOpition.xzhou &&
      custOpition.yzhou &&
      custOpition.yzhou.length > 0 &&
      info.custSelect &&
      info.custSelect.length > 0
    ) {
      const obj = getCountField(custOpition, custOpition.yzhou[0])
      info.echarsData.map((m: any) => {
        chartFunnelObj.series[0].data.push({
          name: m[custOpition.xzhou] || '未知',
          value: m[obj.field],
        })
      })
    }
    if (custOpition.biaozhu) {
      chartFunnelObj.series[0].label.show = custOpition.biaozhu
    }

    if (custOpition.ztitle) {
      chartFunnelObj.ztitle = custOpition.ztitle
    }
    if (custOpition.style && custOpition.style.length > 0) {
      chartFunnelObj['color'] = colorJson[custOpition.style]
    } else {
      // 取全局图表配色方案
      if (
        designJson.value.chartStyle &&
        designJson.value.chartStyle.length > 0
      ) {
        chartFunnelObj['color'] = colorJson[designJson.value.chartStyle]
      }
    }
    return chartFunnelObj
  }
  const transGauge = (custOpition: any) => {
    const chartGaugeObj = {
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
      tooltip: {},
    }
    if (
      custOpition.xzhou &&
      custOpition.yzhou &&
      custOpition.yzhou.length > 0 &&
      info.custSelect &&
      info.custSelect.length > 0
    ) {
      const obj = getCountField(custOpition, custOpition.yzhou[0])
      chartGaugeObj.series[0].data[0] = {
        value: info.echarsData[0][obj.field],
        name: custOpition.biaozhu
          ? info.echarsData[0][custOpition.xzhou] || '未知'
          : '',
      }
    }
    if (custOpition.ztitle) {
      chartGaugeObj.ztitle = custOpition.ztitle
    }
    return chartGaugeObj
  }
  const transNumber = (custOpition: any) => {
    const chartNumberObj = {
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
              fontWeight: '',
            },
          },
        ],
      },
    }
    if (custOpition.fontSize) {
      chartNumberObj.graphic.elements[0].style.fontSize = custOpition.fontSize
    }

    if (custOpition.xzhou) {
      const opeition =
        info.echarsData &&
        info.echarsData.length > 0 &&
        Reflect.has(info.echarsData[0], custOpition.xzhou)

      chartNumberObj.graphic.elements[0].style = {
        text: opeition
          ? info.echarsData[0][custOpition.xzhou] || '未知'
          : custOpition.xzhou,
        fontSize: custOpition.fontSize,
        fontWeight: custOpition.jiacu ? 'bold' : '',
      }
    }
    if (custOpition.ztitle) {
      chartNumberObj.ztitle = custOpition.ztitle
    }
    return chartNumberObj
  }

  defineExpose({
    changeHeight,
    opeitionInit,
  })

  //监听到宽度 高度 和code变化时,需要重新加载
  watch(
    () => props.config.key,
    () => opeitionInit()
  )
  let intervalID: any

  // 在组件销毁前停止定时器
  onBeforeUnmount(() => {
    clearInterval(intervalID)
  })

  watch(
    () => [
      config.value?.control?.timedRefresh,
      config.value?.control?.refreshCycle,
    ],
    () => {
      const ct = config.value?.control
      clearInterval(intervalID)
      if (ct.timedRefresh) {
        intervalID = setInterval(
          function () {
            opeitionInit()
          },
          ct.refreshCycle > 1 ? ct.refreshCycle * 1000 : 1000
        )
      }
    },
    {
      immediate: true,
    }
  )
  // 全局风格改变了 刷新图形
  watch(
    () => designJson.value.chartStyle,
    (val) => {
      opeitionInit()
    },
    {
      deep: true,
    }
  )
  //旧的全局过滤值
  let oldConfig: any[] = config.value.control?.conditionConfig?.map(
    (s: { key: any; value: { abArgFormat: (arg0: any) => any } }) => {
      return {
        key: s.key,
        value: s.value?.abArgFormat(globalParams),
      }
    }
  )

  //旧的过滤值
  let oldCondition: any[] = config.value.control?.conditionList
    ?.filter((s: { name: any; val: string }) => s.name && /^{.*}$/.test(s.val))
    ?.map((s: { name: any; val: { abArgFormat: (arg0: any) => any } }) => {
      return {
        key: s.name,
        value: s.val?.abArgFormat(globalParams),
      }
    })

  watch(
    () => globalParams,
    (newVal) => {
      const ct = config.value.control
      const newConfig = ct?.conditionConfig?.map(
        (s: { key: any; value: { abArgFormat: (arg0: any) => any } }) => {
          return {
            key: s.key,
            value: s.value?.abArgFormat(newVal),
          }
        }
      )

      //旧的过滤值
      const newCondition: any[] = ct?.conditionList
        ?.filter(
          (s: { name: any; val: string }) => s.name && /^{.*}$/.test(s.val)
        )
        ?.map((s: { name: any; val: { abArgFormat: (arg0: any) => any } }) => {
          return {
            key: s.name,
            value: s.val?.abArgFormat(globalParams),
          }
        })

      if (
        !_.isEqual(newConfig, oldConfig) ||
        !_.isEqual(newCondition, oldCondition)
      ) {
        oldCondition = newCondition
        oldConfig = newConfig
        opeitionInit()
      }
    },
    { deep: true }
  )
</script>
<style>
  .Mydiv {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .Mydiv > div {
    position: absolute;
    top: 20%;
    right: 0;
    left: 0;
    font-size: 1.2em;
  }
</style>
