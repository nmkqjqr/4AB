<template>
  <el-form-item label="只读下不可下载" label-width="123px">
    <el-switch v-model="data.readNonDownload" />
  </el-form-item>
  <el-form-item
    prop="uploadType"
    label="分类目录"
    class="is-required"
    :rules="[{ required: true, message: '必填' }]"
  >
    <tree-select
      clearable
      v-model="data.uploadType"
      dic-code="fileType"
      placeholder="选择或输入默认值"
    />
  </el-form-item>
  <!-- 图片或文件 -->
  <el-form-item label="上传样式">
    <el-radio-group v-model="data.listType" @change="changeListType">
      <el-radio label="text">文件</el-radio>
      <el-radio label="picture-card">图片</el-radio>
    </el-radio-group>
  </el-form-item>
  <!-- 单选则是覆盖 -->
  <el-form-item label="是否多选">
    <el-switch v-model="data.uploadMultiple" />
  </el-form-item>
  <!-- 数量限制 -->
  <el-form-item
    v-if="data.uploadMultiple"
    label="数量限制"
    prop="maxLimit"
    :rules="[
      {
        pattern: '^[0-9]*$',
        message: '请输入数字(单位:KB)',
      },
    ]"
  >
    <el-input v-model="data.maxLimit" placeholder="文件最大数量个数" />
  </el-form-item>

  <!-- 大小限制 -->
  <el-form-item
    label="大小限制"
    prop="maxSize"
    :rules="[
      {
        pattern: '^[0-9]*$',
        message: '请输入数字(单位:KB)',
      },
    ]"
  >
    <el-input v-model="data.maxSize" placeholder="文件大小限制(单位KB)" />
  </el-form-item>

  <!-- 类型限制 -->
  <el-form-item>
    <template #label>
      <div>
        类型限制
        <el-tooltip
          class="box-item"
          content="使用中文逗号【，】不生效，请使用英文逗号【,】  例如:【txt,excel,pdf】"
          effect="dark"
          placement="top-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-input v-model="data.uploadTypeLimit" placeholder="多个类型用,分割" />
  </el-form-item>

  <el-form-item label="默认值">
    <ab-upload-file
      :dic-code="data.uploadType"
      v-model="data.defaultValue"
      :list-type="data.listType"
      :multiple="data.uploadMultiple"
      :type="data.uploadTypeLimit"
    />
  </el-form-item>
</template>

<script lang="ts">
  export default {
    name: 'ab-upload-config',
  }
</script>

<script lang="ts" setup>
  import { abUploadFile } from '@ab-core'
  import treeSelect from './component/treeSelect.vue'
  //继承的属性data
  const props = defineProps({ data: { type: Object, required: true } })
  //将data内的属性转为响应式数据
  const { data } = toRefs(props)

  if (!data.value.uploadType) {
    data.value.uploadType = 'ywfj'
  }
  if (!data.value.listType) {
    data.value.listType = 'text'
  }

  const changeListType = () => {
    if (data.value.listType == 'picture-card') {
      data.value.defaultValue = ''
    }
  }
</script>
