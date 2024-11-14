<template>
  <el-card shadow="hover" style="height: 500px">
    <div>
      <el-tabs v-model="info.activeName" class="demo-tabs">
        <el-tab-pane
          :label="
            $abT('menu.BpmMyTaskTodoList', '待办事项') +
            '(' +
            info.todo.count +
            ')'
          "
          name="todo"
        >
          <div v-if="info.todo.list && info.todo.list.length > 0">
            <div
              v-for="(item, index) in info.todo.list"
              :key="item.id"
              class="divStyle"
            >
              <router-link
                :to="{
                  name: 'BpmTaskComplate',
                  query: {
                    id: item.id,
                    type: 'taskId',
                    backR: 'BpmMyTaskTodoList',
                  },
                }"
              >
                <div class="step tatleDiv">{{ item.title }}</div>
                <div class="step date">{{ item.createTime }}</div>
              </router-link>
              <el-divider border-style="dashed" style="margin: 10px 0 20px 0" />
              <router-link :to="{ name: 'BpmMyTaskTodoList' }">
                <div v-if="index === info.todo.list.length - 1" class="more">
                  {{ $abT('page.common.more', '更多') }}...
                </div>
              </router-link>
            </div>
          </div>
          <div v-else class="noneList">
            <el-empty
              :description="$abT('page.common.notflowData', '暂无数据')"
              :image-size="120"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="
            $abT('menu.BpmMyApproveList', '办理历史') +
            '(' +
            info.approve.count +
            ')'
          "
          name="approve"
        >
          <div v-if="info.approve.list && info.approve.list.length > 0">
            <div
              v-for="(item, index) in info.approve.list"
              :key="item.id"
              class="divStyle"
            >
              <router-link
                :to="{
                  name: 'BpmInstanceDetail',
                  query: { id: item.id, type: 'opId' },
                }"
              >
                <div class="step tatleDiv">{{ item.title }}</div>
                <div class="step date">{{ item.createTime }}</div>
              </router-link>
              <el-divider border-style="dashed" style="margin: 10px 0 20px 0" />
              <router-link :to="{ name: 'BpmMyApproveList' }">
                <div v-if="index === info.approve.list.length - 1" class="more">
                  {{ $abT('page.common.more', '更多') }}...
                </div>
              </router-link>
            </div>
          </div>
          <div v-else class="noneList">
            <el-empty
              :description="$abT('page.common.notflowData', '暂无数据')"
              :image-size="120"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="
            $abT('page.home.myCC', '我的抄送') +
            '(' +
            info.carbonCopy.count +
            ')'
          "
          name="third"
        >
          <div v-if="info.carbonCopy.list && info.carbonCopy.list.length > 0">
            <div
              v-for="(item, index) in info.carbonCopy.list"
              :key="item.id"
              class="divStyle"
            >
              <router-link
                :to="{
                  name: 'BpmInstanceDetail',
                  query: { type: 'carbonId', id: item.id },
                }"
              >
                <div class="step tatleDiv">{{ item.title }}</div>
                <div class="step date">{{ item.receiveTime }}</div>
              </router-link>
              <el-divider border-style="dashed" style="margin: 10px 0 20px 0" />
              <router-link :to="{ name: 'BpmMyReceiveList' }">
                <div
                  v-if="index === info.carbonCopy.list.length - 1"
                  class="more"
                >
                  {{ $abT('page.common.more', '更多') }}...
                </div>
              </router-link>
            </div>
          </div>
          <div v-else class="noneList">
            <el-empty
              :description="$abT('page.common.notflowData', '暂无数据')"
              :image-size="120"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
  import { abT } from '@/i18n'
  import { bpmApi } from '~/agilebpm'
  // // 指定组件命名
  // defineOptions({
  //   name: 'AbWfData',
  // })

  const ssssref: any = ref('!@3312')

  const info: any = reactive({
    activeName: 'todo',
    todo: {
      count: 0,
      list: [],
    },
    approve: {
      title: abT('menu.BpmMyApproveList', '办理历史'),
      count: 0,
      list: [],
    },
    carbonCopy: {
      title: abT('page.home.myCC', '我的抄送'),
      count: 0,
      list: [],
    },
  })

  const handleStr = (method: any, obj: { count: number; list: [] }) => {
    method.then((result: any) => {
      obj.count = result.data.total
      obj.list = result.data.rows
    })
  }

  handleStr(bpmApi.myTask.bpmMyTaskTodoPage(null, 8), info.todo)
  handleStr(bpmApi.myTask.bpmMyApprovePage(null, 8), info.approve)
  handleStr(bpmApi.myTask.bpmMyCarbonCopyPage(null, 8), info.carbonCopy)
</script>

<style scoped>
  .tatleDiv {
    width: 65%;
    height: 15px;
    overflow: hidden;
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
</style>
