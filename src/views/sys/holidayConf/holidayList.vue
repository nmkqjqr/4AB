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
            @submit.prevent
          >
            <el-form-item :label="$abT('page.common.system','系统')" prop="system$VLK">
              <ab-select-tree
                v-model="query.system$VLK"
                :placeholder="$abT('page.common.all','全部')"
                :operation="false"
                type-code="holidaySystemType"
              />
            </el-form-item>
            <el-form-item :label="$abT('page.common.year','年份')" prop="year$NEQ">
              <el-input-number
                v-model="query.year$NEQ"
                :min="1"
                placeholder=" "
              />
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
          <el-space>
            <router-link v-ab-btn-rights:holiday_add to="HolidayEdit">
              <el-button :icon="Plus" type="primary">
                {{ $abT('page.common.add','添加') }}
              </el-button>
            </router-link>
            <el-button
              v-ab-btn-rights:holiday_del
              :disabled="!selectedData || selectedData.length == 0"
              :icon="Delete"
              type="danger"
              @click="delBySeletedIds(sysApi.holiday.holidayRemove)"
            >
              {{ $abT('page.common.batchDel','批量删除') }}
            </el-button>
            <el-button
              v-ab-btn-rights:holiday_test
              type="primary"
              @click="dialogVisible = true"
            >
              {{ $abT('page.holidayConf.weekdayTest','工作日测试') }}
            </el-button>
          </el-space>

          <el-dialog
            v-model="dialogVisible"
            :title="$abT('page.holidayConf.workDayTip','获取指定天数后的工作日日期')"
            width="30%"
          >
            <el-form
              ref="formRef"
              label-suffix="："
              :model="testData"
              :status-icon="false"
            >
              <el-form-item
                :label="$abT('page.common.startTime','开始时间')"
                prop="startDay"
                :rules="[
                  { required: true, message: $abT('page.common.required','必填') },
                ]"
              >
                <el-date-picker
                  v-model="testData.startDay"
                  placeholder=" "
                  type="date"
                  value-format="x"
                />
              </el-form-item>
              <el-form-item
                :label="$abT('page.common.dayCount','天数')"
                label-width="90px"
                prop="day"
                :rules="[
                  { required: true, message: $abT('page.common.required','必填') },
                ]"
              >
                <el-input v-model="testData.day" style="width: 215px" />
              </el-form-item>
            </el-form>

            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">
                  {{ $abT('page.common.close','关闭') }}
                </el-button>
                <el-button type="primary" @click="holidayTestFn">
                  {{ $abT('page.common.test','测试') }}
                </el-button>
              </span>
            </template>
          </el-dialog>
        </el-col>
      </el-row>
    </div>

    <ab-table
      ref="abTable"
      v-model="selectedData"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="sysApi.holiday.holidayList"
    >
      <ab-column :label="$abT('page.common.name','名称')" prop="name" width="110" />
      <ab-column
        :label="$abT('page.common.system','系统')"
        prop="systemName"
        width="150"
      />
      <ab-column :label="$abT('page.common.year','年份')" prop="year" width="80" />
      <ab-column
        :label="$abT('page.common.startTime','开始时间')"
        prop="startDay"
        width="160"
      />
      <ab-column :label="$abT('page.common.endTime','结束时间')" prop="endDay" width="160" />
      <ab-column :label="$abT('page.common.type','类型')" prop="typeDesc" width="120" />
      <ab-column
        :label="$abT('page.common.desc','描述')"
        min-width="108"
        prop="remark"
      />
      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        :label="$abT('page.common.updateTime','更新时间')"
        min-width="140"
        prop="updateTime"
      />
      <ab-column
        :label="$abT('page.common.updater','更新人')"
        min-width="120"
        prop="updater"
      />
      <ab-column
        ab-template="edit"
        fixed="right"
        :label="$abT('page.common.operate','操作')"
        width="140"
      />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:holiday_edit
          :to="{ name: 'HolidayEdit', query: { id: scope.row.id } }"
        >
          <el-button text type="primary">
            {{ $abT('page.common.edit','编辑') }}
          </el-button>
        </router-link>
        <el-button
          v-ab-btn-rights:holiday_del
          text
          type="primary"
          @click="
            sendAction(
              sysApi.holiday.holidayRemove + scope.row.id,
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
  import { Delete, Plus, RefreshRight, Search } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { defineComponent, reactive, ref } from 'vue'
  import { abTableMix, abTools, sysApi } from '~/agilebpm'

  export default defineComponent({
    name: 'HolidayList',
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        system$VLK: '',
        year$NEQ: null as any,
      })
      const dialogVisible = ref(false)
      const formRef = ref()
      const testData = reactive({
        startDay: '',
        day: '',
      })
      const holidayTestFn = () => {
        abTools.formValidate(formRef.value)?.then(async () => {
          await sysApi.holiday.holidayTest(testData).then((result: any) => {
            ElMessage({
              message: result.data,
              type: 'success',
              offset: 300,
            })
          })
        })
      }

      return {
        query,
        sysApi,
        dialogVisible,
        testData,
        holidayTestFn,
        Search,
        Plus,
        RefreshRight,
        Delete,
        formRef,
      }
    },
  })
</script>
