<template>
  <div>
    <div>
      <el-input v-model="info.data.svg" placeholder="请选择" readonly>
        <template #append>
          <el-button
            :disabled="props.disabled"
            :icon="Search"
            @click="chooseSvg"
          />
        </template>
      </el-input>
    </div>
    <el-dialog v-model="info.dialogVisible" title="选择图标" width="500px">
      <el-row>
        <el-col
          v-for="(item, index) in svgList"
          :key="index"
          class="svgBox"
          :class="index == info.svgIndex ? 'isActive' : ''"
          :span="4"
          @click="choose(item, index)"
        >
          <div class="svg">
            <svg-icon :icon="item.svg"/>
          </div>
          <!-- <div class="svgName">{{ item.name }}</div> -->
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button text type="primary" @click="info.dialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="ok">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<!-- 具体用法 -->
<!-- <el-form-item label="手机端图标" prop="svg">
        <choose-svg v-model="state.form.svg" />
        <svg-icon
          :icon="state.form.svg"
          style="width: 30px; height: 30px; margin-left: 12px"
        />
      </el-form-item> -->
<script setup lang="ts">
  import { relative } from 'path/posix'
  import { Search } from '@element-plus/icons-vue'
  import { ref, defineEmits, defineProps, watch, reactive } from 'vue'
  import svgIcon from '../svg-icon/index.vue'
  import { svgList } from './svgList'
  const RemixIconref = ref('RemixIconref')
  // update: 需要双向绑定的属性名
  const emit = defineEmits(['update:modelValue'])
  //v-model 默认的值为 value 可以通过 : 自定义
  const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    modelValue: {
      type: String,
      require: true,
    },
    disabled: {
      type: Boolean,
      require: false,
    },
  })
  const str = ref(props.modelValue)
  const info: any = reactive({
    data: {
      svg: props.modelValue,
    },
    dialogVisible: false,
    svgIndex: null,
    svg: '',
  })
  //监听父组件的值
  watch(
    () => props.modelValue,
    (now) => {
      info.data.svg = now
    }
  )
  // 选择图标
  const chooseSvg = () => {
    info.dialogVisible = true
    svgList.forEach((item, index) => {
      if (props.modelValue == item.svg) {
        info.svgIndex = index
      }
    })
  }
  const choose = (item: any, index: any) => {
    info.svgIndex = index
    info.svg = item.svg
  }
  const ok = () => {
    info.dialogVisible = false
    info.data.svg = info.svg
    emit('update:modelValue', info.svg)
  }
</script>

<style lang="scss" scoped>
  .svg {
    width: 50px;
    height: 50px;
    margin: 10px auto 0 auto;
    text-align: center;
  }
  .svgName {
    text-align: center;
  }
  .svgBox {
    cursor: pointer;
    border: 1px solid #fff;
  }
  .isActive {
    border: 1px solid #1890ff;
  }
</style>
