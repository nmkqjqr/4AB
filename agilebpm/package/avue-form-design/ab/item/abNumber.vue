<template>
  <span v-show="false">{{viewValue}}</span>
    <el-input v-model="viewValue" class="ab-input"  :disabled="item.readOnly">
      <template #prepend v-if="item.coinValue">{{item.coinValue}}</template>
      <template #append v-if="item.convertCurrency">

            {{ abUtil.convertCurrency(viewValue) }}

        </template>

    </el-input>


</template>

<script lang="ts">
  export default {
      name: "abNumber",
  };
  </script>

<script lang="ts" setup>
  import { defineProps,computed } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'


  const props = defineProps({item:{type:Object,required:true}})
  const {item} = toRefs(props)



  const formatNumber = (tempValue: any) => {
    item.value.coinValue
    if (!tempValue) return ''
    if (typeof tempValue == 'number') {
      tempValue = tempValue.toString()
    }

    if (item.value.comdify) {
      tempValue = abUtil.comdify(tempValue)
    }

    if (item.value.decimalPlace > 0) {
      if (tempValue.indexOf('.') != -1) {
        const ary = tempValue.split('.')
        let temp = ary[ary.length - 1]
        if (temp.length > 0 && temp.length < item.value.decimalPlace) {
          let zeroLen = ''
          for (let i = 0; i < item.value.decimalPlace - temp.length; i++) {
            zeroLen = zeroLen + '0'
          }
          tempValue = tempValue + zeroLen
        } else if (temp.length > 0 && temp.length > item.value.decimalPlace) {
          temp = temp.substring(0, item.value.decimalPlace)
          ary[ary.length - 1] = temp
          tempValue = ary.join('.')
        }
      } else {
        let zeroLen = ''
        for (let i = 0; i < item.value.decimalPlace; i++) {
          zeroLen = zeroLen + '0'
        }
        tempValue = tempValue + '.' + zeroLen
      }
    }

    return tempValue
  }


  const viewValue = computed(()=>{
    if(item.value.defaultValue){
      return(formatNumber(item.value.defaultValue))
    }
    return formatNumber(123456.78)
  })

</script>
