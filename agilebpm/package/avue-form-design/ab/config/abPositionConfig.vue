<template>
  <el-form-item label="显示经纬度">
    <el-switch v-model="data.showCoordinates" />
  </el-form-item>
  <el-form-item>
    <template #label>
      <div>
        允许修改
        <el-tooltip
          class="box-item"
          content="开启：可以自由选点。   关闭：只能选择当前位置"
          effect="dark"
          placement="top-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-switch v-model="data.enableModify" />
  </el-form-item>
  <el-form-item>
    <template #label>
      <div>
        默认展示
        <el-tooltip
          class="box-item"
          content="可选可填。 填写格式：东经,北纬。 例如北京市中心的坐标： 116.397428,39.90923 "
          effect="dark"
          placement="top-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-select
      v-if="data.enableModify"
      v-model="data.defaultCurrentLocation"
      allow-create
      clearable
      filterable
      placeholder="选择或输入默认展示经纬度"
    >
      <el-option label="当前位置" value="currentLocation" />
    </el-select>
    <el-select v-else disabled v-model="showCurrentLocation"></el-select>
  </el-form-item>
</template>

<script lang="ts">
  export default {
    name: 'ab-position-config',
  }
</script>

<script lang="ts" setup>
  //继承的属性data
  const props = defineProps({ data: { type: Object, required: true } })
  //将data内的属性转为响应式数据
  const { data } = toRefs(props)

  const showCurrentLocation = '当前位置'
</script>
