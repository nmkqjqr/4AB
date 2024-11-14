<template>
  <div class="treeBoxHeight" shadow="hover" style="padding: 10px">
    <el-tree
      v-loading="info.loading"
      :allow-drop="allowDrop"
      :data="info.documentTree"
      :default-expanded-keys="info.expandedTreeData"
      draggable
      empty-text="加载中。。。"
      :expand-on-click-node="false"
      :highlight-current="true"
      node-key="id"
      :operation="true"
      :props="defaultProps"
      @node-click="currentChange"
      @node-drop="nodeDrop"
    >
      <template #default="{ data }">
        <div
          class="custom-tree-node"
          @mouseenter="data.isshow = true"
          @mouseleave="data.isshow = false"
        >
          <p :title="data.name">
            <vab-icon :icon="data.icon" />
            {{ data.name }}
            <span v-if="data.isshow" style="margin-left: 10px">
              <span v-if="props.isSuper">
                <Plus class="iconStyle" @click.stop="openDialog(data, true)" />
                <Edit
                  v-if="data.id != '0'"
                  v-ab-btn-rights:cmsDocument_editField
                  class="iconStyle"
                  @click.stop="openDialog(data, false)"
                />
                <Delete
                  v-if="data.id != '0'"
                  v-ab-btn-rights:cmsDocument_delField
                  class="iconStyle"
                  @click.stop="deleteNode(data)"
                />
              </span>
              <span v-else>
                <Plus
                  v-ab-btn-rights:cmsDocument_addField
                  class="iconStyle"
                  @click.stop="openDialog(data, true)"
                />
                <Edit
                  v-if="data.id != '0' && data.my == '1'"
                  class="iconStyle"
                  @click.stop="openDialog(data, false)"
                />
                <Delete
                  v-if="data.id != '0' && data.my == '1'"
                  class="iconStyle"
                  @click.stop="deleteNode(data)"
                />
              </span>
            </span>
          </p>
        </div>
      </template>
    </el-tree>

    <el-dialog
      v-model="info.dialogVisible"
      draggable
      :title="info.tatle"
      width="30%"
    >
      <el-form
        ref="formRef"
        v-loading="info.dialogVisibleloading"
        label-suffix="："
        label-width="150px"
        :model="info.data"
        :status-icon="false"
        @submit.prevent
      >
        <el-form-item
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '必填' }]"
        >
          <el-input
            v-model="info.data.name"
            placeholder="请输入名称"
            @keyup.enter="submit"
          />
        </el-form-item>

        <el-form-item
          label="是否继承权限"
          prop="extend"
          :rules="[{ required: true, message: '必填' }]"
        >
          <el-switch
            v-model="info.data.extend"
            :rules="[{ required: true, message: '必填' }]"
            @change="changeExtend"
          />
        </el-form-item>

        <el-form-item v-if="!info.data.extend" label="选择权限" prop="extend">
          <div v-if="info.authorizationData.authorizationList.length > 0">
            <el-tag
              v-for="item in info.authorizationData.authorizationList"
              :key="item"
            >
              {{ item.rightsIdentityName }}
            </el-tag>
          </div>
          <el-button
            :icon="User"
            :style="
              info.authorizationData.authorizationList.length > 0
                ? 'margin-left: 10px'
                : ''
            "
            type="primary"
            @click="openAuthorizationDialog()"
          >
            授权
          </el-button>
        </el-form-item>

        <el-form-item
          label="无权限可见"
          prop="visible"
          :rules="[{ required: true, message: '必填' }]"
        >
          <el-switch
            v-model="info.data.visible"
            :active-value="1"
            :inactive-value="0"
            :rules="[{ required: true, message: '必填' }]"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-space wrap>
            <el-button text type="primary" @click="info.dialogVisible = false">
              取消
            </el-button>
            <el-button
              :loading="info.saveLoading"
              type="primary"
              @click="submit"
            >
              保存
            </el-button>
          </el-space>
        </span>
      </template>
    </el-dialog>

    <ab-authorization
      ref="authorizationRef"
      v-model="info.authorizationDialogVisible"
      :authorization-list="info.authorizationData.authorizationList"
      :authorization-type="info.authorizationData.rightsObject"
      :rights-code="info.authorizationData.rightsTarget"
      :save-flsg="false"
      @authorization-data="getAuthorizationList"
    />
  </div>
</template>

