<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            label-width="70px"
            :model="query"
            style="float: left"
            @submit.prevent
          >
            <el-form-item label="文档名称" prop="name$VLK">
              <el-input v-model="query.name$VLK" placeholder="请输入文档名称" />
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
              <el-button :icon="RefreshRight" @click="reset()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="top-panel">
          <el-form-item label="" prop="source">
            来源:
            <div>
              <el-check-tag
                v-for="(item, index) in info.tagList"
                :key="index"
                :checked="item.checked"
                class="range"
                @change="changeTag(item)"
              >
                {{ item.name }}
              </el-check-tag>
            </div>
          </el-form-item>
        </el-col>
        <el-col class="left-panel">
          <el-space wrap>
            <router-link
              v-ab-btn-rights:myDocument_add
              :to="{
                name: 'DocumentEdit',
                query: { type: '1', source: 'MyDocumentList' },
              }"
            >
              <el-button :icon="Plus" type="primary">添加</el-button>
            </router-link>
            <el-button
              v-ab-btn-rights:myDocument_batchDownload
              :disabled="!selectedData || selectedData.length == 0"
              :icon="Download"
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
      :url="cmsApi.document.myDocPageUrl"
    >
      <ab-column :selectable="selectable" type="selection" whdth="60" />
      <ab-column label="文档名称" min-width="160" prop="name" />
      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        label="创建时间"
        prop="createTime"
        width="160"
      />
      <ab-column label="创建人" prop="creator" width="100" />
      <ab-column label="附件大小" prop="fileTotalSize" width="100" />
      <ab-column
        ab-template="fileType"
        label="附件类型"
        prop="fileType"
        width="140"
      />
      <ab-column
        ab-text-formatter="my-我的|pass-借阅通过|borrow-借阅中|favorite-收藏"
        label="来源"
        prop="status"
        width="95"
      />
      <template #fileType="{ scope }">
        <span v-if="scope.row.fileType && scope.row.fileType.length > 0">
          <el-tag
            v-for="item in scope.row.fileType.split(',')"
            :key="item"
            class="mx-1"
          >
            {{ item }}
          </el-tag>
        </span>
      </template>
      <ab-column label="所属部门" prop="createOrgName" width="100" />
      <ab-column
        ab-template="rightsName"
        label="查看权限"
        prop="rightsName"
        width="180"
      />
      <template #rightsName="{ scope }">
        <span v-if="scope.row.rightsName && scope.row.rightsName.length > 0">
          <el-tag
            v-for="item in scope.row.rightsName.split(',')"
            :key="item"
            class="mx-1"
          >
            {{ item }}
          </el-tag>
        </span>
      </template>
      <ab-column label="阅读量" prop="readNum" width="70" />
      <ab-column label="借阅量" prop="borrowNum" width="70" />
      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        label="更新时间"
        min-width="140"
        prop="updateTime"
      />
      <ab-column label="更新人" prop="updater" width="100" />
      <ab-column ab-template="edit" fixed="right" label="操作" width="450" />
      <template #edit="{ scope }">
        <router-link
          v-if="scope.row.grant == 1"
          v-ab-btn-rights:myDocument_get
          :to="{
            name: 'DocumentEdit',
            query: { id: scope.row.id, source: 'MyDocumentList' },
          }"
        >
          <el-button text type="primary" @click="proxy.clearSelectedData()">
            查看
          </el-button>
        </router-link>

        <el-button
          v-if="scope.row.grant == 1"
          v-ab-btn-rights:myDocument_download
          text
          type="primary"
          @click="proxy.clearSelectedData(), download(scope.row)"
        >
          下载
        </el-button>

        <router-link
          v-if="scope.row.my == 1"
          v-ab-btn-rights:myDocument_edit
          :to="{
            name: 'DocumentEdit',
            query: { id: scope.row.id, type: '1', source: 'MyDocumentList' },
          }"
        >
          <el-button text type="primary">编辑</el-button>
        </router-link>

        <el-button
          v-if="scope.row.favorite == 0"
          v-ab-btn-rights:myDocument_update
          text
          type="primary"
          @click="proxy.clearSelectedData(), favorite(scope.row.id, 1)"
        >
          收藏
        </el-button>

        <el-button
          v-if="scope.row.favorite == 1"
          v-ab-btn-rights:myDocument_update
          text
          type="primary"
          @click="proxy.clearSelectedData(), favorite(scope.row.id, 0)"
        >
          取消收藏
        </el-button>

        <ab-cust-dialog
          v-if="scope.row.my == 1"
          v-ab-btn-rights:myDocument_borrowRecord
          dialog-key="borrowRecord"
          :param="{ document_id_$VEQ: scope.row.id }"
          style="display: inline-block"
          text
          type="primary "
        >
          借阅记录
        </ab-cust-dialog>

        <el-button
          v-if="scope.row.my == 1"
          v-ab-btn-rights:myDocument_del
          text
          type="primary"
          @click="
            sendAction(
              cmsApi.document.cmsDocumentRemoveUrl + scope.row.id,
              `确定删除${scope.row.name}吗?`
            )
          "
        >
          删除
        </el-button>
      </template>
    </ab-table>
  </div>
