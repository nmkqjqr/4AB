<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree" width="266px">
        <ab-dict-tree
          v-model="query.typeCode$VIN"
          :operation-ignore-admin="false"
          type-code="fileType"
          @node-click="nodeClickFn"
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
                  :model="query"
                  style="float: left"
                  @submit.prevent
                >
                  <el-form-item
                    label="附件名"
                    label-width="76px"
                    prop="name$VLK"
                  >
                    <el-input
                      v-model="query.name$VLK"
                      placeholder="请输入附件名"
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
              <el-col class="top-panel">
                <el-form-item label="" prop="source">
                  存储类型:
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
            :url="sysApi.sysFile.sysFileListUrl"
          >
            <ab-column label="附件名称" min-width="160" prop="name" />
            <ab-column label="字典分类" min-width="100" prop="typeCodeName" />
            <ab-column
              ab-text-formatter="db-数据库|oss-oss|minio-minio|disk-磁盘"
              label="存储类型"
              prop="uploader"
              width="100"
            />
            <ab-column label="附件路径" prop="path" width="300" />
            <ab-column ab-date-formatter="yyyy-MM-dd HH:mm" label="创建时间" prop="createTime" width="160" />
            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="90"
            />
            <template #edit="{ scope }">
              <el-button
                v-ab-btn-rights:sysFile_download
                text
                type="primary"
                @click="download(scope.row)"
              >
                下载
              </el-button>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  import { abTableMix, abDictTree } from '~/agilebpm'
  export default {
    name: 'SysFileList',
    mixins: [abTableMix],
  }
</script>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import { sysApi, abTools } from '~/agilebpm'
  import { Search, RefreshRight } from '@element-plus/icons-vue'
  import treeSelect from './component/treeSelect.vue'
  // @ts-ignore
  const { proxy } = getCurrentInstance()
  // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
  const query = reactive({
    name$VLK: '',
    typeCode$VIN: '',
    uploader$VLK: '',
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
        name: '数据库',
        code: 'db',
      },
      {
        checked: false,
        name: 'oss',
        code: 'oss',
      },
      {
        checked: false,
        name: 'minio',
        code: 'minio',
      },
      {
        checked: false,
        name: '磁盘',
        code: 'disk',
      },
    ],
  })

  //切换来源
  const changeTag = (item: any) => {
    info.tagList.forEach((tagItem) => (tagItem.checked = false))
    item.checked = true
    query.uploader$VLK = item.code
    proxy.search()
  }

  //下载附件
  const download = (file: any) => {
    if (file.id) {
      abTools.downFile(file)
      // sysApi.sysFile.downloadFile(file.id).then((result) => {
      //   abTools.downImgFile(file.name, result)
      // })
    }
    // ElMessage({
    //   message: '操作成功',
    //   type: 'success',
    // })
  }

  //点击树触发查询操作
  const nodeClickFn = (row: any) => {
    query.typeCode$VEQ = row.parentId === '0' ? '' : row.code
    proxy.search()
  }
</script>

<style scoped>
  .range {
    margin-right: 0px;
    margin-left: 15px;
  }
</style>
