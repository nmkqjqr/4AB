<template>
  <el-popover
    class="add-node-btn-box"
    placement="right"
    trigger="click"
    width="320"
  >
    <div>
      <div
        class="add-node-popover-item approver"
        @click="addNodeFn('UserTask')"
      >
        <div class="item-wrapper">
          <span class="iconfont"></span>
        </div>
        <br />
        <span>审批人</span>
      </div>
      <div
        class="add-node-popover-item notifier"
        @click="addNodeFn('ServiceTask')"
      >
        <div class="item-wrapper">
          <span class="iconfont"></span>
        </div>
        <br />
        <span>抄送人</span>
      </div>
      <div
        class="add-node-popover-item condition"
        @click="addNodeFn('InclusiveGateway')"
      >
        <div class="item-wrapper">
          <span class="iconfont"></span>
        </div>
        <br />
        <span>条件分支</span>
      </div>
    </div>
    <template #reference>
      <div class="add-node-btn add-node-btn-box">
        <el-button icon="Plus" type="primary" />
      </div>
    </template>
  </el-popover>
</template>
<script lang="ts" setup>
  const props = defineProps({
    nodeDef: { required: true, type: Object },
    commonUtil: { required: true, type: Object },
  })
  const data = reactive({
    visible: false,
  })
  const emit = defineEmits(['update:nodeDef'])
  const { nodeDef, commonUtil } = toRefs(props)

  const addNodeFn = (nodeType: any) => {
    data.visible = false
    let maxNodeNo = commonUtil.value.maxNodeNo || 0
    maxNodeNo++

    // 复制默认配置
    const defaultConf = JSON.parse(commonUtil.value[`${nodeType}DefaultConf`])

    defaultConf.nodeKey = defaultConf.nodeKey + maxNodeNo
    defaultConf.nodeName = defaultConf.nodeName + maxNodeNo

    if (nodeType == 'InclusiveGateway') {
      defaultConf.nodeName = `${defaultConf.nodeName}开始`
    }

    if (nodeType == 'ServiceTask') {
      defaultConf.plugins.carbonCopy.nodeId = defaultConf.nodeKey
    }
    // 在当前节点添加一个节点
    if (nodeDef.value.next) {
      defaultConf.next = nodeDef.value.next
    }

    nodeDef.value.next = defaultConf
    commonUtil.value.maxNodeNo = maxNodeNo
  }
</script>
<style>
  .tooltipClass {
    border: 0px !important;
  }
  .add-node-btn-box:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    margin: auto;
    width: 2px;
    height: 100%;
    background-color: #cacaca;
  }
</style>
