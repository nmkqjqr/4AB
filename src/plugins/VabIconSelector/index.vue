<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <vab-query-form>
        <vab-query-form-top-panel>
          <el-form :inline="true" label-width="0" @submit.prevent>
            <el-form-item label="">
              <el-input v-model="queryForm.title" />
            </el-form-item>
            <el-form-item label-width="0">
              <el-button native-type="submit" type="primary" @click="queryData">
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-top-panel>
      </vab-query-form>
    </el-col>

    <el-col v-for="(item, index) in queryIcon" :key="index" :span="6">
      <vab-card shadow="hover" @click="handleIcon(item)">
        <vab-icon :icon="item" />
      </vab-card>
    </el-col>
    <el-col :span="24">
      <el-pagination
        :background="background"
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-col>
  </el-row>
</template>

<script>
  export default defineComponent({
    name: 'VabIconSelector',
    emits: ['handle-icon'],
    data() {
      return {
        icon: '24-hours-fill',
        layout: 'total, prev, next',
        total: 0,
        background: true,
        height: 0,
        selectRows: '',
        queryIcon: [],
        queryForm: {
          pageNo: 1,
          pageSize: 16,
          title: '',
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        const {
          data: { list, total },
        } = await getIconList(this.queryForm)
        this.queryIcon = list
        this.total = total
      },
      handleIcon(item) {
        this.icon = item
        this.$emit('handle-icon', item)
      },
    },
  })
</script>

<style lang="scss">
  .icon-selector-popper {
    .el-card__body {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 20px;
      cursor: pointer;

      i {
        font-size: 28px;
        color: var(--el-color-grey);
        text-align: center;
        vertical-align: middle;
        pointer-events: none;
        cursor: pointer;
      }
    }

    .el-pagination {
      margin: 0;
    }
  }
</style>
