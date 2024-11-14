<template>
  <el-button :icon="Edit" text type="primary" @click="open">配置脚本</el-button>

  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    :destroy-on-close="true"
    draggable
    style="max-width: 1100px"
    :title="`条件配置`"
    :top="props.top"
    :width="props.width"
  >
    <condition-script ref="script" v-model="info.data" />
    <template #footer>
      <span class="dialog-footer">
        <el-button text type="primary" @click="info.dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogOk">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { reactive } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  import { Edit } from '@element-plus/icons-vue'
  import type { FormInstance } from 'element-plus'
  import conditionScript from '~/agilebpm/package/ab-common-resource/bpmDesign/conditionScript/conditionScript.vue'

  /**
   *  这段代码逻辑比较麻烦，建议读下描述再说操作
   * 1、流程中可用的变量 scriptVariables 在scriptVariablesInit.vue 中做初始化
   * 主要获取业务对象，流程变量，并对它进行一下转化，提供给流程其他配置页面
   * 2、不同类型数据支持不同的条件，在cascaderConfig中配置,条件为两个表达式的格式化模板，如a=b 条件模板为 {0}.equals( {1} )，最终会通过条件模板来格式化
   * 如 数字可以大于小于，数组可以包含不包含，人员id可以选用户，角色id可以选角色
   * 3、综述：字段根据参数类型valueType，决定条件展示，
   * 条件condition + 参数值valueType类型 决定值选择，选择后通过条件模板，生成语句
   *  看一个参数的例子业务对象金额字段>固定值3 { "keyName": [ "ddb", "get('ddje')" ], "key": "ddb.get('ddje')",
   *  "keyType": "number", "condition": "{0} > {1} ", "valueType": "fixed", "value": "3", "valueDesc": "" }
   *
   *
   */
  const scriptVariables = inject('scriptVariables') as any

  const props = defineProps({
    modelValue: { required: true, type: Object },
    top: { required: false, type: String, default: '5vh' },
    width: { required: false, type: String, default: '75%' },
  })

  const emit = defineEmits(['update:modelValue', 'dialogOk'])
  const info: any = reactive({
    dialogVisible: false,
    data: {
      type: 'config',
      handScript: {
        script: '',
        desc: '',
      },
      configScript: {
        script: "return (submitActionName == 'agree')",
        desc: '任务处理动作 等于 同意',
        configs: [
          {
            sn: 1,
            list: [
              {
                keyName: ['submitActionName'],
                key: 'submitActionName',
                keyType: 'actionType',
                condition: '{0}.equals( {1} )',
                valueType: 'actionType',
                value: 'agree',
              },
            ],
          },
        ],
      },
    },
  })

  const open = () => {
    info.dialogVisible = true
    if (props.modelValue && props.modelValue.type) {
      info.data = abUtil.clone(props.modelValue)
    }
  }

  const formRef = ref<FormInstance>()
  const dialogOk = () => {
    info.dialogVisible = false
    emit('update:modelValue', info.data)
    emit('dialogOk', info.data)
  }

  const tagChange = () => {}

  const addConfig = (config: any) => {
    config.push({
      keyName: ['submitActionName'],
      key: 'submitActionName',
      keyType: 'actionType',
      condition: '{0}.equals( {1} )',
      valueType: 'actionType',
      value: 'agree',
    })
  }
</script>
