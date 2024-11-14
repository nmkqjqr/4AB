<template>
  <el-dialog
    v-model="modelValue"
    :before-close="handleClose"
    :title="title + '流程配置预览'"
    width="100%"
  >
    <el-container>
      <el-header height="80px">
        <el-row>
          <el-space>
            <el-button>保存</el-button>
            <el-button @click="handleClose">取消</el-button>
          </el-space>
        </el-row>
        <el-row>
          <el-space>
            <el-checkbox
              v-model="showConfigList.userConfig"
              label="人员配置"
              size="large"
            />
            <el-checkbox
              v-model="showConfigList.formConfig"
              label="表单"
              size="large"
            />
            <el-checkbox
              v-model="showConfigList.freeJumpConfig"
              label="自由跳转节点配置"
              size="large"
            />
            <el-checkbox
              v-model="showConfigList.scriptConfig"
              label="前后置脚本"
              size="large"
            />
            <el-checkbox
              v-model="showConfigList.buttonConfig"
              label="节点按钮"
              size="large"
            />
            <el-checkbox
              v-model="showConfigList.branchConfig"
              label="分支脚本"
              size="large"
            />
            <el-checkbox
              v-model="showConfigList.golabConfig"
              label="全局配置"
              size="large"
            />
          </el-space>
        </el-row>
      </el-header>
      <el-divider class="dividermar" />
      <el-main>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="defSetting"
          :status-icon="false"
        >
          <el-card>
            <template #header>全局配置</template>
            <el-row :gutter="5">
              <el-col :span="8">
                <el-card :body-style="{ padding: '5px', height: '160px' }">
                  <template #header>全局表单</template>
                  <form-type v-model="defSetting.defaultForm" />
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card :body-style="{ padding: '5px', height: '160px' }">
                  <template #header>实例表单</template>
                  <form-type v-model="defSetting.instForm" />
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card :body-style="{ padding: '5px', height: '160px' }">
                  <template #header>打印表单</template>
                  <form-type v-model="defSetting.printForm" />
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="8">
                <el-card :body-style="{ padding: '5px' }">
                  <template #header>BO配置</template>
                  <el-table :data="defSetting.dataModelList">
                    <el-table-column label="名称" prop="name" />
                    <el-table-column label="编码" prop="code" />
                  </el-table>
                </el-card>
              </el-col>
              <el-col :span="16">
                <el-card :body-style="{ padding: '5px' }">
                  <template #header>初始化节点</template>
                  <el-table :data="defSetting.dataModelList">
                    <el-table-column label="初始化节点" prop="nodeId" />
                    <el-table-column label="脚本描述" prop="desc" />
                    <el-table-column label="初始化脚本" prop="beforeShow" />
                    <el-table-column label="保存数据前置脚本" prop="whenSave" />
                  </el-table>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
          <el-card>
            <template #header>节点配置</template>
            <el-card
              v-for="(node, nodeKey) in defSetting.nodeMap"
              :key="nodeKey"
            >
              <template #header>{{ node.nodeName }}</template>

              <el-row :gutter="5" style="margin-top: 10px" title="表单设置">
                <el-col :span="8">
                  <el-card>
                    <template #header>表单配置</template>
                    <form-type v-model="node.nodeForm" />
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card>
                    <template #header>人员配置</template>
                    <el-table :data="node.plugins.nodeUser">
                      <el-table-column label="候选人类型" prop="type" />
                      <el-table-column label="候选人" prop="users" />
                    </el-table>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card>
                    <template #header>前后置脚本配置</template>
                    <el-table :data="node.plugins.nodeUser">
                      <el-table-column label="候选人类型" prop="type" />
                      <el-table-column label="候选人" prop="users" />
                    </el-table>
                  </el-card>
                </el-col>
              </el-row>
              <el-row title="按钮设置">
                <el-col>
                  <el-card>
                    <template #header>按钮配置</template>

                    <el-button
                      v-for="(button, index) in node.buttonList"
                      :key="index"
                      type="primary"
                    >
                      {{ button.name }}
                    </el-button>
                    <el-table
                      :data="node.buttonList.filter((item:any)=>{
                    return item.javaScript || item.displayGroovy
                })"
                    >
                      <el-table-column label="名称" prop="name" />
                      <el-table-column label="动作" prop="actionName" />
                      <el-table-column label="前置脚本" prop="javaScript">
                        <template #default="{ scope }">
                          <el-form-item prop="javaScript">
                            <el-input
                              v-model="scope.row.javaScript"
                              type="textarea"
                            />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column label="groovy脚本" prop="displayGroovy">
                        <template #default="{ scope }">
                          <el-form-item prop="displayGroovy">
                            <el-input
                              v-model="scope.row.displayGroovy"
                              type="textarea"
                            />
                          </el-form-item>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </el-card>
        </el-form>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  import { bpmApi, abTools } from '~/agilebpm'
  import { Search, RefreshRight } from '@element-plus/icons-vue'
  import formType from './compoments/form-type.vue'
  const props = defineProps({
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: '流程配置预览' },
    defId: { type: String, required: true },
  })
  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()
  const formRef = ref<FormInstance>()
  const id = proxy.$route.params.id
  const showConfigList = reactive({
    userConfig: true,
    formConfig: true,
    buttonConfig: true,
    freeJumpConfig: true,
    scriptConfig: true,
    golabConfig: true,
    branchConfig: true,
  })

  const emit = defineEmits(['update:modelValue'])

  const { modelValue, title, defId } = toRefs(props)
  const handleClose = () => {
    modelValue.value = false
    emit('update:modelValue', false)
  }
  const defSetting = ref()
  const getSetting = async (defId: string) => {
    await bpmApi.bpmDefinition
      .getDefSetting(defId)
      .then((result) => {
        defSetting.value = result.data
      })
      .catch(() => {
        ElMessage({ message: '获取流程定义失败，请联系管理员！' })
      })
  }

  //获取流程定义数据
  watch(defId, (newDefId) => {
    getSetting(newDefId)
  })

  const tableData = [
    {
      name: 'PC端表单',
    },
    {
      name: '移动端表单',
    },
  ]
</script>
