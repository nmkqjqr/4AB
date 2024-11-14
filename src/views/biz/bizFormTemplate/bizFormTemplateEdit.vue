<template>
  <el-container class="layout-container-demo">
    <el-header>
      <router-link
        v-if="type != '1'"
        :to="{
          name: 'BizFormTemplateList',
        }"
      >
        <el-button :icon="Back">返回</el-button>
      </router-link>
      <ab-save
        v-else
        back-name="BizFormTemplateList"
        :form-ref="formRef"
        :save-data="info.data"
        :url="bizApi.formTemplate.bizFormTemplateSaveOrUpdate"
      />
      <ab-load
        v-model="info.data"
        :url="bizApi.formTemplate.bizFormTemplateGet"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="info.data"
        >
          <el-form-item
            label="名称"
            prop="name"
            :rules="[
              { required: true, message: '必填' },
              { max: 50, message: '最多可输入50个字符' },
            ]"
          >
            <ab-pinyin
              v-model="info.data.name"
              v-model:to="info.data.code"
              :disabled="type != '1'"
              maxlength="50"
              placeholder="请输入表单名称"
              show-word-limit
            />
          </el-form-item>

          <el-form-item
            label="编码"
            prop="code"
            :rules="[
              { required: true, message: '必填' },
              info.validatorMap,
              { required: true, message: '必填' },
            ]"
          >
            <ab-code
              v-model="info.data.code"
              :disabled="!!info.data.id"
              maxlength="50"
              placeholder="请输入表单编码"
              show-word-limit
            />
          </el-form-item>

          <el-form-item
            label="表单类型"
            placeholder="请选择"
            prop="formType"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-select
              v-model="info.data.formType"
              :disabled="type != '1'"
              placeholder="请选择"
            >
              <el-option
                v-for="item in info.formTypeListOption"
                :key="item.key"
                :label="item.desc"
                :value="item.key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="描述" prop="desc">
            <el-input
              v-model="info.data.desc"
              :disabled="type != '1'"
              placeholder="请输入描述"
              type="textarea"
            />
          </el-form-item>

          <el-form-item label="内容" prop="html">
            <codemirror
              v-model="info.data.html"
              :extensions="
                info.data.formType == 'js'
                  ? info.jsExtensions
                  : info.htmlExtensions
              "
              :indent-with-tab="true"
              :options="{ readOnly: true }"
              placeholder="请输入代码"
              :read-only="true"
              :style="{ height: '300px', width: '90%' }"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>
<script lang="ts">
  export default {
    name: 'BizFormTemplateEdit',
  }
</script>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { Back } from '@element-plus/icons-vue'
  import { abRichEditor, bizApi, sysApi } from '~/agilebpm'
  import { Codemirror } from 'vue-codemirror'
  import { javascript } from '@codemirror/lang-javascript'
  import { html } from '@codemirror/lang-html'
  import { oneDark } from '@codemirror/theme-one-dark'

  const formRef = ref()
  const info: any = reactive({
    validatorMap: '',
    formTypeListOption: [],
    formStyleTypeListOption: [],
    templateTypeListOption: [],
    data: {
      name: '',
      code: '',
      formType: '',
      style: '',
      type: '',
      html: '',
      desc: '',
      editable: '',
    },
    htmlExtensions: [html()],
    jsExtensions: [javascript(), oneDark],
  })

  //获取编码校验规则
  bizApi.bizPattern
    .getAllBizValidator()
    .then((data: any) => (info.validatorMap = data.varirule.rule))

  //通过参数获取详情或编辑的标记(只读/修改)
  const type = getCurrentInstance()?.proxy?.$route.query.type

  // 表单类型
  sysApi.tools
    .getEnum('com.dstz.biz.api.constant.BizFormType', true)
    .then((data) => (info.formTypeListOption = data.data))
</script>
