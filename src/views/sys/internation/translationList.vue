<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <div
          class="treeBoxHeight"
          style="padding: 10px"
          :style="{
            height: packageTreeOptions.height,
            width: '100%',
          }"
        >
          <el-tree
            :data="packageTreeOptions.data"
            :default-expanded-keys="packageTreeOptions.leftKeys"
            :expand-on-click-node="false"
            :highlight-current="true"
            node-key="id"
            :props="packageTreeOptions.props"
            @node-click="packageTreeOptions.nodeClick"
          >
            <template #default="{ data }">
              <span :title="data.name">
                {{ data.name }}
              </span>
            </template>
          </el-tree>
        </div>
      </el-aside>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <el-row class="vab-query-form">
              <el-col class="top-panel">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  label-width="62px"
                  :model="data.query.queryParam"
                  @submit.prevent
                >
                  <el-form-item
                    :label="$abT('page.common.code', '编码')"
                    prop="key$VLK"
                  >
                    <el-input
                      v-model="data.query.queryParam.key$VLK"
                      placeholder=" "
                    />
                  </el-form-item>
                  <!-- <el-form-item :label="$abT('page.common.desc','描述')" prop="name$VLK">
                    <el-input
                      v-model="data.query.queryParam.name$VLK"
                      placeholder=" "
                    />
                  </el-form-item> -->
                  <el-form-item
                    :label="$abT('page.common.translate', '翻译')"
                    prop="json$VLK"
                  >
                    <el-input
                      v-model="data.query.queryParam.json$VLK"
                      placeholder=" "
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      {{ $abT('page.common.search', '查询') }}
                    </el-button>
                    <el-button :icon="RefreshRight" @click="reset()">
                      {{ $abT('page.common.reset', '重置') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col class="left-panel">
                <el-button
                  v-ab-btn-rights:internation_add
                  :icon="Plus"
                  type="primary"
                  @click="addlist()"
                >
                  {{ $abT('page.common.add', '添加') }}
                </el-button>
                <el-button
                  v-ab-btn-rights:internation_save
                  :icon="Check"
                  :loading="data.saveLoading"
                  type="primary"
                  @click="save()"
                >
                  {{ $abT('page.common.batchSave', '批量保存') }}
                </el-button>
                <el-button
                  v-ab-btn-rights:internation_get
                  :icon="Printer"
                  type="primary"
                  @click="getjs"
                >
                  {{ $abT('page.internation.getJs', '获取js') }}
                </el-button>
                <el-button
                  v-ab-btn-rights:internation_get
                  :icon="Refresh"
                  type="primary"
                  @click="dialogVisible = true"
                >
                  同步国际化数据
                </el-button>
              </el-col>
            </el-row>
          </div>
          <el-table
            ref="abTable"
            v-loading="data.loading"
            :data="data.tableData"
            :height="tableHeight"
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column
              :label="$abT('page.common.code', '编码')"
              min-width="300"
              prop="key"
            >
              <template #default="scope">
                <ab-tooltip-tag
                  v-if="scope.row.id && scope.row.id.length > 0"
                  :text="scope.row.key"
                />
                <ab-tooltip-input
                  v-else
                  v-model="scope.row.key"
                  placeholder=" "
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="$abT('page.common.copy', '复制')"
              prop="key"
              width="200"
            >
              <template #default="scope">
                <el-button @click="handleCopy(scope.row, $event)">
                  $t(key)
                </el-button>
                <el-button @click="handleCopydk(scope.row.key, $event)">
                  <span>{</span>
                  <span>{key</span>
                  <span>}}</span>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-for="item in data.listData"
              :key="item.id"
              :label="item.name"
              min-width="160"
              prop="key"
            >
              <template #header="scope">
                <span>{{ scope.column.label }}</span>
                <el-button
                  :icon="CopyDocument"
                  type="text"
                  @click="paste(item)"
                />
              </template>
              <template #header v-if="item.key === 'zh-CN'">
                {{ item.name }}
                <el-button
                  :icon="DArrowRight"
                  style="float: right"
                  @click="translateMutiRowText"
                />
              </template>
              <template #default="scope">
                <el-input
                  v-if="item.key === 'zh-CN'"
                  v-model="scope.row.jsonObject[item.key]"
                  :placeholder="item.name"
                >
                  <template #append>
                    <el-button
                      :icon="DArrowRight"
                      @click="translateText(scope.row.jsonObject)"
                    />
                  </template>
                </el-input>
                <ab-tooltip-input
                  v-else
                  v-model="scope.row.jsonObject[item.key]"
                  :placeholder="item.name"
                />
              </template>
            </el-table-column>
            <!-- <el-table-column
              :label="$abT('page.common.desc', '描述')"
              min-width="200"
              prop="name"
            >
              <template #default="scope">
                <ab-tooltip-input v-model="scope.row.name" placeholder=" " />
              </template>
            </el-table-column> -->

            <el-table-column
              format="yyyy-MM-dd HH:mm"
              :label="$abT('page.common.updateTime', '更新时间')"
              min-width="160"
              prop="updateTime"
            />
            <el-table-column
              :label="$abT('page.common.updater', '更新人')"
              min-width="120"
              prop="updater"
            />
            <el-table-column
              fixed="right"
              :label="$abT('page.common.operate', '操作')"
              prop="key"
              width="200"
            >
              <template #default="scope">
                <el-button
                  v-ab-btn-rights:internation_copy
                  :icon="Plus"
                  text
                  type="primary"
                  @click="copylist(scope.row)"
                >
                  {{ $abT('page.common.copy', '复制') }}
                </el-button>
                <el-button
                  v-ab-btn-rights:internation_del
                  :icon="Delete"
                  text
                  type="primary"
                  @click="remove(scope.row, scope.$index)"
                >
                  {{ $abT('page.common.del', '删除') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            v-model:currentPage="data.query.currentPage"
            v-model:page-size="data.query.pageSize"
            :background="true"
            :disabled="false"
            layout="prev, pager, next, jumper,total, sizes"
            :page-sizes="[2, 5, 10, 20, 30, 40, 50]"
            :total="data.total"
            @current-change="translationFn"
            @size-change="translationFn"
          />
        </div>
      </el-main>
    </el-container>
    <el-dialog
      v-model="dialogVisible"
      :before-close="handleClose"
      title="同步国际化数据"
      width="400"
    >
      <span style="color: red">
        注意：同步会清除此分类下的所有数据（例：同步字典清除sysDict开头的所有字典相关的翻译），并根据现有的所有数据自动翻译并重新生成。
      </span>

      <div style="margin-top: 20px">
        <el-button
          :loading="loadingRef"
          style="flex: 1"
          type="primary"
          @click="syncDict"
        >
          同步字典
        </el-button>
      </div>
      <div style="margin-top: 20px">
        <el-button
          :loading="loadingRef"
          style="flex: 1"
          type="primary"
          @click="syncDialog"
        >
          同步自定义对话框
        </el-button>
      </div>
      <div style="margin-top: 20px">
        <el-button
          :loading="loadingRef"
          style="flex: 1"
          type="primary"
          @click="syncGrid"
        >
          同步自定义列表
        </el-button>
      </div>

      <div style="margin-top: 20px">
        <el-button
          :loading="loadingRef"
          style="flex: 1"
          type="primary"
          @click="syncMenu"
        >
          同步菜单
        </el-button>
      </div>
      <div style="margin-top: 20px">
        <el-button
          :loading="loadingRef"
          style="flex: 1"
          type="primary"
          @click="syncApp"
        >
          同步应用
        </el-button>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  import { abUtil, bizApi, getData, postData, sysApi } from '~/agilebpm'
  export default {
    name: 'TranslationList',
  }
</script>
<script setup>
  import { abT } from '@/i18n'
  import {
    Check,
    CopyDocument,
    DArrowRight,
    Delete,
    Plus,
    Printer,
    Refresh,
    RefreshRight,
    Search,
  } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { onMounted, reactive, ref } from 'vue'
  import { checkIsPublicProject } from '~/agilebpm/utils/ab-util'
  checkIsPublicProject()
  const queryForm = ref(null)
  const dialogVisible = ref()
  const data = reactive({
    query: {
      pageSize: 10,
      currentPage: 1,
      sortColumn: '',
      sortOrder: '',
      queryParam: {
        key$VLK: '',
        name$VLK: '',
      },
    },
    total: 0,
    loading: false,
    tableData: [],
    listData: [],
    saveLoading: false,
  })
  // 声明方法
  const languageFn = () => {
    sysApi.sysInternation.getLanguageList().then((result) => {
      data.listData = result.data.filter((item) => item.enabled == 1)
    })
  }
  // 声明方法
  const translationFn = () => {
    data.loading = true
    postData(sysApi.sysInternation.translationList, data.query).then(
      (result) => {
        data.tableData = result.data.rows
        data.tableData.forEach((item) => {
          item.jsonObject = JSON.parse(item.json)
        })
        data.total = result.data.total
        data.loading = false
      },
      () => {}
    )
  }
  // 搜索
  const search = () => {
    translationFn()
  }
  // 重置
  const reset = () => {
    queryForm.value.resetFields()
    data.query.queryParam['keyPackage'] = ''
    data.query.currentPage = 1
    translationFn()
  }
  // 添加行内表格
  const addlist = () => {
    const obj = {}
    data.listData.forEach((item) => {
      obj[item.key] = ''
    })
    data.tableData.unshift({
      name: '',
      key: '',
      jsonObject: obj,
    })
  }
  // 批量保存
  const save = () => {
    let str = ''
    data.tableData.forEach((item, index) => {
      if (item.key && item.key !== null && item.key.length > 0) {
        item.json = JSON.stringify(item.jsonObject)
      } else {
        str += `${t('page.internation.emptyTip', { a: index + 1 })} \n`
      }
    })
    if (str.length > 0) {
      ElMessage({
        showClose: true,
        message: str,
        type: 'warning',
      })
    } else {
      data.saveLoading = true
      postData(sysApi.sysInternation.saveOrUpdate, data.tableData).then(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (result) => {
          data.saveLoading = false
          ElMessage({
            message: abT('page.common.operateSuccess', '操作成功'),
            type: 'success',
          })
          translationFn()
          packageTreeOptions.fetchData()
        },
        () => {
          data.saveLoading = false
        }
      )
    }
  }
  // 获取js 操作
  const getjs = () => {
    sysApi.sysInternation.getLangs([]).then(({ data }) => {
      ElMessage({ message: abT('page.internation.getJsTip','已将菜单JS打印至控制台！'), type: 'success' })
      console.info('下方为国际化翻译数据js对象:')
      console.info(data)
    })
  }
  // 删除操作
  const remove = (item, index) => {
    if (item.id) {
      ElMessageBox.confirm(abT('page.portal.sureDel','确定删除吗？'),abT('page.common.prompt','提示'), {
        confirmButtonText: abT('page.common.ok','确定'),
        cancelButtonText: abT('page.common.cancel','取消'),
        type: 'warning',
      })
        .then(() => {
          getData(sysApi.sysInternation.removeTranslation + item.id, {}).then(
            ({ msg }) => {
              ElMessage({
                showClose: true,
                message: msg,
                type: 'success',
              })
              translationFn()
            }
          )
        })
        .catch(() => {})
    } else {
      data.tableData.splice(index, 1)
    }
  }
  // 行内赋值操作
  const copylist = (item) => {
    const obj = JSON.parse(JSON.stringify(item))
    delete obj['id']
    data.tableData.unshift(obj)
  }
  // 赋值key
  const handleCopy = (row, event) => {
    abUtil.handleClipboard(
      `$abT('${row.key}','${row.jsonObject['zh-CN']}')`,
      event
    )
  }

  const handleCopydk = (key, event) => {
    abUtil.handleClipboard(`{{ $t('${key}') }}`, event)
  }

  const translateText = (rowData) => {
    // 获取中文文本
    const chineseText = rowData['zh-CN']
    if (!chineseText) {
      ElMessage({ message: t('page.internation.chineseTip'), type: 'info' })
      return
    }
    const toLanguages = data.listData
      .filter((item) => item.key !== 'zh-CN')
      .map((item) => item.key)
    // 无翻译内容
    if (!toLanguages || !toLanguages.length) {
      return
    }
    sysApi.sysInternation
      .autoTranslate(chineseText, toLanguages)
      .then((resp) => {
        resp.data.forEach((item) => {
          if (item.errorMsg) {
            ElMessage({ message: item.errorMsg, type: 'error' })
          } else {
            rowData[item.language] = item.dstText
          }
        })
        ElMessage({
          message: `翻译完成`,
          type: 'success',
        })
      })
      .finally(() => (data.loading = false))
  }

  /**
   * 翻译多行文本
   */
  const translateMutiRowText = () => {
    const languages = data.listData
      .map((item) => item.key)
      .filter((k) => k !== 'zh_CN')

    let n = 0

    data.tableData.forEach((rowData) => {
      const chineseText = rowData.jsonObject['zh-CN']
      // 未填写文本不做翻译
      if (!chineseText) return
      // 无空白文本不做翻译
      const toLanguages = languages.filter((k) => !rowData.jsonObject[k])
      if (!toLanguages || !toLanguages.length) return
      n++
      sysApi.sysInternation
        .autoTranslate(chineseText, toLanguages)
        .then((resp) => {
          resp.data.forEach((item) => {
            if (item.errorMsg) {
              ElMessage({ message: item.errorMsg, type: 'error' })
            } else {
              rowData.jsonObject[item.language] = item.dstText
            }
          })
        })
        .finally(() => {
          if (--n === 0) {
            ElMessage({
              message: `翻译完成`,
              type: 'success',
            })
          }
        })
    })
  }

  const packageTreeOptions = reactive({
    data: [],
    props: { children: 'children', label: 'name' },
    height: `${window.innerHeight - (110 + 32 + 20 + 60)}px`,
    leftKeys: [''],
    nodeClick(node) {
      data.query.queryParam['keyPackage'] = node.id
      data.query.currentPage = 1
      search()
    },
    async fetchData() {
      sysApi.sysInternation.getPackages().then(({ data }) => {
        packageTreeOptions.data = [
          {
            name: '全部',
            root: true,
            id: '',
            children: [...data],
          },
        ]
      })
    },
  })

  onMounted(() => {
    languageFn()
    translationFn()
    packageTreeOptions.fetchData()
  })

  // 快速粘贴进入
  const paste = async (language) => {
    const text = await navigator.clipboard.readText()
    if (!text) return
    const arrText = text.split('\r\n')
    ElMessageBox.confirm(arrText, '确定粘贴以下字典吗？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      for (let index = 0; index < arrText.length; index++) {
        const element = arrText[index]
        if (data.tableData.length > index) {
          data.tableData[index].jsonObject[language.key] = element.trim()
        }
      }

      ElMessage({
        type: 'success',
        message: '操作成功！',
      })
    })
  }

  const loadingRef = ref()
  const syncDict = () => {
    loadingRef.value = true
    postData(sysApi.dict.internation).then(() => {
      setTimeout(function () {
        ElMessage.success(abT('page.common.operateSuccess', '操作成功'))
        loadingRef.value = false
      }, 5000)
    })
  }

  const syncDialog = () => {
    loadingRef.value = true
    postData(bizApi.customDialog.internation).then(() => {
      setTimeout(function () {
        ElMessage.success(abT('page.common.operateSuccess', '操作成功'))
        loadingRef.value = false
      }, 5000)
    })
  }

  const syncGrid = () => {
    loadingRef.value = true
    postData(bizApi.custGrid.internation).then(() => {
      setTimeout(function () {
        ElMessage.success(abT('page.common.operateSuccess', '操作成功'))
        loadingRef.value = false
      }, 5000)
    })
  }

  const syncMenu = () => {
    loadingRef.value = true
    postData(sysApi.resourceAuth.internation).then(() => {
      setTimeout(function () {
        ElMessage.success(abT('page.common.operateSuccess', '操作成功'))
        loadingRef.value = false
      }, 5000)
    })
  }

  const syncApp = () => {
    loadingRef.value = true
    postData(sysApi.authApplication.internation).then(() => {
      setTimeout(function () {
        ElMessage.success(abT('page.common.operateSuccess', '操作成功'))
        loadingRef.value = false
      }, 5000)
    })
  }
</script>
