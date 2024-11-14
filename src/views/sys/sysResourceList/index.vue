<template>
  <div class="common-layout" style="overflow: hidden">
    <div class="left-box" width="350px">
      <tree
        ref="treeRef"
        :loading-des="state.loading"
        @add-fn="addaFn"
        @enable-app-fn="enableAppFn"
        @export-resource="exportResource"
        @import-resource="importResource"
        @reset-fields="resetFields"
        @update-api-button-data="updateApiButtonDataFn"
        @update-fetchdata="updatedesdata"
        @update-loading="loadingFn"
      />
    </div>
    <div class="right-box">
      <div v-show="state.form.parentId">
        <div v-if="state.isSave" class="flex" style="padding: 15px">
          <el-button
            v-ab-btn-rights:menu_edit
            :loading="state.saveloading"
            type="primary"
            @click="saveFn"
          >
            保存
          </el-button>
          <el-button v-ab-btn-rights:menu_edit @click="cancelFn">
            取消
          </el-button>
        </div>
        <div v-else class="flex" style="padding: 15px">
          <el-button v-ab-btn-rights:menu_edit type="primary" @click="editFn">
            编辑
          </el-button>
          <!-- <el-button
              v-if="state.form.id && state.form.id.length > 0"
              @click="removeFn"
            >
              删除
            </el-button> -->
        </div>
        <el-divider style="margin: 0 0 20px 0" />
        <el-form
          ref="formRef"
          v-loading="state.loading"
          :inline="false"
          label-width="100px"
          :model="state.form"
          :rules="state.rules"
        >
          <el-form-item
            label="菜单"
            prop="name"
            :rules="[
              { required: true, message: '必填', trigger: 'blur' },
              { max: 50, message: '最多可输入50个字符' },
            ]"
          >
            <ab-pinyin
              v-model="state.form.name"
              v-model:to="state.form.code"
              :disabled="!state.isSave"
            />
          </el-form-item>
          <el-form-item label="上级菜单" prop="parentName">
            <span>{{ state.form.parentName }}</span>
          </el-form-item>
          <!-- 编码限制暂时去掉 -->
          <!-- v-if="state.BizValidatorMap.varirule"
          state.BizValidatorMap.varirule.rule -->
          <el-form-item
            label="编码"
            prop="code"
          >
            <ab-code
              v-model="state.form.code"
              :disabled="!!state.form.id"
              placeholder="菜单编码，全局唯一"
            />
          </el-form-item>
          <el-form-item label="菜单路由" prop="url">
            <el-input
              v-model="state.form.url"
              :disabled="!state.isSave"
              placeholder="请输入菜单路由"
            />
          </el-form-item>
          <!-- <el-form-item label="类型" prop="type">
            <el-radio-group v-model="state.form.type" :disabled="!state.isSave">
              <el-radio-button label="menu">菜单</el-radio-button>
              <el-radio-button label="button">按钮</el-radio-button>
              <el-radio-button label="API">API</el-radio-button>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="状态" prop="enable">
            <el-radio-group
              v-model="state.form.enable"
              :disabled="!state.isSave"
            >
              <el-radio-button :label="0">禁用</el-radio-button>
              <el-radio-button :label="1">启用</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="默认展开" prop="opened">
            <el-radio-group
              v-model="state.form.opened"
              :disabled="!state.isSave"
            >
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="打开方式" prop="openWith">
            <el-radio-group
              v-model="state.form.openWith"
              :disabled="!state.isSave"
            >
              <el-radio :label="1">跳转</el-radio>
              <el-radio :label="0">新页签</el-radio>
              <el-radio :label="2">新窗口</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="state.enableApp == 1"
            label="手机端图标"
            prop="icon"
          >
            <ab-choose-svg v-model="state.form.icon"  :disabled="!state.isSave"/>
            <svg-icon
              :icon="state.form.icon"
              style="width: 30px; height: 30px; margin-left: 12px"
            />
          </el-form-item>
          <el-form-item v-else label="字体图标" prop="icon">
            <choose-icon-new
              v-model="state.form.icon"
              :disabled="!state.isSave"
            />
          </el-form-item>

          <el-form-item label="排序">
            <span>保存后自动生成</span>
          </el-form-item>

          <el-form-item label="鉴权资源" style="padding-right: 20px">
            <el-table border="1" :data="state.form.resources">
              <el-table-column label="资源名称" prop="name">
                <template #default="scopeJson">
                  <el-input
                    v-model="scopeJson.row.name"
                    :disabled="!state.isSave"
                    placeholder="请输入资源名称"
                    size="small"
                  />
                </template>
              </el-table-column>
              <el-table-column label="鉴权接口" prop="url">
                <template #default="scopeJson">
                  <el-input
                    v-model="scopeJson.row.url"
                    :disabled="!state.isSave"
                    placeholder="请输入鉴权接口"
                    size="small"
                  />
                </template>
              </el-table-column>

              <el-table-column
                fixed="right"
                label="操作"
                prop="enable"
                width="120"
              >
                <template #header>
                  <el-button
                    v-ab-btn-rights:resource_add
                    :disabled="!state.isSave"
                    size="small"
                    text
                    type="primary"
                    @click="addFormResourceApi"
                  >
                    添加
                  </el-button>
                </template>

                <template #default="scope">
                  <el-button
                    v-ab-btn-rights:resource_del
                    :disabled="!state.isSave"
                    size="small"
                    type="text"
                    @click="
                      delResource(
                        state.form.resources,
                        scope.$index
                      )
                    "
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item label="菜单按钮" style="padding-right: 20px">
            <el-table
              border="1"
              :data="state.apiButtonTableData"
              :expand-row-keys="state.expandedRowKeys"
              row-key="index"
            >
              <el-table-column type="expand">
                <template #default="props">
                  <div m="4">
                    <el-button
                      v-ab-btn-rights:btn_resource_add
                      :disabled="!state.isSave"
                      size="small"
                      text
                      type="primary"
                      @click="addBtnResourceApi(props.row, props.$index)"
                    >
                      添加资源
                    </el-button>
                    <el-table
                      border="1"
                      :data="state.apiButtonTableData[props.$index].resources"
                      :header-cell-style="{
                        background: 'white !important',
                        'box-shadow': 'none !important',
                      }"
                    >
                      <el-table-column label="资源名称" prop="name">
                        <template #default="scopeJson">
                          <el-input
                            v-model="scopeJson.row.name"
                            :disabled="!state.isSave"
                            placeholder="请输入资源名称"
                            size="small"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column label="鉴权接口" prop="url">
                        <template #default="scopeJson">
                          <el-input
                            v-model="scopeJson.row.url"
                            :disabled="!state.isSave"
                            placeholder="请输入鉴权接口"
                            size="small"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column fixed="right" label="操作" width="120">
                        <template #header>
                          <span>操作</span>
                        </template>

                        <template #default="scope">
                          <el-button
                            v-ab-btn-rights:btn_resource_del
                            :disabled="!state.isSave"
                            size="small"
                            type="text"
                            @click="
                              delResource(
                                state.apiButtonTableData[props.$index]
                                  .resources,
                                scope.$index
                              )
                            "
                          >
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="名称" prop="name" width="">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.name"
                    :disabled="!state.isSave"
                    placeholder="请输入名称"
                    size="small"
                  />
                </template>
              </el-table-column>
              <el-table-column label="编码" prop="code">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.code"
                    :disabled="!state.isSave"
                    placeholder="请输入编码"
                    size="small"
                  />
                </template>
              </el-table-column>
              <el-table-column label="按钮路由" min-width="120" prop="url">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.url"
                    :disabled="!state.isSave"
                    placeholder="请输入按钮路由"
                    size="small"
                  />
                </template>
              </el-table-column>
              <el-table-column label="状态" prop="enable" width="120">
                <template #default="scope">
                  <el-radio-group
                    v-model="scope.row.enable"
                    :disabled="!state.isSave"
                    size="small"
                  >
                    <el-radio-button :label="0">禁用</el-radio-button>
                    <el-radio-button :label="1">启用</el-radio-button>
                  </el-radio-group>
                </template>
              </el-table-column>

              <el-table-column
                fixed="right"
                label="操作"
                prop="enable"
                width="120"
              >
                <template #header>
                  <el-button
                    v-ab-btn-rights:resource_btn_add
                    :disabled="!state.isSave"
                    size="small"
                    text
                    type="primary"
                    @click="addBtnApi"
                  >
                    添加
                  </el-button>
                </template>
                <template #default="scope">
                  <el-button
                    v-ab-btn-rights:resource_btn_del
                    :disabled="!state.isSave"
                    size="small"
                    type="text"
                    @click="delApiButton(scope.row, scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="!state.form.parentId">
        <el-empty description="点击左侧资源查看详情" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import tree from './components/tree'
  import RemixIcon from './components/remixIcon'
  import { abChooseSvg, abUtil, chooseIconNew, svgIcon } from '~/agilebpm'
  import { useRoutesStore } from '@/store/modules/routes'
  const $baseLoading = inject('$baseLoading')
  const formRef = ref('formRef')
  const treeRef = ref('treeRef')
  import { bizApi, authApi, registerApi } from '~/agilebpm'
  const state = reactive({
    BizValidatorMap: {},
    form: {
      name: '',
      code: '',
      url: '',
      type: 'menu',
      enable: 1,
      opened: 0,
      openWith: 0,
      icon: '',
      children: [],
      checked: false,
      resources: [],
    },
    rules: {
      name: [{ required: true, trigger: 'blur', message: '必填' }]
    },
    saveloading: false,
    loading: false,
    isSave: false,
    enableApp: 0,
    apiButtonTableData: [],
    expandedRowKeys: [],
    num: 1,
    delBtnList:[],
  })
  bizApi.bizPattern.getAllBizValidator().then((data) => {
    state.BizValidatorMap = data
  })
  const addBtnApi = () => {
    state.apiButtonTableData.unshift({
      index: state.num,
      name: '',
      code: '',
      url: '',
      type: 'button',
      enable: 1,
      opened: 0,
      openWith: 0,
      parentId: state.form.id,
      appId: state.form.appId,
      resources: [],
    })
    state.num = state.num + 1
  }

  const addBtnResourceApi = (row, index) => {
    if (!row.resources) {
      row.resources = []
    }
    row.resources.unshift({
      name: '',
      url: '',
    })
  }

  const addFormResourceApi = () => {
    if (!state.form.resources) {
      state.form.resources = []
    }
    state.form.resources.unshift({
      name: '',
      url: '',
    })
  }
  // 更新右侧详细信息
  const updatedesdata = (data) => {
    // state.isSave = true
    state.form = data
    state.isSave = false
  }
  // loading框控制
  const loadingFn = (bool) => {
    state.loading = bool
  }
  // 点击编辑
  const editFn = () => {
    state.isSave = true
  }
  // 取消
  const cancelFn = () => {
    formRef.value.clearValidate()
    state.isSave = false
  }
  // 保存
  const saveFn = () => {
    formRef.value.validate(async (valid) => {
      if (state.delBtnList.length>0){
        for (const item of state.delBtnList) {
          await authApi.removeResource({id: item})
        }
        state.delBtnList.splice(0)
      }
      if (valid) {
        let apiButton = true
        if (state.apiButtonTableData.length > 0) {
          state.apiButtonTableData.forEach((buttonItem) => {
            if (buttonItem.name && buttonItem.code) {
              if (buttonItem.name.length <= 0 || buttonItem.code.length <= 0) {
                apiButton = false
              }
            } else {
              apiButton = false
            }

            buttonItem.type = 'button'
            if (buttonItem.resources && buttonItem.resources.length > 0) {
              buttonItem.resources.forEach((item) => {
                if (item.name && item.url) {
                  if (item.name.length <= 0 || item.url.length <= 0) {
                    apiButton = false
                  }
                } else {
                  apiButton = false
                }
              })
            }
          })
        }
        if (state.form.resources && state.form.resources.length > 0) {
          state.form.resources.forEach((res) => {
            if (res.name.length <= 0 || res.url.length <= 0) {
              apiButton = false
            }
          })
        }
        if (!apiButton) {
          ElMessage({
            type: 'error',
            message: '请完善关联资源信息',
            onClose: () => {},
          })
          return false
        }
        state.saveloading = true
        try {
          authApi.saveResource(state.form).then(
            (data) => {
              state.form.children =
                state.apiButtonTableData.length > 0
                  ? state.apiButtonTableData
                  : []
              state.form.id = data.data
              authApi.saveTreeUrl(state.form).then(
                (dataTree) => {
                  ElMessage({
                    type: 'success',
                    message: '保存成功',
                    onClose: () => {},
                  })
                  state.saveloading = false
                  // 刷新树形
                  treeRef.value.fetchTreeDataAndData(data.data)
                  state.isSave = false

                  // 更新左侧菜单
                  const routers = useRoutesStore()
                  registerApi.getUserInfo().then((dataIfnfo) => {
                    if (dataIfnfo.data.userMenuList) {
                      routers.setMenus(dataIfnfo.data.userMenuList)
                    }
                  })
                },
                () => {
                  state.saveloading = false
                }
              )
            },
            () => {
              state.saveloading = false
            }
          )
        } catch (err) {
          state.saveloading = false
        }
      }
    })
  }
  const resetFields = () => {
    state.form = {}
  }
  const exportResource = (row) => {
    authApi.exportResource(row)
  }

  // 点击左侧树添加
  const addaFn = (row) => {
    state.isSave = true
    state.loading = true
    setTimeout(() => {
      formRef.value.resetFields()
      state.form = {
        name: '',
        code: '',
        url: '',
        type: 'menu',
        enable: 1,
        opened: 0,
        openWith: 0,
        icon: '',
        children: [],
        checked: false,
        resources: [],
      }
      state.apiButtonTableData = []
      Object.assign(state.form, {
        appId: row.appId,
        parentId: row.id,
      })
      state.form.parentName = row.name
      state.loading = false
    }, 500)
  }

  //平台类型
  const enableAppFn = (enableApp) => {
    state.enableApp = enableApp
    state.form.parentId = false
  }

  //更新按钮数据
  const updateApiButtonDataFn = (data) => {
    state.apiButtonTableData = state.form.children
    state.apiButtonTableData.forEach((item) => {
      item.index = item.id
    })
  }

  // const expandOpen = async (row, expandedRows) => {
  //   state.expandedRowKeys.splice(0)
  //   state.expandedRowKeys.concat(expandedRows)
  //   const index = expandedRows.indexOf(row)
  //   if (index > -1) {
  //     state.expandedRowKeys.splice(index, 1)
  //   }else{
  //     state.expandedRowKeys.push(row)
  //   }
  // }

  const delResource = ( row, index) => {
    abUtil.Arrays.del(index, row)
  }

  const delApiButton = (itme,index) => {
    abUtil.Arrays.del(index,state.apiButtonTableData)
    state.delBtnList.push(itme.id)
  }
</script>

<style lang="scss" scoped>
  $base: '.menu-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
  .selectstyle {
    width: 100%;
    margin-bottom: 10px;
  }
  .custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    font-size: 14px;
  }
  .left-box {
    float: left;
    width: 350px;
    border-right: 10px solid #f5f7f9;
  }
  .right-box {
    float: left;
    width: calc(100% - 350px);
  }
</style>
