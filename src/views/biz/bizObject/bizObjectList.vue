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
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <!--查询区域-->
            <el-row>
              <el-col class="top-panel" :span="24">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  label-width="62px"
                  :model="query"
                >
                  <el-form-item label="名称" prop="name$VLK">
                    <el-input
                      v-model="query.name$VLK"
                      placeholder="请输入名称"
                    />
                  </el-form-item>
                  <el-form-item label="编码" prop="code$VLK">
                    <el-input
                      v-model="query.code$VLK"
                      placeholder="请输入编码"
                    />
                  </el-form-item>

                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      查询
                    </el-button>
                    <el-button :icon="Refresh" @click="reset()">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <!--按钮区域-->
            <el-space wrap>
              <router-link
                v-ab-btn-rights:bizObject_add
                :to="{
                  name: 'BizObjectEdit',
                  query: { typeCode: query.typeCode$VEQ },
                }"
              >
                <el-button :icon="Plus" type="primary">添加</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:bizObject_del
                :disabled="!selectedData || selectedData.length == 0"
                :icon="Delete"
                type="danger"
                @click="delBySeletedIds(bizApi.bizObject.BizObjectRemove)"
              >
                批量删除
              </el-button>
            </el-space>
          </div>
          <!--列表区域-->
          <ab-table
            ref="abTable"
            v-model="selectedData"
            :height="tableHeight"
            highlight-current-row
            is-have-tree
            :query-param="query"
            row-key="id"
            :url="bizApi.bizObject.BizObjectListJson"
          >
            <ab-column label="名称" prop="name" />
            <ab-column label="编码" prop="code" />
            <ab-column label="持久化方式" prop="persistenceTypeName" />
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="更新时间"
              prop="updateTime"
              width="140"
            />
            <ab-column label="更新人" prop="updator" width="100" />
            <ab-column ab-template="edit" fixed="right" label="操作" />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:bizObject_edit
                :to="{
                  name: 'BizObjectEdit',
                  query: { id: scope.row.id },
                }"
              >
                <el-button text type="primary">编辑</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:bizObject_view
                text
                type="primary"
                @click="open(scope.row)"
              >
                查看结构
              </el-button>
              <el-button
                v-ab-btn-rights:bizObject_del
                text
                type="primary"
                @click="
                  sendAction(
                    bizApi.bizObject.BizObjectRemove + scope.row.id,
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

    <el-dialog
      v-model="dialogVisible"
      destroy-on-close
      :title="`业务对象【${bo.name}】数据结构`"
      width="600px"
    >
      <el-input v-model="boData" autosize readonly type="textarea" />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import { abTableMix, abDictTree, bizApi, abUtil } from '~/agilebpm'
  import { Search, Refresh, Plus } from '@element-plus/icons-vue'
  export default {
    name: 'BizObjectList',
    components: { abDictTree },
    mixins: [abTableMix],
    setup() {
      if (abUtil.checkIsPublicProject(true)) {
        const confim = confirm(
          '体验高级功能需要技术指导，请跳过业务对象设计，直接使用【简单表单设计】模式创建表单即可！'
        )

        window.location.href = '/biz/bizForm/bizFormDesignList'
      }

      return {
        bizApi,
        abDictTree,
        Search,
        Refresh,
        Plus,
      }
    },
    data() {
      return {
        dialogVisible: false,
        boData: null,
        bo: {
          name: '未知',
        },
      }
    },
    methods: {
      open(row) {
        bizApi.bizObject.getBizObject(row.code).then(({ data }) => {
          this.bo = data
          this.boData = this.getJson(data.rel)
          this.dialogVisible = true
        })
      },
      getJson(rel) {
        const json = {}
        rel.table.columns.forEach((c) => {
          json[c.code] = c.comment
        })
        rel.children.forEach((r) => {
          if (r.type == 'oneToMany') {
            json[`${r.tableCode}List`] = [this.getJson(r)]
          } else {
            json[`${r.tableCode}`] = this.getJson(r)
          }
        })

        if (rel.type == 'main') {
          console.log(json)
          return JSON.stringify(json, null, '\t')
        }

        return json
      },
    },
  }
</script>
