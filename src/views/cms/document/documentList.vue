<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <initTree
          :is-super="false"
          :search="search"
          @init-search="initSearchFn"
          @search="searchFn"
        />
      </el-aside>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <el-row class="vab-query-form">
              <el-col class="top-panel">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  label-width="90px"
                  :model="query"
                  style="float: left"
                  @submit.prevent
                >
                  <el-form-item label="文档名称" prop="name$VLK">
                    <el-input
                      v-model="query.name$VLK"
                      placeholder="请输入文档名称"
                    />
                  </el-form-item>
                  <el-form-item label="附件类型" prop="fileType$VLK">
                    <el-select
                      v-model="query.fileType$VLK"
                      allow-create
                      default-first-option
                      filterable
                      :placeholder="$abT('page.common.all','全部')"
                      clearable
                    >
                      <el-option value="html" />
                      <el-option value="doc" />
                      <el-option value="xls" />
                      <el-option value="ppt" />
                      <el-option value="pdf" />
                      <el-option value="jpg" />
                      <el-option value="png" />
                      <el-option value="gif" />
                      <el-option value="txt" />
                      <el-option value="mp4" />
                      <el-option value="exe" />
                      <el-option value="dat" />
                    </el-select>
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
                <el-space wrap>
                  <router-link
                    v-ab-btn-rights:cmsDocument_add
                    :to="{
                      name: 'DocumentEdit',
                      query: {
                        type: '1',
                        source: 'DocumentList',
                        parentId: item.fieldId,
                      },
                    }"
                  >
                    <el-button :icon="Plus" type="primary">添加</el-button>
                  </router-link>
                  <el-button
                    v-ab-btn-rights:cmsDocument_batchDownload
                    :disabled="!selectedData || selectedData.length == 0"
                    :icon="Download"
                    :loading="item.pldownLoading"
                    type="primary"
                    @click="batchDownload(selectedData)"
                  >
                    批量下载
                  </el-button>
                </el-space>
              </el-col>
            </el-row>
          </div>
          <!-- 关键字段设置minwith，特定枚举字段设置with（管理列、日期、状态、字典等），
         不重要字段放最后，管理列设置 fixed="right"
    -->
          <ab-table
            ref="abTable"
            v-model="selectedData"
            :checkable="false"
            :height="tableHeight"
            :query-param="query"
            row-key="id"
            :url="cmsApi.document.cmsDocumentListUrl"
          >
            <ab-column :selectable="selectable" type="selection" whdth="60" />
            <ab-column label="文档名称" min-width="160" prop="name" />
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="创建时间"
              prop="createTime"
              width="140"
            />
            <ab-column label="创建人" prop="creator" width="100" />
            <ab-column label="附件大小" prop="fileTotalSize" width="90" />
            <ab-column
              ab-template="fileType"
              label="附件类型"
              prop="fileType"
              width="110"
            />
            <template #fileType="{ scope }">
              <span v-if="scope.row.fileType && scope.row.fileType.length > 0">
                <el-tag
                  v-for="i in scope.row.fileType.split(',')"
                  :key="i"
                  class="mx-1"
                >
                  {{ i }}
                </el-tag>
              </span>
            </template>
            <ab-column label="所属部门" prop="createOrgName" width="100" />
            <ab-column
              ab-template="rightsName"
              label="查看权限"
              prop="rightsName"
              width="110"
            />
            <template #rightsName="{ scope }">
              <span
                v-if="scope.row.rightsName && scope.row.rightsName.length > 0"
              >
                <el-tag
                  v-for="i in scope.row.rightsName.split(',')"
                  :key="i"
                  class="mx-1"
                >
                  {{ i }}
                </el-tag>
              </span>
            </template>
            <ab-column label="阅读量" prop="readNum" width="70" />
            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="335"
            />
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="更新时间"
              min-width="140"
              prop="updateTime"
            />
            <ab-column label="更新人" prop="updater" width="100" />
            <template #edit="{ scope }">
              <el-button
                v-if="scope.row.grant != 1"
                v-ab-btn-rights:cmsDocument_borrow
                text
                type="primary"
                @click="openDialog(scope.row.id)"
              >
                借阅
              </el-button>

              <router-link
                v-if="scope.row.grant == 1"
                v-ab-btn-rights:cmsDocument_get
                :to="{
                  name: 'DocumentEdit',
                  query: { id: scope.row.id, source: 'DocumentList' },
                }"
              >
                <el-button
                  text
                  type="primary"
                  @click="proxy.clearSelectedData(), search()"
                >
                  查看
                </el-button>
              </router-link>

              <el-button
                v-if="scope.row.grant == 1"
                v-ab-btn-rights:cmsDocument_download
                :loading="item.downLoading && item.downId == scope.row.id"
                text
                type="primary"
                @click="download(scope.row)"
              >
                下载
              </el-button>

              <router-link
                v-if="scope.row.my == 1"
                :to="{
                  name: 'DocumentEdit',
                  query: {
                    id: scope.row.id,
                    type: '1',
                    source: 'DocumentList',
                  },
                }"
              >
                <el-button text type="primary">编辑</el-button>
              </router-link>

              <el-button
                v-if="scope.row.favorite == 0"
                v-ab-btn-rights:cmsDocument_update
                text
                type="primary"
                @click="proxy.clearSelectedData(), favorite(scope.row.id, 1)"
              >
                收藏
              </el-button>

              <el-button
                v-if="scope.row.favorite == 1"
                v-ab-btn-rights:cmsDocument_update
                text
                type="primary"
                @click="favorite(scope.row.id, 0)"
              >
                取消收藏
              </el-button>

              <el-button
                v-if="scope.row.my == 1"
                text
                type="primary"
                @click="
                  sendAction(
                    cmsApi.document.cmsDocumentRemoveUrl + scope.row.id,
                    '确定删除' + scope.row.name + '吗?'
                  )
                "
              >
                删除
              </el-button>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>

    <!-- 以下为借阅弹出框内容 -->
    <el-dialog
      v-model="item.dialogVisible"
      draggable
      title="借阅登记"
      width="30%"
    >
      <span>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="info"
          :status-icon="false"
        >
          <el-form-item
            label="借阅说明"
            prop="content"
            required
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input
              v-model="info.content"
              rows="3"
              style="max-width: 1077px"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="item.dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { abTableMix, cmsApi } from '~/agilebpm'
  export default {
    name: 'DocumentList',
    mixins: [abTableMix],
  }
