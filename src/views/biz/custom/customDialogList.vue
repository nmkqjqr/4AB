<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query.typeCode$VIN"
          type-code="biz"
          @node-click="searchResetPage()"
        />
      </el-aside>
      <el-main>
        <div ref="titleForm">
          <el-row class="vab-query-form">
            <el-col class="top-panel">
              <el-form
                ref="queryForm"
                :inline="true"
                label-width="62px"
                :model="query"
                @submit.prevent
              >
                <el-form-item label="编码" prop="code$VLK">
                  <el-input
                    v-model="query.code$VLK"
                    placeholder="请输入编码"
                    @keyup.enter.native="search()"
                  />
                </el-form-item>
                <el-form-item label="名称" prop="name$VLK">
                  <el-input
                    v-model="query.name$VLK"
                    placeholder="请输入名称"
                    @keyup.enter.native="search()"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button :icon="Search" type="primary" @click="search()">
                    查询
                  </el-button>
                  <el-button :icon="RefreshRight" @click="reset()">
                    重置
                  </el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col class="left-panel">
              <router-link
                v-ab-btn-rights:custDialog_add
                to="/biz/custom/customDialogEdit"
              >
                <el-button :icon="Plus" type="primary">添加</el-button>
              </router-link>
            </el-col>
          </el-row>
        </div>
        <ab-table
          ref="abTable"
          v-model="selectedData"
          :checkable="false"
          :default-sort="{ order: 'dx', prop: 'createTime' }"
          :height="tableHeight"
          is-have-tree
          :query-param="query"
          row-key="id"
          :url="bizApi.customDialog.bizCustDialogUrl"
        >
          <ab-column label="编码" min-width="160" prop="code" />
          <ab-column label="名称" min-width="140" prop="name" />
          <ab-column label="对象名称" min-width="150" prop="objName" />
          <ab-column
            ab-template="dataSource"
            label="数据来源"
            min-width="120"
            prop="dataSource"
          />
          <template #dataSource="{ scope }">
            <span>{{ dataSourceSet(scope.row.dataSource) }}</span>
          </template>
          <ab-column
            ab-text-formatter="tree-树形-warning-dark|list-列表-success-dark"
            align="center"
            label="显示类型"
            prop="style"
            width="100"
          />
          <ab-column
            ab-template="objType"
            align="center"
            label="对象类型"
            prop="objType"
            width="100"
          />
          <template #objType="{ scope }">
            <el-tag
              v-if="scope.row.objType == 'view'"
              class="ml-2"
              effect="dark"
              type="warning"
            >
              视图
            </el-tag>
            <el-tag
              v-if="scope.row.objType == 'table'"
              class="ml-2"
              effect="dark"
              type="success"
            >
              表
            </el-tag>
            <span v-else></span>
          </template>
          <ab-column
            ab-text-formatter="0-否-warning-dark|1-是-success-dark"
            align="center"
            label="系统内置"
            prop="system"
            width="100"
          />
          <ab-column
            ab-date-formatter="yyyy-MM-dd HH:mm"
            label="更新时间"
            prop="updateTime"
            width="160"
          />
          <ab-column label="更新人" prop="updater" width="100" />
          <ab-column
            ab-template="edit"
            fixed="right"
            label="操作"
            width="320"
          />
          <template #edit="{ scope }">
            <router-link
              v-ab-btn-rights:custDialog_edit
              :to="{ name: 'CustomDialogEdit', query: { id: scope.row.id } }"
            >
              <el-button text type="primary">编辑</el-button>
            </router-link>
            <el-button
              v-ab-btn-rights:custDialog_getByCode
              text
              type="primary"
              @click="previewDialog(scope.row)"
            >
              预览对话框
            </el-button>
            <el-button
              v-ab-btn-rights:custDialog_listSimpleData
              text
              type="primary"
              @click="previewSearch(scope.row)"
            >
              预览查询
            </el-button>
            <el-button
              v-if="!scope.row.system"
              v-ab-btn-rights:custDialog_del
              text
              type="primary"
              @click="
                sendAction(
                  bizApi.customDialog.bizCustDialogremoveUrl + scope.row.id,
                  `确定删除吗?`
                )
              "
            >
              删除
            </el-button>
          </template>
        </ab-table>
      </el-main>
    </el-container>
    <el-dialog v-model="state.StringdialogVisible" title="预览" width="550px">
      <el-input
        v-model="state.dataString"
        :autosize="{ minRows: 5, maxRows: 20 }"
        readonly
        type="textarea"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="closeStringdialogVisibleFn">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <ab-cust-dialog
      ref="custDialogref"
      :dialog-key="state.dialogKey"
      :ispre="true"
      @ok="watchFn"
    />
  </div>
