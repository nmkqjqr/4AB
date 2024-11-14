<template>
  <el-button :icon="Edit" type="primary" @click="pageData.dialogVisible = true">
    修改
  </el-button>
  <el-dialog v-model="pageData.dialogVisible" title="按钮配置" width="660px">
    <el-container>
      <el-header>
        <el-dropdown split-button type="primary" @click="addButton">
          添加按钮
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in pageData.defaultButtons"
                :key="item.actionName"
                :disabled="isShow(item)"
                @click="addButton(item)"
              >
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button
          :icon="Orange"
          style="margin-left: 10px"
          type="success"
          @click="initButtons"
        >
          还原默认按钮
        </el-button>
      </el-header>
      <el-container style="max-height: 500px; padding: 20px">
        <el-aside width="300px">
          <draggable
            v-model="pageData.buttonList"
            v-bind="dragOptions"
            item-key="actionName"
            style="position: relative; display: flex; flex-wrap: wrap"
          >
            <template #item="{ element: item }">
              <div class="move-btn">
                <el-col :span="24" style="margin-bottom: 5px">
                  <el-card
                    body-style="padding: 10px;width:260px"
                    :class="
                      item.actionName &&
                      item.actionName === pageData.button.actionName
                        ? 'selected'
                        : ''
                    "
                    shadow="hover"
                  >
                    <el-row @click="showButton(item)">
                      <el-col :span="10">
                        {{ item.name }}
                      </el-col>
                      <el-col :span="10">
                        {{ item.actionName }}
                      </el-col>
                      <el-col class="flex-right" :span="4">
                        <el-button
                          :icon="Delete"
                          text
                          type="danger"
                          @click="
                            abUtil.Arrays.remove(item, pageData.buttonList)
                          "
                        />
                      </el-col>
                    </el-row>
                  </el-card>
                </el-col>
              </div>
            </template>
          </draggable>
        </el-aside>
        <el-main>
          <el-form
            v-if="pageData.button.name != 'empty~'"
            ref="formRef"
            label-position="top"
            label-suffix="："
            label-width="120px"
            :model="pageData.button"
            :status-icon="false"
          >
            <el-form-item
              label="按钮名称"
              prop="name"
              :rules="[
                { required: true, message: '必填' },
                { max: 50, message: '最多可输入50个字符' },
              ]"
            >
              <el-input v-model="pageData.button.name" />
            </el-form-item>
            <el-form-item
              label="动作编码"
              prop="actionName"
              :rules="[
                { required: true, message: '必填' },
                { max: 50, message: '最多可输入50个字符' },
              ]"
            >
              <el-input v-model="pageData.button.actionName" />
            </el-form-item>
            <el-form-item
              label="JS 脚本"
              prop="javaScript"
              :rules="[{ max: 255, message: '最多可输入255个字符' }]"
            >
              <el-popover :width="280">
                javascript脚本,会在点击当前按钮前执行，
                <br />
                可用参数 scope，即 abBpm 组件作用域
                <br />
                return true/false, 返回 false 时不做提交动作。
                <template #reference>
                  <el-icon><Opportunity /></el-icon>
                </template>
              </el-popover>
              <el-input v-model="pageData.button.javaScript" type="textarea" />
            </el-form-item>
            <el-form-item
              label="展示Groovy脚本"
              prop="displayGroovy"
              :rules="[{ max: 255, message: '最多可输入255个字符' }]"
            >
              <el-popover :width="270">
                Groovy 脚本，控制按钮是否显示，返回 false 不显示，返回
                true显示。
                <br />
                上下文变量：
                <br />
                1.流程变量
                <br />
                2.BO数据
                <br />
                返回:true/false。
                <template #reference>
                  <el-icon><Opportunity /></el-icon>
                </template>
              </el-popover>
              <el-input
                v-model="pageData.button.displayGroovy"
                type="textarea"
              />
            </el-form-item>
          </el-form>
          <el-empty
            v-else
            description="点击按钮可进行配置，拖拽按钮可进行排序"
          />
        </el-main>
      </el-container>
    </el-container>
    <template #footer>
      <span class="dialog-footer">
        <el-button text @click="pageData.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { PropType } from 'vue'
  import {
    Plus,
    Delete,
    Orange,
    Edit,
    Opportunity,
  } from '@element-plus/icons-vue'
  import Draggable from 'vuedraggable'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { ElMessage } from 'element-plus'
  import { bpmApi } from '@agilebpm/api'
  import { abT } from '@/i18n'

  const props = defineProps({
    buttonList: { required: true, type: Array as PropType<Array<BpmButton>> },
    nodeType: { required: true, type: String },
  })
  const { buttonList } = toRefs(props)

  const pageData = reactive({
    dialogVisible: false,
    defaultButtons: [] as Array<BpmButton>,
    buttonList: [] as Array<BpmButton>,
    button: { name: 'empty~' } as BpmButton,
  })

  const isShow = (btn: BpmButton) => {
    const reslt = pageData.buttonList.find(
      (item) => item.actionName === btn.actionName
    )
    return !!reslt
  }

  watch(
    () => pageData.dialogVisible,
    (newValue, oldValue) => {
      if (newValue === true) {
        pageData.buttonList = abUtil.clone(props.buttonList)
        pageData.button = { name: 'empty~' } as BpmButton
      }
    }
  )

  const ok = () => {
    let validate = true
    for (let index = 0; index < pageData.buttonList.length; index++) {
      const item = pageData.buttonList[index]
      if (!item.name || !item.actionName) {
        validate = false
        const str = item.name || item.actionName || `第${index + 1}个`
        ElMessage.error(`${str} 按钮配置不完整，请注意！`)
      }
    }
    if (!validate) return

    pageData.dialogVisible = false
    buttonList.value.length = 0
    // eslint-disable-next-line prefer-spread
    buttonList.value.push.apply(buttonList.value, pageData.buttonList)
  }

  const getBpmDefaultButtons = () => {
    bpmApi.bpmDefinition
      .getBpmDefaultButtons(props.nodeType, false)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          res.data.forEach((item) => {
            item.name = item.translate
          })
        }
        pageData.defaultButtons = res.data
      })
  }
  // 打开时执行初始化按钮加载，当修改按钮类型后也重置默认按钮
  getBpmDefaultButtons()
  watch(
    () => props.nodeType,
    (newValue, oldValue) => {
      getBpmDefaultButtons()
    }
  )

  const initButtons = () => {
    bpmApi.bpmDefinition
      .getBpmDefaultButtons(props.nodeType, true)
      .then((res: any) => {
        if (res.data && res.data.length > 0) {
          res.data.forEach((item) => {
            item.name = item.translate
          })
        }
        pageData.buttonList = abUtil.clone(res.data)
      })
  }

  const addButton = (item: BpmButton) => {
    if (item) {
      if (isShow(item)) return
      pageData.buttonList.push(abUtil.clone(item))
      return
    }
    pageData.button = {} as BpmButton
    pageData.buttonList.push(pageData.button)
  }

  const showButton = (button: any) => {
    pageData.button = button
  }

  const dragOptions = computed(() => {
    return {
      animation: 600,
      group: 'description',
      disabled: false,
      ghostClass: 'ghost',
    }
  })
</script>
<style scoped>
  .el-card.selected {
    border-color: red;
  }
</style>
