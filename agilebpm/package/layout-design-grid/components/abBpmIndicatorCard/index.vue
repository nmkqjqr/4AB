<template>
  <div
    style="
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    "
  >
    <el-row class="sort-items" style="flex-grow: 1">
      <span
        v-for="(value, key) in componentConfig.control.param"
        :key="key"
        :style="{ width: getWidth() + '%' }"
      >
        <div
          class="item"
          :style="{
            background:
              designJson && designJson.theme && designJson.theme == '3'
                ? 'rgb(35 33 33)'
                : value.color,
            border:
              designJson && designJson.theme && designJson.theme == '3'
                ? '1px solid #fff'
                : '',
          }"
        >
          <img :src="info.flowArr[value.code]?.url" />
          <div class="left">
            <ab-countup
              class="number"
              :end-val="info.flowArr[value.code]?.value"
            />
            <p class="onep">{{ info.flowArr[value.code]?.name }}</p>
          </div>
        </div>
      </span>
    </el-row>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'AbBpmIndicatorCard',
  }
</script>

<script setup lang="ts">
  import { abCountup, bpmApi } from '~/agilebpm'
  import { PropType } from 'vue'
  import abWeather from './ab-weather/index.vue'
  import _ from 'lodash'
  const props = defineProps({
    componentConfig: {
      type: Object as PropType<FormCombinationComponent>,
      required: true,
    },
  })
  const { componentConfig } = toRefs(props)

  const designJson = inject('designJson') as any

  const info: any = reactive({
    flowArr: {
      // testCount: {
      //   name: '测试新增数量',
      //   url: require('@/assets/home_images/testPng.png'),
      //   value: '',
      // },
      todoTask: {
        name: '总待办量',
        url: require('@/assets/home_images/daiban.png'),
        value: '',
      },
      apply: {
        name: '总发起量',
        url: require('@/assets/home_images/faqi.png'),
        value: '',
      },
      back: {
        name: '总驳回量',
        url: require('@/assets/home_images/bohui.png'),
        value: '',
      },
      approve: {
        name: '总已办量',
        url: require('@/assets/home_images/yiban.png'),
        value: '',
      },
      copyMeCount: {
        name: '未审阅抄送数',
        url: require('@/assets/home_images/faqi.png'),
        value: '',
      },
    },
  })

  const getWidth = () => {
    return 100 / componentConfig.value.control.param.length
  }

  const init = () => {
    //获取流程各类型的数量
    bpmApi.myTask
      .getMyFlowCounts(componentConfig.value?.control?.condition)
      .then((rel) => {
        for (const prop in rel.data) {
          if (info.flowArr[prop]) {
            info.flowArr[prop].value = rel.data[prop]
          }
        }
      })
  }

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
            init()
          },
          ct.refreshCycle > 1 ? ct.refreshCycle * 1000 : 1000
        )
      }
    },
    {
      immediate: true,
    }
  )
  watch(
    () => componentConfig.value?.control?.condition,
    () => init(),
    { immediate: true }
  )
</script>

