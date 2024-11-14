<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query.type$VIN"
          type-code="salarySystemType"
          @node-click="searchResetPage()"
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
                  label-width="110px"
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item label="薪酬体系名称" prop="name$VLK">
                    <el-input
                      v-model="query.name$VLK"
                      placeholder="薪酬体系名称"
                    />
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
                <router-link
                  v-ab-btn-rights:salaryClass_add
                  style="margin-right: 8px"
                  :to="{
                    name: 'SalaryClassEdit',
                    query: { type: '1' },
                  }"
                >
                  <el-button :icon="Plus" type="primary">添加</el-button>
                </router-link>
                <el-button
                  v-ab-btn-rights:salaryClass_del
                  :disabled="!selectedData || selectedData.length == 0"
                  icon="delete"
                  type="danger"
                  @click="delBySeletedIds(salaryApi.salaryClassDelUrl)"
                >
                  批量删除
                </el-button>
              </el-col>
            </el-row>
          </div>

          <ab-table
            ref="abTable"
            v-model="selectedData"
            :height="tableHeight"
            :query-param="query"
            row-key="id"
            :url="salaryApi.salaryClassListUrl"
          >
            <ab-column label="薪酬体系名称" min-width="180" prop="name" />
            <ab-column label="所属分类" min-width="120" prop="typeName" />
            <ab-column
              ab-text-formatter="0-禁用-warning-dark|1-启用-success-dark"
              label="状态"
              min-width="120"
              prop="status"
            />

            <ab-column label="备注" min-width="100" prop="comment" />

            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="更新时间"
              min-width="150"
              prop="updateTime"
            />
            <ab-column label="更新人" min-width="150" prop="operator" />
            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="230"
            />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:salaryClass_get
                :to="{ name: 'SalaryClassEdit', query: { id: scope.row.id } }"
              >
                <el-button text type="primary">详情</el-button>
              </router-link>
              <router-link
                v-ab-btn-rights:salaryClass_edit
                :to="{
                  name: 'SalaryClassEdit',
                  query: { id: scope.row.id, type: '1' },
                }"
              >
                <el-button text type="primary">编辑</el-button>
              </router-link>

              <el-button
                v-ab-btn-rights:salaryClass_del
                text
                type="primary"
                @click="
                  sendAction(
                    salaryApi.salaryClassDelUrl + scope.row.id,
                    `确定删除【 ${scope.row.name} 】吗?`
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
  import { reactive, defineComponent } from 'vue'
  import { abTableMix, salaryApi, abDictTree } from '~/agilebpm'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
  } from '@element-plus/icons-vue'
  export default defineComponent({
    name: 'SalaryClassList',
    components: { abDictTree },
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        name$VLK: '',
        type$VLK: '',
      })
      return {
        query,
        Delete,
        Edit,
        Search,
        Plus,
        salaryApi,
        RefreshRight,
      }
    },
  })
</script>
