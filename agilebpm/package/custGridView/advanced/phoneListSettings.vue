<template>
  <div>
    <el-form
      :inline="true"
      label-position="left"
      label-width="100px"
      :model="info.data.appConfMap"
    >
      <el-form-item label="支持手机端">
        <el-switch
          v-model="info.data.enableApp"
          active-color="#13ce66"
          :active-value="1"
          class="ml-2"
          inactive-color="#dcdfe6"
          :inactive-value="0"
          style="width: 200px"
        />
      </el-form-item>
      <template v-if="info.data.enableApp">
        <el-form-item label="图标">
          <div style="width: 200px">
            <ab-choose-svg
              v-model="info.data.appConfMap.icon"
              style="float: left; width: 120px"
            />
            <svg-icon
              :icon="info.data.appConfMap.icon"
              style="width: 30px; height: 30px; margin-left: 12px"
            />
          </div>
        </el-form-item>
        <el-form-item label="手机表单">
          <div style="width: 200px">
            <el-tag
              v-if="
                info.data.appConfMap.formName &&
                info.data.appConfMap.formName.length > 0
              "
              style="margin-right: 12px"
            >
              {{ info.data.appConfMap.formName }}
            </el-tag>
            <ab-cust-dialog
              v-model="info.data.appConfMap.formName"
              dialog-key="formSelector"
              :param="{
                bo_code_:
                  info.data.appConfMap.boCode &&
                  info.data.appConfMap.boCode.length > 0
                    ? info.data.appConfMap.boCode
                    : '',
                type_: 'mobile',
              }"
              style="display: inline-block"
              @ok="chooseformSelector"
            >
              选择
            </ab-cust-dialog>
          </div>
        </el-form-item>
        <el-form-item label="列表模式">
          <div style="width: 200px">
            <el-tag>简易模板</el-tag>
            <el-tooltip
              effect="light"
              placement="right"
              popper-class="tipBackground"
            >
              <template #content>
                <h5>模板效果示例</h5>
                <el-image
                  :src="require('@/assets/formCustSql_images/appListImg.png')"
                />
              </template>
              <el-icon style="margin-left: 12px"><QuestionFilled /></el-icon>
              <!-- <el-button>Top center</el-button> -->
            </el-tooltip>
            <!-- <el-select
              v-model="info.data.appConfMap.temp"
              placeholder="请选择"
              style="width: 200px"
            >
              <el-option label="简易模板" value="1" />
              <el-option label="全单列模板" value="2" />
              <el-option label="全双列模板" value="3" />
            </el-select> -->
          </div>
        </el-form-item>
        <el-form-item label="标题插槽">
          <el-select
            v-model="info.data.appConfMap.titleKey"
            clearable
            placeholder="请选择"
            style="width: 200px !important"
          >
            <el-option
              v-for="item in info.data.fieldsList"
              :key="item.name"
              :label="item.fieldDesc"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间插槽">
          <el-select
            v-model="info.data.appConfMap.time"
            clearable
            placeholder="请选择"
            style="width: 200px !important"
          >
            <el-option
              v-for="item in info.data.fieldsList"
              :key="item.name"
              :label="item.fieldDesc"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态插槽">
          <el-select
            v-model="info.data.appConfMap.type"
            clearable
            placeholder="请选择"
            style="width: 200px !important"
          >
            <el-option
              v-for="item in info.data.fieldsList"
              :key="item.name"
              :label="item.fieldDesc"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作插槽">
          <el-checkbox-group
            v-model="info.data.appConfMap.btnGroup"
            size="small"
            style="width: 200px !important"
          >
            <template
              v-for="(item, index) in info.data.sqlButtonVO"
              :key="index"
            >
              <el-checkbox
                v-if="item.type === '1' && item.exp"
                border
                :label="item.alias"
                style="margin-bottom: 10px"
              >
                {{ item.name }}
              </el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="内容插槽">
          <el-table
            border="1"
            :data="info.data.appConfMap.table"
            style="width: 350px"
          >
            <el-table-column label="标题插槽" prop="title" width="">
              <template #default="scope">
                <el-input
                  v-model="scope.row.title"
                  placeholder="请输入标题插槽"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="值插槽" prop="value">
              <template #default="scope">
                <el-select
                  v-model="scope.row.value"
                  clearable
                  placeholder="请选择值插槽"
                  size="small"
                  style="width:100% !important"
                >
                  <el-option
                    v-for="item in info.data.fieldsList"
                    :key="item.fieldName"
                    :label="item.fieldDesc"
                    :value="item.fieldName"
                  />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              label="操作"
              prop="enable"
              width="120"
            >
              <template #header>
                <span>操作</span>
                <el-button
                  size="small"
                  style="float: right"
                  type="primary"
                  @click="addTableItem"
                >
                  添加
                </el-button>
              </template>
              <template #default="scope">
                <el-button
                  size="small"
                  type="text"
                  @click="delTableItem(scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-select
              v-model="info.data.appConfMap.descKey"
              placeholder="请选择"
              style="width: 200px"
            >
              <el-option
                v-for="item in info.data.fieldsList"
                :key="item.name"
                :label="item.fieldDesc"
                :value="item.name"
              />
            </el-select> -->
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import { abChooseSvg, svgIcon } from '@ab-core'
  const emit = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
    // eslint-disable-next-line vue/require-default-prop
  })
  const info: any = reactive({
    data: useVModel(props, 'modelValue', emit),
  })

  const chooseformSelector = (list: any) => {
    info.data.appConfMap.formName = list[0].name
    info.data.appConfMap.code = list[0].code
  }
  const addTableItem = () => {
    if (!info.data.appConfMap.table) {
      info.data.appConfMap.table = []
    }
    info.data.appConfMap.table.unshift({
      title: '',
      value: '',
    })
  }
  const delTableItem = (index: any) => {
    info.data.appConfMap.table.splice(index, 1)
  }
</script>
