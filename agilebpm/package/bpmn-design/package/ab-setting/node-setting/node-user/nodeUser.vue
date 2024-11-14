<template>
  <el-button
    circle
    :icon="Edit"
    style="margin-right: 8px"
    type="primary"
    @click="open"
  />

  <el-tooltip
    class="box-item"
    :content="getDesc()"
    effect="dark"
    placement="top-start"
    :raw-content="true"
  >
    {{ getDesc().substring(0, 200) }}{{ getDesc().length > 200 ? '...' : '' }}
  </el-tooltip>

  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    destroy-on-close
    draggable
    :title="`节点人员`"
    width="66%"
  >
    <el-table
      id="table"
      ref="table"
      border
      :data="info.data"
      empty-text="请添加节点人员"
      row-key="sn"
    >
      <el-table-column label="类型" width="200">
        <template #default="scope">
          <el-select v-model="scope.row.type">
            <el-option
              v-for="item in info.resolvers"
              :key="item.type"
              :label="item.title"
              :value="item.type"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="配置" min-width="300">
        <template #default="scope">
          <!--用户-->
          <el-row v-if="scope.row.type == 'user'">
            <ab-cust-dialog
              dialog-key="userSelector"
              :extra-data="scope.row"
              :icon="Search"
              @ok="setUser"
            >
              选择用户
            </ab-cust-dialog>
            <el-tag
              v-if="scope.row.source == 'start'"
              effect="dark"
              type="success"
            >
              发起人
            </el-tag>
            <el-tag
              v-for="user in scope.row.users"
              v-else
              :key="user.account"
              closable
              type="success"
              @close="removeUser(user, scope.row)"
            >
              {{ user.name }}
            </el-tag>
          </el-row>

          <!--表单人员-->
          <span v-if="scope.row.type == 'formFieldUser'">
            {{ scope.row.formFieldUser?.description }}
            <form-field-user-dialog
              v-model="scope.row.formFieldUser"
              :bo-list="boList"
            />
          </span>

          <!--业务权责矩阵-->
          <span v-if="scope.row.type == 'busMatrix'">
            <matrix-select-dialog
              v-model="scope.row.matrixConfig"
              :bo-list="boList"
            />
          </span>

          <!--组-->
          <el-row v-if="scope.row.type == 'group'">
            <el-radio-group v-model="scope.row.groupType">
              <el-radio-button label="org">组织</el-radio-button>
              <el-radio-button label="role">角色</el-radio-button>
              <el-radio-button label="post">岗位</el-radio-button>
            </el-radio-group>
            <!--组织-->
            <ab-cust-dialog
              v-if="scope.row.groupType == 'org'"
              dialog-key="orgSelector"
              :extra-data="scope.row"
              :icon="Search"
              style="margin-left: 10px"
              @ok="setOrg"
            >
              选择组织
            </ab-cust-dialog>
            <el-tag
              v-for="org in scope.row.groupType == 'org' ? scope.row.orgs : []"
              :key="org.key"
              closable
              type="success"
              @close="abUtil.Arrays.remove(org, scope.row.orgs)"
            >
              {{ org.name }}
            </el-tag>

            <!--角色-->
            <ab-cust-dialog
              v-if="scope.row.groupType == 'role'"
              dialog-key="roleSelector"
              :extra-data="scope.row"
              :icon="Search"
              style="margin-left: 10px"
              @ok="setRole"
            >
              选择角色
            </ab-cust-dialog>
            <el-tag
              v-for="role in scope.row.groupType == 'role'
                ? scope.row.roles
                : []"
              :key="role.key"
              closable
              type="success"
              @close="abUtil.Arrays.remove(role, scope.row.roles)"
            >
              {{ role.name }}
            </el-tag>

            <!--岗位-->
            <ab-cust-dialog
              v-if="scope.row.groupType == 'post'"
              dialog-key="postSelector"
              :extra-data="scope.row"
              :icon="Search"
              style="margin-left: 10px"
              @ok="setPost"
            >
              选择岗位
            </ab-cust-dialog>
            <el-tag
              v-for="post in scope.row.groupType == 'post'
                ? scope.row.posts
                : []"
              :key="post.id"
              closable
              type="success"
              @close="abUtil.Arrays.remove(post, scope.row.posts)"
            >
              {{ post.name }}
            </el-tag>
          </el-row>

          <!--相对岗位-->
          <span v-if="scope.row.type == 'relativePost'">
            {{ scope.row.relativePost?.description }}
            <relative-post-selector-dialog v-model="scope.row.relativePost" />
          </span>

          <!--脚本-->
          <span v-if="scope.row.type == 'script'">
            {{ AbFlowUtil.getScriptDesc(scope.row.script) }}
            <script-dialog v-model="scope.row.script" />
          </span>

          <!--相同节点候选人-->
          <el-select
            v-if="scope.row.type == 'sameNode'"
            v-model="scope.row.nodeId"
          >
            <el-option
              v-for="(val, key) in userNodeList"
              :key="key"
              :label="val.nodeName"
              :value="val.nodeKey"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template #header>
          定位到用户
          <el-tooltip placement="top">
            <template #content>
              若人员为组类型时，如抽取：任务候选人为当前组所有人；不抽取：候选人为组，不具体到人
              <br />
              例子：如果某岗位，如抽取：候选人在任务产生时获取该岗位所有人作为候选人；不抽取：则候选人为该岗位，任务产生后该岗位人员发生变动不受影响
            </template>
            <el-icon :size="20"><QuestionFilled /></el-icon>
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-radio-group
            v-if="
              [
                'group',
                'formFieldUser',
                'relativePost',
                'script',
                'busMatrix',
              ].includes(scope.row.type)
            "
            v-model="scope.row.extractType"
          >
            <el-radio-button label="no">不抽取</el-radio-button>
            <el-radio-button label="extract">抽取用户</el-radio-button>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column width="100">
        <template #header>
          运算
          <el-tooltip placement="top">
            <template #content>
              合集：和条件列的人员合并一起作为任务候选人
              <br />
              交集：和条件列共有的人员才会作为任务候选人
              <br />
              排除：排除条件列人员后作为任务候选人
            </template>
            <el-icon :size="20"><QuestionFilled /></el-icon>
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-select
            v-if="info.data.length != 1 && scope?.$index != 0"
            v-model="scope.row.logicType"
          >
            <el-option label="合集" value="or" />
            <el-option label="交集" value="and" />
            <el-option label="排除" value="exclude" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column min-width="100">
        <template #header>
          条件
          <el-tooltip placement="top">
            <template #content>
              该设置返回布尔值类型，
              <br />
              如果返回true则本行节点人员配置生效
              <br />
              如果返回false 本行节点人员配置不生效
            </template>
            <el-icon :size="20"><QuestionFilled /></el-icon>
          </el-tooltip>
        </template>
        <template #default="scope">
          {{ AbFlowUtil.getScriptDesc(scope.row.condition) }}
          <condition-script-dialog ref="script" v-model="scope.row.condition" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button
            v-show="info.data.length != 1"
            circle
            class="move-btn"
            :icon="Sort"
          />
          <el-button
            circle
            :icon="Delete"
            plain
            type="danger"
            @click="delInfoData(scope?.$index)"
          />
          <!-- <el-tag v-else effect="dark" style="margin-left: 10px" type="warning">
            无操作
          </el-tag> -->
        </template>
      </el-table-column>
    </el-table>
    <el-button :icon="Plus" style="margin-top: 5px" type="primary" @click="add">
      增加人员
    </el-button>

    <template #footer>
      <span class="dialog-footer">
        <el-button text type="primary" @click="info.dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { sysApi } from '@agilebpm/api'
  import type { FormInstance } from 'element-plus'
  import {
    Edit,
    Plus,
    Delete,
    QuestionFilled,
    Search,
    Sort,
  } from '@element-plus/icons-vue'
  import Sortable from 'sortablejs'
  import conditionScriptDialog from '../../../common/conditionScriptDialog.vue'

  import scriptDialog from '../../../common/scriptDialog.vue'
  import FormFieldUserDialog from './formFieldUserDialog.vue'
  import * as AbFlowUtil from '~/agilebpm/package/ab-common-resource/ab-flow-util'
  import RelativePostSelectorDialog from './relativePostSelectorDialog.vue'
  import matrixSelectDialog from './matrixSelectDialog.vue'

  const props = defineProps({
    modelValue: {
      required: true,
      type: Object,
      default: () => {
        return []
      },
    },
    currentNodekey: {
      required: false,
      type: String,
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const info: any = reactive({
    dialogVisible: false,
    data: [],
    resolvers: [],
    resolverMap: null,
    GroupType: {},
  })

  const delInfoData = (index: number) => {
    abUtil.Arrays.del(index, info.data)
    if (info.data.length > 0) {
      info.data[0].logicType = 'or'
    }
  }

  const userNodeListAll = inject<Array<NodeConfig>>('userNodeList')
  let userNodeList = [] as Array<NodeConfig>

  const add = () => {
    info.data.push({
      type: 'user',
      extractType: 'no',
      logicType: 'or',
      sn: abUtil.Arrays.getNextSn(info.data),
      condition: null,
      source: 'start',
    })
  }

  const formRef = ref<FormInstance>()

  sysApi.tools
    .InterFaceImpls(
      'com.dstz.bpm.engine.plugin.identityresolver.BpmIdentityResolver'
    )
    .then((result: any) => {
      info.resolvers = result
      info.resolverMap = {}
      result.forEach((item: any) => {
        info.resolverMap[item.type] = item
      })
    })

  sysApi.tools
    .getEnum('com.dstz.org.api.enums.GroupType', true)
    .then((resp) => {
      resp.data.forEach((item: any) => (info.GroupType[item.type] = item))
    })

  const table = ref()
  const open = () => {
    info.dialogVisible = true
    info.data = abUtil.clone(props.modelValue)
    if (info.data.length == 0) {
      add() //初始化一条
    }
    setTimeout(() => {
      Sortable.create(table.value.$el.querySelector('tbody'), {
        animation: 300,
        handle: '.move-btn',
        onEnd: (evt: any) => {
          const t = info.data.splice(evt.oldIndex, 1)[0]
          info.data.splice(evt.newIndex, 0, t)
        },
      })
    })
  }

  const ok = () => {
    info.dialogVisible = false
    //第一条数据改为合集，避免拖动后第一条变成交集或排除
    if (info.data.length > 0) {
      info.data[0].logicType = 'or'
    }
    emit('update:modelValue', info.data)
  }

  const setUser = (users: any, row: any) => {
    row.source = ''

    row.users = row.users || []
    users.forEach((user: any) => {
      let b = false
      row.users.forEach((u: any) => {
        if (u.account == user.account) {
          b = true
        }
      })
      if (b) return

      row.users.push({
        account: user.account,
        name: user.name,
      })
    })
  }

  const removeUser = (user: any, row: any) => {
    abUtil.Arrays.remove(user, row.users)
    if (row.users.length == 0) {
      row.source = 'start'
    }
  }

  const setOrg = (orgs: any, row: any) => {
    row.orgs = row.orgs || []
    orgs.forEach((org: any) => {
      let b = false
      row.orgs.forEach((o: any) => {
        if (o.key == org.key) {
          b = true
        }
      })
      if (b) return

      row.orgs.push({
        key: org.key,
        name: org.name,
      })
      row.roles = []
      row.posts = []
    })
  }

  const setRole = (roles: any, row: any) => {
    row.roles = row.roles || []
    roles.forEach((role: any) => {
      let b = false
      row.roles.forEach((r: any) => {
        if (r.key == role.key) {
          b = true
        }
      })
      if (b) return

      row.roles.push({
        key: role.key,
        name: role.name,
      })
      row.posts = []
      row.orgs = []
    })
  }

  const setPost = (posts: any, row: any) => {
    row.posts = row.posts || []
    posts.forEach((post: any) => {
      let b = false
      row.posts.forEach((r: any) => {
        if (r.id == post.id) {
          b = true
        }
      })
      if (b) return

      row.posts.push({
        id: post.key,
        name: post.name,
      })
      row.roles = []
      row.orgs = []
    })
  }

  const getDesc = () => {
    if (props.modelValue.length == 0 || !info.resolverMap) {
      return ''
    }
    const list: any = []
    props.modelValue.forEach((row: any, index: number) => {
      if (getDescDetail(row)) {
        list.push(getDescDetail(row, index))
      }
    })
    return list.join(' 和 ')
  }
  //获取详细候选人信息
  const getDescDetail = (row: any, index: number) => {
    let result = ''
    let contentStr = ''
    let title = ''
    switch (row.type) {
      case 'user':
        if (row?.users?.length > 0) {
          contentStr = row.users.map((a: any) => a.name).join(',')
        } else if (row.source == 'start') {
          contentStr = '发起人'
        }
        break
      case 'group':
        if (row?.groupType == 'org' && row?.orgs?.length > 0) {
          contentStr = row.orgs.map((a: any) => a.name).join(',')
          title = '组织'
        }
        if (row?.groupType == 'role' && row?.roles?.length > 0) {
          contentStr = row.roles.map((a: any) => a.name).join(',')
          title = '角色'
        }
        if (row?.groupType == 'post' && row?.posts?.length > 0) {
          contentStr = row.posts.map((a: any) => a.name).join(',')
          title = '岗位'
        }
        break
      case 'formFieldUser':
        contentStr = row.formFieldUser?.description
        break
      case 'relativePost':
        contentStr = row.relativePost?.description
        break
      case 'script':
        contentStr = '脚本'
        break
      case 'sameNode':
        userNodeList?.forEach((element: any) => {
          if (element.nodeKey == row.nodeId) {
            contentStr = element.nodeName
          }
        })
        break
      case 'approver':
        contentStr = '流程历史审批人'
        break
      case 'busMatrix':
        contentStr = row.matrixConfig?.description
        break
    }

    if (contentStr) {
      if (row.type != 'group') {
        title = info.resolverMap[row.type].title
      }
      if (title != contentStr) {
        result += `${title}【${contentStr}】`
      } else {
        result += title
      }
    }

    if (index > 0) {
      if (row.logicType === 'or') {
        result += ' 的合集 '
      }
      if (row.logicType === 'and') {
        result += ' 的交集 '
      }
      if (row.logicType === 'exclude') {
        result += ' 的排除合集 '
      }
    }
    return result
  }

  const getUserNodeList = () => {
    userNodeList = []
    userNodeListAll?.value.forEach((e: any) => {
      if (
        e['nodeType'].indexOf('StartEvent') == -1 &&
        e['nodeKey'].indexOf(props.currentNodekey) == -1
      ) {
        userNodeList.push(e)
      }
    })
  }
  getUserNodeList()
  watch(
    () => props.currentNodekey,
    (newValue) => {
      getUserNodeList()
    }
  )
</script>

<style lang="scss" scoped>
  .move-btn {
    cursor: move;
  }

  .el-tag {
    margin-top: 5px;
    margin-left: 10px;
  }
</style>
