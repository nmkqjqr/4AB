<template>
  <div ref="divRef" style="width: 100%; height: 100%" />
</template>

<script lang="ts">
  export default {
    name: 'AbMap',
  }
</script>

<script setup lang="ts">
  import * as echarts from 'echarts'
  import { PropType } from 'vue'
  import { abUtil } from '~/agilebpm'
  import { bizApi } from '~/agilebpm/api'
  import { nightTheme } from '../abEcharts/components/nightTheme'
  const props = defineProps({
    componentConfig: {
      type: Object as PropType<FormCombinationComponent>,
      required: true,
    },
  })

  const { componentConfig } = toRefs(props)
  const globalParams = inject('globalParams') as any
  const divRef = ref()

  //监听地图变化的实例对象
  let observer: any
  //echarts对象
  let myChart: any
  //当前的地图code（防止重复请求数据判断用的）
  let tempMapCpde: any
  //当前的地图名称（防止重复请求数据判断用的）
  let tempMapName: any
  //当前的地图上一级code（返回上一曾用的）
  let tempMapPcode: any
  //当前的地图数据Json
  let tempMapJson: any

  //当前的选中的数据
  let echarsData: any

  //通过名称获取地图json数据（为点击时间专供的方法）
  const mapInit = async (mapName: string) => {
    const rel = await bizApi.custGrid.custGridList('mapData', {
      queryData: [
        {
          name: 'name_',
          con: 'like',
          val: mapName,
        },
      ],
    })
    const obj = rel?.data?.list[0]
    const json = obj?.data_json_ || obj?.DATA_JSON_
    if (obj && json) {
      tempMapJson = json
      tempMapCpde = obj.code_ || obj?.CODE_
      tempMapPcode = obj.pcode_ || obj.PCODE_
      tempMapName = obj.name_ || obj.NAME_
      option.series[0].name = tempMapName
      eChartsRegisterMap(json)
    }
  }

  // 定义按钮配置项
  const toolboxConfig = {
    show: false,
    feature: {
      myTool: {
        icon: 'M823.232 763.712c-38.72-118.848-150.976-203.776-283.328-206.208a585.024 585.024 0 0 0-46.912 1.088v117.44l0.128 1.088a5.248 5.248 0 0 1-5.248 5.248 5.056 5.056 0 0 1-4.416-2.496v0.512L195.264 478.848h1.472a5.248 5.248 0 0 1-5.248-5.248c0-2.048 1.216-3.84 2.944-4.736l288.96-201.92v0.512a5.44 5.44 0 0 1 4.48-2.496c2.88 0 5.248 2.368 5.248 5.248l-0.128 1.088v113.92c13.248-0.64 27.072-0.832 41.664-0.576 164.48 2.816 297.856 140.736 297.856 305.28 0 25.344-3.264 50.176-9.28 73.792z m-330.24-503.424v0.128h-0.256l0.256-0.128z m0 426.624l-0.192-0.128h0.192v0.128z',
        title: '返回上一级',
        onclick: function () {
          if (tempMapPcode) {
            bizApi.custGrid
              .custGridList('mapData', {
                queryData: [
                  {
                    name: 'code_',
                    con: '=',
                    val: tempMapPcode,
                  },
                ],
              })
              .then((rel) => {
                const obj = rel?.data?.list[0]
                const json = obj?.data_json_ || obj?.DATA_JSON_
                if (obj && json) {
                  tempMapJson = json
                  tempMapCpde = obj.code_ || obj?.CODE_
                  tempMapPcode = obj.pcode_ || obj.PCODE_
                  tempMapName = obj.name_ || obj.NAME_
                  option.series[0].name = tempMapName
                  eChartsRegisterMap(json)
                }
              })
          }
        },
      },
    },
    right: '30px', // 距离右边界的距离
    top: '30px', // 距离顶部的距离
  }

  //颜色分割成白色到选中色的七个过度色
  const getColor = (color1: string) => {
    const matches = color1.match(
      /rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d(\.\d+)?)\)/
    )
    // 如果匹配成功，说明颜色格式为rgba(r,g,b,a)格式，需要转成#000000的格式
    if (matches) {
      const r = parseInt(matches[1])
      const g = parseInt(matches[2])
      const b = parseInt(matches[3])
      const a = parseFloat(matches[4])
      // 将 R、G、B 的数值转换为 16 进制，并补齐两位
      const rHex = r.toString(16).padStart(2, '0')
      const gHex = g.toString(16).padStart(2, '0')
      const bHex = b.toString(16).padStart(2, '0')
      // 将 A 的数值乘以 255，再转换为 16 进制，并补齐两位
      const aHex = Math.round(a * 255)
        .toString(16)
        .padStart(2, '0')
      // 拼接成 Hex 格式的颜色字符串，并返回
      color1 = `#${rHex}${gHex}${bHex}${aHex}`
    }
    // 将颜色的十六进制字符串转换为十进制数字
    const r1 = parseInt(color1.slice(1, 3), 16) // 红色分量
    const g1 = parseInt(color1.slice(3, 5), 16) // 绿色分量
    const b1 = parseInt(color1.slice(5, 7), 16) // 蓝色分量
    // 创建一个空数组，用来存放颜色数组
    const colorArray = []
    // 循环六次，计算每个颜色的值
    for (let i = 0; i < 6; i++) {
      // 用白色和选中颜色的混合比例，计算每个颜色分量的值
      const r = Math.round(255 - (255 - r1) * i * 0.2) // 红色分量
      const g = Math.round(255 - (255 - g1) * i * 0.2) // 绿色分量
      const b = Math.round(255 - (255 - b1) * i * 0.2) // 蓝色分量
      // 将每个颜色分量的值转换为十六进制字符串，补齐两位，拼接成一个颜色字符串
      const color = `#${r.toString(16).padStart(2, '0')}${g
        .toString(16)
        .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      // 将颜色字符串添加到颜色数组中
      colorArray.push(color)
    }
    // 将选中颜色添加到颜色数组的末尾
    colorArray.push(color1)
    return colorArray
  }

  const option = {
    tooltip: { show: componentConfig.value.control.showValue },
    visualMap: {
      show: componentConfig.value.control.tool ? true : false,
      min: componentConfig.value.control.minValue ?? 0,
      max: componentConfig.value.control.maxValue ?? 10000,
      calculable: true,
      inRange: {
        color: getColor(componentConfig.value.control.toolColor ?? '#c50000'), // 调整为美观的渐变色
      },
    },
    toolbox: toolboxConfig,
    title: {
      text: componentConfig.value.control.title ?? '',
      left: 'center',
      top: '3%',
    },
    series: [
      {
        name: tempMapName,
        type: 'map',
        map: 'registerMapData', // 这个是上面注册时的名字哦，registerMap（'这个名字保持一致'）
        label: {
          show: componentConfig.value.control.showLabel ? true : false,
        },
        zoom: 1.2,
        data: [
          // { adcode: 110109, value: 50000 },
          // { name: '河南省', value: 50000 },
          // { name: '南宁市', value: 0 },
          // { name: '崇左市', value: 10 },
          // { name: '柳州市', value: 6000 },
          // { name: '来宾市', value: 1000 },
          // { name: '桂林市', value: 10000 },
          // { name: '梧州市', value: 5000 },
          // { name: '贺州市', value: 2000 },
          // { name: '玉林市', value: 600 },
          // { name: '贵港市', value: 77771 },
          // { name: '百色市', value: 200 },
          // { name: '钦州市', value: 8000 },
          // { name: '河池市', value: 70 },
          // { name: '北海市', value: 900 },
          // { name: '防城港市', value: 3000 },
        ],
      },
    ],
  }

  //注册地图的逻辑 （因多个地方都用到了，抽出来一个方法）
  const eChartsRegisterMap = (mapData: any) => {
    if (mapData) {
      echarts.registerMap('registerMapData', mapData)
      myChart.on('click', clickFn)
      option.toolbox.show =
        componentConfig.value.control.click && tempMapCpde != '100000'
      myChart.setOption(option)
      myChart.resize()
    }
  }

  const clickFn = (params: any) => {
    if (
      params &&
      tempMapName != params.name &&
      componentConfig.value.control.click
    ) {
      mapInit(params.name)
    }
    changeglobalParams(params)
  }

  //点击赋值全局过滤参数逻辑
  const changeglobalParams = (param: any) => {
    const ct = componentConfig.value.control
    if (echarsData && echarsData.length > 0) {
      const newLinkage = ct.linkage?.filter((s: any) => s.linkageParam)
      if (newLinkage && newLinkage.length > 0) {
        newLinkage.forEach((s: any) => {
          if ('custGrid' == ct.source) {
            const selectData = echarsData.find(
              (s: any) => s[ct.xzhou] == param.name
            )
            if (s.linkageData == ct.xzhou) {
              globalParams[s.linkageParam] = param.name
            } else if (selectData) {
              globalParams[s.linkageParam] = selectData[s.linkageData]
            } else {
              globalParams[s.linkageParam] = ''
            }
          } else if ('custDialog' == ct.source) {
            globalParams[s.linkageParam] =
              echarsData[param.dataIndex][s.linkageData] || s.linkageData
          } else if (s.linkageData == 'indicatorKey') {
            globalParams[s.linkageParam] = param.data.value
          } else if (s.linkageData == 'latitudekey') {
            globalParams[s.linkageParam] = param.name
          } else {
            globalParams[s.linkageParam] = s.linkageData
          }
        })
      }
    }
  }

  //将全局过滤参数转换成对应的真正的值
  const conversion = (conditionConfig: any[]) => {
    const result: any[] = abUtil.clone(conditionConfig)
    for (const item in result) {
      if (result[item].value) {
        result[item].value = result[item].value.abArgFormat(globalParams)
      }
    }
    return result
  }

  //将返回的数据转换成echarts认识的数据结构
  const processor = (custData: any[]) => {
    if (custData && custData.length > 0) {
      echarsData = custData
      const ct = props.componentConfig.control
      const mapdata: any = custData.map((s: any) => {
        if (ct.source == 'formDesignSelector') {
          return {
            name: s[ct.latitudeConfig[0].key],
            value:
              s[
                `${ct.indicatorConfig[0].summaryType}_${ct.indicatorConfig[0].key}`
              ],
          }
        } else {
          return {
            name: s[ct.xzhou],
            value: s[ct.yzhou],
          }
        }
      })
      option.series[0].data = mapdata
      //处理最大值最小值的逻辑
      const arr = mapdata.map((s: any) => s.value).filter((s: any) => s)
      option.visualMap.max = Math.max(...arr)
    }
  }

  //获取地图数据
  const getMapData = async () => {
    const ct = abUtil.clone(props.componentConfig.control)
    if (ct.source && ct.mapCode) {
      if (ct.source == 'custEchart') {
        staticData(ct.chartsJson)
      } else if (
        ['custGrid', 'custDialog'].includes(ct.source) &&
        ct.relCode &&
        ct.xzhou &&
        ct.yzhou
      ) {
        const clist = ct?.conditionConfig?.filter((s: { name: any }) => s.name)
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
        const rel = await bizApi.custChart.custGridDataByCode(
          ct.relCode,
          ct.source,
          newlist,
          ct.limit
        )
        processor(rel?.data?.custData)
      } else if (
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
        const rel = await bizApi.custChart.custFormDataByCode(form)
        // info.echarsData = data.custData
        rel.fieldList?.forEach((s: any) => {
          s.key = `${s.tableCode}.${s.key}`
        })
        processor(rel?.data?.custData)
      }
    }
  }

  //通过默认的地图code初始化地图数据
  const initFuntion = () => {
    const mapCode = componentConfig.value.control.mapCode
    if (mapCode && mapCode != tempMapCpde) {
      tempMapCpde = mapCode
      bizApi.custGrid
        .custGridList('mapData', {
          queryData: [
            {
              name: 'code_',
              con: '=',
              val: mapCode,
            },
          ],
        })
        .then((rel) => {
          //为了兼容多种数据库，因此获取全大写的字段
          const obj = rel?.data?.list[0]
          const json = obj?.data_json_ || obj?.DATA_JSON_
          if (obj && json) {
            tempMapJson = json
            tempMapPcode = obj.pcode_ || obj.PCODE_
            tempMapName = obj.name_ || obj.NAME_
            option.series[0].name = tempMapName
            getMapData().then(() => {
              eChartsRegisterMap(json)
            })
          }
        })
    } else {
      getMapData().then(() => {
        eChartsRegisterMap(tempMapJson)
      })
    }
  }

  //填充自定义echarts
  const staticData = (newVal: any) => {
    if (!newVal) {
      return
    }
    let chartsJson: any
    try {
      chartsJson = eval(`(${newVal})`)
    } catch (error) {
      try {
        chartsJson = eval(newVal)
      } catch (error) {
        console.log(
          `自定义echart的配置格式不正确，请输入正确的json或js,错误数据为：${newVal}`
        )
      }
    }
    if (Array.isArray(chartsJson) && Array.isArray(chartsJson[0]?.data)) {
      option.series[0].data = chartsJson[0].data
    } else if (Array.isArray(chartsJson)) {
      option.series[0].data = chartsJson
    } else if (Array.isArray(chartsJson.data)) {
      option.series[0].data = chartsJson.data
    } else if (Array.isArray(chartsJson.series[0].data)) {
      option.series[0].data = chartsJson.series[0].data
    }

    if (option.series[0].data) {
      const arr = option.series[0].data
        .map((s: any) => s.value)
        .filter((s: any) => s)
      option.visualMap.max = Math.max(...arr)
    }
  }

  componentConfig.value.initFunction = initFuntion
  componentConfig.value.relaod = initFuntion

  //不同容器下的自适应大小功能
  onMounted(() => {
    nextTick(() => {
      if (componentConfig.value?.control?.fontStyle) {
        echarts.registerTheme('nightTheme', nightTheme)
        myChart = echarts.init(divRef.value, 'nightTheme')
      } else {
        myChart = echarts.init(divRef.value)
      }
      initFuntion()
      observer = new ResizeObserver(() => {
        myChart.resize(), { passive: true }
      })
      observer.observe(divRef.value)
    })
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  watch(
    () => props.componentConfig.control.mapCode,
    () => initFuntion()
  )

  watch(
    () => props.componentConfig.control.title,
    (newVal) => {
      option.title.text = newVal
      myChart?.setOption(option)
    }
  )

  watch(
    () => props.componentConfig.control.showLabel,
    (newVal) => {
      option.series[0].label.show = newVal
      myChart?.setOption(option)
    }
  )

  watch(
    () => props.componentConfig.control.click,
    (newVal) => {
      option.toolbox.show = newVal && tempMapCpde != '100000'
      myChart?.setOption(option)
    }
  )

  watch(
    () => props.componentConfig.control.tool,
    (newVal) => {
      option.visualMap.show = newVal
      myChart?.setOption(option)
    }
  )

  watch(
    () => props.componentConfig.control.showValue,
    (newVal) => {
      option.tooltip.show = newVal
      myChart?.setOption(option)
    }
  )
  watch(
    () => props.componentConfig.control.toolColor,
    (newVal) => {
      if (newVal) {
        option.visualMap.inRange.color = getColor(
          componentConfig.value.control.toolColor ?? '#c50000'
        )
        myChart?.setOption(option)
      }
    }
  )

  watch(
    () => props.componentConfig.control.fontStyle,
    (newVal) => {
      if (myChart) myChart.dispose()
      if (newVal) {
        echarts.registerTheme('nightTheme', nightTheme)
        myChart = echarts.init(divRef.value, 'nightTheme')
      } else {
        myChart = echarts.init(divRef.value)
      }
      myChart?.setOption(option)
    }
  )

  watch(
    () => props.componentConfig.control.chartsJson,
    (newVal) => {
      staticData(newVal)
      myChart?.setOption(option)
    }
  )

  watch(
    () => [
      props.componentConfig.control.xzhou,
      props.componentConfig.control.yzhou,
      props.componentConfig.control.relCode,
      props.componentConfig.control.source,
      props.componentConfig.control.formKey,
      props.componentConfig.control.limit,
      props.componentConfig.control.indicatorConfig,
      props.componentConfig.control.latitudeConfig,
      props.componentConfig.control.conditionConfig,
      props.componentConfig.control.conditionParam,
    ],
    () => {
      getMapData().then(() => {
        myChart?.setOption(option)
      })
    },

    {
      deep: true,
    }
  )

  let intervalID: any

  // 在组件销毁前停止定时器
  onBeforeUnmount(() => {
    clearInterval(intervalID)
  })

  watch(
    () => [
      componentConfig.value?.control?.timedRefresh,
      componentConfig.value?.control?.refreshCycle,
    ],
    () => {
      const ct = componentConfig.value?.control
      clearInterval(intervalID)
      if (ct.timedRefresh) {
        intervalID = setInterval(
          function () {
            initFuntion()
          },
          ct.refreshCycle > 1 ? ct.refreshCycle * 1000 : 1000
        )
      }
    },
    {
      immediate: true,
    }
  )
</script>