</template>

<script lang="ts">
  import { abTableMix } from '~/agilebpm'
  export default {
    name: 'MyDocumentList',
    mixins: [abTableMix],
  }
</script>

<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { sysApi, cmsApi, abTools } from '~/agilebpm'
  import { Search, Plus, RefreshRight, Download } from '@element-plus/icons-vue'
  // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
  const query = reactive({
    name$VLK: '',
    fileType$VLK: '',
    source: '',
  })
  const info = reactive({
    tagList: [
      {
        checked: true,
        name: '不限',
        code: '',
      },
      {
        checked: false,
        name: '收藏',
        code: 'favorite',
      },
      {
        checked: false,
        name: '我的',
        code: 'my',
      },
      {
        checked: false,
        name: '借阅通过',
        code: 'pass',
      },
    ],
  })
  // @ts-ignore
  const { proxy } = getCurrentInstance()
  //切换来源
  const changeTag = (item: any) => {
    info.tagList.forEach((tagItem) => (tagItem.checked = false))
    item.checked = true
    query.source = item.code
    proxy.search()
  }
  //选中禁用筛选
  const selectable = (row: any, index: number) => {
    return row.status != 'borrow'
  }

  //下载单个文档的多个附件
  const download = (doc: any) => {
    //导出上传的文件
    if (doc.files && doc.files.length > 0) {
      const filesArray = JSON.parse(doc.files)
      for (const i in filesArray) {
        sysApi.sysFile.downloadFile(filesArray[i].id).then((result) => {
          abTools.downImgFile(filesArray[i].name, result)
        })
      }
    }
    //导出富文本框的内容
    cmsApi.document.getById(doc.id).then((rel) => {
      if (rel.data.content && rel.data.content.length > 0) {
        abTools.downImgFile(`${rel.data.outline}.html`, rel.data.content)
      }
    })
    proxy.search()
    ElMessage({
      message: '操作成功',
      type: 'success',
    })
  }

  //批量下载多个文档
  const batchDownload = (selectedData: any[]) => {
    const borrowArr = selectedData.filter((s) => s.status == 'borrow')
    if (borrowArr.length > 0) {
      selectedData = selectedData.filter((s) => s.status != 'borrow')
      const arrName = borrowArr.map((s) => s.name).join(',')
      if (selectedData.length == 0) {
        ElMessage({
          message: `选择的数据[${arrName}]暂无权限,请重新选择!`,
          type: 'warning',
        })
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
          cmsApi.document.downloadZip(selectedData)
          proxy.search()
          ElMessage({
            message: '操作成功',
            type: 'success',
          })
        })
      }
    } else {
      cmsApi.document.downloadZip(selectedData)
      proxy.search()
      ElMessage({
        message: '操作成功',
        type: 'success',
      })
    }
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
<style scoped>
  .mypopperclass .el-radio,
  .el-radio__inner,
  .el-radio__input {
    position: absolute;
    display: none;
  }
  .range {
    margin-right: 0px;
    margin-left: 15px;
  }

  .el-table .DisableSelection .cell .el-checkbox__inner {
    position: relative;
    display: none;
  }
  .el-table .DisableSelection .cell:before {
    position: absolute;
    content: '';
  }
</style>
