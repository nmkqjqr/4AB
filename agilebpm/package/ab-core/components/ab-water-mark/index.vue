<template>
  <div v-if="visible" :style="styles"></div>
</template>
<script lang="ts">
  export default {
    name: 'AbWaterMark',
  }
</script>
<script setup lang="ts">
  import useAbStoreAdapter from '../../../../api/ab-store'
  import { useSettingsStore } from '@/store/modules/settings'
  const settingsStore = useSettingsStore()
  const { custom } =
    storeToRefs(settingsStore)

  const props = defineProps({
    // 是否显示
    visible: { type: Boolean, default: false },
    // 水印文字
    text: { type: String, required: true },
    // 透明度
    opacity: { type: Number, default: 0.05 },
    // 字体
    font: { type: String, default: '20px Microsoft Yahei' },
    // 角度
    rotateAngle: { type: Number, default: -0.4 },
  })

  const time = ref(new Date().format('yyyy-MM-dd HH:mm'))
  const getTime = () => {
    time.value = new Date().format('yyyy-MM-dd HH:mm')
  }
  let timer = 0
  onMounted(() => {
    timer = setInterval(() => {
      getTime()
    }, 1000)
  })
  onBeforeUnmount(() => {
    clearInterval(timer)
    timer = 0
  })
  
  const generateWaterMarkUrl = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const canvasWidth = 400
    const canvasHeight = 400
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.globalAlpha = props.opacity
    ctx.font = props.font
    ctx.translate(canvasWidth / 2, canvasHeight / 2)
    ctx.rotate(props.rotateAngle || -0.4)

    const abUser = useAbStoreAdapter().getAbUser
    const currentOrg = useAbStoreAdapter().getCurrentOrg

    let text = ''
    if(custom.value && custom.value.length > 0){
      text += custom.value
    }else{
      text += ''
    }
    if(props.text && props.text.length > 0){
      if(props.text.includes('username')){
        text += '-' + abUser['username']
      }
      if(props.text.includes('department')){
        text += currentOrg['groupName'] && currentOrg['groupName'].length > 0 ? '-' + currentOrg['groupName'] : ''
      }
      if(props.text.includes('date')){
        text += '-' + time.value
      }
    }

    ctx.fillText(formatText(text, abUser), 0, 0)
    return ctx.canvas.toDataURL()
  }

  const formatText = (text: string, dataModel) => {
    let formatText = ''
    let pos = 0
    while (pos < text.length) {
      const searchIndex = text.indexOf('{', pos)
      if (searchIndex != -1) {
        const prevChar = searchIndex == 0 ? '' : text.charAt(searchIndex - 1)
        if (prevChar == '\\') {
          formatText += text.substring(pos, searchIndex + 1)
          pos = searchIndex + 1
        } else {
          formatText += text.substring(pos, searchIndex)
          const endIndex = text.indexOf('}', searchIndex)
          if (endIndex != -1) {
            const varName = text.substring(searchIndex + 1, endIndex)
            formatText += dataModel[varName] || ''
            pos = endIndex + 1
          } else {
            formatText += text.substring(pos, searchIndex)
            pos = endIndex
          }
        }
      } else {
        formatText += text.substring(pos, text.length)
        pos = text.length
      }
    }

    return formatText
  }

  const styles = computed(() => {
    return {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '0',
      left: '0',
      'z-index': '9999999',
      'background-size': '320px',
      'background-repeat': 'repeat',
      'background-image': `url(${generateWaterMarkUrl()})`,
      'pointer-events': 'none',
    }
  })
</script>
