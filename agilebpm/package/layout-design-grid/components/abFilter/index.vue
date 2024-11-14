<template>
  <div style="padding: 10px">
    <el-form
      ref="queryForm"
      class="filterFormStyle"
      :inline="true"
      label-width="100px"
      :model="info.query"
      @submit.prevent
    >
      <template
        v-for="(item, index) in props.componentConfig.control.filterList"
        :key="index"
      >
        <el-form-item
          v-if="index < 2 ? true : collapse"
          :label="item.name + ':'"
          :prop="item.paramsValue"
        >
          <el-input
            v-if="item.controlType == 'decimal'"
            v-model.trim="info.query[item.paramsValue]"
            :placeholder="
              item.placeholderText && item.placeholderText.length > 0
                ? item.placeholderText
                : ''
            "
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
          <el-date-picker
            v-if="item.controlType === 'date_picker'"
            v-model="info.query[item.paramsValue]"
            :placeholder="
              item.placeholderText && item.placeholderText.length > 0
                ? item.placeholderText
                : ''
            "
            style="width: 200px"
            :type="
              item.formatConf == 'YYYY-MM-DD'
                ? 'date'
                : item.formatConf == 'YYYY-MM-DD HH:mm:ss'
                ? 'datetime'
                : item.formatConf == 'YYYY'
                ? 'year'
                : item.formatConf == 'YYYY-MM'
                ? 'month'
                : 'date'
            "
            :value-format="
              item.formatConf && item.formatConf.length > 0
                ? item.formatConf
                : 'YYYY-MM-DD'
            "
          />
          <!-- date_picker 日期范围选择器 -->
          <el-date-picker
            v-if="
              item.controlType === 'date_picker_f' && item.formatConf !== 'YYYY'
            "
            v-model="info.query[item.paramsValue]"
            end-placeholder="结束时间"
            start-placeholder="开始时间"
            style="width: 200px"
            :type="
              item.formatConf == 'YYYY-MM-DD'
                ? 'daterange'
                : item.formatConf == 'YYYY-MM-DD HH:mm:ss'
                ? 'datetimerange'
                : item.formatConf == 'YYYY-MM'
                ? 'monthrange'
                : 'daterange'
            "
            :value-format="
              item.formatConf && item.formatConf.length > 0
                ? item.formatConf
                : 'YYYY-MM-DD'
            "
          />
          <!-- <template
          v-if="
            item.controlType === 'date_picker_f' && item.formatConf == 'YYYY'
          "
        >
          <el-date-picker
            v-model="info.query.beginYear"
            placeholder="开始"
            style="width: 93px"
            :type="'year'"
            :value-format="
              item.formatConf && item.formatConf.length > 0
                ? item.formatConf
                : 'YYYY-MM-DD'
            "
          />
          <span style="padding: 0 4px">-</span>
          <el-date-picker
            v-model="info.query.endYear"
            placeholder="结束"
            style="width: 93px"
            :type="'year'"
            :value-format="
              item.formatConf && item.formatConf.length > 0
                ? item.formatConf
                : 'YYYY-MM-DD'
            "
          />
        </template> -->
          <template v-if="item.controlType === 'dic'">
            <ab-select-tree
              v-model="info.query[item.paramsValue]"
              :operation="false"
              style="width: 200px"
              :type-code="item.formatConf.code"
              @keyup.enter.native="handleQuery"
            />
          </template>
          <el-select
            v-if="item.controlType === 'select'"
            v-model="info.query[item.paramsValue]"
            clearable
            :placeholder="
              item.placeholderText && item.placeholderText.length > 0
                ? item.placeholderText
                : ''
            "
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          >
            <template
              v-if="
                item.formatConfJsonList && item.formatConfJsonList.length > 0
              "
            >
              <el-option
                v-for="(itemjson, index) in item.formatConfJsonList"
                :key="index"
                :label="itemjson.key"
                :value="itemjson.valuekey"
              />
            </template>
          </el-select>
          <el-select
            v-if="item.controlType === 'selectMore'"
            v-model="info.query[item.paramsValue]"
            clearable
            multiple
            :placeholder="
              item.placeholderText && item.placeholderText.length > 0
                ? item.placeholderText
                : ''
            "
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          >
            <template
              v-if="
                item.formatConfJsonList && item.formatConfJsonList.length > 0
              "
            >
              <el-option
                v-for="(itemjson, index) in item.formatConfJsonList"
                :key="index"
                :label="itemjson.key"
                :value="itemjson.valuekey"
              />
            </template>
          </el-select>
          <template v-if="item.controlType === 'dialog'">
            <el-input
              v-model="item.showValueQuery"
              class="input-with-select"
              :placeholder="
                item.placeholderText && item.placeholderText.length > 0
                  ? item.placeholderText
                  : ''
              "
              readonly
              style="width: 200px"
            >
              <template #append>
                <ab-cust-dialog
                  :dialog-key="item.formatConf.dialogKey"
                  :dialog-setting="{ multiple: false }"
                  @ok="chooseCustDialog($event, item)"
                >
                  <el-icon style="vertical-align: middle">
                    <Search />
                  </el-icon>
                </ab-cust-dialog>
              </template>
            </el-input>
          </template>
        </el-form-item>
      </template>
      <el-button
        v-if="
          !props.componentConfig.control.clickFilter && props.componentConfig.control.filterList &&
          props.componentConfig.control.filterList.length > 2
        "
        link
        type="primary"
        @click="handleCollapse()"
      >
        <span v-if="!collapse" type="primary">展开</span>
        <span v-else type="primary">合并</span>
        <el-icon class="el-icon--right">
          <arrow-down v-if="!collapse" />
          <ArrowUp v-else/>
        </el-icon>
      </el-button>
      <el-form-item v-if="props.componentConfig.control.clickFilter">
        <el-button
          v-if="props.componentConfig.control.clickFilter"
          :icon="Search"
          type="primary"
          @click="handleQuery"
        >
          查询
        </el-button>
        <el-button :icon="RefreshRight" @click="resetquery">重置</el-button>
        <el-button
          v-if="props.componentConfig.control.filterList.length > 2"
          link
          type="primary"
          @click="handleCollapse()"
        >
          <span v-if="!collapse" type="primary">展开</span>
          <span v-else type="primary">合并</span>
          <el-icon class="el-icon--right">
            <arrow-down v-if="!collapse" />
            <ArrowUp v-else/>
          </el-icon>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
  import abTableMix from '../../../ab-core/components/ab-table/ab-table-mix.vue'
  export default {
    name: 'AbFilterLayout',
    mixins: [abTableMix],
  }
