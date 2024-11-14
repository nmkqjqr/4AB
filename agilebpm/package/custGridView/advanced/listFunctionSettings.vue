<template>
  <div>
    <div style="overflow: hidden">
      <!-- <el-button
        class="mt-4"
        size="small"
        style="float: left; margin-bottom: 12px"
        type="primary"
        @click="onAddItem()"
      >
        添加 +
      </el-button> -->
      <div
        v-if="info.data.relatedId.length > 0"
        class="btnBox"
        style="float: right; padding-top: 0 !important; margin-bottom: 12px"
      >
        <span>常用按钮快捷添加：</span>
        <el-button
          size="small"
          style="margin-right: 8px"
          type="primary"
          @click="addDefault"
        >
          默认新增
        </el-button>
        <el-button
          size="small"
          style="margin-right: 8px"
          type="primary"
          @click="add"
        >
          {{ info.data.gridType === 'app' ? '发起流程' : '新增' }}
        </el-button>
        <el-button
          size="small"
          style="margin-right: 8px"
          type="danger"
          @click="batchDel"
        >
          批量删除
        </el-button>
        <ab-cust-dialog
          v-if="info.data.gridType === 'list'"
          dialog-key="lcdycx"
          size="small"
          style="display: inline-block; margin-right: 8px"
          type="primary"
          @ok="initiateProcess"
        >
          发起流程
        </ab-cust-dialog>
        <el-button
          size="small"
          style="margin-right: 8px"
          type="primary"
          @click="tableImport"
        >
          导入
        </el-button>
        <el-button
          size="small"
          style="margin-right: 8px"
          type="primary"
          @click="tableExport"
        >
          导出
        </el-button>
        <el-button
          size="small"
          style="margin-right: 8px"
          type="warning"
          @click="del"
        >
          删除
        </el-button>
        <el-button
          size="small"
          style="margin-right: 8px"
          type="success"
          @click="edit"
        >
          编辑
        </el-button>
        <el-button
          size="small"
          style="margin-right: 8px"
          type="primary"
          @click="detail"
        >
          详情
        </el-button>

        <el-button
          size="small"
          style="margin-right: 8px"
          type="warning"
          @click="statusOpen"
        >
          启用
        </el-button>
        <el-button size="small" type="danger" @click="disable">禁用</el-button>
      </div>
      <div
        v-else
        class="btnBox"
        style="float: right; padding-top: 0 !important; margin-bottom: 12px"
      >
        <span>常用按钮快捷添加：</span>
        <el-button
          size="small"
          style="margin-right: 8px"
          type="primary"
          @click="addDefault"
        >
          默认新增
        </el-button>
      </div>
    </div>

    <el-table
      class="sqlButtonListTable"
      :data="info.data.sqlButtonVO"
      height="280"
      row-key="id"
      style="margin-bottom: 50px"
    >
      <el-table-column align="center" label="序号" type="index" width="60" />
      <el-table-column align="center" label="效果" min-width="120" prop="name">
        <template #default="scope">
          <el-button size="small" :type="scope.row.btncss">
            {{ scope.row.name }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" min-width="120" prop="name">
        <template #default="scope">
          <el-input v-model="scope.row.name" placeholder="" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="别名" min-width="120" prop="alias">
        <template #default="scope">
          <el-input v-model="scope.row.alias" placeholder="" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="按钮类型"
        min-width="120"
        prop="type"
      >
        <template #default="scope">
          <el-select v-model="scope.row.type" placeholder="">
            <el-option label="行内按钮" value="1" />
            <el-option label="全局按钮" value="2" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="必选"
        min-width="100"
        prop="mustSelect"
      >
        <template #default="scope">
          <el-switch
            v-if="scope.row.type === '2'"
            v-model="scope.row.mustSelect"
            active-color="#13ce66"
            active-text="是"
            :active-value="1"
            inactive-text="否"
            :inactive-value="0"
            inline-prompt
          />
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="样式"
        min-width="120"
        prop="btncss"
      >
        <template #default="scope">
          <el-select v-model="scope.row.btncss" placeholder="">
            <el-option label="danger" value="danger" />
            <el-option label="default" value="default" />
            <el-option label="info" value="info" />
            <el-option label="primary" value="primary" />
            <el-option label="success" value="success" />
            <el-option label="warning" value="warning" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="提醒内容"
        min-width="120"
        prop="warnTxt"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.warnTxt"
            placeholder="如果为空,则不提醒"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="成功提醒"
        min-width="120"
        prop="successTxt"
      >
        <template #default="scope">
          <el-input v-model="scope.row.successTxt" placeholder="" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="跳转链接/请求地址"
        min-width="280"
        prop="url"
      >
        <template #default="scope">
          <!-- <el-input
            v-model="scope.row.url"
            :disabled="
              scope.row.url ==
                '/ab-bpm/biz/bizCustGrid/view/export_' + info.data.code ||
              scope.row.url ==
                '/ab-bpm/biz/bizCustGrid/view/import_' + info.data.code
                ? true
                : false
            "
            placeholder=""
          /> -->
          <el-input v-model="scope.row.url" placeholder="" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="打开方式"
        min-width="100"
        prop="date"
      >
        <template #default="scope">
          <el-button
            v-if="
              scope.row.url !==
                '/ab-bpm/biz/bizCustGrid/view/export_' + info.data.code &&
              scope.row.url !==
                '/ab-bpm/biz/bizCustGrid/view/import_' + info.data.code
            "
            size="small"
            text
            type="primary"
            @click.prevent="set(scope.row, scope.$index)"
          >
            设置
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="组件名称"
        min-width="140"
        prop="date"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.hrefSetting.abComponentName"
            placeholder="组件名称"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="显示条件"
        min-width="220"
        prop="exp"
      >
        <template #default="scope">
          <el-input
            v-if="scope.row.type === '1'"
            v-model="scope.row.exp"
            placeholder=""
            style="width:110px;"
          />
          <el-button
            v-if="scope.row.type === '1'"
            type="primary"
            size="small"
            style="margin-left: 10px"
            @click="openExpDialog(scope.row,scope.$index)"
            >
            配置
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="菜单权限控制"
        min-width="140"
        prop="joinBtnRight"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.joinBtnRight"
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
        label="自定义导入"
        min-width="140"
        prop="customImport"
      >
        <template #default="scope">
          <el-switch
            v-if="
              scope.row.url ==
                '/ab-bpm/biz/bizCustGrid/view/import_' + info.data.code
            "
            v-model="scope.row.expand.customImport"
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
        label="导入接口"
        min-width="140"
        prop="customImportUrl"
      >
        <template #default="scope">
          <el-select
            v-if="
              scope.row.url ==
                '/ab-bpm/biz/bizCustGrid/view/import_' + info.data.code
            "
            v-model="scope.row.expand.customImportUrl"
            clearable
            placeholder="请选择"
          >
            <el-option :label="item.name" :value="item.alias" v-for="(item,index) in info.interfaceList" :key="index"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="定义模板"
        min-width="140"
        prop="importTemplateFileJson"
      >
        <template #default="scope">
          <ab-upload-file 
            v-if="
              scope.row.url ==
                '/ab-bpm/biz/bizCustGrid/view/import_' + info.data.code
            "
            v-model="scope.row.expand.importTemplateFileJson"
            dic-code="fileType"
            buttonSize="small"
            type="xlsx,xls"
            :limit="1"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="120">
        <template #default="scope">
          <!-- <el-button
            circle
            :icon="DocumentCopy"
            size="small"
            type="primary"
            @click.prevent="copyRow(scope.row, scope.$index)"
          /> -->
          <el-button
            circle
            class="move-btn"
            :icon="Sort"
            size="small"
            type="primary"
          />
          <el-button
            circle
            :icon="Delete"
            size="small"
            type="danger"
            @click.prevent="deleteRow(scope.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="info.setDialogVisible"
      center
      title="设置"
      width="600px"
    >
      <el-form
        ref="ruleFormRef"
        label-position="right"
        label-width="120px"
        :model="info.data.sqlButtonVO[info.index].hrefSetting"
        :rules="rules"
      >
        <el-form-item label="打开方式">
          <el-select
            v-model="info.data.sqlButtonVO[info.index].hrefSetting.openType"
            placeholder="请选择"
            style="width: 100%"
            @change="changeopenType"
          >
            <el-option label="抽屉/弹框" value="drawer" />
            <el-option label="直接请求" value="directRequest" />
            <el-option label="事件按钮" value="eventBtn" />
            <el-option label="标签页/tab页" value="tab" />
            <el-option label="iframe弹框" value="iframeDialog" />
            <el-option label="新页面" value="newPage" />
            <el-option label="自定义组件" value="abComponent" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType === 'drawer'
          "
          label="方式"
          prop="component"
        >
          <el-select
            v-model="
              info.data.sqlButtonVO[info.index].hrefSetting.openDrawerOrDialog
            "
            clearable
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option label="抽屉" value="drawerOpen" />
            <el-option label="弹框" value="dialogOpen" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType === 'drawer'
          "
          label="组件"
          prop="component"
        >
          <el-select
            v-model="info.data.sqlButtonVO[info.index].hrefSetting.component"
            clearable
            placeholder="请选择"
            style="width: 100%"
            @change="changeComponent($event, info.data.sqlButtonVO[info.index])"
          >
            <el-option label="新增" value="FormViewAdd" />
            <el-option label="编辑" value="FormViewEdit" />
            <el-option label="详情" value="FormViewDetail" />
            <el-option label="组联式应用" value="FormViewCombination" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType ==
              'drawer' &&
            (info.data.sqlButtonVO[info.index].hrefSetting.component ==
              'FormViewAdd' ||
              info.data.sqlButtonVO[info.index].hrefSetting.component ==
                'FormViewEdit' ||
              info.data.sqlButtonVO[info.index].hrefSetting.component ==
                'FormViewDetail')
          "
          label="表单"
          prop="params"
        >
          <template
            v-if="
              info.data.sqlButtonVO[info.index].hrefSetting.FormSeletorName &&
              info.data.sqlButtonVO[info.index].hrefSetting.FormSeletorName
                .length > 0
            "
          >
            <el-tag class="ml-2" style="margin-right: 5px" type="primary">
              {{
                info.data.sqlButtonVO[info.index].hrefSetting.FormSeletorName
              }}
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
            @ok="
              chooseFormSeletor(
                $event,
                info.data.sqlButtonVO[info.index].hrefSetting
              )
            "
          >
            请选择
          </ab-cust-dialog>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType ==
              'drawer' &&
            info.data.sqlButtonVO[info.index].hrefSetting.component ==
              'FormViewCombination'
          "
          label="组联式"
          prop="params"
        >
          <template
            v-if="
              info.data.sqlButtonVO[info.index].hrefSetting.combinationName &&
              info.data.sqlButtonVO[info.index].hrefSetting.combinationName
                .length > 0
            "
          >
            <el-tag class="ml-2" style="margin-right: 5px" type="primary">
              {{
                info.data.sqlButtonVO[info.index].hrefSetting.combinationName
              }}
            </el-tag>
          </template>
          <ab-cust-dialog
            dialog-key="groupformselection"
            :dialog-setting="{ multiple: 0 }"
            :icon="Search"
            size="small"
            @ok="
              chooseCombination(
                $event,
                info.data.sqlButtonVO[info.index].hrefSetting
              )
            "
          >
            请选择
          </ab-cust-dialog>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType === 'drawer'
          "
          label="参数"
          prop="params"
        >
          <el-button :icon="Plus" text type="primary" @click="info.data.sqlButtonVO[info.index].hrefSetting.paramsList.push({})">添加</el-button>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType === 'drawer'
          "
          label=""
          prop="params"
        >
          <el-table
              border
              :data="info.data.sqlButtonVO[info.index].hrefSetting.paramsList"
            >
              <el-table-column label="参数映射" prop="name">
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
                    @click="info.data.sqlButtonVO[info.index].hrefSetting.paramsList.splice($index, 1)"
                  />
                </template>
              </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType ===
            'eventBtn'
          "
          label="是否对话框取值"
        >
          <el-switch
            v-model="
              info.data.sqlButtonVO[info.index].hrefSetting.isDialogValue
            "
            active-text="是"
            inactive-text="否"
            inline-prompt
            @change="
              changeIsDialogValue(
                $event,
                info.data.sqlButtonVO[info.index].hrefSetting
              )
            "
          />
          <el-tag
            v-if="
              info.data.sqlButtonVO[info.index].hrefSetting.isDialogValue &&
              info.data.sqlButtonVO[info.index].hrefSetting.codeValue &&
              info.data.sqlButtonVO[info.index].hrefSetting.codeValue.length > 0
            "
            closable
            style="margin: 0 10px"
            @close="handleClose(info.data.sqlButtonVO[info.index].hrefSetting)"
          >
            {{ info.data.sqlButtonVO[info.index].hrefSetting.nameValue }}
          </el-tag>
          <ab-cust-dialog
            v-if="info.data.sqlButtonVO[info.index].hrefSetting.isDialogValue"
            dialog-key="custDialog"
            :dialog-setting="{ multiple: false }"
            size="small"
            style="display: inline-block; margin-left: 5px"
            @ok="
              chooseDialog(
                $event,
                info.data.sqlButtonVO[info.index].hrefSetting
              )
            "
          >
            选 择
          </ab-cust-dialog>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType ===
            'eventBtn'
          "
          label="添加赋值字段"
        >
          <el-button
            size="small"
            type="primary"
            @click="addfzzd(info.data.sqlButtonVO[info.index].hrefSetting)"
          >
            添加+
          </el-button>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType ===
            'eventBtn'
          "
          label=""
        >
          <el-table
            border
            :data="info.data.sqlButtonVO[info.index].hrefSetting.dialogList"
          >
            <el-table-column label="赋值字段" prop="css">
              <template #default="{ row }">
                <el-select
                  v-if="
                    info.data.sqlTableList &&
                    JSON.parse(info.data.sqlTableList).length == 1
                  "
                  v-model="row.key"
                  class="m-2"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in info.data.fieldsList"
                    :key="item.fieldName"
                    :label="item.fieldDesc"
                    :value="item.fieldName"
                  />
                </el-select>
                <el-select
                  v-if="
                    info.data.sqlTableList &&
                    JSON.parse(info.data.sqlTableList).length > 1
                  "
                  v-model="row.key"
                  class="m-2"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in info.tableList"
                    :key="item.name"
                    :label="item.comment"
                    :value="item.name"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="取值" prop="desc">
              <template #default="{ row }">
                <el-select
                  v-if="
                    !info.data.sqlButtonVO[info.index].hrefSetting.isDialogValue
                  "
                  v-model="row.value"
                  allow-create
                  class="m-2"
                  default-first-option
                  filterable
                  placeholder="请选择"
                >
                  <el-option label="当前时间" value="${curTime}" />
                  <el-option label="当前用户ID" value="${currentUserId}" />
                  <el-option label="Null" value="Null" />
                </el-select>
                <el-select
                  v-if="
                    info.data.sqlButtonVO[info.index].hrefSetting.isDialogValue
                  "
                  v-model="row.value2"
                  allow-create
                  class="m-2"
                  default-first-option
                  filterable
                  placeholder="请选择"
                >
                  <el-option label="当前时间" value="${curTime}" />
                  <el-option label="当前用户ID" value="${currentUserId}" />
                  <el-option label="Null" value="Null" />
                  <el-option
                    v-for="item in info.data.sqlButtonVO[info.index].hrefSetting
                      .returnFields"
                    :key="item.returnName"
                    :label="item.showName"
                    :value="item.returnName"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="删除" width="80">
              <template #default="{ row, $index }">
                <el-button
                  :icon="Delete"
                  text
                  type="primary"
                  @click="
                    abUtil.Arrays.del(
                      $index,
                      info.data.sqlButtonVO[info.index].hrefSetting.dialogList
                    )
                  "
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType ===
            'eventBtn'
          "
          label="数据源"
          prop="dataChangeRelTableDsKey"
          style="display: none"
        >
          <ab-ds-selector
            v-model:ds-key="
              info.data.sqlButtonVO[info.index].hrefSetting
                .dataChangeRelTableDsKey
            "
          />
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType ===
            'eventBtn'
          "
          label="关联表"
        >
          <el-input
            v-if="
              info.data.sqlTableList &&
              JSON.parse(info.data.sqlTableList).length == 1
            "
            v-model="
              info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable
            "
            disabled
            placeholder="请输入"
            style="width: 100%"
          />
          <el-select
            v-if="
              info.data.sqlTableList &&
              JSON.parse(info.data.sqlTableList).length > 1
            "
            v-model="
              info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable
            "
            placeholder="请选择"
            style="width: 100%"
            @change="changeTable"
          >
            <el-option
              v-for="(item, index) in JSON.parse(info.data.sqlTableList)"
              :key="index"
              :label="item.tableName"
              :value="item.tableName"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType ===
            'eventBtn'
          "
          label="关联字段"
        >
          <el-select
            v-model="
              info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelField
            "
            placeholder="请选择"
            style="width: 100%"
            @change="changeRelField"
          >
            <el-option
              v-for="item in info.data.fieldsList"
              :key="item.name"
              :label="item.fieldDesc"
              :value="item.tableName + '.' + item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType ===
            'iframeDialog'
          "
          label="宽"
          prop="width"
        >
          <el-input
            v-model="info.data.sqlButtonVO[info.index].hrefSetting.width"
            :max="
              info.data.sqlButtonVO[info.index].hrefSetting.widthUnit == '%'
                ? 100
                : ''
            "
            :min="
              info.data.sqlButtonVO[info.index].hrefSetting.widthUnit == '%'
                ? 0
                : ''
            "
            style="width: 100px"
            type="number"
          />
          <el-select
            v-model="info.data.sqlButtonVO[info.index].hrefSetting.widthUnit"
            placeholder="请选择"
            style="width: 100px"
          >
            <el-option label="%" value="%" />
            <el-option label="px" value="px" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            info.data.sqlButtonVO[info.index].hrefSetting.openType ===
            'iframeDialog'
          "
          label="高"
          prop="height"
        >
          <el-input
            v-model="info.data.sqlButtonVO[info.index].hrefSetting.height"
            :max="
              info.data.sqlButtonVO[info.index].hrefSetting.heightUnit == '%'
                ? 100
                : ''
            "
            :min="
              info.data.sqlButtonVO[info.index].hrefSetting.heightUnit == '%'
                ? 0
                : ''
            "
            style="width: 100px"
            type="number"
          />
          <el-select
            v-model="info.data.sqlButtonVO[info.index].hrefSetting.heightUnit"
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
      v-model="info.expDialogVisible"
      append-to-body
      :close-on-click-modal="false"
      :destroy-on-close="true"
      draggable
      width="600px"
      :title="`条件配置`"
    >
    <el-scrollbar>
      <el-card
        v-for="(config, index) in info.data.sqlButtonVO[info.index].hrefSetting.expList"
        :key="index"
        shadow="always"
        style="margin-bottom: 10px"
      >
        <el-divider content-position="left">
          或条件
          <el-button
            :icon="Delete"
            text
            type="primary"
            @click="
              abUtil.Arrays.del(index, info.data.sqlButtonVO[info.index].hrefSetting.expList)
            "
          />
        </el-divider>
        <el-table
          v-if="info.expDialogVisible"
          border
          :data="config.list"
          empty-text="请添加“并”条件"
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column label="字段">
            <template #default="{ row }">
              <el-select
                v-model="row.param"
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
                  :label="item.fieldDesc"
                  :value="item.fieldName"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="值">
            <template #default="{ row }">
              <el-select
                v-model="row.value"
                allow-create
                clearable
                default-first-option
                filterable
                placeholder="手输固定值"
                :reserve-keyword="false"
                size="small"
              >
                <el-option
                  v-for="item in info.DefaultOption"
                  :key="item.type"
                  :label="item.desc"
                  :value="item.type"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="80">
            <template #header>
              <el-button
                circle
                :icon="Plus"
                type="success"
                @click="addConfigB(config, index)"
              />
            </template>
            <template #default="scope">
              <el-button
                circle
                :icon="Delete"
                type="danger"
                @click="abUtil.Arrays.del(scope.$index, config.list)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-button :icon="Plus" type="success" @click="addConfigs">
        增加“或”条件
      </el-button>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button text type="primary" @click="info.expDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="expDialogOk">确定</el-button>
      </span>
    </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { Delete, DocumentCopy, Sort,Plus } from '@element-plus/icons-vue'
  import { abDsSelector } from '@ab-core'
  import Sortable from 'sortablejs'
  import { getData, bizApi, postData,abUploadFile } from '~/agilebpm'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  const emit = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
    // eslint-disable-next-line vue/require-default-prop
  })
  const ruleFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    dataChange: [
      {
        required: true,
        message: '必填',
        trigger: 'blur',
      },
    ],
  })
  const info: any = reactive({
    setDialogVisible: false,
    expDialogVisible:false,
    index: null,
    data: useVModel(props, 'modelValue', emit),
    hrefSetting: {},
    btnName: '开启',
    key: 'status',
    value: '1',
    plants: ['danger', 'default', 'info', 'primary', 'success', 'warning'],
    tableList: [],
    interfaceList:[],
    DefaultOption: [
      { desc: '当前日期', type: '${currentDateTime}' },
      { desc: '当前用户id', type: '${currentUserId}' },
      { desc: '当前用户账户', type: '${currentUserAccount}' },
      { desc: '当前用户名', type: '${currentUserName}' },
      { desc: '当前组织id', type: '${currentOrgId}' },
      { desc: '当前组织名称', type: '${currentOrgName}' },
      { desc: '当前组织编码', type: '${currentOrgCode}' },
    ]
  })
  watch(
    () => [props.modelValue],
    (now, old) => {
      info.data = now[0]
    }
  )
  const getKey = (boCode: any) => {
    bizApi.bizObject.getBizObject(boCode).then(({ data }) => {
      if (data.interfaceList && data.interfaceList.length > 0) {
        info.interfaceList = JSON.parse(
          JSON.stringify(data.interfaceList)
        )
      }
    })
  }
  if (info.data.sqlButtonVO && info.data.sqlButtonVO.length > 0) {
      info.data.sqlButtonVO.forEach((item: any) => {
        if (!item.hrefSetting) {
          item.hrefSetting = {}
        }
        if (!item.hrefSetting.paramsList) {
          item.hrefSetting.paramsList = []
        }
            // 判断如果是导入按钮
        if(item.url == '/ab-bpm/biz/bizCustGrid/view/import_' + info.data.code){
          if (!item.expand) {
            item.expand = {
              importTemplateFileJson: '',
              customImport:0,
              customImportUrl:''
            }
          }
          if(!info.data.appConfMap.boCode){
            bizApi.customDialog.listDataByCode('formSelector', {queryParam:{code_$VLK:JSON.parse(info.data.extendConf).code,type_$VEQ: "pc"}}).then(
              (res) => {
                let list = res.data.rows
                info.data.appConfMap.boCode = list[0].boCode || list[0].bo_Code_ || list[0].bo_code_
                getKey(info.data.appConfMap.boCode)
              },
              () => {}
            )
          }else{
            getKey(info.data.appConfMap.boCode)
          }
        }
      })
  } else {
    info.data.sqlButtonVO = []
  }
  const getTableList = (tableName: any) => {
    postData(bizApi.customDialog.bizCustDialogGetTable, {
      dsKey: info.data.dsKey,
      objName: tableName,
      objType: 'table',
      dataSource: 'database',
    }).then((resp: any) => {
      if (resp.data) {
        info.tableList = resp.data.columns
      }
    })
  }
  const changeopenType = (value: any) => {
    if (value === 'eventBtn') {
      if (
        info.data.sqlTableList &&
        JSON.parse(info.data.sqlTableList).length == 1
      ) {
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable =
          info.data.fieldsList[0].tableName
      }
      if (
        info.data.sqlTableList &&
        JSON.parse(info.data.sqlTableList).length > 1 &&
        (!info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable ||
          info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable
            .length <= 0)
      ) {
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable =
          JSON.parse(info.data.sqlTableList)[0].tableName
        getTableList(
          info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable
        )
      }
      if (
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable ||
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable
          .length > 0
      ) {
        getTableList(
          info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable
        )
      }
      if (
        !info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelField ||
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelField
          .length <= 0
      ) {
        info.data.sqlButtonVO[
          info.index
        ].hrefSetting.dataChangeRelField = `${info.data.fieldsList[0].tableName}.${info.data.fieldsList[0].name}`
      }
      if (
        !info.data.sqlButtonVO[info.index].hrefSetting
          .dataChangeRelWatchField ||
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelWatchField
          .length <= 0
      ) {
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelWatchField =
          info.data.fieldsList[0].fieldName
      }

      if (
        !info.data.sqlButtonVO[info.index].hrefSetting
          .dataChangeRelTableDsKey ||
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTableDsKey
          .length <= 0
      ) {
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTableDsKey =
          info.data.dsKey
      }
    } else {
      info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable = ''
      info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelField = ''
      info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelWatchField = ''
      info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTableDsKey = ''
      info.data.sqlButtonVO[info.index].hrefSetting.isDialogValue = false
      info.data.sqlButtonVO[info.index].hrefSetting.dialogList = []
      info.data.sqlButtonVO[info.index].hrefSetting.codeValue = ''
      info.data.sqlButtonVO[info.index].hrefSetting.nameValue = ''
      info.data.sqlButtonVO[info.index].hrefSetting.returnFields = []
    }
  }
  const changeTable = (value: any) => {
    info.data.sqlButtonVO[info.index].hrefSetting.dialogList = []
    getTableList(value)
  }
  const changeRelField = (value: any) => {
    info.data.fieldsList.forEach((element: any) => {
      if (value == `${element.tableName}.${element.name}`) {
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelWatchField =
          element.fieldName
      }
    })
  }
  const set = (row: any, index: number) => {
    info.index = index
    info.setDialogVisible = true
    if (info.data.sqlButtonVO[info.index].hrefSetting.openType == 'eventBtn') {
      if (
        info.data.sqlTableList &&
        JSON.parse(info.data.sqlTableList).length == 1
      ) {
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable =
          info.data.fieldsList[0].tableName
      }
      if (
        info.data.sqlTableList &&
        JSON.parse(info.data.sqlTableList).length > 1 &&
        (!info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable ||
          info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable
            .length <= 0)
      ) {
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable =
          JSON.parse(info.data.sqlTableList)[0].tableName
        getTableList(
          info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable
        )
      }
      if (
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable ||
        info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable
          .length > 0
      ) {
        getTableList(
          info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable
        )
      }
    } else {
      info.data.sqlButtonVO[info.index].hrefSetting.dataChangeRelTable = ''
    }
  }
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
  const deleteRow = (index: number) => {
    info.data.sqlButtonVO.splice(index, 1)
  }
  // const copyRow = (row: any, index: number) => {
  //   info.data.sqlButtonVO.splice(index, 0, JSON.parse(JSON.stringify(row)))
  // }
  // 拖拽排序
  // 行拖拽
  const rowDrop = () => {
    setTimeout(() => {
      const table = document.querySelector(
        '.sqlButtonListTable .el-table__body-wrapper tbody'
      )
      Sortable.create(table, {
        animation: 300,
        handle: '.move-btn',
        onStart: (evt: any) => {
          if (table.children.length > info.data.sqlButtonVO.length) {
            ElMessageBox.alert('调整列表位置请先关闭展开', '提示', {
              confirmButtonText: 'OK',
              callback: (action: Action) => {},
            })
          }
        },
        onEnd: (evt: any) => {
          const arr = JSON.parse(JSON.stringify(info.data.sqlButtonVO))
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
          info.data.sqlButtonVO = arr
        },
      })
    })
  }
  rowDrop()
  const changeComponent = (val: any, row: any) => {
    if (
      val == 'FormViewAdd' ||
      val == 'FormViewDetail' ||
      val == 'FormViewEdit'
    ) {
      if (!row.hrefSetting.FormSeletorName) {
        row.hrefSetting.FormSeletorName = ''
      }
      if (!row.hrefSetting.FormSeletorCode) {
        row.hrefSetting.FormSeletorCode = ''
      }
      if (info.data.extendConf) {
        const extendConf = JSON.parse(info.data.extendConf)
        if (extendConf.related) {
          row.hrefSetting.FormSeletorName = extendConf.related.name
          row.hrefSetting.FormSeletorCode = extendConf.related.code
        }
      }
    }
    if (val == 'FormViewAdd') {
      row.hrefSetting.paramsList = [{name:'saveClose',paramsValue:"1"}]
    } else if (val == 'FormViewDetail') {
      row.hrefSetting.paramsList = [{name:'id',paramsValue:info.data.pkName},{name:'saveClose',paramsValue:"1"},{name:'isReadOnly',paramsValue:"1"}]
    } else if (val == 'FormViewEdit') {
      row.hrefSetting.paramsList = [{name:'id',paramsValue:info.data.pkName},{name:'saveClose',paramsValue:"1"}]
    } else {
      row.hrefSetting.combinationName = ''
      row.hrefSetting.combinationCode = ''
      row.hrefSetting.paramsList = []
    }
  }
  const generateRandom = () => {
    return Math.random().toString(16).slice(2)
  }
  const initiateProcess = (list: any) => {
    if (list[0]) {
      info.data.sqlButtonVO.unshift({
        name: '发起流程',
        alias: `${
          info.data.code
        }_initiateProcess_${abUtil.AbRandom.GetRandomStr(6)}`,
        type: '2',
        mustSelect: 0,
        btncss: 'primary',
        warnTxt: '',
        successTxt: '',
        url: `/bpm/flowStart/${list[0].key_}`, // 流程key
        exp: '',
        joinBtnRight: 1,
        hrefSetting: {
          openType: 'tab',
        },
        id: generateRandom(),
        sn: info.data.sqlButtonVO.length + 1,
      })
    }
  }
  const addDefault = () => {
    info.data.sqlButtonVO.unshift({
      name: '按钮',
      alias: `${info.data.code}_default_${abUtil.AbRandom.GetRandomStr(6)}`,
      type: '1',
      mustSelect: 0,
      btncss: 'primary',
      warnTxt: '',
      successTxt: '',
      url: ``, // 表单别名
      exp: 'true',
      joinBtnRight: 1,
      hrefSetting: {
        openType: 'tab',
      },
      id: generateRandom(),
      sn: info.data.sqlButtonVO.length + 1,
    })
  }
  // ts
  const add = () => {
    info.data.sqlButtonVO.unshift({
      name: '新增',
      alias: `${info.data.code}_add_${abUtil.AbRandom.GetRandomStr(6)}`,
      type: '2',
      mustSelect: 0,
      btncss: 'primary',
      warnTxt: '',
      successTxt: '',
      url: `/biz/bizForm/formViewAdd/${info.data.relatedId}?saveBack=1`, // 表单别名
      exp: '',
      joinBtnRight: 1,
      hrefSetting: {
        openType: 'tab',
      },
      id: generateRandom(),
      sn: info.data.sqlButtonVO.length + 1,
    })
  }
  const batchDel = () => {
    info.data.sqlButtonVO.unshift({
      name: '批量删除',
      alias: `${info.data.code}_batchDel_${abUtil.AbRandom.GetRandomStr(6)}`,
      type: '2',
      mustSelect: 1,
      btncss: 'danger',
      warnTxt: '确认批量删除',
      successTxt: '',
      url: `/ab-bpm/biz/bizObject/remove/${info.data.appConfMap.boCode}?dataId=\${${info.data.pkName}}`,
      exp: '',
      joinBtnRight: 1,
      hrefSetting: {
        openType: 'directRequest',
      },
      id: generateRandom(),
      sn: info.data.sqlButtonVO.length + 1,
    })
  }
  const del = () => {
    info.data.sqlButtonVO.unshift({
      name: '删除',
      alias: `${info.data.code}_del_${abUtil.AbRandom.GetRandomStr(6)}`,
      type: '1',
      mustSelect: null,
      btncss: 'primary',
      warnTxt: '确认删除',
      successTxt: '',
      url: `/ab-bpm/biz/bizObject/remove/${info.data.appConfMap.boCode}?dataId=\${${info.data.pkName}}`,
      exp: 'true',
      joinBtnRight: 1,
      hrefSetting: {
        openType: 'directRequest',
      },
      id: generateRandom(),
      sn: info.data.sqlButtonVO.length + 1,
    })
  }
  const edit = () => {
    info.data.sqlButtonVO.unshift({
      name: '编辑',
      alias: `${info.data.code}_edit_${abUtil.AbRandom.GetRandomStr(6)}`,
      type: '1',
      mustSelect: null,
      btncss: 'primary',
      warnTxt: '',
      successTxt: '',
      url: `/biz/bizForm/formViewEdit/${info.data.relatedId}?id=\${${info.data.pkName}}&saveBack=1`, // 编码
      exp: 'true',
      joinBtnRight: 1,
      hrefSetting: {
        openType: 'drawer',
        openDrawerOrDialog:'drawerOpen',
        component:"FormViewEdit",
        paramsList:[{name:'id',paramsValue:info.data.pkName},{name:'saveClose',paramsValue:"1"}],
        FormSeletorName:JSON.parse(info.data.extendConf) && JSON.parse(info.data.extendConf).related ? JSON.parse(info.data.extendConf).related.name : '',
        FormSeletorCode:JSON.parse(info.data.extendConf) && JSON.parse(info.data.extendConf).related ? JSON.parse(info.data.extendConf).related.code : ''
      },
      id: generateRandom(),
      sn: info.data.sqlButtonVO.length + 1,
    })
  }
  const detail = () => {
    info.data.sqlButtonVO.unshift({
      name: '详情',
      alias: `${info.data.code}_detail_${abUtil.AbRandom.GetRandomStr(6)}`,
      type: '1',
      mustSelect: null,
      btncss: 'primary',
      warnTxt: '',
      successTxt: '',
      url: `/biz/bizForm/formViewDetail/${info.data.relatedId}?id=\${${info.data.pkName}}&saveBack=1`, // 编码
      exp: 'true',
      joinBtnRight: 1,
      hrefSetting: {
        openType: 'drawer',
        openDrawerOrDialog:'drawerOpen',
        component:"FormViewDetail",
        paramsList:[{name:'id',paramsValue:info.data.pkName},{name:'saveClose',paramsValue:"1"},{name:'isReadOnly',paramsValue:"1"}],
        FormSeletorName:JSON.parse(info.data.extendConf) && JSON.parse(info.data.extendConf).related ? JSON.parse(info.data.extendConf).related.name : '',
        FormSeletorCode:JSON.parse(info.data.extendConf) && JSON.parse(info.data.extendConf).related ? JSON.parse(info.data.extendConf).related.code : ''
      },
      id: generateRandom(),
      sn: info.data.sqlButtonVO.length + 1,
    })
  }
  const tableImport = () => {
    info.data.sqlButtonVO.unshift({
      name: '导入',
      alias: `${info.data.code}_import_${abUtil.AbRandom.GetRandomStr(6)}`,
      type: '2',
      mustSelect: 0,
      btncss: 'primary',
      warnTxt: '请使用管理员提供导入的模板来导入数据',
      successTxt: '',
      url: `/ab-bpm/biz/bizCustGrid/view/import_${info.data.code}`,
      exp: '',
      joinBtnRight: 1,
      hrefSetting: {},
      expand: {
        importTemplateFileJson: '',
        customImport:0,
        customImportUrl:''
      },
      id: generateRandom(),
      sn: info.data.sqlButtonVO.length + 1,
    })
    if(!info.data.appConfMap.boCode){
      bizApi.customDialog.listDataByCode('formSelector', {queryParam:{code_$VLK:JSON.parse(info.data.extendConf).code,type_$VEQ: "pc"}}).then(
        (res) => {
          let list = res.data.rows
          info.data.appConfMap.boCode = list[0].boCode || list[0].bo_Code_ || list[0].bo_code_
          getKey(info.data.appConfMap.boCode)
        },
        () => {}
      )
    }else{
      getKey(info.data.appConfMap.boCode)
    }
  }
  const tableExport = () => {
    info.data.sqlButtonVO.unshift({
      name: '导出',
      alias: `${info.data.code}_export_${abUtil.AbRandom.GetRandomStr(6)}`,
      type: '2',
      mustSelect: 0,
      btncss: 'primary',
      warnTxt: '',
      successTxt: '',
      url: `/ab-bpm/biz/bizCustGrid/view/export_${info.data.code}`,
      exp: '',
      joinBtnRight: 1,
      hrefSetting: {},
      id: generateRandom(),
      sn: info.data.sqlButtonVO.length + 1,
    })
  }
  const statusOpen = () => {
    const plants =
      info.plants[Math.floor(Math.random() * (info.plants.length + 1))]
    info.data.sqlButtonVO.push({
      name: '启用',
      alias: `${info.data.code}StatusOpen_${abUtil.AbRandom.GetRandomStr(6)}`,
      type: '1',
      mustSelect: null,
      btncss: plants ? plants : 'primary',
      warnTxt: '是否启用',
      successTxt: '',
      url: '',
      exp: 'item.status==0',
      joinBtnRight: 1,
      hrefSetting: {},
      id: generateRandom(),
      sn: info.data.sqlButtonVO.length + 1,
    })
  }
  const disable = () => {
    const plants =
      info.plants[Math.floor(Math.random() * (info.plants.length + 1))]
    info.data.sqlButtonVO.push({
      name: '禁用',
      alias: `${info.data.code}StatusClose_${abUtil.AbRandom.GetRandomStr(6)}`,
      type: '1',
      mustSelect: null,
      btncss: plants ? plants : 'primary',
      warnTxt: '是否禁用',
      successTxt: '',
      url: '',
      exp: 'item.status==1',
      joinBtnRight: 1,
      hrefSetting: {},
      id: generateRandom(),
      sn: info.data.sqlButtonVO.length + 1,
    })
  }
  if (info.data.sqlButtonVO && info.data.sqlButtonVO.length > 0) {
    info.data.sqlButtonVO.forEach((item: any, index: any) => {
      item.id = generateRandom()
      item.sn = index + 1
    })
  }
  const changeIsDialogValue = (value: any, item: any) => {
    item.dialogList = []
    item.codeValue = ''
    item.nameValue = ''
    info.data.sqlButtonVO[info.index].hrefSetting.returnFields = []
  }
  const chooseDialog = (list: any, item: any) => {
    item.codeValue = list[0].code
    item.nameValue = list[0].name
    getData(bizApi.customDialog.getByCode + list[0].code, {}).then(
      (result: any) => {
        if (result.data) {
          item.returnFields = result.data.returnFields
        }
      },
      () => {}
    )
  }
  const handleClose = (item: any) => {
    item.codeValue = ''
    item.nameValue = ''
    item.dialogList = []
    info.data.sqlButtonVO[info.index].hrefSetting.returnFields = []
  }
  const addfzzd = (data: any) => {
    if (!data.dialogList) {
      data.dialogList = []
    }
    data.dialogList.push({
      key: '',
      value: '',
    })
  }
  const chooseCombination = (list: any, item: any) => {
    item.combinationName = list[0].name
    item.combinationCode = list[0].code
  }
  const chooseFormSeletor = (list: any, item: any) => {
    item.FormSeletorName = list[0].name
    item.FormSeletorCode = list[0].code
  }
  const openExpDialog = (item: any, index: any) => {
    info.index = index
    info.expDialogVisible = true
    if(!info.data.sqlButtonVO[info.index].hrefSetting.expList){
      info.data.sqlButtonVO[info.index].hrefSetting.expList = []
    }
  }
  const addConfigs = () => {
    info.data.sqlButtonVO[info.index].hrefSetting.expList.push(
      {
        list:[]
      }
    )
  }
  const addConfigB = (item:any,index:any) => {
    item.list.push(
      {

      }
    )
  }
  const expDialogOk = () => {
    info.expDialogVisible = false
    let str = ''
    if(info.data.sqlButtonVO[info.index].hrefSetting.expList.length > 0){
      info.data.sqlButtonVO[info.index].hrefSetting.expList.forEach((exp:any) => {
        if(exp.list && exp.list.length > 0){
          exp.list.forEach((it:any) =>{
            if(it.param && it.param.length > 0 && it.value && it.value.length > 0){
              str += 'item.' + it.param + '==' + it.value + '&&'
            }
          })
          str = str.substring(0, str.length - 2)
          str += '||'
        }
      })
      str = str.substring(0, str.length - 2)
      info.data.sqlButtonVO[info.index].exp = JSON.parse(JSON.stringify(str))
    }
  }
</script>
<style lang="scss">
  .btnBox {
    .el-button + .el-button {
      margin-left: 0px;
    }
    .el-input-group__append,
    .el-input-group__prepend {
      padding: 0 4px;
    }
  }
</style>
