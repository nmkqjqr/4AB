<template>
  <div class="left_side">
    <el-scrollbar ref="scrollbarRef">
      <div
        v-for="item in state.groupList"
        :key="item.title"
        class="components_list"
      >
        <span class="title">
          {{ item.title }}
        </span>
        <draggable
          class="components-draggable"
          :clone="clone"
          :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
          :item-key="item.title"
          :list="item.components"
          :sort="false"
        >
          <template #item="{ element }">
            <div class="components-item">
              <div class="components-body">
                <el-icon>
                  <Edit />
                </el-icon>
                <span style="margin-left: 2px">
                  {{ element.label }}
                </span>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
  import draggable from 'vuedraggable'
  import { reactive, ref, toRefs } from 'vue'
  import { groupCompon } from '../config/index'
  import { Edit } from '@element-plus/icons-vue'
  const state = reactive({
    drag: false,
    groupList: groupCompon,
  })
  const clone = (element: any) => {
    return JSON.parse(JSON.stringify(element))
  }
</script>
<style lang="scss">
  @import '../styles/index.scss';
</style>
