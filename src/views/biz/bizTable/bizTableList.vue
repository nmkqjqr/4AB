<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query.typeCode$VIN"
          type-code="biz"
          @node-click="searchResetPage()"
        />
      </el-aside>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <!--查询区域-->
            <el-row>
              <el-col class="top-panel" :span="24">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  label-width="62px"
                  :model="query"
                >
                  <el-form-item label="名称" prop="comment$VLK">
                    <el-input
                      v-model="query.comment$VLK"
                      placeholder="请输入名称"
                    />
                  </el-form-item>
                  <el-form-item label="表名" prop="name$VLK">
                    <el-input
                      v-model="query.name$VLK"
                      placeholder="请输入表名"
                    />
                  </el-form-item>
                  <el-form-item label="编码" prop="code$VLK">
                    <el-input
                      v-model="query.code$VLK"
                      placeholder="请输入编码"
                    />
                  </el-form-item>

                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      查询
                    </el-button>
                    <el-button :icon="Refresh" @click="reset()">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <!--按钮区域-->
            <el-space wrap>
              <router-link
                v-ab-btn-rights:bizTable_add
                :to="{
                  name: 'BizTableEdit',
                  query: { external: 0, typeCode: query.typeCode$VEQ },
                }"
              >
                <el-button :icon="Plus" type="primary">添加</el-button>
              </router-link>
              <router-link
                v-ab-btn-rights:bizTable_addOuter
                :to="{
                  name: 'BizTableEdit',
                  query: { external: 1, typeCode: query.typeCode$VEQ },
                }"
              >
                <el-button :icon="Plus" type="primary">添加外部表</el-button>
              </router-link>

              <el-button
                v-ab-btn-rights:bizTable_del
                :disabled="!selectedData || selectedData.length == 0"
                :icon="Delete"
                type="danger"
                @click="delBySeletedIds(bizApi.bizTable.BizTableRemove)"
              >
                批量删除
              </el-button>
            </el-space>
          </div>

          <!--列表区域 :default-sort="{ prop: 'name', order: 'ascending' }"-->
          <ab-table
            ref="abTable"
            v-model="selectedData"
            :height="tableHeight"
            highlight-current-row
            is-have-tree
            :query-param="query"
            row-key="id"
            :url="bizApi.bizTable.BizTableListJson"
          >
            <!-- <ab-column :selectable="selectable" type="selection" width="60" /> -->
            <ab-column label="名称" min-width="180" prop="comment" />
            <ab-column label="表名" min-width="150" prop="name" sortable />
            <ab-column label="编码" min-width="150" prop="code" />
            <ab-column label="数据源" prop="dsName" />
            <ab-column
              ab-text-formatter="1-外部表-warning-dark|0-内部表-success-dark"
              label="类型"
              prop="external"
              width="100"
            />
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="更新时间"
              prop="updateTime"
              width="140"
            />
            <ab-column label="更新人" prop="updator" width="100" />
            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="195"
            />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:bizTable_edit
                :to="{
                  name: 'BizTableEdit',
                  query: { id: scope.row.id, external: scope.row.external },
                }"
              >
                <el-button text type="primary">编辑</el-button>
              </router-link>

              <router-link
                v-ab-btn-rights:bizTable_edit
                :to="{
                  name: 'BizTableEdit',
                  query: {
                    id: scope.row.id,
                    external: scope.row.external,
                    copy: '1',
                  },
                }"
              >
                <el-button text type="primary">复制</el-button>
              </router-link>

              <el-button
                v-ab-btn-rights:bizTable_del
                text
                type="primary"
                @click="
                  sendAction(
                    bizApi.bizTable.BizTableRemove + scope.row.id,
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

<script>
  import { abTableMix, abDictTree } from '~/agilebpm'
  import { bizApi, abUtil } from '~/agilebpm'
  import { Search, Refresh, Plus } from '@element-plus/icons-vue'
  export default {
    name: 'BizTableList',
    components: { abDictTree },
    mixins: [abTableMix],
    setup() {
      if (abUtil.checkIsPublicProject(true)) {
        const confim = confirm(
          '体验高级功能需要技术指导，请跳过业务对象设计，直接使用【简单表单设计】模式创建表单即可！'
        )

        window.location.href = '/biz/bizForm/bizFormDesignList'
      }

      return {
        bizApi,
        abDictTree,
        Search,
        Refresh,
        Plus,
      }
    },
    methods: {
      selectable(row, index) {
        return index % 2 == 0
      },
    },
  }
</script>
