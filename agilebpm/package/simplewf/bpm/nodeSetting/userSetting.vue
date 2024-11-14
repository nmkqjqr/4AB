<template>
  <div class="demo-drawer__content">
    <div class="drawer_content">
      <div>
        <Section v-for="(calc, idxb) in userRules" :key="idxb">
          <el-tabs
            v-model="calc.type"
            name="assignUser"
            size="small"
            @tab-click="initRelation(calc)"
          >
            <el-tab-pane label="指定用户" name="user" tab="assignUser">
              <el-form class="mt20" :label-width="80">
                <el-form-item label="成员类型">
                  <el-radio-group v-model="calc.source" class="clear">
                    <el-radio label="start">[用户]发起人</el-radio>
                    <el-radio label="spec">选择成员</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <Section v-if="calc.source == 'spec'">
                <span v-if="calc.userName">
                  <el-tag
                    v-for="(name, idxc) in calc.userName.split(',')"
                    :key="idxc"
                    style="margin-right: 8px"
                  >
                    {{ name }}
                  </el-tag>
                </span>
                <ab-cust-dialog
                  dialog-key="userSelector"
                  :extra-data="userRules[idxb]"
                  style="margin-left: 8px; margin-bottom: 5px"
                  @ok="setUser"
                >
                  选择用户
                </ab-cust-dialog>
                <el-tag
                  v-if="userRules[idxb].source == 'start'"
                  effect="dark"
                  style="margin-left: 6px"
                  type="success"
                >
                  发起人
                </el-tag>
                <el-tag
                  v-for="user in userRules[idxb].users"
                  v-else
                  :key="user.account"
                  closable
                  style="margin-left: 6px; margin-bottom: 6px"
                  type="success"
                  @close="removeUser(user, userRules[idxb])"
                >
                  {{ user.name }}
                </el-tag>
              </Section>
            </el-tab-pane>
            <el-tab-pane label="指定 组" name="group" tab="assignUser">
              <Section v-if="calc.type == 'group'">
                <el-form class="mt20" :label-width="80">
                  <el-form-item label="岗位类型">
                    <el-radio-group
                      v-model="calc.groupType"
                      class="clear"
                      @change="groupTypeChange(calc)"
                    >
                      <el-radio label="org">组织</el-radio>
                      <el-radio label="role">角色</el-radio>
                      <el-radio label="post">岗位</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
                <span v-if="calc.groupName">
                  <el-tag
                    v-for="(name, idxc) in calc.groupName.split(',')"
                    :key="idxc"
                    style="margin-right: 8px"
                  >
                    {{ name }}
                  </el-tag>
                </span>

                <ab-cust-dialog
                  v-if="calc.groupType == 'org'"
                  dialog-key="orgSelector"
                  :extra-data="userRules[idxb]"
                  style="margin-left: 10px; margin-bottom: 5px"
                  @ok="setOrg"
                >
                  增加组织
                </ab-cust-dialog>

                <el-tag
                  v-for="org in userRules[idxb].groupType == 'org'
                    ? userRules[idxb].orgs
                    : []"
                  :key="org.key"
                  closable
                  style="margin-left: 6px; margin-bottom: 6px"
                  type="success"
                  @close="abUtil.Arrays.remove(org, userRules[idxb].orgs)"
                >
                  {{ org.name }}
                </el-tag>

                <ab-cust-dialog
                  v-if="calc.groupType == 'role'"
                  dialog-key="roleSelector"
                  :extra-data="userRules[idxb]"
                  style="margin-left: 10px; margin-bottom: 5px"
                  @ok="setRole"
                >
                  增加角色
                </ab-cust-dialog>

                <el-tag
                  v-for="role in userRules[idxb].groupType == 'role'
                    ? userRules[idxb].roles
                    : []"
                  :key="role.key"
                  closable
                  style="margin-left: 6px; margin-bottom: 6px"
                  type="success"
                  @close="abUtil.Arrays.remove(role, userRules[idxb].roles)"
                >
                  {{ role.name }}
                </el-tag>

                <ab-cust-dialog
                  v-if="calc.groupType == 'post'"
                  dialog-key="postSelector"
                  :extra-data="userRules[idxb]"
                  style="margin-left: 10px; margin-bottom: 5px"
                  @ok="setPost"
                >
                  增加岗位
                </ab-cust-dialog>
                <el-tag
                  v-for="post in userRules[idxb].groupType == 'post'
                    ? userRules[idxb].posts
                    : []"
                  :key="post.id"
                  closable
                  style="margin-left: 6px; margin-bottom: 6px"
                  type="success"
                  @close="abUtil.Arrays.remove(post, userRules[idxb].posts)"
                >
                  {{ post.name }}
                </el-tag>
              </Section>
            </el-tab-pane>
            <el-tab-pane label="相对岗位" name="relativePost" tab="assignUser">
              <table v-if="calc.type == 'relativePost'" class="form-table">
                <thead>
                  <tr>
                    <th>指定一个相对岗位的组织</th>
                    <th>指定关系</th>
                    <th>指定岗位角色</th>
                  </tr>
                </thead>
                <tr>
                  <td style="width: 180px">
                    <el-select v-model="calc.relativePost.orgFrom">
                      <el-option label="发起人所在组织" value="startUserOrg" />
                      <el-option
                        label="上一任务处理者所在的组织"
                        value="preTaskUserOrg"
                      />
                    </el-select>
                  </td>
                  <td style="width: 300px">
                    <el-select
                      v-model="calc.relativePost.orgRelation"
                      style="width: 180px"
                      :transfer="true"
                      @change="changeType(calc.relativePost)"
                    >
                      <el-option
                        aria-selected="true"
                        label="所在组织"
                        value="currentOrg"
                      />
                      <el-option label="上一级" value="parentOrg" />
                      <el-option
                        label="上级中指定类型的组织"
                        value="parentOrgFilterType"
                      />
                      <el-option
                        label="上级中指定级别的组织"
                        value="parentOrgSpecicalLevel"
                      />
                      <el-option label="下一级" value="childOrg" />
                      <el-option
                        label="下级中指定类型的组织"
                        value="childOrgFilterType"
                      />
                    </el-select>

                    <el-select
                      v-if="
                        calc.relativePost.orgRelation ===
                          'parentOrgFilterType' ||
                        calc.relativePost.orgRelation === 'childOrgFilterType'
                      "
                      v-model="calc.relativePost.parentOrgFilterType"
                      style="width: 90px; margin-left: 6px"
                      :transfer="true"
                    >
                      <el-option
                        v-for="item in info.gradeTypes"
                        :key="item.key"
                        :label="item.label"
                        :value="item.key"
                      />
                    </el-select>

                    <el-select
                      v-if="
                        calc.relativePost.orgRelation ===
                        'parentOrgSpecicalLevel'
                      "
                      v-model="calc.relativePost.parentOrgSpecicalLevel"
                      style="float: right; width: 80px"
                      :transfer="true"
                      type="text"
                    >
                      <el-option label="上两级" value="2" />
                      <el-option label="上三级" value="3" />
                      <el-option label="上四级" value="4" />
                      <el-option label="上五级" value="5" />
                    </el-select>
                  </td>
                  <td>
                    <ab-cust-dialog
                      v-model="userRules[idxb].relativePost.dialogData"
                      dialog-key="roleSelector"
                      :extra-data="{ roleKey: calc.relativePost.roleKey }"
                      size="small"
                      style="margin-right: 10px"
                      type="primary"
                      :value-mapping="{ id: 'id', name: 'name' }"
                      @ok="setRolePost"
                    >
                      选择
                    </ab-cust-dialog>
                    <el-tag
                      v-for="item in userRules[idxb].relativePost.dialogData"
                      :key="item.id"
                      class="mx-2"
                      closable
                      style="
                        margin-right: 5px;
                        margin-bottom: 3px;
                        margin-top: 3px;
                      "
                      type="success"
                      @close="deleteRole(item, userRules[idxb].relativePost)"
                    >
                      {{ item.name }}
                    </el-tag>
                  </td>
                </tr>
              </table>
            </el-tab-pane>
          </el-tabs>
        </Section>
      </div>
    </div>
    <br />
    <br />
  </div>
