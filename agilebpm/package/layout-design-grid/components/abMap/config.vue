<template>
  <div>
    <el-form-item label="默认地图" prop="mapCode">
      <ab-select-tree
        ref="selectRef"
        v-model="config.control.mapCode"
        :tree-options="{
          id: 'code_',
          name: 'name_',
          pid: 'pcode_',
        }"
        tree-type="custDialog"
        type-code="mapData"
      />
    </el-form-item>
    <div v-if="config.control.mapCode">
      <el-form-item label="允许点击" prop="click">
        <el-switch v-model="config.control.click" />
      </el-form-item>
      <el-form-item label="显示标注">
        <el-switch v-model="config.control.showLabel" />
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="config.control.title" />
      </el-form-item>
      <el-form-item label="字体主题">
        <el-radio-group v-model="config.control.fontStyle">
          <el-radio :label="0">黑色</el-radio>
          <el-radio :label="1">白色</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="数据类型">
        <el-select
          v-model="config.control.source"
          placeholder="请选择"
          @change="changeSource"
        >
          <el-option label="业务表单" value="formDesignSelector" />
          <el-option label="自定义对话框" value="custDialog" />
          <el-option label="自定义应用" value="custGrid" />
          <el-option label="自定义echarts" value="custEchart" />
        </el-select>
      </el-form-item>
      <div v-if="config.control.source">
        <div v-if="config.control.source === 'custEchart'">
          <div
            style="
              box-sizing: border-box;
              display: inline-flex;
              flex: 0 0 auto;
              align-items: flex-start;
              justify-content: flex-end;
              height: 32px;
              padding: 0 12px 0 0;
              padding-bottom: 20px;
              margin-left: 20px;
              font-size: var(--el-form-label-font-size);
              line-height: 32px;
              color: var(--el-text-color-regular);
            "
          >
            图表Json：
          </div>
          <codemirror
            v-model="config.control.chartsJson"
            :autofocus="true"
            :indent-with-tab="true"
            :style="{
              height: `500px`,
              border: `1px solid #e4e7ed`,
            }"
          />
        </div>

        <el-form-item
          v-else
          :label="
            config.control.source == 'custDialog'
              ? '对话框'
              : config.control.source == 'custGrid'
              ? '应用'
              : '业务表单'
          "
        >
          <div v-if="config.control.relCode" style="margin-right: 10px">
            <el-tag closable @close="cleranRel">
              {{ config.control.relName }}
            </el-tag>
          </div>

          <ab-cust-dialog
            v-model="config.control.relCode"
            :dialog-key="config.control.source"
            :dialog-setting="{ multiple: 0 }"
            :icon="Search"
            round
            size="small"
            type="primary"
            @ok="dialogOk"
          >
            选择
          </ab-cust-dialog>
        </el-form-item>
        <el-form-item
          v-if="
            config.control.source == 'formDesignSelector' &&
            config.control.relCode
          "
          label="表单实体"
          :rules="[{ required: true, message: '必填' }]"
        >
          <el-select
            v-model="config.control.formKey"
            placeholder="请选择"
            @change="changeForm"
          >
            <el-option
              v-for="item in info.custSelect"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <div v-if="config.control.relCode">
          <el-form-item label="数据量限制">
            <el-input
              v-model="config.control.limit"
              :min="1"
              placeholder="若不填写则使用引用的原始限制"
              type="number"
              @change="
                () => {
                  if (config.control.limit && config.control.limit < 1) {
                    config.control.limit = 1
                  }
                }
              "
            />
          </el-form-item>
          <div
            v-if="['custDialog', 'custGrid'].includes(config.control.source)"
          >
            <el-form-item :rules="[{ required: true, message: '必填' }]">
              <template #label>
                <div>
                  <el-tooltip
                    class="box-item"
                    content="用来映射地图Json数据中的name字段，例如：北京市，上海市等"
                    effect="dark"
                    placement="top-start"
                  >
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                  地图字段
                </div>
              </template>
              <el-select v-model="config.control.xzhou" placeholder="请选择">
                <el-option
                  v-for="item in info.custSelect"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              label="数据字段"
              :rules="[{ required: true, message: '必填' }]"
            >
              <el-select v-model="config.control.yzhou" placeholder="请选择">
                <el-option
                  v-for="item in info.custSelect"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
          </div>
          <div
            v-if="
              config.control.source == 'formDesignSelector' &&
              config.control.formKey
            "
          >
            <el-form-item :rules="[{ required: true, message: '必填' }]">
              <template #label>
                <div>
                  <el-tooltip
                    class="box-item"
                    content="用来映射地图Json数据中的name字段，例如：北京市，上海市等"
                    effect="dark"
                    placement="top-start"
                  >
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                  地图字段
                </div>
              </template>
              <el-select
                v-model="config.control.latitudeConfig[0]"
                clearable
                collapse-tags
                collapse-tags-tooltip
                placeholder="请选择"
                value-key="key"
              >
                <el-option-group
                  v-for="item in info.formfields"
                  :key="item.name"
                  :label="item.name"
                >
                  <el-option
                    v-for="field in item.fieldList"
                    :key="field.key"
                    :label="field.name"
                    :value="field"
                    @click="changeLatitude(field)"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>

            <el-form-item
              label="数据字段"
              :rules="[{ required: true, message: '必填' }]"
            >
              <el-select
                v-model="config.control.indicatorConfig[0]"
                clearable
                collapse-tags
                collapse-tags-tooltip
                placeholder="请选择"
                value-key="key"
              >
                <el-option-group
                  v-for="item in info.formfields"
                  :key="item.name"
                  :label="item.name"
                >
                  <el-option
                    v-for="field in item.fieldList"
                    :key="field.key"
                    :label="field.name"
                    :value="field"
                    @click="changeIndicator(field)"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>

            <el-table
              v-if="
                config.control.indicatorConfig &&
                config.control.indicatorConfig[0]
              "
              :cell-style="cellStyle"
              :data="config.control.indicatorConfig"
              :expand-row-keys="info.rowKeys"
              :header-cell-style="{ height: '10px' }"
              :row-key="rowKeyFunc"
              :row-style="cellStyle"
              style="margin-bottom: 40px"
            >
              <el-table-column type="expand" width="30px">
                <template #default="{ row }">
                  <el-form-item label="排序类型">
                    <el-select
                      v-model="row.sort"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in info.sortArr"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="高级计算">
                    <el-select
                      v-model="row.advancedCal"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in info.advancedCal"
                        :key="item.key"
                        :label="item.desc"
                        :value="item.key"
                      />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column label="字段" prop="name" show-overflow-tooltip />
              <el-table-column label="汇总方式" min-width="90" prop="cntype">
                <template #default="{ row }">
                  <el-select v-model="row.summaryType" placeholder="请选择">
                    <el-option
                      v-for="item in getSupport(info.summaryType, row)"
                      :key="item.key"
                      :label="item.desc"
                      :value="item.key"
                    />
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column width="55">
                <template #default="{ row }">
                  <el-button link type="danger">
                    <el-icon :size="22" @click="delIndicator(row)">
                      <Delete />
                    </el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-form-item label="过滤条件">
              <el-select
                v-model="config.control.conditionConfig"
                clearable
                collapse-tags
                collapse-tags-tooltip
                multiple
                placeholder="请选择"
                value-key="key"
              >
                <el-option-group
                  v-for="item in info.formfields"
                  :key="item.name"
                  :label="item.name"
                >
                  <el-option
                    v-for="field in item.fieldList"
                    :key="field.key"
                    :label="field.name"
                    :value="field"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>

            <div class="mystyle">
              <el-table
                v-if="
                  config.control.conditionConfig &&
                  config.control.conditionConfig.length > 0
                "
                :cell-style="cellStyle"
                :data="config.control.conditionConfig"
                :expand-row-keys="info.rowKeys"
                :header-cell-style="{ height: '10px' }"
                :row-key="rowKeyFunc"
                :row-style="cellStyle"
                style="padding: 0; margin-bottom: 40px"
              >
                <el-table-column
                  align="center"
                  label="字段"
                  prop="name"
                  show-overflow-tooltip
                  width="85"
                />
                <el-table-column label="条件" width="100">
                  <template #default="{ row }">
                    <el-select
                      v-model="row.condition"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in info.conditionEnum.filter((s) =>
                          s.supports.includes(row.fieldType)
                        )"
                        :key="item.key"
                        :label="item.desc"
                        :value="item.key"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="默认值">
                  <template #default="{ row }">
                    <el-select
                      v-if="
                        formCombination?.designJson?.params &&
                        formCombination?.designJson?.params.length > 0
                      "
                      v-model="row.value"
                      allow-create
                      clearable
                      filterable
                      style="padding: 0"
                    >
                      <el-option
                        v-for="item in formCombination?.designJson?.params"
                        :key="'{' + item.name + '}'"
                        :label="item.name"
                        :value="'{' + item.name + '}'"
                      />
                    </el-select>
                    <el-input v-else v-model="row.value" />
                  </template>
                </el-table-column>

                <el-table-column width="30">
                  <template #default="{ row }">
                    <el-button link type="danger">
                      <el-icon :size="22" @click="delCondition(row)">
                        <Delete />
                      </el-icon>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <el-form-item
            v-if="config.control.source == 'custGrid'"
            label="过滤参数"
          >
            <el-button
              :icon="Plus"
              round
              size="small"
              type="primary"
              @click="addCondition"
            >
              添加
            </el-button>
          </el-form-item>
          <div class="mystyle">
            <el-table
              v-if="
                config.control.source == 'custGrid' &&
                config.control.conditionConfig &&
                config.control.conditionConfig.length > 0
              "
              :cell-style="cellStyle"
              :data="config.control.conditionConfig"
              :header-cell-style="{ height: '10px' }"
              :row-key="rowKeyFunc"
              :row-style="cellStyle"
              style="padding: 0; margin-bottom: 40px"
            >
              <el-table-column align="center" label="过滤字段">
                <template #default="{ row }">
                  <el-select
                    v-model="row.name"
                    clearable
                    placeholder="过滤字段"
                  >
                    <el-option
                      v-for="param in config.control.conditionParam"
                      :key="param.fieldName"
                      :label="param.fieldDesc"
                      :value="param.fieldName"
                      @click="
                        () => {
                          row.con = param.cntype
                        }
                      "
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="参数值">
                <template #default="{ row }">
                  <el-select
                    v-model="row.val"
                    allow-create
                    clearable
                    filterable
                    placeholder="参数值"
                    @change="
                      () => {
                        if (row.name) {
                        }
                      }
                    "
                  >
                    <el-option
                      v-for="param in formCombination?.designJson?.params"
                      :key="'{' + param.name + '}'"
                      :label="param.name"
                      :value="'{' + param.name + '}'"
                    />
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column width="30">
                <template #default="{ $index }">
                  <el-button link type="danger">
                    <el-icon
                      :size="22"
                      @click="
                        () => {
                          config.control.conditionConfig.splice($index, 1)
                        }
                      "
                    >
                      <Delete />
                    </el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <el-form-item label="数据工具条">
          <el-switch v-model="config.control.tool" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <div>
              <el-tooltip
                class="box-item"
                content="鼠标悬疑地图时，是否展示对应的数据"
                effect="dark"
                placement="top-start"
              >
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
              悬移显示：
            </div>
          </template>
          <el-switch v-model="config.control.showValue" />
        </el-form-item>

        <el-form-item label="数据颜色">
          <el-button
            icon="Refresh"
            round
            size="small"
            style="margin-right: 15px"
            type="primary"
            @click="
              () =>
                (config.control.toolColor = `#${(
                  (1 << 24) +
                  (Math.floor(Math.random() * 256) << 16) +
                  (Math.floor(Math.random() * 256) << 8) +
                  Math.floor(Math.random() * 256)
                )
                  .toString(16)
                  .slice(1)}`)
            "
          >
            随机
          </el-button>

          <el-color-picker
            v-model="config.control.toolColor"
            :predefine="[
              '#C80000',
              '#C84B00',
              '#C8C800',
              '#00C800',
              '#00C8C8',
              '#0000C8',
              '#730073',
              '#C8739E',
              '#732D00',
              '#4D4D4D',
            ]"
            show-alpha
          />
        </el-form-item>
        <el-form-item label="点击联动">
          <el-button
            :icon="Plus"
            round
            size="small"
            type="primary"
            @click="addLinkage"
          >
            添加
          </el-button>
        </el-form-item>
        <div class="mystyle">
          <el-table
            v-if="config.control.linkage && config.control.linkage.length > 0"
            :cell-style="cellStyle"
            :data="config.control.linkage"
            :header-cell-style="{ height: '10px' }"
            :row-key="rowKeyFunc"
            :row-style="cellStyle"
            style="padding: 0; margin-bottom: 40px"
          >
            <el-table-column align="center" label="全局参数">
              <template #default="{ row }">
                <el-select
                  v-model="row.linkageParam"
                  clearable
                  placeholder="全局参数"
                >
                  <el-option
                    v-for="param in formCombination?.designJson?.params"
                    :key="param.name"
                    :label="param.name"
                    :value="param.name"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              v-if="config.control.source == 'formDesignSelector'"
              align="center"
              label="参数值"
            >
              <template #default="{ row }">
                <el-select
                  v-model="row.linkageData"
                  allow-create
                  clearable
                  filterable
                  placeholder="参数值"
                >
                  <el-option label="地图字段" value="latitudekey" />
                  <el-option label="数据字段" value="indicatorKey" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-else align="center" label="参数值">
              <template #default="{ row }">
                <el-select
                  v-model="row.linkageData"
                  allow-create
                  clearable
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in info.custSelect"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column width="30">
              <template #default="{ $index }">
                <el-button link type="danger">
                  <el-icon
                    :size="22"
                    @click="() => config.control.linkage.splice($index, 1)"
                  >
                    <Delete />
                  </el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-form-item label="定时刷新">
      <el-switch v-model="config.control.timedRefresh" />
    </el-form-item>
    <el-form-item
      v-if="config.control.timedRefresh"
      prop="control.refreshCycle"
      :rules="[
        {
          pattern: /^[1-9]\d*$/,
          message: '请输入1以上的正整数（单位/秒）',
          trigger: 'change',
        },
      ]"
    >
      <template #label>
        <div>
          <el-tooltip
            class="box-item"
            content="刷新周期为1以上的正整数（单位/秒）"
            effect="dark"
            placement="top-start"
          >
            <el-icon style="width: 100%; font-style: normal">
              <QuestionFilled />
              刷新周期：
            </el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-input
        v-model="config.control.refreshCycle"
        type="number"
        @change="
          () => {
            if (config.control.refreshCycle < 1) {
              config.control.refreshCycle = 1
            } else {
              if (!Number.isInteger(config.control.refreshCycle))
                // 如果输入值有小数部分，则省略小数部分
                config.control.refreshCycle = Math.floor(
                  config.control.refreshCycle
                )
            }
          }
        "
      />
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { Plus, Search } from '@element-plus/icons-vue'
  import { defineProps, PropType, toRefs } from 'vue'
  import { Codemirror } from 'vue-codemirror'
  import { abUtil } from '~/agilebpm'
  import { bizApi, sysApi } from '~/agilebpm/api'

  const props = defineProps({
    config: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
    formCombination: {
      required: true,
      type: Object as PropType<FormCombination>,
    },
  })

  const { config } = toRefs(props)

  const info: any = reactive({
    mapList: [],
    rowKeys: [],
    custSelect: [],
    formfields: [],
    //下面五个为枚举下拉框
    sortArr: [
      { key: 'asc', name: '升序' },
      { key: 'desc', name: '降序' },
    ],
    conditionEnum: [],
    advancedCal: [],
    summaryType: [],
    dimensionSummaryType: [],
  })

  // 条件类型下拉框
  sysApi.tools
    .getEnum('com.dstz.base.query.ConditionType', true)
    .then(({ data }) => {
      info.conditionEnum = data.filter((s: any) => s.key != 'BT')
    })

  // 条件类型下拉框
  sysApi.tools
    .getEnum('com.dstz.biz.api.designquery.enums.DqQuotaAdvancedCal', true)
    .then(({ data }) => (info.advancedCal = data))

  // 条件类型下拉框
  sysApi.tools
    .getEnum('com.dstz.biz.api.designquery.enums.DqQuotaSummaryType', true)
    .then(({ data }) => (info.summaryType = data))

  // 汇总方式 日周月年
  sysApi.tools
    .getEnum('com.dstz.biz.api.designquery.enums.DqDimensionSummaryType', true)
    .then(({ data }) => (info.dimensionSummaryType = data))

  const init = () => {
    if (
      ['custGrid', 'custDialog', 'formDesignSelector'].includes(
        config.value.control.source
      ) &&
      config.value.control.relCode
    ) {
      bizApi.custChart
        .custDataByCode(
          config.value.control.relCode,
          config.value.control.source
        )
        .then((rel) => {
          info.custSelect = rel.data.fieldList
          if (
            config.value.control.source == 'formDesignSelector' &&
            config.value.control.formKey
          ) {
            converArr()
          }
        })
    }

    // bizApi.custGrid.custGridList('mapData', null).then((result) => {
    //   if (result.data.list) {
    //     info.mapList = buildTree(result.data.list, '')
    //   }
    // })
    if (!config.value.control.minValue) {
      config.value.control.minValue = 0
    }
    if (!config.value.control.maxValue) {
      config.value.control.maxValue = 10000
    }
    // if (!config.value.control.height) {
    //   config.value.control.height = config.value.h
    // }
    //兼容老数据，对于之前没有过定时时间的都默认10
    if (!config.value.control.refreshCycle) {
      config.value.control.refreshCycle = 10
    }
    if (!config.value.control.source) {
      config.value.control.source = 'formDesignSelector'
    }
    if (!config.value.control.limit) {
      config.value.control.limit = 20
    }
  }

  init()

  // const selectData = (param: any) => {
  //   console.log(123456, param)
  // }

  //将自定义列表的内容转成树
  const buildTree: any = (list: Array<any>, parentId: string) => {
    if (!list || list.length == 0) {
      return
    }
    const tree = []
    for (let i = 0; i < list.length; i++) {
      if (list[i]['pcode_'] === parentId) {
        const node = {
          code: list[i]['code_'],
          name: list[i]['name_'],
          children: buildTree(list, list[i]['code_']),
        }
        tree.push(node)
      }
    }
    return tree
  }

  const changeSource = () => {
    config.value.control.formKey = ''
    cleranRel()
  }

  //清除关联
  const cleranRel = () => {
    config.value.control.relCode = ''
    config.value.control.relName = ''
    config.value.control.yzhou = ''
    config.value.control.xzhou = ''
    clearConfig()
  }

  const clearConfig = () => {
    config.value.control.latitudeConfig = []
    config.value.control.indicatorConfig = []
    config.value.control.conditionConfig = []
    config.value.control.yzhou = ''
    config.value.control.xzhou = undefined
  }

  const changeForm = (code: string) => {
    converArr()
    clearConfig()
  }

  const converArr = () => {
    let arr = abUtil.clone(info.custSelect)
    arr = arr?.filter((s: any) => {
      s.fieldList?.forEach(
        (item: any) => (item.key = `${item.tableCode}.${item.key}`)
      )
      return (
        s.key == info.custSelect[0].key || s.key == config.value.control.formKey
      )
    })
    info.formfields = arr
  }

  const rowKeyFunc = (row: any) => row.key
  const cellStyle = () => {
    return {
      height: '40px',
      padding: '0',
    }
  }

  const getSupport = (arr: any, type: any) => {
    return arr.filter((s: any) => s.supports.includes(type.fieldType))
  }

  const changeLatitude = (item: any) => {
    item.columnCode = item.key
  }

  const changeIndicator = (item: any) => {
    if (!item.summaryType) {
      item.summaryType = item.fieldType == 'number' ? 'sum' : 'count'
    }
    if (!item.columnCode) {
      item.columnCode = item.key
    }
  }

  const delIndicator = (item: any) => {
    config.value.control.indicatorConfig =
      config.value.control.indicatorConfig.filter(
        (s: any) => s.key !== item.key
      )
  }
  const delCondition = (item: any) => {
    config.value.control.conditionConfig =
      config.value.control.conditionConfig.filter(
        (s: any) => s.key !== item.key
      )
  }

  const addCondition = () => {
    if (
      !config.value.control.conditionConfig ||
      config.value.control.conditionConfig.length == 0
    ) {
      config.value.control.conditionConfig = [
        {
          con: '',
          name: '',
          val: '',
        },
      ]
    } else {
      config.value.control.conditionConfig.push({
        con: '',
        name: '',
        val: '',
      })
    }
  }

  const addLinkage = () => {
    if (
      !config.value.control.linkage ||
      config.value.control.linkage.length == 0
    ) {
      config.value.control.linkage = [
        {
          linkageParam: '',
          linkageData: '',
        },
      ]
    } else {
      config.value.control.linkage.push({
        linkageParam: '',
        linkageData: '',
      })
    }
  }

  const dialogOk = (list: any) => {
    if (!list || list.length < 1) {
      return
    }
    const dialogNo = list[0]

    bizApi.custChart
      .custDataByCode(dialogNo.code, config.value.control.source)
      .then((rel) => {
        cleranRel()
        info.custSelect = rel.data.fieldList
        changeForm(info.custSelect[0].key)

        config.value.control.relCode = dialogNo.code
        config.value.control.relName = dialogNo.name
        config.value.control.formKey = info.custSelect[0].key

        if (config.value.control.source == 'custGrid') {
          if (dialogNo.conditions) {
            config.value.control.conditionParam = JSON.parse(
              dialogNo.conditions
            )
          }
        }
      })
  }
</script>

<style scoped lang="scss">
  :deep(.mystyle .el-table .cell) {
    padding: 0 !important;
  }
</style>
