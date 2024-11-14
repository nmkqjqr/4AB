<template>
  <div>
  <div v-for="(item, index) in data.popData" :key="index">
    <div v-if="item.type == 'user'">
      <p class="tagPStyle">
        <svg-icon
          class="iconImg"
          class-name="imag"
          :icon="item.icon"
          style="width: 20px; height: 17px; margin-bottom: -3px"
        />
        {{ item.title }}
      </p>
      <!-- <el-tag class="tagStyle" type="primary">
        <svg-icon
          class="iconImg"
          class-name="imag"
          :icon="item.icon"
          style="width: 20px; height: 17px; margin-bottom: -3px"
        />

        {{ item.title }}
      </el-tag> -->
    </div>
    <div v-if="item.type != 'user'" style="cursor: pointer">
      <el-popover
        :content="item.content"
        placement="bottom"
        show-arrow="true"
        trigger="click"
        visible="false"
        :width="200"
      >
        <template #reference>
          <el-tag style="margin-bottom: 5px" type="primary">
            <svg-icon
              class="iconImg"
              class-name="imag"
              :icon="item.icon"
              style="width: 20px; height: 17px; margin-bottom: -3px"
            />

            {{ item.title }}
          </el-tag>
        </template>
      </el-popover>
    </div>
  </div>
    <div  v-if="data.dataStr">
    {{ data.dataStr }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { abTableMix, sysApi } from '~/agilebpm'
  import svgIcon from '../svg-icon/index.vue'
  const props = defineProps({
    approverName: { required: true, type: String },
    assignInfo: { required: true, type: String },
    type: { required: true, type: String },
  })
  export interface PopIdenData {
    title?: string
    content?: string
    disabled?: boolean
    type?: string
    icon?: string
  }

  const data = reactive({
    popData: [] as Array<PopIdenData>,
    dataStr:'',
  })
  const initIdentityDetail = () => {
    if (props.assignInfo) {
      //assign user/杜若/1626511646306938880,user/苏叶/1626511699582988288
      props.assignInfo.split(',').forEach((assign) => {
        const popData = new Object() as PopIdenData

        if (assign && assign.split('\/').length == 3) {
          const assignInfo = assign.split('\/')

          if (
            assignInfo[0] == 'org' ||
            assignInfo[0] == 'post' ||
            assignInfo[0] == 'role'
          ) {
            sysApi.sysUser
              .queryGroupUserById({
                groupType: assignInfo[0],
                groupId: assignInfo[2],
              })
              .then((res: any) => {
                if (res.data && res.data.length > 0) {
                  popData.content = `${res.data
                    .map((a: any) => a.name)
                    .join(',')} `
                } else {
                  popData.content = '暂无人员信息!'
                }
                popData.type = assignInfo[0]
                popData.title = assignInfo[1]
                popData.disabled = false
                dealIdenDetail(popData)
                data.popData.push(popData)
              })
          } else {
            popData.type = assignInfo[0]
            popData.title = assignInfo[1]
            popData.disabled = true
            dealIdenDetail(popData)
            data.popData.push(popData)
          }
        }else{
          data.dataStr = props.assignInfo
        }
      })
    }
  }

  //处理展示用户字符
  const dealIdenDetail = (popData: any) => {
    if ('user' == popData.type) {
      popData.title = `[用户]${popData.title}`
      popData.icon = 'referee'
    }
    if ('org' == popData.type) {
      popData.title = `[组织]${popData.title}`
      popData.icon = 'org'
    }
    if ('post' == popData.type) {
      popData.title = `[岗位]${popData.title}`
      popData.icon = 'customer'
    }
    if ('role' == popData.type) {
      popData.title = `[角色]${popData.title}`
      popData.icon = 'circle'
    }
  }
  initIdentityDetail()
  watch(() => props.assignInfo, (newValue, oldValue) => {
      if(newValue!= oldValue){
        data.popData = []
        initIdentityDetail()
      }
    });

  
</script>

<style lang="scss" scoped>
// :deep(.tagStyle){
//   margin:0;
//   .el-tag__content{
//     width: 120px; /* 你可以根据需要设置宽度 */
//     overflow: hidden; /* 溢出隐藏 */
//     text-overflow: ellipsis; /* 显示省略号 */
//     white-space: nowrap; /* 保持文本在一行显示 */
//   }
// }
.tagPStyle{
  color:#1890ff;
  background: #e8f4ff;
  border:1px solid #d1e9ff;
  border-radius:2px;
}
</style>

