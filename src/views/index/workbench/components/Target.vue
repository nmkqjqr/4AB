<template>
  <div class="target">
    <vab-card
      class="target-card1"
      shadow="hover"
      skeleton
      :skeleton-rows="7"
      style="height: 380px"
    >
      <template #header>
        <vab-icon icon="body-scan-line" />
        深圳各区 GDP
      </template>
      <vab-chart
        class="target-echart1"
        :init-option="initOptions"
        :option="option"
        theme="vab-echarts-theme"
      />
    </vab-card>
    <vab-card
      class="target-card2"
      shadow="hover"
      skeleton
      :skeleton-rows="5"
      style="height: 305px"
    >
      <template #header>
        <span>
          <vab-icon icon="money-cny-box-line" />
          销售额
        </span>
      </template>
      <vab-chart
        class="target-echart2"
        :init-options="initOptions"
        :option="option2"
        theme="vab-echarts-theme"
      />
    </vab-card>
  </div>
</template>

<script>
  import VabChart from '@/plugins/VabChart'

  export default defineComponent({
    components: {
      VabChart,
    },
    setup() {
      const colorList = ['#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']

      return {
        initOptions: {
          renderer: 'svg',
        },
        option: {
          tooltip: {
            trigger: 'axis',
            extraCssText: 'z-index:1',
          },
          grid: {
            top: '0%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              splitLine: {
                show: false,
              },
              type: 'value',
              show: false,
            },
          ],
          yAxis: [
            {
              splitLine: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              type: 'category',
              axisTick: {
                show: false,
              },
              data: [
                '南山区',
                '福田区',
                '龙岗区',
                '罗湖区',
                '龙华区',
                '宝安区',
              ],
            },
          ],
          series: [
            {
              name: '目标',
              type: 'bar',
              barWidth: 25,
              label: {
                show: true,
                position: 'right',
                color: '#1890FF',
                fontSize: 14,
                formatter: ({ data }) => {
                  return `${data}亿元`
                },
              },
              itemStyle: {
                borderRadius: [0, 5, 5, 0],
                color: new VabChart.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  ['#3ED572', '#399efd'].map((color, offset) => ({
                    color,
                    offset,
                  }))
                ),
              },
              data: [7630.6, 5318.2, 4496.6, 2571.7, 2828.5, 4421.8],
            },
          ],
        },
        option2: {
          tooltip: {
            trigger: 'axis',
            extraCssText: 'z-index:1',
          },
          grid: {
            top: '4%',
            left: '2%',
            right: '2%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: [
                '1月',
                '2月',
                '3月',
                '4月',
                '5月',
                '6月',
                '7月',
                '8月',
                '9月',
                '10月',
                '11月',
                '12月',
              ],
              axisLine: {
                lineStyle: {
                  color: '#DCE2E8',
                },
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                interval: 0,
                color: '#556677',
                fontSize: 12,
                margin: 15,
              },
              axisPointer: {
                label: {
                  padding: [0, 0, 10, 0],
                  margin: 15,
                  fontSize: 12,
                  backgroundColor: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#fff',
                      },
                      {
                        offset: 0.86,
                        color: '#fff',
                      },
                      {
                        offset: 0.86,
                        color: '#33c0cd',
                      },
                      {
                        offset: 1,
                        color: '#33c0cd',
                      },
                    ],
                    global: false,
                  },
                },
              },
              boundaryGap: false,
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisTick: {
                show: false,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#DCE2E8',
                },
              },
              axisLabel: {
                color: '#556677',
              },
              splitLine: {
                show: false,
              },
            },
          ],
          series: [
            {
              name: '销售额',
              type: 'line',
              data: [
                1905, 1020, 3330, 512, 4463, 2214, 3330, 5412, 1205, 820, 5330,
                1112,
              ],
              symbolSize: 1,
              symbol: 'circle',
              smooth: true,
              yAxisIndex: 0,
              showSymbol: false,
              lineStyle: {
                width: 5,
                color: new VabChart.graphic.LinearGradient(1, 1, 0, 0, [
                  {
                    offset: 0,
                    color: '#73DD39',
                  },
                  {
                    offset: 1,
                    color: '#73DDFF',
                  },
                ]),
                shadowColor: 'rgba(115,221,255, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20,
              },
              itemStyle: {
                color: colorList[1],
                borderColor: colorList[1],
              },
            },
          ],
        },
      }
    },
  })
</script>

<style lang="scss" scoped>
  .target {
    margin-bottom: $base-margin;
  }

  :deep() {
    .target-echart1 {
      width: 100%;
      height: 290px;
    }

    .target-echart2 {
      width: 100%;
      height: 205px;
    }
  }
</style>
