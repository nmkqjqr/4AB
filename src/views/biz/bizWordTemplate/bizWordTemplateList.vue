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
                  <el-form-item label="名称" prop="name$VLK">
                    <el-input
                      v-model="query.name$VLK"
                      placeholder="请输入名称"
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
                v-ab-btn-rights:wordTemplate_add
                :to="{
                  name: 'BizWordTemplateEdit',
                  query: { typeCode: query.typeCode$VEQ },
                }"
              >
                <el-button :icon="Plus" type="primary">添加</el-button>
              </router-link>
            </el-space>
          </div>

          <!--列表区域 -->
          <ab-table
            ref="abTable"
            v-model="selectedData"
            :checkable="false"
            :height="tableHeight"
            highlight-current-row
            is-have-tree
            :query-param="query"
            row-key="id"
            :url="bizApi.wordTemplate.BizWordTemplateListJson"
          >
            <ab-column label="名称" prop="name" width="150" />
            <ab-column label="编码" prop="code" width="120" />
            <ab-column ab-template="form" label="表单设计" />
            <template #form="{ scope }">
              <el-tag type="success">
                {{ `${scope.row.designName}（${scope.row.designCode}）` }}
              </el-tag>
            </template>
            <ab-column ab-template="bo" label="业务对象" />
            <template #bo="{ scope }">
              <el-tag type="success">
                {{ `${scope.row.boName}（${scope.row.boCode}）` }}
              </el-tag>
            </template>
            <ab-column ab-template="file" label="文件" />
            <template #file="{ scope }">
              <el-tag type="success">
                {{ JSON.parse(scope.row.file)[0]['name'] }}
              </el-tag>
            </template>
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="更新时间"
              prop="updateTime"
              width="150"
            />
            <ab-column label="更新人" prop="updator" width="120" />
            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="140"
            />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:wordTemplate_edit
                :to="{
                  name: 'BizWordTemplateEdit',
                  query: { id: scope.row.id },
                }"
              >
                <el-button text type="primary">编辑</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:wordTemplate_del
                text
                type="primary"
                @click="
                  sendAction(
                    bizApi.wordTemplate.BizWordTemplateRemove + scope.row.id,
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
  import { bizApi, abUtil, abTableMix, abDictTree } from '~/agilebpm'
  import { Search, Refresh, Plus } from '@element-plus/icons-vue'
  export default {
    name: 'BizWordTemplateList',
    components: { abDictTree },
    mixins: [abTableMix],
    setup() {
      return {
        bizApi,
        abDictTree,
        Search,
        Refresh,
        Plus,
      }
    },
    methods: {},
  }
</script>
