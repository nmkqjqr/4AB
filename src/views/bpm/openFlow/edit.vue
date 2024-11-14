<template>
  <el-container class="layout-container-demo">
    <el-header height="80px">
      <ab-save
        :after-save-fn="saveAfter"
        back-name="BpmOpenFlowList"
        :form-ref="formRef"
        :save-data="data.openFlow"
        :url="bpmApi.openFlow.bpmOpenFlowSaveUrl"
      />
      <ab-load
        v-model="data.openFlow"
        :get-param="id"
        :url="bpmApi.openFlow.bpmOpenFlowGetUrl"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-form
        ref="formRef"
        label-suffix="："
        label-width="130px"
        :model="data.openFlow"
        :status-icon="false"
      >
        <el-form-item
          :label="$abT('page.wfDesign.wfName','流程名称')"
          prop="defKey"
          :rules="[{ required: true, message: $abT('rules.required','必填') }]"
        >
          <el-tag v-if="!data.openFlow.defName" type="warning">{{ $abT('page.common.notSelect','未选择') }}</el-tag>
          <el-tag v-else>
            {{ data.openFlow.defName }}
          </el-tag>
          <ab-cust-dialog
            v-if="!id || !data.openFlow.defKey"
            v-model="data.openFlow"
            dialog-key="bpmDefinitionSelector"
            :param="{ type_code_: data.openFlow.typeCode }"
            style="margin-left: 10px"
            type="primary"
            :dialog-setting="{ multiple:0 }"
            :value-mapping="{ id: 'defId', name: 'defName', key: 'defKey'}"
          >
            {{ $abT('bpm.office.selectProcess','请选择流程') }}
          </ab-cust-dialog>
        </el-form-item>

        <el-form-item :label="$abT('bpm.office.dueTime','到期时间')" prop="dueTime">
          <el-date-picker
            v-model="data.openFlow.dueTime"
            :disabled-date="disabledDate"
            format="YYYY/MM/DD HH:mm"
            :placeholder="$abT('page.wfPublicShare.selectExpirationDate','请选择到期时间')"
            type="datetime"
            value-format="x"
          />
        </el-form-item>
        <el-form-item
          :label="$abT('page.wfPublicShare.maxAccess','最大访问')"
          prop="maxVisits"
          :rules="[{ required: true, message: $abT('rules.required','必填') }]"
        >
          <el-input v-model="data.openFlow.maxVisits" :min="1" type="number" />
        </el-form-item>
        <el-form-item
          :label="$abT('page.common.status','状态')"
          prop="enabled"
        >
          <el-switch
            v-model="data.openFlow.enabled"
            :active-text="$abT('page.common.enable','启用')"
            :active-value="1"
            :inactive-text="$abT('page.common.disable','禁用')"
            :inactive-value="0"
            inline-prompt
          />
        </el-form-item>
        <el-form-item
          :label="$abT('page.common.desc','描述')"
          prop="desc"
          :rules="[
            { required: true, message: $abT('rules.required','必填') },
            { max: 500, message: $abT('rules.max','最多可输入{a}个字符',{a:500}) },
          ]"
        >
          <el-input v-model="data.openFlow.desc" type="textarea" />
        </el-form-item>
        <el-form-item v-if="data.openFlow.url" :label="$abT('page.wfPublicShare.linkAddress','链接地址')" prop="url">
          <el-input v-model="data.openFlow.url" readonly />
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { bpmApi, abUtil, abTools, sysApi } from '~/agilebpm'
  import { abChooseSvg } from '~/agilebpm'

  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()
  const formRef = ref<FormInstance>()
  const id = proxy.$route.query.id
  const data = reactive({
    openFlow: {
      defName: '',
      defkey: '',
      defId: '',
      desc: '',
      dueTime: '',
      maxVisits: 10,
      typeCode: '',
      id: null as any,
      enabled: 1,
    },
    defInfo: {
      defName: '',
      defId: '',
      defKey: '',
    },
  })

  const disabledDate = (time: Date) => {
    return time.getTime() <= new Date().getTime()
  }

  data.openFlow.typeCode = proxy.$route.query.typeCode
</script>
