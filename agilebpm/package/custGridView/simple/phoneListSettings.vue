<template>
  <div>
    <el-form
      label-position="right"
      label-width="90px"
      :model="info.data.appConfMap"
    >
      <el-form-item label="手机端设置">
        <el-button size="small" type="primary" @click="openSetPhone">
          设置
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      v-model="info.dialogVisible"
      :close-on-click-modal="false"
      title="手机端设置"
      width="500px"
    >
      <el-form
        label-position="left"
        label-width="90px"
        :model="info.data.appConfMap"
      >
        <el-form-item label="手机端设置">
          <el-radio-group v-model="info.data.enableApp">
            <el-radio-button :label="0">关闭</el-radio-button>
            <el-radio-button :label="1">开启</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template v-if="info.data.enableApp">
          <el-form-item label="图标">
            <ab-choose-svg v-model="info.data.appConfMap.icon" />
            <svg-icon
              :icon="info.data.appConfMap.icon"
              style="width: 30px; height: 30px; margin-left: 12px"
            />
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
          </el-form-item>
          <el-form-item label="标题插槽">
            <el-select
              v-model="info.data.appConfMap.titleKey"
              clearable
              placeholder="请选择"
              style="width: 200px"
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
              style="width: 200px"
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
              style="width: 200px"
            >
              <el-option
                v-for="item in info.data.fieldsList"
                :key="item.name"
                :label="item.fieldDesc"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="内容插槽">
            <el-table border="1" :data="info.data.appConfMap.table">
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
          <el-form-item label="操作插槽">
            <el-checkbox-group
              v-model="info.data.appConfMap.btnGroup"
              size="small"
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
        </template>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button text type="primary" @click="info.dialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="savePhone">确定</el-button>
        </span>
      </template>
    </el-dialog>
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
    dialogVisible: false,
  })

  watch(
    () => info.data.enableApp,
    (now, old) => {
      if (now === 0) {
        info.data.appConfMap = {}
      }
    }
  )

  const openSetPhone = () => {
    if (!info.data.appConfMap.table) {
      info.data.appConfMap.table = []
    }
    if (!info.data.appConfMap.btnGroup) {
      info.data.appConfMap.btnGroup = []
    }
    info.dialogVisible = true
  }
  const savePhone = () => {
    info.dialogVisible = false
  }

  const chooseformSelector = (list: any) => {
    info.data.appConfMap.formName = list[0].name
    info.data.appConfMap.code = list[0].code
  }
  const addTableItem = () => {
    info.data.appConfMap.table.unshift({
      title: '',
      value: '',
    })
  }
  const delTableItem = (index: any) => {
    info.data.appConfMap.table.splice(index, 1)
  }
</script>
<style lang="scss" scoped>
  .tipBackground {
    background-color: blue !important;
  }
</style>
