<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/no-lone-template -->
<template>
  <el-button closable type="default" @click="open">选择</el-button>
  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    draggable
    :title="`相对岗位配置`"
    top="5vh"
    width="50%"
  >
    <el-form
      ref="formRef"
      label-suffix="："
      label-width="120px"
      :model="formFieldUserDataModule"
    >
      <el-form-item
        label="指定相对岗位的组织"
        label-width="168px"
        placeholder="指定相对岗位的组织"
        prop="desc"
      >
        <el-select v-model="info.data.orgFrom" class="m-2">
          <el-option
            v-for="(item, index) in orgFrom"
            :key="index"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="info.data.orgFrom == 'formField'"
        label="选择表单字段"
        label-width="168px"
        placeholder="选择表单字段"
        prop="desc"
      >
        <bo-tree-select
          v-model="info.data.formFieldPath"
          :field-desc="info.data.formFieldPathDesc"
          @boCallBack="boCallBackFn"
        />
      </el-form-item>
      <el-form-item
        label="指定关系"
        label-width="168px"
        placeholder="指定关系"
        prop="desc"
      >
        <el-select
          v-model="info.data.orgRelation"
          class="m-2"
          style="margin-right: 10px"
          @change="recoveryData"
        >
          <el-option
            v-for="(item, index) in orgRelation"
            :key="index"
            :label="item.value"
            :value="item.key"
          />
        </el-select>

        <el-select
          v-if="info.data.orgRelation === 'parentOrgSpecicalLevel'"
          v-model="info.data.parentOrgSpecicalLevel"
          class="m-2"
          style="width: 100px"
        >
          <el-option
            v-for="(item, index) in parentOrgSpecicalLevel"
            :key="index"
            :label="item.value"
            :value="item.key"
          />
        </el-select>

        <!-- <el-select
          v-if="
            info.data.orgRelation === 'parentOrgFilterType' ||
            info.data.orgRelation === 'childOrgFilterType'
          "
          v-model="info.data.parentOrgFilterType"
          class="m-2"
          style="width: 100px"
        >
       
        
          <el-option
            v-for="(item, index) in info.parentOrgFilterType"
            :key="index"
            :label="item.label"
            :value="item.key"
          />
        </el-select> -->
        <ab-select-tree
        v-if="
            info.data.orgRelation === 'parentOrgFilterType' ||
            info.data.orgRelation === 'childOrgFilterType'
          "
                v-model="info.data.parentOrgFilterType"
                style="width: 110px"
                :has-root="false"
                type-code="groupGrade"
              />
      </el-form-item>
      <el-form-item
        label="指定岗位角色"
        label-width="168px"
        placeholder="指定岗位角色"
        prop="desc"
      >
        <ab-cust-dialog
          v-model="info.data.dialogData"
          dialog-key="roleSelector"
          :extra-data="{ roleKey: info.data.roleKey }"
          size="small"
          style="margin-right: 10px"
          type="primary"
          :value-mapping="{ id: 'id', name: 'name' }"
          @ok="setPost"
        >
          选择角色
        </ab-cust-dialog>
        <el-tag
          v-for="item in info.data.dialogData"
          :key="item.id"
          class="mx-2"
          closable
          type="success"
          @close="deleteRole(item)"
        >
          {{ item.name }}
        </el-tag>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button text type="default" @click="info.dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </span>
    </template>
    <!-- <p
      class="font-style"
      style="margin-top: 20px; font-size: small; color: #2db7f5"
    >
      所选择的字段支持逗号分隔，如果逗号分隔则作为多个候选人处理
    </p> -->

    <el-card
      class="box-card"
      shadow="hover"
      style="width: 100%; margin-top: 30px"
    >
      <template #header>
        <div class="card-header">
          <span>点击以下选项可快速生成配置</span>
        </div>
      </template>
      <el-card shadow="never">
        <el-space wrap>
          <el-button class="btn-margin-top" @click="setRelation(1)">
            发起人所在部门的指定岗位
          </el-button>
          <el-button btn-margin-top @click="setRelation(2)">
            发起人所在部门上级的指定岗位
          </el-button>
          <el-button btn-margin-top @click="setRelation(3)">
            上一步任务处理者所在部门的指定岗位
          </el-button>
          <el-button btn-margin-top @click="setRelation(4)">
            上一步任务处理者所在部门的上级部门中指定岗位
          </el-button>
          <el-button btn-margin-top @click="setRelation(5)">
            上一步任务处理者所在部门的下级部门中指定岗位
          </el-button>
        </el-space>
      </el-card>
    </el-card>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import * as abUtil from '~/agilebpm/utils/ab-util'
import { sysApi } from '@agilebpm/api'

import { ElMessage } from 'element-plus'
import BoTreeSelect from './boTreeSelect.vue'

const props = defineProps({
  modelValue: { required: true, type: Object },
})
const orgFrom = [
  { key: 'startUserOrg', value: '发起人所在的组织' },
  { key: 'preTaskUserOrg', value: '上一任务处理者所在的组织' },
  { key: 'formField', value: '表单字段中的组织id' },
]

