<template>
  <el-container>
    <el-main class="nopadding">
      <Calendara ref="calendararef" />
    </el-main>
    <el-aside style="width: 360px; border-left: 1px solid #e6e6e6">
      <el-container>
        <el-header>
          <h2 class="dayTitle">
            <!-- <el-icon><el-icon-calendar /></el-icon> -->
            {{ day }}
            <el-button
              style="margin-left: 12px"
              type="primary"
              @click="addsche"
            >
              添加
            </el-button>
          </h2>
        </el-header>
        <el-main>
          <div class="task-list">
            <template v-if="dayItem">
              <el-card
                v-for="task in dayItem"
                :key="task.id"
                :class="state.stateMap[task.state]"
                shadow="hover"
              >
                <el-button
                  :disabled="task.type !== 'single'"
                  type="text"
                  @click="completeche(task)"
                >
                  完 成
                </el-button>
                <el-button type="text" @click="editche(task)">编 辑</el-button>
                <el-button type="text" @click="removeche(task)">
                  删 除
                </el-button>
                <h2>{{ task.title }}</h2>
                <el-descriptions class="margin-top" :column="1" size="mini">
                  <el-descriptions-item label="任务类型">
                    {{
                      task.type === 'single'
                        ? '个人'
                        : task.type === 'share'
                        ? '共享'
                        : task.type === 'ilka'
                        ? '共同任务'
                        : ''
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item label="日程进度">
                    {{ task.rateProgress }}%
                    <el-tag v-if="task.rateProgress === 100" type="success">
                      完成
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="提交人">
                    {{ task.submitterName }}
                  </el-descriptions-item>
                  <el-descriptions-item label="所属人">
                    {{ task.ownerName }}
                  </el-descriptions-item>
                  <el-descriptions-item label="预计开始">
                    {{ task.startTime }}
                  </el-descriptions-item>
                  <el-descriptions-item label="预计完成">
                    {{ task.endTime }}
                  </el-descriptions-item>
                  <el-descriptions-item label="备注">
                    {{ task.remark }}
                  </el-descriptions-item>
                </el-descriptions>
                <div class="task-bottom">
                  <div class="tags">
                    <!-- <el-tag size="small" type="info">id:{{ task.id }}</el-tag> -->
                    <el-tag
                      v-if="task.state == 'open'"
                      size="small"
                      type="info"
                    >
                      {{ task.state }}
                    </el-tag>
                    <el-tag
                      v-if="task.state == 'complete'"
                      size="small"
                      type="success"
                    >
                      {{ task.state }}
                    </el-tag>
                    <el-tag
                      v-if="task.state == 'timeout'"
                      size="small"
                      type="danger"
                    >
                      {{ task.state }}
                    </el-tag>
                  </div>
                </div>
              </el-card>
            </template>
            <template v-else>
              <el-empty description="无工作任务" :image-size="100" />
            </template>
          </div>
        </el-main>
      </el-container>
    </el-aside>
    <EditDialog ref="dialogref" @reloadcalendar="reloadcalendar" />
  </el-container>
</template>

<script setup>
  import { computed, reactive, ref } from 'vue'
  import { abFormat } from '~/agilebpm'
  import Calendara from './components/calendara.vue'
  import EditDialog from './components/editDIa.vue'
  const calendararef = ref('calendararef')
  const dialogref = ref('dialogref')
  const state = reactive({
    stateMap: {
      open: 'open',
      complete: 'complete',
      timeout: 'timeout',
    },
  })
  // 获取点击得时间
  const day = computed(() => {
    return abFormat.ab_dateFormat(calendararef.value.toDay, 'yyyy-MM-dd')
  })
  // 获取时间对应右侧列表
  const dayItem = computed(() => {
    return calendararef.value.getData(day.value)
  })
  // 点击添加按钮
  const addsche = () => {
    dialogref.value.open(calendararef.value.toDay)
  }
  // 刷新左侧日历列表
  const reloadcalendar = () => {
    calendararef.value.clickmonthFn()
  }
  // 点击编辑
  const editche = (params) => {
    dialogref.value.editche(params)
  }
  // 点击删除
  const removeche = (params) => {
    dialogref.value.removeche(params)
  }
  // 点击完成
  const completeche = (params) => {
    dialogref.value.completeche(params)
  }
</script>

<style scoped>
  .task-list .el-card {
    margin-bottom: 10px;
    cursor: pointer;
  }

  .task-list .el-card.open {
    border-color: #ddd;
  }
  .task-list .el-card.complete {
    border-color: #67c23a;
  }
  .task-list .el-card.timeout {
    border-color: #f56c6c;
  }

  .task-list h2 {
    margin: 0;
    margin-bottom: 6px;
    font-size: 15px;
    font-weight: 600;
  }
  .task-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
  }
  .task-bottom .tags .el-tag {
    margin-right: 5px;
  }
  .dayTitle {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .dayTitle i {
    margin-right: 10px;
    color: #999;
  }
  :deep(
      .el-descriptions__body
        .el-descriptions__table:not(.is-bordered)
        .el-descriptions__cell
    ) {
    padding-bottom: 0;
  }
  :deep(.el-card__body) {
    padding: 10px 18px !important;
  }
  :deep(.el-calendar-table .el-calendar-day) {
    padding: 4px;
  }
  .onedaybox {
    height: 62px;
    overflow: auto;
  }
</style>
