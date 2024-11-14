<template>
  <div
    class="widget-group hover"
    :drag-title="column.subTable ? '块子表' : '分组'"
    :table-code="getTableCode()"
  >
    <h3 class="widget-group__head" v-show="column.label">
      <i
        :class="column.icon"
        v-show="column.icon"
        style="margin-right: 10px"
      ></i>
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
      class="widget-group__body"
      :list="column.children.column"
      :group="{ name: 'form' }"
      ghost-class="ghost"
      :animation="200"
      item-key="prop"
      @add="handleWidgetGroupAdd($event, column)"
      @end="$emit('change')"
      type="group"
      :move="move"
    >
      <template #item="{ element, index }">
        <widget-dynamic
          v-if="element.type == 'dynamic'"
          :class="{ active: selectWidget.prop == element.prop }"
          @click.stop="handleWidgetTableSelect(element)"
          :data="column.children"
          :column="element"
          :index="index"
          v-model:select="selectWidget"
          @change="$emit('change')"
          :form="form"
        ></widget-dynamic>
        <div
          v-else
          :style="{ width: `${(element.span / 24) * 100}%`, float: 'left' }"
        >
          <el-form-item
            class="widget-group__item hover drag formItem"
            :label="element.label"
            :label-width="element.labelWidth"
            :prop="element.prop"
            :class="[
              {
                'active-item': selectWidget.prop == element.prop,
                required: element.required,
              },
              'avue-form__item--' + element.labelPosition || '',
            ]"
            @click.stop="handleWidgetTableSelect(element)"
          >
            <widget-item :item="element" :params="column.params"></widget-item>
            <widget-button
              v-if="selectWidget.prop == element.prop"
              type="group-item"
              @delete="handleWidgetTableDelete(column, index)"
              @copy="handleWidgetTableClone(column, element)"
            ></widget-button>
          </el-form-item>
        </div>
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
  import WidgetDynamic from './dynamic.vue'
  import WidgetButton from './button.vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'

  export default {
    name: 'widget-group',
    components: { WidgetItem, WidgetDynamic, WidgetButton, Draggable },
    props: ['data', 'column', 'select', 'index', 'form'],
    emits: ['update:select', 'change'],
    data() {
      return {
        selectWidget: this.select,
        Arrays: abUtil.Arrays,
        isBo: abTools.useCurrentInstance().proxy.$route.query.mode != 'diyBo',
        mainTableCode: '',
      }
    },
    mounted() {
      if (window.ab_bo) {
        this.mainTableCode = window.ab_bo.rel.tableCode
      }
    },
    methods: {
      getTableCode() {
        if (this.column.code) {
          return this.column.code
        }
        if (window.ab_bo) {
          this.mainTableCode = window.ab_bo.rel.tableCode
          return this.mainTableCode
        }
      },
      handleSelectWidget(index) {
        this.selectWidget = this.data.column[index]
      },
      handleWidgetClear(index) {
        this.data.column[index].children.column = []
        this.selectWidget = this.data.column[index]

        this.$emit('change')
      },
      handleWidgetDelete(index) {
        if (this.data.column.length - 1 === index) {
          if (index === 0) this.selectWidget = {}
          else this.handleSelectWidget(index - 1)
        } else this.handleSelectWidget(index + 1)

        this.$nextTick(() => {
          this.data.column.splice(index, 1)
          this.$emit('change')
        })
      },
      handleWidgetCloneTable(index) {
        let cloneData = this.deepClone(this.data.column[index])
        cloneData.prop = 'a' + Date.now() + Math.ceil(Math.random() * 99999)
        cloneData.children.column.forEach((t) => {
          t.prop = 'a' + Date.now() + Math.ceil(Math.random() * 99999)
        })
        this.data.column.splice(index, 0, cloneData)
        this.$nextTick(() => {
          this.handleSelectWidget(index + 1)
          this.$emit('change')
        })
      },
      handleWidgetTableSelect(data) {
        this.selectWidget = data
      },
      handleWidgetTableClone(column, item) {
        const data = this.deepClone(item)
        data.prop = 'a' + Date.now() + Math.ceil(Math.random() * 99999)
        if (!this.isBo && data.code) {
          data.code = data.type + this.data.sn++
        }

        column.children.column[column.children.column.length] = { ...data }
        this.$nextTick(() => {
          this.selectWidget =
            column.children.column[column.children.column.length - 1]
          this.$emit('change')
        })
      },
      handleWidgetTableDelete(column, index) {
        if (column.children.column.length - 1 == index) {
          if (index == 0) this.selectWidget = column
          else this.selectWidget = column.children.column[index - 1]
        } else this.selectWidget = column.children.column[index + 1]
        this.$nextTick(() => {
          column.children.column.splice(index, 1)
          this.$emit('change')
        })
      },
      handleWidgetGroupAdd(evt, column) {
        let newIndex = evt.newIndex
        const item = evt.item

        if (newIndex == 1 && newIndex > column.children.column.length - 1)
          newIndex = 0
        let textContent = item.textContent
        if (
          ['分组', '多标签tabs', '块子表'].includes(textContent) ||
          (!column.subTable && textContent == '排序') ||
          (column.subTable && textContent == '行子表')
        ) {
          ElMessage({
            type: 'warning',
            message: `当前控件不支持放置在目标位置`,
            showClose: true,
            duration: 1000,
          })
          column.children.column.splice(newIndex, 1)
          return
        }

        const data = this.deepClone(column.children.column[newIndex])
        if (!data.prop)
          data.prop = 'a' + Date.now() + Math.ceil(Math.random() * 99999)
        if (!data.code) {
          data.code = data.type + this.form.sn++
        }
        delete data.icon
        delete data.subfield
        if (data.type == 'dynamic') data.span = 24
        else if (!data.fixSpan) {
          //不是固定宽度
          data.span = this.form.span //默认全局span的赋值
        }
        if (!this.isBo) {
          //简式模式
          data.placeholder = ''
        }
        column.children.column[newIndex] = { ...data }
        this.selectWidget = column.children.column[newIndex]

        this.$emit('change')
      },
      move(e, originalEvent) {
        console.info('最终落地的数据=========================》')
        console.info(e)
        try {
          let toTitle = e.to.parentElement.getAttribute('drag-title')
          let fromType = e.draggedContext.element.type
          if (
            ['行子表'].includes(toTitle) &&
            [
              'verificationCode',
              'title',
              'divider',
              'alert',
              'iframe',
              'verificationCode',
              'button',
            ].includes(fromType)
          ) {
            return false
          }
          if (
            ['sn'].includes(fromType) &&
            ['主体', '分组', '多标签tabs'].includes(toTitle)
          ) {
            return false
          }
          if (this.isBo && e.draggedContext.element.tableCode) {
            //专业模式，子表字段不能随便切换其他表
            let elTableCode = e.draggedContext.element.tableCode
            if (
              elTableCode == this.mainTableCode &&
              ['主体', '多标签tabs'].includes(toTitle)
            ) {
              //主表可拖到主体
              return true
            }

            let toTableCode = e.to.parentElement.getAttribute('table-code') //目标表编码
            if (e.draggedContext.element.tableCode != toTableCode) {
              return false
            }
          }
        } catch (e) {
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
        deep: true,
      },
    },
  }
</script>
<style lang="scss">
  .el-form-item__label {
    align-items: center;
    line-height: 14px;
  }
</style>
