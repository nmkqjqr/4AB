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
            <el-form-item label="名称" prop="name$VLK">
              <el-input v-model="query.name$VLK" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="编码" prop="code$VLK">
              <el-input v-model="query.code$VLK" placeholder="请输入编码" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="search()">
                查询
              </el-button>
              <el-button :icon="RefreshRight" @click="reset()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="left-panel">
          <el-space wrap>
            <router-link
              :to="{
                name: 'BizFormTemplateEdit',
                query: { type: '1' },
              }"
            >
              <el-button
                v-ab-btn-rights:bizFormTemplate_add
                :icon="Plus"
                type="primary"
              >
                添加
              </el-button>
            </router-link>

            <init-button
              :icon="RefreshLeft"
              :search="search"
              type="warning"
              @init-template="initTemplateFn"
            />

            <el-button v-if="isTest" type="primary" @click="getSql">
              导出更新sql
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
      :checkable="false"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="bizApi.formTemplate.bizFormTemplateListJson"
    >
      <ab-column label="名称" min-width="160" prop="name" />
      <ab-column label="编码" min-width="160" prop="code" />
      <ab-column
        ab-tag-effect="dark"
        ab-tag-type
        label="表单类型"
        prop="formTypeDesc"
        width="120"
      />
      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        label="更新时间"
        prop="updateTime"
        width="160"
      />
      <ab-column label="更新人" prop="updater" width="100" />
      <ab-column
        ab-text-formatter="0-是-success-light|1-否-warning-light"
        label="内置模版"
        prop="editable"
        width="100"
      />
      <ab-column ab-template="edit" fixed="right" label="操作" width="195" />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:bizFormTemplate_get
          :to="{
            name: 'BizFormTemplateEdit',
            query: { id: scope.row.id },
          }"
        >
          <el-button text type="primary">详情</el-button>
        </router-link>
        <router-link
          v-if="scope.row.editable"
          v-ab-btn-rights:bizFormTemplate_edit
          :to="{
            name: 'BizFormTemplateEdit',
            query: { id: scope.row.id, type: '1' },
          }"
        >
          <el-button text type="primary">编辑</el-button>
        </router-link>

        <el-button
          v-if="scope.row.editable"
          v-ab-btn-rights:bizFormTemplate_del
          text
          type="primary"
          @click="
            sendAction(
              bizApi.formTemplate.bizFormTemplateRemove + scope.row.id,
              `确定删除${scope.row.name}吗?`
            )
          "
        >
          删除
        </el-button>
      </template>
    </ab-table>
  </div>
</template>

<script lang="ts">
  import { abTableMix, bizApi, abTools, getData, abUtil } from '~/agilebpm'
  import { reactive, defineComponent } from 'vue'
  import initButton from './initButton.vue'
  import { ElMessage } from 'element-plus'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
    RefreshLeft,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'BizFormTemplateList',
    components: { initButton },
    mixins: [abTableMix],

    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        name$VLK: '',
        code$VLK: '',
        sortColumn: 'createTime',
        sortOrder: 'DESC',
      })

      const initTemplateFn = (search: any) => {
        search()
      }

      const { proxy } = abTools.useCurrentInstance()
      const isTest = proxy.$route.query.test == '1'

      const getSql = () => {
        bizApi.formTemplate.getSql().then((resp: any) => {
          console.info(resp.data.join(''))
          abUtil.handleClipboard(resp.data.join(''), false)
          ElMessage({
            message: `sql复制成功，直接使用粘贴功能则可`,
            type: 'success',
          })
        })
      }

      return {
        query,
        initTemplateFn,
        bizApi,
        Edit,
        Plus,
        Delete,
        Search,
        RefreshRight,
        RefreshLeft,
        isTest,
        getSql,
      }
    },
  })
</script>
