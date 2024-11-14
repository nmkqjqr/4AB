<template>
  <div class="common-layout">
   <el-container>
     <el-header>
       <div class="headerLeft">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/' }">
            <div class="appName">
              <svg-icon :icon="state.projectData.icon" style="width: 34px" />
              <span>{{state.projectData.name}}</span>
            </div>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="state.resourceData && state.resourceData.name">
            <div class="appName" style="height:40px;">
              <span style="margin-left:0;">{{state.resourceData.name}}</span>
            </div>
          </el-breadcrumb-item>
        </el-breadcrumb>
       </div>
       <div class="headerCenter">
        <el-tabs v-model="state.activeName" class="header-tabs" type="card" :before-leave="beforeLeave" @tab-click="handleClick">
          <template v-if="state.resourceType == 'processReport'">
            <el-tab-pane name="appDesign">
              <template #label>
                <!-- <span class="order-num">1</span> -->
                <span>应用设计</span>
              </template>
            </el-tab-pane>
          </template>
          <template v-else>
            <el-tab-pane name="avueForm">
              <template #label>
                <span class="order-num">1</span>
                <span>表单设计</span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="appDesign" v-if="state.resourceType == 'appList'">
              <template #label>
                <span class="order-num">2</span>
                <span>应用设计</span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="processDesign" v-if="state.resourceType == 'professionalProcess'">
              <template #label>
                <span class="order-num">2</span>
                <span>流程设计</span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="processExtend" v-if="state.resourceType == 'professionalProcess'">
              <template #label>
                <span class="order-num">3</span>
                <span>流程扩展</span>
              </template>
            </el-tab-pane>
          </template>
        </el-tabs>
       </div>
       <div class="headerRight" v-if="state.activeName == 'avueForm'">
          <el-button @click="previewForm">预览</el-button>
          <el-button type="primary" :loading="state.saveLoading" @click="saveAvueForm">保存</el-button>
       </div>
       <div class="headerRight" v-if="state.activeName == 'appDesign'">
          <el-button type="primary" :loading="state.saveLoading" @click="saveAppDesign">保存</el-button>
       </div>
       <div class="headerRight" v-if="state.activeName == 'processDesign'">
          <el-button type="primary" :loading="state.saveLoading" @click="saveProcessDesign">保存</el-button>
          <el-button type="success" :loading="state.saveLoadingIsPublish" @click="publishDesignInfo">发布新版本</el-button>
       </div>
       <div class="headerRight" v-if="state.activeName == 'processExtend'">
          <el-button type="primary" :loading="state.saveLoading" @click="saveAppDesign">保存2</el-button>
       </div>
     </el-header>
       <el-main class="padding0">
        <div class="ab-form-design" v-if="state.activeName == 'avueForm'">
          <ab-form-design
            style="height: 100vh"
            @submit="handleSubmit"
          />
          <!-- <avue-form-design
            ref="avueFormDesignRef"
            :is-appsquare-form="true"
            :style="{ height: state.mainHeigth }"
            @app-square-save-avue-form-data="saveAvueFormData"
            @set-default-pc-json="setDefaultPcJson"
          /> -->
        </div>
        <div v-if="state.activeName == 'appDesign'">
          <appDesign ref="appDesignRef" @app-square-app-save="appSquareAppSave" @set-default-cust-grid-data="setDefaultCustGridData" :style="{ height: state.mainHeigth }"/>
        </div>
        <div v-if="state.activeName == 'processDesign'">
          <ab-designer
            ref="abDesignerRef"
            v-if="state.designInfo.show"
            v-model="state.designInfo.show"
            :def-id="state.designInfo.defId"
            @close="closeDefinition()"
            @save-loading-true="saveLoadingTrue"
            @save-loading-false="saveLoadingFalse"
          />
        </div>
        <div v-if="state.activeName == 'processExtend'">
          <process-extend
            ref="processExtendRef"
            :def-id="state.designInfo.defId"
            :def-key="state.designInfo.key"
            @close="closeDefinition()"
            @save-loading-true="saveLoadingTrue"
            @save-loading-false="saveLoadingFalse"
          />
        </div>
       </el-main>
   </el-container>
   <el-drawer
      v-model="state.previewDrawer"
      class="previewDrawer"
      size="95%"
      direction="btt"
    >
      <template #header>
        <h4>页面预览</h4>
      </template>
      <template #default>
        <div class="previewDrawerBox">
          <cust-form
            v-if="state.formData.html"
            ref="abFormRef"
            :form-data="state.formData"
          />
        </div>
      </template>
    </el-drawer>
 </div>
