<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            label-width="62px"
            :model="query"
            style="float: left"
            @submit.prevent
          >
            <el-form-item :label="$abT('page.common.name','名称')" prop="name$VLK">
              <el-input v-model="query.name$VLK" />
            </el-form-item>
            <el-form-item :label="$abT('page.common.code','编码')" prop="code$VLK">
              <el-input v-model="query.code$VLK" />
            </el-form-item>
            <el-form-item :label="$abT('page.common.status','状态')" prop="enable$NEQ">
              <el-select v-model="query.enable$NEQ" :placeholder="$abT('page.common.all','全部')" clearable>
                <el-option :label="$abT('page.common.enable','启用')" value="1" />
                <el-option :label="$abT('page.common.disable','禁用')" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="search()">
                {{ $abT('page.common.search',  '查询' ) }}
              </el-button>
              <el-button :icon="RefreshRight" @click="reset()">
                {{ $abT('page.common.reset','重置') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="left-panel">
          <el-space wrap>
            <router-link
              v-ab-btn-rights:home_add
              :to="{
                name: 'HomeComponentEdit',
                query: { type: '1' },
              }"
            >
              <el-button :icon="Plus" type="primary">
                {{ $abT('page.common.add','添加') }}
              </el-button>
            </router-link>
            <el-button
              v-ab-btn-rights:home_del
              :disabled="!selectedData || selectedData.length == 0"
              :icon="Delete"
              type="danger"
              @click="delBySeletedIds(cmsApi.homeComponent.cmsHomeRemoveUrl)"
            >
              {{ $abT('page.common.batchDel','批量删除') }}
            </el-button>
          </el-space>
        </el-col>
      </el-row>
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
      :url="cmsApi.homeComponent.cmsHomeListUrl"
    >
      <ab-column :label="$abT('page.common.name','名称')" min-width="130" prop="name" />
      <ab-column :label="$abT('page.common.code','编码')" min-width="130" prop="code" />
      <ab-column
        :label="$abT('page.common.dict','字典分类')"
        prop="typeCodeName"
        width="100"
      />
      <ab-column
        :ab-text-formatter="
          'chart-' +
          $abT('page.homeComponent.chart', '图表') +
          '-success-light|inner-' +
          $abT('page.homeComponent.innerComponent', '内置组件') +
          '-warning-light|ifream-ifream-primary-light'
        "
        :label="$abT('page.common.type','类型')"
        prop="type"
        width="100"
      />
      <ab-column
        :ab-text-formatter="
          '1-' +
          $abT('page.common.enable', '启用') +
          '-success-dark|0-' +
          $abT('page.common.disable', '禁用') +
          '-danger-dark'
        "
        :label="$abT('page.common.enable','启用')"
        prop="enable"
        width="88"
      />
      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        :label="$abT('page.common.createTime','创建时间')"
        prop="createTime"
        width="140"
      />
      <ab-column
        :label="$abT('page.common.creator','创建人')"
        prop="creator"
        width="120"
      />

      <ab-column
        :label="$abT('page.common.remark','备注')"
        min-width="120"
        prop="remark"
      />
      <ab-column
        ab-template="edit"
        fixed="right"
        :label="$abT('page.common.operate','操作')"
        width="450"
      />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:home_get
          :to="{
            name: 'HomeComponentEdit',
            query: { id: scope.row.id },
          }"
        >
          <el-button text type="primary">
            {{ $abT('page.common.details','详情') }}
          </el-button>
        </router-link>

        <router-link
          v-ab-btn-rights:home_edit
          :to="{
            name: 'HomeComponentEdit',
            query: { id: scope.row.id, type: '1' },
          }"
        >
          <el-button text type="primary">
            {{ $abT('page.common.edit','编辑') }}
          </el-button>
        </router-link>
        <router-link
          v-ab-btn-rights:home_copy
          :to="{
            name: 'HomeComponentEdit',
            query: {
              copy: '1',
              id: scope.row.id,
            },
          }"
        >
          <el-button text type="primary">
            {{ $abT('page.common.copy','复制') }}
          </el-button>
        </router-link>
        <el-button
          v-if="scope.row.enable === 0"
          v-ab-btn-rights:home_changeEnable
          text
          type="primary"
          @click="
            sendAction(
              cmsApi.homeComponent.cmsHomeEnable + scope.row.id + `&enable=1`,
              $abT('page.portal.sureEnable','确定启用吗?')
            )
          "
        >
          {{ $abT('page.common.enable','启用') }}
        </el-button>
        <el-button
          v-if="scope.row.enable === 1"
          v-ab-btn-rights:home_changeEnable
          text
          type="primary"
          @click="
            sendAction(
              cmsApi.homeComponent.cmsHomeEnable + scope.row.id + `&enable=0`,
              $abT('page.portal.sureDisable','确定禁用吗?')
            )
          "
        >
          {{ $abT('page.common.disable','禁用') }}
        </el-button>

        <el-button
          v-ab-btn-rights:home_mandate
          text
          type="primary"
          @click="openDialog(scope.row.code)"
        >
          {{ $abT('page.common.authorization','授权') }}
        </el-button>

        <el-button
          v-ab-btn-rights:home_del
          text
          type="primary"
          @click="
            sendAction(
              cmsApi.homeComponent.cmsHomeRemoveUrl + scope.row.id,
              $abT('page.common.delMsg','确定删除 {a} 吗？', { a: scope.row.name })
            )
          "
        >
          {{ $abT('page.common.del','删除') }}
        </el-button>
      </template>
    </ab-table>
    <abAuthorization
      v-model="info.dialogVisible"
      :authorization-type="info.authorizationType"
      :rights-code="info.homeCode"
    />
  </div>
</template>

<script lang="ts">
  import { abAuthorization, abTableMix, cmsApi } from '~/agilebpm'
  export default {
    name: 'HomeComponentList',
    mixins: [abTableMix],
  }
</script>

<script setup lang="ts">
  import { Delete, Plus, RefreshRight, Search } from '@element-plus/icons-vue'

  // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
  const query = reactive({
    name$VLK: '',
    code$VLK: '',
    enable$NEQ: '',
  })

  const info = reactive({
    dialogVisible: false,
    homeCode: '',
    authorizationType: 'HOME',
  })

  const openDialog = (code: string) => {
    info.homeCode = code
    info.dialogVisible = true
  }
</script>
