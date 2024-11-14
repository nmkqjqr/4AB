<template>
  <div style="padding: 10px">
    <h4
      v-if="props.componentConfig.control.title.length > 0"
      style="margin-top: 10px; margin-left: 10px; font-size: 16px"
    >
      {{ props.componentConfig.control.title }}
    </h4>
    <div class="menuBox">
      <ul class="containerBox">
        <li
          v-for="(item, index) in props.componentConfig.control.iconButtonList"
          :key="index"
          class="menuItem"
          :style="{
            width:countWidth() /* 计算每个元素所占的百分比 */,
          }"
        >
          <div>
            <div v-if="props.componentConfig.control.direction == 'horizontal'">
              <div v-show="showConditionCal(item)">
                <span class="spanIcon" @click="buttonClick(item)">
                  <svg-icon
                    :icon="item.icon"
                    :style="{
                      height: props.componentConfig.control.iconSize + 'px',
                    }"
                  />
                </span>
                <span
                  class="spanName"
                  :style="{
                    lineHeight:
                      props.componentConfig.control.iconSize + 2 + 'px',
                    fontSize: props.componentConfig.control.textSize + 'px',
                  }"
                  @click="buttonClick(item)"
                >
                  {{ item.name }}
                </span>
              </div>
            </div>
            <div v-if="props.componentConfig.control.direction == 'vertical'">
              <div v-show="showConditionCal(item)" class="verticalBox">
                <div @click="buttonClick(item)">
                  <svg-icon
                    :icon="item.icon"
                    :style="{
                      height: props.componentConfig.control.iconSize + 'px',
                    }"
                  />
                </div>
                <div
                  :style="{
                    lineHeight:
                      props.componentConfig.control.iconSize + 2 + 'px',
                    fontSize: props.componentConfig.control.textSize + 'px',
                  }"
                  @click="buttonClick(item)"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
  // 图表按钮组件
  export default {
    name: 'AbIcoinButton',
  }
</script>
<script setup lang="ts">
  import { PropType } from 'vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'

  const globalParams = inject('globalParams') as any

  const props = defineProps({
    componentConfig: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
  })

  const { proxy } = abTools.useCurrentInstance()
  const buttonClick = (item: any) => {
    if (!item.url) return

    if (item.url.indexOf('http') != -1) {
      window.open(item.url)
      return
    }
    proxy.$router.push({
      path: item.url,
    })
  }

  const showConditionCal = (element: any) => {
    if (!element.showCondition || !globalParams) return true
    try {
      return eval(element.showCondition)
    } catch (err) {
      console.error(
        `图表按钮展示脚本异常，将隐藏该按钮[ ${element.name} ]",脚本：[ ${element.showCondition} ]。参数如下：`
      )
      console.info(globalParams)
      console.info(err)
    }
    return false
  }

  const countWidth = () => {
    let width = ''
    width = Math.floor(100 / props.componentConfig.control.spaceSize) + '%'
    return width
  }
</script>
<style lang="scss" scoped>
  .item-card {
    display: inline-block;
    margin: 16px;
    text-align: center;
    cursor: pointer;
  }
  .menuItem {
    // height: 20px; /* 高度可以根据实际情况调整 */
    margin: 10px 0; /* 间距也可以根据实际情况调整 */
    // background-color: #ccc;
  }
  .containerBox {
    display: flex; /* 或者 inline-flex */
    flex-wrap: wrap;
    align-items: center; /* 垂直居中对齐 */
    justify-content: flex-start; /* 水平居中对齐 */
    padding: 0;
    margin: 0;
  }
</style>