</template>
<script lang="ts" setup>
import { Search,Plus,ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox ,ElNotification} from 'element-plus'
import appDesign from './app-design.vue'
import abDesigner from '~/agilebpm/build/flowDesigner.js'
import { postData,getData } from '~/agilebpm/api/ab-request'
import {
    getProjectUrl,
  } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-project'
import { saveResourceDataUrl,saveResourcesUrl } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-resource'
import { abTools,abUtil } from '~/agilebpm'
import { appsquareApi } from '@agilebpm/api'
import { abForm as custForm } from '~/agilebpm'

const { proxy } = abTools.useCurrentInstance()
const state = reactive({
  appNameStrOrInput:true,
  appName:'测试数据',
  activeName:'avueForm',
  mainHeigth: `${window.innerHeight - 100}px`,
  saveLoading:false,
  saveLoadingIsPublish:false,
  paramsData:{
    projectId:proxy.$route.params.projectId,
    resourceType:'',
    resourceId:proxy.$route.params.resourceId,
    data:{} as any
  },
  resourceType:proxy.$route.params.resourceType,
  designInfo:{
    show: true,
    defId: '',
  },
  saveAvueFormData:{},
  appDesignFormData:{},
  defaultCustGridData:{} as any,
  isConfirm:false,
  previewDrawer:false,
  formData:{} as any,
  projectData:{} as any,
  resourceData:{} as any,
})

const avueFormDesignRef = ref(null)
const appDesignRef = ref(null)
const abDesignerRef = ref(null)
const inputRef = ref(null);
const toggleAppName = () => {
  state.appNameStrOrInput = !state.appNameStrOrInput
  nextTick(() => {
    inputRef.value.focus()
  })
}
const blurAppName = () => {
  state.appNameStrOrInput = !state.appNameStrOrInput
}

const isDeepEqual = (obj1:any, obj2:any, ignoreKeys = []) => {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || obj1 == null ||
      typeof obj2 !== 'object' || obj2 == null) {
    return false;
  }

  const keys1 = Object.keys(obj1).filter(key => !ignoreKeys.includes(key));
  const keys2 = Object.keys(obj2).filter(key => !ignoreKeys.includes(key));

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key], ignoreKeys)) {
      return false;
    }
  }

  return true;
}


const previewForm = () => {
  state.formData.html = ''
  // 调用子组件的方法 setRev
  appsquareApi.thirdParty.getFormDataThirdParty(proxy.$route.params.resourceId).then((resp:any) => {
    if(resp.data){
      state.previewDrawer = true
      let data = resp.data
      const form = data.bizForm
        // 如果是弹框表单
        const formData = {
          html: form.html,
          js: form.js,
          data: data.data,
          tablePermission: data.tablePermission,
          permission: data.permission,
          initData: data.initData,
          boLoadMap: data.boLoadMap,
        }
        state.formData = formData
    }
  })
}

const setDefaultPcJson = (pcJson:any) => {
  // 刚进入就把新的对象存起来 方便对比
  state.saveAvueFormData = abUtil.clone(pcJson)
}

const setDefaultCustGridData = (data:any) => {
  state.defaultCustGridData = abUtil.clone(data)
}

const beforeLeave = async (to:any,from:any) => {
  if(state.activeName == "avueForm"){
    // state.appDesignFormData 老数据 state.saveAvueFormData保存后的数据
    state.appDesignFormData = abUtil.clone(avueFormDesignRef.value.widget.option)
    if(!state.appDesignFormData.column || state.appDesignFormData.column.length <= 0){
      ElMessageBox.alert('请先设计表单', '提示', {
        confirmButtonText: '确定',
        callback: (action: any) => {
        },
      })
      return false
    }
    // false 证明两个对象不一样
    if(!isDeepEqual(state.appDesignFormData,state.saveAvueFormData,['sn','defaultValue','boCode','boName'])){
      ElMessageBox.confirm(
        '你修改了表单设计但没有保存，是否需要保存表单设计并继续?',
        '表单设计有修改，是否保存?',
        {
          confirmButtonText: '保存并继续',
          cancelButtonText: '返回表单设计',
          type: 'warning',
        }
      )
      .then(() => {
        state.isConfirm = true
        saveAvueForm()
      })
      .catch(() => {

      })
      return false
    }
  }

  if (to == 'avueForm' && from == "appDesign") {
    if (!proxy.$route.params.custGridId) {
      try {
        await ElMessageBox.confirm(
          '是否切换到表单设计?',
          '如果没有保存下次将重新关联表单?',
          {
            confirmButtonText: '确认切换',
            cancelButtonText: '返回应用设计',
            type: 'warning',
          }
        );
        state.activeName = "avueForm"; // 用户确认后更新状态
        return true; // 用户确认，允许切换
      } catch (error) {
        return false; // 用户取消，阻止切换
      }
    }else{
      if(state.defaultCustGridData.id && !isDeepEqual(state.defaultCustGridData,appDesignRef.value.getModifyData(),['operationWidth','alias'])){
        ElNotification({
          title: '请先点击右上角进行保存',
          message: '检测到应用设计有修改',
          type: 'warning',
          offset: 100,
        })
        return false
      }
    }
  }
}

