<template>
  <div v-show="info.weather">
    <img class="faqi" :src="info.img" :title="info.weather" />
    <div class="left">
      <ab-countup
        class="number"
        :end-val="info.temperature"
        :options="{ suffix: '°C' }"
      />
      <p style="margin: 0">
        <span class="ml10">{{ info.city }}</span>
        <span>湿度 {{ info.humidity }}</span>
      </p>
      <p style="margin: 0">
        <span class="ml10">
          {{ info.weather }} {{ info.winddirection }}风 {{ info.windpower }} 级
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import jsonp from './jsonp.js'
  import { abCountup } from '~/agilebpm'
  const info = reactive({
    city: '', //城市名称
    img: '', //天气图片地址
    weather: '', //天气
    temperature: '', //温度
    humidity: '', //湿度
    winddirection: '', //风的方向
    windpower: '', //风的等级
  })

  //搜狐接口已经获取不到IP了, 已更改下面方法
  // //获取IP,并通过ip获取经纬度
  // const getCip = () => {
  //   const scriptd = document.createElement('script')
  //   scriptd.src = 'https://pv.sohu.com/cityjson?ie=utf-8'
  //   scriptd.onload = () => {
  //     getCity(returnCitySN.cip)
  //   }
  //   document.body.appendChild(scriptd)
  // }
  // getCip()

  //获取公网IP
  jsonp(
    'https://api.ipify.org?format=jsonp',
    {
      dataType: 'jsonp',
      jsonp: 'callback',

      type: 'GET',
      async: false,
    },
    0
  ).then((res) => {
    getCity(res.ip)
  })

  //获取经纬度 ,并通过经纬度获取天气
  const getCity = (cip: string) => {
    jsonp(
      `https://restapi.amap.com/v3/ip?ip=${cip}&output=json&key=84e1031718d2f505c18968313edc211e`,
      {
        dataType: 'jsonp', //数据类型为jsonp
        jsonp: 'callback',

        type: 'GET',
        async: false,
      },
      0
    ).then((res) => {
      weather(res.adcode)
    })
  }

  //通过经纬度获取天气,并赋值对应的数据
  const weather = (postcode: string) => {
    jsonp(
      `https://restapi.amap.com/v3/weather/weatherInfo?city=${postcode}&key=84e1031718d2f505c18968313edc211e`,
      //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
      {
        dataType: 'jsonp', //数据类型为jsonp
        jsonp: 'callback',
        //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        //jsonpCallback: 'list',
        type: 'GET',
        async: false,
      },
      0
    ).then((res) => {
      if (res && res.lives && res.lives.length > 0) {
        const live = res.lives[0]
        info.temperature = live.temperature
        info.city = live.city
        info.weather = live.weather
        info.winddirection = live.winddirection
        info.windpower = live.windpower
        info.humidity = live.humidity
        switch (live.weather) {
          case '多云':
            info.img = require('@/assets/home_images/icon-weather/icon-3.png')
            break
          case '晴':
            info.img = require('@/assets/home_images/icon-weather/icon-4.png')
            break
          case '阴':
          case '霾':
            info.img = require('@/assets/home_images/icon-weather/icon-1.png')
            break
          case '雷阵雨':
            info.img = '@/assets/home_images/icon-weather/icon-11.png'
            break
          case '雨夹雪':
            info.img = require('@/assets/home_images/icon-weather/icon-9.png')
            break
          case '小雨':
            info.img = '@/assets/home_images/icon-weather/icon-7.png'
            break
          case '小雪':
            info.img = require('@/assets/home_images/icon-weather/icon-6.png')
            break
          case '大雪':
            info.img = require('@/assets/home_images/icon-weather/icon-2.png')
            break
          case '雾':
            info.img = require('@/assets/home_images/icon-weather/icon-5.png')
            break
          case '浮尘':
          case '扬沙':
            info.img = require('@/assets/home_images/icon-weather/icon-5.png')
            break
          case '沙尘暴':
            info.img = require('@/assets/home_images/icon-weather/icon-5.png')
            break
          case '中雪':
            info.img = require('@/assets/home_images/icon-weather/icon-8.png')
            break
          case '阵雪':
            info.img = '@/assets/home_images/icon-weather/icon-10.png'
            break
        }
      } else {
        console.log('城市信息展示失败，获取不到此IP的城市以及天气信息')
      }
    })
  }
</script>
<style scoped lang="stylus">
    .ml10{
      margin: 8px
    }
    .faqi{
       width: 60px
    }
    .number{
     margin: 5px;
     font-weight: bold
     font-size: 1.5rem;
     line-height: 100%;
  }
  .left{
             justify-content center
             display: flex;
             align-items: flex-start;
             flex-direction column
             color:#fff;

             .number{
                 font-size: l(40);
                 line-height: 100%;
             }
             p{
                 font-size: 13px;
                 letter-spacing: 0px;

             }
         }
         img{
             width l(50)
             margin-right l(20)
         }
</style>