<style lang="stylus" scoped>
  .blue {
    background: #4398f0;
  }

  .violet {
    background: #8870b4;
  }

  .cyan {
    background: #8fc99a;
  }

  .green {
    background: #f4a074;
  }

  .fleshcolor {
    background: #ffa0c0;
  }

  .pink {
    background: #8870b4;
  }

  .orange {
    background: #ffa940;
  }

  .onep {
    font-weight: bold;
  }

  l(px) {
    return (px / 19.2) rem;
  }

  .home :deep(.ivu-card-body) {
    padding: l(16);
  }

  .home :deep(.ivu-tabs) {
    background: white;
  }

  .home :deep(.ivu-tabs-bar) {
    margin-bottom: 0px;
  }

  .ivu-card {
    margin: l(5);
  }

  .ivu-tabs-tab {
    padding: 11px 16px !important;
  }

  .title {
    font-weight: bold;
    color: #3e3a39;
    font-size: l(18);
    line-height: 100%;
    margin-bottom: l(15);
    letter-spacing: 0;
  }

  .sort-items {
    &>div {
      cursor: pointer;
    }

    .item {
      height: 100px;
      margin: 8px;
      margin-top: 3px;
      margin-bottom: 3px;
      cursor: pointer;
      color: #fff;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;

      .left {
        justify-content: center;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        color: #fff;

        .number {
          margin: 5px;
          font-weight: bold;
          font-size: l(30);
          line-height: 100%;
        }

        p {
          margin: 0px;
          font-size: 13px;
          letter-spacing: 0px;
        }
      }

      img {
        width: l(40);
        margin-right: l(10);
      }

      .faqi {
        width: l(45);
      }
    }

    .ivu-col {
      &:nth-child(2) {
        .item {
          background: #8870b4;
        }
      }

      &:nth-child(3) {
        .item {
          background: #8fc99a;
        }
      }

      &:nth-child(4) {
        .item {
          background: #f4a074;
        }
      }
    }
  }

  .calendar-container {
    :deep(.ivu-card-body) {
      // padding-left: 0;
    }

    .title {
      margin-left: 16px;
      border-bottom: 1px solid #f5f5f5;
      padding-bottom: 10px;
    }
  }

  .quick-entrys {
    .quick-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #3e3a39;
    }

    .icon {
      margin-right: l(15);
    }

    .quick-more-container {
      cursor: pointer;

      :deep(.ivu-card-body) {
        padding: l(11);
      }

      .quick-more {
        width: 100%;
        display: flex;
        align-items: center;

        :deep(input) {
          background-color: #eee !important;
          border: none;
        }
      }
    }
  }

  .unknonwn {
    height: l(232);
  }

  .statistic {
    .charts-container {
      display: flex;
      height: l(250);

      .chart-pie {
        flex: 1;
      }
    }

    .month {
      position: absolute;
      right: 33.33%;
      top: 10px;

      .active {
        color: #3399ff;
      }
    }

    .month-sel {
      top: 15px;
      position: absolute;
      right: 16px;
    }
  }

  .news_container {
    .news-list {
      height: 18em;

      .item {
        cursor: pointer;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f2efed;
        letter-spacing: 1px;
        color: #3e3a39;
        padding: 15px 0;

        .news-info {
          flex: 1;
        }

        .news-title {
          font-size: 16px;
          font-weight: 600;
        }

        .news-content {
          font-size: 14px;
          height: 3em;
        }

        .other {
          font-size: 12px;
          margin-top: 10px;
        }

        .ivu-carousel {
          cursor: auto;
          flex-shrink: 0;
          margin-right: 15px;
          height: 100px;
          width: 135px;
          background: #eee;

          .demo-img {
            height: 100px;
            width: 135px;
          }

          :deep(.ivu-carousel-dots) {
            top: 0;
            right: 10px;
            text-align: right;
          }

          :deep(.ivu-carousel-dots li button) {
            opacity: 1;
            width: 8px;
            height: 8px;
            border: 1px solid #fff;
            background: transparent;
            border-radius: 100%;
          }

          :deep(.ivu-carousel-active button) {
            background: #fff !important;
          }
        }

        &:hover {
          .news-title {
            // color:#4398f0;
          }
        }

        &:first-child {
          padding-top: 0;
        }
      }
    }
  }

  .notice-list {
    height: 18em;

    .item {
      justify-content: space-between;
      cursor: pointer;
      display: flex;
      align-items: center;
      color: #3e3a39;
      padding: 7px 0;
      font-size: 14px;

      .notice-date {
        font-size: 13px;
      }

      .notice-title {
        font-size: 15px;
      }

      &:hover {
        // color:#4398f0;
      }

      &:first-child {
        padding-top: 0;
      }
    }
  }

  .ivu-icon-md-more {
    float: right;
  }

  @media screen and (max-width: 1919px) {
    .quick-item img {
      width: l(25);
      margin-right: 5px !important;
    }

    .news-title {
      font-size: 14px !important;
    }
  }

  @media screen and (max-width: 1599px) {
  }

  @media screen and (max-width: 1366px) {
    .quick-item {
      font-size: 13px !important;
    }
  }

  @media screen and (max-width: 1280px) {
  }

  .new_task {
    background: #19cac4;
    font-size: 12px;
    padding: 1px 6px;
    background: red;
    color: #fff;
    border-radius: 10px;
    vertical-align: middle;
    margin-left: 4px;
  }

  body.ivu-theme-dark {
    .sort-items {
      .item {
        background: #1c1c1e;
        color: #fff;

        .left {
          color: #fff;
        }
      }

      .ivu-col {
        &:nth-child(2) {
          .item {
            background: #1c1c1e;
          }
        }

        &:nth-child(3) {
          .item {
            background: #1c1c1e;
          }
        }

        &:nth-child(4) {
          .item {
            background: #1c1c1e;
          }
        }
      }
    }

    .news_container .news-list .item {
      border-bottom: 1px solid #3d3d41 !important;
      color: #696969 !important;

      .news-info a {
        color: #696969 !important;
      }
    }

    .notice-title a {
      color: #696969 !important;
    }
  }

  .weatherItem {
    margin: 5px;
    cursor: pointer;
    height: 4.166666666666667rem;
    color: #fff;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