</template>
<script>
  import { abTableMix, bizApi, postData, sysApi, abDictTree } from '~/agilebpm'
  export default {
    name: 'CustomDialogList',
    mixins: [abTableMix],
  }
</script>
<script setup>
  import { reactive, ref } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { Search, RefreshRight, Plus } from '@element-plus/icons-vue'
  const custDialogref = ref(null)
  // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
  const query = reactive({
    code$VLK: '',
    name$VLK: '',
    typeCode$VIN: '',
  })
  const state = reactive({
    dialogKey: '',
    dataString: '',
    StringdialogVisible: false,
    loadingBox: false,
    BizCustDialogSourceTypeOption: [],
  })

  // 数据来源
  sysApi.tools
    .getEnum('com.dstz.biz.api.constant.BizCustDialogSourceType', true)
    .then(({ data }) => {
      state.BizCustDialogSourceTypeOption = data
    })

  const dataSourceSet = (value) => {
    let valueSet = ''
    state.BizCustDialogSourceTypeOption.forEach((item, index) => {
      if (value === item.key) {
        valueSet = item.desc
      }
    })
    return valueSet
  }

  // 预览对话框
  const previewDialog = (row) => {
    state.dialogKey = row.code
    nextTick(() => {
      custDialogref.value.openDialog()
    })
  }

  // 对话框OK事件
  const watchFn = (data) => {
    state.StringdialogVisible = true
    state.dataString = ''
    state.dataString = JSON.stringify(data)
  }
  // 处理查询条件
  const conditionFieldsdo = (row) => {
    const queryParam = {}
    if (row.length > 0) {
      // 需要修改
      row.forEach((element) => {
        if (element.valueSource === 'fixedValue') {
          queryParam[
            `${getlastStr(element.columnName)}$V${element.condition}`
          ] = element.value.text
        } else {
          queryParam[
            `${getlastStr(element.columnName)}$V${element.condition}`
          ] = ''
        }
      })
    }
    return queryParam
  }

  // 调整
  const getlastStr = (str) => {
    if (str[str.length - 1] === '_') {
      // return str.slice(0, str.length - 1)
      return str
    } else {
      return str
    }
  }

  // 预览查询事件 修改工具类
  const previewSearch = (row) => {
    state.StringdialogVisible = true
    state.loadingBox = true
    state.dataString = ''
    postData(bizApi.customDialog.listSimpleData + row.code, {
      pageSize: row.pageSize,
      currentPage: 1,
      queryParam: conditionFieldsdo(row.conditionFields),
    }).then(
      (result) => {
        state.loadingBox = false
        state.dataString = JSON.stringify(result.data, null, '\t')
      },
      () => {}
    )
  }
  // 关闭事件
  const closeStringdialogVisibleFn = () => {
    state.StringdialogVisible = false
    state.dataString = ''
  }
</script>
<style lang="scss">
  .abTable {
    .el-radio {
      .el-radio__label {
        display: none;
      }
    }
  }
  .CustDialogref {
    overflow: auto;
  }
</style>
