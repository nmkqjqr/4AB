<template>
  <el-card shadow="hover" style="height: 100%; background: none">
    <el-tabs
      v-model="titleCode"
      class="demo-tabs"
      :stretch="componentConfig.control.stretch"
      style="height: 100%"
      :type="componentConfig.control.type"
    >
      <span v-for="(item, index) in tabData" :key="index">
        <el-tab-pane
          v-if="
            componentConfig.control.param.find((s) => s.code == item.code)
              .enable
          "
          :label="`${item.title}(${item.total})`"
          :name="item.code"
          style="height: calc(100%); overflow-y: auto"
        >
          <div v-if="item.list && item.list.length > 0">
            <div
              v-for="(childItem, childIndex) in item.list"
              :key="childItem.id"
            >
              <router-link :to="getRouterlink(item.code, childItem)">
                <div
                  class="step tatleDiv"
                  :style="
                    item.showTime
                      ? { width: '65%' }
                      : { width: '100%', 'max-width': '100%' }
                  "
                >
                  {{ childItem.title }}
                </div>
                <div v-if="item.showTime" class="step date">
                  {{
                    item.code == 'carbonCopy'
                      ? childItem.receiveTime
                      : childItem.createTime
                  }}
                </div>
              </router-link>
              <el-divider border-style="dashed" style="margin: 10px 0 20px 0" />
              <router-link
                v-if="childIndex === item.list.length - 1"
                :to="getMoreRouterlink(item.code)"
              >
                <div class="more">更多...</div>
              </router-link>
            </div>
          </div>
          <div v-else class="noneList">
            <el-empty description="暂无数据" :image-size="120" />
          </div>
        </el-tab-pane>
      </span>
    </el-tabs>
  </el-card>
</template>

<script lang="ts">
  export default {
    name: 'AbTodoTask',
  }
</script>

<script setup lang="ts">
  import { PropType } from 'vue'
  import { bpmApi } from '~/agilebpm'
  const props = defineProps({
    componentConfig: {
      type: Object as PropType<FormCombinationComponent>,
      required: true,
    },
  })
  const { componentConfig } = toRefs(props)
  const titleCode = ref(
    componentConfig.value.control.param.find((s) => s.default).code
  )
  const tabData: any = ref([
    {
      code: 'todoTask',
      title: '',
      list: [],
      total: 0,
      showTime: true,
    },
    {
      code: 'approve',
      title: '',
      list: [],
      total: 0,
      showTime: true,
    },
    {
      code: 'carbonCopy',
      title: '',
      list: [],
      total: 0,
      showTime: true,
    },
  ])

  const handleStr = (method: any, obj: any) => {
    method.then((result: any) => {
      obj.total = result.data.total
      obj.list = result.data.rows
    })
  }

  const getMoreRouterlink = (code: string) => {
    switch (code) {
      case 'approve':
        return { name: 'BpmMyApproveList' }
      case 'carbonCopy':
        return { name: 'BpmMyReceiveList' }
      default:
        return { name: 'BpmMyTaskTodoList' }
    }
  }

  const getRouterlink = (code: string, item: any) => {
    if (code == 'approve') {
      return {
        name: 'BpmInstanceDetail',
        query: { id: item.id, type: 'opId' },
      }
    }
    if (code == 'carbonCopy') {
      return {
        name: 'BpmInstanceDetail',
        query: { type: 'carbonId', id: item.id },
      }
    }
    return {
      name: 'BpmTaskComplate',
      query: {
        id: item.id,
        type: 'taskId',
        backR: 'BpmMyTaskTodoList',
      },
    }
  }

  const changeParam = () => {
    titleCode.value = componentConfig.value.control.param.find(
      (s) => s.default
    )?.code
    const arr = []
    for (
      let index = 0;
      index < componentConfig.value.control.param.length;
      index++
    ) {
      const element = componentConfig.value.control.param[index]
      const findObj = tabData.value.find((s) => s.code == element.code)
      findObj.title = element.title
      findObj.count = element.count
      findObj.showTime = element.showTime
      arr.push(findObj)
    }
    tabData.value = arr
  }

  const initFuntion = () => {
    console.log('initFuntion执行了')
    changeParam()
    //获取流程各类型的数量
    tabData.value.forEach((element: any) => {
      if (element.code == 'todoTask') {
        handleStr(
          bpmApi.myTask.bpmMyTaskTodoPage(
            componentConfig.value?.control?.condition,
            element.count
          ),
          element
        )
      }
      if (element.code == 'approve') {
        handleStr(
          bpmApi.myTask.bpmMyApprovePage(
            componentConfig.value?.control?.condition,
            element.count
          ),
          element
        )
      }
      if (element.code == 'carbonCopy') {
        handleStr(
          bpmApi.myTask.bpmMyCarbonCopyPage(
            componentConfig.value?.control?.condition,
            element.count
          ),
          element
        )
      }
    })
  }

  componentConfig.value.initFunction = changeParam
  componentConfig.value.relaod = initFuntion

  initFuntion()

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

  watch(
    () => componentConfig.value?.control?.condition,
    () => initFuntion()
  )

  watch(
    () => componentConfig.value?.control?.param,
    () => changeParam(),
    {
      deep: true,
    }
  )
</script>

<style scoped>
  .tatleDiv {
    height: 15px;
    text-overflow: ellipsis;
  }
  .step {
    display: inline-block;
    max-width: 80%;
    font-size: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .date {
    float: right;
    width: 160px;
    font-size: 15px;
    color: #c7c7c7;
  }
  .more {
    float: right;
    margin-right: 20px;
    font-size: 15px;
  }
  .noneList {
    margin: 20px 0;
    text-align: center;
  }

  .el-tabs__content {
  }
</style>
