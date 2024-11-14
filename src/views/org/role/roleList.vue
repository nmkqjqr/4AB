<template>
  <div class="common-layout">
    <el-container>
      <div>
        <el-aside class="left-tree">
          <ab-dict-tree
            v-model="query.typeCode$VIN"
            type-code="jsfl"
            @node-click="searchResetPage()"
          />
        </el-aside>
      </div>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <el-row class="vab-query-form">
              <el-col class="top-panel">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  label-width="62px"
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item :label="$abT('page.roleList.name','名称')" prop="name$VLK">
                    <el-input
                      v-model="query.name$VLK"
                      :placeholder="$abT('page.roleList.pleaseEnterName','请输入名称')"
                    />
                  </el-form-item>
                  <el-form-item :label="$abT('page.roleList.code','编码')" prop="code$VLK">
                    <el-input
                      v-model="query.code$VLK"
                      :placeholder="$abT('page.roleList.pleaseEnterCode','请输入编码')"
                    />
                  </el-form-item>
                  <el-form-item
                    v-show="collapse"
                    :label="$abT('page.common.status','状态')"
                    prop="enabled$NEQ"
                  >
                    <el-select
                      v-model="query.enabled$NEQ"
                      :placeholder="$abT('page.common.all','全部')"
                      clearable
                    >
                      <el-option :label="$abT('page.common.disable','禁用')" value="0" />
                      <el-option :label="$abT('page.common.enable','启用')" value="1" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      {{ $abT('page.common.search',  '查询' ) }}
                    </el-button>
                    <el-button :icon="RefreshRight" @click="reset()">
                      {{ $abT('page.common.reset','重置') }}
                    </el-button>
                    <el-button link type="primary" @click="handleCollapse()">
                      <span v-if="!collapse" type="primary">{{ $abT('page.common.expand','展开') }}</span>
                      <span v-else type="primary">{{ $abT('page.common.packup','收起') }}</span>
                      <el-icon class="el-icon--right">
                        <arrow-down v-if="!collapse" />
                        <ArrowUp v-else/>
                      </el-icon>
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col class="left-panel">
                <el-space>
                  <router-link
                    v-ab-btn-rights:roleList_add
                    :to="{
                      name: 'RoleEdit',
                      query: { typeCode: query['typeCode$VEQ'] },
                    }"
                  >
                    <el-button :icon="Plus" type="primary">{{ $abT('page.common.add','添加') }}</el-button>
                  </router-link>
                  <el-button
                    v-ab-btn-rights:roleList_del
                    :disabled="!selectedData || selectedData.length == 0"
                    :icon="Delete"
                    type="danger"
                    @click="delBySeletedIds(orgApi.role.orgRoleRemoveUrl)"
                  >
                    {{ $abT('page.common.batchDel','批量删除') }}
                  </el-button>
                </el-space>
              </el-col>
            </el-row>
          </div>

          <ab-table
            ref="abTable"
            v-model="selectedData"
            :height="tableHeight"
            :query-param="query"
            row-key="id"
            :url="orgApi.role.orgRoleListUrl"
          >
            <ab-column :label="$abT('page.roleList.name','名称')" min-width="120" prop="name" />
            <ab-column :label="$abT('page.roleList.code','编码')" prop="code" width="180" />
            <ab-column :label="$abT('page.roleList.group','分组')" prop="typeName" width="140" />
            <ab-column :label="$abT('page.roleList.level','级别')" prop="level" sortable width="100" />
            <ab-column
              :label="$abT('page.common.status','状态')"
              ab-template="status"
              min-width="100"
            />
            <template #status="{ scope }">
              <el-tag v-if="scope.row.enabled === 0" type="danger">{{ $abT('page.common.disable','禁用') }}</el-tag>
              <el-tag  v-if="scope.row.enabled === 1" type="success">{{ $abT('page.common.enable','启用') }}</el-tag>
            </template>
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              :label="$abT('page.common.updateTime','更新时间')"
              prop="updateTime"
              sortable
              min-width="140"
            />
            <ab-column :label="$abT('page.common.updater','更新人')" min-width="120" prop="updater" />
            <ab-column
              ab-template="edit"
              fixed="right"
              :label="$abT('page.common.operate','操作')"
              min-width="540"
            />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:roleList_edit
                :to="{ name: 'RoleEdit', query: { id: scope.row.id } }"
              >
                <el-button text type="primary">{{ $abT('page.common.edit','编辑') }}</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:roleList_resource
                text
                type="primary"
                @click="openRoleResGrantDialog(scope.row)"
              >
                {{ $abT('page.roleList.roleRes','角色资源') }}
              </el-button>
              <router-link
                v-ab-btn-rights:roleList_users
                :to="{
                  name: 'RoleUserList',
                  query: { roleId: scope.row.id, roleName: scope.row.name },
                }"
              >
                <el-button text type="primary">{{ $abT('page.roleList.assignUsers','分配用户') }}</el-button>
              </router-link>
              <router-link
                v-ab-btn-rights:roleList_dataPrivilegeGiven
                :to="{
                  name: 'RoleDataPrivilegeGiven',
                  query: { code: scope.row.code, name: scope.row.name },
                }"
              >
                <el-button text type="primary">{{ $abT('page.roleList.dataPermissions','数据权限') }}</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:roleList_del
                text
                type="primary"
                @click="
                  sendAction(
                    orgApi.role.orgRoleRemoveUrl + scope.row.id,
                     $abT('page.common.delMsg','确定删除 {a} 吗？',{ a: scope.row.name })
                  )
                "
              >
                {{ $abT('page.common.del','删除') }}
              </el-button>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>
    <!-- 角色资源授权 -->
    <role-res-grant
      v-model="roleResGrantInfo.visible"
      :role-id="roleResGrantInfo.roleId"
    />
  </div>
</template>

<script lang="ts">
  import { abTableMix, abDictTree, orgApi } from '~/agilebpm'
  export default { name: 'RoleList', mixins: [abTableMix] }
</script>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import {
    Search,
    Delete,
    Plus,
    RefreshRight,
    ArrowUp,
    ArrowDown,
  } from '@element-plus/icons-vue'
  import RoleResGrant from '@/views/org/role/roleResGrant.vue'

  const roleResGrantInfo = reactive({
    roleId: '',
    visible: false,
  })

  // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
  const query: any = reactive({
    name$VLK: '',
    code$VLK: '',
    typeCode$VIN: '',
    enabled$NEQ: '',
  })

  /**
   * 打开角色资源授权对话框
   * @param role 角色
   */
  const openRoleResGrantDialog = (role: any) => {
    roleResGrantInfo.visible = true
    roleResGrantInfo.roleId = role.id
  }
</script>
