<template>
  <div class="config" :key="info.key">
    <el-tabs v-model="configTab" stretch>
      <el-tab-pane label="表单属性" name="form" lazy style="padding: 0 10px">
        <form-config
          :data="form"
          :form="form"
          :is-oracle="isOracle"
        ></form-config>
      </el-tab-pane>
      <!--子表属性-->
      <el-tab-pane
        v-if="['group', 'dynamic'].includes(widgetSelect.type)"
        label="子表属性"
        name="widget"
        style="padding: 0 10px"
      >
        <widget-table :data="widgetSelect" :form="form" :is-oracle="isOracle" />
      </el-tab-pane>
      <!--tabs属性-->
      <el-tab-pane
        v-else-if="widgetSelect.type == 'tabs'"
        label="tabs配置"
        name="widget"
        style="padding: 0 10px"
      >
        <widget-tabs :data="widgetSelect" :form="form" :is-oracle="isOracle" />
      </el-tab-pane>
      <!--辅助控件属性-->
      <el-tab-pane
        v-else-if="
          [
            'tabs',
            'divider',
            'title',
            'alert',
            'content',
            'iframe',
            'button',
            'verificationCode',
          ].includes(widgetSelect.type)
        "
        :label="`${widgetSelect.title}配置`"
        name="widget"
        style="padding: 0 10px"
      >
        <div class="widget-config">
          <el-form
            label-suffix="："
            labelPosition="right"
            labelWidth="90px"
            @submit.prevent
            v-if="widgetSelect.code"
          >
            <el-form-item label="编码">
              <el-tag>{{ widgetSelect.code }}</el-tag>
            </el-form-item>
          </el-form>
        </div>
        <component
          :is="`ab-${widgetSelect.type}-config`"
          :data="widgetSelect"
          :form="form"
          :is-oracle="isOracle"
        />
      </el-tab-pane>

      <!--字段属性-->
      <el-tab-pane
        v-else
        label="字段属性"
        name="widget"
        style="padding: 0 10px"
      >
        <widget-column
          :data="widgetSelect"
          :form="form"
          :is-oracle="isOracle"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
  import { ref, toRefs, watch } from 'vue'
  import WidgetColumn from './widgetColumn.vue'
  import WidgetTable from './widgetTable.vue'
  import widgetTabs from './widgetTabs.vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const props = defineProps({
    form: {
      type: Object,
      default: () => {
        return {}
      },
    },
    widgetSelect: {
      type: Object,
      default: () => {
        return {}
      },
    },
    defaultValues: {
      type: Object,
      default: () => {
        return {}
      },
    },
    isOracle: {
      type: Boolean,
      default: false,
    },
  })

  const info = reactive({
    key: 0,
  })

  // Tabs
  let configTab = ref('form')

  // WidgetConfig
  import WidgetConfig from './widget.vue'
  let { widgetSelect } = toRefs(props)
  watch(
    widgetSelect,
    (newVal, oldVal) => {
      if (!newVal.prop) {
        configTab.value = 'form'
        return
      }
      if (newVal.prop == oldVal.prop) {
        return
      }

      info.key++
      //console.info(newVal)
      configTab.value = 'widget'
    },
    { deep: true }
  )

  // FormConfig
  import FormConfig from './form.vue'
</script>
<style lang="scss" scoped>
  .config {
    height: calc(100% - 5px);
    padding-top: 5px;
    background: #fff;
    :deep(.el-collapse-item__content) {
      padding-bottom: 0;
    }

    :deep(.el-tabs) {
      width: 100%;
      height: 100%;

      .el-tabs__header {
        position: relative;
        top: 0;
        z-index: 1000;
        display: block;
        height: 45px;
        margin: 0;
        background: #ffffff;
      }

      .el-tabs__content {
        height: calc(100% - 45px);
        margin-top: 0;
        overflow-y: auto;
      }
    }

    :deep(ul) {
      width: 100%;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        width: 100%;

        .ghost {
          height: 35px;
          font-size: 0;
          list-style: none;
        }
      }
    }
  }
</style>
