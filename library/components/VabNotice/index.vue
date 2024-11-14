<template>
  <el-badge
    v-if="theme.showNotice"
    :hidden="!(info.noticeCount + info.todoCount)"
    type="danger"
    :value="info.noticeCount + info.todoCount"
  >
    <el-popover
      placement="bottom"
      trigger="click"
      :width="300"
      @before-enter="init()"
    >
      <template #reference>
        <vab-icon icon="notification-line" />
      </template>
      <el-tabs v-model="info.activeName" stretch>
        <el-tab-pane :label="getNoticeTitle()" :name="0">
          <div class="notice-list">
            <el-scrollbar>
              <ul>
                <li
                  v-for="(item, index) in info.notices"
                  :key="index"
                  class="myclass"
                  style="overflow: hidden"
                  @click="assignment(item, 0)"
                >
                  <div
                    style="float: left; margin-right: 15px; margin-left: 10px"
                  >
                    <ab-icon :icon="item.type" size="35px" />
                  </div>
                  <div style="float: left">
                    <div class="oneText">
                      {{ item.title }}
                    </div>
                    <div class="dateText oneText">
                      {{ item.createTime }}
                    </div>
                  </div>

                  <!-- <span v-html="item.title" /> -->
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="getTodoTitle()" :name="1">
          <div class="notice-list">
            <el-scrollbar>
              <ul>
                <li
                  v-for="(item, index) in info.todos"
                  :key="index"
                  class="myclass"
                  style="overflow: hidden"
                  @click="assignment(item, 1)"
                >
                  <div
                    style="float: left; margin-right: 15px; margin-left: 10px"
                  >
                    <ab-icon :icon="item.type" size="35px" />
                  </div>
                  <div style="float: left">
                    <div class="oneText">
                      {{ item.title }}
                    </div>
                    <div class="dateText oneText">
                      {{ item.createTime }}
                    </div>
                  </div>

                  <!-- <span v-html="item.title" /> -->
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div v-if="isShow()" class="notice-clear">
        <el-button
          :icon="ArrowDownBold"
          :loading="info.getMoreLoading"
          type="text"
          @click="getMoreFn()"
        >
          {{ $abT('page.common.loadMore', '加载更多') }}
        </el-button>
      </div>
      <div class="notice-clear">
        <el-button
          :icon="CircleCheckFilled"
          :loading="info.allReadLoading"
          type="text"
          @click="allRead()"
        >
          {{ $abT('page.home.read', '一键已读') }}
        </el-button>
      </div>
    </el-popover>
  </el-badge>

  <el-dialog v-model="info.dialogVisible" :title="info.selectTitle" width="30%">
    <div class="detailsBox" v-html="info.selectContent"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="info.dialogVisible = false">
          {{ $abT('page.common.ok', '确定') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { useSettingsStore } from '@/store/modules/settings'
  //将来国际化
  import { abT } from '@/i18n'
  import { ArrowDownBold, CircleCheckFilled } from '@element-plus/icons-vue'
  import { cmsApi } from '~/agilebpm'

  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)

  const info = reactive({
    //tag页选中公告还是待办的标识
    activeName: 0,
    //公告/待办数据列表
    notices: [] as any[],
    todos: [] as any[],
    //公告和待办的页码参数，以及公告/待办数据每次请求的条数
    noticeCurrent: 1,
    todoCurrent: 1,
    pageSize: 8,
    //数量参数 公告数量  待办数量  总数
    noticeCount: 0,
    todoCount: 0,
    // allCount: 0,
    dialogVisible: false,
    visible: true,
    selectContent: '',
    selectTitle: '',

    getMoreLoading: false,
    allReadLoading: false,
  })

  const init = () => {
    // info.noticeCurrent = 1
    // info.todoCurrent = 1
    cmsApi.innerMsg
      .cmsInnerAllDetails(0, 1, info.noticeCurrent * info.pageSize)
      .then((rel) => {
        info.notices = rel.data.rows
        info.noticeCount = rel.data.total
      })

    cmsApi.innerMsg
      .cmsInnerAllDetails(1, 1, info.todoCurrent * info.pageSize)
      .then((rel) => {
        info.todos = rel.data.rows
        info.todoCount = rel.data.total
      })
  }

  init()

  const isShow = () => {
    if (info.activeName) {
      return info.todoCount > info.todos.length
    } else {
      return info.noticeCount > info.notices.length
    }
  }

  const getMoreFn = () => {
    info.getMoreLoading = true
    if (info.activeName) {
      info.todoCurrent += 1
      cmsApi.innerMsg
        .cmsInnerAllDetails(1, info.todoCurrent, info.pageSize)
        .then((rel) => {
          info.todos = info.todos.concat(rel.data.rows)
          info.todoCount = rel.data.total
          info.getMoreLoading = false
        })
    } else {
      info.noticeCurrent += 1
      cmsApi.innerMsg
        .cmsInnerAllDetails(0, info.noticeCurrent, info.pageSize)
        .then((rel) => {
          info.notices = info.notices.concat(rel.data.rows)
          info.noticeCount = rel.data.total
          info.getMoreLoading = false
        })
    }
  }

  const allRead = () => {
    const arr = info.activeName ? info.todos : info.notices
    if (!arr || arr.length == 0) {
      ElMessage.success(abT('page.common.operateSuccess', '操作成功'))
    } else {
      info.allReadLoading = true
      const ids = arr.map((s) => s.id)
      cmsApi.innerMsg.cmsupdateReadByIdsFn(ids).then((rel) => {
        info.noticeCurrent = 1
        info.todoCurrent = 1
        init()
        info.allReadLoading = false
        ElMessage.success(abT('page.common.operateSuccess', '操作成功'))
      })
    }
  }

  const assignment = (row: any, type: number) => {
    //1 打开这条弹窗，并填充信息  2将这条数据置为已读  3重新请求接口获取最新数据
    if (info.dialogVisible) {
      return
    }
    info.selectContent = row.content
    info.selectTitle = row.title
    info.dialogVisible = true

    cmsApi.innerMsg.cmsupdateReadFn(row.id).then((rel) => {
      if (type) {
        info.todoCount = info.todoCount - 1
        info.todos = info.todos.filter((obj) => obj.id !== row.id)
      } else {
        info.noticeCount = info.noticeCount - 1
        info.notices = info.notices.filter((obj) => obj.id !== row.id)
      }
    })
  }

  const getNoticeTitle = () => {
    let strTitle = abT('page.layout.notice','通知')
    if (info.noticeCount) {
      if (info.noticeCount > 999) {
        strTitle += `(999+)`
      } else {
        strTitle += `(${info.noticeCount})`
      }
    }
    return strTitle
  }

  const getTodoTitle = () => {
    let strTitle = abT('page.home.todo', '待办')
    if (info.todoCount) {
      if (info.todoCount > 999) {
        strTitle += `(999+)`
      } else {
        strTitle += `(${info.todoCount})`
      }
    }
    return strTitle
  }

  // const handleClearNotice = () => {
  //   allCount.value = undefined
  //   notices.value = []
  //   $baseMessage('清空消息成功', 'success', 'vab-hey-message-success')
  // }
</script>

<style lang="scss" scoped>
  .dateText {
    height: 5px;
    font-size: x-small;
    color: #afafaf;
  }
  .oneText {
    max-width: 200px;
    height: 22px;
    overflow: hidden; /* 隐藏超出div的内容 */

    // line-height: 20px;
    // text-align: center;
    text-overflow: ellipsis; /* 使用省略号代替超出的文本 */
    white-space: nowrap; /* 阻止文本换行 */
  }
  .myclass:hover {
    background-color: #e8f4ff;
  }

  :deep() {
    .el-tabs__active-bar {
      min-width: 27px;
    }
  }

  .notice-list {
    height: 29vh;

    ul {
      padding: 0 0 0 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        padding: 5px 0 5px 0;
      }
    }
  }

  .notice-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 0 0 0;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    border-top: 1px solid #e8eaec;

    i {
      margin-right: 3px;
    }
  }

  .notice-clear2 {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 0 0 0;
    font-size: 14px;
    text-align: center;
    cursor: pointer;

    i {
      margin-right: 3px;
    }
  }
</style>
