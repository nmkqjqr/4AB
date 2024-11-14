<template>
  <div class="right_side">
    <el-tabs v-model="activeName" class="demo-tabs" stretch>
      <el-tab-pane label="组件配置" name="first">
        <div class="tabs_main_padding">
          <el-form
            v-if="formConf.key"
            label-suffix="："
            label-width="100px"
            :model="formConf"
          >
            <el-form-item label="组件名称">
              <el-input v-model="formConf.label" />
            </el-form-item>
            <el-form-item label="组件宽度">
              <el-radio-group v-model="formConf.w" size="small">
                <el-radio-button :label="24">整行</el-radio-button>
                <el-radio-button :label="6">1/4</el-radio-button>
                <el-radio-button :label="8">1/3</el-radio-button>
                <el-radio-button :label="12">1/2</el-radio-button>
                <el-radio-button :label="16">2/3</el-radio-button>
              </el-radio-group>
              <el-row :gutter="10">
                <el-col :span="8"><el-input-number v-model="formConf.w" class="inputNumber" controls-position="right" :step="2" style="width:100%;"/></el-col>
                <el-col :span="16">
                  <el-slider
                    v-model="formConf.w"
                    :max="24"
                    :min="1"
                    show-stops
                    :step="2"
                  />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="组件高度">
              <el-radio-group v-model="formConf.h" size="small">
                <el-radio-button :label="20">20</el-radio-button>
                <el-radio-button :label="50">50</el-radio-button>
                <el-radio-button :label="100">100</el-radio-button>
                <el-radio-button :label="150">150</el-radio-button>
                <el-radio-button :label="200">200</el-radio-button>
              </el-radio-group>
              <el-row :gutter="10">
                <el-col :span="8"><el-input-number v-model="formConf.h" class="inputNumber" controls-position="right" :step="10" style="width:100%;"/></el-col>
                <el-col :span="16">
                  <el-slider
                    v-model="formConf.h"
                    :max="200"
                    :min="1"
                    show-stops
                    :step="10"
                  />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="高度自适应">
              <el-switch v-model="formConf.heightAuto" />
            </el-form-item>
            <el-form-item
              v-if="formConf && formConf.type == 'grid'"
              label="显示边框"
            >
              <el-switch v-model="formConf.border" />
            </el-form-item>
            <el-divider
              v-if="formConf && ['divider'].includes(formConf.type)"
              content-position="center"
            >
              分割线配置
            </el-divider>
            <el-divider
              v-if="formConf && ['title'].includes(formConf.type)"
              content-position="center"
            >
              标题配置
            </el-divider>
            <el-divider
              v-if="formConf && ['tip'].includes(formConf.type)"
              content-position="center"
            >
              提示配置
            </el-divider>
            <el-form-item
              v-if="formConf && ['tip'].includes(formConf.type)"
              label="内容"
              :rules="[{ required: true, message: '必填' }]"
            >
              <el-input
                v-model="formConf.control.text"
                clearable
                show-word-limit
                placeholder="请输入提示"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="formConf && ['tip'].includes(formConf.type)"
              label="类型"
            >
              <el-select v-model="formConf.control.textType" placeholder="请选择提示类型">
                <el-option label="成功" value="success" />
                <el-option label="信息" value="info" />
                <el-option label="警告" value="warning" />
                <el-option label="错误" value="error" />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="formConf && ['tip'].includes(formConf.type)"
              label="主题"
            >
              <el-radio-group v-model="formConf.control.effect">
                <el-radio-button label="light" >浅色</el-radio-button>
                <el-radio-button label="dark" >深色</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="formConf && ['tip'].includes(formConf.type)"
              label="显示图标"
            >
              <el-switch v-model="formConf.control.showIcon" inline-prompt active-text="是" inactive-text="否"/>
            </el-form-item>
            <el-form-item
              v-if="formConf && ['divider', 'title','tip'].includes(formConf.type)"
              label="对齐方式"
            >
              <el-radio-group v-model="formConf.control.align">
                <el-radio-button label="left">左对齐</el-radio-button>
                <el-radio-button label="center">居中</el-radio-button>
                <el-radio-button label="right">右对齐</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div v-if="formConf && formConf.type == 'grid'">
              <el-divider content-position="center">内部栅格配置</el-divider>
              <div
                v-for="(item, index) in formConf.columns"
                :key="index"
                class="columns_item_config"
              >
                <span style="margin-right: 8px">{{ index + 1 }}</span>
                <el-slider
                  v-model="item.attr.span"
                  :max="24"
                  :min="2"
                  show-stops
                  :step="2"
                  style="width: 80%"
                />
                <el-icon :size="22" @click="showConditionEdit(item)">
                  <Edit />
                </el-icon>
              </div>
            </div>
            <div v-if="componentConfigPage[formConf.type]">
              <component
                :is="componentConfigPage[formConf.type]"
                :config="formConf"
                :form-combination="formCombination"
              />
            </div>
            <el-divider content-position="center" style="margin-top: 26px">
              组件背景配置
            </el-divider>
            <el-form-item
              v-if="
                formConf.type !== 'tabs' &&
                formConf.type !== 'grid' &&
                formConf.type !== 'collapse' &&
                formConf.type !== 'card'
              "
              label="组件背景"
            >
              <el-radio-group v-model="formConf.backgroundType">
                <el-radio label="color">颜色</el-radio>
                <el-radio label="picture">图片</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="formConf.backgroundType == 'color'"
              label="背景颜色"
            >
              <el-color-picker
                v-model="formConf.backgroundColor"
                popper-class="colorDiaStyle"
                :predefine="predefineColors"
                show-alpha
              />
            </el-form-item>
            <el-form-item
              v-if="formConf.backgroundType == 'picture'"
              label="背景图片"
            >
              <ab-upload-file
                v-model="formConf.backgroundPicture"
                accept=".jpg,.jpeg,.png,.gif"
                dic-code="property"
                :limit="1"
                list-type="picture-card"
                size="small"
                style="max-width: 100%"
                :upload-style-class="true"
              />
            </el-form-item>
            <el-form-item
              v-if="formConf.backgroundType == 'picture'"
              label="背景透明度"
            >
              <el-slider
                v-model="formConf.backgroundTransparency"
                :max="1"
                :min="0"
                show-stops
                :step="0.1"
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item
              v-if="formConf.backgroundType == 'picture'"
              label="填充方式"
            >
              <el-radio-group v-model="formConf.tcType" size="small">
                <el-radio-button :label="0">原图居中</el-radio-button>
                <el-radio-button :label="1">拉伸填满</el-radio-button>
                <el-radio-button :label="2">平铺</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div>
              <showConditionConfig
                :config="formConf"
                :form-combination="formCombination"
              />
            </div>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="全局配置" name="second">
        <global-config :form-combination="props.formCombination" />
      </el-tab-pane>
    </el-tabs>
  </div>
  <el-dialog v-model="state.dialogVisible" title="展示条件设置" width="500px">
    <el-form-item label="展示条件">
      <el-input
        v-model="state.tempData.showCondition"
        placeholder="设置该栏格展示的条件，默认展示"
        type="textarea"
      />
      <el-select placeholder="条件参数选择">
        <el-option
          v-for="item in formCombination.designJson.params"
          :key="item.name"
          :label="item.name"
          :value="item.name"
          @click="
            state.tempData.showCondition =
              (state.tempData.showCondition || '') + 'globalParams.' + item.name
          "
        />
      </el-select>
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="state.dialogVisible = false">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { defineProps, PropType, toRefs } from 'vue'
  import globalConfig from '../config/globalConfig.vue'
  import { componentConfigPage } from '../config/layoutconfig'
  import showConditionConfig from '../config/showConditionConfig.vue'
  import { abUploadFile } from '@ab-core'
  import { Edit } from '@element-plus/icons-vue'

  const props = defineProps({
    activeId: String,
    activeCol: String,
    formConf: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
    formCombination: {
      required: true,
      type: Object as PropType<FormCombination>,
    },
  })
  const { formConf, formCombination } = toRefs(props)
  const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
  ])

  // if (!formCombination.value.typeCode) {
  //   formCombination.value.typeCode = 'mrfl'
  // }

  const state = reactive({
    activeName: 'second',
    dialogVisible: false,
    tempData: {} as any,
  })

  const showConditionEdit = (item: any) => {
    state.tempData = item
    state.dialogVisible = true
  }

  const { activeName } = toRefs(state)

  watch(
    () => props.activeId,
    (value, old) => {
      if (value) {
        state.activeName = 'first'
      } else {
        state.activeName = 'second'
      }
    }
  )

</script>
<style lang="scss">
  @import '../styles/index.scss';
</style>
