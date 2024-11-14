<template>
  <div class="squareBox" >
    <div class="squareBoxContent">
      <el-card class="daibanBox" shadow="hover">
        <el-row :gutter="60" class="rows">
          <el-col :span="6" class="cols">
            <div class="colsDiv">
              <img src="@/assets/home_images/daiban.png" />
              <div>
                <p>105</p>
                <p>统一待办</p>
              </div>
            </div>
          </el-col>
          <el-col :span="6" class="cols">
            <div class="colsDiv">
              <img src="@/assets/home_images/faqi.png" />
              <div>
                <p>105</p>
                <p>待办数量</p>
              </div>
            </div>
          </el-col>
          <el-col :span="6" class="cols">
            <div class="colsDiv">
              <img src="@/assets/home_images/bohui.png" />
              <div>
                <p>105</p>
                <p>发起数量</p>
              </div>
            </div>
          </el-col>
          <el-col :span="6" class="cols">
            <div class="colsDiv">
              <img src="@/assets/home_images/yiban.png" />
              <div>
                <p>105</p>
                <p>已办数量</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="collectionBox" shadow="hover">
        <template #header>
          <div class="card-header">
            <h5><span>我的收藏</span><img src="@/assets/app_square_images/collicon.png"/></h5>
          </div>
        </template>
        <div class="collectionList" v-if="state.collectionListShow">
          <p class="item" v-for="(item,index) in state.collectionList" :key="index">
            <svg-icon
              :icon="item.icon"
              style="width: 50px;"
            />
            <span>{{item.name}}</span>
            <img src="@/assets/app_square_images/coll.png" @click="delColl(item,index)" alt="" class="collimg">
          </p>
        </div>
        <div v-else>
          <p>暂无收藏</p>
        </div>
      </el-card>
      <el-card class="appBox" shadow="hover">
        <template #header>
          <div class="card-header">
            <h5><span>我的应用</span><img src="@/assets/app_square_images/appicon.png"/></h5>
            <p><el-input
              v-model="input2"
              style="width: 200px;margin-right:12px;"
              placeholder="请输入名称搜索"
              :prefix-icon="Search"
              @input="nameSearch"
              clearable
            />
            <el-button type="primary" :icon="Plus" size="small" round @click="openCreateApp">创建应用</el-button>
          </p>
          </div>
        </template>
        <div class="appList" v-if="state.appListShow" v-loading="state.listLoading" element-loading-text="加载中...">
          <div class="item" v-for="(item,index) in state.appList" :key="index" @click.stop="toVisitPage(item)">
            <img src="@/assets/app_square_images/add.png" @click.stop="add(item,index)" alt="" class="add">
            <p>
              <svg-icon
                :icon="item.icon"
                style="width: 50px;"
              />
            </p>
            <p>
              <span style="font-size:16px">{{item.name}}</span>
            </p>
            <P style="text-align:right;">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <el-button type="primary" text :icon="MoreFilled" class="more"/>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="item.authCode && item.authCode == 'dev'" @click="editApp(item)">应用设置</el-dropdown-item>
                    <el-dropdown-item v-if="item.canDelete" divided @click="removeFn(item)">删除应用</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </P>
          </div>
        </div>
        <div v-else>
          <p>暂无应用</p>
        </div>
      </el-card>
    </div>
  </div>
  <el-dialog
    v-model="state.dialogVisible"
    title="创建应用"
    width="500"
    class="dialogCard"
  >
  <el-row :gutter="20">
    <el-col :span="10">
      <el-card class="card" shadow="hover" @click="toCreateForm">
        <div class="vertCenter pointer">
          <img src="../../assets/app_square_images/add1.png" style="width:32px;margin-right:8px;" alt="" srcset="">
          <p>创建空白应用</p>
        </div>
      </el-card>
    </el-col>
  </el-row>
  </el-dialog>
</template>
<script lang="ts" setup>
import { Search,Plus,MoreFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { abUtil,abTools } from '~/agilebpm'
import { postData,getData } from '~/agilebpm/api/ab-request'
import { saveProjectUrl,myProjectUrl,removeProjectUrl } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-project'
const { proxy } = abTools.useCurrentInstance()
const state = reactive({
  collectionList:[],
  collectionListShow:true,
  query: {
    pageSize: 999,
    currentPage: 1,
    queryParam: {} as any,
  },
  listLoading:false,
  appList:[],
  appListShow:true,
  dialogVisible:false,

})

if(state.collectionList.length <= 0){
  state.collectionListShow = false
}
if(state.appList.length <= 0){
  state.appListShow = false
}

const getmyProject = () => {
  state.listLoading = true
  postData(myProjectUrl,state.query)
  .then(
    ({ data }) => {
      state.listLoading = false
      if(data.rows && data.rows.length > 0){
        state.appList = data.rows
        state.appListShow = true
      }else{
        state.appList = []
      }
      if(state.appList.length <= 0){
        state.appListShow = false
      }
    },
    () => {}
  )
  .catch(() => {
    state.listLoading = false
  })
}

onMounted(() => {
  getmyProject()
})

const nameSearch = (value:any) => {
  state.query.queryParam['project.name$VLK'] = value
  getmyProject()
}


const add = (item:any,index:any) => {
  state.collectionList.push(abUtil.clone(item))
  abUtil.Arrays.del(index,state.appList)
  if(!state.collectionListShow){
    state.collectionListShow = true
  }
  if(state.appList.length <= 0){
    state.appListShow = false
  }
}
const delColl = (item:any,index:any) => {
  state.appList.push(abUtil.clone(item))
  abUtil.Arrays.del(index,state.collectionList)
  if(state.collectionList.length <= 0){
    state.collectionListShow = false
  }
  if(!state.appListShow){
    state.appListShow = true
  }
}

const removeFn = (node:any) => {
  ElMessageBox.confirm(
    '确定删除"'+ node.name +'"这条应用吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      getData(removeProjectUrl+node.id)
      .then(
        ({ data }) => {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          getmyProject()
        },
        () => {}
      )
      .catch(() => {
      })
    })
    .catch(() => {
    })
}

