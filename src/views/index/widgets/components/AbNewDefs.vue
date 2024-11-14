<template>
  <el-card class="heightpx" shadow="hover">
    <template #header>
      <span class="fontweight">最新应用</span>
    </template>
    <div class="box">
      <el-row :gutter="24">
        <el-col
          v-for="(item, index) in info.fastMenu"
          :key="index"
          class="textcenter"
          :span="8"
          style="position: relative"
        >
          <router-link :to="'/bpm/flowStart/'+item.resourceUrl">
            <svg-icon
              class-name="imag"
              :icon="item.icon || 'adjustment'"
              style="width: 40px; height: 40px"
            />
            <p class="p">{{ item.resourceName }}</p>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </el-card>

</template>

<script lang="ts" setup>
  import {bpmApi} from '~/agilebpm'

  const info = reactive({
    fastList: [] as any,
    fastMenu: [] as any,
  })

  onMounted(async () => {

    //获取个人流程列表
    await bpmApi.myTask.bpmMydefinitionListUrl({}).then(
      (data) => (
        info.fastList=sortedItems(data.data)
      )
    )

    if (info.fastList.length>12){
      info.fastList=info.fastList.slice(0,12)
    }

    if (info.fastList.length>0){

      info.fastList.forEach((item: any) => {
        let def={};
        if (item){
          def.icon=item.iconStyle
          def.resourceName=item.name
          def.resourceUrl=item.key
        }
        info.fastMenu.push(def)
      })
    }


  })

 const  sortedItems= (list:any)=> {
    return list.sort((a:any, b:any) => a.createTime > b.createTime ? -1 : 1 );
  }


</script>

<style scoped>
  .box {
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .heightpx {
    height: 500px;
    overflow-x: scroll !important;
  }

  .fontweight {
    font-size: 20px;
    font-weight: bolder;
  }

  .p {
    margin-top: 20px;
  }

  .textcenter {
    text-align: center;
  }

  @media screen and (max-width: 1100px) {
    .heightpx {
      display: none;
    }
  }
</style>
