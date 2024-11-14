<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="DataSourceDefList"
        :form-ref="formRef"
        :save-data="info.data"
        :url="sysApi.dataSource.dataSourceDefSave"
      />
      <ab-load v-model="info.data" :url="sysApi.dataSource.dataSourceDefGet" />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="info.data"
          :status-icon="false"
        >
          <el-form-item
            label="名称"
            placeholder="请输入名称"
            prop="name"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="info.data.name" />
          </el-form-item>
          <el-form-item
            label="类路径"
            placeholder="请输入类路径"
            prop="classPath"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="info.data.classPath" />
            <el-button
              v-if="info.data.classPath"
              v-ab-btn-rights:dataSourceDef_init
              style="margin-left: 30px"
              type="primary"
              @click="initAttributeListFn"
            >
              初始化属性
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-table
              v-if="info.data.attributeList.length > 0"
              class="fieldListTable"
              :data="info.data.attributeList"
              row-key="name"
              style="width: 100%; height: 100%; overflow-y: auto"
            >
              <el-table-column label="名称" min-width="100px" prop="name" />
              <el-table-column
                v-slot="scope"
                label="描述"
                min-width="150px"
                prop="comment"
              >
                <el-input v-model="scope.row.comment" />
              </el-table-column>

              <el-table-column label="数值类型" prop="type" />
              <el-table-column label="是否必填" prop="required" width="100px">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.required"
                    active-text="是"
                    :active-value="true"
                    inactive-text="否"
                    :inactive-value="false"
                    inline-prompt
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="默认值"
                min-width="200px"
                prop="defaultValue"
              >
                <template #default="scope">
                  <el-input v-model="scope.row.value" />
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="130px">
                <template #default="scope">
                  <el-space>
                    <el-button
                      circle
                      class="move-btn"
                      :icon="Sort"
                      size="small"
                      type="primary"
                    />
                    <el-button
                      text
                      type="primary"
                      @click="operatorRow(scope.$index, 'del')"
                    >
                      删除
                    </el-button>
                  </el-space>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { sysApi, abUtil } from '~/agilebpm'
  import { Delete, Edit, Search, Sort } from '@element-plus/icons-vue'
  import Sortable from 'sortablejs'

  const formRef = ref()

  const info: any = reactive({
    data: {
      name: '',
      classPath: '',
      attributeList: [],
    },
  })

  const operatorRow = (index: number, operation: string) => {
    if (info.data.attributeList && info.data.attributeList.length > 0) {
      if (operation === 'del') {
        abUtil.Arrays.del(index, info.data.attributeList)
      } else if (operation === 'up') {
        abUtil.Arrays.up(index, info.data.attributeList)
      } else if (operation === 'down') {
        abUtil.Arrays.down(index, info.data.attributeList)
      } else if (operation === 'top') {
        abUtil.Arrays.top(index, info.data.attributeList)
      } else if (operation === 'bottom') {
        abUtil.Arrays.bottom(index, info.data.attributeList)
      }
    }
  }

  const initAttributeListFn = () => {
    sysApi.dataSource.initAttributeList(info.data.classPath).then((result) => {
      info.data.attributeList = result.data
    })
  }

  // 拖拽排序
  // 行拖拽
  const rowDrop = () => {
    setTimeout(() => {
      const table = document.querySelector(
        '.fieldListTable .el-table__body-wrapper tbody'
      )
      Sortable.create(table, {
        animation: 300,
        handle: '.move-btn',
        onEnd: (evt: any) => {
          const t = info.data.attributeList.splice(evt.oldIndex, 1)[0]
          info.data.attributeList.splice(evt.newIndex, 0, t)
          info.data.attributeList.forEach((item: any, index: any) => {
            item.sn = index + 1
          })
        },
      })
    })
  }
  let i = 0
  watch(
    () => info.data.attributeList,
    (value) => {
      if (value.length > 0 && i < 2) {
        rowDrop()
        i++
      }

      return
    },
    { immediate: true }
  )
</script>
