<template>
  <div>
    <el-divider content-position="center">甘特图配置</el-divider>
    <el-form-item label="数据类型">
      <el-select
        v-model="config.control.source"
        placeholder="请选择"
        @change="changeSource"
      >
        <el-option label="业务表单" value="formDesignSelector" />
        <el-option label="自定义应用" value="custGrid" />
      </el-select>
    </el-form-item>
    <div>
      <el-form-item
        v-if="
          ['custGrid', 'formDesignSelector'].includes(config.control.source)
        "
        :label="config.control.source == 'custGrid' ? '应用' : '业务表单'"
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
          :icon="Search"
          :param="{ gridType: 'list' }"
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
            v-for="item in config.control.custSelect"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <span v-if="config.control.relCode">
        <span
          v-if="
            ['custGrid', 'formDesignSelector'].includes(config.control.source)
          "
        >
          <el-form-item label="数据量限制">
            <el-input
              v-model="config.control.limit"
              :min="1"
              placeholder="请输入返回数据的最大数量"
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
          <el-form-item
            :label="$abT('page.homeComponent.dimensionField', '维度字段')"
            :rules="[{ required: true, message: '必填' }]"
          >
            <!-- v-if="item.name.indexOf('主键') == -1" -->
            <el-select
              v-model="config.control.dimension"
              collapse-tags
              collapse-tags-tooltip
              multiple
              placeholder="请选择"
              value-key="key"
              @change="changeDimension"
            >
              <el-option-group
                v-for="item in config.control.formfields"
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
          <span
            v-if="['formDesignSelector'].includes(config.control.source)"
            class="mystyle"
          >
            <el-table
              v-if="
                config.control.dimension && config.control.dimension.length > 0
              "
              :cell-style="cellStyle"
              :data="config.control.dimension"
              :header-cell-style="{ height: '10px' }"
              style="padding: 0; margin-bottom: 20px"
            >
              <el-table-column label="字段名" prop="name">
                <template #default="{ row }">
                  <el-input v-model="row.name" />
                </template>
              </el-table-column>
              <el-table-column label="分组字段">
                <template #default="{ row }">
                  <el-switch
                    v-model="row.checked"
                    @change="changeChecked($event, row)"
                  />
                </template>
              </el-table-column>
              <el-table-column fixed="right" width="60">
                <template #default="{ row, $index }">
                  <el-button link type="danger">
                    <el-icon :size="22" @click="delDimension($index)">
                      <Delete />
                    </el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </span>
          <el-form-item
            label="配置字段"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-button
              :icon="Plus"
              round
              size="small"
              style="margin-left: 10px"
              type="primary"
              @click="openData"
            >
              选择
            </el-button>
          </el-form-item>
          <el-form-item
            v-if="
              config.control.source == 'formDesignSelector' &&
              config.control.relCode
            "
            label="过滤条件"
            :style="
              config.control.conditionConfig ? { 'margin-bottom': '10px' } : {}
            "
          >
            <el-select
              v-model="config.control.conditionConfig"
              collapse-tags
              collapse-tags-tooltip
              multiple
              placeholder="请选择"
              value-key="key"
            >
              <el-option-group
                v-for="item in config.control.formfields"
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
          <span
            v-if="['formDesignSelector'].includes(config.control.source)"
            class="mystyle"
          >
            <el-table
              v-if="
                config.control.conditionConfig &&
                config.control.conditionConfig.length > 0
              "
              :cell-style="cellStyle"
              :data="config.control.conditionConfig"
              :header-cell-style="{ height: '10px' }"
              style="padding: 0; margin-bottom: 20px"
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
          <el-form-item label="更新事件">
            <el-button :icon="Edit" text type="primary" @click="openClick">
              设置
            </el-button>
          </el-form-item>
          <el-form-item label="默认模式">
            <el-select
              v-model="config.control.defaultModel"
              placeholder="请选择"
            >
              <el-option label="小半天" value="Quarter Day" />
              <el-option label="半天" value="Half Day" />
              <el-option label="天" value="Day" />
              <el-option label="月" value="Month" />
              <el-option label="周" value="Week" />
            </el-select>
          </el-form-item>
        </span>
      </span>
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
    <el-dialog
      v-model="info.clickVisible"
      append-to-body
      destroy-on-close
      title="更新事件"
      width="400"
    >
      <el-form-item label="表单选择" required>
        <el-input v-model="config.control.relNameNew" clearable readonly>
          <template #append>
            <ab-cust-dialog
              v-model="config.control.relCodeNew"
              :dialog-key="'formDesignSelector'"
              type="primary"
              @ok="dialogOkNew"
            >
              选择
            </ab-cust-dialog>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="主键入参">
        <el-select
          v-model="config.control.idKey"
          clearable
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option-group
            v-for="item in config.control.formfields"
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
      <el-form-item label="后置刷新">
        <el-select
          v-model="config.control.reloadCom"
          clearable
          :multiple="true"
          style="width: 100%"
        >
          <template v-for="item in getFlatComponentList()" :key="item.key">
            <el-option :label="item.label" :value="item.key" />
          </template>
        </el-select>
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-space wrap>
            <el-button text type="primary" @click="info.clickVisible = false">
              取消
            </el-button>
            <el-button type="primary" @click="editDialogOk">确定</el-button>
          </el-space>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="info.dataDialog" title="选择字段" width="600px">
      <div>
        <el-form-item label="联动字段">
          <el-select
            v-model="config.control.linkage"
            clearable
            placeholder="请选择"
          >
            <el-option-group
              v-for="item in config.control.formfields"
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
          label="开始时间"
          :rules="[{ required: true, message: '必填' }]"
        >
          <el-select
            v-model="config.control.beginTime"
            clearable
            placeholder="请选择"
          >
            <el-option-group
              v-for="item in config.control.formfields"
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
          label="结束时间"
          :rules="[{ required: true, message: '必填' }]"
        >
          <el-select
            v-model="config.control.endTime"
            clearable
            placeholder="请选择"
          >
            <el-option-group
              v-for="item in config.control.formfields"
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

        <el-form-item label="进度">
          <el-select
            v-model="config.control.schedule"
            clearable
            placeholder="请选择"
          >
            <el-option-group
              v-for="item in config.control.formfields"
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
        <el-form-item label="标题">
          <el-select
            v-model="config.control.title"
            clearable
            placeholder="请选择"
          >
            <el-option-group
              v-for="item in config.control.formfields"
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
        <el-form-item label="副标题">
          <el-select
            v-model="config.control.assiTitle"
            clearable
            placeholder="请选择"
          >
            <el-option-group
              v-for="item in config.control.formfields"
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
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            text
            type="primary"
            @click="() => (info.dataDialog = false)"
          >
            取消
          </el-button>
          <el-button type="primary" @click="saveData">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { Edit, Plus, Search } from '@element-plus/icons-vue'
  import { defineProps, PropType, toRefs } from 'vue'
  import { bizApi, sysApi } from '~/agilebpm'
  import * as abUtil from '~/agilebpm/utils/ab-util'

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
  const globalParams = inject('globalParams') as any
  const info = reactive({
    dataDialog: false,
    conditionEnum: [],
    conditionConfig: [],
    clickVisible: false,
  })

  const getFlatComponentList = inject('getFlatComponentList') as any

  onMounted(() => {
    //兼容老数据，对于之前没有过定时时间的都默认10
    if (!config.value.control.refreshCycle) {
      config.value.control.refreshCycle = 10
    }
    if (!config.value.control.gatteClass) {
      config.value.control.gatteClass = `gantt-target${abUtil.AbRandom.GetRandomStr(
        4
      )}`
    }
    if (!config.value.control.gatteClassPreview) {
      config.value.control.gatteClassPreview = `gantt-targetPreview${abUtil.AbRandom.GetRandomStr(
        4
      )}`
    }

    if (!config.value.control.echarsData) {
      config.value.control.echarsData = []
    }
    if (!config.value.control.query) {
      config.value.control.query = {
        designCode: '',
        tableCode: '',
        conditionList: [],
        limit: 20,
      }
    }
    if (!config.value.control.source) {
      config.value.control.source = 'formDesignSelector'
    }
    if (!config.value.control.defaultModel) {
      config.value.control.defaultModel = 'Day'
    }
    if (!config.value.control.limit) {
      config.value.control.limit = 20
    }
    const control = config.value.control

    config.value.control.custSelect = []
    if (
      control.source &&
      ['custGrid', 'formDesignSelector'].includes(control.source) &&
      control.relCode
    ) {
      bizApi.custChart
        .custGridDataByCode(
          control.source == 'custGrid'
            ? control.boCode
            : control.relCodeNew || control.relCode,
          control.source,
          null,
          control.limit
        )
        .then((rel) => {
          config.value.control.custSelect = rel.data.fieldList
          config.value.control.echarsData = rel.data.custData
          if (control.source == 'formDesignSelector' && control.formKey) {
            config.value.control.query['designCode'] = control.relCode
            config.value.control.query['tableCode'] = control.formKey
            config.value.control.query['limit'] = Number(control.limit)
            converArr()
          } else {
            config.value.control.formfields = []
            config.value.control.formfields.push({
              key: 'custDialog',
              name: '选择',
              fieldList: rel.data.fieldList,
            })
            config.value.control.echarsData = rel.data.custData.reverse()
          }

          if (control.dimension && control.dimension.length > 0) {
            config.value.control.dimension = control.dimension
          }
        })
    }
  })

  const converArr = () => {
    let arr = abUtil.clone(config.value.control.custSelect)
    arr = arr?.filter((s: any) => {
      s.fieldList?.forEach(
        (item: any) => (item.key = `${item.tableCode}.${item.key}`)
      )
      return (
        s.key == config.value.control.custSelect[0].key ||
        s.key == config.value.control.formKey
      )
    })
    config.value.control.formfields = arr
  }

  // 条件类型下拉框
  sysApi.tools
    .getEnum('com.dstz.base.query.ConditionType', true)
    .then(({ data }) => {
      info.conditionEnum = data.filter((s: any) => s.key != 'BT')
    })
  //选择对话框后同步数据
  const dialogOk = (list: any) => {
    if (!list || list.length < 1) {
      return
    }
    const dialogNo = list[0]

    if (!config.value.control.query) {
      config.value.control.query = {
        designCode: '',
        tableCode: '',
        conditionList: [],
        limit: 20,
      }
    }
    bizApi.custChart
      .custGridDataByCode(
        dialogNo.code,
        config.value.control.source,
        null,
        config.value.control.limit
      )
      .then((rel) => {
        config.value.control.custSelect = rel.data.fieldList
        config.value.control.relCode = dialogNo.code
        config.value.control.relName = dialogNo.name
        config.value.control.query['designCode'] = dialogNo.code
        config.value.control.query['tableCode'] =
          config.value.control.custSelect[0].key
        config.value.control.query['limit'] = config.value.control.limit
        if (config.value.control.source == 'formDesignSelector') {
          config.value.control.echarsData = rel.data.custData
          config.value.control.formKey = config.value.control.custSelect[0].key
          changeForm(config.value.control.custSelect[0].key)
          if (
            config.value.control.conditionConfig &&
            config.value.control.conditionConfig.length > 0
          ) {
            config.value.control.query['conditionList'] =
              config.value.control.conditionConfig
          }
          config.value.control.formKey = config.value.control.custSelect[0].key
          config.value.control.boCode = dialogNo.boCode
        } else {
          config.value.control.formfields = []
          config.value.control.formfields.push({
            key: 'custDialog',
            name: '选择',
            fieldList: rel.data.fieldList,
          })
          config.value.control.echarsData = rel.data.custData.reverse()
          config.value.control.boCode = dialogNo.code
          // getData(
          //   bizApi.custGrid.custGetByCodeUrl + config.value.control.boCode,
          //   {}
          // ).then(
          //   async ({ data }) => {
          //     if (data.relatedId) {
          //       config.value.control.relCodeNew = data.relatedId
          //     }
          //   },
          //   (error) => {}
          // )
        }
      })
  }

  const getCustData = (query: any) => {
    config.value.control.creatGshow = false
    if (config.value.control.source == 'formDesignSelector') {
      bizApi.custChart.custFormDataByCode(query).then((result) => {
        if (result.data.custData && result.data.custData.length > 0) {
          cellArray(result.data.custData)
        }
      })
    } else {
      // 通过维度匹配数据
      if (
        config.value.control.echarsData &&
        config.value.control.echarsData.length > 0
      ) {
        const categorizedItems = config.value.control.echarsData.reduce(
          (custDataResult: any, custDataItem: any) => {
            if (
              !custDataResult[
                custDataItem[config.value.control.dimension[0].key]
              ]
            ) {
              custDataResult[
                custDataItem[config.value.control.dimension[0].key]
              ] = []
            }
            custDataResult[
              custDataItem[config.value.control.dimension[0].key]
            ].push(custDataItem)
            return custDataResult
          },
          {}
        )
        const arr = []
        for (const i in categorizedItems) {
          arr.push({
            key: i,
            list: categorizedItems[i],
          })
        }
        config.value.control.custData = JSON.parse(JSON.stringify(arr))
      }
    }
  }

  const cellArray = (custData: any) => {
    if (
      config.value.control.dimension &&
      config.value.control.dimension.length > 0
    ) {
      // 通过维度匹配数据
      let key = ''
      if (
        config.value.control.dimension.filter(
          (item: any) => item.checked == true
        )[0]
      ) {
        key = config.value.control.dimension.filter(
          (item: any) => item.checked == true
        )[0].key
      }
      if (!key || key.length <= 0) {
        return
      }
      const categorizedItems = custData.reduce(
        (custDataResult: any, custDataItem: any) => {
          if (!custDataResult[custDataItem[key]]) {
            custDataResult[custDataItem[key]] = []
          }
          custDataResult[custDataItem[key]].push(custDataItem)
          return custDataResult
        },
        {}
      )
      const arr = []
      for (const i in categorizedItems) {
        arr.push({
          key: i,
          list: categorizedItems[i],
        })
      }
      config.value.control.custData = JSON.parse(JSON.stringify(arr))
    }
  }

  const clearConfig = () => {
    config.value.control.dimension = []
    config.value.control.linkage = ''
    config.value.control.beginTime = ''
    config.value.control.endTime = ''
    config.value.control.schedule = ''
    config.value.control.title = ''
    config.value.control.assiTitle = ''
  }

  //清除关联
  const cleranRel = () => {
    config.value.control.relCode = ''
    config.value.control.relName = ''
    config.value.control.relCodeNew = ''
    config.value.control.relNameNew = ''
    config.value.control.idKey = ''
    config.value.control.formKey = ''
    config.value.control.conditionConfig = []
    clearConfig()
  }

  const changeSource = () => {
    cleranRel()
  }

  const changeForm = (code: string) => {
    config.value.control.query['tableCode'] = code
    converArr()
    clearConfig()
  }

  const changeDimension = (list: any) => {
    config.value.control.dimension = list
  }

  const openData = () => {
    if (
      !config.value.control.dimension ||
      config.value.control.dimension.length <= 0
    ) {
      ElMessage({
        type: 'warning',
        message: '请先选择维度字段',
      })
      return false
    }
    if (
      config.value.control.dimension &&
      config.value.control.source == 'formDesignSelector'
    ) {
      let number = 0
      config.value.control.dimension.forEach((item: any, index) => {
        if (item.checked) {
          number++
        }
      })
      if (number <= 0) {
        ElMessage({
          type: 'warning',
          message: '请先选择一个维度分组字段',
        })
        return false
      }
    }
    info.dataDialog = true
  }

  const saveData = () => {
    if (
      !config.value.control.beginTime ||
      config.value.control.beginTime.length <= 0 ||
      !config.value.control.endTime ||
      config.value.control.endTime.length <= 0
    ) {
      ElMessage({
        type: 'error',
        message: '请完善必填项',
      })
      return false
    }
    info.dataDialog = false
    config.value.control.query['limit'] = config.value.control.limit
    getCustData(config.value.control.query)
  }

  const cellStyle = () => {
    return {
      height: '40px',
      padding: '0',
    }
  }

  const delDimension = (index: any) => {
    config.value.control.dimension.splice(index, 1)
  }

  const delCondition = (item: any) => {
    config.value.control.conditionConfig =
      config.value.control.conditionConfig?.filter(
        (s: any) => s.key !== item.key
      )
  }

  const addSummary = () => {
    if (!config.value.control.summaryList) {
      config.value.control.summaryList = []
    }
    config.value.control.summaryList.push({
      text: '',
      params: '',
    })
  }
  const dialogOkNew = (list: any) => {
    if (!list || list.length < 1) {
      return
    }
    const dialogNo = list[0]
    bizApi.custChart
      .custGridDataByCode(
        dialogNo.code,
        'formDesignSelector',
        null,
        config.value.control.limit
      )
      .then((rel) => {
        config.value.control.relCodeNew = dialogNo.code
        config.value.control.relNameNew = dialogNo.name
        config.value.control.boCodeNew = dialogNo.boCode || dialogNo.code
      })
  }
  const openClick = () => {
    info.clickVisible = true
    if (
      !config.value.control.relCodeNew ||
      config.value.control.relCodeNew.length <= 0
    ) {
      if (config.value.control.source == 'formDesignSelector') {
        config.value.control.relCodeNew = config.value.control.relCode
      }
    }
    if (
      !config.value.control.relNameNew ||
      config.value.control.relNameNew.length <= 0
    ) {
      if (config.value.control.source == 'formDesignSelector') {
        config.value.control.relNameNew = config.value.control.relName
      }
    }
  }
  const editDialogOk = () => {
    info.clickVisible = false
  }

  const changeChecked = (value: any, row: any) => {
    let num = 0
    config.value.control.dimension.forEach((item) => {
      if (item.checked) {
        num++
      }
    })
    if (num <= 0) {
      ElMessage({
        type: 'warning',
        message: '至少有一个分组字段',
      })
      row.checked = true
    }
  }

  const conversion = (conditionConfig: any[]) => {
    const result: any[] = abUtil.clone(conditionConfig)
    for (const item in result) {
      if (result[item].value) {
        result[item].value = result[item].value.abArgFormat(globalParams)
      }
    }
    return result
  }

  watch(
    () => config.value.control.dimension,
    (newVal) => {
      if (newVal && newVal.length > 0) {
        if (config.value.control.source == 'formDesignSelector') {
          if (
            config.value.control.query['designCode'] &&
            config.value.control.query['designCode'].length > 0
          ) {
            if (
              config.value.control.conditionConfig &&
              config.value.control.conditionConfig.length > 0
            ) {
              config.value.control.query['conditionList'] = conversion(
                config.value.control.conditionConfig
              )
            }
            bizApi.custChart
              .custFormDataByCode(config.value.control.query)
              .then((result) => {
                if (result.data.custData && result.data.custData.length > 0) {
                  cellArray(result.data.custData)
                }
              })
          }
        }
      }
    },
    { deep: true, immediate: true }
  )
</script>
