<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="BusMatrixList"
        :before-save-fn="beforesave"
        :form-ref="formRef"
        :save-data="info.data"
        :url="bpmApi.bpmPluginMatrix.matrixSaveUrl"
      />
      <ab-load v-model="info.data" :url="bpmApi.bpmPluginMatrix.matrixGetUrl" />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          :model="info.data"
          :status-icon="false"
        >
          <el-form-item
            :label="$abT('page.businessMatrix.businessName','业务名称')"
            label-width="120px"
            :placeholder="$abT('page.businessMatrix.enterBusinessName','请输入业务名称')"
            prop="name"
            :rules="[{ required: true, message: $abT('rules.required','必填') }]"
          >
            <el-input v-model="info.data.name" />
          </el-form-item>
          <el-form-item
            :label="$abT('page.businessMatrix.dataSourceInfo','数据源信息')"
            label-width="120px"
            :placeholder="$abT('page.businessMatrix.selectDialog','请选择一个对话框')"
            prop="datasourceKey"
            :rules="[{ required: true, message: $abT('rules.required','必填') }]"
          >
            <el-row :gutter="5">
              <el-col :span="8">
                <el-input
                  v-model="info.data.datasourceKey"
                  :disabled="true"
                  :placeholder="$abT('page.businessMatrix.dataSourceKey','数据源Key')"
                />
              </el-col>
              <el-col :span="8">
                <el-input
                  v-model="info.data.datasourceName"
                  :disabled="true"
                  :placeholder="$abT('page.businessMatrix.dataSourceName','数据源名称')"
                />
              </el-col>
              <el-col :span="8">
                <ab-cust-dialog
                  dialog-key="custDialog"
                  type="primary"
                  @ok="selectDialog"
                >
                  {{ $abT('page.common.choose','请选择') }}
                </ab-cust-dialog>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item
            :label="$abT('page.businessMatrix.businessNameField','业务名称字段')"
            label-width="120px"
            prop="dataNameFiled"
            :rules="[{ required: true, message: $abT('rules.required','必填') }]"
          >
            <el-select
              v-model="info.data.dataNameFiled"
              :placeholder="$abT('page.businessMatrix.businessNameField','业务名称字段')"
            >
              <el-option
                v-for="(item, index) in info.dialogInfo.dataField"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$abT('page.businessMatrix.businessPKField	','业务主键字段')"
            label-width="120px"
            prop="dataKeyFiled"
            :rules="[{ required: true, message: $abT('rules.required','必填') }]"
          >
            <el-select
              v-model="info.data.dataKeyFiled"
              :placeholder="$abT('page.businessMatrix.selectbusPKField	','请选择业务主键字段')"
            >
              <el-option
                v-for="(item, index) in info.dialogInfo.dataField"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$abT('page.businessMatrix.reporteLineSet','汇报线设置')"
            label-width="120px"
            prop="reportLine"
            :rules="[{ required: true, message: $abT('rules.required','必填') }]"
          >
            <el-button
              style="margin-left: 10px"
              type="primary"
              @click="addReportLine()"
            >
              {{ $abT('page.common.add','添加') }}
            </el-button>
            <el-table
              v-if="info.data.reportLine.length > 0"
              :data="info.data.reportLine"
              :show-header="false"
            >
              <el-table-column label="">
                <template #default="scope">
                  <el-input v-model="info.data.reportLine[scope.$index]" />
                  <el-button
                    style="margin-left: 10px"
                    text
                    type="primary"
                    @click="removeReportLine(scope.$index)"
                  >
                    {{ $abT('page.common.del','删除') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item
            :label="$abT('page.businessMatrix.isEnabled','是否启用')"
            label-width="120px"
            prop="dataKeyFiled"
            :rules="[{ required: true, message: $abT('rules.required','必填') }]"
          >
            <el-switch
              v-model="info.data.enabled"
              active-color="#13ce66"
              :active-value="1"
              inactive-color="#ff4949"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item
            :label="$abT('page.common.remark','备注')"
            label-width="120px"
            :placeholder="$abT('page.common.enterNot','请输入备注')"
            prop="desc"
            :rules="[{ required: true, message: $abT('rules.required','必填') }]"
          >
            <el-input v-model="info.data.desc" type="textarea" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { bpmApi, bizApi } from '~/agilebpm'
  import { ElMessage } from 'element-plus'
  import { checkIsPublicProject } from '~/agilebpm/utils/ab-util'
  import {abT} from "@/i18n";
  checkIsPublicProject()

  const formRef = ref()
  const info: any = reactive({
    data: {
      id: '',
      name: '',
      dataKeyFiled: '',
      dataNameFiled: '',
      datasourceName: '',
      datasourceKey: '',
      reportLine: [],
      reportLineStr: '',
      enabled: 1,
      desc: '',
    },
    dialogInfo: {
      code: '',
      name: '',
      dataField: [],
    },
  })
  const addReportLine = () => {
    info.data.reportLine.push('')
  }
  const removeReportLine = (index: number) => {
    info.data.reportLine.splice(index, 1)
  }
  const selectDialog = (list: any) => {
    info.data.datasourceKey = list[0].code
    info.data.datasourceName = list[0].name
  }
  const getDataFiled = async (dialogKey: string) => {
    if (!dialogKey) {
      return
    }
    const result: any = await bizApi.customDialog.getDialogByCode(dialogKey)
    info.dialogInfo.dataField.splice(0, info.dialogInfo.dataField.length)
    if (result.isOk && result.data) {
      result.data.returnFields.forEach((item: any) => {
        info.dialogInfo.dataField.push({
          label: `${item.showName}(${item.returnName})`,
          value: item.returnName,
        })
      })
    } else {
      ElMessage.error(abT('page.businessMatrix.getDialogFailed','获取{a}对话框失败',{a:info.datasourceKey}))
    }
  }
  watch(
    () => info.data.datasourceKey,
    (newValue) => {
      getDataFiled(newValue)
    },
    { immediate: true }
  )

  const beforesave = () => {
    info.data.reportLineStr = info.data.reportLine.join(',')
  }
</script>
