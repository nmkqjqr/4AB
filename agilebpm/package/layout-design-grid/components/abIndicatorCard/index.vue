<template>
  <div class="container" @click="changeglobalParams">
    <el-row>
      <el-col :span="24">
        <el-statistic
          :value="
            info.showValue != null || info.showValue != undefined
              ? info.showValue
              : '-'
          "
          :value-style="{ color: props.componentConfig.control.fontColor }"
        >
          <template #title>
            <div
              :style="{
                color: componentConfig.control.titleColor,
              }"
            >
              {{
                control.titleType && control.titleType == '${dynamic}'
                  ? info.titleValue
                  : control.titleType
              }}
            </div>
          </template>
        </el-statistic>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'AbIndicatorCard',
  }
</script>

<script setup lang="ts">
  import _ from 'lodash'
  import { PropType } from 'vue'
  import { abUtil, bizApi } from '~/agilebpm'
  const props = defineProps({
    componentConfig: {
      type: Object as PropType<FormCombinationComponent>,
      required: true,
    },
  })
  const { componentConfig } = toRefs(props)

  const control: any = componentConfig.value.control

  const info: any = reactive({
    titleValue: '',
    showValue: '',
    oldGlobalParams: '',
    original: '',
    flag: true,
  })

  const globalParams = inject('globalParams') as any

  if (!control.w) {
    control.w = 1
  }
  if (!control.h) {
    control.h = 1
  }
  if (!control.fontColor) {
    control.fontColor = '#000000'
  }
  if (!control.color) {
    control.color = '#ffffff'
  }
  if (!control.titleColor) {
    control.titleColor = '#606266'
  }

  const conversion = (conditionConfig: any[]) => {
    const result: any[] = abUtil.clone(conditionConfig)
    for (const item in result) {
      if (result[item].value) {
        result[item].value = result[item].value.abArgFormat(globalParams)
      }
    }
    return result
  }

  const initFuntion = () => {
    const ct = props.componentConfig.control
    if (ct && ct.source) {
      if (ct.source == 'staticData') {
        if (/^{.*}$/.test(ct.xzhou)) {
          const key = ct.xzhou.substring(1, ct.xzhou.length - 1)
          if (ct.xzhou.substring(1, ct.xzhou.length - 1) in globalParams) {
            info.showValue = globalParams[key]
          } else {
            info.showValue = ''
          }
        } else {
          info.showValue = ct.xzhou
        }
      }
      if (['custGrid', 'custDialog'].includes(ct.source) && ct.relCode) {
        const clist = ct?.conditionList?.filter((s) => s.name)
        let newlist = []
        if ('custGrid' == ct.source && clist && clist.length > 0) {
          newlist = abUtil.clone(clist)
          newlist.forEach((s) => {
            if (/^{.*}$/.test(s.val)) {
              const key = s.val.substring(1, s.val.length - 1)
              if (key in globalParams) {
                s.val = globalParams[key]
              } else {
                s.val = undefined
              }
            }
          })
        }
        bizApi.custChart
          .custGridDataByCode(ct.relCode, ct.source, newlist, null)
          .then((rel) => {
            if (rel.data.custData && rel.data.custData.length > 0) {
              info.showValue = rel.data.custData[0][ct.xzhou]
              info.original =
                rel.data.custData[0][`${ct.xzhou}$rel`] || info.showValue
            } else {
              info.showValue = undefined
              info.original = undefined
            }
            info.titleValue = rel.data.fieldList?.find(
              (s: any) => s.key == ct.xzhou
            ).name
          })
      }

      if (
        'formDesignSelector' == ct.source &&
        ct.relCode &&
        ct.formKey &&
        ct.xzhou
      ) {
        bizApi.custChart
          .custFormDataByCode({
            designCode: ct.relCode,
            tableCode: ct.formKey,
            indicatorList: [
              {
                summaryType: ct.summaryType,
                columnCode: ct.xzhou,
              },
            ],
            conditionList: conversion(ct.conditionConfig),
          })
          .then((rel) => {
            if (rel.data.custData && rel.data.custData.length > 0) {
              const showField = ct.summaryType
                ? `${ct.summaryType}_${ct.xzhou}`
                : ct.xzhou
              info.showValue = rel.data.custData[0][showField]
              info.original =
                rel.data.custData[0][`${showField}$rel`] || info.showValue
            } else {
              info.showValue = undefined
              info.original = undefined
            }

            rel.data?.fieldList.forEach((s: any) => {
              s?.fieldList.forEach((i: any) => {
                if (
                  i.key ==
                  ct.xzhou.substring(
                    ct.xzhou.lastIndexOf('.') + 1,
                    ct.xzhou.length
                  )
                ) {
                  info.titleValue = i?.name
                }
              })
            })
          })
      }
    }
  }

  const changeglobalParams = () => {
    const ct = props.componentConfig.control

    const newLinkage = ct.linkage?.filter((s: any) => s.linkageParam)

    if (newLinkage && newLinkage.length > 0) {
      if (info.flag) {
        info.oldGlobalParams = abUtil.clone(globalParams)

        newLinkage.forEach((s: any) => {
          if (s.linkageData == 'indicatorKey') {
            globalParams[s.linkageParam] = info.original
          } else if (s.linkageData == 'titleValue') {
            globalParams[s.linkageParam] =
              control.titleType && control.titleType == '${dynamic}'
                ? info.titleValue
                : control.titleType
          } else {
            globalParams[s.linkageParam] = s.linkageData
          }
        })
      } else {
        newLinkage.forEach((s: any) => {
          globalParams[s.linkageParam] = info.oldGlobalParams[s.linkageParam]
        })
      }
      info.flag = !info.flag
    }
  }
  initFuntion()
  componentConfig.value.initFunction = () => initFuntion()
  componentConfig.value.relaod = () => initFuntion()

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

  //旧的全局过滤值
  let oldConfig: any[] = componentConfig.value.control?.conditionConfig?.map(
    (s) => {
      return {
        key: s.key,
        value: s.value?.abArgFormat(globalParams),
      }
    }
  )

  //旧的过滤值
  let oldCondition: any[] = componentConfig.value.control?.conditionList
    ?.filter((s) => s.name && /^{.*}$/.test(s.val))
    ?.map((s) => {
      return {
        key: s.name,
        value: s.val?.abArgFormat(globalParams),
      }
    })

  watch(
    () => globalParams,
    (newVal) => {
      const ct = componentConfig.value.control
      const newConfig = ct?.conditionConfig?.map((s) => {
        return {
          key: s.key,
          value: s.value.abArgFormat(newVal),
        }
      })

      //旧的过滤值
      const newCondition: any[] = ct?.conditionList
        ?.filter((s) => s.name && /^{.*}$/.test(s.val))
        ?.map((s) => {
          return {
            key: s.name,
            value: s.val.abArgFormat(globalParams),
          }
        })

      if (
        ct.xzhou.substring(1, ct.xzhou.length - 1) in globalParams ||
        !_.isEqual(newConfig, oldConfig) ||
        !_.isEqual(newCondition, oldCondition)
      ) {
        oldCondition = newCondition
        oldConfig = newConfig
        initFuntion()
      }
    },
    { deep: true }
  )

  watch(
    () => componentConfig.value.control.conditionConfig,
    (newVal) => {
      initFuntion()
    },
    { deep: true }
  )
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 10px;
    margin-right: auto;
    margin-left: auto;
    text-align: center;
    border-radius: 15px;
  }

  .el-statistic {
    --el-statistic-content-font-size: 28px;
  }
</style>
