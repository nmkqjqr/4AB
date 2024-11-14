<template></template>
<script setup lang="ts">
  import { bizApi } from '@agilebpm/api'
  import { reactive } from 'vue'
  import { cascaderOptions } from './conditionScriptConfig'
  import { abT } from '@/i18n'
  const props = defineProps({
    wfBoList: { required: true, type: Array },
    bpmSetting: {
      required: true,
      type: Object,
    },
    scriptVariables: {
      required: true,
      type: Array,
    },
    boList: {
      required: false,
      type: Array,
    },
    //支持的条件类型，默认使用cascaderOptions + scriptVariables
    //传入typeList ，则使用 typeList + scriptVariables
    typeList: {
      required: false,
      type: Array,
      default: () => {
        return []
      },
    },
  })
  const pageData = reactive({
    initBoMap: {},
    variables: {
      value: 'variableScope',
      label: abT('bpm.office. processVariables', '流程变量'),
      type: 'variables',
      children: [] as object[],
    },
  })

  const { scriptVariables, boList } = toRefs(props) as any
  scriptVariables.value.push(pageData.variables)

  // 赋值下 通用变量
  if (props.typeList.length > 0) {
    props.typeList.forEach((item) => {
      scriptVariables.value.push(item)
    })
  } else {
    cascaderOptions.forEach((item) => {
      scriptVariables.value.push(item)
    })
  }

  const initBo = () => {
    // TODO 业务对象移除时，删掉旧的
    //本次所有需要加载的对象
    const newBoCodeMap = {}
    //已经加载过的对象避免重复加载
    pageData.initBoMap = {}
    props.bpmSetting?.bizModeList?.forEach((item: any) => {
      newBoCodeMap[item.code] = true
    })
    let i = scriptVariables?.value?.length
    while (i--) {
      if (scriptVariables.value[i].type == 'main') {
        if (!newBoCodeMap[scriptVariables.value[i].value]) {
          scriptVariables.value.splice(i, 1)
        } else if (scriptVariables.value[i].value) {
          pageData.initBoMap[scriptVariables.value[i].value] = true
        }
      }
    }
    let b_i = boList?.value?.length
    while (b_i--) {
      if (!newBoCodeMap[boList.value[b_i].code]) {
        boList.value.splice(b_i, 1)
      } else if (boList.value[b_i].code) {
        pageData.initBoMap[boList.value[b_i].code] = true
      }
    }
    if (props.bpmSetting?.bizModeList.length > 0) {
      props.bpmSetting?.bizModeList?.forEach((item: any) => {
        if (pageData.initBoMap[item.code]) return
        bizApi.bizObject.getBizObject(item.code).then(({ data }) => {
          createBoByData(data)
        })
      })
    }
    if (
      props.bpmSetting?.bizModeList.length == 0 &&
      props.wfBoList.length > 0
    ) {
      createBoByData(props.wfBoList[0])
    }
  }
  //根据传入data生成bo
  const createBoByData = (data: any) => {
    const boData = {
      value: data.code,
      label: data.rel.tableComment,
      type: 'main',
      valuePath: data.rel.tableCode,
      formCode: props?.bpmSetting?.defaultForm?.pcCode,
      children: [],
    }

    getTableColumnByRel(data.rel, boData)
    scriptVariables.value.push(boData)
    if (boList.value) {
      boList.value.push(data)
    }
  }

  /**
       * List aaa = bizData.children['class'].collect{ it.children.student.collect{ it.data.name } }.flatten()

        bizData.getChildren('class').collect{ $getChildColumnReplace$ }  it.children('student').collect{  it.get("name") }
       * 第一级  bizData，对应字段 .get('zd')
       * 第二级  bizData, .getChildren('class').collect{ it.get("name") },
       * 第三级,数据不合理，暂不支持   bizData.getChildren('class').collect{ it.children('student').collect{  it.get("name") } }
       */
  const getTableColumnByRel = (rel: any, boData: any) => {
    if (!rel.table && !rel.table.columnsWithoutPrimary.length) return
    boData.children = []
    rel.table.columns.forEach((column: any) => {
      boData.children.push({
        label: column.comment,
        code: column.code,
        cType: column.json,
        value:
          boData.type === 'main'
            ? `get('${column.code}')`
            : `collect{ it.get('${column.code}') }`,
        type: boData.type === 'main' ? column.type : 'List',
      })
    })

    // 第二层只处理字段，不处理它的子表，直接不加进去啦
    if (rel.children && rel.children.length > 0) {
      rel.children.forEach((tableRel: any) => {
        const child = {
          code: tableRel.tableCode,
          label: tableRel.tableComment,
          value: `getChildren('${tableRel.tableCode}')`,
          disabled: boData.type !== 'main',
          type: tableRel.type,
          children: [],
        }

        boData.children.push(child)
        getTableColumnByRel(tableRel, child)
      })
    }
  }

  watch(
    () => props.bpmSetting?.bizModeList,
    () => {
      if (props.bpmSetting?.bizModeList.length > 0) {
        initBo()
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    () => props.wfBoList,
    (newVal) => {
      if (newVal) {
        initBo()
      }
    },
    { deep: true, immediate: true }
  )
  watch(
    () => props.bpmSetting?.plugins?.bpmVariable,
    (amount, prevamount) => {
      pageData.variables.children.length = 0
      props.bpmSetting.plugins?.bpmVariable?.variables?.forEach((item: any) => {
        const variable = {
          value: `getVariable('${item.key}')`,
          label: item.desc,
          type: item.varType,
          key: item.key,
        }
        pageData.variables.children.push(variable)
      })
    },
    { deep: true, immediate: true }
  )
</script>
