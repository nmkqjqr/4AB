<template>
  <div>
    <el-form
      :label-position="props.advanced ? 'left' : 'right'"
      :label-width="props.advanced ? '100px' : '90px'"
      :model="info.data.fieldSort"
    >
      <el-form-item label="默认排序">
        <el-select
          v-model="info.data.fieldSort"
          multiple
          placeholder="请选择"
          style="width: 200px"
          value-key="fieldName"
        >
          <el-option
            v-for="item in info.sortList"
            :key="item.fieldName"
            :label="item.fieldDesc"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div style="width: 360px;" :style="{padding:props.advanced ? '0' : '0 0 0 16px'}">
      <el-table
        v-if="
         info.data.fieldSort &&
         info.data.fieldSort.length > 0
        "
        border
        :data="info.data.fieldSort" 
        style="width: 100%; margin-top: 10px;margin-bottom: 18px;"
      >
        <el-table-column label="字段名称" prop="fieldDesc">
          <template #default="scope">
            <span>{{ scope.row.fieldDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序类型" prop="sortType">
          <template #default="scope">
            <el-select
              v-model="scope.row.sortType"
              class="m-2"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="item in info.sortOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  const emit = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
    // eslint-disable-next-line vue/require-default-prop
    advanced:{
      type: Boolean,
      default: false, // 高级模式，需要额外的操作
    }
  })
  const info: any = reactive({
    data: useVModel(props, 'modelValue', emit),
    sortOptions: [
      {
        label: '升序',
        value: 'asc',
      },
      {
        label: '降序',
        value: 'desc',
      },
    ],
    sortList:[]
  })
  
  info.sortList = []
  if(info.data.fieldsList && info.data.fieldsList.length > 0){
    info.data.fieldsList.forEach((item:any) => {
      // 屏蔽当前环节abInstValMapLoader_abTaskUserJson
      if(item.fieldName !== 'abInstValMapLoader_abTaskUserJson'){
        info.sortList.push({
          fieldDesc:item.fieldDesc,
          fieldName:item.fieldName,
          sortType:'desc'
        })
      }
    })
  }

  if(typeof info.data.fieldSort == 'string'){
    info.data.fieldSort = JSON.parse(info.data.fieldSort)
    if(!info.data.fieldSort || info.data.fieldSort.length <= 0){
      info.data.fieldSort = info.sortList[0] ? [info.sortList[0]] : []
    }
  }else{
    if(!info.data.fieldSort){
      info.data.fieldSort = []
    }
    info.data.fieldSort = info.sortList[0] ? [info.sortList[0]] : []
  }
</script>
<style lang="scss" scoped>
  .tipBackground {
    background-color: blue !important;
  }
</style>
