<template>
  <div class="widget-config">
    <el-form
      label-suffix="："
      @submit.prevent
      v-if="data && Object.keys(data).length > 0"
      labelPosition="right"
      labelWidth="90px"
      :model="data"
    >
      <el-form-item label="tabs编码">
        <el-tag>{{ data.code }}</el-tag>
      </el-form-item>
      <el-form-item
        prop="label"
        label="tabs描述"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input
          v-model="data.label"
          clearable
          placeholder="请输入描述"
          maxlength="10"
          show-word-limit
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="修改tabs栅格" label-width="110px">
        <el-radio-group v-model.number="span" @change="setSpan">
          <el-radio-button label="24">一列</el-radio-button>
          <el-radio-button label="12">两列</el-radio-button>
          <el-radio-button label="8">三列</el-radio-button>
          <el-radio-button label="6">四列</el-radio-button>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="类型">
        <el-radio-group v-model.number="span" @change="setType">
          <el-radio-button label="">默认</el-radio-button>
          <el-radio-button label="card">card</el-radio-button>
          <el-radio-button label="border-card"></el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="width: 100%">
      <h2
        style="width: 100%; text-align: center; border-bottom: 1px solid #eee"
      >
        tabs配置
      </h2>
      <el-radio-group v-model="data.defaultValue">
        <div
          class="tab_config"
          v-for="(item, dindex) in data.tabsColumn"
          :key="dindex"
        >
          <el-radio :label="item.index" size="large">
            <template></template>
          </el-radio>
          <el-input
            v-model="item.label"
            placeholder="请输入标签名称"
          ></el-input>
          <el-button
            style="margin-left: 12px"
            class="delete"
            title="清空"
            circle
            plain
            size="small"
            type="warning"
            :icon="Brush"
            @click.stop="clearColumn(dindex)"
          ></el-button>
          <el-button
            style="margin-left: 12px"
            class="delete"
            title="删除"
            circle
            plain
            size="small"
            type="danger"
            :icon="Delete"
            @click.stop="delColumn(dindex)"
          ></el-button>
        </div>
      </el-radio-group>
      <el-button
        type="primary"
        style="width: 100%; margin-top: 12px"
        :icon="Plus"
        @click.stop="addColumn"
      >
        增加
      </el-button>
    </div>
  </div>
</template>

<script>
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { ElMessage } from 'element-plus'
  import { Delete, Plus, Brush } from '@element-plus/icons-vue'
  export default {
    name: 'widget-table',
    props: ['data', 'form'],
    computed: {},
    data() {
      return {
        collapse: ['1'],
        span: '',
        Delete: Delete,
        Plus: Plus,
        Brush: Brush,
      }
    },
    mounted() {
      this.span = this.data.tabsType
      console.log(this.data)
      if (!this.data.buttons && this.data.subTable) {
        this.data.buttons = abUtil.clone(this.defaultBtns)
      }
    },
    methods: {
      setSpan() {
        console.info(this.data)
        this.data.children.column.forEach((c) => {
          c.span = this.span
        })
        ElMessage({
          message: '修改栅格成功',
          type: 'success',
        })
        this.span = 0
      },
      setType(name) {
        console.log(name)
        this.data.tabsType = name
      },
      addColumn(c) {
        let index = abUtil.Arrays.getNextSn(this.data.tabsColumn, 'index')
        this.data.tabsColumn.push({
          label: '标签' + index,
          index: index,
          children: {
            column: [],
          },
        })
      },
      clearColumn(index) {
        this.data.tabsColumn[index].children.column = []
      },
      delColumn(index) {
        let b = false
        if (this.data.defaultValue == this.data.tabsColumn[index].index) {
          //默认值被删了
          b = true
        }
        this.data.tabsColumn.splice(index, 1)
        this.data.control = this.data.tabsColumn[0].index
        if (b) {
          this.data.defaultValue = this.data.tabsColumn[0].index
        }
      },
      addButton(b) {
        this.data.buttons.push(b)
      },
    },
  }
</script>
<style scoped>
  .tab_config {
    display: flex;
    align-items: center;
    margin-top: 6px;
  }
</style>
