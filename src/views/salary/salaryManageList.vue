<template>
  <div class="common-layout">
    <el-container>
      
      <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query.type$VIN"
          type-code="xcgllx"
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
                  label-width="90px"
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item label="用户名" prop="userName$VLK">
                    <el-input
                      v-model="query.userName$VLK"
                      placeholder="请输入用户名"
                    />
                  </el-form-item>
                  <el-form-item label="薪酬体系" prop="salaryClassName$VLK">
                    <el-input
                      v-model="query.salaryClassName$VLK"
                      placeholder="请输入薪酬体系名称"
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
                  v-ab-btn-rights:salaryManage_add
                  style="margin-right: 8px"
                  :to="{
                    name: 'SalaryManageEdit',
                    query: { type: '1' },
                  }"
                >
                  <el-button :icon="Plus" type="primary">添加</el-button>
                </router-link>
                <el-button
                  v-ab-btn-rights:salaryManage_del
                  :disabled="!selectedData || selectedData.length == 0"
                  icon="delete"
                  type="danger"
                  @click="delBySeletedIds(salaryApi.salaryManageDelUrl)"
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
            :url="salaryApi.salaryManageListUrl"
          >
            <ab-column label="用户名" min-width="180" prop="userName" />
            <ab-column
              label="薪酬体系"
              min-width="120"
              prop="salaryClassName"
            />
            <ab-column
              ab-date-formatter="yyyy-MM-dd"
              label="入职时间"
              min-width="120"
              prop="entryTime"
            />
            <ab-column
              label="本年累计发放工资"
              min-width="140"
              prop="salarySum"
            />
            <ab-column
              label="本年已用假期"
              min-width="110"
              prop="useHolidayTime"
            />
          
            
            <ab-column label="剩余年假" min-width="90" prop="holidayTime" />
            <ab-column
              label="加班可调休天数"
              min-width="135"
              prop="workHolidayTime"
            />

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
                v-ab-btn-rights:salaryManage_get
                :to="{ name: 'SalaryManageEdit', query: { id: scope.row.id } }"
              >
                <el-button text type="primary">详情</el-button>
              </router-link>
              <router-link
                v-ab-btn-rights:salaryManage_edit
                :to="{
                  name: 'SalaryManageEdit',
                  query: { id: scope.row.id, type: '1' },
                }"
              >
                <el-button text type="primary">编辑</el-button>
              </router-link>

              <el-button
                v-ab-btn-rights:salaryManage_del
                text
                type="primary"
                @click="
                  sendAction(
                    salaryApi.salaryManageDelUrl + scope.row.id,
                    `确定删除【 ${scope.row.userName} 】的薪资配置吗?`
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
    name: 'SalaryManageList',
    components: { abDictTree },
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        name$VLK: '',
        code$VLK: '',
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
