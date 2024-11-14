<template>
  <div style="width: 100%">
    <div class="search-box">
      <el-select
        v-if="props.enableModify"
        v-model="address"
        allow-create
        class="one-text"
        clearable
        filterable
        placeholder="请输入位置关键词"
        remote
        :remote-method="remoteMethod"
        reserve-keyword
        size="default"
        style="width: 1240px"
        @change="currentSelect"
        @clear="clearFn"
      >
        <el-option
          v-for="(item, index) in areaList"
          :key="index"
          :label="item.district + item.name"
          :value="item.district + item.name"
        >
          <span>{{ item.district }}</span>
          <span>{{ item.name }}</span>
        </el-option>
      </el-select>
    </div>
    <div id="container" class="map"></div>
  </div>
</template>

<script lang="ts">
  export default { name: 'Position' }
</script>

<script setup lang="ts">
  import {
    reactive,
    toRefs,
    onMounted,
    nextTick,
    defineProps,
    defineEmits,
  } from 'vue'
  import AMapLoader from '@amap/amap-jsapi-loader'
  import { sysApi, abTools } from '~/agilebpm'

  const props = defineProps({
    //选中项绑定值:
    modelValue: {
      type: String,
      required: true,
    },
    showCoordinates: {
      type: Boolean,
      default: false,
    },
    enableModify: {
      type: Boolean,
      default: false,
    },
    defaultCurrentLocation: {
      type: String,
      default: '',
    },
    appKey: {
      type: String,
      default: '',
    },
    securityJsCode: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:modelValue', 'cloneDialog'])
  const state: any = reactive({
    map: null,
    placeSearch: null,
    autoComplete: null,
    marker: null,
    form: {
      address: '',
      lng: '',
      lat: '',
    },
    areaList: [],
    address: '',
  })

  function fetchSecurityJsCode() {
    window._AMapSecurityConfig = {
      securityJsCode: props.securityJsCode,
    }
    initMap()
  }

  onMounted(() => {
    if (props.modelValue && props.modelValue.split(',').length == 3) {
      const arr = props.modelValue.split(',')
      state.form.lng = arr[1]
      state.form.lat = arr[2]
    } else if (props.defaultCurrentLocation) {
      if (props.defaultCurrentLocation.split(',').length == 2) {
        const arr = props.defaultCurrentLocation.split(',')
        state.form.lng = arr[0]
        state.form.lat = arr[1]
      }
      if (props.defaultCurrentLocation.split('，').length == 2) {
        const arr = props.defaultCurrentLocation.split('，')
        state.form.lng = arr[0]
        state.form.lat = arr[1]
      }
    }

    fetchSecurityJsCode()
  })

  const { areaList, address } = toRefs(state)
  function initMap() {
    AMapLoader.load({
      key: props.appKey, // https://console.amap.com/dev/key/app   绑定的服务为 Web端
      version: '2.0',
      plugins: [
        'AMap.ToolBar',
        'AMap.ControlBar',
        'AMap.AutoComplete',
        'AMap.PlaceSearch',
        'AMap.Geocoder',
        'AMap.Marker',
        'AMap.Geolocation',
      ],
    })
      .then((AMap) => {
        let arr = null
        if (props.modelValue && props.modelValue.split(',').length == 3) {
          const value = props.modelValue.split(',')
          arr = [value[1], value[2]]
        }

        state.map = new AMap.Map('container', {
          viewMode: '3D', //  是否为3D地图模式
          zoom: 15,
          center: arr,
          resizeEnable: true,
        })
        // 地图放大缩小插件
        const toolBar = new AMap.ToolBar({
          position: {
            top: '120px',
            right: '51px',
          },
        })
        // 3D地图插件
        const controlBar = new AMap.ControlBar({
          position: {
            top: '20px',
            right: '20px',
          },
        })

        state.geoCoder = new AMap.Geocoder({
          city: '010', //城市设为北京，默认：“全国”
          radius: 1000, //范围，默认：500
        })

        // 正向地理编码
        state.geocoder = new AMap.Geocoder({
          city: state.address,
        })
        // 定位
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：5s
          position: {
            top: '300px',
            right: '30px',
          }, // 定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true, // 定位成功后是否自动调整地图视野到定位点
        })

        if (
          !props.enableModify ||
          props.defaultCurrentLocation == 'currentLocation'
        ) {
          geolocation.getCurrentPosition(function (status: any, result: any) {
            // state.form.lng = position.coords.longitude
            // state.form.lat = position.coords.latitude
            // // 将获取到的位置信息设置为地图中心点
            // initMap([position.coords.longitude, position.coords.latitude])
          })
        }

        // 监听定位按钮的点击事件
        geolocation.on('complete', (result) => {
          // 使用高德地图 JavaScript API 的坐标转换服务将 WGS84 坐标转换为 GCJ02 坐标
          AMap.convertFrom(
            [result.position.lng, result.position.lat],
            'gps',
            (status, result) => {
              if (status === 'complete' && result.locations.length > 0) {
                const gcj02Lng = result.locations[0].lng
                const gcj02Lat = result.locations[0].lat
                // 解析定位结果为中文地址
                const lnglat = [gcj02Lng, gcj02Lat]
                state.geoCoder.getAddress(lnglat, (status, addressResult) => {
                  if (status === 'complete' && addressResult.regeocode) {
                    const formattedAddress =
                      addressResult.regeocode.formattedAddress
                    // 在这里处理解析后的地址

                    state.address = formattedAddress

                    // 返回给父组件的值
                    emit(
                      'update:modelValue',
                      `${formattedAddress},${gcj02Lng},${gcj02Lat}`
                    )
                  }
                })
                // 这里可以继续处理转换后的坐标数据，例如显示标记点等
              } else {
                console.error('Coordinate conversion failed.')
              }
            }
          )
        })

        geolocation.on('error', (error) => {
          console.error('定位失败:', error)
          // 处理定位失败的逻辑
        })

        state.autoComplete = new AMap.AutoComplete({ city: '全国' })
        state.map.setDefaultCursor('pointer') // 使用CSS默认样式定义地图上的鼠标样式
        state.map.on('click', (e) => {
          // 点击地图事件
          if (!e && !e.lnglat) {
            return
          }
          if (!props.enableModify) {
            return
          }
          state.form.lng = e.lnglat.lng
          state.form.lat = e.lnglat.lat
          removeMarker() // 先删除地图上标记点
          setMapMarker() // 在添加新的标记点
        })
        state.map.addControl(toolBar) // 添加右上角的放大缩小
        state.map.addControl(controlBar) // 添加右上角的放大缩小
        state.map.addControl(geolocation) // 添加右上角的放大缩小
        // 监听定位成功事件
      })
      .catch((e) => {
        console.error(e) //加载错误提示
      })
      .finally(() => {
        removeMarker()
        setMapMarker()
      })
  }

  function setMapMarker() {
    if (state.form.lng == '' && state.form.lat == '') {
      return
    }
    state.map.setFitView()
    state.marker = new AMap.Marker({
      map: state.map,
      position: [state.form.lng, state.form.lat],
    })
    toGetAddress()
    state.map.setFitView()
    state.map.add(state.marker)
  }

  function removeMarker() {
    if (state.marker) {
      state.map.remove(state.marker)
    }
  }

  function toGetAddress() {
    const lnglat = [state.form.lng, state.form.lat]
    state.geoCoder.getAddress(lnglat, (status, result) => {
      if (status === 'complete' && result.regeocode) {
        address.value = `${result.regeocode.formattedAddress}`
        // 返回给父组件的值
        emit(
          'update:modelValue',
          `${address.value},${state.form.lng},${state.form.lat}`
        )
      }
    })
  }

  function remoteMethod(query) {
    if (query !== '') {
      setTimeout(() => {
        state.autoComplete.search(query, (status, result) => {
          state.areaList = result.tips
        })
      }, 500)
    } else {
      state.areaList = []
    }
  }

  function currentSelect(val) {
    if (!val) {
      return
    }
    toGetCoordinate(val)
  }

  function clearFn() {
    removeMarker()
    emit('update:modelValue', '')
  }

  function toGetCoordinate(address) {
    state.geocoder.getLocation(address, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        initMap()
        state.form.lng = result.geocodes[0].location.lng
        state.form.lat = result.geocodes[0].location.lat
        state.form.address = `${result.geocodes[0].formattedAddress}`
        // 返回给父组件的值
        emit(
          'update:modelValue',
          `${result.geocodes[0].formattedAddress},${result.geocodes[0].location.lng},${result.geocodes[0].location.lat}`
        )
      }
    })
    nextTick(function () {
      removeMarker()
      setMapMarker()
    })
  }

  function fixed(lng, lat) {
    initMap([lng, lat])
    state.form.lng = lng
    state.form.lat = lat
  }

  // 暴露方法
  defineExpose({
    fixed,
    toGetCoordinate,
  })
</script>

<style scoped lang="scss">
  .map {
    width: 100%;
    height: 600px;

    padding-top: 20px;
  }

  #container {
    margin-top: 20px;
    border-radius: 5px;
  }

  .search-box {
    display: flex;
  }

  .address {
    margin-left: 20px;
  }
</style>
