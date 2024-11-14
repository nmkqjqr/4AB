<template>
  <div>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">操作动作：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">
          {{ pageData.action }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">操作者：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">{{ pageData.operator }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">操作账号：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">{{ pageData.account }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">操作时间：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">{{ pageData.createTime }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">操作者IP：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">{{ pageData.ip }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">日志跟踪编号：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">{{ pageData.traceId }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple">签名：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">{{ pageData.signature }}</div>
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
        <div class="grid-content ep-bg-purple">数据记录：</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content ep-bg-purple">{{ pageData.data }}</div>
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

  sysApi.sysAuditlog.getDetail(props.id).then((res: any) => {
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
