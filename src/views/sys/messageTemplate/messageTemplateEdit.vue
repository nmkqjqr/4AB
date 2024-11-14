<template>
  <el-container class="layout-container-demo">
    <el-header>
      <router-link
        v-if="type != '1'"
        :to="{
          name: 'messageTemplateList',
        }"
      >
        <el-button :icon="Back">返回</el-button>
      </router-link>
      <ab-save
        v-else
        back-name="messageTemplateList"
        :before-save-fn="beforeSave"
        :form-ref="formRef"
        :save-data="info.data"
        :url="sysApi.messageTemplate.messageTemplateSaveUrl"
      />
      <ab-load
        v-model="info.data"
        :url="sysApi.messageTemplate.messageTemplateGetUrl"
        @after-fn="initTableData(info.data)"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-row>
        <el-col :span="12">
          <el-form
            ref="formRef"
            label-suffix="："
            label-width="150px"
            :model="info.data"
            :status-icon="false"
          >
            <el-form-item
              label="模板名称"
              prop="name"
              :rules="[{ required: true, message: '请输入模板名称' }]"
            >
              <el-input
                v-model="info.data.name"
                :disabled="type != '1'"
                placeholder="请输入模板名称"
              />
            </el-form-item>
            <el-form-item
              label="模板编码"
              prop="code"
              :rules="[{ required: true, message: '请输入模板编码' }]"
            >
              <el-input
                v-model="info.data.code"
                :disabled="type != '1'"
                placeholder="请输入模板编码"
              />
            </el-form-item>
            <el-form-item label="是否启用" prop="enabled">
              <el-switch
                v-model="info.data.enabled"
                :active-value="1"
                :disabled="type != '1'"
                :inactive-value="0"
              />
            </el-form-item>
            <el-form-item label="模板描述" prop="desc">
              <el-input
                v-model="info.data.desc"
                :disabled="type != '1'"
                :rows="2"
                type="textarea"
              />
            </el-form-item>

            <el-form-item
              label="设置模板参数"
              prop="templateParamList"
              style="width: 500px"
            >
              <el-button
                :disabled="type != '1'"
                plain
                @click="addTemplateParam"
              >
                添加模板参数
              </el-button>

              <template
                v-for="(item, index) in info.data.templateParamList"
                :key="index"
              >
                <div>
                  <el-input
                    v-model="item.key"
                    :disabled="type != '1'"
                    placeholder="参数名"
                    size="small"
                    style="width: 100px; margin-right: 18px"
                  />

                  <el-input
                    v-model="item.value"
                    :disabled="type != '1'"
                    placeholder="参数值"
                    size="small"
                    style="width: 100px; margin-right: 8px"
                  />
                  <el-button
                    circle
                    :disabled="type != '1'"
                    :icon="Delete"
                    size="small"
                    type="danger"
                    @click="info.data.templateParamList.splice(index, 1)"
                  />
                </div>
              </template>
            </el-form-item>

            <el-form-item label="供应商短信模板编码" prop="smsTemplateCode">
              <el-input
                v-model="info.data.smsTemplateCode"
                :disabled="type != '1'"
              />
            </el-form-item>
            <el-form-item label="邮件附件模板" prop="templateFile">
              <ab-upload-file
                v-model="info.data.templateFile"
                dic-code="messageTemplateFile"
                :limit="1"
                :disabled="type != '1'"
                size="small"
              />
            </el-form-item>

            <el-tabs v-model="info.activeName" class="demo-tabs">
              <el-tab-pane label="富文本模板" name="first" width="500">
                <el-form-item
                  label="富文本模板"
                  placeholder=""
                  prop="htmlTemplate"
                  :rules="[{ required: true, message: '请输入富文本模板' }]"
                >
                  <div>
                    <el-select
                      class="m-2"
                      :disabled="type != '1'"
                      placeholder="请选择模板参数"
                      size="small"
                    >
                      <el-option
                        v-for="item in info.data.templateParamList"
                        :key="item.key"
                        :label="item.key"
                        :value="item.value"
                        @click="addParamData('htmlTemplate', item.key)"
                      />
                    </el-select>

                    <ab-rich-editor v-model="info.data.htmlTemplate" />
                  </div>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="卡片模板" name="second">
                <el-form-item label="卡片标题" prop="cardTemplateObj.cardTitle">
                  <div>
                    <el-input
                      v-model="info.data.cardTemplateObj.cardTitle"
                      :disabled="type != '1'"
                      placeholder="请输入卡片标题"
                    />
                    
                    <el-select
                      class="m-2"
                      :disabled="type != '1'"
                      placeholder="请选择模板参数"
                      size="small"
                    >
                      <el-option
                        v-for="item in info.data.templateParamList"
                        :key="item.key"
                        :label="item.key"
                        :value="item.value"
                        @click="addParam('cardTitle', item.key)"
                      />
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item label="卡片url" prop="cardTemplateObj.cardUrl">
                  <div>
                    <el-input
                      v-model="info.data.cardTemplateObj.cardUrl"
                      :disabled="type != '1'"
                      placeholder="请输入卡片url"
                    />
                    <el-select
                      class="m-2"
                      :disabled="type != '1'"
                      placeholder="请选择模板参数"
                      size="small"
                    >
                      <el-option
                        v-for="item in info.data.templateParamList"
                        :key="item.key"
                        :label="item.key"
                        :value="item.value"
                        @click="addParam('cardUrl', item.key)"
                      />
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item
                  label="卡片消息"
                  placeholder=""
                  prop="cardTemplateObj.cardContent"
                >
                  <div>
                    <el-input
                      v-model="info.data.cardTemplateObj.cardContent"
                      :disabled="type != '1'"
                      placeholder="请输入普通文本模板"
                      :rows="3"
                      type="textarea"
                    />
                    <el-select
                      class="m-2"
                      :disabled="type != '1'"
                      placeholder="请选择模板参数"
                      size="small"
                    >
                      <el-option
                        v-for="item in info.data.templateParamList"
                        :key="item.key"
                        :label="item.key"
                        :value="item.value"
                        @click="addParam('cardContent', item.key)"
                      />
                    </el-select>
                  </div>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { sysApi, abTools } from '~/agilebpm'
  import { Delete, Back } from '@element-plus/icons-vue'
  import { abRichEditor } from '~/agilebpm'
  import { abUploadFile } from '~/agilebpm'
  import { abUtil } from '~/agilebpm/build/agilebpm/agilebpm.umd.min.js'
  const formRef = ref()
  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()
  const id = proxy.$route.params.id

  const info: any = reactive({
    data: {
      id: '',
      code: '',
      type: '',
      name: '',
      desc: '',
      htmlTemplate: '',
      cardTemplate: '',
      //做数据转换使用
      cardTemplateObj: {
        cardTitle: '',
        cardUrl: '',
        cardContent: '',
      },
      appTemplate: '',
      templateParam: '',
      templateParamList: [
        {
          key: 'userName',
          value: '{userName}',
        },
      ],
      enabled: null,
    },
    activeName: 'first',
    subData: {},
  })

  //添加参数模板
  const addTemplateParam = () => {
    if (!info.data.templateParamList) {
      info.data.templateParamList = []
    }
    info.data.templateParamList.push({ key: '', value: '' })
  }

  //初始化数据
  const initTableData = (data: any) => {
    if (data.cardTemplate) {
      if (typeof data.cardTemplate == 'string') {
        data.cardTemplateObj = JSON.parse(data.cardTemplate)
      }
    } else {
      data.cardTemplateObj = {
        cardTitle: '',
        cardUrl: '',
        cardContent: '',
      }
    }

    if (data.templateParam) {
      if (typeof data.templateParam == 'string') {
        data.templateParamList = JSON.parse(data.templateParam)
      }
    } else {
      data.templateParamList = []
    }
  }

  // 保存前校验
  const beforeSave = () => {
    info.data.cardTemplate = JSON.stringify(info.data?.cardTemplateObj)

    if (info.data?.templateParamList.length > 0) {
      info.data.templateParam = JSON.stringify(info.data.templateParamList)
    } else {
      info.data.templateParam = ''
    }
    /*     info.data.htmlTemplate = escape2Html(info.data.htmlTemplate);
    info.subData = abUtil.clone(info.data)
    console.log('info.subData',info.subData) */
    return true
  }
  //参数添加
  const addParam = (type: any, param: any) => {
    info.data.cardTemplateObj[type] += `\${${param}}`
  }
  const addParamData = (type: any, param: any) => {
    info.data[type] += `\${${param}}`
  }

  const escape2Html = (str: any) => {
    let arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&' }
    return str.replace(
      /&(lt|gt|nbsp|amp);/gi,
      function (all: string, t: string) {
        return arrEntities[t]
      }
    )
  }
  const type = getCurrentInstance()?.proxy?.$route.query.type
</script>
