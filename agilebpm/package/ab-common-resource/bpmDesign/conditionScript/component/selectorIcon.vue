<template>
  <span class="showStyle">
    <span v-if="props.selectType === 'user'">
      <el-avatar v-if="props.data.photo" class="iconImg" :size="25">
        <img
          :src="sysApi.sysFile.getViewFileUrl(props.data.photo)"
          style="width: 100%; height: 100%"
        />
      </el-avatar>
      <el-avatar
        v-else
        class="iconImg"
        :size="25"
        style="background-color: rgb(240, 171, 87)"
      >
        {{ props.data.label.charAt(0) }}
      </el-avatar>
    </span>
    <span v-else-if="icon">
      <svg-icon
        class="iconImg"
        class-name="imag"
        :icon="icon"
        style="width: 28px; height: 24px"
      />
    </span>
    <span class="spanText">{{ props.data.label }}</span>
    <slot></slot>
  </span>
</template>
<script setup lang="ts">
  import { svgIcon } from '@ab-core'
  import { sysApi } from '~/agilebpm/api'

  const props = defineProps({
    selectType: {
      type: String,
      default: 'custom',
    },
    icon: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      required: true,
    },
  })

  const icon = computed(() => {
    if (props.selectType === 'custom' || props.icon) {
      return props.icon
    }

    if (props.selectType === 'role') return 'circle'
    if (props.selectType === 'post') return 'customer'
    if (props.selectType === 'org') return 'org'
    return ''
  })
</script>

<style lang="scss" scoped>
  .showStyle {
    display: inline-block;
    float: left;
    padding: 1px 6px;
    margin: 4px;
    overflow: hidden;
    font-size: 14px;
    cursor: pointer;
    background-color: #f1f1f1;
    border-radius: 5px;
    .iconImg {
      float: left;
      margin-top: 3px;
      margin-right: 3px;
      //background-color: rgb(240, 171, 87);
    }
    .spanText {
      float: left;

      line-height: 32px;
      // margin: 0px 0 0 4px;
    }
  }
</style>
