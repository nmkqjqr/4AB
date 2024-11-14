<template>
  {{ bpmDefinitionListUrl }}{{ query }}
  <div class="comprehensive-table-container">
    <ab-table
      ref="abTable"
      v-model="selectedData"
      :height="tableHeight"
      :checkable="false"
      :query-param="query"
      row-key="id"
      :url="bpmDefinitionListUrl"
    >
      <ab-column
        :label="$abT('page.wfDesign.wfName', '流程名称')"
        min-width="120"
        prop="name"
      />
      <ab-column
        :label="$abT('page.wfDesign.wfCode', '流程编码')"
        min-width="100"
        prop="key"
      />
      <ab-column
        :label="$abT('page.common.desc', '描述')"
        min-width="150"
        prop="desc"
      />
      <ab-column
        :label="$abT('page.common.mobile', '移动端')"
        width="130"
        ab-template="supportMobile"
      />
      <template #supportMobile="{ scope }">
        <el-tag v-if="scope.row.supportMobile === 1" type="success">
          {{ $abT('page.common.support', '支持') }}
        </el-tag>
        <el-tag v-if="scope.row.supportMobile === 0" type="info">
          {{ $abT('page.common.dontSupport', '不支持') }}
        </el-tag>
      </template>
      <ab-column
        :label="$abT('page.common.status', '状态')"
        width="100"
        ab-template="status"
      />
      <template #status="{ scope }">
        <el-tag v-if="scope.row.status === 'deploy'" type="success">
          {{ $abT('page.wfDesign.release', '发布') }}
        </el-tag>
        <el-tag v-if="scope.row.status === 'forbidden'" type="danger">
          {{ $abT('page.wfDesign.disabled', '禁用') }}
        </el-tag>
        <el-tag v-if="scope.row.status === 'draft'" type="info">
          {{ $abT('page.wfDesign.draft', '草稿') }}
        </el-tag>
      </template>
      <ab-column
        :label="$abT('page.wfDesign.edition', '版本')"
        prop="version"
        width="70"
      />
      <ab-column
        :label="$abT('page.wfDesign.isMain', '主版本')"
        width="80"
        ab-template="isMain"
      />
      <template #isMain="{ scope }">
        <el-tag v-if="scope.row.isMain === 1" type="success">
          {{ $abT('page.common.yes', '是') }}
        </el-tag>
        <el-tag v-if="scope.row.isMain === 0" type="info">
          {{ $abT('page.common.no', '否') }}
        </el-tag>
      </template>
      <ab-column
        :label="$abT('page.wfDesign.sort', '排序')"
        prop="sn"
        width="60"
      />
      <ab-column
        ab-date-formatter="yyyy-MM-dd"
        :label="$abT('page.common.updateTime', '更新时间')"
        prop="updateTime"
        width="120"
      />
      <ab-column
        ab-template="edit"
        fixed="right"
        :label="$abT('page.common.operate', '操作')"
        width="480"
      />
      <template #edit="{ scope }">
        <el-button
          v-if="scope.row.isMain === 0"
          v-show="scope.row.processEditor !== 'sim'"
          v-ab-btn-rights:bpmDefinition_setMain
          text
          type="primary"
          @click="
            sendAction(
              bpmDefinitionSetMainUrl + scope.row.id,
              $abT('page.wfDesign.setMainMsg', '确定把版本{a}设为主版本吗?', {
                a: scope.row.version,
              })
            )
          "
        >
          {{ $abT('page.wfDesign.setMain', '设为主版本') }}
        </el-button>
        <el-button
          v-if="scope.row.isMain === 0"
          v-show="scope.row.processEditor === 'sim'"
          v-ab-btn-rights:simDefinition_setMain
          text
          type="primary"
          @click="
            sendAction(
              bpmDefinitionSetMainUrl + scope.row.id,
              $abT('page.wfDesign.setMainMsg', '确定把版本{a}设为主版本吗?', {
                a: scope.row.version,
              })
            )
          "
        >
          {{ $abT('page.wfDesign.setMain', '设为主版本') }}
        </el-button>
      </template>
    </ab-table>

    <!-- <ab-designer
      v-if="designInfo.show"
      v-model="designInfo.show"
      :def-id="designInfo.defId"
      @close="closeDefinition()"
    /> -->
  </div>
</template>

<script lang="ts">
  import { reactive, defineComponent, getCurrentInstance } from 'vue'
  import { abTools } from '~/agilebpm'
  import abTableMix from '../../ab-core/components/ab-table/ab-table-mix.vue'
  import {
    bpmDefinitionSetMainUrl,
    bpmDefinitionListUrl,
  } from '../../../api/modules/ab-bpm/bpm-definition'
  import { Back, Download } from '@element-plus/icons-vue'
  import abDesigner from '~/agilebpm/build/flowDesigner.js'

  export default defineComponent({
    name: 'FlowVersion',
    components: { abDesigner },
    mixins: [abTableMix],
    props: {
      defKey: String,
    },
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        name$VLK: '',
        key$VEQ: '',
        typeCode$VEQ: '',
        isVersions: true,
      })
      const designInfo = reactive({
        show: false,
        defId: '',
      })

      return {
        query,
        bpmDefinitionSetMainUrl,
        bpmDefinitionListUrl,
        Back,
        Download,

        designInfo,
      }
    },
  })
</script>
