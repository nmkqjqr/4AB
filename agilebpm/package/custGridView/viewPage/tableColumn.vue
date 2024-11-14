<template>
  <!-- 是否支持多选 -->
  <el-table-column
    v-if="info.data.chooseType === 2"
    :reserve-selection="true"
    type="selection"
    width="55"
  />
  <!-- 是否显示序号 -->
  <el-table-column
    v-if="info.data.showRowsNum === 1"
    align="center"
    fixed="left"
    :label="$abT('page.common.dictSort', '序号')"
    type="index"
    width="80px"
  />
  <!-- 是否显示当前审批节点 -->
  <el-table-column
    v-if="props.query.appQueryType == 'todoTask'"
    align="center"
    :label="$abT('page.common.currentApprovalNode', '当前审批节点')"
    prop="abTaskName"
    width="140"
  >
    <template #default="scope">
      <el-tag
        v-if="
          scope.row.abTaskName == '启动' ||
          scope.row.ABTASKNAME == '启动' ||
          scope.row.abtaskname == '启动'
        "
        type="success"
      >
        {{
          scope.row.abTaskName || scope.row.ABTASKNAME || scope.row.abtaskname
        }}
      </el-tag>
      <el-tag v-else>
        {{
          scope.row.abTaskName || scope.row.ABTASKNAME || scope.row.abtaskname
        }}
      </el-tag>
    </template>
  </el-table-column>
  <!-- 是否显示实例状态 -->
  <el-table-column
    v-if="props.query.appQueryType == 'approve'"
    align="center"
    :label="$abT('bpm.office.instanceStatus', '实例状态')"
    prop="instanceStatus"
    width="120"
  >
    <template #default="scope">
      <el-tag
        v-if="
          getIstanceStatusTitle(
            scope.row.instanceStatus ||
              scope.row.INSTANCESTATUS ||
              scope.row.instancestatus
          ) == '运行中'
        "
      >
        {{
          getIstanceStatusTitle(
            scope.row.instanceStatus ||
              scope.row.INSTANCESTATUS ||
              scope.row.instancestatus
          )
        }}
      </el-tag>
      <el-tag
        v-else-if="
          getIstanceStatusTitle(
            scope.row.instanceStatus ||
              scope.row.INSTANCESTATUS ||
              scope.row.instancestatus
          ) == '人工终止'
        "
        type="danger"
      >
        {{
          getIstanceStatusTitle(
            scope.row.instanceStatus ||
              scope.row.INSTANCESTATUS ||
              scope.row.instancestatus
          )
        }}
      </el-tag>
      <el-tag v-else type="success">
        {{
          getIstanceStatusTitle(
            scope.row.instanceStatus ||
              scope.row.INSTANCESTATUS ||
              scope.row.instancestatus
          )
        }}
      </el-tag>
    </template>
  </el-table-column>
  <!-- 是否显示抄送状态 -->
  <el-table-column
    v-if="props.query.appQueryType == 'receive'"
    align="center"
    :label="$abT('page.common.ccStatus', '抄送状态')"
    prop="receiveStatus"
    width="120"
  >
    <template #default="scope">
      <el-tag
        v-if="
          getReceiveTitle(
            scope.row.receiveStatus ||
              scope.row.RECEIVESTATUS ||
              scope.row.receivestatus
          ) == '已读'
        "
        type="success"
      >
        {{
          getReceiveTitle(
            scope.row.receiveStatus ||
              scope.row.RECEIVESTATUS ||
              scope.row.receivestatus
          )
        }}
      </el-tag>
      <el-tag
        v-else-if="
          getReceiveTitle(
            scope.row.receiveStatus ||
              scope.row.RECEIVESTATUS ||
              scope.row.receivestatus
          ) == '未读'
        "
      >
        {{
          getReceiveTitle(
            scope.row.receiveStatus ||
              scope.row.RECEIVESTATUS ||
              scope.row.receivestatus
          )
        }}
      </el-tag>
      <el-tag v-else>
        {{
          getReceiveTitle(
            scope.row.receiveStatus ||
              scope.row.RECEIVESTATUS ||
              scope.row.receivestatus
          )
        }}
      </el-tag>
    </template>
  </el-table-column>
  <!-- 是否显示实例状态 -->
  <el-table-column
    v-if="props.query.appQueryType == 'applyTask'"
    align="center"
    :label="$abT('bpm.office.instanceStatus', '实例状态')"
    prop="instanceStatus"
    width="120"
  >
    <template #default="scope">
      <el-tag
        v-if="
          getIstanceStatusTitle(
            scope.row.instanceStatus ||
              scope.row.INSTANCESTATUS ||
              scope.row.instancestatus
          ) == '运行中'
        "
      >
        {{
          getIstanceStatusTitle(
            scope.row.instanceStatus ||
              scope.row.INSTANCESTATUS ||
              scope.row.instancestatus
          )
        }}
      </el-tag>
      <el-tag
        v-else-if="
          getIstanceStatusTitle(
            scope.row.instanceStatus ||
              scope.row.INSTANCESTATUS ||
              scope.row.instancestatus
          ) == '人工终止'
        "
        type="danger"
      >
        {{
          getIstanceStatusTitle(
            scope.row.instanceStatus ||
              scope.row.INSTANCESTATUS ||
              scope.row.instancestatus
          )
        }}
      </el-tag>
      <el-tag v-else type="success">
        {{
          getIstanceStatusTitle(
            scope.row.instanceStatus ||
              scope.row.INSTANCESTATUS ||
              scope.row.instancestatus
          )
        }}
      </el-tag>
    </template>
  </el-table-column>
  <template v-for="item in props.fieldsList" :key="item.fieldDesc">
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
        item.additionConfMap.isFix ? item.additionConfMap.isFix == 1 : false
      "
      :label="item.fieldDesc"
      :min-width="
        item.additionConfMap.miniListWidth
          ? item.additionConfMap.miniListWidth
          : ''
      "
      :prop="item.fieldName"
      :show-overflow-tooltip="true"
      :sortable="item.sortAble === 1"
      :width="
        item.additionConfMap.listWidth ? item.additionConfMap.listWidth : ''
      "
    >
      <template #default="scope">
        <template
          v-if="
            abUtil.compareStrings(
              item.fieldName,
              'abInstValMapLoader_abTaskUserJson'
            )
          "
        >
          <el-popover placement="left" trigger="hover" :width="400">
            <template #reference>
              <el-button
                style="text-decoration: underline; text-underline-offset: 3px"
                text
                type="primary"
              >
                {{
                  abUtil.getPropertyIgnoreCase(scope.row, item.fieldName)[0]
                    ? abUtil.getPropertyIgnoreCase(scope.row, item.fieldName)[0]
                        .nodeName
                    : ''
                }}
              </el-button>
            </template>
            <el-table
              :data="abUtil.getPropertyIgnoreCase(scope.row, item.fieldName)"
            >
              <el-table-column :label="$abT('bpm.office.currentNode','当前环节')" property="nodeName" />
              <el-table-column :label="$abT('bpm.office.candidate','候选人')" property="assignNames" />
            </el-table>
          </el-popover>
        </template>
        <template v-else-if="item.fieldName == 'instanceStatus'">
          <el-tag
            v-if="
              getIstanceStatusTitle(
                abUtil.getPropertyIgnoreCase(scope.row, item.fieldName)
              ) == '运行中'
            "
          >
            {{
              getIstanceStatusTitle(
                abUtil.getPropertyIgnoreCase(scope.row, item.fieldName)
              )
            }}
          </el-tag>
          <el-tag
            v-else-if="
              getIstanceStatusTitle(
                abUtil.getPropertyIgnoreCase(scope.row, item.fieldName)
              ) == '人工终止'
            "
            type="danger"
          >
            {{
              getIstanceStatusTitle(
                abUtil.getPropertyIgnoreCase(scope.row, item.fieldName)
              )
            }}
          </el-tag>
          <el-tag v-else type="success">
            {{
              getIstanceStatusTitle(
                abUtil.getPropertyIgnoreCase(scope.row, item.fieldName)
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
            <span v-if="item.cssConfList && item.cssConfList.length > 0">
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
            </span>
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
              <el-progress
                class="progressStyle"
                :percentage="scope.row[item.fieldName]"
              />
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
              <span v-if="item.cssConfList && item.cssConfList.length > 0">
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
              </span>
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
              <span v-if="item.cssConfList && item.cssConfList.length > 0">
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
              </span>
              <span v-else>
                {{ handleTime(item, scope.row[item.fieldName]) }}
              </span>
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
              <span v-if="item.cssConfList && item.cssConfList.length > 0">
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
              <span v-if="item.cssConfList && item.cssConfList.length > 0">
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
              </span>
              <span v-else>
                {{ handelNumber(item, scope.row[item.fieldName]) }}
              </span>
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
            <span v-html="handleJson(item, scope.row[item.fieldName])"></span>
          </span>
          <!-- js-->
          <span
            v-if="item.formatType === 'javascript'"
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
            <span v-html="handleJs(item, scope.row, scope.$index)"></span>
          </span>
          <!-- dialog-->
          <span
            v-if="item.formatType === 'dialog'"
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
            <span>{{ scope.row[item.fieldName] }}</span>
          </span>
          <span
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
            <span class="demo-image__preview imageWidthAuto">
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
            </span>
          </span>
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
              <span
                v-for="(fileItem, fileIndex) in JSON.parse(
                  scope.row[item.fieldName]
                )"
                :key="fileIndex"
              >
                <el-tag style="cursor: pointer" @click="downFileFn(fileItem)">
                  {{ fileItem.name }}
                </el-tag>
              </span>
            </template>
          </span>
          <!-- region 区域格式化 cascadeSelect 级联格式化-->
          <span
            v-if="
              item.formatType === 'region' ||
              item.formatType === 'cascadeSelect'
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
            <span>{{ scope.row[item.fieldName] }}</span>
          </span>
        </template>
      </template>
    </el-table-column>
  </template>
  <!-- 是否固定操作栏 -->
  <el-table-column
    v-if="
      props.linButton && props.linButton.length > 0 && info.data.fixTool === 1
    "
    align="left"
    fixed="right"
    :label="$abT('page.common.operate', '操作')"
    prop="key"
    :width="info.data.operationWidth"
  >
    <template #default="scope">
      <template v-for="btnItem in props.linButton" :key="btnItem.id">
        <span v-if="info.data.gridType === 'app'">
          <template
            v-if="
              info.username == 'admin' ||
              btnItem.joinBtnRight == 0 ||
              fullPathUrl.indexOf('formCustSqlPreView') > -1
            "
          >
            <template
              v-if="
                btnItem.hrefSetting.openType == 'eventBtn' &&
                btnItem.hrefSetting.isDialogValue &&
                btnItem.hrefSetting.codeValue &&
                btnItem.hrefSetting.codeValue.length > 0
              "
            >
              <ab-cust-dialog
                v-if="evalFn(btnItem.exp, scope.row)"
                :dialog-key="btnItem.hrefSetting.codeValue"
                :dialog-setting="{ multiple: false }"
                text
                type="primary"
                @ok="chooseDialog($event, btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </ab-cust-dialog>
            </template>
            <template
              v-else-if="
                btnItem.hrefSetting.openType &&
                btnItem.hrefSetting.openType == 'abComponent'
              "
            >
              <template
                v-if="
                  btnItem.hrefSetting.abComponentName &&
                  btnItem.hrefSetting.abComponentName.length > 0
                "
              >
                <component
                  :is="btnItem.hrefSetting.abComponentName"
                  :data="btnItem"
                  :list="info.list"
                  @list-fn="queryListFn"
                />
              </template>
            </template>
            <template v-else>
              <el-button
                v-if="
                  evalFn(btnItem.exp, scope.row) &&
                  btnItem.expand &&
                  btnItem.expand.appQueryType == props.query.appQueryType
                "
                text
                :type="btnItem.btncss"
                @click.stop="localclickFn(btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </el-button>
            </template>
          </template>
          <template v-else>
            <template
              v-if="
                btnItem.hrefSetting.openType == 'eventBtn' &&
                btnItem.hrefSetting.isDialogValue &&
                btnItem.hrefSetting.codeValue &&
                btnItem.hrefSetting.codeValue.length > 0
              "
            >
              <ab-cust-dialog
                v-if="evalFn(btnItem.exp, scope.row)"
                v-ab-btn-rights="btnItem.alias"
                :dialog-key="btnItem.hrefSetting.codeValue"
                :dialog-setting="{ multiple: false }"
                text
                type="primary"
                @ok="chooseDialog($event, btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </ab-cust-dialog>
            </template>
            <template
              v-else-if="
                btnItem.hrefSetting.openType &&
                btnItem.hrefSetting.openType == 'abComponent'
              "
            >
              <template
                v-if="
                  btnItem.hrefSetting.abComponentName &&
                  btnItem.hrefSetting.abComponentName.length > 0
                "
              >
                <component
                  :is="btnItem.hrefSetting.abComponentName"
                  :data="btnItem"
                  :list="info.list"
                  @list-fn="queryListFn"
                />
              </template>
            </template>
            <template v-else>
              <el-button
                v-if="
                  evalFn(btnItem.exp, scope.row) &&
                  btnItem.expand &&
                  btnItem.expand.appQueryType == props.query.appQueryType
                "
                v-ab-btn-rights="btnItem.alias"
                text
                :type="btnItem.btncss"
                @click.stop="localclickFn(btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </el-button>
            </template>
          </template>
        </span>
        <span v-else>
          <template
            v-if="
              info.username == 'admin' ||
              btnItem.joinBtnRight == 0 ||
              fullPathUrl.indexOf('formCustSqlPreView') > -1
            "
          >
            <template
              v-if="
                btnItem.hrefSetting.openType == 'eventBtn' &&
                btnItem.hrefSetting.isDialogValue &&
                btnItem.hrefSetting.codeValue &&
                btnItem.hrefSetting.codeValue.length > 0
              "
            >
              <ab-cust-dialog
                v-if="evalFn(btnItem.exp, scope.row)"
                :dialog-key="btnItem.hrefSetting.codeValue"
                :dialog-setting="{ multiple: false }"
                text
                type="primary"
                @ok="chooseDialog($event, btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </ab-cust-dialog>
            </template>
            <template
              v-else-if="
                btnItem.hrefSetting.openType &&
                btnItem.hrefSetting.openType == 'abComponent'
              "
            >
              <template
                v-if="
                  btnItem.hrefSetting.abComponentName &&
                  btnItem.hrefSetting.abComponentName.length > 0
                "
              >
                <component
                  :is="btnItem.hrefSetting.abComponentName"
                  :data="btnItem"
                  :list="info.list"
                  @list-fn="queryListFn"
                />
              </template>
            </template>
            <template v-else>
              <el-button
                v-if="evalFn(btnItem.exp, scope.row)"
                text
                :type="btnItem.btncss"
                @click.stop="localclickFn(btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </el-button>
            </template>
          </template>
          <template v-else>
            <template
              v-if="
                btnItem.hrefSetting.openType == 'eventBtn' &&
                btnItem.hrefSetting.isDialogValue &&
                btnItem.hrefSetting.codeValue &&
                btnItem.hrefSetting.codeValue.length > 0
              "
            >
              <ab-cust-dialog
                v-if="evalFn(btnItem.exp, scope.row)"
                v-ab-btn-rights="btnItem.alias"
                :dialog-key="btnItem.hrefSetting.codeValue"
                :dialog-setting="{ multiple: false }"
                text
                type="primary"
                @ok="chooseDialog($event, btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </ab-cust-dialog>
            </template>
            <template
              v-else-if="
                btnItem.hrefSetting.openType &&
                btnItem.hrefSetting.openType == 'abComponent'
              "
            >
              <template
                v-if="
                  btnItem.hrefSetting.abComponentName &&
                  btnItem.hrefSetting.abComponentName.length > 0
                "
              >
                <component
                  :is="btnItem.hrefSetting.abComponentName"
                  :data="btnItem"
                  :list="info.list"
                  @list-fn="queryListFn"
                />
              </template>
            </template>
            <template v-else>
              <el-button
                v-if="evalFn(btnItem.exp, scope.row)"
                v-ab-btn-rights="btnItem.alias"
                text
                :type="btnItem.btncss"
                @click.stop="localclickFn(btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </el-button>
            </template>
          </template>
        </span>
      </template>
    </template>
  </el-table-column>
  <el-table-column
    v-if="
      props.linButton && props.linButton.length > 0 && info.data.fixTool === 0
    "
    align="left"
    :label="$abT('page.common.operate', '操作')"
    prop="key"
    :width="info.data.operationWidth"
  >
    <template #default="scope">
      <template v-for="btnItem in props.linButton" :key="btnItem.id">
        <span v-if="info.data.gridType === 'app'">
          <template
            v-if="
              info.username == 'admin' ||
              btnItem.joinBtnRight == 0 ||
              fullPathUrl.indexOf('formCustSqlPreView') > -1
            "
          >
            <template
              v-if="
                btnItem.hrefSetting.openType == 'eventBtn' &&
                btnItem.hrefSetting.isDialogValue &&
                btnItem.hrefSetting.codeValue &&
                btnItem.hrefSetting.codeValue.length > 0
              "
            >
              <ab-cust-dialog
                v-if="evalFn(btnItem.exp, scope.row)"
                :dialog-key="btnItem.hrefSetting.codeValue"
                :dialog-setting="{ multiple: false }"
                text
                type="primary"
                @ok="chooseDialog($event, btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </ab-cust-dialog>
            </template>
            <template v-else>
              <el-button
                v-if="
                  evalFn(btnItem.exp, scope.row) &&
                  btnItem.expand &&
                  btnItem.expand.appQueryType == props.query.appQueryType
                "
                text
                :type="btnItem.btncss"
                @click.stop="localclickFn(btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </el-button>
            </template>
          </template>
          <template v-else>
            <template
              v-if="
                btnItem.hrefSetting.openType == 'eventBtn' &&
                btnItem.hrefSetting.isDialogValue &&
                btnItem.hrefSetting.codeValue &&
                btnItem.hrefSetting.codeValue.length > 0
              "
            >
              <ab-cust-dialog
                v-if="evalFn(btnItem.exp, scope.row)"
                v-ab-btn-rights="btnItem.alias"
                :dialog-key="btnItem.hrefSetting.codeValue"
                :dialog-setting="{ multiple: false }"
                text
                type="primary"
                @ok="chooseDialog($event, btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </ab-cust-dialog>
            </template>
            <template v-else>
              <el-button
                v-if="
                  evalFn(btnItem.exp, scope.row) &&
                  btnItem.expand &&
                  btnItem.expand.appQueryType == props.query.appQueryType
                "
                v-ab-btn-rights="btnItem.alias"
                text
                :type="btnItem.btncss"
                @click.stop="localclickFn(btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </el-button>
            </template>
          </template>
        </span>
        <span v-else>
          <template
            v-if="
              info.username == 'admin' ||
              btnItem.joinBtnRight == 0 ||
              fullPathUrl.indexOf('formCustSqlPreView') > -1
            "
          >
            <template
              v-if="
                btnItem.hrefSetting.openType == 'eventBtn' &&
                btnItem.hrefSetting.isDialogValue &&
                btnItem.hrefSetting.codeValue &&
                btnItem.hrefSetting.codeValue.length > 0
              "
            >
              <ab-cust-dialog
                v-if="evalFn(btnItem.exp, scope.row)"
                :dialog-key="btnItem.hrefSetting.codeValue"
                :dialog-setting="{ multiple: false }"
                text
                type="primary"
                @ok="chooseDialog($event, btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </ab-cust-dialog>
            </template>
            <template v-else>
              <el-button
                v-if="evalFn(btnItem.exp, scope.row)"
                text
                :type="btnItem.btncss"
                @click.stop="localclickFn(btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </el-button>
            </template>
          </template>
          <template v-else>
            <template
              v-if="
                btnItem.hrefSetting.openType == 'eventBtn' &&
                btnItem.hrefSetting.isDialogValue &&
                btnItem.hrefSetting.codeValue &&
                btnItem.hrefSetting.codeValue.length > 0
              "
            >
              <ab-cust-dialog
                v-if="evalFn(btnItem.exp, scope.row)"
                v-ab-btn-rights="btnItem.alias"
                :dialog-key="btnItem.hrefSetting.codeValue"
                :dialog-setting="{ multiple: false }"
                text
                type="primary"
                @ok="chooseDialog($event, btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </ab-cust-dialog>
            </template>
            <template v-else>
              <el-button
                v-if="evalFn(btnItem.exp, scope.row)"
                v-ab-btn-rights="btnItem.alias"
                text
                :type="btnItem.btncss"
                @click.stop="localclickFn(btnItem, scope.row)"
              >
                {{ btnItem.name }}
              </el-button>
            </template>
          </template>
        </span>
      </template>
    </template>
  </el-table-column>
</template>
<script lang="ts" setup>
  import * as abFormat from '~/agilebpm/utils/ab-format'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  import { bizApi, postData, sysApi } from '~/agilebpm/api'
  import useAbStoreAdapter from '../../../api/ab-store'
  const abUser = useAbStoreAdapter().getAbUser
  const abCurrentOrg = useAbStoreAdapter().getCurrentOrg
  const { proxy } = abTools.useCurrentInstance()
  const fullPathUrl = proxy.$route.fullPath
  import { abT } from '@/i18n'
  const emit = defineEmits([
    'topDialog',
    'typeDrawer',
    'hrefSettingSetFn',
    'listFn',
  ])
  const props = defineProps({
    data: { required: true, type: Object }, // 赋值目标对象
    list: { required: true, type: Object }, // 赋值目标对象
    query: { type: Object },
    fieldsList: { type: Object },
    linButton: { type: Object },
  })
  const info: any = reactive({
    data: props.data,
    list: props.list,
    instanceStatusOption: [],
    receiveStatusOption: [],
    username: abUser.username,
    dictObj: [],
  })
  // 如果是dic 那么请求接口获取
  props.fieldsList.forEach((item: any) => {
    if (item.formatType == 'dic') {
      if (typeof item.formatConf == 'string') {
        item.formatConf = JSON.parse(item.formatConf)
      }
      sysApi.dict.getDictTreeByCodeNoRoot(item.formatConf.code).then((data) => {
        info.dictObj.push({
          code: item.formatConf.code,
          dictList: data,
        })
      })
    }
  })
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
  // 抄送状态
  sysApi.tools
    .getEnum('com.dstz.bpm.api.enums.CarbonCopyStatus', true)
    .then(({ data }) => {
      info.receiveStatusOption = data
    })
  const getReceiveTitle = (receive: any) => {
    let title = ''
    info.receiveStatusOption.forEach((item: any) => {
      if (receive == item.key) {
        title = item.name
      }
    })
    return title
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
          emit('topDialog', item, row)
        }
      }
      if (item.hrefConfMap.openType == 'newPage') {
        if (item.hrefConfMap.url && item.hrefConfMap.url.length > 0) {
          window.open(replaceStr(item.hrefConfMap.url, row))
        }
      }
      if (item.hrefConfMap.openType == 'drawer') {
        emit('typeDrawer', item, row, item.hrefConfMap.openDrawerOrDialog)
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
    if (typeof value == 'number') {
      value = String(value)
    }
    if (typeof item.formatConf == 'string' && item.formatConf.length > 0) {
      formatConf = JSON.parse(item.formatConf)
    }
    if (typeof item.formatConf == 'object') {
      formatConf = item.formatConf
    }

    info.dictObj.forEach((rowItem: any) => {
      if (rowItem.code == formatConf.code) {
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

  const checkDateTime = (str: any) => {
    if (isNaN(str) && !isNaN(Date.parse(str))) {
      return true
    } else {
      return false
    }
  }

  const handleTimeStamp = (item: any, value: any) => {
    let _value
    if (value || value.length > 0) {
      _value =
        formatToDate(value, JSON.parse(item.formatConf).timeType) ||
        formatToDate(Number(value), JSON.parse(item.formatConf).timeType)
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

  const formatToDate = (timeStamp: any, timeType: any) => {
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
      result =
        timeType == 'yyyy'
          ? `${y}`
          : timeType == 'yyyy-MM'
          ? `${y}-${add0(m)}`
          : timeType == 'YYYY-MM-DD HH:mm:ss'
          ? `${y}-${add0(m)}-${add0(d)} ${add0(h)}:${add0(mm)}:${add0(s)}`
          : `${y}-${add0(m)}-${add0(s)}`
    }
    return result
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

  const getNowTime = () => {
    const myDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
    // const time = myDate.toJSON().split('T').join(' ').substr(0, 19) 年月日时分秒
    const time = myDate.toJSON().split('T')[0]
    return time
  }

  const evalFn = (str: any, item: any) => {
    if (str == true) {
      return true
    } else if (str == false) {
      return false
    } else {
      if (str.indexOf('${currentDateTime}') !== -1) {
        str = str.replace('${currentDateTime}', getNowTime())
      }
      if (str.indexOf('${currentUserId}') !== -1) {
        str = str.replace('${currentUserId}', abUser.userId)
      }
      if (str.indexOf('${currentUserAccount}') !== -1) {
        str = str.replace('${currentUserAccount}', abUser.username)
      }
      if (str.indexOf('${currentUserName}') !== -1) {
        str = str.replace('${currentUserName}', abUser.fullName)
      }
      if (str.indexOf('${currentOrgId}') !== -1) {
        str = str.replace('${currentOrgId}', abCurrentOrg.groupId)
      }
      if (str.indexOf('${currentOrgName}') !== -1) {
        str = str.replace('${currentOrgName}', abCurrentOrg.groupName)
      }
      if (str.indexOf('${currentOrgCode}') !== -1) {
        str = str.replace('${currentOrgCode}', abCurrentOrg.groupCode)
      }

      const strY = str.replace(/==/g, '$rel==').replace(/\s+/g, '')
      // 使用正则表达式找到 == 后面直到空格或字符串结束的部分，并加上双引号
      const result = strY.replace(/==([\w]+)\s*|\s*==([\w]+)/g, '=="$1"$2')
      try {
        return eval(`${result}`)
      } catch (error) {
        console.log('功能按钮设置有误')
        return false
      }
    }
  }

  // 点击局部按钮
  const localclickFn = (btnItem: any, item: any) => {
    // 是否有提醒内容
    emit('hrefSettingSetFn', btnItem, item)
  }

  const queryListFn = () => {
    emit('listFn')
  }
  // 点击操作对话框
  const chooseDialog = (list: any, item: any, row: any) => {
    if (item.hrefSetting.dialogList && item.hrefSetting.dialogList.length > 0) {
      item.hrefSetting.dialogList.forEach((dialogItem: any) => {
        dialogItem.value = list[0][dialogItem.value2] || dialogItem.value2
      })
      let data = {}
      data = {
        refreshFieldList: item.hrefSetting.dialogList,
        buttonAliasStr: item.alias,
        ids: row[item.hrefSetting.dataChangeRelWatchField],
      }
      // 新配置 值增强
      postData(
        `${bizApi.custGrid.changeDataStatus}/${info.data.code}`,
        data
      ).then(({ data, msg }) => {
        if (data) {
          ElMessage({
            showClose: true,
            message: msg,
            type: 'success',
          })
          emit('listFn')
        } else {
          ElMessage({
            showClose: true,
            message: abT('page.common.operateFailed','操作失败'),
            type: 'error',
          })
        }
      })
    }
  }

  // 图片格式化list
  const handleSrcList = (item: any, row: any) => {
    const srcList = []
    if (row[item.fieldName]) {
      const list = row[item.fieldName]
      if (list instanceof Array) {
        list.forEach((aitem) => {
          if (aitem.id) {
            srcList.push(sysApi.sysFile.getViewFileUrl(aitem.id))
          }
        })
      } else {
        if (JSON.parse(list) && JSON.parse(list).length > 0) {
          JSON.parse(list).forEach((it: any) => {
            srcList.push(sysApi.sysFile.getViewFileUrl(it.id))
          })
        } else {
          srcList.push(sysApi.sysFile.getViewFileUrl(String(list)))
        }
      }
    }
    return srcList
  }
  // 图片
  const handleSrcUrl = (item: any, row: any) => {
    const srcList = []
    let srcUrl = ''
    if (row[item.fieldName]) {
      const list = row[item.fieldName]
      if (list instanceof Array) {
        list.forEach((aitem) => {
          if (aitem.id) {
            srcList.push(sysApi.sysFile.getViewFileUrl(aitem.id))
          }
        })
      } else {
        if (JSON.parse(list) && JSON.parse(list)[0] && JSON.parse(list)[0].id) {
          srcList.push(sysApi.sysFile.getViewFileUrl(JSON.parse(list)[0].id))
        } else {
          srcList.push(sysApi.sysFile.getViewFileUrl(String(list)))
        }
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

  defineExpose({
    handleTime,
    handleField,
    handelNumber,
    handleJson,
    handleTimeStamp,
  })
</script>
<style lang="scss" scoped>
  .demo-image__error .image-slot {
    font-size: 30px;
  }
  .demo-image__error .image-slot .el-icon {
    font-size: 30px;
  }
  .demo-image__error .el-image {
    width: 100%;
    height: 200px;
  }
  :deep(.imageWidthAuto .el-image) {
    width: auto !important;
  }
  :deep(.progressStyle .el-progress__text) {
    color: inherit;
  }
</style>
