<template>
  <div>
    <el-divider content-position="center">图片配置</el-divider>
    <el-form-item label="添加图片">
      <el-button :icon="Edit" text type="primary" @click="setPicture">
        设置
      </el-button>
      <span style="padding-left: 4px; font-size: 12px; color: #000">
        (支持jpg,jpeg,png,gif格式)
      </span>
    </el-form-item>
    <el-form-item label="填充方式">
      <el-radio-group v-model="config.control.tcType" size="small">
        <el-radio-button :label="0">原图居中</el-radio-button>
        <el-radio-button :label="1">拉伸填满</el-radio-button>
        <el-radio-button :label="2">平铺</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-if="
        config.control.picture && JSON.parse(config.control.picture).length > 1
      "
      label="自动轮播"
    >
      <el-switch
        v-model="config.control.autoplay"
        active-text="是"
        inactive-text="否"
        inline-prompt
      />
    </el-form-item>
    <!-- <el-form-item label="图片高度">
      <el-slider
        v-model="config.control.height"
        :max="500"
        show-stops
        :step="50"
        style="width: 80%"
      />
    </el-form-item> -->
    <el-dialog v-model="pageInfo.showDialog" title="图片设置" width="520px">
      <ab-upload-file
        ref="pictureRef"
        v-model="config.control.picture"
        accept=".jpg,.jpeg,.png,.gif"
        dic-code="property"
        list-type="picture-card"
        size="small"
        style="max-width: 100%"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="pageInfo.showDialog = false">取消</el-button>
          <el-button type="primary" @click="dialogOk">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { defineProps, PropType, toRefs } from 'vue'
  import { Edit } from '@element-plus/icons-vue'
  import draggable from 'vuedraggable'
  import { abUploadFile } from '@ab-core'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const props = defineProps({
    config: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
  })
  const { config } = toRefs(props)
  const show = ref(true)
  const pageInfo = reactive({
    showDialog: false,
    isAdd: true,
  })

  const dialogOk = () => {
    console.log(config.value.control.picture)
    pageInfo.showDialog = false
  }
  const setPicture = () => {
    pageInfo.showDialog = true
  }
  onMounted(() => {
    if (!config.value.control.tcType) {
      config.value.control.tcType = 0
    }
    if (!config.value.control.autoplay) {
      config.value.control.autoplay = true
    }
  })
</script>
