<template>
  <el-form label-width="100px">
    <el-form-item :label="props.formName + '：'">
      <el-radio-group v-model="bpmForm.type" @change="typeChange()">
        <el-radio-button label="inner">在线表单</el-radio-button>
        <el-radio-button label="url">外部表单</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <!--在线表单-->
    <span v-if="bpmForm.type == 'inner'">
      <el-form-item label="PC端表单：" size="small">
        <el-tag v-if="bpmForm.pcName" :closable="!state.isAppSquare" @close="del('pc')">
          {{ bpmForm.pcName }}
        </el-tag>
        <el-tag v-else type="warning">未选择</el-tag>
        <ab-cust-dialog
          v-if="!state.isAppSquare"
          dialog-key="formSelector"
          :dialog-setting="{ multiple: 0 }"
          extra-data="pc"
          :icon="Search"
          :param="getDialogParam('pc')"
          style="margin-left: 5px"
          type="primary"
          @ok="select"
        >
          选择
        </ab-cust-dialog>
      </el-form-item>

      <el-form-item label="移动端表单：" size="small">
        <el-tag v-if="bpmForm.mbName" :closable="!state.isAppSquare" @close="del('mb')">
          {{ bpmForm.mbName }}
        </el-tag>
        <el-tag v-else type="warning">未选择</el-tag>
        <ab-cust-dialog
          v-if="!state.isAppSquare"
          dialog-key="formSelector"
          :dialog-setting="{ multiple: 0 }"
          extra-data="mobile"
          :icon="Search"
          :param="getDialogParam('mobile')"
          style="margin-left: 5px"
          type="primary"
          @ok="select"
        >
          选择
        </ab-cust-dialog>
      </el-form-item>

      <el-form-item label="权限配置：" size="small">
        <biz-permission
          v-if="bpmForm.boCode"
          :bo-codes="bpmForm.boCode"
          :form-code="bpmForm.pcCode"
          :type="permissionType"
          :value="permissionValue"
          :version="flowSetting.flowVersion"
        >
          <el-button :icon="Operation" style="margin-left: 5px" type="primary">
            授权
          </el-button>
        </biz-permission>
        <el-tag v-else type="warning">未设置表单</el-tag>
      </el-form-item>
    </span>

    <!--url表单-->
    <span v-else>
      <el-form-item label="PC端URL地址：" size="small">
        <el-input v-model="bpmForm.pcUrl" type="input" />
      </el-form-item>
      <el-form-item label="移动URL地址：" size="small">
        <el-input v-model="bpmForm.mbUrl" type="input" />
      </el-form-item>
      <el-form-item label="表单处理器：" size="small">
        <el-input v-model="bpmForm.urlHandler" type="input" />
      </el-form-item>
    </span>
  </el-form>
</template>
<script setup lang="ts">
  import BizPermission from '@/views/biz/bizObject/bizPermission.vue'
  import { appsquareApi } from '@agilebpm/api'
  import { PropType } from 'vue'
  import { abTools } from '~/agilebpm'
  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()
  const props = defineProps({
    bpmForm: { required: true, type: Object as PropType<BpmForm> },
    formName: { required: true, type: String },
    flowSetting: {
      type: Object as PropType<FlowSetting>,
      required: true,
    },
    permissionType: {
      type: String,
      required: true,
    },
    permissionValue: {
      type: String,
      required: true,
    },
  })

  const state = reactive({
    isAppSquare: proxy.$route.name == "CreateForm" ? true : false
  })

  const { bpmForm, flowSetting } = toRefs(props)

  onMounted(() => {
    flowSetting.value.bizModeList = flowSetting.value.bizModeList || []
    setDeaultForm()
  })

  const setDeaultForm = () => {
    if(proxy.$route.params.formDesignId){
      appsquareApi.thirdParty
        .getDesignThirdParty(proxy.$route.params.resourceId)
        .then((res:any) => {
          bpmForm.value.pcName = res.data.name
          bpmForm.value.mbName = res.data.name
          bpmForm.value.pcCode = res.data.pcFormCode && res.data.pcFormCode.length > 0 ? res.data.pcFormCode : ''
          bpmForm.value.mbCode = res.data.mbFormCode && res.data.mbFormCode.length > 0 ? res.data.mbFormCode : ''
          bpmForm.value.boCode = res.data.boCode
          if (
            !flowSetting.value.bizModeList.map((b) => b.code).includes(res.data.boCode)
          ) {
            flowSetting.value.bizModeList.push({
              code: res.data.boCode,
              name: res.data.boName,
            })
          }
        })
    }
  }

  const typeChange = () => {}

  const select = (data: Array<any>, type: string) => {
    if (type == 'pc') {
      bpmForm.value.pcName = data[0].name
      bpmForm.value.pcCode = data[0].code
    } else {
      bpmForm.value.mbName = data[0].name
      bpmForm.value.mbCode = data[0].code
    }
    bpmForm.value.boCode = data[0].boCode

    if (
      !flowSetting.value.bizModeList.map((b) => b.code).includes(data[0].boCode)
    ) {
      flowSetting.value.bizModeList.push({
        code: data[0].boCode,
        name: data[0].boName,
      })
    }
  }

  const getDialogParam = (type: string) => {
    const param = { type_: type }
    const boCodes = flowSetting.value.bizModeList.map((b) => b.code).join(',')
    param['bo_code_'] = boCodes
    return param
  }

  const del = (type: string) => {
    if (type == 'pc') {
      bpmForm.value.pcCode = ''
      bpmForm.value.pcName = ''
    } else {
      bpmForm.value.mbCode = ''
      bpmForm.value.mbName = ''
    }

    //置空Bo
    if (!bpmForm.value.pcCode && !bpmForm.value.mbCode) {
      bpmForm.value.boCode = ''
    }
  }
</script>