const openCreateApp = () => {
  postData(saveProjectUrl)
  .then(
    ({ msg,data }) => {
      ElMessage({
        showClose: true,
        message: msg,
        type: 'success',
      })
      proxy.$router.push({path: '/createAppSquare/app/'+data})
    },
    () => {}
  )
  .catch(() => {
  })
  // state.dialogVisible = true
}
const toCreateForm = () => {
  postData(saveProjectUrl)
  .then(
    ({ msg,data }) => {
      ElMessage({
        showClose: true,
        message: msg,
        type: 'success',
      })
      proxy.$router.push({path: '/createAppSquare/app/'+data})
    },
    () => {}
  )
  .catch(() => {
  })
}

const editApp = (item:any) => {
  proxy.$router.push({path: '/createAppSquare/app/'+item.id})
}

const toVisitPage = (item:any) => {
  proxy.$router.push({path: '/visitPage/'+item.id})
}

</script>
<style lang="scss" scoped>
.squareBox{
  height:100%;
  overflow: auto;
  .squareBoxContent{
    width:80%;
    min-width: 1000px;
    max-width: 1600px;
    margin:1% auto;
  :deep(.daibanBox){
    border:0;
    .el-card__body{
      padding:0 !important;
    }
  }
  .rows{
    padding: 20px 10px;
    margin-right: 0 !important;
    margin-left: 0 !important;
    background: #fff;
    .cols{
      .colsDiv{
        display: flex;
        align-items: center;
        justify-content: center;
        padding:30px;
        color:#fff;
        text-align: center;
        cursor: pointer;
        border-radius: 10px;
        div{
          margin-left:12px;
          p{
            margin:0;
          }
          p:nth-child(1){
            font-size: 24px;
            font-weight: 700;
          }
        }
      }
    }
    .cols:nth-child(1){
      div{
         background: #4398f0;
      }
    }
    .cols:nth-child(2){
      div{
         background: #8870b4;
      }
    }
    .cols:nth-child(3){
      div{
         background: #8fc99a;
      }
    }
    .cols:nth-child(4){
      div{
         background: #f4a074;
      }
    }
  }
  .collectionBox{
    margin-top:20px;
    background: #fff;
    border: 0;
    h5{
      margin:0;
      overflow: hidden;
      font-size:15px;
      span{
        float: left;
      }
      img{
        width:16px;
        margin-left:10px;
      }
    }
    .collectionList{
        display: flex;
        justify-content: start;
        .item{
          display: flex;
          align-items: center;
          justify-content: center;
          padding:4px;
          margin-right: 10px;
          cursor: pointer;
          img{
            margin-right:10px
          }
          .collimg{
            width:16px;
            margin-left:10px;
            opacity: 0;
          }
        }
        .item:hover{
          padding:4px;
          background: rgb(240, 239, 239);
          border-radius: 4px;
          .collimg{
            display: block;
            width:16px;
            margin-left:10px;
            opacity: 1;
          }
        }
    }
  }
  .appBox{
    margin-top:20px;
    background: #fff;
    border: 0;
    .card-header{
      overflow: hidden;
      h5{
        float: left;
        margin:0;
        overflow: hidden;
        font-size:15px;
        span{
          float: left;
        }
        img{
          width:16px;
          margin-left:10px;
        }
      }
      p{
        float: right;
        margin:0;
      }
    }
    .appList{
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        .item{
          position: relative;
          width:18%;
          padding:8px;
          margin:1%;
          text-align: center;
          cursor: pointer;
          border:1px solid #f1f2f3;
          .add{
            position: absolute;
            top:2px;
            right:2px;
            display: none;
            width:24px;
          }
          :deep(.more){
            .el-icon{
              font-size:16px;
            }
          }
        }
        .item:hover{
          border:1px solid #0089ff;
          border-radius: 4px;
          .add{
            display: block;
          }
        }
    }
  }
  }
}

</style>
