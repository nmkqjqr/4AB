<template>
  <div class="common-layout" style="overflow: hidden">
    <el-container>
      <div class="left-box">
        <div style="width: -moz-fit-content; overflow-x: scroll">
          <initTree
            v-if="info.orgTreeData && info.orgTreeData.length > 0"
            ref="treeRef"
            :tree-data="info.orgTreeData"
            @add-click="orgaddclickFn"
            @node-click="orgClickFn"
            @reload-click="orgreloadClickFn"
            @remove-click="orgremoveClickFn"
          />
        </div>
      </div>
      <div class="right-box">
        <el-main>
          <el-tabs v-model="info.tabName" class="demo-tabs">
            <el-tab-pane   v-show="info.tabName !== 'default' && info.currentOrgId "   :label="getLabel()" name="detail">
              <groupDetail
                :operation-type="info.operationType"
                :org-id="info.currentOrgId"
                :parent-org="info.currentOrg"
                :readonly-tmp="info.readonlyTmp"
                @append-child-msg-event="appendChildMsg"
                @cancel="cancel"
                @edit-org="editOrg"
                @reload-tree="getDataTree"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="info.tabName !== 'default' && info.currentOrgId && info.operationType !== 'add'"
              :label="$abT('page.groupList.orgUsers','组织人员')"
              name="orgUsers"
            >
              <groupUserList
                :current-org="info.currentOrg"
                :org-id="info.currentOrgId"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="info.tabName === 'default'"
              :label="$abT('page.groupList.pleaseSelectOrg','请选择组织')"
              name="default"
            >
              <el-empty :description="$abT('page.groupList.emptyMsg','请选择左侧要操作的组织')" />
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </div>
    </el-container>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue'
  import { orgApi, getData } from '~/agilebpm'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import groupDetail from '@/views/org/group/groupDetail.vue'
  import groupUserList from '@/views/org/group/groupUserList.vue'
  import initTree from '@/views/org/group/components/initTree.vue'
  import {abT} from "@/i18n";

  export default defineComponent({
    name: 'GroupList',
    components: { groupDetail, groupUserList, initTree },
    setup() {
      const info = reactive({
        form: {},
        operationType: '',
        orgTreeData: [],
        saveloading: false,
        loading: false,
        currentOrgId: '',
        currentOrg: {
          children: [],
          title: '',
        },
        contextData: {
          title: '',
          children: [],
          id: '',
        },
        tabName: 'default',
        readonlyTmp: false,
      })

      const formRef = ref('formRef')
      const treeRef = ref('treeRef')

      onMounted(() => {
        getDataTree()
      })

      const getLabel = () => {
        if (info.operationType === 'edit') {
          return abT('page.groupList.orgDetails','组织详情信息')
        }
        if (info.operationType === 'add') {
          return abT('page.groupList.addSubOrg','新增下级组织')
        }
        if (info.operationType === 'detail') {
          return abT('page.groupList.orgDetails','组织详情信息')
        }
      }

      const editOrg = () => {
        info.operationType = 'edit'
        getLabel()
      }
      const cancel = () => {
        info.operationType = 'detail'
        getLabel()
      }

      // 更新右侧详细信息
      const updatedesdata = (data: any) => {
        info.form = data
      }
      // loading框控制
      const loadingFn = (bool: boolean) => {
        info.loading = bool
      }

      // 点击刷新
      const orgreloadClickFn = () => {
        getDataTree()
      }

      //点击左侧树节点 设置节点对象contextData的值
      const orgClickFn = (value: any) => {
        if (value.id == '0') {
          return
        }
        info.contextData = value
        info.currentOrgId = value.id
        info.currentOrg = value
        info.operationType = 'detail'
        if (info.tabName == 'default') {
          info.tabName = 'detail'
        }
      }
      // 点击添加
      const orgaddclickFn = (value: any) => {
        info.contextData = value
        info.currentOrgId = value.id
        info.currentOrg = value
        info.operationType = 'add'
        info.tabName = 'detail'
      }

      // 点击删除
      const orgremoveClickFn = (row: any) => {
        if (row.id) {
          ElMessageBox.confirm(
            abT('page.groupList.delOrgMsg','该操作会级联删除所有下级组织,确认删除当前组织？'),
            abT('page.common.prompt','提示'),
            {
              confirmButtonText: abT('page.common.ok','确定'),
              cancelButtonText: abT('page.common.cancel','取消'),
              type: 'warning',
            }
          )
            .then(() => {
              getData(orgApi.group.removeOrgGroupUrl + row.id, {}).then(
                (res: any) => {
                  ElMessage({
                    showClose: true,
                    message: res.msg,
                    type: 'success',
                  })
                  getDataTree()
                  if( info.currentOrgId ==  row.id){
                    info.tabName = 'default'
                    info.currentOrgId = ''
                    info.operationType = ''

                  }
                }
              )
            })
            .catch(() => {})
        }
      }

      const appendChildMsg = (child: any, isAdd: boolean) => {
        child.title = child.name
        if (isAdd) {
          const children: any = info.currentOrg.children || []
          children.push(child)
          info.currentOrg.children = children
        } else {
          info.currentOrg.title = child.title
        }
        orgClickFn(child)
      }

      // 请求左侧树列表
      const getDataTree = () => {
        orgApi.group.getOrgTreeData().then((result: any) => {
          info.orgTreeData = result.data
        })
      }

      const openDetail = (data: any) => {
        info.currentOrgId = data.id
        info.currentOrg = data
        info.operationType = 'detail'
      }

      return {
        orgApi,
        info,
        getData,
        groupUserList,
        groupDetail,
        formRef,
        treeRef,
        getLabel,
        updatedesdata,
        orgreloadClickFn,
        orgClickFn,
        orgaddclickFn,
        orgremoveClickFn,
        getDataTree,
        openDetail,
        appendChildMsg,
        initTree,
        editOrg,
        cancel,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.menu-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }

  .selectstyle {
    width: 100%;
    margin-bottom: 10px;
  }

  .custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    font-size: 14px;
  }

  .left-box {
    float: left;
    width: 280px;
    border-right: 10px solid #f5f7f9;
  }
  .right-box {
    float: left;
    width: calc(100% - 350px);
  }

</style>
