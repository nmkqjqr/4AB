<template>
  <div>
    <div>
      <viewPage
        v-if="props.componentConfig.control.name"
        :key="new Date().getTime()"
        ref="viewPageFn"
        :code="props.componentConfig.control.code"
        :component-list="getFlatComponentList()"
        :is-reload-com="
          props.componentConfig.control.reloadCom &&
          props.componentConfig.control.reloadCom.length > 0
            ? props.componentConfig.control.reloadCom
            : []
        "
        :layout-design="true"
        @click-table="clickTable"
        @current-change="currentChange"
        @handle-selection-change="handleSelectionChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
  export default {
    name: 'AbCustomListLayout',
  }
</script>
<script setup lang="ts">
  import { reactive, ref, PropType } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Check } from '@element-plus/icons-vue'
  import { bizApi } from '@agilebpm/api'
  import { viewPage, abTools } from '~/agilebpm'

  const globalParams = inject('globalParams') as any

  const props = defineProps({
    componentConfig: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
  })
  const viewPageFn = ref(null)
  const info = reactive({
    comBinCondition: [],
    isClickTable: false,
  })

  const getFlatComponentList = inject('getFlatComponentList') as any
  const { componentConfig } = toRefs(props)
  const initFuntion = () => {
    viewPageFn.value?.listFn()
  }
  componentConfig.value.relaod = initFuntion

  let intervalID: any

  // 在组件销毁前停止定时器
  onBeforeUnmount(() => {
    clearInterval(intervalID)
  })

  watch(
    () => [
      componentConfig.value?.control?.timedRefresh,
      componentConfig.value?.control?.refreshCycle,
    ],
    () => {
      const ct = componentConfig.value?.control
      clearInterval(intervalID)
      if (ct.timedRefresh) {
        intervalID = setInterval(
          function () {
            initFuntion()
          },
          ct.refreshCycle > 1 ? ct.refreshCycle * 1000 : 1000
        )
      }
    },
    {
      immediate: true,
    }
  )

  const { proxy } = abTools.useCurrentInstance()

  if (proxy.$route.name == 'BizFormCombinationView') {
    props.componentConfig.control.comBinCondition = []
    if (
      props.componentConfig.control.condition &&
      props.componentConfig.control.condition.length > 0
    ) {
      props.componentConfig.control.condition.forEach((item: any) => {
        const itema = {}
        for (const key in globalParams) {
          if (key == item.nameParam) {
            itema.conditionName = item.conditionName
            itema.conditionValue = item.fieldName
            itema.value = ''
            if(globalParams[key] && globalParams[key].length > 0){
              itema.value = globalParams[key]
            }
          }
        }
        props.componentConfig.control.comBinCondition.push(itema)
      })
    }
  }

  // 保存方法
  const abFormRef = ref()
  const save = () => {
    abFormRef.value.getData(true).then((formJson: any) => {
      if (formJson !== false) {
        bizApi.bizForm
          .saveFormData(
            props.componentConfig.control.formKey,
            pageData.formData.data
          )
          .then(({ data }) => {
            globalParams[props.componentConfig.control.idKey] = data
            ElMessage({
              type: 'success',
              message: '保存成功',
            })
          })
      }
    })
  }

  const currentChange = (row: any) => {
    const changeData = row
    for (const key in changeData) {
      for (const keyA in globalParams) {
        if (key == keyA) {
          globalParams[keyA] = changeData[key]
        }
      }
    }
  }

  const clickTable = (row: any) => {
    if(props.componentConfig.control.chooseType == 0){
      const assignment = props.componentConfig.control.assignment
      if (assignment && assignment.length > 0) {
        info.isClickTable = true
        assignment.forEach((item: any, index: any) => {
          for (const key in globalParams) {
            if (item.nameParam == key) {
              globalParams[key] =
                row[`${item.fieldName}$rel` || `${item.fieldName}_$rel`]
            }
          }
        })
      }
    }
  }

  const handleSelectionChange = (list:any) => {
    if(props.componentConfig.control.chooseType == 2){
      const assignment = props.componentConfig.control.assignment
      if (assignment && assignment.length > 0) {
        info.isClickTable = true
        assignment.forEach((item: any, index: any) => {
          for (const key in globalParams) {
            if (item.nameParam == key) {
              globalParams[key] = ''
              list.forEach((it:any) => {
                globalParams[key] += it[`${item.fieldName}$rel` || `${item.fieldName}_$rel`] + ','
              })
              globalParams[key] =  globalParams[key].slice(0, globalParams[key].length - 1)
            }
          }
        })
      }
    }
  }

  watch(
    () => globalParams,
    (newVal) => {
      if (newVal) {
        if (info.isClickTable) {
          info.isClickTable = false
          return
        }
        if (
          props.componentConfig.control.condition &&
          props.componentConfig.control.condition.length > 0
        ) {
          props.componentConfig.control.comBinCondition = []
          props.componentConfig.control.condition.forEach((item: any) => {
            const itema = {}
            for (const key in globalParams) {
              if (key == item.nameParam) {
                itema.conditionName = item.conditionName
                itema.conditionValue = item.fieldName
                itema.value = ''
                if(globalParams[key] && globalParams[key].length > 0){
                  itema.value = globalParams[key]
                }
              }
            }
            props.componentConfig.control.comBinCondition.push(itema)
          })
         
          viewPageFn.value?.listFn()
          // if(props.componentConfig.control.comBinCondition.length > 0){
          //   props.componentConfig.control.comBinCondition.forEach((item:any) => {
          //     if(item.value && item.value.length > 0){
          //       isNeedQuery = true
          //     }
          //   })
          //   if(isNeedQuery){
          //      viewPageFn.value?.listFn()
          //   }
          // }
        }
       
      }
    },
    { deep: true, immediate: true }
  )
</script>

<style lang="scss" scoped>
  .item-card {
    display: inline-block;
    margin: 16px;
    text-align: center;
    cursor: pointer;
  }
</style>