const saveAvueForm = () => {
  // 调用AvueForm子组件的保存方法
  avueFormDesignRef.value.createForm()
}

const saveAvueFormData = (json:any,mbJson:any) => {
  state.paramsData.data = {}
  state.paramsData.data.json = json
  state.paramsData.data.mbJson = mbJson
   //saveMethod 生成表单1 单纯保存 0
  state.paramsData.data.saveMethod = 1
  state.paramsData.resourceType = 'form'
  state.saveLoading = true
  postData(saveResourceDataUrl,state.paramsData)
  .then(
    ({ msg,data }) => {
      ElMessage({
        showClose: true,
        message: '保存成功',
        type: 'success',
      })
      if(state.isConfirm){
        state.isConfirm = false

        if(proxy.$route.params.resourceType == 'appList'){
          state.activeName = "appDesign"
          nextTick(() => {
            // 如果不是编辑则去重新关联在线表单
            if(!proxy.$route.params.custGridId){
              appDesignRef.value.setForm(data)
            }
          })
        }
        if(proxy.$route.params.resourceType == 'professionalProcess'){
          state.activeName = "processDesign"
        }
      }

      state.saveLoading = false
      // 调用子组件的方法 setRev
      avueFormDesignRef.value.setRev(data)

      if(!proxy.$route.params.formDesignId){
        proxy.$router.replace({ params: {...proxy.$route.params,...{formDesignId:data.id}},query:{
          mode:'diyBo'
        }});
      }
      // 保存成功后更新saveAvueFormData 保存后的数据 方便与老数据对比
      state.saveAvueFormData = abUtil.clone(avueFormDesignRef.value.widget.option)
    },
    () => {
      state.saveLoading = false
    }
  )
  .catch(() => {
    state.saveLoading = false
  })
}

const saveAppDesign = () => {
  // 调用AppDesign子组件的保存方法
  appDesignRef.value.saveApp()
}

const appSquareAppSave = (data:any) => {
  state.paramsData.data = {}
  state.paramsData.data = data
  state.paramsData.resourceType = 'appList'
  state.saveLoading = true
  postData(saveResourceDataUrl,state.paramsData)
  .then(
    ({ msg,data }) => {
      saveBtnResource(state.paramsData)
      ElMessage({
        showClose: true,
        message: '保存成功',
        type: 'success',
      })
      if(state.isConfirm){
        state.activeName = "avueForm"
        state.isConfirm = false
      }
      state.saveLoading = false
      if(!proxy.$route.params.custGridId){
        proxy.$router.replace({ params: {...proxy.$route.params,...{custGridId:data}},query:{
          mode:'diyBo'
        }});
      }
      // 保存成功后更新saveAvueFormData 保存后的数据 方便与老数据对比
      state.defaultCustGridData = abUtil.clone(appDesignRef.value.getModifyData())
    },
    () => {
      state.saveLoading = false
    }
  )
  .catch(() => {
    state.saveLoading = false
  })
}

// 保存应用列表按钮权限
const saveBtnResource = (data:any) => {
  let sqlButtonVO = data.data.sqlButtonVO
  let btnList = [] as any
  if (sqlButtonVO && sqlButtonVO.length > 0) {
    sqlButtonVO.forEach((item:any, index:any) => {
      let apiList = []
      apiList = getBtnResources(item,data.data)
      if(apiList && apiList.length > 0){
        apiList.forEach((apiListItem:any) => {
          apiListItem.url += apiListItem.url + '?abPid=' + data.projectId
        })
      }
      btnList.push({
        projectId: data.projectId,
        name: item.name,
        linkUrl: item.url.indexOf('remove') > -1 ? '' : item.url,
        type: 'button',
        icon: '',
        path: '0',
        parentId: data.resourceId,
        apiList: apiList,
      })
    })
  }

  postData(saveResourcesUrl,{projectId:data.projectId,resources:btnList})
  .then(
    ({ data }) => {

    })
  .catch(() => {

  })
}

