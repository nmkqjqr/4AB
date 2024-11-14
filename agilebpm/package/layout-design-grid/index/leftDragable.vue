<template>
  <div class="left_side" style="text-align: center">
    <el-scrollbar ref="scrollbarRef">
      <div v-for="item in state.groupList" :key="item.title">
        <span class="title">{{ item.title }}</span>
        <div class="components_list">
          <!-- <draggable class="components-draggable" :list="item.components" :clone="clone" :group="{ name: 'componentsGroup', pull: 'clone', put: false }" :item-key="item.title" :sort="false"> -->
          <!-- <template #item="{ element }"> -->
          <!-- @drag="(e)=>drag(e,element)" @dragend="(e)=>dragend(e,element)" -->
          <el-row>
            <el-col
              v-for="element in item.components"
              :key="element.type"
              draggable="true"
              :span="12"
              @dragstart="(e) => dragstart(e, element)"
            >
              <div class="components-body">
                <div style="margin-bottom: 20px">
                  <ab-icon
                    :icon="element.type"
                    size="30px"
                    style="width: 100%"
                  />
                  <div style="margin-top: 7px">
                    {{ element.label }}
                  </div>
                </div>
                <!-- <div s>
                <el-button @click="addClickElement(element,1)" type="primary" size="small" :icon="Plus" circle />
                <el-button @click="addClickElement(element,2)" type="primary" size="small" :icon="Grid" circle />
              </div> -->
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- </template> -->
        <!-- </draggable> -->
      </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, watch, defineProps, onMounted, nextTick } from 'vue'
  import { groupCompon } from '../config/index'
  import AbIcon from '../components/abEcharts/components/AbIcon.vue'
  const props = defineProps({
    designJson: {
      required: true,
      type: Object as PropType<DesignJson>,
    },
  })

  const state = reactive({
    drag: false,
    groupList: groupCompon,
  })
  const { designJson } = toRefs(props)
  const emits = defineEmits(['addEnd'])
  const mapCache: Map<string, any> = new Map()
  const colNum = ref<number>(18)
  function set$Children(vm: any) {
    if (vm && vm.i) {
      mapCache.set(vm.i, vm)
    }
  }

  const dragstart = (ev, element) => {
    console.info(element)
    ev.dataTransfer.setData('dragItem', JSON.stringify(element))
  }

  const mouseXY = { x: 0, y: 0 }
  const DragPos = { x: 0, y: 0, w: 1, h: 1, i: '' }

  function drag(e: DragEvent, element: FormCombinationComponent) {
    e.stopPropagation()
    e.preventDefault()
    debugger
    const t = document.getElementById('designerID') as HTMLElement
    const parentRect = t.getBoundingClientRect()
    console.log(mouseXY, parentRect)
    let mouseInGrid = false
    if (
      mouseXY.x > parentRect.left &&
      mouseXY.x < parentRect.right &&
      mouseXY.y > parentRect.top &&
      mouseXY.y < parentRect.bottom
    ) {
      mouseInGrid = true
    }
    if (
      mouseInGrid === true &&
      designJson.value.list.findIndex((item) => item.i === 'drop') === -1
    ) {
      const obj = JSON.parse(JSON.stringify(element))
      designJson.value.list.push({
        ...obj,
        // x: (designJson.value.list.length * 2) % colNum.value,
        // y: designJson.value.list.length + colNum.value, // puts it at the bottom
        x: 2,
        y: 2,
        w: 4,
        h: 4,
        i: 'drop',
      })
    }
    const index = designJson.value.list.findIndex((item) => item.i === 'drop')

    if (index !== -1) {
      try {
        refLayout.value.defaultGridItem.$el.style.display = 'none'
      } catch {}
      const el = mapCache.get('drop')
      if (!el) return

      el.dragging = {
        top: mouseXY.y - parentRect.top,
        left: mouseXY.x - parentRect.left,
      }
      const new_pos = el.calcXY(
        mouseXY.y - parentRect.top,
        mouseXY.x - parentRect.left
      )
      if (mouseInGrid === true) {
        refLayout.value.dragEvent(
          'dragstart',
          'drop',
          new_pos.x,
          new_pos.y,
          3,
          4
        )
        DragPos.i = String(index)
        DragPos.x = designJson.value.list[index].x
        DragPos.y = designJson.value.list[index].y
      }
      if (mouseInGrid === false) {
        refLayout.value.dragEvent('dragend', 'drop', new_pos.x, new_pos.y, 3, 4)
        designJson.value.list.value = designJson.value.list.value.filter(
          (obj) => obj.i !== 'drop'
        )
      }
    }
  }

  function dragend(e: DragEvent, element: FormCombinationComponent) {
    debugger
    const t = document.getElementById('designerID') as HTMLElement
    const parentRect = t.getBoundingClientRect()
    let mouseInGrid = false
    if (
      mouseXY.x > parentRect.left &&
      mouseXY.x < parentRect.right &&
      mouseXY.y > parentRect.top &&
      mouseXY.y < parentRect.bottom
    ) {
      mouseInGrid = true
    }

    if (mouseInGrid === true) {
      // refLayout.value.dragEvent('dragend', 'drop', DragPos.x, DragPos.y, 3, 4)
      designJson.value.list = designJson.value.list.filter(
        (obj) => obj.i !== 'drop'
      )
      // UNCOMMENT below if you want to add a grid-item
      nextTick(() => {
        const obj = JSON.parse(JSON.stringify(element))
        const id = new Date().getTime()
        designJson.value.list.push({
          ...obj,
          drag: false,
          i: id,
          key: id.toString(),
          w: 4,
          h: 4,
          x: 1,
          y: 2,
        })
        mapCache.delete('drop')
      })
      mouseXY.x = 0
      mouseXY.y = 0
    }
  }

  function addDragOverEvent(e: DragEvent) {
    mouseXY.x = e.clientX
    mouseXY.y = e.clientY
  }

  onMounted(() => {
    document.addEventListener('dragover', addDragOverEvent)
  })

  // 点击新增
  const addClickElement = (element: any, type: number) => {
    const id = new Date().getTime()
    if (element.islayout) {
      emits(
        'addEnd',
        JSON.parse(
          JSON.stringify({
            ...element,
            drag: false,
            i: id,
            key: id.toString(),
            w: 18,
            h: 8,
            x: 0,
            y: 2,
          })
        ),
        type
      )
    } else {
      emits(
        'addEnd',
        JSON.parse(
          JSON.stringify({
            ...element,
            drag: false,
            i: id,
            key: id.toString(),
            w: 4,
            h: 4,
            x: 0,
            y: 2,
          })
        ),
        type
      )
    }
  }

  const clone = (element: any) => {
    //深拷贝  组件对象不能失去指向
    // if (element.component) {
    //   const ele = JSON.parse(JSON.stringify(element))
    //   ele.component = element.component
    //   return ele
    // }
    return JSON.parse(
      JSON.stringify({
        ...element,
        drag: false,
        i: new Date().getTime(),
        w: 4,
        h: 4,
        x: 1,
        y: 2,
      })
    )
  }
</script>
<style lang="scss">
  @import '../styles/index.scss';
</style>
