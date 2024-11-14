<template>
  <div style="padding: 20px; margin: 10px">
    <el-upload
      ref="upload"
      accept=".zip"
      action=""
      :auto-upload="true"
      class="upload-demo"
      :file-list="fileList"
      :http-request="importPreviewFn"
      :limit="1"
      :on-success="handleSuccess"
    >
      <template #trigger>
        <el-button :disabled="info.selectButtonDisable" type="primary">
          选择文件
        </el-button>
      </template>
      <el-button
        class="ml-3"
        :disabled="info.saveButtonDisable"
        :loading="info.saveLoading"
        style="margin-left: 15px"
        type="success"
        @click="importSaveFn"
      >
        保存
      </el-button>

      <el-button
        class="ml-3"
        style="margin-left: 15px"
        type="primary"
        @click="back()"
      >
        取消
      </el-button>

      <!-- <template #tip>
        <div class="el-upload__tip text-red">
          一次只能选择一个zip文件，多次选择会覆盖当前文件
        </div>
      </template> -->
    </el-upload>
    <el-card v-if="info.overViewData">
      <el-card
        v-for="(itemList, key) in info.overViewData"
        :key="key"
        style="margin-bottom: 20px"
      >
        <template #header>
          {{ key }}:
          <el-radio-group v-model="itemList[0].importType" class="ml-4">
            <el-radio label="newVersion" size="large">
              保存后发布新版本
            </el-radio>
            <el-radio v-if="itemList[1]" label="override" size="large">
              覆盖当前版本
            </el-radio>
          </el-radio-group>
        </template>
        <el-row :gutter="5">
          <el-col :span="8">
            <div class="grid-content ep-bg-purple-dark">
              新版本：{{ itemList[0].bpmDefinition.name }}--{{
                itemList[0].bpmDefinition.key
              }}
            </div>
          </el-col>
          <!-- <el-col v-if="itemList[1]" :span="2">
          <div class="grid-content ep-bg-purple-light">将会覆盖</div>
        </el-col> -->
          <el-col v-if="itemList[1]" :span="8">
            <div class="grid-content ep-bg-purple-light">
              老版本：{{ itemList[1].bpmDefinition.name }}--{{
                itemList[1].bpmDefinition.key
              }}
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="24">
            <el-table
              border
              :data="buildTableData(itemList[0].formInfo)"
              style="width: 100%"
              table-layout="auto"
            >
              <el-table-column label="业务对象" min-width="200px">
                <template #default="scope">
                  <el-tooltip
                    v-for="(bo, index) in scope.row.boList"
                    :key="index"
                    class="box-item"
                    :content="`code【${bo.code}】, ${
                      bo.exist ? '将覆盖已有的' : '新增'
                    }业务对象`"
                    effect="dark"
                    placement="top-start"
                  >
                    <el-tag
                      style="margin-right: 5px; margin-bottom: 5px"
                      :type="bo.exist ? 'warning' : 'success'"
                    >
                      {{ bo.name }}
                    </el-tag>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="表单" min-width="180">
                <template #default="scope">
                  <el-tooltip
                    v-for="(appForm, index) in scope.row.appFormList"
                    :key="index"
                    class="box-item"
                    :content="`code【${appForm.code}】, ${
                      appForm.exist ? '将覆盖已有的' : '新增'
                    }移动端表单`"
                    effect="dark"
                    placement="top-start"
                  >
                    <el-tag
                      style="margin-right: 5px; margin-bottom: 5px"
                      :type="appForm.exist ? 'warning' : 'success'"
                    >
                      {{ `移动端 / ${appForm.name}` }}
                    </el-tag>
                  </el-tooltip>
                  <el-tooltip
                    v-for="(pcForm, index) in scope.row.pcFormList"
                    :key="index"
                    class="box-item"
                    :content="`code【${pcForm.code}】, ${
                      pcForm.exist ? '将覆盖已有的' : '新增'
                    }pc端表单`"
                    effect="dark"
                    placement="top-start"
                  >
                    <el-tag
                      style="margin-right: 5px; margin-bottom: 5px"
                      :type="pcForm.exist ? 'warning' : 'success'"
                    >
                      {{ `pc端 / ${pcForm.name}` }}
                    </el-tag>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="业务实体" min-width="180" prop="name">
                <template #default="scope">
                  <el-tooltip
                    v-for="(table, index) in scope.row.tableList"
                    :key="index"
                    class="box-item"
                    :content="`code【${table.code}】, ${
                      table.exist ? '将覆盖已有的' : '新增'
                    }业务实体`"
                    effect="dark"
                    placement="top-start"
                  >
                    <el-tag
                      style="margin-right: 5px; margin-bottom: 5px"
                      :type="table.exist ? 'warning' : 'success'"
                    >
                      {{ `${table.name}` }}
                    </el-tag>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row v-if="itemList[0].formJson" :gutter="5">
          表单设计：
          <el-tag>{{ JSON.parse(itemList[0].formJson).name }}</el-tag>
        </el-row>
      </el-card>
    </el-card>

    <el-dialog
      append-to-body
      destroy-on-close
      :model-value="info.resultDialogShow"
      title="流程导入结果"
      width="40%"
    >
      <el-result :icon="info.resultType">
        <template #sub-title>
          <div style="margin-top: 15px">
            <el-row
              v-for="(msg, index) in info.dialogContent"
              :key="index"
              :gutter="5"
              style="text-align: left"
            >
              <el-col>{{ msg }}</el-col>
            </el-row>
          </div>
        </template>
      </el-result>
      <template #footer>
        <el-button type="primary" @click="back()">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import type {
    UploadInstance,
    UploadFile,
    UploadFiles,
    UploadRequestOptions,
    UploadUserFile,
  } from 'element-plus'
  import { bpmApi } from '~/agilebpm'
  import { useTabsStore } from '@/store/modules/tabs'

  const fileList = ref<UploadUserFile[]>([])

  const info: any = reactive({
    overViewData: '',
    saveButtonDisable: true,
    selectButtonDisable: false,
    saveData: [],
    resultDialogShow: false,
    dialogContent: [] as string[],
    resultType: 'success',
    saveLoading: false,
  })
  const vueInst = getCurrentInstance()

  //上传预览成功处理函数
  const handleSuccess = (
    response: any,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles
  ) => {
    fileList.value.splice(0, fileList.value.length)
    info.selectButtonDisable = false
  }
  //保存处理
  const importSaveFn = () => {
    info.saveLoading = true
    bpmApi.bpmDefinition.importSave(info.saveData).then(
      (res: any) => {
        //info.dialogContent = result.data
        if (res.isOk && res.data) {
          info.dialogContent.push(...res.data.split('<br/>'))
        } else {
          info.resultType = 'warning'
          info.dialogContent.push(res.msg)
        }
        info.saveLoading = false
        info.resultDialogShow = true
      },
      () => {
        info.saveLoading = false
      }
    )
  }

  const buildSaveData = (overViewData: any) => {
    info.overViewData = overViewData
    for (const key in overViewData) {
      info.saveData.push(overViewData[key][0])
    }
    if (info.saveData.length > 0) {
      info.saveButtonDisable = false
    }
  }
  //上传预览
  const importPreviewFn = (options: UploadRequestOptions) => {
    info.selectButtonDisable = true
    const formData = new FormData()
    formData.append('xmlFile', options.file)
    return bpmApi.bpmDefinition.importPreview(formData).then(
      (result) => {
        buildSaveData(result.data)
      },
      () => {}
    )
  }
  const { delVisitedRoute } = useTabsStore()
  const route = useRoute()
  const back = () => {
    info.resultDialogShow = false
    delVisitedRoute(route.path)
    vueInst?.proxy?.$router.push({
      name: 'BpmDefinitionList',
      query: { doRef: true },
    })
  }

  const isExist = (anyList: any[], any: any) => {
    const itemIndex = anyList.findIndex((e: any) => {
      return `${e.code}_${e.name}` === `${any.code}_${any.name}`
    })

    return itemIndex > -1
  }

  const buildTableData = (formInfo: any) => {
    if (!formInfo || formInfo.length === 0) {
      return
    }

    const boList = [] as any[]
    const tableList = [] as any[]
    const appFormList = [] as any[]
    const pcFormList = [] as any[]

    formInfo.forEach((e: any) => {
      if (e.objectInfo && !isExist(boList, e.objectInfo)) {
        boList.push(e.objectInfo)
      }
      if (e.appFormInfo && !isExist(appFormList, e.appFormInfo)) {
        appFormList.push(e.appFormInfo)
      }
      if (e.pcFormInfo && !isExist(pcFormList, e.pcFormInfo)) {
        pcFormList.push(e.pcFormInfo)
      }

      if (e.tableInfoList && e.tableInfoList.length > 0) {
        e.tableInfoList.forEach((taleE: any) => {
          if (!isExist(tableList, taleE)) {
            tableList.push(taleE)
          }
        })
      }
    })

    const result = [] as any[]

    result.push({
      boList: boList,
      tableList,
      appFormList,
      pcFormList,
    })

    return result
  }
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    min-height: 36px;
    border-radius: 4px;
  }

  .resultCss {
    width: 1000px !important;
  }
</style>
