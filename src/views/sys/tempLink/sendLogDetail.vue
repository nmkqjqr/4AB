<template>
  <div>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">推送时间：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">{{ pageData.createTime }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">是否成功：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">
          <el-tag
            v-if="!pageData.isFail || pageData.isFail === '0'"
            type="success"
          >
            成功
          </el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </div>
      </el-col>
    </el-row>
    <el-row
      v-if="pageData.isFail && pageData.isFail === 1"
      :gutter="5 && pageData.failReason"
    >
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">失败原因：</div>
      </el-col>
      <el-col :span="20">
        <div
          class="grid-content ep-bg-purple"
          v-html="pageData.failReason"
        ></div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">推送邮箱：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">{{ pageData.email }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">推送电话：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">{{ pageData.phone }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">关联业务类型：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">{{ pageData.bizTypeDesc }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">关联业务主键：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">{{ pageData.bizId }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">推送内容：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple" v-html="pageData.content"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { sysApi } from '~/agilebpm'
  const props = defineProps({
    id: { type: String, required: true },
  })

  const pageData = ref({} as any)

  sysApi.tempLink.sendLogDetail(props.id).then((res: any) => {
    if (res.isOk && res.data) {
      pageData.value = res.data
    }
  })
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    min-height: 36px;
    padding: 9px;
    text-align: left;
    background-color: beige;
    border-radius: 4px;
  }
</style>
>