const orgRelation = [
  { key: 'currentOrg', value: '所在组织' },
  { key: 'parentOrg', value: '上一级' },
  { key: 'parentOrgFilterType', value: '上级中指定类型的组织' },
  { key: 'parentOrgSpecicalLevel', value: '上级中指定级别的组织' },
  { key: 'childOrg', value: '下一级' },
  { key: 'childOrgFilterType', value: '下级中指定类型的组织' },
]

const parentOrgSpecicalLevel = [
  { key: '2', value: '上两级' },
  { key: '3', value: '上三级' },
  { key: '4', value: '上四级' },
  { key: '5', value: '上五级' },
]

const emit = defineEmits(['update:modelValue'])

const formFieldUserDataModule: any = [{}]

const info: any = reactive({
  dialogVisible: false,
  data: {
    orgFrom: 'startUserOrg',
    orgRelation: 'currentOrg',
    parentOrgSpecicalLevel: '',
    parentOrgFilterType: '',
    roleKey: '',
    roleName: '',
    description: '',
    dialogData: [],
    formFieldPath: '',
    formFieldPathDesc: '',
  },
  resolvers: [],
  parentOrgFilterType: [],
})

if (props.modelValue) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  info.data = props.modelValue
}
//相对岗位快速配置
const setRelation = (i: number) => {
  if (i === 1 || i === 2) {
    info.data.orgFrom = 'startUserOrg'
  }
  if (i === 3 || i === 4 || i === 5) {
    info.data.orgFrom = 'preTaskUserOrg'
  }

  if (i === 1 || i === 3) {
    info.data.orgRelation = 'currentOrg'
  }
  if (i === 2 || i === 4) {
    info.data.orgRelation = 'parentOrg'
  }
  if (i === 5) {
    info.data.orgRelation = 'childOrg'
  }
}
const deleteRole = (item: any) => {
  info.data.dialogData.splice(info.data.dialogData.indexOf(item), 1)
  info.data.roleKey = info.data.dialogData.map((a: any) => a.id).join(',')
  info.data.roleName = info.data.dialogData.map((a: any) => a.name).join(',')
}

const boCallBackFn = (item: any) => {
  debugger
  if (item?.formFieldPath) {
    info.data.formFieldPath = item.formFieldPath
  }
  if (item?.formFieldPathDesc) {
    info.data.formFieldPathDesc = item.formFieldPathDesc
  }
}

const recoveryData = () => {
  if (
    info.data.orgRelation === 'parentOrgFilterType' ||
    info.data.orgRelation === 'childOrgFilterType'
  ) {
    info.data.parentOrgFilterType = '0'
    info.data.parentOrgSpecicalLevel = ''
  } else if (info.data.orgRelation === 'parentOrgSpecicalLevel') {
    info.data.parentOrgSpecicalLevel = '2'
    info.data.parentOrgFilterType = ''
  } else {
    info.data.parentOrgSpecicalLevel = ''
    info.data.parentOrgFilterType = ''
  }
}

//选择岗位回调赋值
const setPost = (posts: Array<any>) => {
  info.data.roleKey = posts.map((a: any) => a.id).join(',')
  info.data.roleName = posts.map((a: any) => a.name).join(',')
}

sysApi.tools
  .getEnum('com.dstz.org.api.enums.GroupGradeConstant', true)
  .then(({ data }) => {
    info.parentOrgFilterType = data
  })
const open = () => {
  info.dialogVisible = true
  if (props.modelValue) {
    info.data = abUtil.clone(props.modelValue)
  }
}

const getOptionBykey = (key: any, list: Array<any>, valueStr: any) => {
  if (!valueStr) {
    valueStr = 'value'
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].key == key) {
      return ` ${list[i][valueStr]}`
    }
  }
}

const ok = () => {
  if (!info.data.roleKey) {
    ElMessage({
      showClose: true,
      message: '请选择角色',
      type: 'warning',
    })
    return
  }
  const value = ''

  info.data.description = getOptionBykey(info.data.orgFrom, orgFrom, 'value')
  if (info.data.orgRelation && info.data.orgRelation != 'currentOrg') {
    info.data.description += getOptionBykey(
      info.data.orgRelation,
      orgRelation,
      'value'
    )
  }
  if (info.data.parentOrgSpecicalLevel) {
    info.data.description += `的 ${getOptionBykey(
      info.data.parentOrgSpecicalLevel,
      parentOrgSpecicalLevel,
      'value'
    )}`
    info.data.description = info.data.description.replace('级别的组织', '')
  }

  if (info.data.parentOrgFilterType) {
    info.data.description += '('
    info.data.description += getOptionBykey(
      info.data.parentOrgFilterType,
      info.parentOrgFilterType,
      'label'
    )
    info.data.description += ') '
    info.data.description = info.data.description.replace(
      '类型的组织',
      '类型为'
    )
  }
  info.data.description += `的 "${info.data.roleName}"`
  info.dialogVisible = false
  emit('update:modelValue', info.data)
}
</script>

<style>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}

.font-style {
  font-size: small;
  color: #2db7f5;
}
.btn-margin-top {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
