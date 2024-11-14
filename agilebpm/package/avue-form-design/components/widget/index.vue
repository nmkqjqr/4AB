<template>
  <el-main
    class="widget"
    :style="{
      background:
        data.column && data.column.length == 0
          ? `url(${widgetEmptyImg}) no-repeat 50%`
          : '',
    }"
  >
    <el-form
      :label-position="'right'"
      :label-width="data.labelWidth ? `${data.labelWidth}px` : '100px'"
      :label-suffix="data.labelSuffix"
      :model="form"
      :size="data.size || 'default'"
      ref="widgetForm"
    >
      <el-row :gutter="data.gutter" drag-title="主体">
        <draggable
          class="widget-list"
          :list="data.column"
          :group="{ name: 'form' }"
          ghost-class="ghost"
          :animation="300"
          item-key="prop"
          @add="handleWidgetAdd"
          @end="$emit('change')"
          :move="move"
        >
          <template #item="{ element, index }">
            <widget-dynamic
              v-if="['dynamic'].includes(element.type)"
              :class="{ active: selectWidget.prop == element.prop }"
              @click.stop="handleSelectWidget(index)"
              :data="data"
              :form="data"
              :column="element"
              :index="index"
              v-model:select="selectWidget"
              @change="$emit('change')"
            ></widget-dynamic>
            <widget-group
              v-else-if="element.type == 'group'"
              :class="{ active: selectWidget.prop == element.prop }"
              @click.stop="handleSelectWidget(index)"
              :data="data"
              :form="data"
              :column="element"
              :index="index"
              v-model:select="selectWidget"
              @change="$emit('change')"
            ></widget-group>
            <widget-tabs
              v-else-if="element.type == 'tabs'"
              :class="{ active: selectWidget.prop == element.prop }"
              @click.stop="handleSelectWidget(index)"
              :data="data"
              :column="element"
              :index="index"
              v-model:select="selectWidget"
            ></widget-tabs>
            <el-col
              v-else
              style="width: 100%"
              :span="element.span"
              :offset="element.offset || 0"
            >
              <el-form-item
                class="widget-item hover drag labelStyle formItem"
                :label="element.hideLable ? '' : element.label"
                :prop="element.prop"
                :size="data.size || element.size || 'default'"
                :class="[
                  {
                    active: selectWidget.prop == element.prop,
                    required: isRequired(element),
                  },
                  'avue-form__item--' + element.labelPosition || '',
                ]"
                :label-width="element.hideLable ? '0px' : element.labelWidth"
                @click.stop="handleSelectWidget(index)"
              >
                <widget-item
                  :item="element"
                  :json="data"
                  :params="element.params"
                ></widget-item>
                <widget-button
                  v-if="selectWidget.prop == element.prop"
                  @delete="handleWidgetDelete(index)"
                  @copy="handleWidgetClone(index)"
                ></widget-button>
              </el-form-item>
            </el-col>
          </template>
        </draggable>
      </el-row>
    </el-form>
  </el-main>
</template>

<script>
  import widgetEmptyImg from '../../assets/widget-empty.png' // 空白图片

  import Draggable from 'vuedraggable'
  import WidgetItem from './item.vue'
  import WidgetDynamic from './dynamic.vue'
  import WidgetGroup from './group.vue'
  import WidgetTabs from './tabs.vue'
  import WidgetButton from './button.vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'

  export default {
    name: 'widget',
    components: {
      Draggable,
      WidgetItem,
      WidgetDynamic,
      WidgetGroup,
      WidgetButton,
      WidgetTabs,
    },
    props: ['data', 'select'],
    emits: ['update:select', 'change'],
    data() {
      return {
        widgetEmptyImg,
        selectWidget: this.select,
        form: {},
        isBo: abTools.useCurrentInstance().proxy.$route.query.mode != 'diyBo',
      }
    },
    methods: {
      handleSelectWidget(index) {
        this.selectWidget = this.data.column[index]
      },
      /**
       * 左侧拖拽进来的事件
       */
      handleWidgetAdd(evt) {
        //debugger
        const newIndex = evt.newIndex
        const item = evt.item
        if (newIndex == 1 && newIndex > this.data.column.length - 1)
          newIndex = 0
        let textContent = item.textContent
        if (['排序'].includes(textContent)) {
          ElMessage({
            type: 'warning',
            message: `当前控件不支持放置在目标位置`,
            showClose: true,
            duration: 1000,
          })
          this.data.column.splice(newIndex, 1)
          return
        }

        const data = this.deepClone(this.data.column[newIndex])
        if (!data.prop) {
          data.prop = 'ab' + Date.now() + Math.ceil(Math.random() * 99999)
        }
        if (!data.code) {
          data.code = data.type + this.data.sn++
        }

        delete data.icon
        delete data.subfield
        if (data.type == 'title') {
          delete data.label
          this.form[data.prop] = data.value
        }
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

        this.data.column[newIndex] = data
        this.handleSelectWidget(newIndex)

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
      handleWidgetClone(index) {
        let cloneData = this.deepClone(this.data.column[index])
        cloneData.prop = 'a' + Date.now() + Math.ceil(Math.random() * 99999)
        if (!this.isBo && cloneData.code) {
          cloneData.code = cloneData.type + this.data.sn++
        }
        this.data.column.push(cloneData)
        this.$nextTick(() => {
          this.handleSelectWidget(this.data.column.length - 1)
          this.$emit('change')
        })
      },
      isRequired(element) {
        return element.rules ? element.rules.includes('required') : false
      },
      move(e, originalEvent) {
        console.info('最终落地的数据=========================》')
        console.info(e)
        try {
          let toTitle = e.to.parentElement.getAttribute('drag-title')
          let fromType = e.draggedContext.element.type
          console.info('fromType:' + fromType + ';toTitle:' + toTitle)

          if (
            ['分组', '行子表', '块子表'].includes(toTitle) &&
            ['group', 'tabs'].includes(fromType)
          ) {
            return false
          }
          if (['块子表'].includes(toTitle) && ['dynamic'].includes(fromType)) {
            return false
          }
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
          if (['多标签tabs'].includes(toTitle) && ['tabs'].includes(fromType)) {
            return false
          }
          if (
            this.isBo &&
            e.draggedContext.element.tableCode &&
            ['行子表', '块子表'].includes(toTitle)
          ) {
            //专业模式，主表字段不能随便切换其他表
            return false
          }
          if (this.isBo) {
            //专业模式第三层或以上子表不能被拖动
            let element = e.draggedContext.element
            if (element.subTable) {
              let rel = window.ab_bo_getRel(element.code)
              if (rel.parent && rel.parent.type != 'main') {
                return false
              }
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