<script lang="ts" setup>
  import { Delete, Edit, Plus, User } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { abAuthorization, cmsApi, sysApi } from '~/agilebpm'

  const props = defineProps({
    search: { default: () => {} },
    isSuper: {
      type: Boolean,
      default: false,
    },
  })
  const defaultProps = {
    children: 'children',
    label: 'name',
  }

  const info: any = reactive({
    height: `${window.innerHeight - (110 + 32 + 20 + 60)}px`,
    documentTree: [] as any,
    authorizationDialogVisible: false,
    loading: false,
    dialogVisible: false,
    dialogVisibleloading: false,
    saveLoading: false,
    tatle: '',
    data: {
      name: '',
      type: '',
      extend: true,
      visible: 1,
      parentId: '',
      rightsId: '',
      rightsName: '',
    } as any,
    fieldDTO: {
      documentDto: {},
      childIds: [],
    } as any,
    searchObj: {},
    authorizationList: [] as any,
    authorizationData: {
      rightsObject: 'DOCUMENT',
      rightsTarget: '',
      authorizationList: [] as any[],
    } as any,
    //默认展开的数据 (前三层)
    expandedTreeData: [],
  })

  const formRef = ref()
  const authorizationRef = ref()

  const emit = defineEmits(['initSearch', 'search'])

  //将选中的数据以及搜索方法返给父节点
  const currentChange = (row: any) => {
    emit('initSearch', getChildren(row).join(','), row.id)
  }

  //获取选中节点的所有子孙节点
  const getChildren = (node: { children: any[]; id: string }) => {
    const childrenArr = [] as string[]
    if (node.children && node.children.length > 0) {
      for (const i in node.children) {
        childrenArr.push(...getChildren(node.children[i]))
      }
    }
    childrenArr.push(node.id)
    return childrenArr
  }

  //更改是否继承时 联动修改rightsId
  const changeExtend = (item: any) => {
    info.data.rightsId = item ? '' : info.data.id
    info.authorizationData.authorizationList = []
  }

  const openDialog = (row: any, isAdd: boolean) => {
    info.searchObj.childIds = getChildren(row).join(',')
    info.searchObj.id = row.id
    info.dialogVisibleloading = true
    if (formRef.value) {
      formRef.value.resetFields()
    }
    info.tatle = isAdd ? '新增目录' : '编辑目录'
    info.dialogVisible = true
    info.authorizationData.authorizationList = []
    if (isAdd) {
      info.data = {
        extend: true,
        visible: 1,
        type: 'field',
        rightsId: row.id,
        parentId: row.id,
      }
      info.dialogVisibleloading = false
    } else {
      cmsApi.document.getById(row.id).then((rel) => {
        //填充目录DTO对象
        info.data = rel.data
        console.log('row', row)
        row.rightsId = ''
        const rowArr = [] as any[]
        rowArr.push(row)
        info.fieldDTO.childIds = treeToArray(rowArr)
        console.log('r info.fieldDTO.childIdsow1', info.fieldDTO.childIds)
        info.authorizationData.rightsTarget = rel.data.id
        sysApi.sysAuthorization
          .getAuthorization(info.authorizationData)
          .then((r: any) => {
            info.authorizationData.authorizationList = r.data
            info.dialogVisibleloading = false
          })
      })
    }
  }

  const submit = () => {
    formRef.value.validate((valid: any) => {
      if (valid) {
        info.saveLoading = true
        //有ID为修改逻辑,无ID则保存
        if (info.data.id) {
          //如果不继承则需要先更新权限, 后台update获取到的权限ID和Name为错误数据
          if (!info.data.extend) {
            info.authorizationData.rightsTarget = info.data.rightsId
            sysApi.sysAuthorization
              .saveAuthorization(info.authorizationData)
              .then(() => update())
          } else {
            update()
          }
        } else save()
      } else {
        ElMessage({
          showClose: true,
          message: '请检查表单',
          type: 'warning',
        })
      }
    })
  }

  const save = () => {
    cmsApi.document
      .saveField(info.data)
      .then((data) => {
        if (!info.data.extend) {
          info.authorizationData.rightsTarget = data.data
          sysApi.sysAuthorization.saveAuthorization(info.authorizationData)
        }
        initTree().then(() => {
          ElMessage({
            showClose: true,
            message: '保存成功',
            type: 'success',
          })
          info.saveLoading = false
          info.dialogVisible = false
          emit('search', '')
        })
      })
      .finally(() => (info.saveLoading = false))
  }

  const update = () => {
    info.fieldDTO.documentDto = info.data
    console.log('info.fieldDTO.childIds2', info.fieldDTO.childIds)
    cmsApi.document
      .updateField(info.fieldDTO)
      .then(() => {
        initTree().then(() => {
          info.dialogVisible = false
          ElMessage({
            showClose: true,
            message: '修改成功',
            type: 'success',
          })
          info.saveLoading = false
          emit('initSearch', info.searchObj.childIds, info.searchObj.id)
        })
      })
      .finally(() => (info.saveLoading = false))
  }

  const openAuthorizationDialog = () => {
    info.authorizationData.rightsTarget = info.data.id
    info.authorizationDialogVisible = true
  }

  const getAuthorizationList = (dataList: any) =>
    (info.authorizationData.authorizationList = dataList)

  const initTree = () =>
    cmsApi.document.fieldListJson(props.isSuper).then((rel) => {
      info.loading = true
      const treeData = []
      treeData.push({
        id: '0',
        name: '所有数据',
        children: rel.data,
        rightsId: '0',
      })
      info.documentTree = treeData
      getDefaultShowNodes(2, treeData)
      info.loading = false
    })

  const getDefaultShowNodes = (num: number, children: string | any[]) => {
    --num
    if (num >= 0) {
      for (let i = 0; i < children.length; i++) {
        info.expandedTreeData.push(children[i].id)
        if (children[i].children) {
          getDefaultShowNodes(num, children[i].children)
        }
      }
    }
  }

  initTree()

  //删除目录
  const deleteNode = (row: any) => {
    if (row.children != null && row.children.length > 0) {
      ElNotification({
        title: '提示',
        message: '无法删除,该目录下存在子目录!',
        type: 'warning',
      })
      info.loading = false
    } else {
      ElMessageBox.confirm('您确定要删除该目录么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          info.loading = true
          cmsApi.document
            .deleteField(row.id)
            .then(() => {
              initTree()
              ElNotification({
                title: '提示',
                message: '目录已删除',
                type: 'success',
              })
            })
            .catch(() => (info.loading = false))
        })
        .catch(() => initTree())
    }
  }

  //判断树形能否拖拽
  const allowDrop = (draggingNode: any, dropNode: any, type: any) => {
    //所有数据根目录不可被拖拽
    if (draggingNode.data.id == '0') {
      return false
    }
    //只能移动到根目录里面, 不能和根目录'所有数据'同级
    if (dropNode.data.id === '0') {
      return type === 'inner'
    } else {
      return true
    }
  }

  // 拖拽树形
  const nodeDrop = (draggingNode: any, dropNode: any, place: any) => {
    ElMessageBox.confirm(
      `确认需要将【${draggingNode.data.name}】移动到【${
        place == 'inner' ? dropNode.data.name : dropNode.parent.data.name
      }】里面?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        info.loading = true
        //通过拖拽的位置决定取目标里的数据还是外的数据
        const peerList = place == 'inner' ? dropNode.data : dropNode.parent.data
        const sortList = [] as string[]
        peerList.children.forEach((e: { id: string }) => {
          sortList.push(e.id)
        })
        //获取拖拽的子数据
        const draggingArr = [] as any[]
        draggingArr.push(draggingNode.data)
        //修正pid为拖拽后的目录id
        const checkObj = draggingNode.data
        checkObj.parentId = peerList.id
        checkObj.extend = checkObj.id != checkObj.rightsId
        const parm = {
          sortList: sortList,
          childIds: treeToArray(draggingArr),
          documentDto: checkObj,
        }
        cmsApi.document
          .updateFieldSort(parm)
          .then(() => emit('search', ''))
          .finally(() => initTree())
      })
      .catch(() => initTree())
  }

  //树转list
  const treeToArray = (tree: any[]) => {
    // 判断 tree 是否有值，无返回 []
    if (!Array.isArray(tree) || !tree.length) return []
    const res = [] as string[]
    tree.forEach((v) => {
      // tree的每个元素都 放入到 res里面
      console.log(v.name, v.rightsId, v.id)
      if (v.rightsId != v.id) {
        res.push(v.id)
        if (v.children) {
          // 有children 就把 children数据递归 返回  依次放到 res里面
          res.push(...treeToArray(v.children))
        }
      }
    })
    return res
  }
</script>

<style lang="scss" scoped>
  .custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding-right: 55px;
    font-size: 14px;
  }

  .iconStyle {
    width: 1em;
    height: 1em;
    margin-right: 5px;
    color: #1890ff;
  }

  .treeBoxHeight {
    display: grid;
    overflow: auto;
  }
</style>
