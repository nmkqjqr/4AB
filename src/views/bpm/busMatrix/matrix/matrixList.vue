<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            :model="query"
            @submit.prevent
          >
            <el-form-item :label="$abT('page.businessMatrix.businessName','业务名称')" label-width="120px" prop="name$VLK">
              <el-input v-model="query.name$VLK" :placeholder="$abT('page.businessMatrix.enterBusinessName','请输入业务名称')" />
            </el-form-item>
            <el-form-item :label="$abT('page.common.status','状态')" label-width="62px" prop="enabled$NEQ">
              <el-select v-model="query.enabled$NEQ"  :placeholder="$abT('page.common.all','全部')" clearable>
                <el-option :label="$abT('page.common.disable','禁用')" value="0" />
                <el-option :label="$abT('page.common.enable','启用')" value="1" />
              </el-select>
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
              v-ab-btn-rights:busMatrix_add
              :to="{ name: 'BusMatrixEdit' }"
            >
              <el-button :icon="Plus" type="primary">{{ $abT('page.common.add','添加') }}</el-button>
            </router-link>
            <el-button
              v-ab-btn-rights:busMatrix_del
              :disabled="!selectedData || selectedData.length === 0"
              :icon="Delete"
              type="danger"
              @click="delBySeletedIds(bpmApi.bpmPluginMatrix.matrixDeleteUrl)"
            >
              {{ $abT('page.common.batchDel','批量删除') }}
            </el-button>
          </el-space>
        </el-col>
      </el-row>
    </div>

    <ab-table
      ref="abTable"
      v-model="selectedData"
      :checkable="true"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="bpmApi.bpmPluginMatrix.matrixListUrl"
    >
      <ab-column :label="$abT('page.businessMatrix.businessName','业务名称')" min-width="120" prop="name" />
      <ab-column :label="$abT('page.common.desc','描述')" min-width="120" prop="desc" />
      <ab-column :label="$abT('page.businessMatrix.dataSourceKey','数据源Key')" min-width="120" prop="datasourceKey" />
      <ab-column
        :label="$abT('page.common.status','状态')"
        min-width="80"
        ab-template="status"
      />
      <template #status="{ scope }">
        <el-tag v-if="scope.row.enabled === 0" type="danger">{{ $abT('page.common.disable','禁用') }}</el-tag>
        <el-tag  v-if="scope.row.enabled === 1" type="success">{{ $abT('page.common.enable','启用') }}</el-tag>
      </template>
      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        :label="$abT('page.common.updateTime','更新时间')"
        min-width="120"
        prop="updateTime"
      />
      <ab-column :label="$abT('page.common.updater','更新人')" min-width="120" prop="updater" />
      <ab-column ab-template="edit" fixed="right" :label="$abT('page.common.operate','操作')" width="320" />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:busMatrixDirectors_queryData
          :to="{
            name: 'BusMatrixDirectorList',
            query: { matrixId: scope.row.id },
          }"
        >
          <el-button text type="primary">{{ $abT('page.businessMatrix.matrixMaintenance','矩阵维护') }}</el-button>
        </router-link>
        <router-link
          v-ab-btn-rights:busMatrix_edit
          :to="{ name: 'BusMatrixEdit', query: { id: scope.row.id } }"
        >
          <el-button text type="primary">{{ $abT('page.common.edit','编辑') }}</el-button>
        </router-link>
        <el-button
          v-ab-btn-rights:busMatrix_del
          text
          type="primary"
          @click="
            sendAction(
              bpmApi.bpmPluginMatrix.matrixDeleteUrl + scope.row.id,
               $abT('page.common.delMsg','确定删除 {a} 吗？', { a: scope.row.name })
            )
          "
        >
          {{ $abT('page.common.del','删除') }}
        </el-button>
      </template>
    </ab-table>
  </div>
</template>

<script lang="ts">
  import { ref, reactive, defineComponent } from 'vue'
  import { abTableMix, bpmApi } from '~/agilebpm'
  import { Delete, Search, Plus, RefreshRight } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'BusMatrixList',
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        name$VLK: '',
        enabled$NEQ: '',
      })
      return {
        query,
        bpmApi,
        Delete,
        Search,
        Plus,
        RefreshRight,
      }
    },
  })
</script>
