<template>
  <div class="widget-config">
    <el-form
      :model="data"
      label-suffix="："
      labelPosition="left"
      labelWidth="90px"
      @submit.prevent
    >
      <el-form-item
        label="文案"
        prop="text"
      >
        <el-input
          v-model="data.text"
          clearable
          show-word-limit
          placeholder="请输入文案"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="data.text"
        label="文案位置"
        prop="contentPosition"
      >
        <el-radio-group v-model="data.contentPosition">
          <el-radio-button label="left">左侧</el-radio-button>
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="right">右侧</el-radio-button>
        </el-radio-group>
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
  name: 'ab-divider-config',
  props: ['data'],
  components: {},
  setup() {
    return {
    }
  },
  computed: {
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  },
}
</script>
