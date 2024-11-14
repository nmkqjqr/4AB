<template>
  <div style="height: 100%; padding: 10px">
    <template v-if="info.pictureList.length > 1">
      <el-carousel
        v-if="props.componentConfig.control.tcType == 2"
        :autoplay="props.componentConfig.control.autoplay"
        class="carouselBox"
        style="height: 100%"
      >
        <el-carousel-item
          v-for="(item, index) in info.pictureList"
          :key="index"
          :style="{
            backgroundImage: 'url(' + item + ')',
            backgroundRepeat: '' /* 设置背景图片不重复 */,
            backgroundSize: 'auto 100%',
          }"
        />
      </el-carousel>
      <el-carousel
        v-else
        :autoplay="props.componentConfig.control.autoplay"
        class="carouselBox"
        style="height: 100%"
        :style="{
          textAlign: props.componentConfig.control.tcType == 0 ? 'center' : '',
        }"
      >
        <el-carousel-item
          v-for="(item, index) in info.pictureList"
          :key="index"
        >
          <el-image
            :fit="'fill'"
            :src="item"
            style="height: 100%"
            :style="{
              width: props.componentConfig.control.tcType == 1 ? '100%' : '',
            }"
          />
        </el-carousel-item>
      </el-carousel>
    </template>
    <template v-else>
      <div
        v-if="props.componentConfig.control.tcType == 2"
        style="height: 100%"
        :style="{
          backgroundImage: 'url(' + info.pictureList[0] + ')',
          backgroundRepeat: '' /* 设置背景图片不重复 */,
          backgroundSize: 'auto 100%',
        }"
      ></div>
      <div
        v-else
        style="height: 100%"
        :style="{
          textAlign: props.componentConfig.control.tcType == 0 ? 'center' : '',
        }"
      >
        <el-image
          v-if="info.pictureList[0]"
          :fit="'fill'"
          :src="info.pictureList[0]"
          style="height: 100%"
          :style="{
            width: props.componentConfig.control.tcType == 1 ? '100%' : '',
            textAlign:
              props.componentConfig.control.tcType == 0 ? 'center' : '',
          }"
        />
      </div>
    </template>
  </div>
</template>
<script lang="ts">
  // 图片组件
  export default {
    name: 'AbPictureLayout',
  }
</script>
<script setup lang="ts">
  import { PropType } from 'vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { sysApi } from '@agilebpm/api'

  const globalParams = inject('globalParams') as any

  const props = defineProps({
    componentConfig: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
  })
  const info = reactive({
    pictureList: [],
  })
  watch(
    () => {
      return props.componentConfig.control.picture
    },
    (newValue, oldVal) => {
      info.pictureList = []
      if (newValue && newValue.length > 0) {
        JSON.parse(newValue).forEach((item: any) => {
          info.pictureList.push(sysApi.sysFile.getViewFileUrl(item.id))
        })
      }
    }
  )

  if (
    props.componentConfig.control.picture &&
    props.componentConfig.control.picture.length > 0
  ) {
    JSON.parse(props.componentConfig.control.picture).forEach((item: any) => {
      info.pictureList.push(sysApi.sysFile.getViewFileUrl(item.id))
    })
  }

  const { proxy } = abTools.useCurrentInstance()
</script>

<style lang="scss" scoped>
  .item-card {
    display: inline-block;
    margin: 16px;
    text-align: center;
    cursor: pointer;
  }
  :deep(.carouselBox .el-carousel__container) {
    height: 100% !important;
  }
</style>
