<template>
  <div class="widget-group hover">
    <el-tabs v-model="data.column[index].control" :type="column.tabsType">
      <el-tab-pane
        v-for="(item, tIndex) in data.column[index].tabsColumn"
        :label="item.label"
        :name="item.index"
        :key="tIndex"
      >
        <el-row
          drag-title="多标签tabs"
          :gutter="15"
          style="
            box-sizing: border-box;
            min-height: 200px;
            padding: 4px;
            margin-left: 0px;
          "
        >
          <draggable
            class="widget-group__body"
            style="width: 100%"
            :list="item.children.column"
            :group="{ name: 'form' }"
            ghost-class="ghost"
            :animation="200"
            item-key="prop"
            @add="handleWidgetGroupAdd($event, item)"
            @end="$emit('change')"
            type="tabs"
            :move="move"
          >
            <template #item="{ element, index }">
              <widget-dynamic
                v-if="element.type == 'dynamic'"
                :class="{ active: selectWidget.prop == element.prop }"
                @click.stop="handleWidgetTableSelect(element)"
                :data="item.children"
                :column="element"
                :index="index"
                :form="data"
                v-model:select="selectWidget"
                @change="$emit('change')"
              ></widget-dynamic>
              <widget-group
                v-else-if="element.type == 'group'"
                :class="{ active: selectWidget.prop == element.prop }"
                @click.stop="handleWidgetTableSelect(element)"
                :data="item.children"
                :column="element"
                :index="index"
                :form="data"
                v-model:select="selectWidget"
                @change="$emit('change')"
              ></widget-group>
              <div
                v-else
                :style="{
                  width: `${(element.span / 24) * 100}%`,
                  float: 'left',
                }"
              >
                <el-form-item
                  class="widget-group__item hover drag formItem"
                  :label="element.hideLable ? '' : element.label"
                  :label-width="element.hideLable ? '0px' : element.labelWidth"
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
                  <widget-item
                    :item="element"
                    :params="column.params"
                  ></widget-item>
                  <widget-button
                    v-if="selectWidget.prop == element.prop"
                    type="group-item"
                    @delete="handleWidgetTableDelete(item, index)"
                    @copy="handleWidgetTableClone(item, element)"
                  ></widget-button>
                </el-form-item>
              </div>
            </template>
          </draggable>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!-- <widget-button v-if="selectWidget.prop == column.prop" type="group" @delete="handleWidgetDelete(index)" @copy="handleWidgetCloneTable(index)" @clear="handleWidgetClear(index)"></widget-button> -->
    <widget-button
      v-if="selectWidget.prop == column.prop"
      type="group"
      @delete="handleWidgetDelete(index)"
      @clear="handleWidgetClear(index)"
    ></widget-button>
  </div>
</template>
<script>
  import Draggable from 'vuedraggable'
  import WidgetItem from './item.vue'
  import WidgetDynamic from './dynamic.vue'
  import WidgetGroup from './group.vue'
  import WidgetButton from './button.vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'

  export default {
    name: 'widget-tabs',
    components: {
      WidgetItem,
      WidgetDynamic,
      WidgetButton,
      Draggable,
      WidgetGroup,
    },
    props: ['data', 'column', 'select', 'index'],
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
      handleSelectWidget(index) {
        this.selectWidget = this.data.column[index]
      },
      handleWidgetClear(index) {
        /* let map = this.data.column[index].tabsColumn
      for(let key in map){
        if(map[key].index == this.data.column[index].control){
          map[key].children = {
            column: [],
          }
        }
      } */
        this.data.column[index].control = 1
        this.data.column[index].tabsColumn = [
          {
            label: '标签1',
            index: 1,
            children: {
              column: [],
            },
          },
        ]
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
        if (['多标签tabs', '排序'].includes(item.textContent)) {
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
          data.code = data.type + this.data.sn++
        }
        delete data.icon
        delete data.subfield

        //给子表字段赋值prop、span
        if (data.children && data.children.column) {
          data.children.column.forEach((c) => {
            if (!c.prop) {
              c.prop = 'ab' + Date.now() + Math.ceil(Math.random() * 99999)
            }
            c.span = this.data.span //默认全局span的赋值
          })
        } else if (!data.fixSpan) {
          //不是固定宽度
          data.span = this.data.span //默认全局span的赋值
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
        if (window.ab_bo) {
          this.mainTableCode = window.ab_bo.rel.tableCode
        }
        try {
          let toTitle = e.to.parentElement.getAttribute('drag-title')
          let fromType = e.draggedContext.element.type
          if (
            ['group'].includes(fromType) &&
            ['分组', '行子表', '块子表'].includes(toTitle)
          ) {
            return false
          }
          if (
            ['dynamic'].includes(fromType) &&
            ['行子表', '块子表'].includes(toTitle)
          ) {
            return false
          }
          if (this.isBo && e.draggedContext.element.tableCode) {
            //专业模式，是主表字段
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
