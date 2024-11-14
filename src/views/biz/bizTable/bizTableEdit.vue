<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        ref="saveRef"
        back-name="BizTableList"
        edit-refresh
        :form-ref="formRef"
        :save-data="info.data"
        :url="`${bizApi.bizTable.BizTableSave}?create=0`"
        :url-param="info.urlParam"
        :valid-after-fn="beforeSaveFn"
        @after-save="afterSave"
      >
        <ab-save
          v-if="!info.data.id && !info.data.external"
          :back-btn="false"
          back-name="BizTableList"
          edit-refresh
          :form-ref="formRef"
          :save-data="info.data"
          text="保存并生成表"
          :url="`${bizApi.bizTable.BizTableSave}?create=1`"
          @after-save="afterSave"
        />
      </ab-save>
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          v-if="info.BizValidatorMap"
          ref="formRef"
          :inline="true"
          label-position="right"
          label-suffix="："
          label-width="120px"
          :model="info.data"
          :status-icon="false"
        >
          <el-row style="max-width: 1000px">
            <el-col :span="12">
              <el-form-item
                label="分类"
                prop="typeCode"
                :rules="[{ required: true, message: '必填' }]"
              >
                <ab-select-tree
                  v-model="info.data.typeCode"
                  :operation="false"
                  type-code="biz"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="数据源"
                prop="dsKey"
                :rules="[{ required: true, message: '必填' }]"
              >
                <ab-ds-selector
                  v-model:ds-key="info.data.dsKey"
                  v-model:ds-type="info.dsType"
                  :disabled="!!info.data.id"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="名称"
                prop="comment"
                :rules="[
                  { required: true, message: '必填' },
                  { max: 50, message: '最多可输入50个字符' },
                ]"
              >
                <ab-pinyin
                  v-if="!info.data.external"
                  v-model="info.data.comment"
                  v-model:to="info.data.name"
                  v-model:to1="info.data.code"
                  maxlength="50"
                  :prefix="info.pinyinPrefix"
                  show-word-limit
                  :type="info.dsType == 'oracle' ? 2 : 3"
                />
                <ab-pinyin
                  v-else
                  v-model="info.data.comment"
                  v-model:to="info.data.code"
                  maxlength="50"
                  :prefix="info.pinyinPrefix"
                  show-word-limit
                  :type="info.dsType == 'oracle' ? 2 : 3"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="编码"
                prop="code"
                :rules="[
                  { required: true, message: '必填' },
                  { max: 50, message: '最多可输入50个字符' },
                  info.BizValidatorMap.varirule.rule,
                ]"
              >
                <ab-code
                  v-if="!info.data.external"
                  v-model="info.data.code"
                  :disabled="!!info.data.id"
                  maxlength="50"
                  show-word-limit
                />
                <el-input
                  v-else
                  v-model="info.data.code"
                  :disabled="!!info.data.id"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col v-if="!info.data.external" :span="12">
              <el-form-item
                label="表名"
                prop="name"
                :rules="[
                  { required: true, message: '必填' },
                  {
                    max: info.dbLength,
                    message: `最多可输入${info.dbLength}个字符`,
                  },
                  info.BizValidatorMap.varirule.rule,
                ]"
              >
                <ab-code
                  v-model="info.data.name"
                  :disabled="!!info.data.id"
                  :maxlength="info.dbLength"
                  show-word-limit
                />
                <el-button
                  v-if="!!info.data.id && !info.data.createdTable"
                  plain
                  style="margin-left: 5px"
                  type="warning"
                  @click="createTable"
                >
                  生成表
                </el-button>
                <el-popover
                  content="在生成表后，用户可以自由增删字段，保存后系统会自动同步到数据库。对于修改字段类型（长度，必填），用户必须考虑到新类型对旧数据的兼容问题，否则很容易报错。"
                  placement="top-start"
                  title="提示"
                  trigger="hover"
                  :width="300"
                >
                  <template #reference>
                    <el-button
                      v-if="info.data.createdTable"
                      plain
                      style="margin-left: 5px"
                      type="success"
                    >
                      已生成表
                    </el-button>
                  </template>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col v-if="info.data.external" :span="12">
              <el-form-item
                label="数据库表名"
                prop="name"
                :rules="[
                  { required: true, message: '必填' },
                  { max: 50, message: '最多可输入50个字符' },
                  info.BizValidatorMap.varirule.rule,
                ]"
              >
                <el-select
                  v-if="!info.data.id"
                  v-model="info.data.name"
                  filterable
                  :loading="info.selectLoading"
                  placeholder="请输入表名查询"
                  remote
                  :remote-method="remoteMethod"
                  remote-show-suffix
                  reserve-keyword
                  @change="extNameChange"
                >
                  <el-option
                    v-for="(v, k) in info.tableMap"
                    :key="k"
                    :label="`${v ? v : k}（${k}）`"
                    :value="k"
                  />
                </el-select>

                <el-input
                  v-if="info.data.id"
                  v-model="info.data.name"
                  :disabled="true"
                  maxlength="50"
                  show-word-limit
                  style="width: 100px"
                />
                <el-button
                  v-if="info.data.id"
                  plain
                  style="margin-left: 5px"
                  type="warning"
                  @click="extNameChange"
                >
                  同步表结构
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="margin-top: 5px">
            <el-form-item>
              <el-button
                v-if="!info.data.external"
                :icon="Plus"
                type="primary"
                @click="addColumn"
              >
                增加字段
              </el-button>
              <el-button
                v-if="!info.data.external"
                :disabled="!!info.data.columns.find((c) => c.code == 'rev')"
                :icon="Plus"
                plain
                type="success"
                @click="addOptimLock"
              >
                增加乐观锁
              </el-button>
              <el-button
                v-if="!info.data.external"
                :disabled="isAddDefault()"
                :icon="Plus"
                plain
                type="success"
                @click="addDefault"
              >
                增加默认字段
              </el-button>
            </el-form-item>
          </el-row>
          <!--列内容 -->
          <el-row
            v-loading="info.tableLoading"
            element-loading-text="同步结构中..."
          >
            <el-table
              border
              class="bizTableClass"
              :data="info.data.columns"
              empty-text="请先选择外部表"
              :max-height="info.maxTableHeight"
              row-key="sn"
              style="width: 100%"
            >
              <el-table-column label="注解" min-width="150">
                <template #default="scope">
                  <el-form-item
                    :prop="`columns.${scope.$index}.comment`"
                    :rules="[
                      { max: 50, message: '最多可输入50个字符' },
                      { required: true, message: '必填' },
                    ]"
                  >
                    <ab-pinyin
                      v-model="scope.row.comment"
                      v-model:to="scope.row.name"
                      v-model:to1="scope.row.code"
                      :format="{ to: 3 }"
                      maxlength="50"
                      show-word-limit
                      :suffix="{ to: '_' }"
                      :type="info.dsType == 'oracle' ? 2 : 3"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="编码" min-width="120">
                <template #default="scope">
                  <el-form-item
                    :prop="`columns.${scope.$index}.code`"
                    :rules="[
                      { max: 50, message: '最多可输入50个字符' },
                      { required: true, message: '必填' },
                      info.BizValidatorMap.varirule.rule,
                      {
                        list: info.data.columns,
                        key: 'code',
                        message: '编码已存在',
                        trigger: 'blur',
                        validator: info.columnDuplicateRuleValidator,
                      },
                    ]"
                  >
                    <el-input
                      v-model="scope.row.code"
                      maxlength="50"
                      show-word-limit
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="数据库字段名" min-width="120">
                <template #default="scope">
                  <el-form-item
                    :prop="`columns.${scope.$index}.name`"
                    :rules="[
                      {
                        max: info.dbLength,
                        message: `最多可输入${info.dbLength}个字符`,
                      },
                      { required: true, message: '必填' },
                      info.BizValidatorMap.varirule.rule,
                      {
                        list: info.data.columns,
                        key: 'name',
                        message: '字段名已存在',
                        trigger: 'blur',
                        validator: info.columnDuplicateRuleValidator,
                      },
                    ]"
                  >
                    <el-input
                      v-model="scope.row.name"
                      :disabled="
                        !!(
                          (!!info.data.createdTable && !!scope.row.id) ||
                          info.data.external
                        )
                      "
                      :maxlength="info.dbLength"
                      show-word-limit
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="必填" width="100">
                <template #default="scope">
                  <el-form-item :prop="`columns.${scope.$index}.required`">
                    <el-switch
                      v-model="scope.row.required"
                      active-color="#13ce66"
                      active-text="必填"
                      :active-value="1"
                      :disabled="
                        !!scope.row.primary ||
                        (info.data.createdTable && scope.row.id)
                      "
                      inactive-color="#ff4949"
                      inactive-text="非必填"
                      :inactive-value="0"
                      inline-prompt
                      :width="60"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="字段类型" width="120">
                <template #default="scope">
                  <el-form-item :prop="`columns.${scope.$index}.type`">
                    <el-select
                      v-model="scope.row.type"
                      :disabled="!!scope.row.primary"
                      @change="typeChange(scope.row)"
                    >
                      <el-option
                        v-for="val in info.ColumnType"
                        :key="val.key"
                        :label="val.desc"
                        :value="val.key"
                      />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="字段长度" width="150">
                <template #default="scope">
                  <el-form-item
                    v-if="['varchar', 'number'].includes(scope.row.type)"
                    :prop="`columns.${scope.$index}.length`"
                    :rules="[
                      { required: true, message: '必填' },
                      { type: 'number', message: '只能数字' },
                    ]"
                  >
                    <el-input
                      v-model.number="scope.row.length"
                      maxlength="4"
                      :style="{
                        width: scope.row.type == 'number' ? '60px' : '100%',
                      }"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="scope.row.type == 'number'"
                    :prop="`columns.${scope.$index}.decimal`"
                    :rules="[
                      { required: true, message: '必填' },
                      { type: 'number', message: '只能数字' },
                    ]"
                  >
                    <el-tooltip
                      class="box-item"
                      content="小数位"
                      effect="dark"
                      placement="top-start"
                    >
                      <el-input
                        v-model.number="scope.row.decimal"
                        style="width: 60px; margin-left: 5px"
                      />
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="默认值" :min-width="180">
                <template #default="scope">
                  <el-form-item
                    v-if="!scope.row.primary"
                    :prop="`columns.${scope.$index}.defaultValue`"
                    :rules="
                      ['varchar', 'number'].includes(scope.row.type)
                        ? [
                            {
                              max:
                                scope.row.type == 'number'
                                  ? 20
                                  : scope.row.length,
                              message:
                                '最多可输入' +
                                (scope.row.type == 'number'
                                  ? 20
                                  : scope.row.length) +
                                '个字符',
                            },
                          ]
                        : []
                    "
                  >
                    <el-tooltip
                      class="box-item"
                      content="支持以#{}包含的以脚本运行，eg:#{sysScript.getCurrentUserName()}。"
                      effect="dark"
                      placement="top-start"
                    >
                      <el-select
                        v-if="info.defaultValueOps[scope.row.type]"
                        v-model="scope.row.defaultValue"
                        allow-create
                        clearable
                        filterable
                        placeholder="选择或填写"
                      >
                        <el-option
                          v-for="(val, key) in info.defaultValueOps[
                            scope.row.type
                          ]"
                          :key="key"
                          :label="val"
                          :value="key"
                        />
                      </el-select>
                      <el-input v-else v-model="scope.row.defaultValue" />
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="配置项" min-width="160">
                <template #default="scope">
                  <el-form-item v-if="!scope.row.primary">
                    <ab-multi-select
                      v-model="scope.row.setting"
                      multiple
                      placeholder="请选择配置项"
                    >
                      <el-tooltip
                        class="box-item"
                        content="自动关联必填"
                        effect="dark"
                        placement="top-start"
                      >
                        <el-option label="唯一键" value="unique" />
                      </el-tooltip>

                      <el-tooltip
                        class="box-item"
                        content="仅支持数字类型"
                        effect="dark"
                        placement="top-start"
                      >
                        <el-option
                          :disabled="scope.row.type != 'number'"
                          label="乐观锁"
                          value="optimLock"
                        />
                      </el-tooltip>

                      <el-tooltip
                        class="box-item"
                        content="系统不会维护数据，只会在取数据时进行升序查询"
                        effect="dark"
                        placement="top-start"
                      >
                        <el-option label="升序" value="asc" />
                      </el-tooltip>

                      <el-tooltip
                        class="box-item"
                        content="系统不会维护数据，只会在取数据时进行降序查询"
                        effect="dark"
                        placement="top-start"
                      >
                        <el-option label="降序" value="desc" />
                      </el-tooltip>

                      <el-tooltip
                        class="box-item"
                        content="仅支持数字类型、系统自动维护数据、仅生效一个"
                        effect="dark"
                        placement="top-start"
                      >
                        <el-option
                          :disabled="scope.row.type != 'number'"
                          label="排序"
                          value="sn"
                        />
                      </el-tooltip>

                      <el-tooltip
                        class="box-item"
                        content="仅在默认值不为空"
                        effect="dark"
                        placement="top-start"
                      >
                        <el-option
                          :disabled="!scope.row.defaultValue"
                          label="默认值更新"
                          value="defaultValueUpdate"
                        />
                      </el-tooltip>

                      <el-tooltip
                        class="box-item"
                        content="仅支持字符串类型"
                        effect="dark"
                        placement="top-start"
                      >
                        <el-option
                          :disabled="scope.row.type != 'varchar'"
                          label="加密存储"
                          value="encryption"
                        />
                      </el-tooltip>
                    </ab-multi-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="后端校验" min-width="150">
                <template #default="scope">
                  <el-form-item
                    v-if="!scope.row.primary"
                    :prop="`columns.${scope.$index}.validRule`"
                  >
                    <ab-multi-select v-model="scope.row.validRule">
                      <el-option
                        v-for="val in info.BizValidatorMap"
                        :key="val.key"
                        :label="val.name"
                        :value="val.key"
                      />
                    </ab-multi-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!info.data.external"
                fixed="right"
                label="操作"
                width="130"
              >
                <template #default="scope">
                  <span v-if="!scope.row.primary">
                    <el-button circle class="move-btn" :icon="Sort" />
                    <el-button
                      v-if="
                        !(
                          info.data.createdTable &&
                          scope.row.required &&
                          scope.row.id
                        )
                      "
                      circle
                      :icon="Delete"
                      type="danger"
                      @click="
                        abUtil.Arrays.del(scope.$index, info.data.columns)
                      "
                    />
                  </span>
                  <el-tag v-else class="ml-2" type="warning">主键字段</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { storage } from '@/config'
  import { Delete, Plus, Sort } from '@element-plus/icons-vue'
  import type { FormInstance } from 'element-plus'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import Sortable from 'sortablejs'
  import { reactive, ref } from 'vue'
  import {
    abDsSelector,
    abMultiSelect,
    abTools,
    abUtil,
    bizApi,
    getData,
    postData,
    sysApi,
  } from '~/agilebpm'

  //引入 当前实例
  const formRef = ref<FormInstance>()
  const saveRef = ref()
  const defaultValueOps_str = {
    '${currentUserId}': '当前用户ID',
    '${currentUserName}': '当前用户名',
    '${currentUserAccount}': '当前用户账号',
    '${currentOrgId}': '当前用户组织ID',
    '${currentOrgName}': '当前用户组织名',
    '${currentOrgCode}': '当前用户组织编码',
  }

  //页面用到的双向绑定的信息
  const info: any = reactive({
    maxTableHeight: 500,
    //业务数据
    data: {
      external: 0,
      columns: [
        {
          sn: 0, //为了处理sortable修改列表排序后elemnt能识别，必须要有row-id这个值
          type: 'varchar',
          length: 64,
          decimal: 0,
          required: 1,
          primary: 1,
          comment: '主键',
          code: 'id',
          name: 'id_',
        },
      ],
      createdTable: false,
    },
    BizValidatorMap: null,
    ColumnType: {},
    columnDuplicateRuleValidator: (rule: any, value: any, callback: any) => {
      const b =
        rule.list.map((c: any) => c[rule.key]).filter((s: any) => s == value)
          .length == 1
      if (!b) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    /**
     * 服务器里的数据
     */
    serverData: {},
    objName: '',
    tableMap: {},
    defaultValueOps: {
      varchar: defaultValueOps_str,
      clob: defaultValueOps_str,
      date: { '${currentDateTime}': '当前时间' },
    },
    selectLoading: false,
    tableLoading: false,
    dsType: '',
    dbLength: 50,
    urlParam: {
      dropColumn: 0, //-1 不删除字段 ；0 待确定 ；1 删除字段
    },
    pinyinPrefix: {},
  })

  const { proxy } = abTools.useCurrentInstance()
  const query = proxy.$route.query
  if (query) {
    if (query.external == '1') {
      info.data.external = 1
      info.data.columns = []
    }
    info.data.typeCode = query.typeCode
    if (query.id) {
      bizApi.bizTable.BizTableGetById(query.id).then((rel) => {
        info.data = rel.data
        //复制则覆盖ID名称和编码
        if (query.copy) {
          info.data.id = null
          info.data.name =
            info.data.name.charAt(info.data.name.length - 1) === '_'
              ? `${info.data.name}copy`
              : `${info.data.name}_copy`
          info.data.code =
            info.data.code.charAt(info.data.code.length - 1) === '_'
              ? `${info.data.code}copy`
              : `${info.data.code}_copy`
          info.data.comment =
            info.data.comment.charAt(info.data.comment.length - 1) === '_'
              ? `${info.data.comment}复制`
              : `${info.data.comment}_复制`
          /* info.data.name = `${info.data.name}_copy`
          info.data.code = `${info.data.code}_copy` */
          /* info.data.comment = `${info.data.comment}_复制` */
          info.data.createdTable = false
          info.data.columnsWithoutPrimary = null
          info.data.columns.forEach((s: any) => (s.id = null))
        }
        info.serverData = abUtil.clone(info.data)
      })
    }
  }

  /**
   * 增加专注模式的分类
   */
  if (storage && 'localStorage' == storage) {
    if (localStorage.getItem('focusModeData')) {
      const focusModeData = JSON.parse(localStorage.getItem('focusModeData'))
      if (focusModeData.open) {
        info.pinyinPrefix = {
          to: `${focusModeData.bizTypeCode}_`,
          to1: `${focusModeData.bizTypeCode}_`,
          to2: `${focusModeData.bizTypeCode}_`,
        }
      }
    }
  }

  sysApi.tools
    .getEnum('com.dstz.jdbc.api.enums.ColumnType', true)
    .then((resp) => {
      info.ColumnType = resp.data
      console.info(info.ColumnType)
    })

  bizApi.bizPattern.getAllBizValidator().then((data) => {
    info.BizValidatorMap = data

    //加载拖拽排序组件
    setTimeout(() => {
      const table = document.querySelector('tbody')
      //外部表不渲染拖拽
      if (proxy.$route.query.external == '0') {
        console.info('开始渲染字段拖拽功能')
        Sortable.create(table, {
          animation: 300,
          handle: '.move-btn',
          onMove: (evt: any, originalEvent: any) => {
            //找到没有拖拽按钮的不让修改排序
            const td = evt.related.querySelectorAll('td')[9]
            if (td && !td.querySelector('.move-btn')) {
              return false
            }
            return true
          },
          onEnd: (evt: any) => {
            const t = info.data.columns.splice(evt.oldIndex, 1)[0]
            info.data.columns.splice(evt.newIndex, 0, t)
          },
        })
      }
    })
  })

  const addOptimLock = () => {
    const c = {
      sn: abUtil.Arrays.getNextSn(info.data.columns),
      type: 'number',
      length: 10,
      decimal: 0,
      required: 1,
      primary: 0,
      comment: '乐观锁',
      code: 'rev',
      name: 'rev_',
      setting: 'optimLock',
    }
    info.data.columns.push(c)
  }

  const addDefault = () => {
    info.data.columns.push({
      sn: abUtil.Arrays.getNextSn(info.data.columns),
      type: 'varchar',
      required: 0,
      primary: 0,
      length: 64,
      decimal: 0,
      comment: '创建人',
      code: 'createBy',
      name: 'create_by_',
      defaultValue: '${currentUserId}',
      setting: '',
    })
    info.data.columns.push({
      sn: abUtil.Arrays.getNextSn(info.data.columns),
      type: 'date',
      required: 0,
      primary: 0,
      length: 64,
      decimal: 0,
      comment: '创建时间',
      code: 'createTime',
      name: 'create_time_',
      defaultValue: '${currentDateTime}',
      setting: '',
    })
    info.data.columns.push({
      sn: abUtil.Arrays.getNextSn(info.data.columns),
      type: 'varchar',
      required: 0,
      primary: 0,
      length: 64,
      decimal: 0,
      comment: '创建所在组织',
      code: 'createOrgId',
      name: 'create_org_id_',
      defaultValue: '${currentOrgId}',
      setting: '',
    })
    info.data.columns.push({
      sn: abUtil.Arrays.getNextSn(info.data.columns),
      type: 'varchar',
      required: 0,
      primary: 0,
      length: 64,
      decimal: 0,
      comment: '更新人',
      code: 'updateBy',
      name: 'update_by_',
      defaultValue: '${currentUserId}',
      setting: 'defaultValueUpdate',
    })
    info.data.columns.push({
      sn: abUtil.Arrays.getNextSn(info.data.columns),
      type: 'date',
      required: 0,
      primary: 0,
      length: 64,
      decimal: 0,
      comment: '更新时间',
      code: 'updateTime',
      name: 'update_time_',
      defaultValue: '${currentDateTime}',
      setting: 'defaultValueUpdate',
    })
  }

  const isAddDefault = () => {
    return info.data.columns.find((c: any) =>
      [
        'createBy',
        'createTme',
        'createOrgId',
        'updateBy',
        'updateTime',
      ].includes(c.code)
    )
  }

  const addColumn = () => {
    const c = {
      sn: abUtil.Arrays.getNextSn(info.data.columns),
      type: 'varchar',
      required: 0,
      primary: 0,
      length: 64,
      decimal: 0,
    }
    info.data.columns.push(c)
  }

  const createTable = () => {
    //校验下数据是否被修改，则服务器数据和页面数据是否相等
    if (JSON.stringify(info.serverData) != JSON.stringify(info.data)) {
      ElMessage({
        showClose: true,
        message: '生成表之前需保存数据',
        type: 'warning',
      })
      return
    }

    getData(bizApi.bizTable.BizTableCreateTable, {
      code: info.data.code,
    }).then((resp: any) => {
      info.data.createdTable = true
      ElMessage({
        message: resp.message,
        type: 'success',
      })
    })
  }

  const afterSave = () => {
    //info.serverData = AbUtil.clone(info.data)
  }

  const remoteMethod = (query: string) => {
    if (!query) {
      info.tableMap = {}
      return
    }
    info.selectLoading = true
    bizApi.bizTable.searchObjName(info.data.dsKey, query).then((resp: any) => {
      info.tableMap = resp.data
      info.selectLoading = false
    })
  }

  const extNameChange = () => {
    if (!info.data.name) {
      return
    }
    info.tableLoading = true
    postData(bizApi.customDialog.bizCustDialogGetTable, {
      dsKey: info.data.dsKey,
      objName: info.data.name,
      objType: 'table',
      dataSource: 'database',
    }).then((resp: any) => {
      info.tableLoading = false
      console.info(resp.data)
      const table = resp.data
      if (!resp.data) {
        ElMessage({
          showClose: true,
          message: '无法找到外部表信息，请检查外部表是否被删除',
          type: 'error',
        })
        return
      }
      if (table.columns.filter((c: any) => c.primary).length != 1) {
        ElMessage({
          showClose: true,
          message: '当前外部表不符合唯一主键的系统规则',
          type: 'warning',
        })
        return
      }
      const pk = table.columns.filter((c: any) => c.primary)[0]
      if (pk.type != 'varchar' && pk.length < 64) {
        ElMessage({
          showClose: true,
          message: '当前外部表主键仅支持字符串类型且长度大于64',
          type: 'warning',
        })
        return
      }
      /**
       * 合并字段信息
       */
      table.columns.forEach((c: any) => {
        let column = info.data.columns.find((co: any) => co.name == c.name) //找到页面中对应的字段
        if (!column) {
          column = c
        } else {
          Object.assign(column, c) //以库的字段为准
        }
        if (!column.comment) {
          column.comment = column.name
        }
        if (!column.key) {
          column.code = column.name.tuoFeng()
          if (column.code.endsWith('_')) {
            column.code = column.code.substring(0, column.code.length - 1)
          }
        }

        Object.assign(c, column)
      })

      if (!info.data.code) {
        info.data.code = table.name.tuoFeng()
      }
      if (info.data.comment) {
        delete table.comment //存在就不同步了
      }
      Object.assign(info.data, table)
      ElMessage({
        showClose: true,
        message: '已同步当前表结构',
        type: 'success',
      })
    })
  }

  const typeChange = (row: any) => {
    if (row.type == 'number') {
      row.length = 8
      row.decimal = 2
    }
    if (row.type == 'varchar') {
      row.length = 50
    }
  }

  const beforeSaveFn = () => {
    if (info.data.external || info.urlParam.dropColumn != 0) {
      return true
    }

    postData(bizApi.customDialog.bizCustDialogGetTable, {
      dsKey: info.data.dsKey,
      objName: info.data.name,
      objType: 'table',
      dataSource: 'database',
    }).then((resp: any) => {
      const table = resp.data
      if (!table) {
        info.urlParam.dropColumn = -1
        saveRef.value.save()
      }

      const scs: any = [] //要删除的字段
      table.columns.forEach((col: any) => {
        if (
          !info.data.columns.find(
            (c: any) => c.name.toLowerCase() == col.name.toLowerCase()
          )
        ) {
          scs.push(col)
        }
      })

      const xzs: any = [] //要新增的字段
      info.data.columns.forEach((col: any) => {
        if (!table.columns.find((c: any) => c.name == col.name)) {
          xzs.push(col)
        }
      })

      if (scs.length == 0) {
        info.urlParam.dropColumn = -1
        saveRef.value.save()
        return
      }
      ElMessageBox.confirm(
        `是否同步删除数据库如下字段：${scs
          .map((m: any) => `${m.comment}（${m.name}）`)
          .join('、')}`,
        '提示',
        {
          confirmButtonText: '删除',
          cancelButtonText: '不删除',
          type: 'warning',
          distinguishCancelAndClose: true,
        }
      )
        .then(() => {
          info.urlParam.dropColumn = 1
          saveRef.value.save()
        })
        .catch((action: any) => {
          if (action == 'cancel') {
            info.urlParam.dropColumn = -1
            saveRef.value.save()
          }
          return
        })
    })
    return false
  }

  info.maxTableHeight = window.innerHeight - 480
  window.addEventListener('resize', () => {
    window.setTimeout(() => {
      info.maxTableHeight = window.innerHeight - 480
    }, 500)
  })

  watch(
    () => info.dsType,
    (now, old) => {
      if (now == 'oracle') {
        info.dbLength = 25
      } else {
        info.dbLength = 50
      }
    }
  )
</script>

<style lang="scss" scoped>
  .el-form--inline .el-form-item {
    display: inline-flex;
    margin-right: 0px;
    vertical-align: middle;
  }

  .move-btn {
    cursor: move;
  }

  :deep(.bizTableClass) {
    .el-form-item {
      width: 100%;
    }
  }
</style>
