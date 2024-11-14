<template>
  <span>
  
    <el-tag
      v-for="bo in flowSetting.bizModeList"
      :key="bo.code"
      closable
      style="margin-top: 5px; margin-left: 5px"
      @close="del(bo)"
    >
    <el-tooltip
        class="box-item"
        effect="dark"
        :content='bo.name +"（" + bo.code + "）"'
        placement="top"
      >
      {{ `${bo.name}（${bo.code}）` }}
    </el-tooltip>
    </el-tag>
  
    <el-tag
      v-if="!flowSetting.bizModeList || flowSetting.bizModeList.length == 0"
      type="warning"
    >
      未选择
    </el-tag>
    <ab-cust-dialog
      dialog-key="boSelector"
      :dialog-setting="{ multiple: 1 }"
      extra-data="pc"
      :icon="Search"
      size="small"
      style="display: inline-block; margin-top: 5px; margin-left: 5px"
      type="primary"
      @ok="select"
    >
      选择
    </ab-cust-dialog>
  </span>
</template>
<script setup lang="ts">
  import { PropType } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Search, Plus, Delete, Edit } from '@element-plus/icons-vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const props = defineProps({
    flowSetting: {
      type: Object as PropType<FlowSetting>,
      required: true,
    },
  })
  const { flowSetting } = toRefs(props)
  onMounted(() => {
    flowSetting.value.bizModeList = flowSetting.value.bizModeList || []
  })

  const del = (bo: BpmBizModel) => {
    const msgs: any = []
    checkBo(bo, flowSetting.value.defaultForm, '全局默认表单', msgs)
    checkBo(bo, flowSetting.value.instForm, '全局实例表单', msgs)
    checkBo(bo, flowSetting.value.printForm, '全局打印表单', msgs)

    //遍历节点的表单
    Object.values(flowSetting.value.nodeMap).forEach((n) => {
      if (n.nodeType != 'UserTask') return
      checkBo(bo, n.nodeForm, `${n.nodeName}（${n.nodeKey}）节点表单`, msgs)
      checkBo(bo, n.printForm, `${n.nodeName}（${n.nodeKey}）打印表单`, msgs)
    })
    if (msgs.length > 0) {
      ElMessage({
        type: 'warning',
        message: `当前对象被如下表单使用中：<br/>${msgs.join('<br/>')}`,
        dangerouslyUseHTMLString: true,
      })

      return
    }

    abUtil.Arrays.remove(bo, flowSetting.value.bizModeList)
  }

  const select = (data: Array<any>) => {
    data.forEach((d) => {
      if (
        !flowSetting.value.bizModeList.map((bo) => bo.code).includes(d.code)
      ) {
        flowSetting.value.bizModeList.push({
          code: d.code,
          name: d.name,
        })
      }
    })
  }

  const checkBo = (
    bo: BpmBizModel,
    form: BpmForm,
    msg: string,
    msgs: Array<any>
  ) => {
    if (form.type == 'inner' && form.boCode == bo.code) {
      msgs.push(msg)
    }
  }
</script>
