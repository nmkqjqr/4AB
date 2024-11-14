<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogCancel"
    draggable
    :model-value="props.isShow"
    :title="props.title"
    width="600px"
  >
    <el-table
      v-if="info.tableIf"
      ref="tableRef"
      border
      :data="tableData"
      row-key="sn"
    >
      <el-table-column :label="$abT('page.common.name', '名称')">
        <template #default="scope">
          {{ scope.row.approverName || scope.row.assign }}
        </template>
      </el-table-column>
      <el-table-column :label="$abT('page.common.status', '状态')" width="200">
        <template #default="scope">
          <el-tag :type="scope.row.statusLabelCss">
            {{ scope.row.statusValue }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100">
        <template #header>
          <ab-cust-dialog
            v-if="info.privileger.addRights"
            circle
            dialog-key="userSelector"
            :icon="Plus"
            type="primary"
            @ok="add"
          />
        </template>
        <template #default="scope">
          <!--串行-->
          <span v-if="info.pluginSign.sign.approvalType == 'serial'">
            <span v-if="['pre', 'add'].includes(scope.row.flag)">
              <el-button
                v-if="tableData.length > 2"
                circle
                class="move-btn"
                :icon="Sort"
              />
              <el-button
                v-if="info.privileger.reduceRights"
                circle
                :icon="Delete"
                type="danger"
                @click="del(scope.row)"
              />
            </span>
            <el-tag v-else effect="dark" type="warning">
              {{ $abT('bpm.office.runTask', '运行任务') }}
            </el-tag>
          </span>

          <!--并行-->
          <span
            v-if="
              ['parallel', 'vote'].includes(info.pluginSign.sign.approvalType)
            "
          >
            <el-button
              v-if="
                info.privileger.reduceRights &&
                !scope.row.approveTime &&
                info.actionData.taskId != scope.row.taskId
              "
              circle
              :icon="Delete"
              type="danger"
              @click="del(scope.row)"
            />
            <el-tag
              v-if="info.actionData.taskId == scope.row.taskId"
              effect="dark"
              type="warning"
            >
              {{ $abT('bpm.office.currentTask', '当前任务') }}
            </el-tag>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button text type="default" @click="dialogCancel">
        {{ $abT('page.common.cancel', '取消') }}
      </el-button>
      <el-button :loading="info.loading" type="primary" @click="dialogOk">
        {{ $abT('page.common.ok', '确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { bpmApi, abStoreAdaptor } from '@agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  import { ElMessage, FormInstance } from 'element-plus'
  import { Plus, Delete, Sort } from '@element-plus/icons-vue'
  import { abT } from '@/i18n'
  import Sortable from 'sortablejs'

  const formRef = ref<FormInstance>()

  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    isShow: { required: true, type: Boolean },
    title: {
      required: false,
      type: String,
      default: abT('bpm.office.commentsRemarks', '意见/备注'),
    },
  })
  // callback 为 对话框处理完数据后返回事件
  const emit = defineEmits(['dialogCancel', 'callback'])

  const info: any = reactive({
    actionData: {} as PropType<ActionData>,
    data: [],
    abUser: {},
    pluginSign: {},
    privileger: {},
    sortable: null,
    tableIf: true,
    loading: false,
  })

  //初始化逻辑
  onMounted(() => {})

  //监听isShow来实现每次点击触发的逻辑
  watch(
    () => props.isShow,
    () => {
      if (!props.isShow) return
      //复制bpmData数据达到数据隔离
      info.actionData = abUtil.clone(props.bpmData).actionData
      info.abUser = abStoreAdaptor().getAbUser

      bpmApi.bpmPluginSign
        .getManageInfo(props.bpmData.bpmTask?.id)
        .then((resp: any) => {
          info.pluginSign = resp.data.pluginSign
          info.data = resp.data.opinions

          //初始化sn 后续拖拽可能用到
          let sn = 0
          info.data.forEach((op: any) => {
            op.sn = sn++
          })

          //串行时是逐个生成任务的，所以需要把后续的预算出来
          if (info.pluginSign.sign.approvalType == 'serial') {
            const typeMap: any = {
              user: abT('page.common.user', '用户'),
              org: abT('page.common.group', '组织'),
              role: abT('page.common.role', '角色'),
              post: abT('page.common.post', '岗位'),
            }
            for (
              let i = info.pluginSign.progress + 1;
              i < info.pluginSign.identities.length;
              i++
            ) {
              const item: any = info.pluginSign.identities[i]
              info.data.push({
                type: item.type, //目前先支持用户
                assign: `(${typeMap[item.type]})${item.name}`,
                name: item.name,
                key: item.id,
                statusLabelCss: 'warning',
                statusValue: abT('bpm.office.budget', '预算'),
                sn: abUtil.Arrays.getNextSn(info.data),
                flag: 'pre',
              })
            }
            initSortable()
          }
          //找到当前特权信息
          info.privileger = info.pluginSign.sign.privilegers.find(
            (p: any) => p.key == info.abUser.userId
          )
        })
    },
    { immediate: true }
  )

  //列表数据定义
  const tableData = computed(() => {
    return info.data.filter((item: any) => {
      return item.flag != 'del'
    })
  })

  // 关闭对话框
  const dialogCancel = () => {
    emit('dialogCancel', false)
    info.loading = false
  }

  const dialogOk = () => {
    if (!info.data.find((item: any) => !!item.flag)) {
      ElMessage.warning(abT('bpm.office.noModifiedContent', '无修改内容'))
      return
    }
    info.loading = true
    info.actionData.extendConf.signData = info.data
    dialogCancel()
    emit('callback', info.actionData)
  }

  const add = (users: any) => {
    users.forEach((user: any) => {
      let b = false
      info.data.forEach((u: any) => {
        if (u.flag != 'add') return //重复校验只当次新增的
        if (u.key == user.id) {
          b = true
        }
      })
      if (b) return

      info.data.push({
        flag: 'add',
        type: 'user', //目前先支持用户
        assign: `(${abT('page.common.user', '用户')})${user.name}`,
        name: user.name,
        key: user.id,
        statusLabelCss: 'danger',
        statusValue: abT('page.common.add', '添加'),
        sn: abUtil.Arrays.getNextSn(info.data),
      })
    })

    if (info.pluginSign.sign.approvalType == 'serial') {
      initSortable()
    }
  }

  const del = (row: any) => {
    if (row.flag == 'add') {
      //当次新增的才删除
      abUtil.Arrays.remove(row, info.data)
    } else {
      //审批中的先标记删除，然后需要在后端处理
      row.flag = 'del'
    }
  }

  const tableRef = ref()
  const initSortable = () => {
    if (info.sortable) {
      info.sortable.destroy() //消除排序
    }

    //延迟是为了等待页面渲染完新的table
    setTimeout(() => {
      const table = tableRef.value.$el.querySelector('tbody')
      info.sortable = Sortable.create(table, {
        animation: 300,
        handle: '.move-btn',
        onMove: (evt: any, originalEvent: any) => {
          //找到没有拖拽按钮的不让修改排序
          const td = evt.related.querySelectorAll('td')[2]
          if (td && !td.querySelector('.move-btn')) {
            return false
          }
          return true
        },
        onEnd: (evt: any) => {
          const t = info.data.splice(evt.oldIndex, 1)[0]
          info.data.splice(evt.newIndex, 0, t)
        },
      })
    })
  }
</script>
