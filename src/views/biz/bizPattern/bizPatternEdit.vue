<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="BizPatternList"
        :form-ref="formRef"
        :save-data="info.data"
        :url="bizApi.bizPattern.BizPatternSave"
      />
      <ab-load v-model="info.data" :url="bizApi.bizPattern.BizPatternGet" />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          v-if="info.BizValidatorMap"
          ref="formRef"
          class="mt50"
          label-suffix="："
          label-width="200px"
          :model="info.data"
          :status-icon="false"
        >
          <el-form-item
            label="名称"
            prop="name"
            :rules="[{ required: true, message: '必填' }]"
          >
            <ab-pinyin v-model="info.data.name" v-model:to="info.data.code" />
          </el-form-item>
          <el-form-item
            label="编码"
            prop="code"
            :rules="[
              { required: true, message: '必填' },
              info.BizValidatorMap.varirule.rule,
            ]"
          >
            <ab-code v-model="info.data.code" :disabled="!!info.data.id" />
          </el-form-item>
          <el-form-item
            label="失败提示"
            prop="message"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="info.data.message" />
          </el-form-item>
          <el-form-item label="java正则表达式" prop="javaPattern">
            <el-col :span="10">
              <el-input v-model="info.data.javaPattern" />
            </el-col>
            <el-col :span="10" style="margin-left: 5px">
              <el-input
                v-if="info.data.javaPattern"
                v-model="info.javaText"
                placeholder="可输入文本测试正则表达式"
              />
            </el-col>
            <el-button
              v-if="info.data.javaPattern"
              plain
              style="margin-left: 5px"
              type="warning"
              @click="testJava"
            >
              测试
            </el-button>
          </el-form-item>
          <el-form-item label="前端js正则表达式" prop="uiPattern">
            <el-col :span="10">
              <el-input v-model="info.data.uiPattern" />
            </el-col>
            <el-col :span="10" style="margin-left: 5px">
              <el-input
                v-if="info.data.uiPattern"
                v-model="info.uiText"
                placeholder="可输入文本测试正则表达式"
              />
            </el-col>
            <el-button
              v-if="info.data.uiPattern"
              v-ab-btn-rights:bizPattern_test
              plain
              style="margin-left: 5px"
              type="warning"
              @click="testUi"
            >
              测试
            </el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { postData, bizApi } from '~/agilebpm'
  import { ElMessage } from 'element-plus'
  //import { abT } from '~/src/i18n'
  //import { t } from '~/src/i18n'

  //页面用到的所有信息必须放在这个参数之下，不然双向绑定会有很多问题！
  const info: any = reactive({
    data: {}, //数据对象
    BizValidatorMap: null,
  })
  const formRef = ref<FormInstance>()

  bizApi.bizPattern.getAllBizValidator().then((data) => {
    info.BizValidatorMap = data
    console.info(info.BizValidatorMap)
  })

  const testUi = () => {
    let p
    try {
      p = eval(`/${info.data.uiPattern}/`)
    } catch (e) {
      ElMessage({
        message: '正则表达式执行异常',
        type: 'error',
      })
      return
    }

    const b = p.test(info.uiText)
    if (b) {
      ElMessage({
        message: '校验成功',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '校验失败',
        type: 'error',
      })
    }
  }

  const testJava = () => {
    postData(bizApi.bizPattern.BizPatternTestJava, {
      javaPattern: info.data.javaPattern,
      javaText: info.javaText,
    }).then((resp) => {
      if (resp.data) {
        ElMessage({
          message: '校验成功',
          type: 'success',
        })
      } else {
        ElMessage({
          message: '校验失败',
          type: 'error',
        })
      }
    })
  }
</script>
