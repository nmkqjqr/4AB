<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="SerialList"
        :before-save-fn="beforeSave"
        :form-ref="formRef"
        :save-data="info.data"
        :url="sysApi.serialNo.saveserialNo"
      />
      <ab-load v-model="info.data" :url="sysApi.serialNo.getserialNo" />
      <el-button
        v-ab-btn-rights:serialNo_preview
        v-if="id"
        class="perBtn"
        :icon="View"
        type="primary"
        @click="fetchData"
      >
        预览
      </el-button>
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
            label="流水号名称"
            prop="name"
            :rules="[{ required: true, message: '必填' }]"
          >
            <ab-pinyin
              v-model="info.data.name"
              v-model:to="info.data.code"
              placeholder="请输入流水号名称"
            />
          </el-form-item>
          <el-form-item
            v-if="info.BizValidatorMap.varirule"
            label="流水号别名"
            prop="code"
            :rules="[
              { required: true, message: '必填' },
              info.BizValidatorMap.varirule.rule,
            ]"
          >
            <el-input
              v-model="info.data.code"
              :disabled="info.data.id"
              :maxlength="64"
              placeholder="请输入流水号别名"
            />
          </el-form-item>
          <el-form-item
            label="流水号规则"
            prop="rule"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="info.data.rule" placeholder="请输入流水号规则" />
          </el-form-item>
          <el-form-item label="重编规则" prop="reviveRuleList">
            <el-select
              v-model="info.data.reviveRuleList"
              multiple
              style="width: 500px"
            >
              <el-option
                v-for="(item, index) in allReviveRuleList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="流水号长度"
            prop="noLength"
            :rules="[
              { required: true, message: '必填' },
              { validator: checknoLength, trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="info.data.noLength"
              placeholder="请输入流水号长度"
            />
          </el-form-item>
          <el-form-item
            label="初始值"
            prop="initialValue"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input-number
              v-model="info.data.initialValue"
              controls-position="right"
              :min="0"
              placeholder="请输入初始值"
            />
          </el-form-item>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1" title="高级设置">
              <el-form-item label="groovy脚本" prop="paramScript">
                <codemirror
                  v-model="info.data.paramScript"
                  :autofocus="true"
                  :indent-with-tab="true"
                  placeholder="请输入groovy代码（类java语言）"
                  :style="{
                    height: `200px`,
                    border: `1px solid #e4e7ed`,
                    width: `500px`,
                  }"
                />
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-scrollbar>
    </el-main>
    <Preview ref="previewRef" />
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import Preview from './components/preview'
  import { abUtil, sysApi, bizApi, abTools } from '~/agilebpm'
  import { View, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
  import { Codemirror } from 'vue-codemirror'
  const { proxy } = abTools.useCurrentInstance()

  const checknoLength = (rule: any, value: any, callback: any) => {
    if (!value) {
      return callback(new Error('流水号长度不能为空'))
    }
    setTimeout(() => {
      if (value > 1 || value == 1) {
        callback()
      } else {
        callback(new Error('输入的值不能小于1'))
      }
    }, 100)
  }
  const checkstepLength = (rule: any, value: any, callback: any) => {
    if (!value) {
      return callback(new Error('步长不能为空'))
    }
    setTimeout(() => {
      if (value > 1 || value == 1) {
        callback()
      } else {
        callback(new Error('输入的值不能小于1'))
      }
    }, 100)
  }
  const formRef = ref()
  const previewRef = ref()
  const id = proxy.$route.query.id
  const info: any = reactive({
    BizValidatorMap: {} as any,
    data: {
      name: '',
      code: '',
      rule: '{yyyy}{MM}{DD}{NO}',
      reviveRule: '',
      noLength: '5',
      initialValue: '1',
      stepLength: '1',
      reviveRuleList: [],
      paramScript: '',
    },
    showAdvancedSetting: false,
  })
  const activeNames = ref(['0'])
  watch(
    () => info.data.paramScript,
    () => {
      if (activeNames.value[0] == '1') {
        return
      }
      if (info.data.paramScript) {
        activeNames.value = ['1']
      }
    }
  )

  const getReviveRuleList = (reviveRuleStr: string) => {
    const patternStr = /\{(.+?)\}/g
    let rule = null
    const result = []
    const noUseRule = ['NO', 'no']
    do {
      rule = patternStr.exec(reviveRuleStr)
      if (rule && !noUseRule.includes(rule[1])) {
        result.push(rule[0])
      }
    } while (rule)
    return result
  }

  watch(
    () => info.data.reviveRule,
    (newValue) => {
      info.data.reviveRuleList = getReviveRuleList(newValue)
    },
    { immediate: true }
  )

  const allReviveRuleList = computed(() => {
    return getReviveRuleList(info.data.rule)
  })

  const beforeSave = () => {
    if (info.data.reviveRuleList) {
      info.data.reviveRule = info.data.reviveRuleList.join('-')
    }
  }

  bizApi.bizPattern.getAllBizValidator().then((data) => {
    info.BizValidatorMap = data
  })
  const fetchData = async () => {
    previewRef.value.loadingopenFn(info.data)
    previewRef.value.loadingcloseFn()
  }
</script>
<style lang="scss" scoped>
  .pad {
    padding: 0px 0px 0 120px;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 1px;
  }
  .perBtn {
    margin-left: 12px;
  }
</style>
