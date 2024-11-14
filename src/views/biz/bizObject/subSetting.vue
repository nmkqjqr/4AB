<template>
  <el-button :icon="Edit" type="primary" @click="open">配置子表</el-button>
  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    draggable
    :title="`${parent.tableComment}（${parent.tableCode}）的子表配置`"
    top="5vh"
    width="80%"
  >
    <el-form
      ref="formRef"
      :inline="true"
      :model="info.data"
      :status-icon="false"
    >
      <el-row style="margin-bottom: 5px">
        <ab-cust-dialog
          dialog-key="bizTableSelector"
          :dialog-setting="{ multiple: 1 }"
          :extra-data="info.data"
          :icon="Plus"
          type="primary"
          @ok="rootInfo.addSubTable"
        >
          添加业务子表
        </ab-cust-dialog>
      </el-row>

      <el-table
        border
        :data="info.data"
        empty-text="请添加业务子表"
        :style="info.tableStyle"
      >
        <el-table-column label="关系类型" width="150">
          <template #default="scope">
            <el-form-item>
              <el-select
                v-model="scope.row.type"
                style="width: 126px !important"
              >
                <el-option label="一对一" value="oneToOne" />
                <el-option label="一对多" value="oneToMany" />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="tableComment" width="150" />
        <el-table-column label="编码" prop="tableCode" width="150" />
        <el-table-column label="表名" width="150">
          <template #default="scope">
            <span v-if="rootInfo.tableMap[scope.row.tableCode]">
              {{ rootInfo.tableMap[scope.row.tableCode].name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="外键">
          <template #default="scope">
            <el-row
              v-for="(fk, index) in scope.row.fks"
              :key="index"
              :gutter="0"
            >
              <el-col :span="7">
                <el-form-item
                  :prop="`${scope.$index}.fks.${index}.from`"
                  :rules="[{ required: true, message: '必填' }]"
                >
                  <el-select
                    v-if="rootInfo.tableMap[scope.row.tableCode]"
                    v-model="fk.from"
                  >
                    <el-option
                      v-for="column in rootInfo.tableMap[scope.row.tableCode]
                        .columns"
                      :key="column.code"
                      :label="`${column.comment}（${column.code}）`"
                      :value="column.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item>
                  <el-select v-model="fk.type">
                    <el-option
                      v-for="item in rootInfo.BizObjectRelFkType"
                      :key="item.key"
                      :label="item.desc"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                  :prop="`${scope.$index}.fks.${index}.value`"
                  :rules="[{ required: true, message: '必填' }]"
                >
                  <el-select
                    v-if="
                      rootInfo.tableMap[parent.tableCode] &&
                      fk.type != 'fixedValue'
                    "
                    v-model="fk.value"
                  >
                    <el-option
                      v-for="column in rootInfo.tableMap[parent.tableCode]
                        .columns"
                      :key="column.code"
                      :label="`${column.comment}（${column.code}）`"
                      :value="column.code"
                    />
                  </el-select>
                  <el-input v-else v-model="fk.value" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <el-button
                    v-if="index > 0"
                    circle
                    :icon="Delete"
                    plain
                    type="danger"
                    @click="abUtil.Arrays.del(index, scope.row.fks)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-button
              circle
              :icon="Plus"
              plain
              type="primary"
              @click="rootInfo.addFk(scope.row.fks)"
            />
          </template>
        </el-table-column>
        <el-table-column label="加载方式" width="100">
          <template #default="scope">
            <el-switch
              v-if="scope.row.type == 'oneToMany'"
              v-model="scope.row.sync"
              active-text="同步"
              class="ml-2"
              inactive-text="异步"
              inline-prompt
              width="50px"
            />
            <el-tag v-else>同步</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              :icon="Delete"
              plain
              type="danger"
              @click="abUtil.Arrays.del(scope.$index, info.data)"
            />
            <sub-setting
              v-model="scope.row.children"
              :parent="scope.row"
              :root-info="rootInfo"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button text type="primary" @click="info.dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
  export default { name: 'SubSetting' }
</script>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { abUtil } from '~/agilebpm'
  import { Plus, Delete } from '@element-plus/icons-vue'
  import { Edit } from '@element-plus/icons-vue'

  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
    rootInfo: { required: true, type: Object },
    parent: { required: true, type: Object },
  })

  //页面用到的双向绑定的信息
  const formRef = ref<FormInstance>()
  const info: any = reactive({
    data: {},
    dialogVisible: false,
    tableStyle: {
      width: '100%',
      height: '60vh',
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const ok = () => {
    if (!formRef.value) return
    formRef.value.validate((valid) => {
      if (valid) {
        info.dialogVisible = false
        emit('update:modelValue', info.data)
      }
    })
  }

  const open = () => {
    //info.tableStyle.height = `${window.innerHeight * 0.5}px`
    info.dialogVisible = true
    info.data = abUtil.clone(props.modelValue || {})
  }
</script>
