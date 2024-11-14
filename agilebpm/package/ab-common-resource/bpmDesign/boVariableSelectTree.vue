<template>
  <el-tree-select
    v-model="info.data.formFieldPathDesc"
    :clearable="true"
    :data="info.boOption"
    :default-expand-all="props.defaultExpandAll"
    :placeholder="props.placeholder"
    :render-after-expand="false"
    @change="changeModel"
  />
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { ElTree } from 'element-plus'

  const props = defineProps({
    /** 类型是 BoTreeModelType */
    modelValue: { required: true, type: Object },
    placeholder: { type: String, default: '请选择' },
    //数据类型：boList 表单字段集合，variables：变量集合，all：表单和变量合集
    dataType: { type: String, default: 'all' },
    defaultExpandAll: { type: Boolean, default: true },
    //字段类型，可以根据字段类型赛选数据
    columnType: { type: Array[String], default: [] },
  })

  const emit = defineEmits(['update:modelValue'])

  const treeRef = ref<InstanceType<typeof ElTree>>()

  const boList = inject('boList') as any
  const scriptVariables = inject('scriptVariables') as any

  const changeModel = (value: string) => {
    if (!value || value === '') {
      emit('update:modelValue', {})
      return
    }
    const levelKeys = value.split('.')
    const levelNames = []
    let levelKeysIndex = 0
    let searchOptions = info.boOption
    while (levelKeysIndex++ < levelKeys.length && searchOptions) {
      const currentKey = levelKeys.slice(0, levelKeysIndex).join('.')
      const option = searchOptions.find(
        (option: ElTreeSelectOption) => option.value == currentKey
      )
      levelNames.push(option.label)
      searchOptions = option.children
    }

    info.data.formFieldPath = value
    info.data.formFieldPathDesc = levelNames.join('-')
    const result: BoTreeModelType = {
      desc: levelNames.join('-'),
      value: value,
      type: value.startsWith('flowVariable$.') ? 'flowVariable' : 'formField',
    }
    emit('update:modelValue', result)
  }

  class ElTreeSelectOption {
    label: string
    value: string
    children: ElTreeSelectOption[]

    constructor(label: string, value: string) {
      this.label = label
      this.value = value
      this.children = []
    }

    addChild(child: ElTreeSelectOption): void {
      this.children.push(child)
    }
  }

  const initBo = () => {
    const recursionSubTables = (
      subTables: any[],
      parentOption: ElTreeSelectOption
    ) => {
      for (const subTable of subTables) {
        const option = new ElTreeSelectOption(
          subTable.tableComment,
          `${parentOption.value}.${subTable.tableCode}`
        )
        subTable.table.columns.forEach((column: any) =>
          option.addChild(
            new ElTreeSelectOption(
              column.comment,
              `${option.value}.${column.code}`
            )
          )
        )
        parentOption.addChild(option)
        if (subTable.children) recursionSubTables(subTable.children, option)
      }
    }

    if (props.dataType === 'boList' || props.dataType === 'all') {
      boList.forEach((bo: any) => {
        const option = new ElTreeSelectOption(bo.name, bo.code)
        bo.rel.table.columns.forEach((column: any) => {
          if (
            !props.columnType ||
            props.columnType.length === 0 ||
            props.columnType.includes(column.type)
          ) {
            option.addChild(
              new ElTreeSelectOption(
                column.comment,
                `${bo.code}.${column.code}`
              )
            )
          }
        })
        info.boOption.push(option)
        if (bo.rel.children) recursionSubTables(bo.rel.children, option)
      })
    }
    if (props.dataType === 'variables' || props.dataType === 'all') {
      //只取variableScope 中的变量
      const variableScope = scriptVariables.find((item: any) => {
        return item.value === 'variableScope'
      })
      if (
        variableScope &&
        variableScope.children &&
        variableScope.children.length > 0
      ) {
        const option = new ElTreeSelectOption(
          variableScope.label,
          'flowVariable$'
        )
        variableScope.children.forEach((variable: any) => {
          option.addChild(
            new ElTreeSelectOption(
              variable.label,
              `flowVariable$.${variable.key}`
            )
          )
        })
        info.boOption.push(option)
      }
    }
  }

  const info: any = reactive({
    data: {
      formFieldPath: '',
      formFieldPathDesc: '',
    },
    boOption: [],
  })

  onMounted(() => {
    info.data.formFieldPath = props.modelValue.value
    info.data.formFieldPathDesc = props.modelValue.desc
    initBo()
  })
</script>

<style></style>
