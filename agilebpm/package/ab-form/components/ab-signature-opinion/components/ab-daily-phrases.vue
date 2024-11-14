<template>
  <div>
    <el-tag
    v-for="(item, index) in info.usefulOpinion"
    :key="index"
    style="margin-bottom: 10px"
    type="info"
    @click="clickTag(item)"
    v-show="index <= info.length"
  >
    {{item.length<15 ? item:item.substring(0,15)+'...' }}
  </el-tag>

    <el-tag
    v-for="(item, index) in info.usefulOpinion"
    :key="index"
    style="margin-bottom: 10px"
    type="info"
    @click="clickTag(item)"
    v-show="index > info.length && info.uo"
  >
    {{item.length<15 ? item:item.substring(0,15)+'...' }}
  </el-tag>

    <el-button
      style="margin-left: 5px;"
      v-if="info.more"

      type="primary"
      icon="ArrowDown"
      link
      @click="showMore()"
     >
      {{ $abT('page.common.expand','展开') }}
    </el-button>

    <el-button
      style="margin-left: 5px;"
      v-if="info.uo"

      type="primary"
      icon="ArrowUp"
      link
      @click="closeMore()"
    >
      {{ $abT('page.common.packup','收起') }}
    </el-button>
	</div>
</template>

<script lang="ts" setup>
import { sysApi } from '~/agilebpm/api'
import { ElMessage } from 'element-plus'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import {abT} from "@/i18n";

const emit = defineEmits(['setDailyPhrases'])

const info :any =reactive({
  more : false,
  uo : false,
  usefulOpinion : [],
  length : 4,

})
onMounted(() => {
  info.usefulOpinion.splice(0)
  //请求常用语
  sysApi.productLicence.getDailyPhrases().then((result: any) => {
    if (!result.isOk){
      debugger
      ElMessage.error(abT('abform.signatureOpinion.noFoundPhrases','未获取到常用语'))
      return;
    }
    if (result.data && result.data.length > 0) {
      result.data.forEach((item: any) => {
        info.usefulOpinion.push(item.locution)
      })
    }else {
      info.usefulOpinion.value =
        [
        abT('abform.signatureOpinion.agree','同意'),
        abT('abform.signatureOpinion.isComplex','请注意，情况复杂！'),
        abT('abform.signatureOpinion.isUrgent','情况紧急，请尽快处理！'),
        abT('abform.signatureOpinion.reject','驳回')
      ];
    }
    if (info.usefulOpinion.length > info.length){
      info.more=true;
    }

  })
})

const showMore = () => {
  info.more=false;
  info.uo=true;
}

const closeMore = () => {
  info.more=true;
  info.uo=false;

}

const clickTag = (tagValue: string) => {
  if (!tagValue) {
    return
  }
  emit('setDailyPhrases', tagValue)
}
</script>


