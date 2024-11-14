<template>
  <el-form-item
    :label="$abT('bpm.office. nextTaskConfiguration', '下一步任务配置')"
  >
    <el-radio-group v-model="info.targetNode" size="large" style="width: 100%">
      <el-table
        :data="props.data.freeNodeList"
        row-key="nodeKey"
        style="width: 100%; margin-left: 20px"
      >
        <el-table-column v-if="props.data.nodeUserType != 'no'" type="expand">
          <template #default="propList">
            <div m="4">
              <p m="t-0 b-2">
                {{ $abT('bpm.office.candidateScope', '候选人范围：') }}
                <el-tag>{{ info.nodeUserType }}</el-tag>
              </p>

              <p v-if="props.data.nodeUserType == 'allUser'" m="t-0 b-2">
                {{ $abT('bpm.office.setUpCandidates', '设置候选人：') }}
                <node-identity-dialog
                  v-model="propList.row.identites"
                  :task-node="propList.row"
                />
              </p>

              <p v-else m="t-0 b-2">
                {{ $abT('bpm.office.setUpCandidates', '设置候选人：') }}
                <node-identity-cascade
                  v-model="propList.row.identites"
                  :task-node="propList.row"
                />
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="$abT('bpm.office.taskName', '任务名称')"
          prop="name"
        >
          <template #default="scope">
            <el-radio
              :label="scope.row.nodeKey"
              @click.navite.prevent="clickRadio(scope.row.nodeKey)"
            >
              {{ scope.row.name }}
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          :label="$abT('bpm.office.candidateConfiguration', '候选人配置')"
          prop="nodeKey"
        >
          <template #default="scope">
            <el-tag v-for="(item, index) in scope.row.identites" :key="index">
              {{ item.assign }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-radio-group>
  </el-form-item>
</template>

<script lang="ts" setup>
  import nodeIdentityCascade from './node-identity-cascade.vue'
  import nodeIdentityDialog from './node-identity-dialog.vue'
  import { abT } from '@/i18n'
  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    actionData: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const info: any = reactive({
    nodeUserType: '',
    identites: [] as any[],
    targetNode: '',
  })

  const initData = () => {
    info.nodeUserType = abT(
      'bpm.office.nodeConfigurationPersonnel',
      '节点配置人员'
    )
    if (props.data.nodeUserType == 'allUser') {
      info.nodeUserType = abT('bpm.office.allPersonnel', '所有人员')
    }
    if (props.data.defaultNodeKey && props.data.defaultNodeKey.length > 0) {
      info.targetNode = props.data.defaultNodeKey[0]
    } else if (props.data.freeNodeList && props.data.freeNodeList.length > 0) {
      info.targetNode = props.data.freeNodeList[0].nodeKey
    }
    emit('update:modelValue', info.targetNode)
  }

  initData()

  const clickRadio = (value) => {
    info.targetNode = info.targetNode == value ? '' : value
    emit('update:modelValue', info.targetNode)
  }
</script>