</script>
<script setup lang="ts">
  import { PropType } from 'vue'
  import { Search, RefreshRight } from '@element-plus/icons-vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { sysApi } from '@agilebpm/api'
  const globalParams = inject('globalParams') as any
  const { proxy } = abTools.useCurrentInstance()
  const props = defineProps({
    componentConfig: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
  })
  const info = reactive({
    query: {},
  })

  if (
    props.componentConfig.control.filterList &&
    props.componentConfig.control.filterList.length > 0
  ) {
    nextTick(() => {
      for (const key in globalParams) {
        if (globalParams[key] !== undefined) {
          info.query[key] = globalParams[key]
        }
      }

      // props.componentConfig.control.filterList.forEach((item: any) => {
      //   if (item.controlType == 'date_picker_f' && item.formatConf == 'YYYY') {
      //     if (!item.beginYear) {
      //       item.beginYear = ''
      //     }
      //     if (!item.endYear) {
      //       item.endYear = ''
      //     }
      //   }
      // })
    })
  }

  // watch(
  //   () => props.componentConfig.control.filterList,
  //   (newVal) => {
  //     if (newVal && newVal.length > 0) {
  //       newVal.forEach((item:any,index:any) => {
  //         info.query[item.paramsValue] = ''
  //       })
  //     }
  //   },
  //   { deep: true, immediate: true }
  // )

  watch(
    () => globalParams,
    (newVal) => {
      for (const key in globalParams) {
        if (globalParams[key] !== undefined) {
          info.query[key] = globalParams[key]
        }
      }
    },
    { deep: true }
  )

  watch(
    () => info.query,
    (newVal) => {
      if (newVal) {
        if (!props.componentConfig.control.clickFilter) {
          for (const key in newVal) {
            globalParams[key] = newVal[key]
          }
        }
      }
    },
    { deep: true, immediate: true }
  )

  const handleQuery = () => {
    if (props.componentConfig.control.clickFilter) {
      for (const key in info.query) {
        globalParams[key] = info.query[key]
      }
    }
  }
  const resetquery = () => {
    if (props.componentConfig.control.clickFilter) {
      for (const key in info.query) {
        globalParams[key] = ''
        info.query[key] = ''
      }
      props.componentConfig.control.filterList.forEach((item: any) => {
        if (item.controlType === 'dialog') {
          item.showValueQuery = ''
        }
      })
    }
  }

  const chooseCustDialog = (list: any, item: any) => {
    info.query[item.paramsValue] = list[0][item.formatConf.valueField]
    item.showValueQuery = list[0][item.formatConf.labelField]
  }
</script>

<style lang="scss">
  .filterFormStyle {
    .el-form-item {
      margin-top: 6px !important;
      margin-right: 0 !important;
      margin-bottom: 0 !important;
      margin-bottom: 6px !important;
      margin-left: 10px !important;
    }
  }
</style>
