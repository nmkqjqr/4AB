<template>
  <div
    v-for="(layout, taskDefKey) in props.imageInfo.nodeMap"
    :key="taskDefKey"
    :style="getStyle(layout)"
    @click="clickNode({ node: layout, fn: props.imageInfo.flowFn })"
  >
    <el-popover
      :disabled="!props.imageInfo.opinionMap[taskDefKey]"
      placement="right"
      trigger="hover"
      width="280"
    >
      <div class="popperContent">
        <div
          v-for="opinion in props.imageInfo.opinionMap[taskDefKey]"
          v-show="opinion.assignInfo != '所有会签用户' || opinion.approveTime"
          :key="opinion.id"
        >
          <el-descriptions border :column="1" size="small">
            <template #title>
              {{ opinion.approverName }}
              <span
                v-if="opinionConfig[opinion.status]"
                :style="'color: ' + opinionConfig[opinion.status].color"
              >
                <el-icon
                  :class="opinion.status === 'processing' ? 'is-loading' : ''"
                >
                  <component :is="opinionConfig[opinion.status].icon" />
                </el-icon>
                {{ opinionConfig[opinion.status].name }}
              </span>
            </template>
            <el-descriptions-item
              v-if="opinion.approverName"
              :label="$abT('bpm.office.taskExecutor', '任务执行人')"
            >
              {{ opinion.approverName }}
            </el-descriptions-item>
            <el-descriptions-item
              v-else
              :label="$abT('bpm.office.taskCandidate', '任务候选人')"
            >
              <ab-identity-detail
                :approver-name="opinion.assign"
                :assign-info="opinion.assignInfo"
                :type="assign"
              />
            </el-descriptions-item>
            <el-descriptions-item
              v-if="opinion.opinion"
              :label="$abT('bpm.office.approvalOpinions', '审批意见')"
            >
              <span class="white-space: pre-line">
                {{ opinion.opinion }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item
              v-if="opinion.approveTime"
              :label="$abT('page.common.operationTime', '操作时间')"
            >
              {{ opinion.approveTime }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="opinion.durMs"
              :label="$abT('bpm.office.taskTimeConsumption', '任务耗时')"
            >
              {{ abutil.timeLag(opinion.durMs) }}
            </el-descriptions-item>
          </el-descriptions>
          <el-divider />
        </div>
      </div>

      <template #reference>
        <div v-if="taskDefKey.indexOf('TextAnnotation') === 0">
          <div
            style="
              margin-top: 5px;
              margin-left: 5px;
              font-size: 12px;
              color: gray;
              background: white;
              border: none;
            "
            :style="{
              height: layout.height - 6 + 'px',
              width: layout.width + 10 + 'px',
            }"
          >
            {{ layout.nodeName }}
          </div>
        </div>
        <div
          v-else
          :id="'popperTarget' + props.imageInfo.preId + taskDefKey"
          class="flowNode pointer"
        >
          <div
            v-if="props.drawFn.showNodeTitle(layout.nodeType)"
            style="
              display: table-cell;
              height: 26px;
              padding-top: 2px;
              font-size: 12px;
              line-height: 12px;
              color: white;
              text-align: center;
              vertical-align: middle;
            "
            :style="{
              width: layout.width + 'px',
            }"
          >
            {{ layout.nodeName }}
          </div>

          <div
            v-for="opinion in getCurrentOpinionMap(taskDefKey)"
            :key="opinion.id"
          >
            <div
              v-if="opinionConfig[opinion.status]"
              class="opinionStatus"
              style="
                /* color: #2d7fff; */
                margin-top: 12px;
                margin-right: 6px;
                margin-left: 10px;
                font-weight: bold;
                text-align: right;
              "
              :style="'color: ' + opinionConfig[opinion.status].color"
            >
              <el-icon
                :class="opinion.status === 'processing' ? 'is-loading' : ''"
              >
                <component :is="opinionConfig[opinion.status].icon" />
              </el-icon>
              {{ opinionConfig[opinion.status].name }}
            </div>
          </div>
        </div>
      </template>
    </el-popover>
    <div v-if="layout.desc" class="bottonDiv">
      <el-popover placement="bottom" trigger="hover" width="260">
        <span style="white-space: pre-wrap">{{ layout.desc }}</span>
        <template #reference>
          <span class="el-icon-warning-outline"></span>
        </template>
      </el-popover>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { abIdentityDetail } from '@ab-core'
  import { opinionConfig } from './imageUtil'

  const props = defineProps({
    imageInfo: { required: true, type: Object },
    drawFn: { required: true, type: Object },
  })

  const getStyle = (layout) => {
    const css = {
      position: 'absolute',
      left: `${layout.x - layout.domxoffset}px`,
      top: `${layout.y - layout.domyoffset}px`,
      width: `${layout.width}px`,
      height: `${layout.height}px`,
      'border-radiu': '5px',
    }
    if (['CallActivity'].includes(layout.type) || layout.multInst == 'start') {
      css['cursor'] = 'pointer'
    }
    return css
  }

  const clickNode = (params) => {
    props.drawFn.clickNode(params)
  }

  const getCurrentOpinionMap = (taskDefKey) => {
    let opinion = null
    const listOpinion = props.imageInfo.opinionMap[taskDefKey]
    if (!listOpinion) return []
    // 会签或者其他动态任务，展示主任务状态
    for (let i = 0, item; (item = listOpinion[i++]); ) {
      if (item.assignInfo === '所有会签用户') {
        opinion = item
      }
    }
    // 如果不是，则展示最后一条记录
    if (!opinion) {
      for (
        let i1 = listOpinion.length - 1, item1;
        (item1 = listOpinion[i1--]);

      ) {
        // 不是会签节点，且不是抄送等节点，其他作为当前节点状态展示
        if (
          !item1.signId &&
          'carbonCopy,postscript'.indexOf(item1.status) == -1
        ) {
          return [item1]
        }
      }
      opinion = listOpinion[listOpinion.length - 1]
    }
    return [opinion]
  }
</script>