</template>
<script lang="ts" setup>
  import { sysApi } from '@agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const props = defineProps({
    userRules: { required: true, type: Object },
    commonUtil: { required: true, type: Object },
  })
  const { userRules, commonUtil } = toRefs(props)

  const info = reactive({
    selectItem: {},
    initList: [],
    gradeTypes: [],
    postDialogData: [],
  })
  sysApi.tools
    .getEnum('com.dstz.org.api.enums.GroupGradeConstant', true)
    .then(({ data }) => {
      info.gradeTypes = data
    })

  const removeUser = (user: any, row: any) => {
    abUtil.Arrays.remove(user, row.users)
    if (row.users.length == 0) {
      row.source = 'start'
    }
  }

  const deleteRole = (item: any, relativePost: any) => {
    abUtil.Arrays.remove(item, relativePost.dialogData)

    relativePost.roleKey = relativePost.dialogData
      .map((a: any) => a.id)
      .join(',')
    relativePost.roleName = relativePost.dialogData
      .map((a: any) => a.name)
      .join(',')
  }
  const setUser = (users: any, row: any) => {
    row.source = 'spec'

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
      row.roles = []
      row.orgs = []
      row.posts = []
    })
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
      row.users = []
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
      row.users = []
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
      row.users = []
    })
  }

  //选择岗位回调赋值
  const setRolePost = (posts: Array<any>, row: any) => {
    userRules.value[0].relativePost.roleKey = posts
      .map((a: any) => a.id)
      .join(',')
    userRules.value[0].relativePost.roleName = posts
      .map((a: any) => a.name)
      .join(',')
  }

  const groupTypeChange = (calc: any) => {
    if (!calc) return
    calc.groupKey = ''
    calc.groupName = ''
  }

  const changeType = (relativePost: any) => {
    if (!relativePost) return
    info.initList = []
    relativePost.parentOrgFilterType = ''
    relativePost.parentOrgSpecicalLevel = ''
    if (
      relativePost.orgRelation == 'parentOrgFilterType' ||
      relativePost.orgRelation == 'childOrgFilterType'
    ) {
      relativePost.parentOrgFilterType = '0'
    }
    if (relativePost.orgRelation == 'parentOrgSpecicalLevel') {
      relativePost.parentOrgSpecicalLevel = '2'
    }
  }

  const initRelation = (calc: any) => {
    if (!calc.orgFrom) {
      calc.relativePost = {
        orgFrom: 'startUserOrg',
        orgRelation: 'currentOrg',
        parentOrgSpecicalLevel: '',
        parentOrgFilterType: '',
        roleKey: '',
        roleName: '',
        description: '',
        dialogData: [],
        formFieldPath: '',
        formFieldPathDesc: '',
      }

      if (!calc.groupType) {
        calc.groupType = 'org'
        calc.type = 'group'
      }
    }
  }

  const selectRole = (dataArr: [], calc: any) => {
    if (!dataArr) return
    if (!info.initList) {
      info.initList = []
    }
    calc.roleKey = ''
    calc.roleName = ''
    dataArr.forEach((item: any) => {
      //校验是否重复存在
      // eslint-disable-next-line no-var
      for (var i = 0, relation; (relation = info.initList[i++]); ) {
        if (relation.roleId === item.id) {
          return
        }
      }

      if (calc.roleKey) {
        calc.roleKey += ','
        calc.roleName += ','
      }
      calc.roleName += item.name
      calc.roleKey += item.key
    })
    info.initList = dataArr
  }
</script>
<style scoped>
  td {
    padding: 10px;
  }
  fieldset {
    padding: 10px;
    border: 2px dotted #ddd;
  }
</style>