const getBtnResources = (item:any,data:any) => {
    let resources = [] as any
    let isHave = false
    if (item.url && item.url.length > 0) {
      if(item.url.indexOf(`/biz/bizForm/formViewAdd/`) > -1){
        isHave = true
        let lastSlashIndex = item.url.lastIndexOf("/");
        let questionMarkIndex = item.url.indexOf("?");
        let result = item.url.substring(lastSlashIndex + 1, questionMarkIndex);
        resources = [
          {
            url: `/ab-bpm/biz/bizForm/save/${result}_pc`,
            name: '保存接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/save/${result}_mobile`,
            name: '保存接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_pc`,
            name: '详情接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_mobile`,
            name: '详情接口',
          },
        ]
      }
      if (item.url.indexOf(`/biz/bizForm/formViewEdit/`) > -1) {
        isHave = true
        let lastSlashIndex = item.url.lastIndexOf("/");
        let questionMarkIndex = item.url.indexOf("?");
        let result = item.url.substring(lastSlashIndex + 1, questionMarkIndex);
        resources = [
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_pc`,
            name: '详情接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/save/${result}_pc`,
            name: '保存接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_mobile`,
            name: '详情接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/save/${result}_mobile`,
            name: '保存接口',
          },
        ]
      }
      if(item.url.indexOf(`/biz/bizForm/formViewDetail/`) > -1){
        isHave = true
        let lastSlashIndex = item.url.lastIndexOf("/");
        let questionMarkIndex = item.url.indexOf("?");
        let result = item.url.substring(lastSlashIndex + 1, questionMarkIndex);
        resources = [
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_pc`,
            name: '详情接口',
          },
          {
            url: `/ab-bpm/biz/bizForm/get/${result}_mobile`,
            name: '详情接口',
          },
        ]
      }
      if (item.url.indexOf(`/ab-bpm/biz/bizObject/remove/${data.appConfMap.boCode}`) > -1) {
        isHave = true
        resources = [
          {
            url: `/ab-bpm/biz/bizObject/remove/${data.appConfMap.boCode}`,
            name: '删除接口',
          },
        ]
      }
      if(item.url.indexOf(`/ab-bpm/biz/bizObject/remove/`) > -1 && item.url.indexOf(`/ab-bpm/biz/bizObject/remove/${data.appConfMap.boCode}`) == -1){
        isHave = true
        resources = [
          {
            url: item.url.indexOf('?') > -1 ? item.url.split('?')[0] : item.url,
            name: '删除接口',
          },
        ]
      }
      if (item.hrefSetting.openType !== 'drawer' && item.url.indexOf('bizFormCombinationView') > -1) {
        isHave = true
        resources = [
          {
            url:item.url.indexOf('?') > -1 ? item.url.split('?')[0] : item.url,
            name:'组联式表单Url'
          }
        ]
      }
      if(item.url.indexOf(`/bpm/bpm/instanceDetail`) > -1 || item.url.indexOf(`/bpm/bpm/bpmInstanceListDetail/`) > -1){
        isHave = true
        resources = [
          {
            url: '/ab-bpm/bpm/instance/getInstDataByKey/' + data.relatedId,
            name: '实例详情',
          },
        ]
      }
      if (!isHave) {
        resources = [{
          url:item.url.indexOf('?') > -1 ? item.url.split('?')[0] : item.url,
          name:'url地址'
        }]
      }
    }

    if(item.hrefSetting.openType == 'drawer' &&  item.hrefSetting.component == 'FormViewCombination' && item.hrefSetting.combinationCode && item.hrefSetting.combinationCode.length > 0){
        resources = [
          {
            url: `/biz/bizFormCombinationView/${item.hrefSetting.combinationCode}`,
            name: '组联式表单',
          },
        ]
    }

    if(item.hrefSetting.openType && item.hrefSetting.openType == 'eventBtn'){
      resources = [
        {
          url: `/biz/bizCustGrid/view/changeData/${data.code}`,
          name: '事件',
        },
      ]
    }
    return resources
}

// 获取当前应用详情
const getProject = () => {
  getData(getProjectUrl + proxy.$route.params.projectId)
  .then(
    ({ data }) => {
      state.projectData = data
    },
    () => {}
  )
  .catch(() => {})
}

// 获取资源详情
const getResource = () => {
  appsquareApi.thirdParty.bizCustGridgetVoThirdParty(proxy.$route.params.resourceId).then(({ data }) => {
    if(data){
      state.resourceData = data
    }
  })
}

// 保存专业流程设计
const saveProcessDesign = () => {
  abDesignerRef.value.saveDesignInfo(false)
}

// 专业流程设计发布新版本
const publishDesignInfo = () => {
  abDesignerRef.value.saveDesignInfo(true)
}

const saveLoadingTrue = (isPublish:any) => {
  if(isPublish){
    state.saveLoadingIsPublish = true
  }else{
    state.saveLoading = true
  }
}

const saveLoadingFalse = (isPublish:any) => {
  if(isPublish){
    state.saveLoadingIsPublish = false
  }else{
    state.saveLoading = false
  }
}

watch(
  () => state.activeName,
  (newVal) => {
    if(newVal && newVal == 'appDesign'){
      if(proxy.$route.params.formDesignId){
        if(proxy.$route.params.custGridId){

        }
        if(!proxy.$route.params.custGridId){
          // 调用子组件的方法 setRev
          appsquareApi.thirdParty.getDesignThirdParty(proxy.$route.params.resourceId).then((resp:any) => {
            if(resp.data){
              let obj = {
                boCode:resp.data.boCode,
                pcFormCode:resp.data.pcFormCode,
                rev:resp.data.rev
              }
              nextTick(() => {
                appDesignRef.value.setForm(obj)
              })
            }
          })
        }
      }
    }
  }
)

onMounted(() => {
  if(proxy.$route.params.custGridId){
    if(proxy.$route.params.resourceType == "appList"){
       state.activeName = "appDesign"
    }
    if(proxy.$route.params.resourceType == "professionalProcess"){
       state.activeName = "processDesign"
    }
  }
  if(proxy.$route.params.resourceType == "processReport"){
      state.activeName = "appDesign"
  }
  if(proxy.$route.params.projectId){
    getProject()
  }
  if(proxy.$route.params.resourceId){
    getResource()
  }
})

</script>
<style lang="scss" scoped>
.common-layout, .el-container {
   height: 100%;
 }
 .common-layout{
   .el-header{
     display: flex;
     align-items: center;
     justify-content: start;
     background: #fff;
     border-bottom: 1px solid #f6f8f9;
     .headerLeft{
      display: flex;
      align-items: center;
      justify-content: start;
      width:33%;
      .tag{
        margin-left:10px;
      }
     }
     .appName{
      display: flex;
      align-items: center;
      justify-content: start;
      cursor: pointer;
      p{
        margin:0;
      }
      span{
        margin-left:10px;
      }
     }
     :deep(.headerCenter){
      display: flex;
      align-items: center;
      justify-content: center;
      width:33%;
      .el-tabs{
        --el-tabs-header-height:57px !important;
        .el-tabs__header{
          margin:0 !important;
        }
      }
     }
     .headerRight{
      display: flex;
      align-items: center;
      justify-content: right;
      width:34%;
     }
   }
   .el-container{
     .el-aside{
       padding:20px;
       background: #fff;
     }
   }
   :deep(.previewDrawer) {
    border-radius: 8px 8px 0 0;
    .el-drawer__header {
      padding: 0;
      padding: 0 16px;
      margin-bottom: 0;
      h4 {
        margin: 16px 0;
        font-size: 18px;
        color: #171a1d;
      }
    }
    .el-drawer__body {
      background: #f1f2f3;
    }
    .previewDrawerBox{
      max-width: 1180px;
      padding: 24px;
      margin: 16px;
      margin-right: auto !important;
      margin-left: auto !important;
      background: #fff;
    }
  }
 }
 .order-num {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    line-height: 18px;
    text-align: center;
    border: 1px solid #303133;
    border-radius: 50%;
}
.el-tabs__item.is-active .order-num {
    border-color: #1890ff;
}
:deep(.header-tabs){
  .el-tabs__item:hover {
    color: inherit !important; /* 保持文字颜色不变，或者设置为你想要的颜色 */
  }
  .el-tabs__header{
    border: 0;
    .is-active{
      // background: #f8f8f8;
    }
  }
  >.el-tabs__header .el-tabs__nav,.el-tabs__item{
    border:0 !important;
  }
}
.padding0{
  padding:0;
}

</style>
