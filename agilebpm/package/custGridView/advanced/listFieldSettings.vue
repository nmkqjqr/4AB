<template>
  <div>
    <el-button
      class="mt-4"
      size="small"
      style="margin-bottom: 12px"
      type="primary"
      @click="onAddItem"
    >
      添加 +
    </el-button>
    <el-button
      v-if="
        (info.data.extendConf &&
          JSON.parse(info.data.extendConf).formCode &&
          JSON.parse(info.data.extendConf).formCode.length > 0) ||
        (info.data.relatedId && info.data.relatedId.length > 0)
      "
      class="mt-4"
      :loading="info.updateLoading"
      size="small"
      style="margin-bottom: 12px"
      type="primary"
      @click="fieldsListUpdate"
    >
      数据库字段更新
    </el-button>
    <el-button
      size="small"
      v-if="
       info.data.appConfMap.boCode &&
       info.data.appConfMap.boCode.length > 0
      "
      style="margin-bottom: 12px"
      type="primary"
      @click="addSubtable"
    >
      添加子表
    </el-button>
    <el-button
      size="small"
      style="margin-bottom: 12px"
      type="primary"
      @click="setHbackground"
    >
      行背景色设置
    </el-button>
    <el-table
      class="fieldListTable"
      :data="info.data.fieldsList"
      height="280"
      row-key="idkey"
      style="width: 100%; margin-bottom: 50px"
    >
      <el-table-column align="center" label="序号" type="index" width="60" />
      <el-table-column
        align="center"
        label="表名"
        min-width="160"
        prop="tableName"
      >
        <template #default="scope">
          <el-input v-model="scope.row.tableName" placeholder="" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="数据库字段名"
        min-width="140"
        prop="name"
      >
        <template #default="scope">
          <el-input v-model="scope.row.name" placeholder="" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="字段别名"
        min-width="140"
        prop="fieldName"
      >
        <template #default="scope">
          <el-input v-model="scope.row.fieldName" placeholder="" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="字段备注"
        min-width="140"
        prop="fieldDesc"
      >
        <template #default="scope">
          <el-input v-model="scope.row.fieldDesc" placeholder="" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="格式化类型"
        min-width="140"
        prop="formatType"
      >
        <template #default="scope">
          <el-select
            v-model="scope.row.formatType"
            clearable
            placeholder=""
            @change="changeFormatType($event, scope.row)"
          >
            <el-option
              v-for="(item, index) in info.formatTypeOption"
              :key="index"
              :disabled="
                scope.row.dataType !== 'decimal' &&
                scope.row.dataType !== 'number' &&
                scope.row.dataType !== 'int' &&
                item.type == 'percent'
              "
              :label="item.desc"
              :value="item.type"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="数据类型"
        min-width="100"
        prop="dataType"
      />
      <el-table-column
        align="center"
        label="格式化数据"
        min-width="150"
        prop="formatConf"
      >
        <template #default="scope">
          <el-popover
            v-if="scope.row.formatType === 'decimal'"
            placement="top"
            trigger="click"
            :width="260"
          >
            <template #reference>
              <el-button size="small">设置</el-button>
            </template>
            <div>
              <el-form label-width="100px" :model="scope.row.formatDefault">
                <el-form-item label="单位">
                  <el-input
                    v-model="scope.row.formatDefault.coinValue"
                    placeholder="例如：（￥）"
                  />
                </el-form-item>
                <el-form-item label="单位展示">
                  <el-radio-group
                    v-model="scope.row.formatDefault.showType"
                    size="small"
                  >
                    <el-radio-button label="前展示" />
                    <el-radio-button label="后展示" />
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否显示小数">
                  <el-switch v-model="scope.row.formatDefault.isDecimal" />
                </el-form-item>
                <el-form-item
                  v-if="scope.row.formatDefault.isDecimal"
                  label="保留小数位"
                >
                  <el-input
                    v-model="scope.row.formatDefault.decimalValue"
                    :min="0"
                    type="number"
                  />
                </el-form-item>
              </el-form>
            </div>
          </el-popover>
          <el-popover
            v-if="scope.row.formatType === 'json'"
            placement="top"
            :visible="scope.row.visible"
            :width="500"
            trigger="click"
          >
            <template #reference>
              <el-button size="small" @click="scope.row.visible = !scope.row.visible">设置</el-button>
            </template>
            <div>
              <el-button
                style="margin-bottom: 4px"
                text
                type="primary"
                @click="
                  scope.row.formatConfJsonList.push({
                    key: '',
                    value: '',
                    styleValue: '',
                  })
                "
              >
                添加+
              </el-button>
              <el-table
                :data="scope.row.formatConfJsonList"
                style="width: 100%"
              >
                <el-table-column label="数据库值" prop="value">
                  <template #default="scopeJson">
                    <el-input
                      v-model="scopeJson.row.value"
                      placeholder="数据库值"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="展示值" prop="key">
                  <template #default="scopeJson">
                    <el-input
                      v-model="scopeJson.row.key"
                      placeholder="展示值"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="对应样式" prop="styleValue">
                  <template #default="scopeJson">
                    <el-select
                      v-model="scopeJson.row.styleValue"
                      class="m-2 valueStyle"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option label="default" value="default">
                        <span style="float: left">default</span>
                        <div
                          style="
                            float: right;
                            width: 10px;
                            height: 10px;
                            margin-top: 13px;
                            background: #409eff;
                          "
                        ></div>
                      </el-option>
                      <el-option label="success" value="success">
                        <span style="float: left">success</span>
                        <div
                          style="
                            float: right;
                            width: 10px;
                            height: 10px;
                            margin-top: 13px;
                            background: #67c23a;
                          "
                        ></div>
                      </el-option>
                      <el-option label="info" value="info">
                        <span style="float: left">info</span>
                        <div
                          style="
                            float: right;
                            width: 10px;
                            height: 10px;
                            margin-top: 13px;
                            background: #909399;
                          "
                        ></div>
                      </el-option>
                      <el-option label="warning" value="warning">
                        <span style="float: left">warning</span>
                        <div
                          style="
                            float: right;
                            width: 10px;
                            height: 10px;
                            margin-top: 13px;
                            background: #e6a23c;
                          "
                        ></div>
                      </el-option>
                      <el-option label="danger" value="danger">
                        <span style="float: left">danger</span>
                        <div
                          style="
                            float: right;
                            width: 10px;
                            height: 10px;
                            margin-top: 13px;
                            background: #f56c6c;
                          "
                        ></div>
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                  <template #default="scopeJson">
                    <el-button
                      text
                      type="primary"
                      @click="
                        scope.row.formatConfJsonList.splice(scopeJson.$index, 1)
                      "
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="margin-top:12px;text-align:right;">
              <el-button size="small" type="primary" @click="scope.row.visible = !scope.row.visible">确定</el-button>
            </div>
          </el-popover>
          <el-tag
            v-if="
              scope.row.formatType === 'dic' &&
              scope.row.formatDefault.code &&
              scope.row.formatDefault.code.length > 0
            "
            closable
            style="margin-right: 12px"
            @close="closeQueryDict(scope.row)"
          >
            {{ scope.row.formatDefault.name }}
          </el-tag>
          <ab-cust-dialog
            v-if="scope.row.formatType === 'dic'"
            dialog-key="sjzdsjq"
            :dialog-setting="{ multiple: false }"
            size="small"
            style="display: inline-block"
            @ok="chooseDictQuery($event, scope.row)"
          >
            选 择
          </ab-cust-dialog>
          <el-tag
            v-if="
              scope.row.formatType == 'dialog' &&
              scope.row.formatConf.dialogName &&
              scope.row.formatConf.dialogName.length > 0
            "
          >
            {{ scope.row.formatConf.dialogName }}
          </el-tag>
          <ab-cust-dialog
            v-if="scope.row.formatType == 'dialog'"
            dialog-key="custDialog"
            :dialog-setting="{ multiple: false }"
            size="small"
            style="display: inline-block"
            @ok="chooseDialog($event, scope.row)"
          >
            选 择
          </ab-cust-dialog>
          <el-tag
            v-if="
              scope.row.formatType == 'cascadeSelect' &&
              scope.row.formatConf.dialogName &&
              scope.row.formatConf.dialogName.length > 0
            "
          >
            {{ scope.row.formatConf.dialogName }}
          </el-tag>
          <ab-cust-dialog
            v-if="scope.row.formatType == 'cascadeSelect'"
            dialog-key="custDialog"
            :dialog-setting="{ multiple: false }"
            size="small"
            style="display: inline-block"
            @ok="chooseCascadeSelect($event, scope.row)"
          >
            选 择
          </ab-cust-dialog>
          <el-select
            v-else-if="scope.row.formatType === 'date_picker'"
            v-model="scope.row.formatDefault.value"
            clearable
            default-first-option
            placeholder="请选择"
            size="small"
          >
            <el-option label="年(YYYY)" value="yyyy" />
            <el-option label="年月(YYYY-MM)" value="yyyy-MM" />
            <el-option label="年月日(YYYY-MM-DD)" value="yyyy-MM-dd" />
            <el-option
              label="年月日时分秒(YYYY-MM-DD HH:mm:ss)"
              value="yyyy-MM-dd HH:mm:ss"
            />
          </el-select>
          <el-input
            v-else-if="scope.row.formatType === 'javascript'"
            v-model="scope.row.formatConf"
            type="textarea"
          />
          <el-select
            v-else-if="scope.row.formatType === 'timestamp'"
            v-model="scope.row.formatConf.timeType"
            placeholder="请选择"
            size="small"
          >
            <el-option label="年(YYYY)" value="yyyy" />
            <el-option label="年月(YYYY-MM)" value="yyyy-MM" />
            <el-option label="年月日(YYYY-MM-DD)" value="YYYY-MM-DD" />
            <el-option
              label="年月日时分秒(YYYY-MM-DD HH:mm:ss)"
              value="YYYY-MM-DD HH:mm:ss"
            />
          </el-select>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="展示字段"
        min-width="130"
        prop="align"
      >
        <template #default="scope">
          <el-select
            v-if="scope.row.formatType == 'dialog' || scope.row.formatType == 'cascadeSelect'"
            v-model="scope.row.formatConf.labelField"
            clearable
            placeholder=""
            @change="changeLabelField($event, scope.row)"
          >
            <el-option
              v-for="(item, index) in scope.row.custDialogBackList"
              :key="index"
              :label="item.showName"
              :value="item.returnName"
            />
          </el-select>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="值字段"
        min-width="130"
        prop="align"
      >
        <template #default="scope">
          <el-select
            v-if="scope.row.formatType == 'dialog' || scope.row.formatType == 'cascadeSelect'"
            v-model="scope.row.formatConf.valueField"
            clearable
            placeholder=""
            @change="changeValueField($event, scope.row)"
          >
            <el-option
              v-for="(item, index) in scope.row.custDialogBackList"
              :key="index"
              :label="item.showName"
              :value="item.returnName"
            />
          </el-select>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="tag格式化"
        min-width="150"
        prop="cssConfList"
      >
        <template #default="scope">
          <el-popover
            v-if="
              scope.row.formatType !== 'json' &&
              scope.row.formatType !== 'javascript' &&
              scope.row.formatType !== 'percent'
            "
            placement="top"
            :visible="scope.row.visible"
            :width="400"
            trigger="click"
          >
            <template #reference>
              <el-button size="small" @click="scope.row.visible = !scope.row.visible">设置</el-button>
            </template>
            <div>
              <el-button
                style="margin-bottom: 1px"
                text
                type="primary"
                @click="
                  scope.row.cssConfList.push({
                    key: '',
                    value: '',
                  })
                "
              >
                添加+
              </el-button>
              <el-table :data="scope.row.cssConfList" style="width: 100%">
                <el-table-column label="对应值" prop="key">
                  <template #default="scopeJson">
                    <el-input
                      v-model="scopeJson.row.key"
                      placeholder="对应值"
                      size="small"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="对应样式" prop="value">
                  <template #default="scopeJson">
                    <el-select
                      v-model="scopeJson.row.value"
                      class="m-2 valueStyle"
                      clearable
                      placeholder="选择"
                      :popper-append-to-body="false"
                      size="small"
                    >
                      <el-option label="默认主题色" value="">
                        <span style="float: left">默认</span>
                        <div
                          style="
                            float: right;
                            width: 10px;
                            height: 10px;
                            margin-top: 13px;
                            background: #409eff;
                          "
                        ></div>
                      </el-option>
                      <el-option label="success" value="success">
                        <span style="float: left">success</span>
                        <div
                          style="
                            float: right;
                            width: 10px;
                            height: 10px;
                            margin-top: 13px;
                            background: #67c23a;
                          "
                        ></div>
                      </el-option>
                      <el-option label="info" value="info">
                        <span style="float: left">info</span>
                        <div
                          style="
                            float: right;
                            width: 10px;
                            height: 10px;
                            margin-top: 13px;
                            background: #909399;
                          "
                        ></div>
                      </el-option>
                      <el-option label="warning" value="warning">
                        <span style="float: left">warning</span>
                        <div
                          style="
                            float: right;
                            width: 10px;
                            height: 10px;
                            margin-top: 13px;
                            background: #e6a23c;
                          "
                        ></div>
                      </el-option>
                      <el-option label="danger" value="danger">
                        <span style="float: left">danger</span>
                        <div
                          style="
                            float: right;
                            width: 10px;
                            height: 10px;
                            margin-top: 13px;
                            background: #f56c6c;
                          "
                        ></div>
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                  <template #default="scopeJson">
                    <el-button
                      text
                      type="primary"
                      @click="scope.row.cssConfList.splice(scopeJson.$index, 1)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="margin-top:12px;text-align:right;">
              <el-button size="small" type="primary" @click="scope.row.visible = !scope.row.visible">确定</el-button>
            </div>
          </el-popover>
          <span v-if="scope.row.formatType == 'json'"></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="背景色设置"
        min-width="150"
        prop="align"
      >
        <template #default="scope">
          <el-button
            size="small"
            @click.prevent="setBackground(scope.row, scope.$index)"
          >
            设置
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="对齐方式"
        min-width="130"
        prop="align"
      >
        <template #default="scope">
          <el-select v-model="scope.row.align" clearable placeholder="">
            <el-option label="居中对齐" value="c" />
            <el-option label="左对齐" value="l" />
            <el-option label="右对齐" value="r" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="是否隐藏"
        min-width="100"
        prop="hidden"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.hidden"
            active-color="#13ce66"
            active-text="是"
            :active-value="1"
            inactive-text="否"
            :inactive-value="0"
            inline-prompt
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="可导出"
        min-width="100"
        prop="exportAble"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.exportAble"
            active-color="#13ce66"
            active-text="是"
            :active-value="1"
            :disabled="
              scope.row.dataType == 'longtext' ||
              scope.row.dataType == 'mediumtext' ||
              scope.row.dataType == 'tinytext' ||
              scope.row.dataType == 'text' ||
              scope.row.dataType == 'blob' ||
              scope.row.dataType == 'mediumblob' ||
              scope.row.dataType == 'longblob' ||
              scope.row.dataType == 'tinyblob' ||
              scope.row.dataType == 'BLOB' ||
              scope.row.dataType == 'nclob'
            "
            inactive-text="否"
            :inactive-value="0"
            inline-prompt
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="可排序"
        min-width="100"
        prop="sortAble"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.sortAble"
            active-color="#13ce66"
            active-text="是"
            :active-value="1"
            inactive-text="否"
            :inactive-value="0"
            inline-prompt
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="打开方式"
        min-width="140"
        prop="date"
      >
        <template #default="scope">
          <el-button
            size="small"
            text
            type="primary"
            @click.prevent="set(scope.row, scope.$index)"
          >
            设置
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="脱敏" min-width="100" prop="fuzz">
        <template #default="scope">
          <el-input v-model="scope.row.fuzz" placeholder="例如(1,2)" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="缩略图高度"
        min-width="100"
        prop="additionConf"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.additionConfMap.pictureHeight"
            :max="300"
            :min="0"
            placeholder="请输入"
            type="number"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="列宽"
        min-width="100"
        prop="additionConf"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.additionConfMap.listWidth"
            :max="300"
            :min="0"
            placeholder="请输入"
            type="number"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="最小列宽"
        min-width="100"
        prop="additionConf"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.additionConfMap.miniListWidth"
            :max="300"
            :min="0"
            placeholder="请输入"
            type="number"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="左侧固定"
        min-width="100"
        prop="additionConf"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.additionConfMap.isFix"
            active-color="#13ce66"
            active-text="是"
            :active-value="1"
            inactive-text="否"
            :inactive-value="0"
            inline-prompt
          />
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button
            circle
            class="field-move-btn"
            :icon="Sort"
            size="small"
            type="primary"
          />
          <el-button
            v-if="scope.row.fieldName !== info.data.pkName"
            circle
            :icon="Delete"
            size="small"
            type="danger"
            @click.prevent="deleteRow(scope.row,scope.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="info.upDateDialogVisible"
      title="选择需要添加的字段"
      width="500px"
    >
      <el-checkbox-group
        v-model="info.newAddFieldsList"
        size="small"
        style="margin-top: 4px"
      >
        <el-checkbox
          v-for="(item, index) in info.newAddOptions"
          :key="index"
          border
          class="checkBoxItem"
          :label="item"
        >
          {{ item.fieldDesc }}
        </el-checkbox>
      </el-checkbox-group>

      <template #footer>
        <span class="dialog-footer">
          <el-button
            text
            type="primary"
            @click="info.upDateDialogVisible = false"
          >
            取消
          </el-button>
          <el-button type="primary" @click="saveAddFieldsList">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="info.setDialogVisible"
      center
      title="打开/跳转设置"
      width="500px"
    >
      <el-form
        ref="ruleFormRef"
        label-position="right"
        label-width="100px"
        :model="info.data.fieldsList[info.index].hrefConfMap"
      >
        <el-form-item label="打开方式">
          <el-select
            v-model="info.data.fieldsList[info.index].hrefConfMap.openType"
            placeholder="请选择"
          >
            <el-option label="标签页/tab页" value="tab" />
            <el-option label="TOP对话框" value="topDialog" />
            <el-option label="新页面" value="newPage" />
            <el-option label="抽屉/弹框" value="drawer" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.fieldsList[info.index].hrefConfMap.openType === 'drawer'
          "
          label="方式"
          prop="component"
        >
          <el-select
            v-model="info.data.fieldsList[info.index].hrefConfMap.openDrawerOrDialog"
            clearable
            placeholder="请选择"
          >
            <el-option label="抽屉" value="drawerOpen" />
            <el-option label="弹框" value="dialogOpen" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.fieldsList[info.index].hrefConfMap.openType === 'drawer'
          "
          label="组件"
          prop="component"
        >
          <el-select
            v-model="info.data.fieldsList[info.index].hrefConfMap.component"
            clearable
            placeholder="请选择"
            @change="changeComponent($event, info.data.fieldsList[info.index])"
          >
            <el-option label="编辑" value="FormViewEdit" />
            <el-option label="详情" value="FormViewDetail" />
            <el-option label="组联式应用" value="FormViewCombination" />
            <el-option label="url地址" value="url" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.fieldsList[info.index].hrefConfMap.openType === 'drawer' &&
            (
              info.data.fieldsList[info.index].hrefConfMap.component == 'FormViewEdit' ||
              info.data.fieldsList[info.index].hrefConfMap.component == 'FormViewDetail')
          "
          label="表单"
          prop="component"
        >
            <template
              v-if="
                info.data.fieldsList[info.index].hrefConfMap.FormSeletorName &&
                info.data.fieldsList[info.index].hrefConfMap.FormSeletorName.length > 0
              "
            >
              <el-tag class="ml-2" style="margin-right: 5px" type="primary">
                {{ info.data.fieldsList[info.index].hrefConfMap.FormSeletorName }}
              </el-tag>
            </template>
            <ab-cust-dialog
              dialog-key="formSelector"
              :dialog-setting="{ multiple: 0 }"
              :icon="Search"
              :param="{
                type_: 'pc',
              }"
              size="small"
              @ok="chooseFormSeletor($event, info.data.fieldsList[info.index].hrefConfMap)"
            >
              请选择
            </ab-cust-dialog>
          </el-form-item>
        <el-form-item
          v-if="
            info.data.fieldsList[info.index].hrefConfMap.openType ===
              'drawer' &&
            info.data.fieldsList[info.index].hrefConfMap.component ==
              'FormViewCombination'
          "
          label="组联式应用"
        >
          <template
            v-if="
              info.data.fieldsList[info.index].hrefConfMap.combinationName &&
              info.data.fieldsList[info.index].hrefConfMap.combinationName
                .length > 0
            "
          >
            <el-tag class="ml-2" type="primary">
              {{ info.data.fieldsList[info.index].hrefConfMap.combinationName }}
            </el-tag>
          </template>
          <ab-cust-dialog
            dialog-key="groupformselection"
            :dialog-setting="{ multiple: 0 }"
            :icon="Search"
            size="small"
            style="margin-left: 5px"
            @ok="
              chooseCombination(
                $event,
                info.data.fieldsList[info.index].hrefConfMap
              )
            "
          >
            请选择
          </ab-cust-dialog>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.fieldsList[info.index].hrefConfMap.openType ===
              'drawer' &&
            info.data.fieldsList[info.index].hrefConfMap.component !== 'url'
          "
          label="参数"
          prop="params"
        >
          <el-button :icon="Plus" text type="primary" @click="info.data.fieldsList[info.index].hrefConfMap.paramsList.push({})">添加</el-button>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.fieldsList[info.index].hrefConfMap.openType ===
              'drawer' &&
            info.data.fieldsList[info.index].hrefConfMap.component !== 'url'
          "
          label=""
          prop="params"
        >
          <el-table
            border
            :data="info.data.fieldsList[info.index].hrefConfMap.paramsList"

          >
            <el-table-column label="主键入参" prop="name">
              <template #default="{ row }">
                <el-input v-model="row.name" placeholder="名称" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="字段" prop="paramsValue">
              <template #default="{ row }">
                <el-select
                  v-model="row.paramsValue"
                  allow-create
                  clearable
                  default-first-option
                  filterable
                  placeholder="手输固定值"
                  :reserve-keyword="false"
                  size="small"
                >
                  <el-option
                    v-for="item in info.data.fieldsList"
                    :key="item.fieldName"
                    :label="item.fieldName"
                    :value="item.fieldName"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="删除" width="70">
              <template #default="{ $index }">
                <el-button
                  :icon="Delete"
                  style="padding: 0; margin-left: 0"
                  text
                  type="primary"
                  @click="info.data.fieldsList[info.index].hrefConfMap.paramsList.splice($index, 1)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.fieldsList[info.index].hrefConfMap.openType ===
              'drawer' &&
            info.data.fieldsList[info.index].hrefConfMap.component == 'url'
          "
          label="url地址"
          prop="params"
        >
          <el-input
            v-model="info.data.fieldsList[info.index].hrefConfMap.url"
            placeholder="请输入"

          />
        </el-form-item>
        <el-form-item
          v-if="
            info.data.fieldsList[info.index].hrefConfMap.openType !==
              'drawer' &&
            info.data.fieldsList[info.index].hrefConfMap.openType &&
            info.data.fieldsList[info.index].hrefConfMap.openType.length > 0
          "
          label="url地址"
        >
          <el-input
            v-model="info.data.fieldsList[info.index].hrefConfMap.url"
            placeholder="url地址"

          />
        </el-form-item>
        <el-form-item
          v-if="
            info.data.fieldsList[info.index].hrefConfMap.openType ===
              'dialog' ||
            info.data.fieldsList[info.index].hrefConfMap.openType ===
              'topDialog'
          "
          label="宽"
          prop="width"
        >
          <el-input
            v-model="info.data.fieldsList[info.index].hrefConfMap.width"
            :max="
              info.data.fieldsList[info.index].hrefConfMap.widthUnit == '%'
                ? 100
                : ''
            "
            :min="
              info.data.fieldsList[info.index].hrefConfMap.widthUnit == '%'
                ? 0
                : ''
            "
            style="width: 100px"
            type="number"
          />
          <el-select
            v-model="info.data.fieldsList[info.index].hrefConfMap.widthUnit"
            placeholder="请选择"
            style="width: 100px"
          >
            <el-option label="%" value="%" />
            <el-option label="px" value="px" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.fieldsList[info.index].hrefConfMap.openType ===
              'dialog' ||
            info.data.fieldsList[info.index].hrefConfMap.openType ===
              'topDialog'
          "
          label="高"
          prop="height"
        >
          <el-input
            v-model="info.data.fieldsList[info.index].hrefConfMap.height"
            :max="
              info.data.fieldsList[info.index].hrefConfMap.heightUnit == '%'
                ? 100
                : ''
            "
            :min="
              info.data.fieldsList[info.index].hrefConfMap.heightUnit == '%'
                ? 0
                : ''
            "
            style="width: 100px"
            type="number"
          />
          <el-select
            v-model="info.data.fieldsList[info.index].hrefConfMap.heightUnit"
            placeholder="请选择"
            style="width: 100px"
          >
            <el-option label="%" value="%" />
            <el-option label="px" value="px" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button text type="primary" @click="info.setDialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="info.backgroundDialogVisible"
      title="背景色配置"
      width="800px"
    >
      <el-button
        :icon="Plus"
        style="margin-bottom: 10px"
        type="primary"
        @click="addBackground()"
      >
        增加
      </el-button>
      <el-table
        v-if="info.backgroundDialogVisible"
        border
        :data="info.backgroundList"
      >
        <el-table-column label="当前值" min-wdith="110px">
          <template #default="scope">
            <span>字段值</span>
          </template>
        </el-table-column>
        <el-table-column label="条件" min-wdith="100px">
          <template #default="scope">
            <el-select v-model="scope.row.condition">
              <el-option
                v-for="item in info.conditionOption"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="比较值" :width="240">
          <template #default="scope">
            <el-input
              v-if="
                scope.row.condition !== 'between' &&
                scope.row.condition !== 'not between'
              "
              v-model="scope.row.value"
              placeholder="请输入值"
            />
            <div
              v-if="
                scope.row.condition == 'between' ||
                scope.row.condition == 'not between'
              "
            >
              <el-input-number
                v-model="scope.row.minNumber"
                class="numberInput"
                controls-position="right"
              />
              <span style="margin: 0 4px">-</span>
              <el-input-number
                v-model="scope.row.maxNumber"
                class="numberInput"
                controls-position="right"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="背景色">
          <template #default="scope">
            <el-color-picker
              v-model="scope.row.backgroundColor"
              popper-class="colorDiaStyle"
              :predefine="predefineColors"
            />
          </template>
        </el-table-column>
        <el-table-column label="字体颜色">
          <template #default="scope">
            <el-color-picker
              v-model="scope.row.textColor"
              popper-class="colorDiaStyle"
              :predefine="predefineColors"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="80">
          <template #default="scope">
            <el-button
              circle
              :icon="Delete"
              type="danger"
              @click="abUtil.Arrays.del(scope.$index, info.backgroundList)"
            />
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            text
            type="primary"
            @click="info.backgroundDialogVisible = false"
          >
            取消
          </el-button>
          <el-button type="primary" @click="saveBackgroundList">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="info.hbackgroundDialogVisible"
      title="背景色配置"
      width="800px"
    >
      <el-button
        :icon="Plus"
        style="margin-bottom: 10px"
        type="primary"
        @click="addhBackground()"
      >
        增加
      </el-button>
      <el-table
        v-if="info.hbackgroundDialogVisible"
        border
        :data="info.hbackgroundList"
        :span-method="objectSpanMethod"
      >
        <el-table-column label="字段值" min-width="110px">
          <template #default="scope">
            <el-select v-model="scope.row.fieldsValue">
              <el-option
                v-for="item in info.data.fieldsList"
                :key="item.fieldName"
                :label="item.fieldDesc"
                :value="item.fieldName"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="条件" min-width="100px">
          <template #default="scope">
            <el-select v-model="scope.row.condition">
              <el-option
                v-for="item in info.conditionOption"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="比较值" :width="240">
          <template #default="scope">
            <el-input
              v-if="
                scope.row.condition !== 'between' &&
                scope.row.condition !== 'not between'
              "
              v-model="scope.row.value"
              placeholder="请输入值"
            />
            <div
              v-if="
                scope.row.condition == 'between' ||
                scope.row.condition == 'not between'
              "
            >
              <el-input-number
                v-model="scope.row.minNumber"
                class="numberInput"
                controls-position="right"
              />
              <span style="margin: 0 4px">-</span>
              <el-input-number
                v-model="scope.row.maxNumber"
                class="numberInput"
                controls-position="right"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="背景色">
          <template #default="scope">
            <el-color-picker
              v-model="scope.row.backgroundColor"
              popper-class="colorDiaStyle"
              :predefine="predefineColors"
            />
          </template>
        </el-table-column>
        <el-table-column label="字体颜色">
          <template #default="scope">
            <el-color-picker
              v-model="scope.row.textColor"
              popper-class="colorDiaStyle"
              :predefine="predefineColors"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template #default="scope">
            <el-button
              v-if="scope.row.parent"
              circle
              :icon="Plus"
              type="primary"
              @click="addhBackgroundItem(scope.row, scope.$index)"
            />
            <el-button
              circle
              :icon="Delete"
              type="danger"
              @click="abUtil.Arrays.del(scope.$index, info.hbackgroundList)"
            />
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            text
            type="primary"
            @click="info.hbackgroundDialogVisible = false"
          >
            取消
          </el-button>
          <el-button type="primary" @click="savehBackgroundList">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加子表 -->
    <subtableTree
      v-model="info.subtableTreeVisible"
      :boCode="info.data.appConfMap.boCode"
      :code="info.data.code"
      :dataObj="info.data"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import dayjs from 'dayjs'
  import type { FormInstance, FormRules, Action } from 'element-plus'
  import { sysApi, postData, bizApi, getData } from '~/agilebpm/api'
  import { Sort, Delete, Plus } from '@element-plus/icons-vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import subtableTree from '../components/subtableTree.vue'
  import Sortable from 'sortablejs'
  const { proxy } = abTools.useCurrentInstance()
  const emit = defineEmits(['update:modelValue', 'fieldsListInit'])
  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
    // eslint-disable-next-line vue/require-default-prop
  })
  const ruleFormRef = ref<FormInstance>()
  const info: any = reactive({
    setDialogVisible: false,
    jsonDialogVisible: false,
    index: 0,
    data: useVModel(props, 'modelValue', emit),
    formatTypeOption: [],
    updateLoading: false,
    custDialogBackList: [],
    upDateDialogVisible: false,
    newAddFieldsList: [],
    newAddOptions: [],
    backgroundDialogVisible: false,
    backgroundList: [],
    conditionOption: [
      {
        name: '等于',
        value: '==',
      },
      {
        name: '不等于',
        value: '!==',
      },
      {
        name: '小于',
        value: '<',
      },
      {
        name: '大于',
        value: '>',
      },
      {
        name: '在...之间',
        value: 'between',
      },
      {
        name: '不在...之间',
        value: 'not between',
      },
      {
        name: '为空',
        value: 'null',
      },
      {
        name: '不为空',
        value: 'not null',
      },
      {
        name: '包含',
        value: 'contains',
      },
      {
        name: '不包含',
        value: 'not contains',
      },
      {
        name: '在...中',
        value: 'in',
      },
      {
        name: '不在...中',
        value: 'not in',
      },
    ],
    hbackgroundDialogVisible: false,
    hbackgroundList: [],
    subtableTreeVisible:false
  })

  const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
  ])

  watch(
    () => [props.modelValue],
    (now, old) => {
      info.data = now[0]
    }
  )

  watch(
    () => info.backgroundDialogVisible,
    (now, old) => {
      if (!now) {
        info.backgroundList = []
      }
    },
    { deep: true }
  )

  const setBackground = (row: any, index: number) => {
    info.index = index
    info.backgroundDialogVisible = true
    if (
      row.bgColorConfMap.backgroundList &&
      row.bgColorConfMap.backgroundList.length > 0
    ) {
      info.backgroundList = JSON.parse(
        JSON.stringify(row.bgColorConfMap.backgroundList)
      )
    } else {
      info.backgroundList = []
    }
  }

  const addBackground = () => {
    info.backgroundList.push({
      value: '',
      minNumber: 0,
      maxNumber: 0,
      condition: '',
      backgroundColor: '#ffffff',
      textColor: '#606266',
    })
  }

  const saveBackgroundList = () => {
    if (info.backgroundList.length > 0) {
      info.data.fieldsList[info.index].bgColorConfMap.backgroundList =
        info.backgroundList
    } else {
      info.data.fieldsList[info.index].bgColorConfMap.backgroundList = []
    }
    info.backgroundDialogVisible = false
  }

  const setHbackground = () => {
    info.hbackgroundDialogVisible = true
    if (
      JSON.parse(info.data.extendConf).hbackgroundList &&
      JSON.parse(info.data.extendConf).hbackgroundList.length > 0
    ) {
      info.hbackgroundList = JSON.parse(info.data.extendConf).hbackgroundList
    } else {
      info.hbackgroundList = []
    }
  }

  const addhBackground = () => {
    info.hbackgroundList.push({
      fieldsValue: '',
      value: '',
      minNumber: 0,
      maxNumber: 0,
      condition: '',
      backgroundColor: '#ffffff',
      textColor: '#606266',
      parent: true,
    })
  }
  const addhBackgroundItem = (item: any, index: any) => {
    info.hbackgroundList.splice(index + 1, 0, {
      fieldsValue: item.fieldsValue,
      value: '',
      minNumber: 0,
      maxNumber: 0,
      condition: '',
      backgroundColor: '#ffffff',
      textColor: '#606266',
      parent: false,
    })
  }

  // 获取相同名称的个数 tableData: 表格的数据, projectName: 确定相同的参数
  const flitterData = (arr: any) => {
    const spanOneArr = []
    let concatOne = 0
    arr.forEach((item: any, index: any) => {
      if (index === 0) {
        spanOneArr.push(1)
      } else {
        //name 修改
        if (item.fieldsValue === arr[index - 1].fieldsValue) {
          //第一列需合并相同内容的判断条件
          spanOneArr[concatOne] += 1
          spanOneArr.push(0)
        } else {
          spanOneArr.push(1)
          concatOne = index
        }
      }
    })
    return {
      one: spanOneArr,
    }
  }

  const objectSpanMethod = ({
    row,
    column,
    rowIndex,
    columnIndex,
  }: SpanMethodProps) => {
    if (columnIndex === 0) {
      // this.tableData  修改
      const _row = flitterData(info.hbackgroundList).one[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col,
      }
    }
  }

  const savehBackgroundList = () => {
    let extendConf = {} as any
    if (info.data.extendConf) {
      extendConf = JSON.parse(info.data.extendConf)
    }
    if (info.hbackgroundList.length > 0) {
      extendConf.hbackgroundList = info.hbackgroundList
    } else {
      extendConf.hbackgroundList = []
    }
    info.data.extendConf = JSON.stringify(extendConf)
    info.hbackgroundDialogVisible = false
  }

  // 请求对话框详情数据
  const getDialogData = (dialogKey: any, row: any, column: any) => {
    getData(bizApi.customDialog.getByCode + dialogKey, {}).then(
      (result: any) => {
        const fileds = [] as any[]
        row.custDialogBackList = []
        //如果数据源是接口的话取返回值和条件字段的交集
        if (result.data.dataSource === 'interface') {
          if (
            result.data.conditionFields?.length === 0 ||
            result.data.returnFields?.length === 0
          ) {
            return
          }
          result.data.returnFields.forEach((rf: any) => {
            const filed = result.data.conditionFields.find((cf: any) => {
              return rf.columnName === cf.columnName
            })
            if (filed) {
              fileds.push(rf)
            }
          })
          if (fileds.length === 0) {
            return
          }
        } else {
          fileds.push(...result.data.returnFields)
        }
        //处理返回字段和显示字段
        if (result.data.displayFields) {
          fileds.forEach((rf: any) => {
            const item = result.data.displayFields.find((df: any) => {
              return df.columnName === rf.columnName
            })
            rf.showName = rf.returnName
            if (item) {
              rf.showName = `${item.showName}(${rf.returnName})`
            }
          })
        }
        fileds.forEach((item: any) => {
          row.custDialogBackList.push({
            returnName: item.returnName,
            showName: item.showName,
            columnName: item.columnName,
          })
        })
        if (column) {
          if (row.custDialogBackList.length > 0) {
            if(column.type == 'cascadeSelect' || column.type == 'region'){
              row.formatConf.labelField = column.labelField
              row.formatConf.valueField = column.valueField
            }else{
              row.formatConf.labelField = column.dataSelectorConfig.labelField
              row.formatConf.valueField = column.dataSelectorConfig.valueField
              row.formatConf.labelColumn = column.dataSelectorConfig.labelColumn
              row.formatConf.param = column.dataSelectorConfig.param
            }

          }
        }
      },
      () => {}
    )
  }
  const generateRandom = () => {
    return Math.random().toString(16).slice(2)
  }

  const findExtraItemsByProperty = (arr1: any, arr2: any, property: any) => {
    return arr1.filter(
      (item1: any) =>
        !arr2.some((item2: any) => item2[property] === item1[property])
    )
  }

  const findDelfield = (arr1: any, arr2: any, property: any) => {
    return arr2.filter(
      (item1: any) =>
        !arr1.some((item2: any) => item2[property] === item1[property])
    )
  }

  // 删除长数组中的某一项
  const removeElementsByProperty = (longArray:any, shortArray:any, property:any) => {
    // 从短数组中提取特定属性的值，并存储在一个Set中
    const shortPropertyValues = new Set(shortArray.map(item => item[property]));
    // 从长数组中删除那些在短数组属性值集合中的元素
    for (let i = longArray.length - 1; i >= 0; i--) {
      if (shortPropertyValues.has(longArray[i][property])) {
        longArray.splice(i, 1);
      }
    }
    return longArray
  }

  const fieldsListUpdate = () => {
    const aList = info.data.fieldsList
    info.newAddFieldsList = []
    if (info.data.sqlContent.length <= 0) {
      ElMessage({
        message: '请输入sql',
        type: 'warning',
      })
      return false
    }
    info.updateLoading = true
    postData(bizApi.custGrid.tableJoinUrl, {
      boCode: info.data.appConfMap.boCode,
      code: proxy.$route.query.code ?  info.data.code : '',
      tableInfoList:info.data.extendConf && JSON.parse(info.data.extendConf).subTableCheckList ? JSON.parse(info.data.extendConf).subTableCheckList : []
    }).then((resp) => {
      if(resp.isOk && resp.data && resp.data.length > 0){
        postData(bizApi.custGrid.parseSqlUrl, {
          dsKey: info.data.dsKey,
          sqlContent: resp.data || info.data.sqlContent,
        })
          .then(async (result) => {
            info.updateLoading = false

            let list
            const res = []
            if (result.data) {
              list = result.data
            }

           // 删除数据库已删除字段
            let moreList = []
            moreList = findDelfield(list, aList, 'fieldName')
            if(moreList && moreList.length > 0){
              info.data.fieldsList = removeElementsByProperty(aList,moreList,'fieldName')
              // 同时删除查询条件里面的数据库已删除的字段
              info.data.sqlConditionVOS = removeElementsByProperty(info.data.sqlConditionVOS,moreList,'fieldName')
              let str = ''
              moreList.forEach((item:any) => {
                str += item.fieldName + ','
              })
              str = str.substring(0, str.length - 1)
              ElMessageBox.alert('已同步删除数据库字段' + str, '提示', {
                // if you want to disable its autofocus
                // autofocus: false,
                confirmButtonText: 'OK',
                callback: (action: Action) => {

                },
              })
            }
            info.newAddOptions = findExtraItemsByProperty(list, aList, 'fieldName')
            if (info.newAddOptions.length > 0) {
              info.upDateDialogVisible = true
              info.newAddOptions.forEach((item: any) => {
                if (!item.bgColorConfMap) {
                  item.bgColorConfMap = {}
                }
              })
              const resultDesign = await bizApi.bizForm.getDesignCode(
                info.data.gridType === 'app'
                  ? JSON.parse(info.data.extendConf).formCode
                  : JSON.parse(info.data.extendConf).code || info.data.relatedId
              )
              if (resultDesign.data.pcJson && resultDesign.data.pcJson.column) {
                info.data.columnData = resultDesign.data.pcJson.column
              }
              if (resultDesign.data.mbJson && resultDesign.data.mbJson.column) {
                info.data.columnData = resultDesign.data.mbJson.column
              }
              emit('fieldsListInit', info.newAddOptions)
            } else {
              ElMessage({
                message: '没有要添加的字段',
                type: 'warning',
              })
            }
          })
          .catch(() => {
            info.updateLoading = false
          })
      }
    })

  }

  const saveAddFieldsList = async () => {
    info.upDateDialogVisible = false
    info.data.fieldsList = [...info.data.fieldsList, ...info.newAddFieldsList]
    ElMessage({
      message: '更新成功',
      type: 'success',
    })
  }

  const set = (row: any, index: number) => {
    info.index = index
    info.setDialogVisible = true
  }

  const saveJSON = () => {}
  // do not use same name with ref
  // 格式化类型
  sysApi.tools
    .getEnum('com.dstz.biz.chart.enums.FieldsConstantsEnum', true)
    .then(({ data }) => {
      info.formatTypeOption = data
    })

    const deleteRow = (row:any,index: number) => {
    info.data.fieldsList.splice(index, 1)
    // 把已选中的子表字段保存到扩展字段里面 方便回显
    if(typeof info.data.extendConf == 'string'){
      info.data.extendConf = JSON.parse(info.data.extendConf)
      let number = null
      if(info.data.extendConf.subTableCheckList && info.data.extendConf.subTableCheckList.length > 0){
        info.data.extendConf.subTableCheckList.forEach((item:any,itemIndex:any) => {
          if(row.name == item.name){
            number = itemIndex
          }
        })
        if(number !== null){
          info.data.extendConf.subTableCheckList.splice(number, 1)
        }
      }
      info.data.extendConf = JSON.stringify(info.data.extendConf)
    }
  }

  // 拖拽排序
  // 行拖拽
  const rowDrop = () => {
    setTimeout(() => {
      const table = document.querySelector(
        '.fieldListTable .el-table__body-wrapper tbody'
      )
      Sortable.create(table, {
        animation: 300,
        handle: '.field-move-btn',
        onEnd: (evt: any) => {
          const arr = JSON.parse(JSON.stringify(info.data.fieldsList))
          let t
          if (
            evt.oldIndex > evt.newIndex &&
            table.children.length > arr.length
          ) {
            t = arr.splice(evt.oldIndex - 1, 1)[0]
          } else {
            t = arr.splice(evt.oldIndex, 1)[0]
          }
          arr.splice(evt.newIndex, 0, t)
          arr.forEach((item: any, index: any) => {
            item.sn = index + 1
          })
          info.data.fieldsList = arr
        },
      })
    })
  }
  rowDrop()

  // 需要校验
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        info.setDialogVisible = false
      } else {
        console.log('error submit!', fields)
      }
    })
  }
  const changeFormatType = (value: any, item: any) => {
    item.additionConfMap.miniListWidth = 0
    item.additionConfMap.pictureHeight = 0
    if (!value || value.length <= 0) {
      item.formatConf = ''
    }
    if (item.formatType && item.formatType === 'json') {
      if (!item.formatConfJsonList) {
        item.formatConfJsonList = []
      }
      if (item.formatConf && item.formatConf.length > 0) {
        item.formatConfJsonList = JSON.parse(item.formatConf)
      }
    }
    if (value == 'decimal') {
      item.formatConf = {}
      item.formatDefault = {
        showType: '前展示',
      }
    }
    if (value == 'date_picker') {
      item.formatDefault = {}
      item.formatDefault.value = 'yyyy-MM-dd'
    }
    if (value == 'dic') {
      item.formatDefault = {}
    }
    if (value == 'javascript') {
      item.formatConf = ''
    }
    if (value == 'dialog' || value == 'cascadeSelect') {
      item.formatConf = {
        dialogType: 'dataSelector',
        dialogKey: 'custDialog',
        dialogName: '',
        labelField: '',
        valueField: '',
        labelColumn: '',
        param: '',
      }
      item.custDialogBackList = []
    }
    if (value == 'timestamp') {
      item.formatConf = {
        timeType:'YYYY-MM-DD'
      }
    }
    if (value == 'percent') {
      item.additionConfMap.miniListWidth = 120
    }
    if (value == 'picture') {
      item.additionConfMap.pictureHeight = 60
    }
  }

  // 选择查询对话框OK事件
  const chooseDictQuery = (list: any, row: any) => {
    row.formatDefault.code = list[0].code
    row.formatDefault.name = list[0].name
    row.formatDefault.dictList = []
    // sysApi.dict.getDictTreeByCodeNoRoot(row.formatConf.code).then((data) => {
    //   row.formatConf.dictList = data
    // })
  }

  // 删除
  const closeQueryDict = (row: any) => {
    row.formatDefault = {}
  }

  const chooseDialog = (list: any, row: any) => {
    row.formatConf.dialogKey = list[0].code
    row.formatConf.dialogName = list[0].name
    row.formatConf.labelField = ''
    row.formatConf.valueField = ''
    row.formatConf.labelColumn = ''
    row.formatConf.param = ''
    getDialogData(row.formatConf.dialogKey, row, false)
  }

  const chooseCascadeSelect = (list: any, row: any) => {
    row.formatConf.dialogKey = list[0].code
    row.formatConf.dialogName = list[0].name
    row.formatConf.labelField = ''
    row.formatConf.valueField = ''
    row.formatConf.labelColumn = ''
    row.formatConf.param = ''
    getDialogData(row.formatConf.dialogKey, row, false)
  }

  const changeLabelField = (value: any, row: any) => {
    row.formatConf.labelColumn = row.custDialogBackList.find(
      (item: any) => item.returnName == value
    ).columnName
  }
  const changeValueField = (value: any, row: any) => {
    row.formatConf.param = row.custDialogBackList.find(
      (item: any) => item.returnName == value
    ).columnName
  }
  const onAddItem = () => {
    info.data.fieldsList.unshift({
      tableName: '',
      name: '',
      fieldName: '',
      fieldDesc: '',
      formatType: '',
      dataType: 'varchar',
      formatDefault: {},
      cssConfList: [],
      align: 'c',
      hidden: 0,
      exportAble: 1,
      sortAble: 0,
      hrefConfMap: {},
      fuzz: '',
      sn: info.data.fieldsList.length + 1,
      additionConfMap: {
        isFix: 0,
      },
      idkey: generateRandom(),
    })
  }

  if (info.data.fieldsList && info.data.fieldsList.length > 0) {
    info.data.fieldsList.forEach((item: any) => {
      item.idkey = generateRandom()
    })
  }

  const changeComponent = (val: any, row: any) => {
    const extendConf = JSON.parse(info.data.extendConf)
    if (
      val == 'FormViewDetail' ||
      val == 'FormViewEdit'
    ) {
      if (extendConf.related) {
        row.hrefConfMap.FormSeletorName = extendConf.related.name
        row.hrefConfMap.FormSeletorCode = extendConf.related.code
      }
    }
     if (val == 'FormViewDetail') {
      row.hrefConfMap.paramsList = [{name:'id',paramsValue:info.data.pkName},{name:'saveClose',paramsValue:"1"},{name:'isReadOnly',paramsValue:"1"}]
    } else if (val == 'FormViewEdit') {
      row.hrefConfMap.paramsList = [{name:'id',paramsValue:info.data.pkName},{name:'saveClose',paramsValue:"1"}]
    } else {
      row.hrefConfMap.combinationName = ''
      row.hrefConfMap.combinationCode = ''
      row.hrefConfMap.url = ''
      row.hrefConfMap.paramsList = []
    }
  }

  const chooseCombination = (list: any, item: any) => {
    item.combinationName = list[0].name
    item.combinationCode = list[0].code
  }

  const chooseFormSeletor = (list: any, item: any) => {
    item.FormSeletorName = list[0].name
    item.FormSeletorCode = list[0].code
  }

  const addSubtable = () => {
    info.subtableTreeVisible = true
  }
</script>
<style lang="scss">
  .jxSql {
    margin-top: 12px;
    text-align: center;
  }
  .field-move-btn {
    cursor: move;
  }
  .jsondialogStyle {
    .el-dialog__body {
      padding: 12px;
    }
  }
  .numberInput {
    width: 100px !important;
    .el-input__wrapper {
      padding-right: 32px !important;
      padding-left: 0 !important;
    }
  }
</style>
