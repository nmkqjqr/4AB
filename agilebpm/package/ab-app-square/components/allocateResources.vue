<template>
  <el-tree-select
    v-model="info.selectedValue"
    :data="info.data"
    multiple
    :render-after-expand="false"
    show-checkbox
    :props="treeProps"
    ref="resTreeRef"
    :check-on-click-node="true"
    :default-expanded-keys="info.expandKeys"
    empty-text="该应用暂无资源，请先添加资源"
    node-key="id"
    :disabled="props.disabled"
    collapse-tags
    collapse-tags-tooltip
    clearable
    :max-collapse-tags="3"
    style="width: 480px"
  />
</template>
<script type="ts" setup>
  import { defineEmits, reactive, ref } from "vue";
  import { allocateResources,getAuthResources } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-authGroup'
  import { ElMessage } from 'element-plus'
  import { abT } from '@/i18n'

  const props = defineProps({
    authGroup:{type:Object,required:true},
    saveData:{type:Boolean,default:true},
    projectId:{required:true,type:String},
    disabled:{type:Boolean,default:true}
  })

  const {authGroup} = toRefs(props)


  const treeProps = {
    children: 'children',
    label: 'name',
  }


  const resTreeRef = ref()

  const info = reactive({
    data: [],
    dialogVisible:false,
    selectedValue: [],
    setData(data) {
      info.data = data;
      // 选中数据项
      setTimeout(() => info.setCheckedKeys(), 0)
    }
    ,
    expandKeys: computed(() => {
      const defaultExpanded = []
      info.data.forEach((item) => {
        defaultExpanded.push(item['id'])
      })
      return defaultExpanded
    }),
    setCheckedKeys() {
      if (info.data && info.data.length>0) {
        const items = [...info.data];
        while (items && items.length > 0) {
          const item = items.shift();
          if (item.checked) {
            resTreeRef.value.setChecked(item.id, true, false);
          }
          if (item.children) {
            items.push(...item.children);
          }
        }
        info.selectedValue = resTreeRef.value.getCheckedKeys();
      }
    }
  });


  // 保存进度条
  const saveLoading = ref(false);


  const refreshTree = () => {
    getAuthResources(props.authGroup.id,props.projectId)
      .then(res => {
        info.setData(res.data);
        if(authGroup.value.resourceIds && authGroup.value.resourceIds.length > 0){
          info.data.forEach(item=>{
          setChecked(item)
          })
        }
      });
  };

  const setChecked = (data) => {
    if(authGroup.value.resourceIds.includes(data.id)){
      data.checked = true
    }
    if(data.children && data.children.length > 0){
      data.children.forEach(item=>{
        setChecked(item)
      })
    }
  }

  onMounted(() => {
    if(props.projectId){
      refreshTree()
    }
  });

  watch(()=>info.selectedValue.length, (newValue) => {

    const resultIds = []
    resultIds.push(...info.selectedValue)

    const items = [...info.data];
    while (items && items.length > 0) {
      const item = items.shift();

      if (resultIds.indexOf(item.id) != -1 && item.parentId != '0') {
        resultIds.push(item.parentId);
      }
      if (item.children) {
        items.push(...item.children);
      }
    }

    authGroup.value.resourceIds = resultIds

  });
</script>
<style lang="scss" scoped>
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
