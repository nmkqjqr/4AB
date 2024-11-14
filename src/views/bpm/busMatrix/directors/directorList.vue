<template>
  <div v-if="matrixId" class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            :model="query"
            @submit.prevent
          >
            <el-form-item :label="$abT('page.common.desc','描述')" prop="desc$VLK">
              <el-input v-model="query.desc$VLK" :placeholder="$abT('page.common.enterDesc','请输入描述')" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="search()">
                {{ $abT('page.common.search',  '查询' ) }}
              </el-button>
              <el-button :icon="RefreshRight" @click="reset()">{{ $abT('page.common.reset','重置') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="left-panel">
          <el-space>
            <router-link
              v-ab-btn-rights:busMatrixDirectors_add
              :to="{
                name: 'BusMatrixDirectorEdit',
                query: { matrixId: matrixId },
              }"
            >
              <el-button :icon="Plus" type="primary"> {{ $abT('page.common.add','添加') }}</el-button>
            </router-link>
            <el-button
              v-ab-btn-rights:busMatrixDirectors_del
              :disabled="!selectedData || selectedData.length === 0"
              :icon="Delete"
              type="danger"
              @click="
                delBySeletedIds(bpmApi.bpmPluginMatrix.matrixDirectorDeleteUrl)
              "
            >
              {{ $abT('page.common.batchDel','批量删除') }}
            </el-button>
            <el-button
              v-ab-btn-rights:busMatrixDirectors_export
              :disabled="!selectedData || selectedData.length === 0"
              :icon="Download"
              type="primary"
              @click="exportData"
            >
              {{ $abT('page.common.export','导出') }}
            </el-button>
            <el-button
              v-ab-btn-rights:busMatrixDirectors_exportTemplate
              :icon="Download"
              type="primary"
              @click="
                bpmApi.bpmPluginMatrix.matrixDirectorExportTemplate(matrixId)
              "
            >
              {{ $abT('page.common.exportTemplate','导出模版') }}
            </el-button>
            <el-button
              v-ab-btn-rights:busMatrixDirectors_import
              :icon="Upload"
              type="primary"
              @click="dialogInfo.visible = true"
            >
              {{ $abT('page.common.import','导入') }}
            </el-button>
            <el-button :icon="Back" type="primary" @click="back">
              {{ $abT('page.businessMatrix.backMatrix','返回矩阵') }}
            </el-button>
          </el-space>
        </el-col>
      </el-row>
    </div>

    <ab-table
      ref="abTable"
      v-model="selectedData"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="bpmApi.bpmPluginMatrix.matrixDirectorListUrl"
    >
      <ab-column :label="$abT('page.common.desc','描述')" min-width="80" prop="desc" />
      <ab-column :label="$abT('page.businessMatrix.reportLineSet','汇报线设置')" min-width="120" prop="reportLineStr" />
      <ab-column :label="$abT('page.common.updateTime','更新时间')" prop="updateTime" width="160" />
      <ab-column ab-template="edit" fixed="right" :label="$abT('page.common.operate','操作')" width="320" />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:busMatrixDirectors_edit
          :to="{
            name: 'BusMatrixDirectorEdit',
            query: { id: scope.row.id, matrixId: scope.row.matrixId },
          }"
        >
          <el-button text type="primary">{{ $abT('page.common.edit','编辑') }}</el-button>
        </router-link>
        <router-link
          v-ab-btn-rights:busMatrixEntry_listJson
          :to="{
            name: 'BusMatrixEntryList',
            query: { id: scope.row.id, matrixId: scope.row.matrixId },
          }"
        >
          <el-button text type="primary">{{ $abT('page.businessMatrix.functionalDistribution','业务分配') }}</el-button>
        </router-link>
        <el-button
          v-ab-btn-rights:busMatrixDirectors_del
          text
          type="primary"
          @click="
            sendAction(
              bpmApi.bpmPluginMatrix.matrixDirectorDeleteUrl + scope.row.id,
               $abT('page.common.delMsg','确定删除 {a} 吗？',{a:scope.row.desc})
            )
          "
        >
          {{ $abT('page.common.del','删除') }}
        </el-button>
      </template>
    </ab-table>
    <el-dialog v-model="dialogInfo.visible" :title="$abT('page.businessMatrix.importBusData','导入业务数据')" width="30%">
      <el-upload
        ref="uploadRef"
        accept=".xls"
        action="#"
        :auto-upload="false"
        class="upload-demo"
        :file-list="dialogInfo.fileList"
        :http-request="importData"
        :limit="1"
        :on-exceed="handleExceed"
      >
        <template #trigger>
          <el-button type="primary">{{ $abT('page.common.selectFile','选择文件') }}</el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">{{ $abT('page.common.pleaseSelectFile','请选择.xls，.xlsx文件') }}</div>
        </template>
      </el-upload>

      <div>
        <h4>{{ $abT('page.businessMatrix.importInstructions','导入说明：') }}</h4>

        <ol>
          <li>{{ $abT('page.businessMatrix.importTittle','请使用导入模板导入') }}</li>
          <li>
            {{ $abT('page.businessMatrix.importMsg1',' 汇报线设置是按照业务描述为唯一键，如果汇报线的业务描述不同，人员设置相同，则是两条汇报线') }}
          </li>
          <li>
            {{ $abT('page.businessMatrix.importMsg2','业务数据是按照业务主键为唯一键，如果业务主键不同，其他设置相同，则是两条业务数据') }}
          </li>
          <li>
            {{ $abT('page.businessMatrix.importMsg3','导入数据支持汇报线和业务数据一对多，只要不同的业务的业务描述和相关的人员设置保持一致就可以') }}
          </li>
          <li>
            {{ $abT('page.businessMatrix.importMsg4','如果出现业务数据重复，业务主键一样，其他不同，按照最后一条数据进行更新') }}
          </li>
        </ol>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogInfo.visible = false">{{ $abT('page.common.cancel','取消') }}</el-button>
          <el-button type="primary" @click="dialogOkey">{{ $abT('page.common.ok','确定') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { ref, reactive, defineComponent, getCurrentInstance } from 'vue'
  import { abTableMix, bpmApi } from '~/agilebpm'
  import {
    Delete,
    Search,
    Plus,
    RefreshRight,
    Download,
    Upload,
    Back,
  } from '@element-plus/icons-vue'

  import { useTabsStore } from '@/store/modules/tabs'
  import { genFileId } from 'element-plus'
  import type {
    UploadInstance,
    UploadProps,
    UploadRawFile,
    UploadRequestOptions,
  } from 'element-plus'
  export default defineComponent({
    name: 'BusMatrixDirectorList',
    mixins: [abTableMix],
    setup() {
      //引入 当前实例
      // @ts-ignore
      const { proxy } = getCurrentInstance()
      const matrixId = proxy.$route.query.matrixId
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        desc$VLK: '',
        code$VLK: '',
        matrixId$VEQ: matrixId,
      })
      const uploadRef = ref<UploadInstance>()
      const dialogInfo: any = reactive({
        visible: false,
        fileList: [],
      })
      const { delVisitedRoute } = useTabsStore()
      const route = useRoute()
      const back = () => {
        delVisitedRoute(route.path)
        proxy.$router.push({
          name: 'BusMatrixList',
          query: { _ab_table_reload: true },
        })
      }
      const exportData = () => {
        const defIds = proxy.selectedData.map((row: any) => row.id).join(',')
        bpmApi.bpmPluginMatrix.matrixDirectorExportData(defIds, exportCallback)
      }
      //导出回调，刷新页面，去掉选中状态
      const exportCallback = () => {
        proxy.selectedData.splice(0, proxy.selectedData.length)
        proxy.search()
      }

      const importCallback = () => {
        dialogInfo.fileList.splice(0, dialogInfo.fileList.length)
        proxy.search()
      }

      const handleExceed: UploadProps['onExceed'] = (files: any) => {
        uploadRef.value?.clearFiles()
        const file = files[0] as UploadRawFile
        file.uid = genFileId()
        uploadRef.value?.handleStart(file)
      }
      const importData = (options: UploadRequestOptions) => {
        const formData = new FormData()
        formData.append('file', options.file)
        formData.append('matrixId', matrixId)
        return bpmApi.bpmPluginMatrix.matrixDirectorImportData(
          formData,
          importCallback
        )
      }

      const dialogOkey = () => {
        dialogInfo.visible = false
        uploadRef.value?.submit()
      }

      return {
        query,
        bpmApi,
        Delete,
        Download,
        Upload,
        Search,
        Plus,
        RefreshRight,
        matrixId,
        Back,
        back,
        exportData,
        dialogInfo,
        importData,
        dialogOkey,
        uploadRef,
        handleExceed,
      }
    },
  })
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
  ol li {
    margin-top: 10px;
  }
</style>
