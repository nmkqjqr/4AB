<template>
  <div
    :style="{
      width: '100%',
      height: 1 * props.height + 'px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      fontSize: '20px',
      marginTop: '10px',
    }"
  >
    {{ textValue }}
  </div>
  <div
    ref="divRef"
    :style="{
      marginTop: '10px',
      width: '100%',
      height: 7 * props.height + 'px',
    }"
  ></div>
</template>

<script setup lang="ts">
  import { cmsApi } from '~/agilebpm'
  import * as echarts from 'echarts'
  const props = defineProps({
    code: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
  })

  const divRef = ref()

  let option: any
  let myChart: any

  interface CustOpition {
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
  }

  const info: any = reactive({
    //自定义数据下的属性列表（/x轴Y轴的数据）
    custSelect: [],
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
    nextTick(() => {
      if (obj) {
        myChart = echarts.init(divRef.value)
        if (obj.ztitle) {
          textValue.value = obj.ztitle
        } else {
          textValue.value = ''
        }
        myChart.setOption(obj, true)
        window.addEventListener('resize', function () {
          myChart.resize()
        })
      }
    })
  }

  const transBar = (type: string, custOpition: CustOpition) => {
    const chartBarObj = {
      ztitle: '',
      legend: { data: [] as any[], align: 'left', right: 30 },
      xAxis: {},
      yAxis: {},
      series: [] as any[],
      tooltip: {},
    }
    if (custOpition.xzhou) {
      const xAxisData =
        type == 'area'
          ? { data: [] as any[], boundaryGap: false }
          : { data: [] as any[] }
      info.echarsData.forEach((e: any) => {
        xAxisData.data.push(e[custOpition.xzhou])
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
        const name = info.custSelect.find((vo: any) => vo.key == s).name
        chartBarObj.legend.data.push(name)
        if (type == 'area') {
          chartBarObj.series.push({
            name: name,
            type: 'line',
            data: info.echarsData.map((m: any) => m[s]),
            stack: 'Total',
            areaStyle: {},
            smooth: true,
          })
        } else {
          chartBarObj.series.push({
            name: name,
            type: type,
            data: info.echarsData.map((m: any) => m[s]),
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
    if (custOpition.style) {
      chartBarObj['color'] = colorJson[custOpition.style]
    }
    return chartBarObj
  }
  const transPie = (custOpition: any) => {
    const chartPieObj = {
      ztitle: '',
      legend: { orient: 'vertical', left: 'right' },
      series: [
        {
          name: '',
          label: {
            show: false,
            normal: {
              show: true,
              formatter: '{b}:({d}%)',
            },
          },
          type: 'pie',
          data: [] as any[],
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
    }
    if (
      custOpition.xzhou &&
      custOpition.yzhou &&
      custOpition.yzhou.length > 0 &&
      info.custSelect &&
      info.custSelect.length > 0
    ) {
      chartPieObj.series[0].name = info.custSelect.find(
        (vo: any) => vo.key == custOpition.yzhou[0]
      ).name
      if (custOpition.huanxing) {
        chartPieObj.series[0]['radius'] = ['40%', '75%']
      }

      info.echarsData.map((m: any) => {
        chartPieObj.series[0].data.push({
          name: m[custOpition.xzhou],
          value: m[custOpition.yzhou[0]],
        })
      })
    }

    if (custOpition.biaozhu) {
      chartPieObj.series[0].label.show = false
    }
    if (custOpition.ztitle) {
      chartPieObj.ztitle = custOpition.ztitle
    }
    if (custOpition.style) {
      chartPieObj['color'] = colorJson[custOpition.style]
    }
    return chartPieObj
  }
  const transFunnel = (custOpition: any) => {
    const chartFunnelObj = {
      ztitle: '',
      legend: { orient: 'vertical', left: 'right' },

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
      tooltip: {
        trigger: 'item',
      },
    }
    if (
      custOpition.xzhou &&
      custOpition.yzhou &&
      custOpition.yzhou.length > 0 &&
      info.custSelect &&
      info.custSelect.length > 0
    ) {
      info.echarsData.map((m: any) => {
        chartFunnelObj.series[0].data.push({
          name: m[custOpition.xzhou],
          value: m[custOpition.yzhou[0]],
        })
      })
    }
    if (custOpition.biaozhu) {
      chartFunnelObj.series[0].label.show = custOpition.biaozhu
    }

    if (custOpition.ztitle) {
      chartFunnelObj.ztitle = custOpition.ztitle
    }
    if (custOpition.style) {
      chartFunnelObj['color'] = colorJson[custOpition.style]
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
      tooltip: {
        trigger: 'item',
      },
    }
    if (
      custOpition.xzhou &&
      custOpition.yzhou &&
      custOpition.yzhou.length > 0 &&
      info.custSelect &&
      info.custSelect.length > 0
    ) {
      chartGaugeObj.series[0].data[0] = {
        value: info.echarsData[0][custOpition.yzhou[0]],
        name: custOpition.biaozhu ? info.echarsData[0][custOpition.xzhou] : '',
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
          ? info.echarsData[0][custOpition.xzhou]
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
    init,
  })

  //修复再门户或首页预览状态下调整宽度不能实时改变的bug
  watch(
    () => props.width,
    () => myChart.resize()
  )

  //修复再门户或首页预览状态下调整宽度不能实时改变的bug
  watch(
    () => props.height,
    () => myChart.resize()
  )

  watch(
    () => props.code,
    () => {
      if (props.code) {
        cmsApi.chart.allDataByCode(props.code).then(({ data }) => {
          if (data) {
            if (data.cmsChart.source == 'custEchart') {
              try {
                option = eval(`(${data.cmsChart.chartsJson})`)
              } catch (error) {
                try {
                  eval(data.cmsChart.chartsJson)
                } catch (error) {
                  console.log(
                    `自定义echart的配置格式不正确，请输入正确的json或js,错误数据为：${data.cmsChart.chartsJson}`
                  )
                }
              }
            } else {
              info.custSelect = data.fieldList
              info.echarsData = data.custData
              //获取到的数据转换chartObj为实时数据
              const custOpition = eval(`(${data.cmsChart.chartsJson})`)
              const type = data.cmsChart.type

              if (['bar', 'line', 'area'].includes(type))
                option = transBar(type, custOpition)
              else if (type === 'pie') option = transPie(custOpition)
              else if (type === 'funnel') option = transFunnel(custOpition)
              else if (type === 'gauge') option = transGauge(custOpition)
              else if (type === 'number') option = transNumber(custOpition)
            }
            init(option)
          }
        })
      }
    },
    { immediate: true }
  )
</script>
