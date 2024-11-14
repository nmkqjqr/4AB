<template>
  <svg aria-hidden="true" class="icon" @click="emit('click', $event)">
    <use :xlink:href="`#icon-${icon}`" />
  </svg>
</template>

<script lang="ts">
  export default {
    name: 'AbIcon',
  }
</script>

<script lang="ts" setup>
  import './icon'
  const props = defineProps({
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '50px',
    },
  })

  const emit = defineEmits(['click'])
  /**
{
     title: {
       text: '标题名称',
       subtext:'副标题',
     left: 'center'
     },

     legend: {
       data: ['产品A', '产品B'],
       align: 'left',
       right:30,
     },
     xAxis: {
       name:'abc',
       data: ['数据1', '数据2', '数据3', '数据4', '数据5', '数据6'],
     },
     yAxis: {      name:'ddd',},
     series: [
       {
         name: '产品A',
         type: 'bar',
         data: [5, 20, 36, 10, 13, 20],
       },
       {
         name: '产品B',
         type: 'bar',
         data: [25, 28, 16, 15, 10, 25],
       },
     ],
   }
*/
</script>

<style scoped lang="scss">
  $width: v-bind(size);
  $height: v-bind(size);
  .icon {
    width: $width;
    height: $height;
    overflow: hidden;
    vertical-align: middle;
    fill: currentColor;
  }
</style>
