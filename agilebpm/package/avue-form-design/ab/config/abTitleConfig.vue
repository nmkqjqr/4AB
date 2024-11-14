<template>
  <div class="widget-config">
    <el-form
      :model="data"
      label-suffix="："
      labelPosition="right"
      labelWidth="90px"
    >
      <el-form-item label="标题">
        <el-input
          v-model="data.text"
          clearable
          show-word-limit
          placeholder="请输入标题"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="data.text" label="标题位置">
        <el-radio-group v-model="data.position">
          <el-radio-button label="left">左侧</el-radio-button>
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="right">右侧</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="字体大小">
        <el-input-number
          v-model="data.fontSize"
          :min="5"
          :step="5"
          controls-position="right"
          placeholder="请输入字体大小"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-color-picker
          v-model="data.fontColor"
          popper-class="colorDiaStyle"
          :predefine="predefineColors"
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
    name: 'ab-title-config',
    props: ['data'],
    components: {},
    setup() {
      return {}
    },
    computed: {},
    data() {
      return {
        predefineColors: [
          '#000000',
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          '#90ee90',
          '#00ced1',
          '#1e90ff',
          '#c71585',
          'rgba(255, 69, 0, 0.68)',
          'rgb(255, 120, 0)',
          'hsv(51, 100, 98)',
          'hsva(120, 40, 94, 0.5)',
          'hsl(181, 100%, 37%)',
          'hsla(209, 100%, 56%, 0.73)',
          '#c7158577',
        ],
      }
    },
    mounted() {},
    methods: {},
  }
</script>
