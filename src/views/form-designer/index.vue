<template>
  <div class="ab-form-design">
    <ab-form-design
      :custom-fields="customFields"
      :options="options"
      style="height: 100vh"
      @submit="handleSubmit"
    />
  </div>
</template>
<script>
  import { createApp } from 'vue'
  export default {
    name: 'App',
    data() {
      return {
        customFields: [
          {
            title: '分割线',
            component: 'el-divider', //ele分割线
            span: 24,
            icon: 'el-icon-eleme',
            tips: '看我：自定义属性怎么用？',
            labelWidth: '0px',
            params: {
              html: '<h3 style="color:red">分割线标题</h3>',
              contentPosition: 'left',
            },
          },
          {
            title: 'Tab页',
            component: 'el-tab', //ele分割线
            span: 24,
            icon: 'el-icon-eleme',
            tips: '',
            labelWidth: '0px',
            params: {
              html: '<h3 style="color:red">分割线标题</h3>',
              contentPosition: 'left',
            },
          },
          {
            title: '警告',
            component: 'el-alert',
            labelWidth: '0px',
            span: 24,
            icon: 'el-icon-warning',
            tips: '看我：自定义事件怎么用？',
            params: {
              title: '警告警告警告警告',
              type: 'success',
            },
            event: {
              close: () => {
                console.log('alert关闭事件')
              },
            },
          },
        ],
        options: `{
        column: [
          {
            label: '预览查看下方字段联动',
            span: 24,
            labelPosition: 'top',
            labelWidth: 120
          },
          {
            type: 'switch',
            label: '控制显隐',
            span: 24,
            display: true,
            value: '0',
            dicData: [
              {
                label: '',
                value: '0'
              },
              {
                label: '',
                value: '1'
              }
            ],
            prop: '1629695558953_19833',
            change: ({ value }) => {
              const input = this.findObject(this.option.column, 'input')
              if (input == -1) return
              if (value == 0) {
                input.display = false
              } else {
                input.display = true
              }
            }
          },
          {
            type: 'input',
            label: '单行文本',
            span: 24,
            display: true,
            prop: 'input'
          },
          {
            type: 'select',
            label: '值改变',
            dicData: [
              {
                label: '一天',
                value: '1'
              },
              {
                label: '两天',
                value: '2'
              },
              {
                label: '三天',
                value: '3'
              }
            ],
            cascader: [],
            span: 24,
            display: true,
            props: {
              label: 'label',
              value: 'value'
            },
            prop: '1629695859796_23456',
            change: ({ value }) => {
              let text = value
              if (value) {
                text = '请假 ' + value + ' 天'
              }
              this.form.input2 = value
            }
          },
          {
            type: 'input',
            label: '单行文本',
            span: 24,
            display: true,
            prop: 'input2'
          }
        ],
      }`,
      }
    },
    methods: {
      handleSubmit(val) {
        this.$message.success('查看控制台')
      },
    },
  }
</script>

<style>
  .ab-form-design .el-form-item__content {
    flex-wrap: wrap-reverse !important;
  }
  #app {
    height: 100%;
    min-height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    margin: 0;
  }
</style>
