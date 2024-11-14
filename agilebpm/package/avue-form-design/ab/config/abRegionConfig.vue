<template>
  <div>
    <label class="el-form-item__label" style="padding: 0">区域选择配置：</label>
    
    <el-form-item label="多选">
      <el-switch
        v-model="data.abCascaderConfig.multiple"
        inline-prompt
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>

    <el-form-item  v-if="data.abCascaderConfig.multiple">
      <template #label>
        <div>
          任意选:
          <el-tooltip
            class="box-item"
            content="在多选模式下，可让父子节点取消关联，选择任意一级选项"
            effect="dark"
            placement="top-start"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-switch
        v-model="data.abCascaderConfig.checkStrictly"
        inline-prompt
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <el-form-item label="默认值">
      <el-input
        v-model="data.defaultValue"
        :placeholder="defaultValuePlaceholder"
      />
    </el-form-item>
  </div>
</template>

<script lang="ts">
  export default {
      name: "ab-region-select-config",
  };
  </script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { ElMessage } from 'element-plus'
  import { bizApi } from '@agilebpm/api'
  import defultValueConfig from './component/defaultValueConfig.vue'
  
  const props = defineProps({data:{type:Object,required:true},})
  
  const {data} = toRefs(props)
  const dialogFields =ref([] as any)
  const dialogParams = ref([] as any)
  const params:any = ref(props.data.params)
  
  
  const initData = ()=>{
    data.value.dialogKey = "areaQuery"
    data.value.valueField="id"
    data.value.labelField="name"
  
   if(!data.value.abCascaderConfig){
      data.value.abCascaderConfig={
        multiple:false,
        checkStrictly:false
      }
    }
  }
initData()
</script>