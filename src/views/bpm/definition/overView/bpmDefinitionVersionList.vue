<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-space>
        <el-button :icon="Back" type="primary" @click="back">{{ $abT('page.common.back','返回') }}</el-button>
        <!-- <el-button
          :disabled="!selectedData || selectedData.length == 0"
          :icon="Download"
          type="primary"
          @click="exportFn"
        >
          导出
        </el-button> -->
      </el-space>
    </div>

    <!-- 关键字段设置minwith，特定枚举字段设置with（管理列、日期、状态、字典等），
         不重要字段放最后，管理列设置 fixed="right"
    -->
    <ab-table
      ref="abTable"
      v-model="selectedData"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="bpmApi.bpmDefinition.bpmDefinitionListUrl"
    >
      <ab-column :label="$abT('page.wfDesign.wfName','流程名称')" min-width="120" prop="name" />
      <ab-column :label="$abT('page.wfDesign.wfCode','流程编码')" min-width="100" prop="key" />
      <ab-column :label="$abT('page.common.desc','描述')" min-width="150" prop="desc" />
      <ab-column
        :label="$abT('page.common.mobile','移动端')"
        width="130"
        ab-template="supportMobile"
      />
      <template #supportMobile="{ scope }">
        <el-tag v-if="scope.row.supportMobile === 1" type="success">{{ $abT('page.common.support','支持') }}</el-tag>
        <el-tag  v-if="scope.row.supportMobile === 0" type="info">{{ $abT('page.common.dontSupport','不支持') }}</el-tag>
      </template>
      <ab-column
        :label="$abT('page.common.status','状态')"
        width="100"
        ab-template="status"
      />
      <template #status="{ scope }">
        <el-tag v-if="scope.row.status === 'deploy'" type="success">{{ $abT('page.wfDesign.release','发布') }}</el-tag>
        <el-tag v-if="scope.row.status === 'forbidden'" type="danger">{{ $abT('page.wfDesign.disabled','禁用') }}</el-tag>
        <el-tag  v-if="scope.row.status === 'draft'" type="info">{{ $abT('page.wfDesign.draft','草稿') }}</el-tag>
      </template>
      <ab-column :label="$abT('page.wfDesign.edition','版本')"  prop="version" width="70" />
      <ab-column
        :label="$abT('page.wfDesign.isMain','主版本')"
        width="80"
        ab-template="isMain"
      />
      <template #isMain="{ scope }">
        <el-tag v-if="scope.row.isMain === 1" type="success">{{ $abT('page.common.yes','是') }}</el-tag>
        <el-tag v-if="scope.row.isMain === 0" type="info">{{ $abT('page.common.no','否') }}</el-tag>
      </template>
      <ab-column :label="$abT('page.wfDesign.sort','排序')" prop="sn" width="60" />
      <ab-column
        ab-date-formatter="yyyy-MM-dd"
        :label="$abT('page.common.updateTime','更新时间')"
        prop="updateTime"
        width="120"
      />
      <ab-column ab-template="edit" fixed="right" :label="$abT('page.common.operate','操作')" width="480" />
      <template #edit="{ scope }">
        <el-button
          v-show="scope.row.processEditor !== 'sim'"
          v-ab-btn-rights:bpmDefinition_preview
          text
          type="primary"
          @click="openOverView(scope.row)"
        >
          {{ $abT('page.wfDesign.previewConfig','配置预览') }}
        </el-button>

        <el-button text type="primary" @click="showDesign(scope.row)">
          {{ $abT('page.wfDesign.design','设计') }}
        </el-button>
        <router-link :to="`/bpm/flowStart/${scope.row.key}`">
          <el-button text type="primary">{{ $abT('page.wfDesign.startUp','启动') }}</el-button>
        </router-link>
        <el-button
          v-if="scope.row.isMain === 0"
          v-show="scope.row.processEditor !== 'sim'"
          v-ab-btn-rights:bpmDefinition_setMain
          text
          type="primary"
          @click="
            sendAction(
              bpmApi.bpmDefinition.bpmDefinitionSetMainUrl + scope.row.id,
               $abT('page.wfDesign.setMainMsg','确定把版本{a}设为主版本吗?',{a: scope.row.version})
            )
          "
        >
          {{ $abT('page.wfDesign.setMain','设为主版本') }}
        </el-button>
        <el-button
          v-if="scope.row.isMain === 0"
          v-show="scope.row.processEditor === 'sim'"
          v-ab-btn-rights:simDefinition_setMain
          text
          type="primary"
          @click="
            sendAction(
              bpmApi.bpmDefinition.bpmDefinitionSetMainUrl + scope.row.id,
               $abT('page.wfDesign.setMainMsg','确定把版本{a}设为主版本吗?',{a: scope.row.version})
            )
          "
        >
          {{ $abT('page.wfDesign.setMain','设为主版本') }}
        </el-button>
      </template>
    </ab-table>
    <bpm-definition-overall-view
      v-model="overViewInfo.isShow"
      :def-id="overViewInfo.defId"
      :title="overViewInfo.title"
    />
    <ab-designer
      v-if="designInfo.show"
      v-model="designInfo.show"
      :def-id="designInfo.defId"
      @close="closeDefinition()"
    />
  </div>
