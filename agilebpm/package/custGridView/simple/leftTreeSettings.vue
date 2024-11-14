<template>
  <div>
    <el-form label-position="right" label-width="90px">
      <el-form-item label="设置左边树">
        <el-button size="small" type="primary" @click="openSetLeftTree">
          设置
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      v-model="info.dialogVisible"
      :close-on-click-modal="false"
      title="设置左侧树"
      width="400px"
    >
      <el-form label-position="left" label-width="110px" :model="info.leftTree">
        <el-form-item label="开启左边树">
          <el-radio-group v-model="info.leftTree.showTree">
            <el-radio-button label="0">关闭</el-radio-button>
            <el-radio-button label="1">开启</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template v-if="info.leftTree.showTree == '1'">
          <el-form-item label="数据来源类型">
            <el-select
              v-model="info.leftTree.dataFrom"
              clearable
              placeholder="请选择"
              style="width: 100%"
              @change="changedataFrom"
            >
              <el-option label="自定义对话框" value="1" />
              <el-option label="数据字典" value="2" />
              <!-- <el-option label="自定义列表" value="4" /> -->
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="info.leftTree.dataFrom === '1'"
            label="自定义对话框"
          >
            <div style="width: 100%">
              <el-tag
                v-if="info.leftTree.name && info.leftTree.name.length > 0"
                style="margin-right: 12px"
              >
                {{ info.leftTree.name }}
              </el-tag>
              <ab-cust-dialog
                v-model="info.leftTree.name"
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
          <el-form-item v-if="info.leftTree.dataFrom === '2'" label="数据字典">
            <el-tag
              v-if="info.leftTree.name && info.leftTree.name.length > 0"
              style="margin-right: 12px"
            >
              {{ info.leftTree.name }}
            </el-tag>
            <ab-cust-dialog
              v-model="info.leftTree.name"
              dialog-key="sjzdsjq"
              :dialog-setting="{ multiple: false }"
              style="display: inline-block"
              @ok="chooseDict"
            >
              选择
            </ab-cust-dialog>
            <!-- <ab-select-tree
              v-if="info.leftTreeData && info.leftTreeData.length > 0"
              v-model="info.leftTree.name"
              style="width: 200px"
              :tree-data="info.leftTreeData"
            /> -->
          </el-form-item>
          <el-form-item
            v-if="info.leftTree.dataFrom === '4'"
            label="自定义列表"
          >
            <div style="width: 100%">
              <el-tag
                v-if="info.leftTree.name && info.leftTree.name.length > 0"
                style="margin-right: 12px"
              >
                {{ info.leftTree.name }}
              </el-tag>
              <ab-cust-dialog
                v-model="info.leftTree.name"
                dialog-key="custGridDb"
                style="display: inline-block"
                @ok="chooseformCustList"
              >
                选择
              </ab-cust-dialog>
            </div>
          </el-form-item>
          <el-form-item v-if="info.leftTree.dataFrom === '4'" label="id">
            <el-select
              v-model="info.leftTree.idKey"
              clearable
              placeholder="id"
              style="width: 100%"
            >
              <el-option
                v-for="item in info.formDataOptions"
                :key="item.fieldName"
                :label="item.fieldDesc"
                :value="item.fieldName"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="info.leftTree.dataFrom === '4'" label="显示名称">
            <el-select
              v-model="info.leftTree.nameKey"
              clearable
              placeholder="显示名称"
              style="width: 100%"
            >
              <el-option
                v-for="item in info.formDataOptions"
                :key="item.fieldName"
                :label="item.fieldDesc"
                :value="item.fieldName"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="info.leftTree.dataFrom === '4'" label="父id">
            <el-select
              v-model="info.leftTree.pidKey"
              clearable
              placeholder="父id"
              style="width: 100%"
            >
              <el-option
                v-for="item in info.formDataOptions"
                :key="item.fieldName"
                :label="item.fieldDesc"
                :value="item.fieldName"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item v-if="info.leftTree.dataFrom === '4'" label="value">
            <el-select
              v-model="info.leftTree.searchKey"
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
              v-model="info.leftTree.rootName"
              :disabled="info.sync"
              :placeholder="
                !info.sync ? '请输入根节点' : '异步对话框无法设置根节点'
              "
            />
          </el-form-item>
          <el-form-item label="关联查询字段">
            <el-select
              v-model="info.leftTree.relField"
              clearable
              placeholder="请选择"
              style="width: 100%"
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
            v-if="info.leftTree.dataFrom === '1'"
            label="对话框返回字段"
          >
            <el-select
              v-model="info.leftTree.diaBack"
              clearable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in info.leftTree.backList"
                :key="item.columnName"
                :label="item.columnName"
                :value="item.columnName"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button text type="primary" @click="info.dialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="saveLeftTree">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import { sysApi, bizApi, postData, getData } from '~/agilebpm/api'
  const selectRef = ref('selectRef')
  const emit = defineEmits(['update:modelValue', 'savetree'])
  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
    // eslint-disable-next-line vue/require-default-prop
  })

  const info: any = reactive({
    data: useVModel(props, 'modelValue', emit),
    leftTreeData: [],
    formDataOptions: [],
    dialogVisible: false,
    leftTree: {
      showTree: '0',
    },
    sync: false,
  })

  watch(
    () => [props.modelValue],
    (now, old) => {
      info.data = now[0]
      if (!info.data.leftTreeMap) {
        info.data.leftTreeMap = {}
      } else {
        if (info.data.leftTreeMap.dataFrom == '4') {
          getDetails(info.data.leftTreeMap.code)
        }
      }
    }
  )

  watch(
    () => info.leftTree.showTree,
    (now, old) => {
      if (now === '0') {
        info.leftTree.dataFrom = ''
        info.leftTree.name = ''
        info.leftTree.idKey = ''
        info.leftTree.nameKey = ''
        info.leftTree.pidKey = ''
        info.leftTree.searchKey = ''
        info.leftTree.rootName = ''
        info.leftTree.relField = ''
      }
    }
  )
  // 类型为数据字典时请求
  const queryDictTypeTree = () => {
    postData(sysApi.dict.getDictTypeTreeUrl, {}).then(
      (result: any) => {
        info.leftTreeData = result.data
      },
      () => {}
    )
  }

  const changedataFrom = (value: any) => {
    info.leftTree.backList = []
    info.leftTree.diaBack = ''
    info.leftTree.rootName = ''
    info.sync = false
    info.leftTree.relField = ''
    info.data.leftTreeMap.name = ''
    info.data.leftTreeMap.code = ''
  }

  const openSetLeftTree = () => {
    if (info.data.leftTreeMap.showTree == '1') {
      info.leftTree = info.data.leftTreeMap
    }
    if (info.data.leftTreeMap.dataFrom == '4') {
      if (info.data.leftTreeMap.code && info.data.leftTreeMap.code.length > 0) {
        getDetails(info.data.leftTreeMap.code)
      }
    }
    info.dialogVisible = true
  }

  const saveLeftTree = () => {
    info.data.leftTreeMap = info.leftTree
    emit('savetree')
    info.dialogVisible = false
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
    info.leftTree.diaBack = ''
    info.leftTree.rootName = ''
    setBackList(list[0].code)
    // info.leftTree.backList = []
    // for (const i in list[0]) {
    //   info.leftTree.backList.push({
    //     label: i,
    //     value: i,
    //   })
    // }
    info.leftTree.name = list[0].name
    info.leftTree.code = list[0].code
  }
  // do not use same name with ref
  const chooseDict = (list: any) => {
    info.leftTree.name = list[0].name
    info.leftTree.code = list[0].code
  }
  const choosesysTree = (list: any) => {
    info.data.leftTreeMap.name = list[0].name
    info.data.leftTreeMap.code = list[0].code_
  }
  const chooseformCustList = (list: any) => {
    info.leftTree.name = list[0].name
    info.leftTree.code = list[0].code
    getDetails(list[0].code)
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
          info.leftTree.backList = result.data.returnFields
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
<style scoped></style>
