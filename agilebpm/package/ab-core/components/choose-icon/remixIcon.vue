<template>
  <el-dialog v-model.sync="dialogVisble" title="图标">
    <div class="remix-icon-container">
      <el-row :gutter="20">
        <el-col :span="24" style="margin-bottom: 20px">
          <el-form :inline="true" label-width="80px" @submit.prevent>
            <el-form-item label="图标名称">
              <el-input v-model="queryForm.name" />
            </el-form-item>
            <el-form-item label-width="0">
              <el-button
                :icon="Search"
                native-type="submit"
                type="primary"
                @click="queryData"
              >
                查询
              </el-button>
            </el-form-item>
            <el-form-item v-if="icon.length > 0" label-width="0">
              <el-tag>{{ icon }}</el-tag>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col v-for="(item, index) in queryIcon" :key="index" :span="4">
          <vab-card shadow="hover" @click="handleCopyIcon(item, $event)">
            <vab-icon :icon="item" />
          </vab-card>
          <div class="icon-text" @click="handleCopyText(item, $event)">
            {{ item }}
          </div>
        </el-col>

        <el-col :span="24">
          <el-pagination
            background
            :current-page="queryForm.pageNo"
            :layout="layout"
            :page-size="queryForm.pageSize"
            :page-sizes="[72, 144, 216, 288]"
            :pager-count="4"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button text type="primary" @click="dialogVisble = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveIcon">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
  import { defineComponent, onMounted, reactive, toRefs, computed } from 'vue'
  import { sysApi, request } from '@agilebpm/api'
  import clip from '@/utils/clipboard'
  import { Search } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'RemixIcon',
    emits: ['save'],
    setup(props, { emit }) {
      const state = reactive({
        dialogVisble: false,
        queryIcon: [],
        icon: '',
        total: 0,
        queryForm: { pageNumber: 1, pageSize: 30, name: '' },
        layout: 'total, sizes, prev, pager, next, jumper',
      })
      // eslint-disable-next-line vue/return-in-computed-property
      const con = computed(() => {
        if (state.queryForm.name) {
          return state.queryIcon.filter(function (product) {
            return Object.keys(product).some(function (key) {
              return String(product[key]).toLowerCase().indexOf(Search) > -1
            })
          })
        }
      })
      const fetchData = async () => {
        request({
          url: sysApi.tools.getIcon,
          method: 'post',
          data: state.queryForm,
        }).then(
          (result) => {
            state.queryIcon = result.data.rows
            state.total = result.data.total
          },
          () => {}
        )
      }
      const handleSizeChange = (val) => {
        state.queryForm.pageSize = val
        fetchData()
      }
      const handleCurrentChange = (val) => {
        state.queryForm.pageNumber = val
        fetchData()
      }
      const queryData = () => {
        state.queryForm.pageNumber = 1
        fetchData()
      }
      const handleCopyText = (item, event) => {
        clip(item, event)
      }
      const handleCopyIcon = (item) => {
        state.icon = item
      }
      const open = (icon) => {
        state.dialogVisble = true
        state.icon = icon
      }
      const saveIcon = () => {
        state.dialogVisble = false
        emit('save', state.icon)
      }
      onMounted(() => {
        fetchData()
      })

      return {
        ...toRefs(state),
        handleSizeChange,
        handleCurrentChange,
        queryData,
        con,
        handleCopyText,
        handleCopyIcon,
        open,
        saveIcon,
        Search,
      }
    },
  })
</script>

<style lang="scss" scoped>
  @use 'sass:math';
  .remix-icon-container {
    :deep() {
      .el-card__body {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60px;
        max-height: 60px;
        padding: #{math.div($base-padding, 1.4)};
        cursor: pointer;

        i {
          font-size: 28px;
          color: var(--el-color-grey);
          text-align: center;
          pointer-events: none;
          cursor: pointer;
          transition: $base-transition;
        }

        &::after {
          position: absolute;
          bottom: -40px;
          width: 100%;
          padding: 4px 0;
          font-size: $base-font-size-small;
          color: rgb(255, 255, 255);
          text-align: center;
          content: '点击选择';
          background-color: var(--el-color-primary);
          transition: $base-transition;
        }

        &:hover {
          i {
            margin-top: -#{math.div($base-margin, 1.2)};
          }

          &::after {
            bottom: 0;
          }
        }
      }
    }

    .icon-text {
      height: 30px;
      overflow: hidden;
      font-size: 12px;
      line-height: 30px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .borderblue {
      border: 1px solid blue;
    }
  }
</style>
