<template>
  <div class="widget-dynamic hover" :class="{ 'required-title': column.required }" drag-title="行子表" :table-code="column.code">
    <h3 style="margin: 10px" v-show="column.label">
      {{ column.label }}
      <el-tag
        v-show="column.subTable"
        v-for="b in column.buttons"
        type="warning"
        style="margin-left: 10px"
        closable
        @close="Arrays.remove(b, column.buttons)"
      >
        {{ b.name }}
      </el-tag>
    </h3>

    <draggable
      class="widget-dynamic__body"
      :list="column.children.column"
      :group="{ name: 'form' }"
      ghost-class="ghost"
      :animation="200"
      handle=".widget-dynamic__item"
      item-key="prop"
      @add="handleWidgetTableAdd($event, column)"
      @end="$emit('change')"
      type="dynamic"
      :move="move"
    >
      <template #item="{ element, index }">
        <template v-if="column.children.column.length > 0">
          <div
            class="widget-dynamic__item hover-item drag"
            :class="{ 'active-item': selectWidget.prop == element.prop, required: element.required }"
            :style="{ minWidth: getWidth(element), width: getWidth(element) }"
            @click.stop="handleWidgetTableSelect(element)"
          >
            <div class="wf-table">
              <div class="wf-table__header">{{ element.label }}</div>
              <div class="wf-table__body">
                <widget-item :item="element" :params="column.params"></widget-item>
                <widget-button
                  v-if="selectWidget.prop == element.prop"
                  type="table-item"
                  @delete="handleWidgetTableDelete(column, index)"
                  @copy="handleWidgetTableClone(column, element)"
                ></widget-button>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <el-empty size="50" style="width: 100%;" description="拖拽字段至此"></el-empty>
        </template>
      </template>
    </draggable>
    <widget-button
      v-if="selectWidget.prop == column.prop"
      type="group"
      @delete="handleWidgetDelete(index)"
      @copy="handleWidgetCloneTable(index)"
      @clear="handleWidgetClear(index)"
    ></widget-button>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import WidgetItem from './item.vue'
import WidgetButton from './button.vue'
import * as abUtil from '~/agilebpm/utils/ab-util'
import * as abTools from '~/agilebpm/utils/ab-tools'

export default {
  name: 'widget-dynamic',
  props: ['data', 'column', 'select', 'index','form'],
  emits: ['update:select', 'change'],
  components: { WidgetItem, WidgetButton, Draggable },
  data() {
    return {
      selectWidget: this.select,
      Arrays : abUtil.Arrays,
      isBo : abTools.useCurrentInstance().proxy.$route.query.mode != 'diyBo',
    }
  },
  mounted() {
  },
  computed : {},
  methods: {
    getWidth(element){
      if(element.labelWidth){
        return `${element.labelWidth}px`
      }
      /* if(this.data.labelWidth){
        return `${this.data.labelWidth}px`
      } */
      return '20%'
    },
    handleSelectWidget(index) {
      this.selectWidget = this.data.column[index]
    },
    handleWidgetClear(index) {
      this.data.column[index].children.column = []
      this.selectWidget = this.data.column[index]
      this.$emit("change")
    },
    handleWidgetDelete(index) {
      if (this.data.column.length - 1 === index) {
        if (index === 0) this.selectWidget = {}
        else this.handleSelectWidget(index - 1)
      } else this.handleSelectWidget(index + 1)

      this.$nextTick(() => {
        this.data.column.splice(index, 1)
        this.$emit("change")
      })
    },
    handleWidgetCloneTable(index) {
      let cloneData = this.deepClone(this.data.column[index])
      cloneData.prop = 'a' + Date.now() + Math.ceil(Math.random() * 99999)
      cloneData.children.column.forEach(t => {
        t.prop = 'a' + Date.now() + Math.ceil(Math.random() * 99999)
      })
      this.data.column.splice(index, 0, cloneData)
      this.$nextTick(() => {
        this.handleSelectWidget(index + 1)
        this.$emit("change")
      })
    },
    handleWidgetTableAdd(evt, column) {
      let newIndex = evt.newIndex;
      const item = evt.item;

      if (newIndex == 1 && newIndex > column.children.column.length - 1) newIndex = 0
      if (['行子表','块子表','分组','多标签tabs','标题','分割线','提示','外部页面','验证码','按钮'].includes(item.textContent)) {
        ElMessage({
          type: 'warning',
          message:`当前控件不支持放置在目标位置`,
          showClose : true,
          duration : 1000,
        })
        column.children.column.splice(newIndex, 1)
        return
      }

      const data = this.deepClone(column.children.column[newIndex]);
      if (!data.prop) data.prop = 'a' + Date.now() + Math.ceil(Math.random() * 99999)
      if(!data.code){
        data.code = data.type + (this.form.sn++)
      }
      if(!this.isBo){//简式模式
        data.placeholder = ''
      }
      data.subfield = true
      delete data.icon
      column.children.column[newIndex] = { ...data }
      this.selectWidget = column.children.column[newIndex]

      this.$emit("change")
    },
    handleWidgetTableSelect(data) {
      this.selectWidget = data
    },
    handleWidgetTableClone(column, item) {
      const data = this.deepClone(item);
      data.prop = 'a' + Date.now() + Math.ceil(Math.random() * 99999)
      if (!this.isBo && data.code) {
        data.code = data.type + (this.data.sn++)
      }
      column.children.column[column.children.column.length] = { ...data }
      this.$nextTick(() => {
        this.selectWidget = column.children.column[column.children.column.length - 1]
        this.$emit("change")
      })
    },
    handleWidgetTableDelete(column, index) {
      if (column.children.column.length - 1 == index) {
        if (index == 0) this.selectWidget = column
        else this.selectWidget = column.children.column[index - 1]
      } else this.selectWidget = column.children.column[index + 1]
      this.$nextTick(() => {
        column.children.column.splice(index, 1)
        this.$emit("change")
      })
    },
    move(e,originalEvent){
      console.info("最终落地的数据=========================》")
      console.info(e)
      try{
        let toTitle = e.to.parentElement.getAttribute("drag-title")
        let fromType = e.draggedContext.element.type

        if(["sn"].includes(fromType) &&["主体","分组","多标签tabs"].includes(toTitle) ){
          return false
        }
        if(this.isBo && this.column.subTable && e.draggedContext.element.tableCode){//专业模式，子表字段不能随便切换其他表
          let toTableCode = e.to.parentElement.getAttribute("table-code")//目标表编码
          if(e.draggedContext.element.tableCode != toTableCode){
            return false
          }
        }
      }catch(e){
        console.error(e)
      }
      return true
    },
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  }
}
</script>
