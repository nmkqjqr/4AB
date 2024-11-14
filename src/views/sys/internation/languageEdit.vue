<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="LanguageList"
        :form-ref="formRef"
        :save-data="info.data"
        :url="sysApi.sysLanguage.saveLanguage"
      />
      <ab-load v-model="info.data" :url="sysApi.sysLanguage.getLanguage" />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="info.data"
          status-icon="true"
        >
          <el-form-item
            :label="$abT('page.common.name','名称')"
            prop="name"
            :rules="[{ required: true, message: $abT('page.common.required','必填') }]"
          >
            <ab-pinyin
              v-model="info.data.name"
              v-model:to="info.data.key"
              placeholder=" "
            />
          </el-form-item>
          <el-form-item
            v-if="info.BizValidatorMap"
            :label="$abT('page.common.code','编码')"
            prop="key"
            :rules="[
              { required: true, message: $abT('page.common.required','必填') },
              info.BizValidatorMap.varirule.uiInfo,
            ]"
          >
            <el-input
              v-model="info.data.key"
              :disabled="$route.query.id"
              placeholder=" "
            />
          </el-form-item>
          <el-form-item
            :label="$abT('page.common.desc','描述')"
            prop="remark"
            :rules="[{ required: true, message: $abT('page.common.required','必填') }]"
          >
            <el-input v-model="info.data.remark" :rows="4" type="textarea" />
          </el-form-item>
          <el-form-item :label="$abT('page.common.enable','启用')" prop="enabled">
            <el-switch
              v-model="info.data.enabled"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { bizApi, sysApi } from '~/agilebpm'
  const formRef = ref()
  const info: any = reactive({
    BizValidatorMap: null,
    data: {
      name: '',
      key: '',
      remark: '',
      enabled: 1,
    },
  })
  bizApi.bizPattern.getAllBizValidator().then((data) => {
    info.BizValidatorMap = data
  })
</script>
