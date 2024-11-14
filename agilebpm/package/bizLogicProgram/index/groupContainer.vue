<template>
  <draggable
    :animation="340"
    class="center_dragable"
    ghost-class="ghost"
    group="componentsGroup"
    item-key="maincontainer"
    :list="list"
    @add="draggableAdd"
  >
    <template #item="{ element, index }">
      <el-col
        :class="
          activeId == element.key
            ? ' active_form_item dragableItem'
            : 'dragableItem'
        "
        :span="element.span || 24"
        @click.stop="ActiveItemClick(element)"
      >
        <template v-if="element.type === 'collapse'">
          <el-collapse :model-value="activeCollapseNames(element)">
            <el-collapse-item
              v-for="item in element.columns"
              :key="item.key"
              :name="item.key"
              :title="item.name"
            >
              <el-row
                style="
                  box-sizing: border-box;
                  padding: 8px;
                  border: 1px dashed #e2e0e0;
                "
              >
                <group-container
                  :active-id="props.activeId"
                  data-type="not-nested"
                  :list="item.list"
                  style="min-height: 200px"
                />
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </template>
        <template v-else-if="element.type === 'card'">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                {{ element.label }}
              </div>
            </template>
            <el-row
              style="
                box-sizing: border-box;
                padding: 4px;
                border: 1px dashed #e2e0e0;
              "
            >
              <group-container
                :active-col="props.activeCol"
                :active-id="props.activeId"
                data-type="not-nested"
                :list="element.list"
                style="min-height: 200px"
              />
            </el-row>
          </el-card>
        </template>
        <template v-else>
          <component :is="element.component" :component-config="element" />
        </template>
        <span class="dragableItem_del" @click.stop="delClick(element, index)">
          <el-icon size="14">
            <Delete />
          </el-icon>
        </span>
        <span
          v-if="element.type == 'grid'"
          class="dragableItem_add"
          @click.stop="addGridClick(element, index)"
        >
          <el-icon size="14">
            <Plus />
          </el-icon>
        </span>
      </el-col>
    </template>
  </draggable>
</template>
<script setup lang="ts">
  import draggable from 'vuedraggable'
  import { CopyDocument, Delete, Plus } from '@element-plus/icons-vue'
  import { Ref } from 'vue'
  const props = defineProps({
    list: Array<LogicComponent>,
    activeId: String,
    componentConf: Object,
    activeCol: String,
  })

  const { list, componentConf, activeId } = toRefs(props)
  const emits = defineEmits(['clearAll', 'activeItem'])
  const activeItem = inject('activeItem')
  const activeColClick = inject('activeColClick')
  const resetControl = inject('resetControl')

  const ActiveItemClick = (element: any) => {
    activeItem(element)
    activeColClick({
      key: '',
    })
  }
  const activeCollapse: Ref<Array<string>> = ref([])

  const activeCollapseNames = (element: LogicComponent) => {
    if (activeCollapse.value.length == 0) {
      activeCollapse.value = element.expand || []
    }
    return activeCollapse.value
  }

  const gridClick = (col: any, element: any) => {
    activeColClick(col)
    activeItem(element)
  }

  const delClick = (element: any, index: number) => {
    list.value?.splice(index, 1)
    activeItem({
      key: '',
    })
    resetControl()
  }
  const delGridClick = (element: any, index: number) => {
    element.columns.splice(index, 1)
  }

  const draggableAdd = (evt: any) => {
    // 获取当前索引
    const newIndex = evt.newIndex
    const key = new Date().getTime().toString()
    const obj: any = props.list[newIndex] || undefined
    if (!obj) {
      return
    }
    props.list[newIndex].key = obj.type + key
    ActiveItemClick(obj)
  }
  const groupClick = (element: object) => {
    emits('activeItem', element)
  }
  const addGridClick = (element: any) => {
    const str = new Date().getTime().toString()
    element.columns.push({
      attr: { span: 12 },
      key: `${element.type}item${0}${str}`,
      list: [],
      expand: [],
    })
  }
</script>
<style lang="scss">
  @import '../styles/index.scss';
</style>
