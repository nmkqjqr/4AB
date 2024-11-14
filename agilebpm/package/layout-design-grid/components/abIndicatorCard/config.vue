<template>
  <el-form-item>
    <template #label>
      <div>
        标题:
        <el-tooltip
          class="box-item"
          content="根据指标字段动态填充，或手动输入"
          effect="dark"
          placement="top-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-input
      v-if="config.control.source == 'staticData'"
      v-model="config.control.titleType"
      @change="updateData"
    />
    <el-select
      v-else
      v-model="config.control.titleType"
      allow-create
      clearable
      filterable
      placeholder="选择或填写标题"
    >
      <el-option label="根据指标字段动态生成" value="${dynamic}" />
    </el-select>
  </el-form-item>
  <el-form-item>
    <template #label>
      <div>
        字体颜色:
        <el-tooltip
          class="box-item"
          content="支持手动输入自定义颜色，参考格式：#000000 或 rgb(0,0,0,1)"
          effect="dark"
          placement="top-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-button
      icon="Refresh"
      round
      size="small"
      style="margin-right: 15px"
      type="primary"
      @click="
        () =>
          (config.control.fontColor =
            'rgb(' +
            Math.round(Math.random() * 255) +
            ',' +
            Math.round(Math.random() * 255) +
            ',' +
            Math.round(Math.random() * 255))
      "
    >
      随机
    </el-button>
    <el-color-picker
      v-model="config.control.fontColor"
      :predefine="predefineColors"
      show-alpha
    />
  </el-form-item>
  <el-form-item>
    <template #label>
      <div>
        标题颜色:
        <el-tooltip
          class="box-item"
          content="支持手动输入自定义颜色，参考格式：#000000 或 rgb(0,0,0,1)"
          effect="dark"
          placement="top-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </template>

    <el-button
      icon="Refresh"
      round
      size="small"
      style="margin-right: 15px"
      type="primary"
      @click="
        () =>
          (config.control.titleColor =
            'rgb(' +
            Math.round(Math.random() * 255) +
            ',' +
            Math.round(Math.random() * 255) +
            ',' +
            Math.round(Math.random() * 255))
      "
    >
      随机
    </el-button>

    <el-color-picker
      v-model="config.control.titleColor"
      :predefine="fountColors"
      show-alpha
    />
  </el-form-item>
  <el-form-item label="数据类型">
    <el-select
      v-model="config.control.source"
      placeholder="请选择"
      @change="cleranRel"
    >
      <el-option label="业务表单" value="formDesignSelector" />
      <el-option label="自定义对话框" value="custDialog" />
      <el-option label="自定义应用" value="custGrid" />
      <el-option label="静态数据" value="staticData" />
      <!-- <el-option label="grovvy脚本" value="grovvy" /> -->
    </el-select>
  </el-form-item>
  <el-form-item v-if="config.control.source == 'staticData'" label="静态数据">
    <el-select
      v-model="config.control.xzhou"
      allow-create
      clearable
      filterable
      placeholder="全局参数"
      @change="updateData"
    >
      <el-option
        v-for="item in formCombination?.designJson?.params"
        :key="'{' + item.name + '}'"
        :label="item.name"
        :value="'{' + item.name + '}'"
      />
      <!-- {{ formCombination?.designJson?.params }}
      <span
        v-for="param in formCombination?.designJson?.params"
        :key="param.name"
      >
        <el-option
          v-if="/^\$\{.*\}$/.test(param.value)"
          :label="param.name"
          :value="param.name"
        />
        <el-option v-else :label="param.name" :value="param.value" />
      </span> -->
    </el-select>
  </el-form-item>
  <span v-else>
    <el-form-item
      :label="
        config.control.source == 'custDialog'
          ? '对话框'
          : config.control.source == 'custGrid'
          ? '应用'
          : '业务表单'
      "
      :rules="[{ required: true, message: '必填' }]"
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

    <span v-if="config.control.relCode">
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

      <el-form-item
        v-if="
          config.control.relCode &&
          ['custDialog', 'custGrid'].includes(config.control.source)
        "
        :label="$abT('page.homeComponent.indicatorFields', '指标字段')"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-select
          v-model="config.control.xzhou"
          placeholder="请选择"
          @change="updateData"
        >
          <el-option
            v-for="item in info.formfields"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <span
        v-if="
          'formDesignSelector' == config.control.source &&
          config.control.formKey
        "
      >
        <el-form-item
          :label="$abT('page.homeComponent.indicatorFields', '指标字段')"
          :rules="[{ required: true, message: '必填' }]"
        >
          <el-select
            v-model="config.control.xzhou"
            placeholder="请选择"
            @change="updateData"
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
                :value="field.key"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            'formDesignSelector' == config.control.source &&
            config.control.formKey
          "
          label="统计方式"
        >
          <el-select
            v-model="config.control.summaryType"
            clearable
            placeholder="请选择"
            @change="updateData"
          >
            <el-option
              v-for="item in getSupport(
                info.summaryTypeList,
                config.control.xzhou
              )"
              :key="item.key"
              :label="item.desc"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="过滤条件"
          :style="
            config.control.conditionConfig &&
            config.control.conditionConfig.length > 0
              ? { 'margin-bottom': '10px' }
              : {}
          "
        >
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

        <span class="mystyle">
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
        </span>
      </span>
      <el-form-item
        v-if="
          config.control.source == 'custGrid' &&
          config.control.conditionParam &&
          config.control.conditionParam.length > 0
        "
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
      <span class="mystyle">
        <el-table
          v-if="
            config.control.source == 'custGrid' &&
            config.control.conditionList &&
            config.control.conditionList.length > 0
          "
          :cell-style="cellStyle"
          :data="config.control.conditionList"
          :header-cell-style="{ height: '10px' }"
          :row-key="rowKeyFunc"
          :row-style="cellStyle"
          style="padding: 0; margin-bottom: 40px"
        >
          <el-table-column align="center" label="过滤字段">
            <template #default="{ row }">
              <el-select v-model="row.name" clearable placeholder="过滤字段">
                <el-option
                  v-for="param in config.control.conditionParam"
                  :key="param.fieldName"
                  :label="param.fieldDesc"
                  :value="param.fieldName"
                  @click="
                    () => {
                      row.con = param.cntype
                      updateData()
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
                      updateData()
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
                      config.control.conditionList.splice($index, 1)
                      updateData()
                    }
                  "
                >
                  <Delete />
                </el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </span>
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
      <span class="mystyle">
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
                <!-- <el-option :label="$abT('page.homeComponent.dimensionName','维度名称')" value="latitudeName" />
          <el-option label="维度数值" value="latitudekey" /> -->
                <el-option label="指标数值" value="indicatorKey" />
                <!-- <el-option :label="$abT('page.homeComponent.indicatorName','指标名称')" value="indicatorName" /> -->
                <el-option label="标题" value="titleValue" />
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
      </span>
    </span>
  </span>
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
</template>
<script setup lang="ts">
  import { Plus, Search } from '@element-plus/icons-vue'
  import { defineProps, PropType, toRefs } from 'vue'
  import { abUtil, bizApi, sysApi } from '~/agilebpm'
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
  const { config, formCombination } = toRefs(props)

  const info: any = reactive({
    conditionEnum: [],
    custSelect: [],
    indicatorData: [],
    formfields: [],
    summaryTypeList: [],
  })

  //兼容老数据，对于之前没有过定时时间的都默认10
  if (!config.value.control.refreshCycle) {
    config.value.control.refreshCycle = 10
  }

  const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    '#ffa940',
    '#ffffff',
    '#000000',
  ])

  const fountColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    '#606266',
    '#ffffff',
    '#000000',
  ])

  const cellStyle = () => {
    return {
      height: '40px',
      padding: '0',
    }
  }
  const rowKeyFunc = (row: any) => row.key
  const cleranRel = () => {
    config.value.control.relCode = undefined
    config.value.control.relName = undefined
    config.value.control.xzhou = undefined
    config.value.control.showValue = undefined
    config.value.control.summaryType = undefined
    config.value.control.conditionConfig = []
    config.value.control.condition = []
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

  const addCondition = () => {
    if (
      !config.value.control.conditionList ||
      config.value.control.conditionList.length == 0
    ) {
      config.value.control.conditionList = [
        {
          con: '',
          name: '',
          val: '',
        },
      ]
    } else {
      config.value.control.conditionList.push({
        con: '',
        name: '',
        val: '',
      })
    }
  }

  const init = () => {
    if (!config.value.control.source) {
      config.value.control.source = 'formDesignSelector'
    }

    if (
      config.value.control.source &&
      ['custGrid', 'custDialog', 'formDesignSelector'].includes(
        config.value.control.source
      ) &&
      config.value.control.relCode
    ) {
      bizApi.custChart
        .custGridDataByCode(
          config.value.control.relCode,
          config.value.control.source,
          config.value.control.conditionList,
          null
        )
        .then((rel) => {
          info.custSelect = rel.data.fieldList
          info.echarsData = rel.data.custData
          info.formfields = rel.data.fieldList
          if (
            config.value.control.source == 'formDesignSelector' &&
            config.value.control.formKey
          ) {
            converArr()
          }
        })
    }
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

  // 条件类型下拉框
  sysApi.tools
    .getEnum('com.dstz.biz.api.designquery.enums.DqQuotaSummaryType', true)
    .then(({ data }) => (info.summaryTypeList = data))

  // 条件类型下拉框
  sysApi.tools
    .getEnum('com.dstz.base.query.ConditionType', true)
    .then(({ data }) => {
      info.conditionEnum = data.filter((s: any) => s.key != 'BT')
    })
  if (!config.value.control.source) {
    config.value.control.source = 'formDesignSelector'
  }

  //执行初始化方法
  init()

  const delCondition = (item: any) => {
    config.value.control.conditionConfig =
      config.value.control.conditionConfig?.filter(
        (s: any) => s.key !== item.key
      )
  }

  const getSupport = (arr: any, type: any) => {
    if (type) {
      let rel = [] as any[]
      info.formfields.forEach((element: any) => {
        const obj = element?.fieldList.find((s: any) => s.key == type)
        if (obj) {
          rel = arr.filter((s: any) => s.supports.includes(obj.fieldType))
        }
      })
      return rel
    }
  }

  //选择对话框后同步数据
  const dialogOk = (list: any) => {
    if (!list || list.length < 1) {
      return
    }
    const dialogNo = list[0]

    bizApi.custChart
      .custDataByCode(dialogNo.code, config.value.control.source)
      .then((rel) => {
        if (config.value.control.source == 'formDesignSelector') {
          info.custSelect = rel.data.fieldList
          config.value.control.formKey = info.custSelect[0].key
          changeForm()
        } else if (config.value.control.source == 'custGrid') {
          info.formfields = rel.data.fieldList
          if (dialogNo.conditions) {
            config.value.control.conditionParam = JSON.parse(
              dialogNo.conditions
            )
          }
        } else {
          info.formfields = rel.data.fieldList
        }
        info.indicatorData = rel.data.custData

        config.value.control.relCode = dialogNo.code
        config.value.control.relName = dialogNo.name
      })
  }

  const changeForm = () => {
    converArr()
    config.value.control.xzhou = undefined
    config.value.control.summaryType = undefined
    config.value.control.showValue = undefined
    config.value.control.conditionConfig = []
    config.value.control.condition = []
  }

  watch(
    () => props.config.key,
    () => init()
  )

  const updateData = () => {
    props.config.initFunction()
  }
</script>
<style scoped lang="scss">
  .color-span {
    position: absolute;
    width: 20px;
    height: 20px;
    margin-top: 7px;
    margin-left: 90px;
    background: #999999;
    border-radius: 100%;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.4);
  }

  :deep(.mystyle .el-table .cell) {
    padding: 0 !important;
  }
</style>
