<template>
  <div v-if="directorId" class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            label-position="left"
            :model="query"
            @submit.prevent
          >
            <el-form-item
              :label="$abT('page.businessMatrix.businessPK','业务主键')"
              min-width="120px"
              prop="busKey$VLK"
            >
              <el-input
                v-model="query.busKey$VLK"
                :placeholder="$abT('page.businessMatrix.enterBusinessPK','请输入业务主键')"
              />
            </el-form-item>
            <el-form-item
              :label="$abT('page.businessMatrix.businessName','业务名称')"
              min-width="120px"
              prop="busName$VLK"
            >
              <el-input
                v-model="query.busName$VLK"
                :placeholder="$abT('page.businessMatrix.enterBusinessName','请输入业务名称')"
              />
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
            <ab-cust-dialog
              v-ab-btn-rights:busMatrixEntry_add
              v-if="matrixInfo.datasourceKey"
              :dialog-key="matrixInfo.datasourceKey"
              type="primary"
              @ok="addBusFn"
            >
              {{ $abT('page.common.add','添加') }}
            </ab-cust-dialog>
            <el-button :icon="Back" type="primary" @click="back">
              {{ $abT('page.common.back','返回') }}
            </el-button>
          </el-space>
        </el-col>
      </el-row>
    </div>

    <ab-table
      ref="abTable"
      v-model="selectedData"
      :checkable="false"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="bpmApi.bpmPluginMatrix.matrixEntryListUrl"
    >
      <ab-column :label="$abT('page.businessMatrix.businessName','业务名称')" min-width="120" prop="busName" />
      <ab-column :label="$abT('page.businessMatrix.businessPK','业务主键')" min-width="100" prop="busKey" />
      <ab-column :label="$abT('page.common.updateTime','更新时间')" prop="updateTime" width="160" />
      <ab-column ab-template="edit" fixed="right" :label="$abT('page.common.operate','操作')" width="110" />
      <template #edit="{ scope }">
        <el-button
          v-ab-btn-rights:busMatrixEntry_del
          text
          type="primary"
          @click="
            sendAction(
              bpmApi.bpmPluginMatrix.matrixEntryDeleteUrl + scope.row.id,
              $abT('page.common.delMsg','确定删除 {a} 吗？',{a:scope.row.busName})
            )
          "
        >
          {{ $abT('page.common.del','删除') }}
        </el-button>
      </template>
    </ab-table>
    <Preview ref="previewRef" />
  </div>
</template>

<script lang="ts">
  import { ref, reactive, defineComponent, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import { abTableMix, bpmApi } from '~/agilebpm'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    Back,
    RefreshRight,
  } from '@element-plus/icons-vue'
  import { useTabsStore } from '@/store/modules/tabs'
  import { abT } from '~/src/i18n'
  export default defineComponent({
    name: 'BusMatrixEntryList',
    mixins: [abTableMix],
    setup() {
      //引入 当前实例
      // @ts-ignore
      const { proxy } = getCurrentInstance()
      const directorId = proxy.$route.query.id
      const matrixId = proxy.$route.query.matrixId
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        busKey$VLK: '',
        busName$VLK: '',
        reportLine$VEQ: directorId,
      })

      const matrixInfo = reactive({
        datasourceKey: '',
        dataNameFiled: '',
        dataKeyFiled: '',
      })
      const getDatasourceKey = () => {
        if (!matrixId) {
          return
        }
        bpmApi.bpmPluginMatrix.getMatrixInfo(matrixId).then(
          (result: any) => {
            matrixInfo.datasourceKey = result.data.datasourceKey
            matrixInfo.dataNameFiled = result.data.dataNameFiled
            matrixInfo.dataKeyFiled = result.data.dataKeyFiled
          },
          () => {
            ElMessage.error(abT('page.businessMatrix.failedWithPK','获取id为{a}的矩阵失败',{a:matrixId}))
          }
        )
      }
      getDatasourceKey()
      const { delVisitedRoute } = useTabsStore()
      const route = useRoute()
      const back = () => {
        delVisitedRoute(route.path)
        proxy.$router.push({
          name: 'BusMatrixDirectorList',
          query: {
            _ab_table_reload: true,
            matrixId: proxy.$route.query.matrixId,
          },
        })
      }
      const addBusFn = (list: any) => {
        if (!list || list.length == 0) {
          return
        }
        const entryList = []
        for (const index in list) {
          const row = list[index]
          entryList.push({
            busName: row[matrixInfo.dataNameFiled],
            busKey: row[matrixInfo.dataKeyFiled],
            matrixId: matrixId,
            reportLine: directorId,
          })
        }
        bpmApi.bpmPluginMatrix.batchSaveData(entryList).then((result: any) => {
          ElMessage.success(result.data)
          proxy.search()
        })
      }
      return {
        query,
        bpmApi,
        Delete,
        Edit,
        Search,
        Plus,
        RefreshRight,
        directorId,
        Back,
        back,
        matrixInfo,
        addBusFn,
      }
    },
  })
</script>
