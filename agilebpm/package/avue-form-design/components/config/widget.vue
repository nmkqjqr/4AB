<template>
  <div class="widget-config">
    <el-form
      label-suffix="："
      v-if="this.data && Object.keys(this.data).length > 0"
      labelPosition="left"
      labelWidth="90px"
    >
      <widget-table v-if="['group','dynamic'].includes(data.type)" :data="data"/>
      <widget-column v-else :data="data"/>
    </el-form>
    <el-empty v-else description="拖拽字段进行配置" style="margin-top: 90%;"></el-empty>
  </div>
</template>

<script>
import WidgetColumn from './widgetColumn.vue'
import WidgetTable from './widgetTable.vue'

export default {
  name: 'widget-config',
  props: ['defaultValues','data'],
  components: { WidgetColumn,WidgetTable },
  computed: {
  },
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
  }
}
</script>