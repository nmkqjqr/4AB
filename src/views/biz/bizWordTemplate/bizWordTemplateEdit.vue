<template>
  <div class="layout-container-demo">
    <el-container>
      <el-header>
        <ab-save
          back-name="BizWordTemplateList"
          :form-ref="formRef"
          :save-data="info.data"
          :url="bizApi.wordTemplate.BizWordTemplateSave"
        />
        <ab-load
          v-model="info.data"
          :url="bizApi.wordTemplate.BizWordTemplateGet"
        />
      </el-header>
      <el-divider class="dividermar" />
      <el-main>
        <el-scrollbar>
          <el-form
            v-if="info.BizValidatorMap"
            ref="formRef"
            class="mt50"
            label-suffix="："
            label-width="100px"
            :model="info.data"
            :status-icon="false"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="分类"
                  prop="typeCode"
                  :rules="[{ required: true, message: '必填' }]"
                >
                  <ab-select-tree
                    v-model="info.data.typeCode"
                    :operation="false"
                    type-code="biz"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="名称"
                  prop="name"
                  :rules="[{ required: true, message: '必填' }]"
                >
                  <ab-pinyin
                    v-model="info.data.name"
                    v-model:copy="info.data.desc"
                    v-model:to="info.data.code"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="编码"
                  prop="code"
                  :rules="[
                    { required: true, message: '必填' },
                    { max: 50, message: '最多可输入50个字符' },
                    info.BizValidatorMap.varirule.rule,
                  ]"
                >
                  <ab-code
                    v-model="info.data.code"
                    :disabled="!!info.data.id"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="描述"
                  prop="desc"
                  :rules="[{ max: 250, message: '最多可输入250个字符' }]"
                >
                  <el-input
                    v-model="info.data.desc"
                    autosize
                    placeholder="回车可增加行数"
                    resize="none"
                    style="min-width: 220px"
                    type="textarea"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="表单设计"
                  prop="designCode"
                  :rules="[
                    { required: true, trigger: 'blur', message: '必填' },
                  ]"
                >
                  <el-tag
                    v-if="info.data.designCode"
                    class="ml-2"
                    type="success"
                  >
                    {{ `${info.data.designName}（${info.data.designCode}）` }}
                  </el-tag>
                  <ab-cust-dialog
                    v-model="info.data"
                    dialog-key="formDesignSelector"
                    :dialog-setting="{ multiple: 0 }"
                    :icon="Search"
                    size="small"
                    style="margin-left: 5px"
                    type="primary"
                    :value-mapping="{
                      code: 'designCode',
                      name: 'designName',
                      boCode: 'boCode',
                      boName: 'boName',
                    }"
                  >
                    选择
                  </ab-cust-dialog>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="业务对象" prop="boCode">
                  <el-tag v-if="info.data.boCode" class="ml-2" type="success">
                    {{ `${info.data.boName}（${info.data.boCode}）` }}
                  </el-tag>
                  <el-tag v-else class="ml-2" type="warning">未配置表单</el-tag>
                  <field-dialog :bo-code="info.data.boCode" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="拓展参数"
                  prop="expandParam"
                  :rules="[
                    { max: 250, message: '最多可输入50个字符' },
                    {
                      message: '仅支持beanService.method的格式',
                      trigger: 'blur',
                      validator: info.expandParamValidator,
                    },
                  ]"
                >
                  <el-input
                    v-model="info.data.expandParam"
                    placeholder="服务类.方法名。eg：beanService.method"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="模板文件"
                  prop="file"
                  :rules="[
                    { required: true, trigger: 'blur', message: '必填' },
                  ]"
                >
                  <ab-upload-file
                    v-model="info.data.file"
                    dic-code="word"
                    :multiple="false"
                    size="small"
                    type="docx"
                  />
                  <el-button
                    v-if="info.data.file && info.data.file != '[]'"
                    :icon="View"
                    size="small"
                    type="primary"
                    @click="downloadXml"
                  >
                    预览模板xml格式文件
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-scrollbar>
      </el-main>
    </el-container>

    <!--xml对话框-->
    <el-dialog
      v-model="info.xmlVisible"
      :close-on-click-modal="false"
      title="xml对话框"
      top="10px"
      width="90%"
    >
      <codemirror
        v-model="info.xml"
        :extensions="info.htmlExtensions"
        :indent-with-tab="true"
        :options="{ readOnly: true }"
        :read-only="true"
        :style="{ height: info.height, width: '100%' }"
      />
      <template #footer>
        <el-button text type="default" @click="info.xmlVisible = false">
          取消
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { postData, bizApi, abUploadFile, abTools, abUtil } from '~/agilebpm'
  import { ElMessage } from 'element-plus'
  import { Search, View } from '@element-plus/icons-vue'
  import { Codemirror } from 'vue-codemirror'
  import { html } from '@codemirror/lang-html'
  import FieldDialog from '@/views/biz/bizWordTemplate/fieldDialog.vue'

  //页面用到的所有信息必须放在这个参数之下，不然双向绑定会有很多问题！
  const info: any = reactive({
    data: {}, //数据对象
    xmlVisible: false,
    xml: '',
    BizValidatorMap: null,
    htmlExtensions: [html()],
    height: `${window.innerHeight - 220}px`,
    expandParamValidator: (rule: any, value: any, callback: any) => {
      let b = true
      if (value) {
        if (value.endsWith('.') || value.split('.').length != 2) {
          b = false
        }
      }
      if (!b) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
  })

  const formRef = ref<FormInstance>()

  const { proxy } = abTools.useCurrentInstance()
  if (proxy.$route.query) {
    info.data.typeCode = proxy.$route.query.typeCode
  }

  bizApi.bizPattern.getAllBizValidator().then((data) => {
    info.BizValidatorMap = data
    console.info(info.BizValidatorMap)
  })

  const downloadXml = () => {
    const fileName = JSON.parse(info.data.file)[0].name
    const fileId = JSON.parse(info.data.file)[0].id

    bizApi.wordTemplate.getWordXml(fileId).then((resp: any) => {
      if (!resp.data) {
        ElMessage({
          type: 'error',
          message: '下载word文档失败',
        })
        return
      }
      info.xml = resp.data
      info.xmlVisible = true
    })
  }
</script>