</script>

<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { sysApi, abTools } from '~/agilebpm'
  import initTree from './components/initTree.vue'
  import { Search, Plus, RefreshRight, Download } from '@element-plus/icons-vue'
  // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
  const query = reactive({
    name$VLK: '',
    fileType$VLK: '',
    parentId$VIN: '',
  })
  // @ts-ignore
  const { proxy } = getCurrentInstance()
  //弹出框绑定的from
  const formRef = ref()
  //弹出框绑定的from表单数据
  const info = reactive({
    id: '',
    content: '',
  })
  //弹出框绑定的from表单数据
  const item = reactive({
    fieldId: '',
    dialogVisible: false,
    downLoading: false,
    pldownLoading: false,
    downId: '',
  })

  //选中禁用筛选
  const selectable = (row: any) => row.grant != 0

  const submitForm = () => {
    formRef.value.validate((valid: any) => {
      if (valid) {
        borrow(info)
        item.dialogVisible = false
      } else {
        ElMessage({
          showClose: true,
          message: '请填写借阅说明!',
          type: 'warning',
        })
      }
    })
  }

  //打开借阅弹出框
  const openDialog = (id: string) => {
    info.id = id
    info.content = ''
    item.dialogVisible = true
  }

  //借阅
  const borrow = (info: any) => {
    cmsApi.document
      .borrowDoc(info)
      .then(() => {
        proxy.search()
        ElMessage({
          message: '借阅申请已提交',
          type: 'success',
        })
      })
      .catch(() => {})
  }

  //下载单个文档的多个附件
  const download = async (doc: any) => {
    //导出上传的文件
    item.downId = doc.id
    item.downLoading = true
    if (doc.files && doc.files.length > 0) {
      const filesArray = JSON.parse(doc.files)
      let errNames = ''
      for (const i in filesArray) {
        const file = filesArray[i]
        try {
          const rel = await abTools.downBySteam(file.id, file.name)
          if (!rel) {
            errNames += errNames ? file.name : `,${file.name}`
          }
          if (errNames) {
            ElMessage.error(
              `下载失败！文件中包含不存在的文件【${errNames}】，请尝试单独下载`
            )
          } else {
            ElMessage.success('下载成功')
          }
        } catch {
          item.downLoading = false
        }
      }
    }

    //导出富文本框的内容
    cmsApi.document.getById(doc.id).then((rel) => {
      if (rel.data.content && rel.data.content.length > 0) {
        abTools.downImgFile(`${rel.data.outline}.html`, rel.data.content)
      }
      proxy.clearSelectedData()
      proxy.search()

      item.downLoading = false
      item.downId = ''
    })
  }

  //批量下载多个文档
  const batchDownload = (selectedData: any[]) => {
    const noBorrowArr = selectedData.filter((s) => s.grant == 0)
    const borrowArr = selectedData.filter((s) => s.grant == 1)
    const arrName = noBorrowArr.map((s) => s.name).join(',')
    if (borrowArr.length == 0) {
      ElMessage({
        message: `选择的数据[${arrName}]暂无权限,请重新选择!`,
        type: 'warning',
      })
    } else {
      if (borrowArr.length == selectedData.length) {
        batchDown(selectedData)
      } else {
        ElMessageBox.confirm(
          `选择的数据[${arrName}]暂无权限,是否下载勾选的其他文件？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(() => {
          batchDown(borrowArr)
        })
      }
    }
  }

  const batchDown = async (selectedData: any) => {
    item.pldownLoading = true
    try {
      const rel = await cmsApi.document.downloadZip(selectedData)
      if (rel == 200) {
        ElMessage.success('下载成功')
      } else {
        ElMessage.error('下载失败！文件中包含不存在的文件，请尝试单独下载')
      }
      proxy.search()
      item.pldownLoading = false
    } catch {
      ElMessage.error('下载失败！文件中包含不存在的文件，请尝试单独下载')
      item.pldownLoading = false
    }
  }

  const initSearchFn = (childIds: string, id: string) => {
    query.parentId$VIN = id == '0' ? '' : childIds
    item.fieldId = id
    console.log(childIds, id)
    proxy.search()
  }

  const searchFn = () => {
    query.name$VLK = ''
    query.fileType$VLK = ''
    query.parentId$VIN = ''
    proxy.search()
  }

  //收藏/取消收藏
  const favorite = (id: string, favorite: number) => {
    cmsApi.document.favoriteDoc(id, favorite).then(() => {
      proxy.search()
      ElMessage({
        message: `${favorite ? '' : '取消'}收藏成功`,
        type: 'success',
      })
    })
  }
</script>
