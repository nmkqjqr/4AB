<template>
  <div class="common-layout" :class="{'app-design':props.isAppDesign ? true : false}">
    <el-container>
      <!-- 是否开启左侧树 showTree：1 -->
      <el-aside
        v-if="
          info.data.leftTreeMap.showTree &&
          info.data.leftTreeMap.showTree == '1'
        "
        class="left-tree"
        style="margin-right: 10px; border: 1px solid #e4e7ed"
        width="210px"
      >
        <!-- 数据字典类型或自定义列表类型 dataFrom ：2 dataFrom ：4 -->
        <ab-tree
          v-if="
            info.data.leftTreeMap &&
            (info.data.leftTreeMap.dataFrom == '2' ||
              info.data.leftTreeMap.dataFrom == '4')
          "
          :left-tree-map="info.data.leftTreeMap"
          margin-style="10px"
          :tree-data="info.treeData"
          :tree-height="info.rightHeight"
          @node-click="nodeClickFn"
          :is-from-cust="true"
        />
        <!-- 自定义对话框类型 dataFrom ： 1 -->
        <!-- 树型对话框 -->
        <div
          v-if="
            info.data.leftTreeMap &&
            info.data.leftTreeMap.dataFrom == '1' &&
            info.leftTreeDialog
          "
          style="padding: 10px; overflow: auto"
          :style="{ height: info.rightHeight }"
        >
          <ab-cust-dialog-tree
            v-if="info.openPanel"
            ref="treeDialog"
            :dialog="info.leftTreeDialog"
            :dialog-setting="{
              height: info.innerHeight,
              rootName: info.data.leftTreeMap.rootName,
            }"
            :init-data="[]"
            :param="info.leftTreeDialogParam"
            @node-click="nodeClickFn"
          />
        </div>
      </el-aside>

      <el-main :style="{marginRight:props.isAppDesign ? '': '10px'}">
        <el-card
          class="cardBodyStyle formLableStyleQuery"
          :class="{ modulesactive: info.querySettings }"
          shadow="hover"
          style="cursor: pointer"
          @click="moduleclick('querySettings')"
        >
          <div v-if="info.querySettings" class="customize-overlay">
            <label>搜索查询设置</label>
          </div>
          <el-form
            ref="queryForm"
            class="demo-form-inline"
            :inline="true"
            label-width="100px"
          >
            <template v-if="info.queryList && info.queryList.length > 0">
              <template
                v-for="item in info.queryList.filter(
                  (itemSql) => itemSql.showType !== '2'
                )"
                :key="item.fieldDesc"
              >
                <!-- showType: 是否显示 1显示 3禁用 -->
                <el-form-item
                  v-if="item.showType === '1' || item.showType === '3'"
                  :label="item.fieldDesc"
                  :prop="item.fieldName"
                  :style="{
                    width:
                      item.extendConf.width && item.extendConf.width == '100%'
                        ? '100%'
                        : '',
                  }"
                >
                  <!-- decimal 输入框 -->
                  <el-input
                    v-if="
                      (item.controlType === 'decimal' &&
                        item.cntype == '>=,<=' &&
                        item.dataType !== 'decimal') ||
                      (item.controlType === 'decimal' &&
                        item.cntype !== '>=,<=' &&
                        item.dataType == 'decimal') ||
                      (item.controlType === 'decimal' &&
                        item.cntype !== '>=,<=' &&
                        item.dataType !== 'decimal')
                    "
                    v-model.trim="item['val']"
                    :disabled="item.showType === '3'"
                    :placeholder="
                      item.extendConf.queryPlaceHolder.length > 0
                        ? item.extendConf.queryPlaceHolder
                        : '请输入' + item.fieldDesc
                    "
                    style="width: 200px"
                  />
                  <!-- 数字范围 -->
                  <template
                    v-if="
                      item.controlType === 'decimal' &&
                      item.dataType === 'decimal' &&
                      item.cntype == '>=,<='
                    "
                  >
                    <el-input-number
                      v-model.trim="item['numbewValStart']"
                      class="numberInput"
                      controls-position="right"
                      :disabled="item.showType === '3'"
                      :min="0"
                    />
                    <span style="margin: 0 10px">-</span>
                    <el-input-number
                      v-model.trim="item['numbewValEnd']"
                      class="numberInput"
                      controls-position="right"
                      :disabled="item.showType === '3'"
                      :min="0"
                    />
                  </template>
                  <!-- date_picker 日期选择框 -->
                  <el-date-picker
                    v-if="
                      item.controlType === 'date_picker' &&
                      item.cntype !== '>=,<='
                    "
                    v-model="item['val']"
                    :disabled="item.showType === '3'"
                    :placeholder="
                      item.extendConf.queryPlaceHolder.length > 0
                        ? item.extendConf.queryPlaceHolder
                        : '请输入' + item.fieldDesc
                    "
                    style="width: 200px"
                    :type="
                      item.formatConf == 'YYYY-MM-DD'
                        ? 'date'
                        : item.formatConf == 'YYYY-MM-DD HH:mm:ss'
                        ? 'datetime'
                        : item.formatConf == 'yyyy-MM'
                        ? 'month'
                        : item.formatConf == 'yyyy'
                        ? 'year'
                        : 'date'
                    "
                    :value-format="
                      item.formatConf &&
                      item.formatConf.length > 0 &&
                      item.formatConf == 'yyyy'
                        ? 'YYYY'
                        : item.formatConf == 'yyyy-MM'
                        ? 'YYYY-MM'
                        : item.formatConf
                    "
                  />
                  <!-- date_picker 日期范围选择器 -->
                  <el-date-picker
                    v-if="
                      item.controlType === 'date_picker' &&
                      item.cntype == '>=,<='
                    "
                    v-model="item['val']"
                    :disabled="item.showType === '3'"
                    end-placeholder="结束时间"
                    start-placeholder="开始时间"
                    style="width: 200px"
                    :type="
                      item.formatConf == 'YYYY-MM-DD'
                        ? 'daterange'
                        : item.formatConf == 'YYYY-MM-DD HH:mm:ss'
                        ? 'datetimerange'
                        : 'daterange'
                    "
                    :value-format="
                      item.formatConf && item.formatConf.length > 0
                        ? item.formatConf
                        : 'YYYY-MM-DD'
                    "
                  />
                  <!-- dic 数据字典 -->
                  <template v-if="item.controlType === 'dic'">
                    <ab-select-tree
                      v-if="!item.extendConf.tagShow"
                      v-model="item['val']"
                      clearable
                      :disabled="item.showType === '3'"
                      :operation="false"
                      style="width: 200px"
                      :type-code="
                        item.formatDefault && item.formatDefault.code
                          ? item.formatDefault.code
                          : ''
                      "
                    />
                    <template v-if="item.extendConf.tagShow && item.formatDefault && item.formatDefault.dicList">
                      <span v-for="(radioTag, radioIndex) in item.formatDefault
                          .dicList"
                          :key="radioIndex">
                          <el-check-tag
                            v-if="!radioTag.disable"
                            :checked="radioTag.checked"
                            class="tagStyle"
                            @change="
                              clickItemTag(
                                $event,
                                radioTag,
                                item,
                                item.formatDefault.dicList,
                                radioTag.code
                              )
                            "
                          >
                           {{ radioTag.name }}
                          </el-check-tag>
                      </span>
                    </template>
                  </template>
                  <!-- JSON -->
                  <el-select
                    v-if="
                      item.controlType === 'json' && !item.extendConf.tagShow
                    "
                    v-model="item['val']"
                    clearable
                    :disabled="item.showType === '3'"
                    :placeholder="
                      item.extendConf.queryPlaceHolder.length > 0
                        ? item.extendConf.queryPlaceHolder
                        : '请输入' + item.fieldDesc
                    "
                    style="width: 200px"
                  >
                    <template
                      v-if="
                        item.formatConfJsonList &&
                        item.formatConfJsonList.length > 0
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
                  <template
                    v-if="
                      item.controlType === 'json' && item.extendConf.tagShow
                    "
                  >
                    <el-check-tag
                      v-for="(radioTag, radioIndex) in item.formatConfJsonList"
                      :key="radioIndex"
                      :checked="radioTag.checked"
                      class="tagStyle"
                      @change="
                        clickItemTag(
                          $event,
                          radioTag,
                          item,
                          item.formatConfJsonList,
                          radioTag.valuekey
                        )
                      "
                    >
                      {{ radioTag.key }}
                    </el-check-tag>
                  </template>
                  <template v-if="item.controlType === 'dialog'">
                    <el-input
                      v-model="item.dialogConf.showValueQuery"
                      class="input-with-select"
                      :placeholder="
                        item.extendConf.queryPlaceHolder.length > 0
                          ? item.extendConf.queryPlaceHolder
                          : '请输入' + item.fieldDesc
                      "
                      readonly
                      style="width: 200px"
                    >
                      <template #append>
                        <ab-cust-dialog
                          :dialog-key="dialogKeyFn(item)"
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
                  <!-- 动态下拉框 -->
                  <template v-if="item.controlType === 'dynamicSelect'">
                    <el-select
                      v-bind="$attrs"
                      v-model="item['val']"
                      clearable
                      :disabled="item.showType === '3'"
                      :placeholder="
                        item.extendConf.queryPlaceHolder.length > 0
                          ? item.extendConf.queryPlaceHolder
                          : '请选择' + item.fieldDesc
                      "
                      style="width: 200px"
                    >
                    </el-select>
                  </template>
                </el-form-item>
              </template>
            </template>

            <el-form-item
              v-if="
                (info.queryList && info.queryList.length > 0) ||
                info.data.initQuery == 0
              "
            >
              <el-button :icon="Search" type="primary" @click="listFn()">
                查询
              </el-button>
              <el-button :icon="RefreshRight" @click="resetquery()">
                重置
              </el-button>
            </el-form-item>
          </el-form>
          <div
            v-if="info.queryList.length <= 0 && info.data.initQuery == 1"
            class="moduleChoose"
            style="margin-top: 0"
          >
            设置查询条件
          </div>
        </el-card>
        <el-card
          v-if="info.data.gridType !== 'report'"
          class="cardBodyStyle"
          :class="{ modulesactive: info.functionSettings }"
          shadow="hover"
          style="margin-top: 10px; cursor: pointer"
          @click="moduleclick('functionSettings')"
        >
          <div v-if="info.functionSettings" class="customize-overlay">
            <label>按钮功能设置</label>
          </div>
          <div v-if="info.data.sqlButtonVO.length > 0" style="min-height: 32px">
            <template
              v-for="(item, index) in info.data.sqlButtonVO"
              :key="index"
            >
              <template v-if="item.type === '2'">
                <!-- {{ item }} -->
                <span
                  v-if="
                    item.hrefSetting.openType &&
                    item.hrefSetting.openType == 'abComponent'
                  "
                >
                  <template
                    v-if="
                      item.hrefSetting.abComponentName &&
                      item.hrefSetting.abComponentName.length > 0
                    "
                  >
                    <component
                      :is="item.hrefSetting.abComponentName"
                      :data="item"
                      :list="info.tableData"
                    />
                  </template>
                </span>
                <el-button
                  v-if="
                    (item.hrefSetting.openType &&
                      item.hrefSetting.openType !== 'abComponent') ||
                    !item.hrefSetting.openType
                  "
                  disabled
                  :type="item.btncss"
                  @click="clickFn(item)"
                >
                  {{ item.name }}
                </el-button>
              </template>
            </template>
          </div>
          <div v-else class="moduleChoose">设置操作按钮</div>
        </el-card>
        <el-card
          class="cardBodyStyle"
          :class="{ modulesactive: info.fieldSettings }"
          shadow="hover"
          style="margin-top: 10px; cursor: pointer"
          @click="moduleclick('fieldSettings')"
        >
          <div v-if="info.fieldSettings" class="customize-overlay">
            <label>列表字段设置</label>
          </div>
          <el-table
            ref="abTable"
            v-loading="info.loading"
            border
            :cell-style="addClass"
            :data="info.tableData"
            :height="info.tableHeight"
            :row-style="setRowBackgroundColor"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            @sort-change="sortChange"
          >
            <!-- 是否支持单选 -->
            <el-table-column
              v-if="info.data.chooseType === 1"
              align="center"
              header-align="center"
              label="选择"
              width="60px"
            >
              <template #default="scope">
                <el-radio
                  v-model="info.templateRadio"
                  :label="scope.row.code ? scope.row.code : scope.row.id"
                  style="margin-left: 10px"
                  @change="getTemplateRow(scope.$index, scope.row)"
                >
                  {{ '' }}
                </el-radio>
              </template>
            </el-table-column>
            <!-- 是否支持多选 -->
            <el-table-column
              v-if="info.data.chooseType === 2"
              type="selection"
              width="55"
            />
            <!-- 是否显示序号 -->
            <el-table-column
              v-if="info.data.showRowsNum === 1"
              align="center"
              fixed="left"
              label="序号"
              type="index"
              width="60px"
            />
            <template
              v-for="item in info.data.fieldsList"
              :key="item.fieldDesc"
            >
              <el-table-column
                v-if="item.hidden == 0"
                :align="
                  item.align === 'c'
                    ? 'center'
                    : item.align === 'l'
                    ? 'left'
                    : item.align === 'r'
                    ? 'right'
                    : ''
                "
                :fixed="
                  item.additionConfMap && item.additionConfMap.isFix
                    ? item.additionConfMap.isFix == 1
                    : false
                "
                :label="item.fieldDesc"
                :min-width="
                  item.additionConfMap && item.additionConfMap.miniListWidth
                    ? item.additionConfMap.miniListWidth
                    : ''
                "
                :prop="item.fieldName"
                show-overflow-tooltip
                :sortable="item.sortAble === 1"
                :width="
                  item.additionConfMap && item.additionConfMap.listWidth
                    ? item.additionConfMap.listWidth
                    : ''
                "
              >
                <template #default="scope">
                  <template v-if="abUtil.compareStrings(item.fieldName,'abInstValMapLoader_abTaskUserJson')">
                    <el-popover placement="left" :width="400" trigger="hover">
                      <template #reference>
                        <el-button text type="primary" style="text-decoration:underline;text-underline-offset: 3px;">{{abUtil.getPropertyIgnoreCase(scope.row,item.fieldName) && abUtil.getPropertyIgnoreCase(scope.row,item.fieldName)[0] ? abUtil.getPropertyIgnoreCase(scope.row,item.fieldName)[0].nodeName : ''}}</el-button>
                      </template>
                      <el-table :data="abUtil.getPropertyIgnoreCase(scope.row,item.fieldName)">
                        <el-table-column property="nodeName" label="当前环节" />
                        <el-table-column property="assignNames" label="候选人" />
                      </el-table>
                    </el-popover>
                  </template>
                  <template v-else-if="item.fieldName == 'instanceStatus'">
                    <el-tag
                      v-if="
                        getIstanceStatusTitle(
                          abUtil.getPropertyIgnoreCase(scope.row,item.fieldName)
                        ) == '运行中'
                      "
                    >
                      {{
                        getIstanceStatusTitle(
                          abUtil.getPropertyIgnoreCase(scope.row,item.fieldName)
                        )
                      }}
                    </el-tag>
                    <el-tag
                      v-else-if="
                        getIstanceStatusTitle(
                          abUtil.getPropertyIgnoreCase(scope.row,item.fieldName)
                        ) == '人工终止'
                      "
                      type="danger"
                    >
                      {{
                        getIstanceStatusTitle(
                          abUtil.getPropertyIgnoreCase(scope.row,item.fieldName)
                        )
                      }}
                    </el-tag>
                    <el-tag v-else type="success">
                      {{
                        getIstanceStatusTitle(
                          abUtil.getPropertyIgnoreCase(scope.row,item.fieldName)
                        )
                      }}
                    </el-tag>
                  </template>
                  <template v-else>
                    <!-- 默认 -->
                    <span
                      v-if="!item.formatType"
                      :style="{
                        cursor:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'pointer'
                            : '',
                        textDecoration:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'underline'
                            : '',
                        color:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? '#1890ff'
                            : '',
                      }"
                      @click="goToUrl(item, scope.row)"
                    >
                      <div v-if="item.cssConfList && item.cssConfList.length > 0">
                        <el-tag
                          v-if="
                            item.cssConfList.some(
                              (animal) => animal.key == scope.row[item.fieldName]
                            )
                          "
                          :type="handleType(item, scope.row[item.fieldName])"
                        >
                          {{ scope.row[item.fieldName] }}
                        </el-tag>
                        <span v-else>{{ scope.row[item.fieldName] }}</span>
                      </div>
                      <span v-else>
                        {{ scope.row[item.fieldName] }}
                      </span>
                    </span>
                    <!-- 时间百分比显示 -->
                    <span
                      v-if="
                        item.formatType == 'percent' &&
                        (item.dataType == 'decimal' ||
                          item.dataType == 'number' ||
                          item.dataType == 'int')
                      "
                      :style="{
                        cursor:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'pointer'
                            : '',
                        textDecoration:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'underline'
                            : '',
                        color:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? '#1890ff'
                            : '',
                      }"
                      @click="goToUrl(item, scope.row)"
                    >
                      <span>
                        <el-progress :percentage="scope.row[item.fieldName]" />
                      </span>
                    </span>
                    <!-- 数据字典 -->
                    <span
                      v-if="item.formatType === 'dic'"
                      :style="{
                        cursor:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'pointer'
                            : '',
                        textDecoration:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'underline'
                            : '',
                        color:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? '#1890ff'
                            : '',
                      }"
                      @click="goToUrl(item, scope.row)"
                    >
                      <span>
                        <div
                          v-if="item.cssConfList && item.cssConfList.length > 0"
                        >
                          <el-tag
                            v-if="
                              item.cssConfList.some(
                                (animal) =>
                                  animal.key ==
                                  handleField(item, scope.row[item.fieldName])
                              )
                            "
                            :type="
                              handleType(
                                item,
                                handleField(item, scope.row[item.fieldName])
                              )
                            "
                          >
                            {{ handleField(item, scope.row[item.fieldName]) }}
                          </el-tag>
                          <span v-else>
                            {{ handleField(item, scope.row[item.fieldName]) }}
                          </span>
                        </div>
                        <span v-else>
                          {{ handleField(item, scope.row[item.fieldName]) }}
                        </span>
                      </span>
                    </span>
                    <!-- 时间 -->
                    <span
                      v-if="item.formatType === 'date_picker'"
                      :style="{
                        cursor:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'pointer'
                            : '',
                        textDecoration:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'underline'
                            : '',
                        color:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? '#1890ff'
                            : '',
                      }"
                      @click="goToUrl(item, scope.row)"
                    >
                      <span>
                        <div
                          v-if="item.cssConfList && item.cssConfList.length > 0"
                        >
                          <el-tag
                            v-if="
                              item.cssConfList.some(
                                (animal) =>
                                  animal.key ==
                                  handleTime(item, scope.row[item.fieldName])
                              )
                            "
                            :type="
                              handleType(
                                item,
                                handleTime(item, scope.row[item.fieldName])
                              )
                            "
                          >
                            {{ handleTime(item, scope.row[item.fieldName]) }}
                          </el-tag>
                          <span v-else>
                            {{ handleTime(item, scope.row[item.fieldName]) }}
                          </span>
                        </div>
                        <span v-else>
                          {{ handleTime(item, scope.row[item.fieldName]) }}
                        </span>
                        <!-- {{
                          item.formatConf && item.formatConf.length > 0
                            ? ab_dateFormat(
                                scope.row[item.fieldName],
                                JSON.parse(item.formatConf).value
                              )
                            : scope.row[item.fieldName]
                        }} -->
                      </span>
                    </span>
                    <!-- 时间戳转时间格式 -->
                    <span
                      v-if="item.formatType === 'timestamp'"
                      :style="{
                        cursor:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'pointer'
                            : '',
                        textDecoration:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'underline'
                            : '',
                        color:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? '#1890ff'
                            : '',
                      }"
                      @click="goToUrl(item, scope.row)"
                    >
                      <span>
                        <span
                          v-if="item.cssConfList && item.cssConfList.length > 0"
                        >
                          <el-tag
                            v-if="
                              item.cssConfList.some(
                                (animal) =>
                                  animal.key ==
                                  handleTimeStamp(item, scope.row[item.fieldName])
                              )
                            "
                            :type="
                              handleType(
                                item,
                                handleTimeStamp(item, scope.row[item.fieldName])
                              )
                            "
                          >
                            {{ handleTimeStamp(item, scope.row[item.fieldName]) }}
                          </el-tag>
                          <span v-else>
                            {{ handleTimeStamp(item, scope.row[item.fieldName]) }}
                          </span>
                        </span>
                        <span v-else>
                          {{ handleTimeStamp(item, scope.row[item.fieldName]) }}
                        </span>
                      </span>
                    </span>
                    <!-- 数字格式化 -->
                    <span
                      v-if="item.formatType === 'decimal'"
                      :style="{
                        cursor:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'pointer'
                            : '',
                        textDecoration:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'underline'
                            : '',
                        color:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? '#1890ff'
                            : '',
                      }"
                      @click="goToUrl(item, scope.row)"
                    >
                      <span>
                        <div
                          v-if="item.cssConfList && item.cssConfList.length > 0"
                        >
                          <el-tag
                            v-if="
                              item.cssConfList.some(
                                (animal) =>
                                  animal.key ==
                                  handelNumber(item, scope.row[item.fieldName])
                              )
                            "
                            :type="
                              handleType(
                                item,
                                handelNumber(item, scope.row[item.fieldName])
                              )
                            "
                          >
                            {{ handelNumber(item, scope.row[item.fieldName]) }}
                          </el-tag>
                          <span v-else>
                            {{ handelNumber(item, scope.row[item.fieldName]) }}
                          </span>
                        </div>
                        <span v-else>
                          {{ handelNumber(item, scope.row[item.fieldName]) }}
                        </span>
                        <!-- {{ handelNumber(item, scope.row[item.fieldName]) }} -->
                        <!-- {{
                          item.formatConf && JSON.parse(item.formatConf)
                            ? AbUtil.comdify(
                                handelNumber(item, scope.row[item.fieldName])
                              )
                            : handelNumber(item, scope.row[item.fieldName])
                        }} -->
                      </span>
                    </span>
                    <!-- JSON -->
                    <span
                      v-if="item.formatType === 'json'"
                      :style="{
                        cursor:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'pointer'
                            : '',
                        textDecoration:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'underline'
                            : '',
                        color:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? '#1890ff'
                            : '',
                      }"
                      @click="goToUrl(item, scope.row)"
                    >
                      <span
                        v-html="handleJson(item, scope.row[item.fieldName])"
                      ></span>
                      <!-- <span>
                        <div
                          v-if="item.cssConfList && item.cssConfList.length > 0"
                        >
                          <el-tag
                            v-if="
                              item.cssConfList.some(
                                (animal) =>
                                  animal.key ==
                                  handleJson(item, scope.row[item.fieldName])
                              )
                            "
                            :type="
                              handleType(
                                item,
                                handleJson(item, scope.row[item.fieldName])
                              )
                            "
                          >
                            {{ handleJson(item, scope.row[item.fieldName]) }}
                          </el-tag>
                          <span v-else>
                            {{ handleJson(item, scope.row[item.fieldName]) }}
                          </span>
                        </div>
                        <span v-else>
                          {{ handleJson(item, scope.row[item.fieldName]) }}
                        </span>
                      </span> -->
                    </span>
                    <!-- js-->
                    <span
                      v-if="item.formatType == 'javascript'"
                      :style="{
                        cursor:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'pointer'
                            : '',
                        textDecoration:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'underline'
                            : '',
                        color:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? '#1890ff'
                            : '',
                      }"
                      @click="goToUrl(item, scope.row)"
                    >
                      <div v-html="handleJs(item, scope.row, scope.$index)"></div>
                    </span>
                    <!-- dialog-->
                    <span
                      v-if="item.formatType === 'dialog'"
                      :style="{
                        cursor:
                          item.hrefConfMap.openType && item.hrefConfMap.openType.length > 0
                            ? 'pointer'
                            : '',
                        textDecoration:
                          item.hrefConfMap.openType && item.hrefConfMap.openType.length > 0
                            ? 'underline'
                            : '',
                        color:
                          item.hrefConfMap.openType && item.hrefConfMap.openType.length > 0
                            ? '#1890ff'
                            : '',
                      }"
                      @click="goToUrl(item, scope.row)"
                    >
                      <span>{{ scope.row[item.fieldName] }}</span>
                    </span>
                    <div
                      v-if="item.formatType === 'picture'"
                      :style="{
                        cursor:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'pointer'
                            : '',
                        textDecoration:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'underline'
                            : '',
                        color:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? '#1890ff'
                            : '',
                      }"
                      @click="goToUrl(item, scope.row)"
                    >
                      <div class="demo-image__preview imageWidthAuto">
                        <el-image
                          v-if="
                            scope.row[item.fieldName] &&
                            scope.row[item.fieldName].length > 0
                          "
                          :preview-src-list="handleSrcList(item, scope.row)"
                          :preview-teleported="true"
                          :src="handleSrcUrl(item, scope.row)"
                          :style="{
                            height: item.additionConfMap.pictureHeight + 'px',
                          }"
                          :zoom-rate="1.2"
                        />
                      </div>
                    </div>
                    <span
                      v-if="item.formatType === 'file'"
                      :style="{
                        cursor:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'pointer'
                            : '',
                        textDecoration:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'underline'
                            : '',
                        color:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? '#1890ff'
                            : '',
                      }"
                      @click="goToUrl(item, scope.row)"
                    >
                      <template
                        v-if="
                          scope.row[item.fieldName] &&
                          scope.row[item.fieldName].length > 0
                        "
                      >
                        <p
                          v-for="(fileItem, fileIndex) in JSON.parse(
                            scope.row[item.fieldName]
                          )"
                          :key="fileIndex"
                        >
                          <el-tag
                            style="cursor: pointer"
                            @click="downFileFn(fileItem)"
                          >
                            {{ fileItem.name }}
                          </el-tag>
                        </p>
                      </template>
                    </span>
                    <!-- region 区域格式化 cascadeSelect 级联格式化--->
                    <span
                      v-if="item.formatType == 'region' || item.formatType == 'cascadeSelect'"
                      :style="{
                        cursor:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'pointer'
                            : '',
                        textDecoration:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? 'underline'
                            : '',
                        color:
                          item.hrefConfMap.openType &&
                          item.hrefConfMap.openType.length > 0
                            ? '#1890ff'
                            : '',
                      }"
                      @click="goToUrl(item, scope.row)"
                    >
                      <div v-if="item.cssConfList && item.cssConfList.length > 0">
                        <el-tag
                          v-if="
                            item.cssConfList.some(
                              (animal) => animal.key == scope.row[item.fieldName]
                            )
                          "
                          :type="handleType(item, scope.row[item.fieldName])"
                        >
                          {{ scope.row[item.fieldName] }}
                        </el-tag>
                        <span v-else>{{ scope.row[item.fieldName] }}</span>
                      </div>
                      <span v-else>
                        {{ scope.row[item.fieldName] }}
                      </span>
                    </span>
                  </template>
                </template>
              </el-table-column>
            </template>
            <!-- 是否固定操作栏 -->
            <el-table-column
              v-if="info.data.fixTool === 1 && info.data.gridType !== 'app'"
              align="center"
              fixed="right"
              label="操作"
              prop="key"
              :width="info.data.operationWidth"
            >
              <template #default="scope">
                <div>
                  <span
                    v-for="(item, index) in info.data.sqlButtonVO"
                    :key="index"
                  >
                    <template v-if="item.type === '1' && item.exp">
                      <template
                        v-if="
                          item.hrefSetting.openType &&
                          item.hrefSetting.openType == 'abComponent'
                        "
                      >
                        <template
                          v-if="
                            item.hrefSetting.abComponentName &&
                            item.hrefSetting.abComponentName.length > 0
                          "
                        >
                          <component
                            :is="item.hrefSetting.abComponentName"
                            :data="item"
                            :list="info.tableData"
                          />
                        </template>
                      </template>
                      <el-button
                        v-if="
                          (item.hrefSetting.openType &&
                            item.hrefSetting.openType !== 'abComponent') ||
                          !item.hrefSetting.openType
                        "
                        disabled
                        size="small"
                        style="margin: 0 3px"
                        text
                        :type="item.btncss"
                        @click.stop="localclickFn(item, scope.row)"
                      >
                        {{ item.name }}
                      </el-button>
                    </template>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="info.data.fixTool === 0 && info.data.gridType !== 'app'"
              align="center"
              label="操作"
              prop="key"
              :width="info.data.operationWidth"
            >
              <template #default="scope">
                <div>
                  <span
                    v-for="(item, index) in info.data.sqlButtonVO"
                    :key="index"
                  >
                    <template v-if="item.type === '1' && item.exp">
                      <template
                        v-if="
                          item.hrefSetting.openType &&
                          item.hrefSetting.openType == 'abComponent'
                        "
                      >
                        <template
                          v-if="
                            item.hrefSetting.abComponentName &&
                            item.hrefSetting.abComponentName.length > 0
                          "
                        >
                          <component
                            :is="item.hrefSetting.abComponentName"
                            :data="item"
                            :list="info.tableData"
                          />
                        </template>
                      </template>
                      <el-button
                        v-if="
                          (item.hrefSetting.openType &&
                            item.hrefSetting.openType !== 'abComponent') ||
                          !item.hrefSetting.openType
                        "
                        disabled
                        size="small"
                        style="margin: 0 3px"
                        text
                        :type="item.btncss"
                        @click.stop="localclickFn(item, scope.row)"
                      >
                        {{ item.name }}
                      </el-button>
                    </template>
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            v-model:currentPage="info.query.currentPage"
            v-model:page-size="info.data.pageSize"
            :background="true"
            :disabled="false"
            layout="prev, pager, next, jumper,total, sizes"
            :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
            :pager-count="5"
            style="margin: 12px 0 8px 0"
            :total="info.total"
            @current-change="listFn"
            @size-change="listFn"
          />
        </el-card>
      </el-main>
      <el-aside style="padding: 0 20px; border: 1px solid #e4e7ed" class="rightBox" :width="props.isAppDesign ? '450px' : '30%'">
        <el-tabs v-model="activeName" class="demo-tabs tabsStyle">
          <el-tab-pane label="基础设置" name="basicSettings">
            <div
              :style="{
                height: info.rightHeight,
                overflow: 'auto',
              }"
            >
              <list-basic-settings
                ref="listBasicRef"
                v-model="info.data"
                @search="listFn"
                @search-obj-name="searchObjName"
              />
              <left-tree-settings
                v-model="info.data"
                @savetree="processingData"
              />
              <phone-list-settings v-model="info.data" />
              <default-sorting v-model="info.data" />
            </div>
          </el-tab-pane>
          <el-tab-pane
            v-show="info.settingsType === 'querySettings'"
            label="查询设置"
            name="querySettings"
          >
            <div :style="{ height: info.rightHeight, overflow: 'auto' }">
              <list-query-settings
                v-model="info.data"
                @reset-dia="resetQueryDia"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane
            v-show="
              info.settingsType === 'functionSettings' &&
              info.data.gridType !== 'report'
            "
            label="按钮设置"
            name="functionSettings"
          >
            <div :style="{ height: info.rightHeight, overflow: 'auto' }">
              <list-function-settings v-model="info.data" />
              <!-- <div v-else style="margin-top: 50px; text-align: center">
                请先关联在线表单
              </div> -->
            </div>
          </el-tab-pane>
          <el-tab-pane
            v-show="info.settingsType === 'fieldSettings'"
            label="字段设置"
            name="fieldSettings"
          >
            <div :style="{ height: info.rightHeight, overflow: 'auto' }">
              <list-field-settings
                v-model="info.data"
                @fields-list-init="fieldsListInit"
                @get-Table="getTable"
                @list-fn="listFn"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
    </el-container>
    <el-dialog
      v-model="info.dialogVisible"
      title="预览"
      :width="info.hrefSetting.width + info.hrefSetting.widthUnit"
    >
      <iframe
        id="iframe"
        frameborder="0"
        :src="info.hrefSettingUrl"
        :style="{
          height:
            Number(info.hrefSetting.height) - 117 + info.hrefSetting.heightUnit,
        }"
        width="100%"
      ></iframe>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Search, RefreshRight } from '@element-plus/icons-vue'
  import leftTreeSettings from './leftTreeSettings.vue'
  import phoneListSettings from './phoneListSettings.vue'
  import listBasicSettings from './listBasicSettings.vue'
  import listFieldSettings from './listFieldSettings.vue'
  import listQuerySettings from './listQuerySettings.vue'
  import listFunctionSettings from './listFunctionSettings.vue'
  import defaultSorting from '../components/defaultSorting.vue'
  import * as abFormat from '~/agilebpm/utils/ab-format'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { abCustDialogTree } from '@ab-core'
  import { sysApi, bizApi, postData, getData } from '~/agilebpm/api'
  import { abT } from '@/i18n'
  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()
  // 列表多选数组
  const multipleSelection = ref<User[]>([])
  const activeName = ref('basicSettings')
  const emit = defineEmits([
    'update:modelValue',
    'searchObjName',
    'extNameChange',
    'fieldsListInit',
    'setForm'
  ])
  // const props = defineProps({
  //   data: { required: true, type: Object }, // 赋值目标对象
  // })
  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
    isAppDesign: { default: false, type: Boolean } // 是否应用设计（应用广场）
    // eslint-disable-next-line vue/require-default-prop
  })
  const info: any = reactive({
    data: useVModel(props, 'modelValue', emit),
    treeData: [],
    leftTreeDialogParam: {},
    leftTreeDialog: null,
    innerHeight: window.innerHeight - 110,
    rightHeight: props.isAppDesign ? '100%' : `${window.innerHeight - 353}px`,
    query: {
      pageSize: 10,
      currentPage: 1,
      queryData: {},
      orderBy: '',
    },
    loading: false,
    tableData: [],
    total: 0,
    tableHeight: props.isAppDesign ? `${window.innerHeight - 356}px` : `${window.innerHeight - 528}px`,
    templateRadio: false,
    templateSelection: {},
    linButton: [],
    settingsType: '',
    dialogVisible: false,
    hrefSetting: {},
    querySettings: false,
    functionSettings: false,
    fieldSettings: false,
    hrefSettingUrl: '',
    queryList: [],
    runOnce: true,
    dictObj: [],
    openPanel: true,
    instanceStatusOption:[]
  })

  info.queryList = JSON.parse(JSON.stringify(info.data.sqlConditionVOS))

  watch(
    () => [...info.data.sqlConditionVOS],
    (now, old) => {
      info.queryList = JSON.parse(JSON.stringify(info.data.sqlConditionVOS))
    },
    { deep: true }
  )


  watch(
    () => activeName.value,
    (now) => {
      info.querySettings = false
      info.functionSettings = false
      info.fieldSettings = false
      if (now == 'querySettings') {
        info.querySettings = true
      }
      if (now == 'functionSettings') {
        info.functionSettings = true
      }
      if (now == 'fieldSettings') {
        info.fieldSettings = true
      }
    }
  )

  const moduleclick = (type: any) => {
    info.settingsTypeBe = false
    info.settingsType = type
    activeName.value = type
    // 加上动态class
    info.querySettings = false
    info.functionSettings = false
    info.fieldSettings = false
    if (type == 'querySettings') {
      info.querySettings = true
    }
    if (type == 'functionSettings') {
      info.functionSettings = true
    }
    if (type == 'fieldSettings') {
      info.fieldSettings = true
    }
  }

  const setActiveNameBasic = () => {
    activeName.value = 'basicSettings'
  }

  // 自定义列表请求左侧树列表
  const getCustTree = (row: any) => {
    postData(bizApi.custGrid.listUrl + row.code, { pageSize: 9999 }).then(
      (result) => {
        if (row.rootName && row.rootName.length > 0) {
          //增加根节点
          info.treeData = [
            {
              [info.data.leftTreeMap.nameKey]: row.rootName,
              children: buildTree(result.data.list),
            },
          ]
        } else {
          info.treeData = buildTree(result.data.list)
        }
      },
      () => {}
    )
  }
  // 数据字典类型请求左侧树列表
  const getdictDataTree = (row: any) => {
    sysApi.dict
      .getDictDataUrl({
        dictKey: row.code.length > 0 ? row.code : row.name,
        hasRoot: row.rootName && row.rootName.length > 0 ? false : true,
        rootName: row.rootName,
      })
      .then(({ data }) => {
        if (data.length > 0) {
          info.treeData = data
        } else {
          info.treeData = []
        }
      })
  }

  // 对话框请求左侧树列表
  const getdiaDataTree = (row: any) => {
    // 请求对话框接口
    getData(bizApi.customDialog.getByCode + row.code, {}).then(
      (result: any) => {
        info.openPanel = false
        setTimeout(() => {
          info.openPanel = true
        }, 100)
        if (row.rootName && row.rootName.length > 0) {
          //增加根节点
          info.leftTreeDialogParam['rootName'] = row.rootName
        }
        info.leftTreeDialog = extend(
          {
            multiple: false,
          },
          result.data
        )
      },
      () => {}
    )
  }

  // 请求列表
  const listFn = () => {
    info.loading = true
    // 查询条件处理
    const queryData: any = []
    info.queryList.forEach((item: any, index: any) => {
      if (item.cntype == 'is null' || item.cntype == 'is not null') {
        queryData.push({
          name: item.name.length > 0 ? item.name : item.fieldName,
          con: item.cntype,
          val: '',
        })
      }
      if (
        (item.val && item.val.length > 0) ||
        item.numbewValStart ||
        item.numbewValEnd
      ) {
        if (item.controlType == 'date_picker' && item.cntype == '>=,<=') {
          item.val.forEach((itemTime: any, itemIndex: any) => {
            queryData.push({
              name: item.name.length > 0 ? item.name : item.fieldName,
              con: itemIndex <= 0 ? '>=' : '<=',
              val: itemTime,
            })
          })
        } else if (
          item.controlType === 'decimal' &&
          item.dataType === 'decimal' &&
          item.cntype == '>=,<='
        ) {
          if (item.numbewValStart) {
            queryData.push({
              name: item.name.length > 0 ? item.name : item.fieldName,
              con: '>=',
              val: item.numbewValStart,
            })
          }
          if (item.numbewValEnd) {
            queryData.push({
              name: item.name.length > 0 ? item.name : item.fieldName,
              con: '<=',
              val: item.numbewValEnd,
            })
          }
        } else {
          queryData.push({
            name: item.name,
            con: item.cntype,
            val: item.val,
          })
        }
      }
    })
    info.query.queryData = queryData
    info.query.pageSize = info.data.pageSize

    postData(bizApi.custGrid.listUrl + info.data.code, info.query).then(
      (result: any) => {
        info.loading = false
        info.tableData = result.data.list
        info.total = result.data.count
      },
      () => {
        info.loading = false
      }
    )
  }

  // 处理数据
  const processingData = () => {
    // 左侧树
    if (info.data.leftTreeMap && info.data.leftTreeMap.showTree == '1') {
      if (info.data.leftTreeMap.dataFrom == '1') {
        // 对话框
        getdiaDataTree(info.data.leftTreeMap)
      }
      if (info.data.leftTreeMap.dataFrom == '2') {
        // 数据字典类型
        getdictDataTree(info.data.leftTreeMap)
      }
      if (info.data.leftTreeMap.dataFrom == '4') {
        // 自定义列表
        getCustTree(info.data.leftTreeMap)
      }
    }

    // 处理查询条件
    info.queryList.forEach((item: any, index: any) => {
      if (item.controlType == 'dic') {
        // 数据字典时 请求接口获取字典项
        if (item.formatType && item.formatType === 'dic') {
        if (item.formatConf) {
          if (typeof item.formatConf == 'string') {
            item.formatDefault = JSON.parse(item.formatConf)
          }
        }
        if(item.formatDefault.code){
          sysApi.dict
            .getDictTreeByCodeNoRoot(item.formatDefault.code)
            .then((data) => {
              item.formatDefault.dicList = data
            })
        }
      }
      if (
          item.formatConf &&
          item.formatConf.length > 0 &&
          typeof item.formatConf == 'string'
        ) {
          item.formatConf = JSON.parse(item.formatConf)
        }
        if (!item.formatConf) {
          item.formatConf = {}
        }
      }
      if (item.controlType == 'dialog') {
        // 数据字典时 请求接口获取字典项
        if (item.dialogConf.showValueQuery) {
          item.dialogConf.showValueQuery = ''
        }
        item['val'] = ''
      }
    })

    // 处理href JSON.String问题
    info.data.fieldsList.forEach((item: any, index: any) => {
      //  列表字段格式化类型为数据字典时
      item.rowKeyValue = index
      if (!item.additionConfMap) {
        item.additionConfMap = {
          isFix: 0,
        }
      }
      // 如果是dic 那么请求接口获取
      if (item.formatType == 'dic') {
        if (typeof item.formatConf == 'string') {
          item.formatConf = JSON.parse(item.formatConf)
        }
        sysApi.dict
          .getDictTreeByCodeNoRoot(item.formatConf.code)
          .then((data) => {
            info.dictObj.push({
              code: item.formatConf.code,
              dictList: data,
            })
          })
      }
    })

    if (info.data.sqlButtonVO.length > 0) {
      // 处理按钮
      info.data.sqlButtonVO.forEach((item: any) => {
        if (item.exp === 'true') {
          item.exp = true
        }
        if (item.exp === 'false') {
          item.exp = false
        }
      })
    }
    // 是否默认请求列表 1：默认，0：不默认
    if (
      info.data.initQuery == 1 &&
      info.data.id &&
      info.data.id.length > 0 &&
      !proxy.$route.query.copy
    ) {
      // 请求列表
      listFn()
    }
  }
  processingData()

  const extend = (parent: Record<string, any>, child: { [x: string]: any }) => {
    child = child || {}
    for (const prop in parent) {
      child[prop] = parent[prop]
    }
    return child
  }

  //模仿老版的构建tree 处理树形数据
  const buildTree = (data: any[], parentId: undefined, parent: undefined) => {
    if (!parentId) {
      //找到根节点

      data.forEach((item: { [x: string]: any }) => {
        let root = true
        data.forEach((ite) => {
          if (
            item[info.data.leftTreeMap.pidKey] ==
            ite[info.data.leftTreeMap.idKey]
          ) {
            root = false
          }
        })
        if (root) {
          parentId = item[info.data.leftTreeMap.pidKey]
        }
      })
    }
    const tree = []
    let temp
    for (let i = 0; i < data.length; i++) {
      if (data[i][info.data.leftTreeMap.pidKey] == parentId) {
        const obj = data[i]
        temp = buildTree(data, data[i][info.data.leftTreeMap.idKey], data[i])
        if (temp.length > 0) {
          obj.children = temp
        }

        if (parent) {
          obj.parent = parent
        }

        tree.push(obj)
      }
    }
    return tree
  }

  // 点击左侧树节点
  const nodeClickFn = (row: any) => {
    info.query.currentPage = 1
    if (
      info.data.leftTreeMap.relField &&
      info.data.leftTreeMap.relField.length > 0
    ) {
      info.queryList.forEach((item: any, index: any) => {
        if (item.fieldName === info.data.leftTreeMap.relField) {
          // 如果是数据字典
          if (
            info.data.leftTreeMap.dataFrom === '2' ||
            info.data.leftTreeMap.dataFrom === '4'
          ) {
            item.val = ''
            if (row.parentId !== '0') {
              item.val = row[info.data.leftTreeMap.relField] || row.code
            }
          }
          // 如果是自定义对话框
          if (info.data.leftTreeMap.dataFrom === '1') {
            item.val = ''
            // if (row.parentId || row.parent_id_) {
            item.val = info.data.leftTreeMap.diaBack
              ? row[info.data.leftTreeMap.diaBack]
              : ''
            // }
          }
        }
      })
      listFn()
    } else {
      listFn()
    }
  }

  // 点击重置
  const resetquery = () => {
    info.query.currentPage = 1
    info.queryList.forEach((item: any, index: any) => {
      if (item.controlType === 'dialog') {
        item.dialogConf.queryCustDialog = []
        item.dialogConf.showValueQuery = ''
      }
      if (
        (item.controlType === 'dic' && item.extendConf.tagShow) ||
        (item.controlType === 'json' && item.extendConf.tagShow)
      ) {
        if (item.formatConf.dicList && item.formatConf.dicList.length > 0) {
          item.formatConf.dicList.forEach((dicItem: any) => {
            dicItem.checked = false
          })
        }
        if (
          item.formatConf.formatConfJsonList &&
          item.formatConf.formatConfJsonList.length > 0
        ) {
          item.formatConf.formatConfJsonList.forEach((dicItem: any) => {
            dicItem.checked = false
          })
        }
      }
      if (
        item.controlType === 'decimal' &&
        item.dataType === 'decimal' &&
        item.cntype == '>=,<='
      ) {
        item.numbewValStart = ''
        item.numbewValEnd = ''
      }
      if (item.showType == '1' || item.showType == '3') {
        item.val = ''
      }
    })
    listFn()
  }

  // 排序
  const sortChange = (data: { order: string; prop: any }) => {
    if (!data.order) {
      info.query.orderBy = ''
    } else {
      info.query.orderBy =
        data.order == 'ascending'
          ? `${data.prop}#` + `asc`
          : `${data.prop}#` + `desc`
    }
    listFn()
  }

  // 点击单选
  const getTemplateRow = (index: any, row: any) => {
    info.templateSelection = row
  }

  // 多选操作
  const handleSelectionChange = (val: User[]) => {
    multipleSelection.value = val
  }

  // 设置了href 跳转
  const goToUrl = (item: any, row: any) => {
    if (item.hrefConfMap.openType && item.hrefConfMap.openType.length > 0) {
      if (item.hrefConfMap.openType == 'tab') {
        if (item.hrefConfMap.url && item.hrefConfMap.url.length > 0) {
          proxy.$router.push(replaceStr(item.hrefConfMap.url, row))
        }
      }
      if (item.hrefConfMap.openType == 'topDialog') {
        if (item.hrefConfMap.url && item.hrefConfMap.url.length > 0) {
          info.dialogVisible = true
          info.hrefSetting = item.hrefConfMap
          info.hrefSettingUrl = replaceStr(item.hrefConfMap.url, row)
        }
      }
      if (item.hrefConfMap.openType == 'newPage') {
        if (item.hrefConfMap.url && item.hrefConfMap.url.length > 0) {
          window.open(replaceStr(item.hrefConfMap.url, row))
        }
      }
    }
  }
  const handleType = (item: any, value: any) => {
    let _value
    item.cssConfList.some((animal: any) =>
      animal.key == value ? (_value = animal.value) : ''
    )
    return _value
  }

  // 遍历树形结构
  const treeIterator = (tree: any, func: any) => {
    tree.forEach((node: any) => {
      func(node)
      node.children && treeIterator(node.children, func)
    })
  }

  // 处理数据字典字段
  const handleField = (item: any, value: any) => {
    let _value
    let formatConf
    let arr
    const arrList = []
    let dictList
    if (typeof item.formatConf == 'string' && item.formatConf.length > 0) {
      formatConf = JSON.parse(item.formatConf)
    }
    if (typeof item.formatConf == 'object') {
      formatConf = item.formatConf
    }

    info.dictObj.forEach((rowItem: any) => {
      if (rowItem.code && formatConf.code && rowItem.code == formatConf.code) {
        dictList = rowItem.dictList
      }
    })
    if (dictList && dictList.length > 0) {
      if (value && value.length > 0) {
        arr = value.split(',')
      }
      treeIterator(dictList, (node) => {
        if (arr && arr.length > 0) {
          arr.forEach((arrItem: any) => {
            if (arrItem == node.code) {
              _value = node.name
              arrList.push(node.name)
            }
          })
        }
      })
      _value = ''
      arrList.forEach((arrListItem: any) => {
        _value += `${arrListItem},`
      })
      const lastIndex = _value.lastIndexOf(',')
      if (lastIndex > -1) {
        _value =
          _value.substring(0, lastIndex) +
          _value.substring(lastIndex + 1, _value.length)
      }
      return _value
    } else {
      return value
    }
  }

  //处理数字格式化字段
  const handelNumber = (item: any, value: any) => {
    if (item.formatConf && item.formatConf.length > 0) {
      const formatConf = JSON.parse(item.formatConf)
      if (!isNaN(Number(value))) {
        const a = Number.isInteger(Number(value))
          ? Number(value)
          : Number(value).toFixed(formatConf.decimalValue)
        return formatConf.coinValue
          ? abUtil.comdify(
              formatConf.showType == '前展示'
                ? formatConf.coinValue + a
                : a + formatConf.coinValue
            )
          : abUtil.comdify(a)
      } else {
        return value
      }
    } else {
      if (!isNaN(Number(value))) {
        return abUtil.comdify(value)
      } else {
        return value
      }
    }
  }

  const checkDateTime = (str: any) => {
    if (isNaN(str) && !isNaN(Date.parse(str))) {
      return true
    } else {
      return false
    }
  }

  const handleTime = (item: any, value: any) => {
    if (item.formatConf && item.formatConf.length > 0) {
      let _value
      const formatConf = JSON.parse(item.formatConf)
      if (checkDateTime(value)) {
        if (JSON.parse(item.formatConf).value) {
          _value = abFormat.ab_dateFormat(
            value,
            JSON.parse(item.formatConf).value
          )
        } else {
          _value = value
        }
      } else if (!value || value.length <= 0 || value <= 0) {
        _value = ''
      } else {
        _value = '格式不正确'
      }
      return _value
    } else {
      return value
    }
  }

  const handleTimeStamp = (item: any, value: any) => {
    let _value
    if (value || value.length > 0) {
      _value = formatToDate(value,item.formatConf.timeType) || formatToDate(Number(value),item.formatConf.timeType)
    } else if (!value || value.length <= 0 || value <= 0) {
      _value = ''
    } else {
      _value = '格式不正确'
    }
    return _value
  }

  const add0 = (m: any) => {
    return m < 10 ? `0${m}` : m
  }

  const formatToDate = (timeStamp: any,timeType:any) => {
    // eg: 2020-06-30 20:53
    let result = ''
    if (timeStamp) {
      //timeStamp是整数，否则要parseInt转换
      const time = new Date(timeStamp * 1000)
      const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      const h = time.getHours()
      const mm = time.getMinutes()
      const s = time.getSeconds()
      // result = `${y}-${add0(m)}-${add0(d)} ${add0(h)}:${add0(mm)}`
      result = timeType == 'yyyy' ? `${y}` : timeType == 'yyyy-MM' ? `${y}-${add0(m)}` : timeType == 'YYYY-MM-DD HH:mm:ss' ? `${y}-${add0(m)}-${add0(d)} ${add0(h)}:${add0(mm)}:${add0(s)}` :  `${y}-${add0(m)}-${add0(s)}`
    }
    return result
  }


  // 处理JSON字段
  const handleJson = (item: any, value: any) => {
    if (item.formatConf && item.formatConf.length > 0) {
      let _value
      const arr = []
      const arrNew = []
      const formatConf = JSON.parse(item.formatConf)
      if (value && value.length > 0 && value.indexOf(',') != -1) {
        arr = value.split(',')
        formatConf.forEach((itemFor: any) => {
          arr.forEach((arrItem: any) => {
            if (itemFor.value == arrItem) {
              if (itemFor.styleValue && itemFor.styleValue.length > 0) {
                arrNew.push({
                  key: itemFor.key,
                  styleValue: itemFor.styleValue,
                })
              } else {
                arrNew.push({
                  key: itemFor.key,
                  styleValue: '',
                })
              }
            }
          })
        })
      } else {
        formatConf.forEach((itemFor: any) => {
          if (itemFor.value == value) {
            if (itemFor.styleValue && itemFor.styleValue.length > 0) {
              arrNew.push({
                key: itemFor.key,
                styleValue: itemFor.styleValue,
              })
            } else {
              arrNew.push({
                key: itemFor.key,
                styleValue: '',
              })
            }
          }
        })
      }
      _value = ''
      arrNew.forEach((arrNewItem: any) => {
        if (arrNewItem.styleValue && arrNewItem.styleValue.length > 0) {
          let a = ''
          if (arrNewItem.styleValue == 'success') {
            a =
              'display:inline-block;color:#67c23a;background-color:#f0f9eb;border-color:#e1f3d8;display: inline-flex;justify-content: center;align-items: center;height: 24px;padding: 0 9px;font-size:12px;line-height: 1;border-width: 1px;border-style: solid;'
          }
          if (arrNewItem.styleValue == 'default') {
            a =
              'display:inline-block;color:#409eff;background-color:#ecf5ff;border-color:#d9ecff;display: inline-flex;justify-content: center;align-items: center;height: 24px;padding: 0 9px;font-size:12px;line-height: 1;border-width: 1px;border-style: solid;'
          }
          if (arrNewItem.styleValue == 'info') {
            a =
              'display:inline-block;color:#909399;background-color:#f4f4f5;border-color:#e9e9eb;display: inline-flex;justify-content: center;align-items: center;height: 24px;padding: 0 9px;font-size:12px;line-height: 1;border-width: 1px;border-style: solid;'
          }
          if (arrNewItem.styleValue == 'warning') {
            a =
              'display:inline-block;color:#e6a23c;background-color:#fdf6ec;border-color:#faecd8;display: inline-flex;justify-content: center;align-items: center;height: 24px;padding: 0 9px;font-size:12px;line-height: 1;border-width: 1px;border-style: solid;'
          }
          if (arrNewItem.styleValue == 'danger') {
            a =
              'display:inline-block;color:#f56c6c;background-color:#fef0f0;border-color:#fde2e2;display: inline-flex;justify-content: center;align-items: center;height: 24px;padding: 0 9px;font-size:12px;line-height: 1;border-width: 1px;border-style: solid;'
          }
          _value += `<span style="${a}">${arrNewItem.key}</span>`
        } else {
          _value += `<span>${arrNewItem.key}</span>` + ','
        }
      })
      const lastIndex = _value.lastIndexOf(',')
      if (lastIndex > -1) {
        _value =
          _value.substring(0, lastIndex) +
          _value.substring(lastIndex + 1, _value.length)
      }
      return `<span>${_value}</span>`
    } else {
      return `<span>${value}</span>`
    }
  }
  // 处理js格式化
  const handleJs = (item: any, rowA: any, indexA: any) => {
    if (item.formatConf && item.formatConf.length > 0) {
      const row = rowA
      const value = rowA[item.fieldName]
      const index = indexA
      try {
        const func = new Function('value', item.formatConf)
        return func(value)
      } catch (error) {
        console.log(`${item.fieldDesc}js格式化输入有误`)
        return '--'
      }
    } else {
      const value = rowA[item.fieldName] ? rowA[item.fieldName] : ''
      return `<span>${value}</span>`
    }
  }

    // 实例状态
    sysApi.tools
    .getEnum('com.dstz.bpm.api.enums.InstanceStatus', true)
    .then(({ data }) => {
      info.instanceStatusOption = data
    })
    const getIstanceStatusTitle = (getIstanceStatus: any) => {
      let title = ''
      info.instanceStatusOption.forEach((item: any) => {
        if (getIstanceStatus == item.key) {
          title = item.value
        }
      })
      return title
    }

  // 匹配符合条件的背景色 字体颜色设置
  const showConditionCal = (element: any) => {
    if (!element.showCondition) return true
    try {
      return eval(element.showCondition)
    } catch (err) {
      console.error(
        `图表按钮展示脚本异常，将隐藏该按钮[ ${element.name} ]",脚本：[ ${element.showCondition} ]。参数如下：`
      )
      console.info(err)
    }
    return false
  }

  // 有提醒内容的按钮操作情况
  const hrefSettingSet = (btnItem: any, item: any) => {
    const url = btnItem.url
    if (btnItem.warnTxt && btnItem.warnTxt.length > 0) {
      ElMessageBox.confirm(btnItem.warnTxt, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 直接请求
          if (btnItem.hrefSetting.openType === 'directRequest') {
            requestFn(btnItem)
          }
          // 事件按钮
          if (btnItem.hrefSetting.openType === 'eventBtn') {
            changeDataFn(btnItem, item)
          }
          // 打开标签页/TAB页
          if (btnItem.hrefSetting.openType === 'tab') {
            proxy.$router.push(replaceStr(url, item))
          }
          // 打开top对话框
          if (btnItem.hrefSetting.openType === 'iframeDialog') {
            info.hrefSetting = extend(btnItem.hrefSetting, btnItem)
            info.dialogVisible = true
          }
          // 打开新页面
          if (btnItem.hrefSetting.openType === 'newPage') {
            // const routeData = proxy.$router.resolve({ path: btnItem.url })
            // window.open(routeData.href, '_blank')
            if (btnItem.url && btnItem.url.length > 0) {
              window.open(btnItem.url)
            }
          }
        })
        .catch(() => {})
    } else {
      // 直接请求
      if (btnItem.hrefSetting.openType === 'directRequest') {
        requestFn(btnItem)
      }
      // 事件按钮
      if (btnItem.hrefSetting.openType === 'eventBtn') {
        changeDataFn(btnItem, item)
      }
      // 打开标签页/TAB页
      if (btnItem.hrefSetting.openType === 'tab') {
        proxy.$router.push(replaceStr(url, item))
      }
      // 打开top对话框
      if (btnItem.hrefSetting.openType === 'iframeDialog') {
        info.hrefSetting = extend(btnItem.hrefSetting, btnItem)
        info.dialogVisible = true
      }
      // 打开新页面
      if (btnItem.hrefSetting.openType === 'newPage') {
        // const routeData = proxy.$router.resolve({ path: btnItem.url })
        // window.open(routeData.href, '_blank')
        if (btnItem.url && btnItem.url.length > 0) {
          window.open(btnItem.url)
        }
      }
    }
  }

  const compareStringsIgnoreCase = (str1: any, str2: any) => {
    // 去除特殊字符并转为小写
    const cleanStr1 = str1.replace(/[^\w]/g, '').toLowerCase()
    const cleanStr2 = str2.replace(/[^\w]/g, '').toLowerCase()

    // 使用正则表达式进行对比
    const regex = new RegExp(`^${cleanStr1}$`)
    return regex.test(cleanStr2)
  }

  // 截取特定字符串
  const replaceStr = (url: any, item: any) => {
    const a = /\${(.*?)\}/gi
    const c = url.match(a)
    const aURL = ''
    if (c) {
      for (let i = 0; i < c.length; i++) {
        let newKey
        for (const key in item) {
          if (compareStringsIgnoreCase(key, c[i].replace(a, '$1'))) {
            newKey = key
          }
        }
        url = url.replace(c[i], item[newKey])
        aURL = url
      }
      return aURL
    } else {
      aURL = url
      return aURL
    }
  }
  // 点击局部按钮
  const localclickFn = (btnItem: any, item: any) => {
    // 是否有提醒内容
    hrefSettingSet(btnItem, item)
  }

  // 点击全局按钮
  const clickFn = (item: any) => {
    // 是否必选
    if (item.mustSelect == 1) {
      // 单选判断是否选中
      if (info.data.chooseType == 1) {
        if (JSON.stringify(info.templateSelection) === '{}') {
          ElMessage({
            message: abT('page.common.pleaseSelectData','请选择数据'),
            type: 'warning',
          })
          return false
        }
      }
      // 多选判断是否选中
      if (info.data.chooseType == 2) {
        if (multipleSelection.value.length <= 0) {
          ElMessage({
            message: abT('page.common.pleaseSelectData','请选择数据'),
            type: 'warning',
          })
          return false
        }
      }
    }
    // 是否有提醒内容
    hrefSettingSet(item)
  }

  // 直接请求
  const requestFn = (item: any) => {
    getData(item.url, {}).then(({ msg }) => {
      if (item.successTxt.length > 0) {
        ElMessage({
          showClose: true,
          message: item.successTxt,
          type: 'success',
        })
      } else {
        ElMessage({
          showClose: true,
          message: msg,
          type: 'success',
        })
      }
    })
  }

  // 事件按钮请求
  const changeDataFn = (btnItem: any, item: any) => {
    postData(
      `${bizApi.custGrid.changeDataStatus}_${info.data.code}_${btnItem.alias}`,
      {
        id: item.id,
      }
    ).then(
      ({ msg }) => {
        if (btnItem.successTxt.length > 0) {
          ElMessage({
            showClose: true,
            message: btnItem.successTxt,
            type: 'success',
          })
          listFn()
        } else {
          ElMessage({
            showClose: true,
            message: msg,
            type: 'success',
          })
        }
      },
      () => {}
    )
  }

  const chooseCustDialog = (list: any, item: any) => {
    item.dialogConf.queryCustDialog = list
    item['val'] = list[0][item.dialogConf.value]
    item.dialogConf.showValueQuery = list[0][item.dialogConf.showValue]
  }

  const closeCustDialog = (queryItem: string, item: any) => {
    item.dialogConf.queryCustDialog.splice(
      item.dialogConf.queryCustDialog.indexOf(queryItem),
      1
    )
    item['val'] = ''
    item.dialogConf.showValueQuery = ''
  }

  const resetQueryDia = (row: any) => {
    row.dialogConf.queryCustDialog = []
    row['val'] = ''
    row.dialogConf.showValueQuery = ''
  }
  const dialogKeyFn = (item: any) => {
    let a = ''
    if (typeof item.formatConf == 'string') {
      try {
        const obj = JSON.parse(item.formatConf)
        if (typeof obj == 'object' && obj) {
          a = obj.dialogKey
        } else {
          a = obj
        }
      } catch (e) {
        a = item.formatConf
      }
    }
    return a
  }
  // 图片格式化list
  const handleSrcList = (item: any, row: any) => {
    const srcList = []
    if (row[item.fieldName]) {
      const list = JSON.parse(row[item.fieldName])
      if(list instanceof Array){
        list.forEach((aitem) => {
          if (aitem.id) {
            srcList.push(sysApi.sysFile.getViewFileUrl(aitem.id))
          }
        })
      }else{
        srcList.push(sysApi.sysFile.getViewFileUrl(String(list)))
      }
    }
    return srcList
  }
  // 图片
  const handleSrcUrl = (item: any, row: any) => {
    const srcList = []
    const srcUrl = ''
    if (row[item.fieldName]) {
      const list = JSON.parse(row[item.fieldName])
      if(list instanceof Array){
        list.forEach((aitem) => {
          if (aitem.id) {
            srcList.push(sysApi.sysFile.getViewFileUrl(aitem.id))
          }
        })
      }else{
        srcList.push(sysApi.sysFile.getViewFileUrl(String(list)))
      }
      if (srcList.length > 0) {
        srcUrl = srcList[0]
      }
    }
    return srcUrl
  }
  // 下载文件
  const downFileFn = (file: any) => {
    sysApi.sysFile.downloadFile(file.id).then((result) => {
      abTools.downImgFile(file.name, result)
    })
  }
  // 点选按钮再次点击取消选中
  const clickItemTag = (
    e: any,
    tag: any,
    item: any,
    list: any,
    params: any
  ) => {
    list.forEach((element: any, index: any) => {
      element.checked = false
    })
    item['val'] = ''
    if (e) {
      tag.checked = true
      item['val'] = params
    }
    listFn()
  }
  const searchObjName = () => {
    emit('searchObjName')
  }

  const getTable = () => {
    emit('extNameChange')
  }
  const fieldsListInit = (arr: any) => {
    emit('fieldsListInit', arr)
  }
  const isSomeType = (item: any, value: any) => {
    let val = null
    if (
      !item.formatType ||
      item.formatType == 'percent' ||
      item.formatType === 'picture' ||
      item.formatType === 'file' ||
      item.formatType === 'decimal' ||
      item.formatType === 'javascript' ||
      item.formatType === 'region' ||
      item.formatType === 'cascadeSelect' ||
      item.formatType === 'dialog'
    ) {
      val = value
    }
    if (item.formatType === 'json') {
      let a = ''
      if (item.formatConf && item.formatConf.length > 0) {
        const list = JSON.parse(item.formatConf)
        list.forEach((listItem: any) => {
          if (handleJson(item, value).indexOf(listItem.key) > -1) {
            a = listItem.key
          }
        })
      }
      val = a
    }
    if (item.formatType === 'date_picker') {
      val = handleTime(item, value)
    }
    if (item.formatType === 'dic') {
      val = handleField(item, value)
    }
    if (item.formatType === 'timestamp') {
      val = handleTimeStamp(item, value)
    }
    return val
  }
  // 获取背景颜色
  const addClass = ({ row, column }) => {
    let backgroundList = []
    let backgroundColor = ''
    let textColor = ''
    info.data.fieldsList.forEach((item: any) => {
      if (column.label == item.fieldDesc) {
        if (item.bgColorConfMap && item.bgColorConfMap.backgroundList) {
          backgroundList = item.bgColorConfMap.backgroundList
          if (backgroundList && backgroundList.length > 0) {
            backgroundList.forEach((itm: any) => {
              if (itm.condition == '==') {
                if (itm.value == isSomeType(item, row[item.fieldName])) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == '!==') {
                if (itm.value !== isSomeType(item, row[item.fieldName])) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == '<') {
                if (
                  Number(itm.value) >
                  Number(isSomeType(item, row[item.fieldName]))
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == '>') {
                if (
                  Number(itm.value) <
                  Number(isSomeType(item, row[item.fieldName]))
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              // 数字区间
              if (itm.condition == 'between') {
                if (
                  itm.minNumber <
                    Number(isSomeType(item, row[item.fieldName])) &&
                  itm.maxNumber > Number(isSomeType(item, row[item.fieldName]))
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              // 不在数字区间
              if (itm.condition == 'not between') {
                if (
                  itm.minNumber >
                    Number(isSomeType(item, row[item.fieldName])) ||
                  itm.maxNumber < Number(isSomeType(item, row[item.fieldName]))
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == 'null') {
                if (
                  !isSomeType(item, row[item.fieldName]) ||
                  isSomeType(item, row[item.fieldName]) == null ||
                  isSomeType(item, row[item.fieldName]).length <= 0
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == 'not null') {
                if (
                  isSomeType(item, row[item.fieldName]) &&
                  isSomeType(item, row[item.fieldName]).length > 0
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == 'contains') {
                if (
                  String(isSomeType(item, row[item.fieldName])).indexOf(
                    itm.value
                  ) !== -1
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == 'not contains') {
                if (
                  String(isSomeType(item, row[item.fieldName])).indexOf(
                    itm.value
                  ) < 0
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == 'in') {
                if (
                  String(isSomeType(item, row[item.fieldName])).indexOf(
                    itm.value
                  ) !== -1
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == 'not in') {
                if (
                  String(isSomeType(item, row[item.fieldName])).indexOf(
                    itm.value
                  ) < 0
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
            })
          }
        }
      }
    })
    return {
      color: textColor,
      background: backgroundColor,
    }
  }
  // 设置行背景色
  const setRowBackgroundColor = (row: any, index: any) => {
    // 自定义方法，根据行数据设置背景色
    const rowItem = row.row
    let obj
    if (
      info.data.extendConf &&
      JSON.parse(info.data.extendConf).hbackgroundList &&
      JSON.parse(info.data.extendConf).hbackgroundList.length > 0
    ) {
      JSON.parse(info.data.extendConf).hbackgroundList.forEach((item: any) => {
        let a
        info.data.fieldsList.forEach((fieldsItem: any) => {
          if (fieldsItem.fieldName == item.fieldsValue) {
            a = fieldsItem
          }
        })
        if (item.condition == '==') {
          if (isSomeType(a, rowItem[item.fieldsValue]) == item.value) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == '!==') {
          if (isSomeType(a, rowItem[item.fieldsValue]) !== item.value) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == '<') {
          if (
            Number(item.value) >
            Number(isSomeType(a, rowItem[item.fieldsValue]))
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == '>') {
          if (
            Number(item.value) <
            Number(isSomeType(a, rowItem[item.fieldsValue]))
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        // 数字区间
        if (item.condition == 'between') {
          if (
            item.minNumber < Number(isSomeType(a, rowItem[item.fieldsValue])) &&
            item.maxNumber > Number(isSomeType(a, rowItem[item.fieldsValue]))
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        // 不在数字区间
        if (item.condition == 'not between') {
          if (
            item.minNumber > Number(isSomeType(a, rowItem[item.fieldsValue])) ||
            item.maxNumber < Number(isSomeType(a, rowItem[item.fieldsValue]))
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == 'null') {
          if (
            !isSomeType(a, rowItem[item.fieldsValue]) ||
            isSomeType(a, rowItem[item.fieldsValue]) == null ||
            isSomeType(a, rowItem[item.fieldsValue]).length <= 0
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == 'not null') {
          if (
            isSomeType(a, rowItem[item.fieldsValue]) &&
            isSomeType(a, rowItem[item.fieldsValue]).length > 0
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == 'contains') {
          if (
            String(isSomeType(a, rowItem[item.fieldsValue])).indexOf(
              item.value
            ) !== -1
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == 'not contains') {
          if (
            String(isSomeType(a, rowItem[item.fieldsValue])).indexOf(
              item.value
            ) < 0
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == 'in') {
          if (
            String(isSomeType(a, rowItem[item.fieldsValue])).indexOf(
              item.value
            ) !== -1
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == 'not in') {
          if (
            String(isSomeType(a, rowItem[item.fieldsValue])).indexOf(
              item.value
            ) < 0
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
      })
    }

    return obj
  }

  // 应用广场 关联表单
  const setForm = (data:any) => {
    alert(1)
    emit('setForm',data)
  }

  defineExpose({
    setActiveNameBasic,
    setForm
  })
</script>
<style lang="scss">
  .moduleChoose {
    padding: 20px 0;
    text-align: center;
    cursor: pointer;
  }
  .tabsStyle {
    .el-tabs__nav {
      // transform: translateX(128px) !important;
    }
    .el-tabs__header {
      margin: 0;
    }
  }
  .cardBodyStyle {
    .el-card__body {
      padding: 8px !important;
    }
  }

  .modulesactive {
    .el-card__body {
      position: relative;
      box-sizing: border-box;
      padding: 8px !important;
      border: 1px dashed #1890ff;
      .customize-overlay {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 9;
        display: flex;
        // flex-direction: column;
        align-items: flex-start;
        justify-content: right;
        background: rgba(148, 146, 146, 0.2);
        label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 7px 20px;
          margin-top: 8px;
          margin-right: 4px;
          font-size: 12px;
          color: #fff;
          background: var(--el-color-primary);
          border-radius: 40px;
        }
      }
    }
  }
  .formLableStyleQuery .el-form-item__label {
    align-items: center;
    padding: 2px 10px 0 0;
    font-size: 14px;
    line-height: 14px;
  }
  .imageWidthAuto .el-image {
    width: auto !important;
  }
  .tagStyle {
    margin-right: 14px;
  }
  .numberInput {
    width: 88px !important;
    .el-input__wrapper {
      padding-right: 32px !important;
      padding-left: 0 !important;
    }
  }
  .demo-form-inline{
    margin-top:0 !important;
  }
  @import '../styles/simple.scss';
</style>
