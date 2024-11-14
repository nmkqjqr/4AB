<template>
  <div
    v-if="type == 'row'"
    ref="resize_row"
    class="resize_row"
    title="收缩侧边栏"
  ></div>
  <div v-else ref="resize_col" class="resize_col" title="收缩侧边栏"></div>
</template>
<script setup lang="ts">
  import { number } from 'echarts'
  import { defineProps, defineEmits, ref, watch } from 'vue'

  const props = defineProps({
    type: {
      type: String,
      defult: () => 'row',
    },
    width: {
      type: Number,
      defult: 400,
    },
    height: {
      type: Number,
      defult: 260,
    },
  })

  const emit = defineEmits(['setWidth', 'setHeight'])

  watch(
    () => props.width,
    (val) => {
      if (props.type == 'col') {
        resize_col.value.style.left = '-5px'
      }
    }
  )
  watch(
    () => props.height,
    (val) => {
      if (props.type == 'row') {
        resize_row.value.style.top = '-5px'
      }
    }
  )
  const resize_col = ref(null)
  const resize_row = ref(null)

  const dragControllerDiv = () => {
    let resize: HTMLCollectionOf<Element>
    if (props.type == 'col') {
      resize = document.getElementsByClassName('resize_col')
    } else {
      resize = document.getElementsByClassName('resize_row')
    }

    for (let i = 0; i < resize.length; i++) {
      // 鼠标按下事件
      resize[i].onmousedown = function (e) {
        //颜色改变提醒
        resize[i].style.background = 'rgb(151, 191, 230)'
        const startX = e.clientX
        const startY = e.clientY
        let changeY = 0
        let changeX = 0
        // 鼠标拖动事件
        document.onmousemove = function (e) {
          const endX = e.clientX
          const endY = e.clientY
          changeX = startX - endX // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
          changeY = startY - endY
          if (props.type == 'col') {
            resize[i].style.left = -5 + -changeX + 'px' // 设置左侧区域的宽度
          } else {
            resize[i].style.top = -5 + -changeY + 'px'
          }
        }
        // 鼠标松开事件
        document.onmouseup = function (evt) {
          if (props.type == 'col') {
            emit('setWidth', changeX)
          } else {
            emit('setHeight', changeY)
          }

          //颜色恢复
          resize[i].style.background = 'transparent'
          document.onmousemove = null
          document.onmouseup = null

          resize[i].releaseCapture && resize[i].releaseCapture() //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
        }
        resize[i].setCapture && resize[i].setCapture() //该函数在属于当前线程的指定窗口里设置鼠标捕获
        return false
      }
    }
  }
  onMounted(() => {
    dragControllerDiv()
  })
</script>
<style lang="scss">
  .resize_row {
    cursor: n-resize !important;
    position: absolute;
    background-color: transparent;
    height: 5px;
    width: 100%;
    background-size: cover;
    background-position: center;
    top: -5px;
    left: 0;
    z-index: 1000;
  }

  .resize_col {
    cursor: e-resize !important;
    position: absolute;
    background-color: transparent;
    width: 5px;
    height: 100%;
    background-size: cover;
    background-position: center;
    top: 0;
    left: -5px;
    z-index: 1000;
  }
</style>
