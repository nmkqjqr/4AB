<template>
  <div>
    <el-form
      :inline="true"
      label-position="left"
      label-width="100px"
      :model="info.data.leftTreeMap"
    >
      <el-form-item label="显示左边树">
        <el-switch
          v-model="info.data.leftTreeMap.showTree"
          active-color="#13ce66"
          active-value="1"
          class="ml-2"
          inactive-color="#dcdfe6"
          inactive-value="0"
          style="width: 200px"
        />
      </el-form-item>
      <template v-if="info.data.leftTreeMap.showTree == '1'">
        <el-form-item label="数据来源类型">
          <el-select
            v-model="info.data.leftTreeMap.dataFrom"
            clearable
            placeholder="请选择"
            style="width: 200px !important"
            @change="changedataFrom"
          >
            <el-option label="自定义对话框" value="1" />
            <el-option label="数据字典" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="info.data.leftTreeMap.dataFrom === '1'"
          label="自定义对话框"
        >
          <div style="width: 200px">
            <el-tag
              v-if="
                info.data.leftTreeMap.name &&
                info.data.leftTreeMap.name.length > 0
              "
              style="margin-right: 12px"
            >
              {{ info.data.leftTreeMap.name }}
            </el-tag>
            <ab-cust-dialog
              v-model="info.data.leftTreeMap.name"
              dialog-key="custDialog"
              :dialog-setting="{ multiple: false }"
              :param="{ style_$VEQ: 'tree' }"
              style="display: inline-block"
              @ok="choosezdydhklb"
            >
              选择
            </ab-cust-dialog>
          </div>
        </el-form-item>
        <el-form-item
          v-if="info.data.leftTreeMap.dataFrom === '2'"
          label="数据字典"
        >
          <el-tag
            v-if="
              info.data.leftTreeMap.name &&
              info.data.leftTreeMap.name.length > 0
            "
            style="margin-right: 12px"
          >
            {{ info.data.leftTreeMap.name }}
          </el-tag>
          <ab-cust-dialog
            v-model="info.data.leftTreeMap.name"
            dialog-key="sjzdsjq"
            :dialog-setting="{ multiple: false }"
            style="display: inline-block"
            @ok="chooseDict"
          >
            选择
          </ab-cust-dialog>
        </el-form-item>
        <el-form-item
          v-if="info.data.leftTreeMap.dataFrom === '4'"
          label="自定义列表"
        >
          <div style="width: 200px">
            <el-tag
              v-if="
                info.data.leftTreeMap.name &&
                info.data.leftTreeMap.name.length > 0
              "
              style="margin-right: 12px"
            >
              {{ info.data.leftTreeMap.name }}
            </el-tag>
            <ab-cust-dialog
              v-model="info.data.leftTreeMap.name"
              dialog-key="custGridDb"
              style="display: inline-block"
              @ok="chooseformCustList"
            >
              选择
            </ab-cust-dialog>
          </div>
        </el-form-item>
        <el-form-item v-if="info.data.leftTreeMap.dataFrom === '4'" label="id">
          <el-select
            v-model="info.data.leftTreeMap.idKey"
            clearable
            placeholder="id"
            style="width: 200px"
          >
            <el-option
              v-for="item in info.formDataOptions"
              :key="item.fieldName"
              :label="item.fieldDesc"
              :value="item.fieldName"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="info.data.leftTreeMap.dataFrom === '4'"
          label="显示名称"
        >
          <el-select
            v-model="info.data.leftTreeMap.nameKey"
            clearable
            placeholder="显示名称"
            style="width: 200px"
          >
            <el-option
              v-for="item in info.formDataOptions"
              :key="item.fieldName"
              :label="item.fieldDesc"
              :value="item.fieldName"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="info.data.leftTreeMap.dataFrom === '4'"
          label="父id"
        >
          <el-select
            v-model="info.data.leftTreeMap.pidKey"
            clearable
            placeholder="父id"
            style="width: 200px"
          >
            <el-option
              v-for="item in info.formDataOptions"
              :key="item.fieldName"
              :label="item.fieldDesc"
              :value="item.fieldName"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          v-if="info.data.leftTreeMap.dataFrom === '4'"
          label="value"
        >
          <el-select
            v-model="info.data.leftTreeMap.searchKey"
            clearable
            placeholder="value"
            style="width: 200px"
          >
            <el-option
              v-for="item in info.formDataOptions"
              :key="item.fieldName"
              :label="item.fieldDesc"
              :value="item.fieldName"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="根节点名称">
          <el-input
            v-model="info.data.leftTreeMap.rootName"
            :disabled="info.sync"
            :placeholder="
              !info.sync ? '请输入根节点' : '异步对话框无法设置根节点'
            "
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="关联查询字段">
          <el-select
            v-model="info.data.leftTreeMap.relField"
            clearable
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="item in info.data.sqlConditionVOS"
              :key="item.fieldName"
              :label="item.fieldDesc"
              :value="item.fieldName"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="info.data.leftTreeMap.dataFrom === '1'"
          label="对话框返回字段"
        >
          <el-select
            v-model="info.data.leftTreeMap.diaBack"
            clearable
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="item in info.data.leftTreeMap.backList"
              :key="item.columnName"
              :label="item.columnName"
              :value="item.columnName"
            />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import { sysApi, bizApi, postData, getData } from '~/agilebpm/api'
  const selectRef = ref('selectRef')
  const emit = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
    // eslint-disable-next-line vue/require-default-prop
  })

  const info: any = reactive({
    data: useVModel(props, 'modelValue', emit),
    leftTreeData: [],
    formDataOptions: [],
    sync: false,
  })

  watch(
    () => [props.modelValue],
    (now, old) => {
      info.data = now[0]
      if (!info.data.leftTreeMap) {
        info.data.leftTreeMap = {}
      } else {
        if (
          info.data.leftTreeMap.dataFrom === '4' ||
          info.data.leftTreeMap.dataFrom === 4
        ) {
          getDetails(info.data.leftTreeMap.code)
        }
      }
    }
  )
  // 类型为数据字典时请求
  const queryDictTypeTree = () => {
    postData(sysApi.dict.getDictTypeTreeUrl, {}).then(
      (result) => {
        info.leftTreeData = result.data
      },
      () => {}
    )
  }

  const changedataFrom = (value: any) => {
    info.data.leftTreeMap.backList = []
    info.data.leftTreeMap.diaBack = ''
    info.data.leftTreeMap.rootName = ''
    info.sync = false
    info.data.leftTreeMap.name = ''
    info.data.leftTreeMap.code = ''
  }

  // 选择分类
  const selectNodeClickFn = (row: any) => {
    // eslint-disable-next-line no-empty
    info.data.leftTreeMap.name = row.name
    info.data.leftTreeMap.code = row.code
    selectRef.value.visible = false
  }
  // do not use same name with ref
  const choosezdydhklb = (list: any) => {
    info.sync = false
    info.data.leftTreeMap.diaBack = ''
    info.data.leftTreeMap.rootName = ''
    setBackList(list[0].code)
    info.data.leftTreeMap.name = list[0].name
    info.data.leftTreeMap.code = list[0].code
  }
  // do not use same name with ref
  const chooseDict = (list: any) => {
    info.data.leftTreeMap.name = list[0].name
    info.data.leftTreeMap.code = list[0].code
  }
  const choosesysTree = (list: any) => {
    info.data.leftTreeMap.name = list[0].name
    info.data.leftTreeMap.code = list[0].code_
  }
  const chooseformCustList = (list: any) => {
    info.data.leftTreeMap.name = list[0].name_
    info.data.leftTreeMap.code = list[0].code_
    getDetails(list[0].code_)
  }
  const getDetails = (code: any) => {
    if (code) {
      getData(bizApi.custGrid.custGetByCodeUrl + code, {}).then(
        ({ data }) => {
          info.formDataOptions = data.fieldsList
        },
        (error) => {}
      )
    }
  }
  const setBackList = (code: any) => {
    if (code) {
      getData(bizApi.customDialog.getByCode + code, {}).then(
        (result: any) => {
          info.data.leftTreeMap.backList = result.data.returnFields
          info.sync = result.data.treeConfig.sync
        },
        (error) => {}
      )
    }
  }
  if (
    info.data.leftTreeMap.showTree == '1' &&
    info.data.leftTreeMap.dataFrom == '1' &&
    info.data.leftTreeMap.code.length > 0
  ) {
    setBackList(info.data.leftTreeMap.code)
  }
  onMounted(() => {
    queryDictTypeTree()
  })
</script>
