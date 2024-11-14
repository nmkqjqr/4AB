<template>
  <div>
    <!-- <el-form-item label="echarts高度">
      <el-slider
        v-model="config.control.height"
        :max="100"
        show-stops
        :step="5"
        style="width: 80%"
      />
    </el-form-item> -->
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
        <!-- <el-option label="静态echarts" value="staticEchart" /> -->
      </el-select>
    </el-form-item>
    <div v-if="config.control.source === 'custEchart'">
      <el-form-item label="标题">
        <el-input v-model="config.control.ztitle" />
      </el-form-item>
      <el-form-item label="字体主题">
        <el-radio-group v-model="config.control.fontStyle">
          <el-radio :label="0">黑色</el-radio>
          <el-radio :label="1">白色</el-radio>
        </el-radio-group>
      </el-form-item>
      <span
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
      </span>
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
    <div v-else>
      <el-form-item
        v-if="
          ['custGrid', 'custDialog', 'formDesignSelector'].includes(
            config.control.source
          )
        "
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
        label="图表类型"
        :rules="[{ required: true, message: '必填' }]"
        style="margin-bottom: 12px"
      >
        <span
          v-for="item in info.echarsType"
          :key="item"
          :label="item"
          style="margin-right: 2px"
          :value="item"
        >
          <ab-icon :icon="item" size="39.2px" @click="changeEcharsType(item)" />
        </span>
      </el-form-item>

      <span v-if="config.control.type && config.control.relCode">
        <el-form-item label="数据量限制">
          <el-input
            v-model="config.control.limit"
            :min="1"
            placeholder="请输入返回数据的最大数量"
            type="number"
            @change="
              () => {
                console.log(
                  'formCombination?.designJson?.params',
                  formCombination?.designJson?.params
                )

                if (config.control.limit && config.control.limit < 1) {
                  config.control.limit = 1
                }
              }
            "
          />
        </el-form-item>
        <span v-if="['custDialog', 'custGrid'].includes(config.control.source)">
          <el-form-item
            :label="$abT('page.homeComponent.dimensionField', '维度字段')"
            :rules="[{ required: true, message: '必填' }]"
          >
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
            v-if="['bar', 'line', 'area'].includes(config.control.type)"
            :label="$abT('page.homeComponent.indicatorFields', '指标字段')"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-select
              v-model="config.control.yzhou"
              multiple
              placeholder="请选择"
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
            v-else
            :label="$abT('page.homeComponent.indicatorFields', '指标字段')"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-select v-model="config.control.yzhou[0]" placeholder="请选择">
              <el-option
                v-for="item in info.custSelect"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </span>
        <span
          v-if="
            config.control.source == 'formDesignSelector' &&
            config.control.formKey
          "
        >
          <el-form-item
            :label="$abT('page.homeComponent.dimensionField', '维度字段')"
            :rules="[{ required: true, message: '必填' }]"
            :style="config.control.xzhou ? { 'margin-bottom': '10px' } : {}"
          >
            <el-select
              v-model="config.control.xzhou"
              clearable
              placeholder="请选择"
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
                  @click="changeLatitude(field)"
                />
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-table
            v-if="config.control.xzhou"
            :cell-style="cellStyle"
            :data="config.control.latitudeConfig"
            :expand-row-keys="info.rowKeys"
            :header-cell-style="{ height: '10px' }"
            :row-key="rowKeyFunc"
            :row-style="cellStyle"
            style="margin-bottom: 40px"
          >
            <el-table-column
              v-if="
                config.control.latitudeConfig &&
                config.control.latitudeConfig.length > 0 &&
                config.control.latitudeConfig[0].fieldType == 'date'
              "
              type="expand"
              width="30px"
            >
              <template #default="{ row }">
                <el-form-item label="汇总方式">
                  <el-select
                    v-model="row.summaryType"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in info.dimensionSummaryType"
                      :key="item.key"
                      :label="item.desc"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="字段" prop="name" show-overflow-tooltip />
            <el-table-column label="排序类型" prop="desc">
              <template #default="{ row }">
                <el-select v-model="row.sort" clearable placeholder="请选择">
                  <el-option
                    v-for="item in info.sortArr"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                  />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column width="55">
              <template #default="{ $index }">
                <el-button link type="danger">
                  <el-icon
                    :size="22"
                    @click="
                      ;(config.control.xzhou = undefined),
                        config.control.latitudeConfig.splice($index, 1)
                    "
                  >
                    <Delete />
                  </el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-form-item
            :label="$abT('page.homeComponent.indicatorFields', '指标字段')"
            :rules="[{ required: true, message: '必填' }]"
            :style="
              config.control.indicatorConfig &&
              config.control.indicatorConfig.length > 0
                ? { 'margin-bottom': '10px' }
                : {}
            "
          >
            <el-select
              v-model="config.control.indicatorConfig"
              clearable
              collapse-tags
              collapse-tags-tooltip
              multiple
              placeholder="请选择"
              value-key="key"
              @change="changeIndicator"
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

          <el-table
            v-if="
              config.control.indicatorConfig &&
              config.control.indicatorConfig.length > 0
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
                  <el-select v-model="row.sort" clearable placeholder="请选择">
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

          <el-form-item
            label="过滤条件"
            :style="
              config.control.conditionConfig ? { 'margin-bottom': '10px' } : {}
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
        <span
          v-if="
            ['custDialog', 'custGrid'].includes(config.control.source) ||
            (config.control.source == 'formDesignSelector' &&
              config.control.formKey)
          "
        >
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
                          config.control.conditionList.splice($index, 1)
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

          <el-form-item label="标题">
            <el-input v-model="config.control.ztitle" />
          </el-form-item>
          <el-form-item
            :label="$abT('page.homeComponent.colorStyle', '颜色风格')"
          >
            <el-select
              v-model="config.control.style"
              clearable
              @change="transStyle"
            >
              <el-option label="系统默认" value="xtmr">
                系统默认
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #509ee3"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #9cc177"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #a989c5"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #f9d45c"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #f1b556"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #a6e7f3"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #7172ad"
                ></span>
              </el-option>
              <el-option label="绚丽多彩" value="xldc">
                绚丽多彩
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #578af2"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #62e075"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #42b36f"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #ffd660"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #b3de36"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #fa914e"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #f25252"
                ></span>
              </el-option>
              <el-option label="蓝橙撞色" value="lczs">
                蓝橙撞色
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #4d8cae"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #ad5601"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #324498"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #2b5b75"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #0fa8e0"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #ff8500"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #006bc2"
                ></span>
              </el-option>
              <el-option label="英伦酒红" value="yljh">
                英伦酒红
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #db5545"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #784029"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #e39970"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #e0d09f"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #a5a187"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #474844"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #984337"
                ></span>
              </el-option>
              <el-option label="清新草绿" value="qxcl">
                清新草绿
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #8ac98b"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #a4ded9"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #67b9cd"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #d6d6d7"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #8d9e69"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #eb4b5c"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #b7d62e"
                ></span>
              </el-option>
              <el-option label="神秘魅紫" value="smmz">
                神秘魅紫
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #c366a1"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #503491"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #daa6d6"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #a999c9"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #d3c3db"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #a563ac"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #7260af"
                ></span>
              </el-option>
              <el-option label="热情暖阳" value="rqny">
                热情暖阳
                <span
                  class="color-span"
                  style="left: 12px; z-index: 10; background-color: #ff9090"
                ></span>
                <span
                  class="color-span"
                  style="left: 24px; z-index: 9; background-color: #d53872"
                ></span>
                <span
                  class="color-span"
                  style="left: 36px; z-index: 8; background-color: #b91515"
                ></span>
                <span
                  class="color-span"
                  style="left: 48px; z-index: 7; background-color: #bba588"
                ></span>
                <span
                  class="color-span"
                  style="left: 60px; z-index: 6; background-color: #ffd54f"
                ></span>
                <span
                  class="color-span"
                  style="left: 72px; z-index: 5; background-color: #ff9800"
                ></span>
                <span
                  class="color-span"
                  style="left: 84px; z-index: 4; background-color: #fbe8e1"
                ></span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字体主题">
            <el-radio-group v-model="config.control.fontStyle">
              <el-radio :label="0">黑色</el-radio>
              <el-radio :label="1">白色</el-radio>
            </el-radio-group>
          </el-form-item>
          <span v-if="['bar', 'line', 'area'].includes(config.control.type)">
            <el-form-item
              :label="$abT('page.homeComponent.dimensionName', '维度名称')"
            >
              <el-input v-model="config.control.xname" />
            </el-form-item>
            <el-form-item
              :label="$abT('page.homeComponent.indicatorName', '指标名称')"
            >
              <el-input v-model="config.control.yname" />
            </el-form-item>
          </span>
          <span v-if="'pie' === config.control.type">
            <el-form-item label="环形">
              <el-switch v-model="config.control.huanxing" />
            </el-form-item>
            <el-form-item label="标注">
              <el-switch v-model="config.control.biaozhu" />
            </el-form-item>
            <el-form-item label="标签">
              <el-switch v-model="config.control.tip" />
            </el-form-item>
            <el-form-item label="玫瑰图形">
              <el-switch v-model="config.control.rose" />
            </el-form-item>
          </span>
          <span v-if="'funnel' === config.control.type">
            <el-form-item label="标注">
              <el-switch v-model="config.control.biaozhu" />
            </el-form-item>
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
                    :placeholder="
                      $abT('page.homeComponent.parameter', '参数值')
                    "
                  >
                    <el-option
                      :label="
                        $abT('page.homeComponent.dimensionValue', '维度数值')
                      "
                      value="latitudekey"
                    />
                    <el-option
                      :label="
                        $abT('page.homeComponent.indicatorValue', '指标数值')
                      "
                      value="indicatorKey"
                    />
                    <!-- <el-option :label="$abT('page.homeComponent.dimensionName','维度名称')" value="latitudeName" />
                    <el-option :label="$abT('page.homeComponent.indicatorName','指标名称')" value="indicatorName" /> -->
                    <el-option
                      :label="$abT('page.common.title', '标题')"
                      value="titleValue"
                    />
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
  import { bizApi, sysApi } from '~/agilebpm'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import abIcon from './components/AbIcon.vue'
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
    custSelect: [],
    echarsData: [],
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

    rowKeys: [],

    echarsType: [],
  })

  const rowKeyFunc = (row: any) => row.key

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

    //兼容老数据，对于之前没有过定时时间的都默认10
    if (!config.value.control.refreshCycle) {
      config.value.control.refreshCycle = 10
    }
    if (!config.value.control.height) {
      config.value.control.height = config.value.h
    }
    // if (!config.value.control.style) {
    //   config.value.control.style = 'xtmr'
    // }
    if (!config.value.control.source) {
      config.value.control.source = 'formDesignSelector'
    }
    if (!config.value.control.limit) {
      config.value.control.limit = 20
    }
    if (!config.value.control.fontStyle) {
      config.value.control.fontStyle = 0
    }
    if (!config.value.control.type) {
      const conmponent = config.value.type
      if (conmponent == 'AbBarEcharts') {
        config.value.control.type = 'bar'
      } else if (conmponent == 'AbPieEcharts') {
        config.value.control.type = 'pie'
      } else if (conmponent == 'AbLineEcharts') {
        config.value.control.type = 'line'
      } else if (conmponent == 'AbAreaEcharts') {
        config.value.control.type = 'area'
      } else if (conmponent == 'AbFunnelEcharts') {
        config.value.control.type = 'funnel'
      }
    }

    const types = ['bar', 'pie', 'line', 'area', 'funnel']
    const index = types.indexOf(config.value.control.type)
    if (index !== -1) {
      types.splice(index, 1, `${config.value.control.type}_check`)
    }
    info.echarsType = types
  }

  init()
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

  const getSupport = (arr: any, type: any) => {
    return arr.filter((s: any) => s.supports.includes(type.fieldType))
  }

  const colorJson = {
    // 系统默认
    xtmr: [
      '#509EE3',
      '#9CC177',
      '#A989C5',
      '#F9D45C',
      '#F1B556',
      '#A6E7F3',
      '#7172AD',
    ],
    // 绚丽多彩
    xldc: [
      '#578AF2',
      '#62E075',
      '#42B36F',
      '#FFD660',
      '#B3DE36',
      '#FA914E',
      '#F25252',
    ],
    // 蓝橙撞色
    lczs: [
      '#4D8CAE',
      '#AD5601',
      '#324498',
      '#2B5B75',
      '#0FA8E0',
      '#FF8500',
      '#006BC2',
    ],
    // 英伦酒红
    yljh: [
      '#DB5545',
      '#784029',
      '#E39970',
      '#E0D09F',
      '#A5A187',
      '#474844',
      '#984337',
    ],
    // 清新草绿
    qxcl: [
      '#8AC98B',
      '#A4DED9',
      '#67B9CD',
      '#D6D6D7',
      '#8D9E69',
      '#EB4B5C',
      '#B7D62E',
    ],
    // 神秘魅紫
    smmz: [
      '#C366A1',
      '#503491',
      '#DAA6D6',
      '#A999C9',
      '#D3C3DB',
      '#A563AC',
      '#7260AF',
    ],
    // 热情暖阳
    rqny: [
      '#FF9090',
      '#D53872',
      '#B91515',
      '#BBA588',
      '#FFD54F',
      '#FF9800',
      '#FBE8E1',
    ],
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

  const changeEcharsType = (type: string) => {
    const arr = ['bar', 'pie', 'line', 'area', 'funnel']
    if (!type.includes('check')) {
      if (arr.indexOf(type) >= 0) {
        arr[arr.indexOf(type)] = `${type}_check`
      }
      const typeStr = type.substring(type.lastIndexOf('_check') + 1)
      if (config.value.control.type != typeStr) {
        config.value.control.type = typeStr
        info.echarsType = arr
      }
    }
  }

  //清除关联
  const cleranRel = () => {
    config.value.control.relCode = ''
    config.value.control.relName = ''
    config.value.control.yzhou = []
    config.value.control.xzhou = ''
    clearConfig()
  }
  const cellStyle = () => {
    return {
      height: '40px',
      padding: '0',
    }
  }

  const changeSource = () => {
    config.value.control.formKey = ''
    cleranRel()
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

  const transStyle = (style: string) => {
    config.value.control.color = colorJson[style]
  }
  const clearConfig = () => {
    config.value.control.latitudeConfig = []
    config.value.control.indicatorConfig = []
    config.value.control.conditionConfig = []
    config.value.control.yzhou = []
    config.value.control.xzhou = undefined
  }
  const changeForm = (code: string) => {
    converArr()
    clearConfig()
  }

  const changeLatitude = (form: any) => {
    form.columnCode = form.key
    config.value.control.latitudeConfig = [form]
  }

  const changeIndicator = (item: any) => {
    item.forEach((s) => {
      if (!s.summaryType) {
        s.summaryType = s.fieldType == 'number' ? 'sum' : 'count'
      }
      if (!s.columnCode) {
        s.columnCode = s.key
      }
    })
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

  watch(
    () => props.config.key,
    () => init()
  )
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
