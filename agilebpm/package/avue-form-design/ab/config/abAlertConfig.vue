<template>
  <div class="widget-config">
    <el-form
      :model="data"
      label-suffix="："
      labelPosition="right"
      labelWidth="90px"
      @submit.prevent
    >
      <el-form-item
        label="文案"
        prop="text"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input
          v-model="data.text"
          clearable
          show-word-limit
          placeholder="请输入文案（回车可换行）"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="textType">
        <el-radio-group v-model="data.textType">
          <el-radio-button label="success">成功</el-radio-button>
          <el-radio-button label="info">信息</el-radio-button>
          <el-radio-button label="warning">警告</el-radio-button>
          <el-radio-button label="error">错误</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="主题" prop="light">
        <el-radio-group v-model="data.effect">
          <el-radio-button label="light">浅色</el-radio-button>
          <el-radio-button label="dark">深色</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示图标" prop="showIcon">
        <el-switch
          v-model="data.showIcon"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>

      <el-form-item label="控件栅格">
        <el-slider
          v-model="data.span"
          :max="24"
          :min="4"
          show-stops
          :step="1"
          style="width: 90%"
        />
        <el-radio-group v-model.number="data.span">
          <el-radio-button label="24">一列</el-radio-button>
          <el-radio-button label="12">两列</el-radio-button>
          <el-radio-button label="8">三列</el-radio-button>
          <el-radio-button label="6">四列</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'ab-alert-config',
    props: ['data'],
    components: {},
    setup() {
      return {}
    },
    computed: {},
    data() {
      return {}
    },
    mounted() {},
    methods: {},
  }
</script>
