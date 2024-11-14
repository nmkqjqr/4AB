<template>
  <el-dialog v-model="dialogVisible" title="选择数据" width="40%">
    <el-tree
      ref="resTreeRef"
      :check-on-click-node="true"
      :data="resTree.data"
      :default-expand-all="true"
      empty-text="暂无数据"
      node-key="parentCodeName"
      show-checkbox
      style="height: 500px; overflow: auto"
    >
      <template #default="{ data }">
        <span class="custom-tree-node">
          <span>
            {{ data.comment }}
          </span>
        </span>
      </template>
    </el-tree>
    <template #footer>
      <span class="dialog-footer">
        <el-space wrap>
          <el-button text type="primary" @click="dialogVisible = false">
            取消
          </el-button>
          <el-button :loading="saveLoading" type="primary" @click="saveRoleRes">
            保存
          </el-button>
        </el-space>
      </span>
    </template>
  </el-dialog>
</template>
<script type="ts" setup>
  import { defineEmits, reactive, ref, inject } from "vue";
  import { bizApi, postData,abTools } from '~/agilebpm'
  import { ElMessage } from 'element-plus'
  // 通过inject注入爷爷组件提供的方法
  const addAliases = inject('addAliases');
  const parseSqlFn = inject('parseSqlFn');
  const props = defineProps({
    modelValue: { required: true, type: Boolean, default: false },
    boCode: { required: true, type: String },
    code: { required: true, type: String },
    dataObj: { required: true, type: Object }
  });

  const { proxy } = abTools.useCurrentInstance()

  const emits = defineEmits(["update:modelValue"]);

  const dialogVisible = useVModel(props, "modelValue", emits);

  const resTreeRef = ref()

  const { boCode,code,dataObj} = toRefs(props);

  const resTree = reactive({
    data: [],
    setData(data) {
      // 合并cloumns和children
      const treeData = handleData(data)
      if(treeData && treeData.length > 0){
        treeData[0].parentCodeName = treeData[0].name
      }
      // 重新拼装一个树形数据
      resTree.data = addParentCode(transformTree(treeData));
      // 选中数据项
      setTimeout(() => resTree.setCheckedKeys(), 0)
    },
    expandKeys: computed(() => {
      const defaultExpanded = []
      resTree.data.forEach((item) => {
        defaultExpanded.push(item['name'])
      })
      return defaultExpanded
    }),
    setCheckedKeys() {
      if (resTree.data && resTree.data) {
        const items = [...resTree.data];
        if(dataObj.value.extendConf && dataObj.value.extendConf.length > 0 && JSON.parse(dataObj.value.extendConf).subTableCheckList){
        while (items && items.length > 0) {
            const item = items.shift();
            if(JSON.parse(dataObj.value.extendConf).subTableCheckList.some(obj => obj.parentCodeName === item.parentCodeName)){
              item.checked = true
            }
            if (item.checked) {
              resTreeRef.value.setChecked(item.parentCodeName, true, false);
            }
            if (item.children) {
              items.push(...item.children);
            }
          }
        }
      }
    }
  });

  const handleData = (data) => {
    let a
    if(data instanceof Array){
      data.forEach((item) => {
        item.comment = item.table ? item.table.comment : item.comment
        item.name = item.table ? item.table.name : item.name
        item.code = item.table ? item.table.code : item.code
        if(!item.table){
          return
        }
        item.table.columns = item.children && item.children.length > 0 ? item.table.columns.concat(item.children) : item.table.columns
        if(item.table.columns.length > 0){
          handleData(item.table.columns)
        }
      })
    }else{
      data.comment = data.table ? data.table.comment : data.comment
      data.name = data.table ? data.table.name : data.name
      data.code = data.table ? data.table.code : data.code
      if(!data.table){
        return
      }
      data.table.columns = data.children && data.children.length > 0 ? data.table.columns.concat(data.children) : data.table.columns
      if(data.table.columns.length > 0){
        handleData(data.table.columns)
      }
    }

    if(data instanceof Array){
      a = data
    }else{
      a = [data]
    }

    return a
  }

  const transformTree = (treeArray) => {
    // 定义一个递归函数来遍历树形数组
    function transformNode(node) {
      // 只保留id和name字段
      const newNode = { comment: node.comment, name: node.name, code:node.code, fks:node.fks,parentCodeName:node.parentCodeName};
      // 如果当前节点有子节点，递归调用transformNode并赋值给newNode的children
      if (node.table && node.table.columns && node.table.columns.length > 0) {
        newNode.children = node.table.columns.map(transformNode);
      }
      return newNode;
    }

    // 遍历原始数组，对每个节点调用transformNode
    return treeArray.map(transformNode);
  }

  const addParentCode = (data) => {
    // 遍历当前层级的所有对象
    data.forEach(item => {
      // 如果当前对象有children属性，则递归调用该函数
      if (item.children) {
        // 在递归之前，将当前对象的code赋值给每个子对象的parentCode
        item.children.forEach(child => {
          child.parentCode = item.code;
          child.parentCodeName = child.parentCode + child.name
        });
        // 递归处理子对象
        addParentCode(item.children);
      }else{
        item.parentCodeName = item.parentCode + item.name
      }
    });
    return data
  }

  // 保存进度条
  const saveLoading = ref(false);

  /**
   * 刷新角色资源树
   */
  const refreshRoleResTree = () => {
    // 获取资源角色树
    bizApi.bizObject.getBizObject(boCode.value).then(({ data }) => {
      if(data.rel.children && data.rel.children.length > 0){
        data.rel.table.columns = []
        resTree.setData(data.rel);
      }
    })
  };

  watch(dialogVisible, (newValue) => {
    if (newValue) {
      resTree.setData([])
      refreshRoleResTree();
    }
  });

  const findDataByNames = (data, names) => {
    let results = []; // 用于存储所有匹配的结果
    // 定义递归函数来深度搜索数组
    function search(items) {
      for (const item of items) {
        // 如果当前项的code在codes数组中
        if (names.includes(item.parentCodeName)) {
          // 将匹配的数据添加到结果数组中
          results.push(item);
        }
        // 如果当前项有children属性，递归搜索子项
        if (item.children) {
          search(item.children);
        }
      }
    }
    // 从数组的第一层开始搜索
    search(data);
    // 返回所有找到的结果
    return results;
  }

  /**
   * 保存角色资源
   */
  const saveRoleRes = () => {
    let resIds = resTreeRef.value.getCheckedNodes()
    // if(!resIds || resIds.length <= 0){
    //   dialogVisible.value = false
    //   return
    // }
    const halfResIds = resTreeRef.value.getHalfCheckedKeys()
    if(halfResIds && halfResIds.length > 0){
      resIds = resIds.concat(findDataByNames(resTree.data,halfResIds));
    }
    postData(bizApi.custGrid.tableJoinUrl, {
      boCode: boCode.value,
      code: proxy.$route.query.code ? code.value : '',
      tableInfoList:resIds
    }).then((resp) => {
      if(resp.isOk){
        // 把已选中的子表字段保存到扩展字段里面 方便回显
        if(typeof dataObj.value.extendConf == 'string'){
          dataObj.value.extendConf = JSON.parse(dataObj.value.extendConf)
          dataObj.value.extendConf.subTableCheckList = resIds
          dataObj.value.extendConf = JSON.stringify(dataObj.value.extendConf)
        }
        ElMessage({
          showClose: true,
          message: "子表添加成功",
          type: "success"
        });
        dialogVisible.value = false
        if(dataObj.value.designType === 'simple'){
          if (addAliases) {
            addAliases(resp.data); // 简单模式 调用爷爷组件的方法，并传递参数
          }
        }else{
          if (parseSqlFn) {
            parseSqlFn(resp.data); // 高级模式 调用爷爷组件的方法，并传递参数
          }
        }
      }
    })
  };
</script>
<style lang="scss" scoped>
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
