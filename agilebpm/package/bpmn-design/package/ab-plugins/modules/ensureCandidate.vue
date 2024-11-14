<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>动态广场</span>
        <el-button text @click="deletePlugin()">
          <el-icon>
            <Close />
          </el-icon>
        </el-button>
      </div>
    </template>
    <el-form label-width="290px">
      <el-form-item label="发起人可设置无责任人任务的候选人">
        <el-switch v-model="pluginData.emptyNodeSettingUser" />
      </el-form-item>
      <el-form-item label="任务候选人可为空">
        <el-switch v-model="pluginData.userCanEmpty" />
      </el-form-item>
      <el-form-item label="发起人可修改所有任务候选人">
        <el-switch v-model="pluginData.canSetUserNodes" />
      </el-form-item>
      <el-form-item label="跳过之前相同候选人的任务">
        <el-switch v-model="pluginData.skiptBeforMyTask" />
      </el-form-item>
      <el-form-item
        v-show="pluginData.skiptBeforMyTask"
        label="设置不允许跳过的节点"
      >
        <el-select
          v-model="pluginData.noSkiptNodes"
          collapse-tags
          collapse-tags-tooltip
          multiple
          placeholder="跳前不跳后忽略配置"
        >
          <el-option
            v-for="(val, key) in userNodeList"
            v-show="val.nodeType != 'StartEvent'"
            :key="key"
            :label="val.nodeName"
            :value="val.nodeKey"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-alert
      :closable="false"
      title="开启动态广场建议明确责任人和分支走向"
      type="success"
      show-icon
    />
  </el-card>
</template>
<script lang="ts" setup>
  import { Close, InfoFilled } from '@element-plus/icons-vue'
  import { defineProps, PropType } from 'vue'
  const props = defineProps({
    pluginData: { required: true, type: Object },
    flowSetting: { required: true, type: Object as PropType<FlowSetting> },
  })
  const userNodeList = inject('userNodeList') as Array<NodeConfig>

  const { pluginData } = toRefs(props)

  const deletePlugin = () => {
    ElMessageBox.confirm('确定删除此插件吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        delete props.flowSetting.plugins['ensureCandidate']
      })
      .catch(() => {})
  }
</script>
<style scoped lang="scss">
  :deep(.el-card__header) {
    padding: 4px 12px !important;
  }
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    line-height: 36px;
  }
</style>
