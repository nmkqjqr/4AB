<template>
  <div
    class="treeBoxHeight"
    shadow="hover"
    style="padding: 10px"
    :style="{ height: state.height,width: '100%' }"
  >
    <el-tree
      ref="treeRef"
      :data="state.data"
      default-expand-all
      :expand-on-click-node="false"
      :highlight-current="true"
      node-key="id"
      :props="state.defaultProps"
      @node-click="handleNodeClick"
    >
      <template #default="{ data }">
        <span class="custom-tree-node">
          <el-dropdown
            v-if="
              props.operationIgnoreAdmin &&
              (state.operation || state.username === 'admin')
            "
            trigger="contextmenu"
            @visible-change="handleChange($event, data)"
          >
            <span class="el-dropdown-link" :title="data.name">
              {{ data.name }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="append(data)">
                  {{ $abT('page.common.add','添加') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="data.parentId.length > 0"
                  @click="edit(data)"
                >
                  {{ $abT('page.common.edit','编辑') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="data.parentId.length > 0"
                  @click="remove(data)"
                >
                  {{ $abT('page.common.del','删除') }}
                </el-dropdown-item>
                <el-dropdown-item @click="reload(data)">
                  {{ $abT('page.layout.refresh','刷新') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span v-else :title="data.name">
            {{ data.name }}
          </span>
        </span>
      </template>
    </el-tree>
  </div>
  <el-dialog v-model="state.dictdialogVisible" :title="$abT('page.common.add','添加')" width="30%">
    <el-form
      ref="dictruleFormRef"
      class="demo-ruleForm"
      label-width="70px"
      :model="state.dictruleForm"
    >
      <el-form-item
        :label="$abT('page.common.dictName','名称')"
        prop="name"
        :rules="[{ required: true, message: $abT('page.common.required','必填') }]"
      >
        <ab-pinyin
          v-model="state.dictruleForm.name"
          v-model:to="state.dictruleForm.code"
          :placeholder="$abT('page.common.enterName','请输入名称')"
        />
      </el-form-item>
      <el-form-item
        v-if="state.dictruleForm.translatedName && state.dictruleForm.translatedName.length > 0"
        :label="$abT('page.common.translatedName','翻译名')"
        prop="translatedName"
      >
        <el-tag>
          {{state.dictruleForm.translatedName}}
        </el-tag>
      </el-form-item>
      <el-form-item
        :label="$abT('page.common.dictCode','编码')"
        prop="code"
        :rules="[
          { required: true, message: $abT('page.common.required','必填') },
          state.BizValidatorMap.varirule.rule,
        ]"
      >
        <el-input
          v-model="state.dictruleForm.code"
          :placeholder="$abT('page.common.enterCode','请输入编码')"
        />
      </el-form-item>
      <el-form-item :label="$abT('page.common.dictSort','序号')" prop="sn">
        <el-input v-model="state.dictruleForm.sn" type="number" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          text
          type="primary"
          @click="state.dictdialogVisible = false"
        >
          {{ $abT('page.common.cancel','取消') }}
        </el-button>
        <el-button
          :loading="state.dictsaveLoading"
          type="primary"
          @click="dictsubmitForm(dictruleFormRef)"
        >
          {{ $abT('page.common.ok','确定') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
  export default { name: 'AbDictTree' }
</script>
<script setup lang="ts">
  import { ref, reactive, watch, nextTick } from 'vue'
  import {
    sysApi,
    bizApi,
    registerApi,
    postData,
    getData,
  } from '~/agilebpm/api'
  import useAbStoreAdapter from '../../../../api/ab-store'
  import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
  import { storage } from '@/config'
  import {abT} from "@/i18n";

  const abUser = useAbStoreAdapter().getAbUser
  const dictruleFormRef = ref<FormInstance>()
  // update: 需要双向绑定的属性名
  const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    modelValue: {
      type: String,
      require: true,
    },

    //字典编码
    typeCode: { required: true, type: String },

    //是否启用operation右键编辑菜单 ，（此设置对管理员账号无效，管理员强制开启右键编辑按钮）。
    operation: {
      type: Boolean,
      default: false,
    },
    //跟operation唯一区别就是权限更大，不受管理员账户影响
    operationIgnoreAdmin: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmits([
    'nodeClick',
    'addClick',
    'editClick',
    'reloadClick',
    'removeClick',
    'update:modelValue',
  ])
  // eslint-disable-next-line vue/no-setup-props-destructure
  const state: any = reactive({
    height: `${window.innerHeight - (110 + 32 + 20 + 60)}px`,
    data: [],
    operation: props.operation,
    defaultExpanded: [],
    id: null,
    defaultProps: { children: 'children', label: 'name' },
    username: abUser.username,
    dictdialogVisible: false,
    dictsaveLoading: false,
    dictruleForm: {
      name: '',
      code: '',
      dictType: 'node',
      sn: 1,
      translatedName:''
    },
    BizValidatorMap: null,
    dictKey: '',
    isEdit: false,
    dictrow: {},
    codeStr: '',
    focusModeData: null,
  })
  watch(
    () => state.dictdialogVisible,
    (amount, prevamount) => {
      if (!amount) {
        state.dictruleForm = {
          name: '',
          code: '',
          dictType: 'node',
          sn: 1,
        }
      }
      nextTick(() => {
        dictruleFormRef.value?.clearValidate()
      })
    }
  )

  const filterItem = (treeData: any) => {
    for (let i = 0; i < treeData.length; i++) {
      if (treeData[i].disable == 1) {
        treeData.splice(i, 1)
      }
      if (treeData[i].children && treeData[i].children.length > 0) {
        filterItem(treeData[i].children)
      }
    }
  }

  const treeRef = ref('treeRef')
  const getDictDataTree = async () => {
    const result = await sysApi.dict.getDictDataUrl({
      dictKey: props.typeCode,
      hasRoot: true,
    })
    if(!result.data){
      return
    }
    state.data = result.data
    filterItem(state.data)
    state.data[0].name = abT('page.common.rootNode','所有数据')
    dfsPreTreeRecursion(state.data, (treeItem: any) => {
      treeItem.showMenu = true
    })
    const typeCodeMap = { biz: 'bizTypeCode', flowType: 'flowTypeCode' } //专注模式目前只支持业务和流程分类
    if (storage && 'localStorage' == storage && typeCodeMap[props.typeCode]) {
      if (localStorage.getItem('focusModeData')) {
        state.focusModeData = JSON.parse(localStorage.getItem('focusModeData'))
        if (state.focusModeData.open) {
          const node = getNode(
            state.focusModeData[typeCodeMap[props.typeCode]],
            state.data[0]
          )
          if (node) {
            handleNodeClick(node)
            setTimeout(() => {
              treeRef.value.setCurrentNode(node)
            }, 100)
          }
        }
      }
    }
  }

  /**
   * 递归根据编码找到节点信息
   */
  const getNode = (code: any, node: any) => {
    let result: any
    if (node.code == code) {
      result = node
    } else if (node.children) {
      node.children.forEach((n: any) => {
        if (result) {
          return
        }
        result = getNode(code, n)
      })
    }
    return result
  }

  const handleChange = (value: any, data: any) => {}
  const dfsPreTreeRecursion = (tree: any, func: any) => {
    const nodes = tree.slice()
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      func(node)
      if (node.children && node.children.length) {
        dfsPreTreeRecursion(node.children, func)
      }
    }
  }
  // 遍历树形数据
  const traverseTree = (node: any) => {
    state.codeStr += `${node.code},`
    if (node.children) {
      node.children.forEach((child: any) => {
        traverseTree(child) // 递归调用遍历子节点
      })
    }
  }

  const handleNodeClick = (val: any) => {
    if (!val.parentId || val.parentId == '0' || val.parentId == '') {
      emit('update:modelValue', '')
    } else {
      state.codeStr = ''
      traverseTree(val)
      state.codeStr = state.codeStr.slice(0, -1)
      emit('update:modelValue', state.codeStr)
    }
    emit('nodeClick', val)
  }

  bizApi.bizPattern.getAllBizValidator().then((data) => {
    state.BizValidatorMap = data
  })
  // 提交表单
  const dictsubmitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        state.dictsaveLoading = true
        postData(sysApi.dict.saveDataDictUrl, {
          ...state.dictruleForm,
          dictKey: state.dictKey,
          parentId: state.isEdit ? state.dictrow.parentId : state.dictrow.id,
          typeCode: state.dictrow.typeCode,
        })
          .then(
            ({ msg }) => {
              ElMessage({
                showClose: true,
                message: abT('page.common.operateSuccess','操作成功'),
                type: 'success',
              })
              getDictDataTree()
              state.dictdialogVisible = false
              state.dictsaveLoading = false
            },
            () => {
              state.dictsaveLoading = false
            }
          )
          .catch(() => {
            state.dictsaveLoading = false
          })
      } else {
        console.log('error submit!', fields)
      }
    })
  }
  // const getDictData = () => {
  //   getDictDataUrl({ dictKey: info.dictKey, hasRoot: true }).then((result) => {
  //     info.dictTreeData = result.data
  //   })
  // }
  const append = (val: any) => {
    if (state.username === 'admin') {
      state.dictdialogVisible = true
      state.dictKey = val.dictKey
      state.isEdit = false
      state.dictrow = val
    } else {
      emit('addClick', val)
    }
  }
  const edit = (val: any) => {
    if (state.username === 'admin') {
      state.dictdialogVisible = true
      state.dictKey = val.dictKey
      state.isEdit = true
      state.dictrow = val
      state.dictruleForm = JSON.parse(JSON.stringify(val))
      // translatedName 翻译名
      state.dictruleForm.translatedName = ''
      if(state.dictruleForm.name !== state.dictruleForm.realName){
        state.dictruleForm.translatedName = JSON.parse(JSON.stringify(state.dictruleForm.name))
        state.dictruleForm.name = JSON.parse(JSON.stringify(state.dictruleForm.realName))
      }
    } else {
      emit('editClick', val)
    }
  }
  const reload = (val: any) => {
    if (state.username === 'admin') {
      getDictDataTree()
    } else {
      emit('reloadClick', val)
    }
  }
  // 删除按钮点击
  const remove = (val: any) => {
    if (state.username === 'admin') {
      if (val.id) {
        ElMessageBox.confirm(abT('page.portal.sureDel','确定删除吗？'), abT('page.common.prompt','提示'), {
          confirmButtonText: abT('page.common.ok','确定'),
          cancelButtonText: abT('page.common.cancel','取消'),
          type: 'warning',
        })
          .then(() => {
            getData(sysApi.dict.removeDataDictUrl + val.id, {}).then(
              ({ msg }) => {
                ElMessage({
                  showClose: true,
                  message: abT('page.common.operateSuccess','操作成功'),
                  type: 'success',
                })
                getDictDataTree()
              }
            )
          })
          .catch(() => {})
      }
    } else {
      emit('removeClick', val)
    }
  }

  onMounted(() => {
    getDictDataTree()
  })
</script>
<style lang="scss" scoped>
  .custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    font-size: 14px;
  }
</style>
