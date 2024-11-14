<template>
  <div>
    <div class="p1" v-if="state.data.id && !props.isVisit">
      <span>{{state.data.name}}</span>
      <el-button type="primary" class="btn" @click="editForm">{{state.data.type == "appList" ? "编辑应用列表" : state.data.type == "process" ? "编辑流程" : state.data.type == "groupApp" ? "编辑组联式表单" : state.data.type == "professionalProcess" ? "编辑专业流程" : "编辑表单"}}</el-button>
    </div>
    <div class="viewBox">
      <div class="appViewBox" v-if="state.showView">
        <viewPage ref="appViewRef" v-if="state.data.type == 'appList'"/>
        <FormCombinationPreview
          v-if="state.layoutData && state.data.type == 'groupApp'"
          :design-code="state.layoutData.code"
          :design-json="state.layoutData.designJson"
          :params="state.layoutData.varibales"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { appsquareApi,getData } from '@agilebpm/api'
import { getResourceUrl } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-resource'
import { abTools ,viewPage} from '~/agilebpm'
import { abFormCombinationPreview as FormCombinationPreview } from '~/agilebpm/build/combinationApp.js'
const { proxy } = abTools.useCurrentInstance()
const props = defineProps({
  isVisit:{
    type: Boolean,
    default: false,
  }
})

const state = reactive({
  data:{} as any,
  appData:{} as any,
  showView:true,
  layoutData:{} as any,
})

const appViewRef = ref(null)

const getDetails = () => {
  getData(getResourceUrl + proxy.$route.params.id)
  .then(
    ({ data }) => {
      if(data){
        state.data = data
        // 如果是组联表单
        state.showView = false
        if(state.data.type == "groupApp"){
          if(!state.data.formCombinationId){
            return false
          }
          // 如果已经保存并且有custGridId才允许去点击预览
         appsquareApi.thirdParty.getBizFormCombinationDesignThirdParty(state.data.id).then((result:any) => {
          if(result && result.data){
            state.showView = true
            state.layoutData = result.data
          }
         })
        }
      }
    },
    () => {}
  )
  .catch(() => {
  })
}

const getVo = (node:any) => {
  state.data = node
  state.showView = false
  console.log('state.data',state.data)
  // 如果是应用列表
  if(state.data.type == "appList"){
    if(!state.data.custGridId){
      return false
    }
    // 如果已经保存并且有custGridId才允许去点击预览
    appsquareApi.thirdParty.bizCustGridgetVoThirdParty(node.id).then((resp:any) => {
      if(resp.data){
        state.showView = true
        state.appData = resp.data
        appViewRef.value.setInitData(resp.data)
      }
    })
  }
  // 如果是组联表单
  if(state.data.type == "groupApp"){
    if(!state.data.formCombinationId){
      return false
    }
    // 如果已经保存并且有custGridId才允许去点击预览
    appsquareApi.thirdParty.getBizFormCombinationDesignThirdParty(node.id).then((resp:any) => {
      if(resp.data){
        state.showView = true
        state.layoutData = resp.data
      }
    })
  }
  // 如果是组联表单
  if(state.data.type == "professionalProcess"){
    if(!state.data.flowId){
      return false
    }
    // 如果已经保存并且有custGridId才允许去点击预览
    // appsquareApi.thirdParty.getBizFormCombinationDesignThirdParty(node.id).then((resp:any) => {
    //   if(resp.data){
    //     state.showView = true
    //     state.layoutData = resp.data
    //   }
    // })
  }
  // appsquareApi.thirdParty.getDesignThirdParty(node.id).then((resp:any) => {
  //   // this.getDesignFn(resp)
  // })
}

const editForm = () => {
  let str = ''
  if(state.data.formDesignId){
    str = '/' + state.data.formDesignId
  }
  if(state.data.type == "appList"){
    if(state.data.custGridId){
      str += '/' + state.data.custGridId
    }
    window.open(proxy.$router.resolve('/createForm/app/' + state.data.projectId + '/' + state.data.type + '/' + state.data.id + str + '?mode=diyBo' ).href, '_blank');
  }
  if(state.data.type == "process"){
    if(state.data.flowId){
      str += '/' + state.data.flowId
    }
    window.open(proxy.$router.resolve('/createProcess/app/' + state.data.projectId + '/' + state.data.type + '/' + state.data.id + str + '?mode=diyBo' ).href, '_blank');
  }
  if(state.data.type == "groupApp"){
    if(state.data.formCombinationId){
      str += '/' + state.data.formCombinationId
    }
    window.open(proxy.$router.resolve('/createLayout/app/' + state.data.projectId + '/' + state.data.type + '/' + state.data.id + str).href, '_blank');
  }
  if(state.data.type == "professionalProcess"){
    if(state.data.flowId){
      str += '/' + state.data.flowId
    }
    window.open(proxy.$router.resolve('/createForm/app/' + state.data.projectId + '/' + state.data.type + '/' + state.data.id + str + '?mode=diyBo').href, '_blank');
  }
}

onMounted(() => {
  if(proxy.$route.params.id){
    getDetails()
  }
})


defineExpose({
  getVo
})


</script>
<style lang="scss" scoped>
.p1{
  padding:12px 20px;
  overflow: hidden;
  line-height: 32px;
  background: #fff;
  border-top:1px solid #f7f7f7;
  border-bottom:1px solid #f7f7f7;
  border-left:1px solid #f1f1f1;
  span{
    float: left;
    margin-right:12px;
    font-size:16px;
  }
  .btn{
    float: right;
  }
}
.viewBox{
  padding:20px;
  .appViewBox{
    background: #fff;
  }
}
</style>