</template>

<script lang="ts">
  // eslint-disable-next-line no-unused-vars
  import { reactive, defineComponent, getCurrentInstance } from 'vue'
  import { abTableMix, bpmApi, abTools } from '~/agilebpm'
  import { Back, Download } from '@element-plus/icons-vue'
  import { useTabsStore } from '@/store/modules/tabs'
  import abDesigner from '~/agilebpm/build/flowDesigner.js'

  import { useZIndex } from 'element-plus'
  import { setupZIndex } from '~/agilebpm/build/flowDesigner.js'
  setupZIndex(useZIndex)

  import bpmDefinitionOverallView from './bpmDefinitionOverViewEdit.vue'

  export default defineComponent({
    name: 'BpmDefinitionVersionList',
    components: { bpmDefinitionOverallView, abDesigner },
    mixins: [abTableMix],
    setup() {
      // @ts-ignore
      const { proxy } = getCurrentInstance()
      const defKey = proxy.$route.query.key

      console.log(proxy.$router.getRoutes())

      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        name$VLK: '',
        key$VEQ: defKey,
        typeCode$VEQ: '',
        isVersions: true,
      })
      const designInfo = reactive({
        show: false,
        defId: '',
      })
      const { delVisitedRoute } = useTabsStore()
      const back = () => {
        proxy.$router ? proxy.$router.back() : window.history.back()
      }
      const overViewInfo = reactive({
        isShow: false,
        title: '',
        defId: '',
      })
      const openOverView = (bemDefiniton: any) => {
        overViewInfo.isShow = true
        overViewInfo.title = bemDefiniton.name
        overViewInfo.defId = bemDefiniton.id
      }
      //导出
      const exportFn = () => {
        const defIds = proxy.selectedData.map((row: any) => row.id).join(',')
        bpmApi.bpmDefinition.exportBpmDef(defIds, exportCallback)
      }
      //导出回调，刷新页面，去掉选中状态
      const exportCallback = () => {
        proxy.selectedData.splice(0, proxy.selectedData.length)
        proxy.search()
      }
      const showDesign = (row: any) => {
        if (row.processEditor == 'sim') {
          window.open(`/simpleWF?id=${row.id}&mode=diyBo`)
        } else {
          window.open(
            abTools.getResolveUrl(`/bpmDesigner?defId=${row.id}`, proxy)
          )
        }
      }
      const closeDefinition = () => {
        designInfo.show = false
        designInfo.defId = ''
        proxy.search()
      }
      return {
        query,
        bpmApi,
        Back,
        Download,
        back,
        openOverView,
        overViewInfo,
        showDesign,
        closeDefinition,
        exportFn,
        designInfo,
      }
    },
  })
</script>
