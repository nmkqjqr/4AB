<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/no-lone-template -->
<template>
  <el-button closable type="default" @click="open">选择</el-button>

  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    draggable
    :title="`表单人员`"
    top="5vh"
    width="50%"
  >
    <el-table border :data="formFieldUserDataModule" style="width: 100%">
      <el-table-column label="选择一个表单字段" style="width: 50%">
        <bo-tree-select
          v-model="info.data.formFieldPath"
          :field-desc="info.data.formFieldPathDesc"
          @boCallBack="boCallBackFn"
        />
      </el-table-column>
      <el-table-column
        label="指定候选人类型"
        prop="identityType"
        style="width: 50%"
      >
        <template #default="scope">
          <el-select v-model="info.data.identityType" class="m-2">
            <el-option
              v-for="(item, index) in info.vaviableOption"
              :key="index"
              :label="item.desc"
              :value="item.type"
            />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <p class="font-style">
      所选择的字段支持逗号分隔，如果逗号分隔则作为多个候选人处理
    </p>
    <p class="font-style">如果选择子表字段时，会将子表每一条数据作为候选人</p>
    <p class="font-style">
      数据默认均为ID形式，如果表单对应ID的候选人从系统中查询不到则配置无效
    </p>

    <template #footer>
      <span class="dialog-footer">
        <el-button text type="default" @click="info.dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { sysApi } from '@agilebpm/api'
  import type { FormInstance } from 'element-plus'
  import { ElMessage, ElTree } from 'element-plus'
  import { stringLiteral } from '@babel/types'
  import BoTreeSelect from './boTreeSelect.vue'

  const props = defineProps({
    modelValue: { required: true, type: Object },
  })

  const treeRef = ref<InstanceType<typeof ElTree>>()

  const emit = defineEmits(['update:modelValue'])

  const formFieldUserDataModule: any = [{}]

  const info: any = reactive({
    dialogVisible: false,
    data: {
      formFieldPath: '',
      formFieldPathDesc: '',
      identityType: 'userId',
      description: '',
    },
    vaviableOption: [],
  })

  const boCallBackFn = (item: any) => {
    if (item?.formFieldPath) {
      info.data.formFieldPath = item.formFieldPath
    }
    if (item?.formFieldPathDesc) {
      info.data.formFieldPathDesc = item.formFieldPathDesc
    }
  }

  //info.data = toRefs(props)

  sysApi.tools
    .getEnum('com.dstz.org.api.enums.GroupType', true)
    .then(({ data }) => {
      info.vaviableOption = data
      info.vaviableOption.push({ type: 'userId', desc: '用户' })
      info.vaviableOption.push({ type: 'userAccount', desc: '用户账户' })
    })
  const open = () => {
    if (props.modelValue) {
      // eslint-disable-next-line vue/no-setup-props-destructure
      info.data = props.modelValue
    }
    info.dialogVisible = true
  }

  const getVaviableOption = (key: any) => {
    for (let i = 0; i < info.vaviableOption.length; i++) {
      if (info.vaviableOption[i].type == key) {
        return info.vaviableOption[i].desc
      }
    }
  }

  const ok = () => {
    if (!info.data.formFieldPathDesc) {
      ElMessage({
        showClose: true,
        message: '请选择一个表单字段',
        type: 'warning',
      })
      return
    }
    const value = ''

    info.data.description = `${getVaviableOption(
      info.data.identityType
    )}: 取值字段“${info.data.formFieldPathDesc}”`
    info.dialogVisible = false
    emit('update:modelValue', info.data)
  }
</script>

<style scoped lang="scss">
  .font-style {
    font-size: small;
    color: #2db7f5;
  }
</style>
