<template>
  <div
    class="ivu-avatar-list"
    :class="'ivu-avatar-list-' + props.size">
    <div
      class="ivu-avatar-list-item"
      v-for="(item, index) in info.dataList"
      :key="index"
    >
      <div  v-if="props.tooltip">
      <el-tooltip
        :placement="props.placement"
        :effect="props.dark"
        :content="item.fullname"
      >
        <el-avatar
          v-if="item.photo"
          :src="sysApi.sysFile.getViewFileUrl(item.photo)"
          :size="props.size"
          :shape="props.shape"
        />
        <el-avatar
          v-if="item.fullname && !item.photo && item.type ==='user'"
          :size="props.size"
          :shape="props.shape"
        >
          {{ item.fullname.slice(-2) }}
        </el-avatar>
        <el-avatar
          v-if="item.fullname && !item.photo && item.type !=='user'"
          :size="props.size"
          shape="square"
        >
          {{ item.fullname.slice(-2) }}
        </el-avatar>
      </el-tooltip>
    </div>
      <div v-else>
        <el-avatar
          v-if="item.photo"
          :src="sysApi.sysFile.getViewFileUrl(item.photo)"
          :size="props.size"
          :shape="props.shape"
        />
        <el-avatar
          v-if="item.fullname && !item.photo && item.type ==='user'"
          :size="props.size"
          :shape="props.shape"
        >
          {{ item.fullname.slice(-2) }}
        </el-avatar>
        <el-avatar
          v-if="item.fullname && !item.photo && item.type !=='user'"
          :size="props.size"
          shape="square"
        >
          {{ item.fullname.slice(-2) }}
        </el-avatar>
      </div>
    </div>

    <div
      class="ivu-avatar-list-item ivu-avatar-list-item-excess"
      v-if="info.userInfoList.length>props.max"
    >
      <el-avatar
        :size="props.size"
        :shape="props.shape"
      >
        {{ info.outSize }}
      </el-avatar>
    </div>

  </div>
</template>

<script lang="ts">
export default {
  name: "index"
}
</script>
<script lang="ts" setup>
import {getData, registerApi, sysApi} from '~/agilebpm'
import { reactive } from 'vue'

const props = defineProps({
  data:{
    type: String,
    default: '',
    required: true,
  },

  //'dark' | 'light'
  effect:{
    type: String,
    default: 'light',
    required: false,
  },

  //'large' | 'default' | 'small'
  size: {
    type: String,
    default: 'default',
    required: false,
  },

  max: {
    type: Number,
    default: 5,
    required: false,
  },

  tooltip: {
    type: Boolean,
    default: true
  },

  //  ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']
  placement: {
    default: 'top',
    required: true,
  },
  //'circle' | 'square'
  shape:{
    type: String,
    default: 'circle',
    required: false,
  }
})

const info: any = reactive({
  userInfo: '',
  currentList:[],
  userInfoList:[],
  dataList:[],
  outSize: '',
  ids: [],
})

onMounted(() => {
  if (props.data){
    info.userInfo = props.data
    getUserList()
  }
})


const getUserList =() => {

  info.dataList=[]
  info.ids= []
  info.userInfoList = info.userInfo.split(',')
  const len = info.userInfoList.length;
  const max = props.max;
  if (len <= max) {
    info.currentList = info.userInfoList;
  } else {
    info.currentList = info.userInfoList.slice(0, max);
    info.outSize = '+' + (len-max)
  }

  info.currentList.forEach((item: any) => {
    const identity : any  = {}
    const user =  item.split('/')
    identity.type = user[0]
    identity.fullname = user[1]
    identity.id = user[2]
    if (identity.type === 'user') {
      info.ids.push(identity.id)
    }
    info.dataList.push(identity)
  })

  if (info.ids.length > 0) {
    getData(registerApi.getUserAvatar + info.ids.join(','))
      .then((data) => {
       if (data.data.length > 0){
         info.dataList.forEach((current: any) => {
            data.data.forEach((user: any) => {
              if (current.id === user.id && user.photo){
               current.photo = user.photo
              }
            })
         })
       }
    })
  }

}


</script>
<style lang="scss" scoped>
.ivu-avatar-list{
  overflow: hidden;
  .item {
    display: inline-block;
    margin-left: -8px;
    cursor: pointer;

    &:first-child{
      margin-left: 0;
    }

    .ivu-avatar {
      border: 1px solid #fff;
    }

    .excess {
      cursor: auto;
    }
  }

  .ivu-avatar-list-item {
    margin-left: -12px;
    float: left;

    &:first-child{
      margin-left: 0;
    }
  }

  .ivu-avatar-list-item-excess {
    font-size: 18px;
  }

  .default {
    .ivu-avatar-list-item {
      margin-left: -12px;

      &:first-child{
        margin-left: 0;
      }
    }
  }
}

</style>
