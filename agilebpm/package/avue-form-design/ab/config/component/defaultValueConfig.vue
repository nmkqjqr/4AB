<template>
  <div>
    <el-form-item>
      <template #label>
        <div>
          默认值:
          <el-tooltip
            class="box-item"
            content="支持以#{}包含的以脚本运行，eg:#{sysScript.getCurrentUserName()}"
            effect="dark"
            placement="top-start"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-select
        v-model="value"
        v-if="pageData.defaultValueOps[props.filedType]"
        allow-create
        clearable
        filterable
        :placeholder="defaultValuePlaceholder"
      >
        <el-option
          v-for="(val, key) in pageData.defaultValueOps[props.filedType]"
          :key="key"
          :label="val"
          :value="key"
        />
      </el-select>
      <el-input
        v-else
        v-model="value"
        :placeholder="defaultValuePlaceholder"
      />
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
  import { QuestionFilled } from '@element-plus/icons-vue'
  const props = defineProps({
    default:{
      type:Object,
      default:null
    },
    modelValue:{
      type:String,
      default:null
    },
    filedType:{
      type:String,
      default:null
    }
  })

  const pageData = reactive({
    defaultValueOps: [] as any,
  })

  //双向绑定
  const emit = defineEmits(['update:modelValue', 'input'])
  const value = useVModel(props, 'modelValue', emit)

  onMounted(()=>{
    pageData.defaultValueOps.varchar = {
        '${currentUserId}': '当前用户ID',
        '${currentUserName}': '当前用户名',
        '${currentUserAccount}': '当前用户账号',
        '${currentOrgId}': '当前用户组织ID',
        '${currentOrgName}': '当前用户组织名',
        '${currentOrgCode}': '当前用户组织编码',
         '${currentCompanyId}': '当前用户公司ID',
    }
    pageData.defaultValueOps.date = { '${currentDateTime}': '当前时间' }
  }) 

  const defaultValuePlaceholder = computed(()=>{
    if(props.modelValue ){
      return "业务实体默认值：" + props.modelValue
    }
    return "请输入默认值"
  })
</script>

