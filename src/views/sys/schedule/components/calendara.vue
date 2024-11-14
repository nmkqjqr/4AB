<template>
  <div>
    <el-calendar v-model="state.toDay" v-loading="state.loadingcal">
      <template #dateCell="{ data }">
        <div class="calendar-item">
          <h2 style="margin: 1px 0">{{ data.day.split('-')[2] }}</h2>
          <div class="onedaybox">
            <p
              v-for="item in getData(data.day)"
              :key="item.id"
              style="margin: 1px 0"
            >
              <el-tooltip
                class="box-item"
                :content="item.title"
                effect="dark"
                placement="top-start"
              >
                <el-progress :percentage="item.rateProgress" />
              </el-tooltip>
            </p>
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>
<script setup>
  import { onMounted, reactive, nextTick, defineExpose, toRefs } from 'vue'
  import { dateFormat } from '@/utils'
  import { sysApi, postData } from '~/agilebpm'
  const state = reactive({
    toDay: new Date(),
    loadingcal: false,
    data: {},
    query: {
      startTime: '',
      endTime: '',
    },
  })
  const getData = (date) => {
    return state.data[date]
  }
  const getscheFn = () => {
    state.loadingcal = true
    postData(sysApi.schedule.schedulegetEvents, state.query).then(
      (result) => {
        state.loadingcal = false
        const obj = {}
        result.forEach((element) => {
          element.startDay = element.startTime.split(' ')[0]
          element.endDay = element.endTime.split(' ')[0]
          element.startT = element.startTime.split(' ')[1]
          getAllDate(element.startDay, element.endDay).forEach((key) => {
            if (!obj[key]) {
              obj[key] = []
            }
            obj[key].push(element)
          })
        })
        state.data = obj
      },
      () => {
        state.loadingcal = false
      }
    )
  }
  // 获取当月月初月末时间戳
  const getCurrentMonth = (time) => {
    const firstDate = new Date(time)
    const startDate =
      `${firstDate.getFullYear()}-${firstDate.getMonth() + 1 < 10 ? '0' : ''}${
        firstDate.getMonth() + 1
      }-` + `01`

    const date = new Date(time)
    let currentMonth = date.getMonth()
    const nextMonth = ++currentMonth
    const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
    const oneDay = 1000 * 60 * 60 * 24
    const lastDate = new Date(nextMonthFirstDay - oneDay)
    const endDate = `${lastDate.getFullYear()}-${
      lastDate.getMonth() + 1 < 10 ? '0' : ''
    }${lastDate.getMonth() + 1}-${
      lastDate.getDate() < 10 ? '0' : ''
    }${lastDate.getDate()}`
    state.query.startTime = Date.parse(`${startDate} 00:00:00`)
    state.query.endTime = Date.parse(`${endDate} 24:00:00`)
    getscheFn()
  }
  // 根据起始日期和结束日期获取时间段数组
  // 输入日期的格式："2021-01-01"
  const getAllDate = (day1, day2) => {
    // fix : 修复输入两个一样日期导致出错
    if (day1 === day2) {
      return [day1]
    }
    const getDate = function (str) {
      const tempDate = new Date()
      const list = str.split('-')
      tempDate.setFullYear(list[0])
      tempDate.setMonth(list[1] - 1)
      tempDate.setDate(list[2])
      return tempDate
    }
    let date1 = getDate(day1)
    let date2 = getDate(day2)
    if (date1 > date2) {
      const tempDate = date1
      date1 = date2
      date2 = tempDate
    }
    date1.setDate(date1.getDate() + 1)
    const dateArr = []
    let i = 0
    while (
      !(
        date1.getFullYear() == date2.getFullYear() &&
        date1.getMonth() == date2.getMonth() &&
        date1.getDate() == date2.getDate()
      )
    ) {
      let dayStr = date1.getDate().toString()
      if (dayStr.length == 1) {
        dayStr = `0${dayStr}`
      }
      const monthStr =
        date1.getMonth() + 1 < 10
          ? `0${date1.getMonth() + 1}`
          : date1.getMonth() + 1

      dateArr[i] = `${date1.getFullYear()}-${monthStr}-${dayStr}`

      i++
      date1.setDate(date1.getDate() + 1)
    }
    dateArr.splice(0, 0, day1)
    dateArr.push(day2)
    return dateArr
  }

  const clickmonthFn = () => {
    console.log(dateFormat(state.toDay))
    getCurrentMonth(dateFormat(state.toDay))
    nextTick(() => {
      // 点击前一个月
      const prevBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(1)'
      )
      prevBtn.addEventListener('click', () => {
        getCurrentMonth(dateFormat(state.toDay))
      })
    })
    nextTick(() => {
      // 点击前今天
      const prevBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(2)'
      )
      prevBtn.addEventListener('click', () => {
        getCurrentMonth(dateFormat(state.toDay))
      })
    })
    nextTick(() => {
      // 点击后一个月
      const prevBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:last-child'
      )
      prevBtn.addEventListener('click', () => {
        getCurrentMonth(dateFormat(state.toDay))
      })
    })
  }
  onMounted(() => {
    clickmonthFn()
  })
  defineExpose({
    ...toRefs(state),
    getData,
    clickmonthFn,
  })
</script>
<style lang="scss" scoped>
  .calendar-item h2 {
    font-size: 14px;
  }
  .calendar-item-info {
    margin-top: 15px;
  }
  .calendar-item-info p {
    margin-top: 5px;
  }

  .onedaybox {
    height: 62px;
    overflow: auto;
  }
</style>
