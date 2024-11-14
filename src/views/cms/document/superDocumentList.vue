<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree" width="266px">
        <initTree
          :is-super="true"
          :search="search"
          @init-search="initSearchFn"
          @search="searchFn"
        />
      </el-aside>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <el-row class="vab-query-form">
              <el-col class="top-panel">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  label-width="90px"
                  :model="query"
                  style="float: left"
                  @submit.prevent
                >
                  <el-form-item label="文档名称" prop="name$VLK">
                    <el-input
                      v-model="query.name$VLK"
                      placeholder="请输入文档名称"
                    />
                  </el-form-item>
                  <el-form-item label="附件类型" prop="fileType$VLK">
                    <el-select
                      v-model="query.fileType$VLK"
                      allow-create
                      default-first-option
                      filterable
                      :placeholder="$abT('page.common.all','全部')"
                      clearable
                    >
                      <el-option value="html" />
                      <el-option value="doc" />
                      <el-option value="xls" />
                      <el-option value="ppt" />
                      <el-option value="pdf" />
                      <el-option value="jpg" />
                      <el-option value="png" />
                      <el-option value="gif" />
                      <el-option value="txt" />
                      <el-option value="mp4" />
                      <el-option value="exe" />
                      <el-option value="dat" />
                    </el-select>
                  </el-form-item>

                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      查询
                    </el-button>
                    <el-button :icon="RefreshRight" @click="reset()">
                      重置
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col class="left-panel">
                <el-space wrap>
                  <router-link
                    v-ab-btn-rights:cmsDocument_add
                    :to="{
                      name: 'DocumentEdit',
                      query: {
                        type: '1',
                        source: 'SuperDocumentList',
                        parentId: item.fieldId,
                      },
                    }"
                  >
                    <el-button :icon="Plus" type="primary">添加</el-button>
                  </router-link>
                  <el-button
                    v-ab-btn-rights:sysDailyPhrases_del
                    :disabled="!selectedData || selectedData.length == 0"
                    :icon="Delete"
                    type="danger"
                    @click="
                      delBySeletedIds(cmsApi.document.cmsDocumentRemoveUrl)
                    "
                  >
                    批量删除
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
            :checkable="true"
            :height="tableHeight"
            :query-param="query"
            row-key="id"
            :url="cmsApi.document.superListJsonUrl"
          >
            <ab-column label="文档名称" min-width="160" prop="name" />
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="创建时间"
              prop="createTime"
              width="140"
            />
            <ab-column label="创建人" prop="creator" width="100" />
            <ab-column label="附件大小" prop="fileTotalSize" width="90" />
            <ab-column
              ab-template="fileType"
              label="附件类型"
              prop="fileType"
              width="110"
            />
            <template #fileType="{ scope }">
              <span v-if="scope.row.fileType && scope.row.fileType.length > 0">
                <el-tag
                  v-for="i in scope.row.fileType.split(',')"
                  :key="i"
                  class="mx-1"
                >
                  {{ i }}
                </el-tag>
              </span>
            </template>
            <ab-column label="所属部门" prop="createOrgName" width="100" />
            <ab-column
              ab-template="rightsName"
              label="查看权限"
              prop="rightsName"
              width="110"
            />
            <template #rightsName="{ scope }">
              <span
                v-if="scope.row.rightsName && scope.row.rightsName.length > 0"
              >
                <el-tag
                  v-for="i in scope.row.rightsName.split(',')"
                  :key="i"
                  class="mx-1"
                >
                  {{ i }}
                </el-tag>
              </span>
            </template>
            <ab-column label="阅读量" prop="readNum" width="70" />
            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="144"
            />
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="更新时间"
              min-width="140"
              prop="updateTime"
            />
            <ab-column label="更新人" prop="updater" width="100" />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:cmsDocument_edit
                :to="{
                  name: 'DocumentEdit',
                  query: {
                    id: scope.row.id,
                    type: '1',
                    source: 'SuperDocumentList',
                  },
                }"
              >
                <el-button text type="primary">编辑</el-button>
              </router-link>

              <el-button
                v-ab-btn-rights:cmsDocument_del
                text
                type="primary"
                @click="
                  sendAction(
                    cmsApi.document.cmsDocumentRemoveUrl + scope.row.id,
                    '确定删除' + scope.row.name + '吗?'
                  )
                "
              >
                删除
              </el-button>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  import { abTableMix, cmsApi } from '~/agilebpm'
  export default {
    mixins: [abTableMix],
  }
</script>

<script setup lang="ts">
  import initTree from './components/initTree.vue'
  import { Search, Delete, Plus, RefreshRight } from '@element-plus/icons-vue'
  // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
  const query = reactive({
    name$VLK: '',
    fileType$VLK: '',
    parentId$VIN: '',
    type$VNE: 'field',
  })
  // @ts-ignore
  const { proxy } = getCurrentInstance()

  //弹出框绑定的from表单数据
  const item = reactive({
    fieldId: '',
  })

  const initSearchFn = (childIds: string, id: string) => {
    query.parentId$VIN = id == '0' ? '' : childIds
    item.fieldId = id
    proxy.search()
  }

  const searchFn = () => {
    query.name$VLK = ''
    query.fileType$VLK = ''
    query.parentId$VIN = ''
    proxy.search()
  }
</script>
