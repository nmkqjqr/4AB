<template>
  <span>
    <span v-if="!props.custom">
      <el-button
        v-if="!props.ispre && info.hasSlot"
        v-bind="$attrs"
        @click="openDialog"
      >
        <slot></slot>
      </el-button>
      <el-button
        v-if="!props.ispre && !info.hasSlot"
        v-bind="$attrs"
        @click="openDialog"
      />
    </span>
    <template v-if="props.custom">
      <div v-bind="$attrs" @click="openDialog">
        <slot></slot>
      </div>
    </template>
    <el-dialog
      v-model="visible"
      :append-to-body="props.setAppendToBody"
      class="dialogStyleBox"
      :close-on-click-modal="false"
      :title="$abT('custDialog.' + props.dialogKey + '.' + props.dialogKey + 'Title',info.dialog.name)"
      :width="info.dialog.width"
    >
      <div
        class="box"
        style="overflow: auto"
        :style="{ height: info.dialogHeight }"
      >
        <!-- 列表对话框（包含左侧树） -->
        <ab-cust-dialog-list
          v-if="info.flag && visible && info.dialog.style == 'list'"
          ref="listDialog"
          :dialog="info.dialog"
          :init-data="info.initData"
          :param="props.param"
        />
        <!-- 树型对话框-->
        <ab-cust-dialog-tree
          v-if="info.flag && visible && info.dialog.style == 'tree'"
          ref="treeDialog"
          :dialog="info.dialog"
          :init-data="info.initData"
          :param="props.param"
          style="padding: 10px 6px"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button text type="primary" @click="cancel">{{$abT('page.common.cancel','取消')}}</el-button>
          <el-button
            v-if="props.dialogSetting && props.dialogSetting.custom"
            text
            type="primary"
            @click="addCustom"
          >
            {{$abT('page.common.add','添加')}}
          </el-button>
          <el-button type="primary" @click="ok">{{$abT('page.common.ok','确定')}}</el-button>
        </span>
      </template>
    </el-dialog>
    <el-drawer
      v-if="props.dialogSetting && props.dialogSetting.custom"
      v-model="info.addCustomDialog"
      :append-to-body="props.setAppendToBody"
      class="addCustomDrawerStyle"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :size="950"
      :with-header="false"
    >
      <CustomDialogEdit
        :dialog-setting="props.dialogSetting"
        @close-fn="closeFn"
      />
    </el-drawer>
  </span>
</template>
<script lang="ts">
  export default { name: 'AbCustDialog' }
</script>
<script lang="ts" setup>
  /**
   * <ab-cust-dialog dialogKey="ywblb" v-model="data" :dialogSetting="dialogSetting" :param="{}">
   * </ab-cust-dialog>
   * 参数说明:
   * dialogKey（必填）:对话框编码
   * v-model（选填）:对话框内容的赋值对象
   * valueMapping（选填）:定义对话框返回字段 与 v-model的属性的映射关系{id:bizId,name:bizName}，用于自动赋值
   * dialogSetting （选填）:强行修改对话框的配置内容
   * {
   *    multiple:0 // 单选多选
   * }
   * param （选填）:查询参数
   * v-on:ok 点击确定事件
   */
  // 暂未开发 弹框通用组件
  import {
    ref,
    defineEmits,
    defineProps,
    reactive,
    defineExpose,
    useAttrs,
    useSlots,
  } from 'vue'
  import { ElMessage } from 'element-plus'
  import { getData, bizApi } from '~/agilebpm/api'
  import { Plus, Search, add } from '@element-plus/icons-vue'

  import abCustDialogTree from './ab-cust-dialog-tree.vue'
  import abCustDialogList from './ab-cust-dialog-list.vue'
  import CustomDialogEdit from '@/views/biz/custom/customDialogEdit.vue'
  import { abUtil,abTools } from '~/agilebpm'
  import { abT } from '@/i18n'

  // emit 事件，父类根据事件对自身进行更新
  const emit = defineEmits(['update:modelValue', 'ok'])
  const treeDialog = ref()
  const listDialog = ref()
  const attrs = useAttrs()
  const props = defineProps({
    dialogKey: {
      type: String,
      required: true,
    },
    // eslint-disable-next-line vue/require-default-prop
    modelValue: [Array, Object, String],
    dialogSetting: {
      type: Object,
      default: null,
    },
    param: {
      type: Object,
      default: null,
    },
    ispre: {
      type: Boolean,
      default: false,
    },
    extraData: {
      type: [Object, String],
      default: null,
    },
    valueMapping: {
      type: Object,
      default: null,
    },
    /**
     * 是否必填（‘确定’时不选择数据时提示）
     */
    required: {
      type: Boolean,
      default: true,
    },
    setAppendToBody: {
      type: Boolean,
      default: true,
    },
    /**
     * 处理子表数据时初始化的json
     */
    initJson: {
      type: Object,
      default: () => {
        return {}
      },
    },
    /**
     * 数组赋值模式 add：新增、edit：编辑
     */
    asmode: {
      type: String,
      default: 'edit',
    },
    custom:{
      type: Boolean,
      default: false,
    }
  })
  const visible = ref(false)
  const info: any = reactive({
    flag: false,
    dialog: {},
    initData: [],
    hasSlot: false,
    dialogHeight: '',
    addCustomDialog: false,
  })

  const { modelValue } = toRefs(props)

  // 监听父组件传值key
  watch(
    () => props.dialogKey,
    (val: any) => {
      if (val) {
        info.flag = false
      }
    }
  )

  // 请求对话框详情数据
  const getDialogData = () => {
    bizApi.customDialog.getDialogByCode(props.dialogKey).then(
      (result: any) => {
        visible.value = true
        // eslint-disable-next-line vue/no-mutating-props
        info.dialog = extend(props.dialogSetting || {}, result.data)
        info.flag = true
        setTimeout(() => {
          getDialogHeight()
        })
        // 遍历条件字段
        info.dialog.conditionFields.forEach(
          (field: {
            columnName: string
            dbType: string
            condition: string
            searchName: string
            valueSource: string
            value: { ctrlType: any }
          }) => {
            let searchName = `${field.columnName}$V`
            searchName += field.condition
            field.searchName = searchName
          }
        )
        handleInitData()
      },
      () => {}
    )
  }

  // 处理父组件传值+详情数据
  const extend = (parent: Record<string, any>, child: { [x: string]: any }) => {
    child = child || {}
    for (const prop in parent) {
      child[prop] = parent[prop]
    }
    return child
  }

  // 取消按钮
  const cancel = () => {
    visible.value = false
  }

  // 对话框OK事件
  const ok = () => {
    const data = getDataFn()
    if (props.required && data.length == 0) {
      ElMessage({
        type: 'error',
        message: abT('page.common.pleaseSelectData','请选择数据'),
      })
      return
    }
    emit('ok', data, props.extraData)

    if (!props.modelValue) {
      visible.value = false
      console.log('未设置 ng-model，请监听 ok事件获取返回值，并自动赋值')
      return
    }
    if (Array.isArray(props.modelValue)) {
      //赋值对象是数组
      let list = abUtil.Arrays.newAbSubList()
      if (props.asmode == 'add') {
        list = props.modelValue
      }
      data.forEach((item: any) => {
        if (
          props.valueMapping == null ||
          JSON.stringify(props.valueMapping) === '{}'
        ) {
          //无映射关系则把数据全返回
          list.push(item)
          return
        }

        const json = abUtil.clone(props.initJson)
        //处理映射关系
        for (const key in props.valueMapping) {
          const val = props.valueMapping[key]
          //如果val是a.b这样的，则需要对json.a初始化，不然直接操作json.a.b会报错
          const strs = val.split('.')
          let exp = 'json'
          for (let i = 0; i < strs.length - 1; i++) {
            exp = `${exp}.${strs[i]}`
            if (eval(`!${exp}`)) {
              //为空则初始化
              eval(`${exp} = {};`)
            }
          }
          eval(`json.${val} = item[key];`)
        }

        if (props.asmode == 'edit') {
          const j = props.modelValue.find((item) => jsonEq(item, json))
          if (j) {
            list.push(j)
          } else {
            list.push(json)
          }
        } else {
          list.push(json)
        }
      })
      emit('update:modelValue', list)
    } else {
      //赋值对象是对象
      for (const key in props.valueMapping) {
        const val = props.valueMapping[key]
        const list = []
        data.forEach((item: any) => {
          list.push(item[key])
        })
        props.modelValue[val] = list.join(',')
      }
    }
    visible.value = false
  }

  /**
   * 以b为准看a是否字段都相同
   * @param a
   * @param b
   */
  const jsonEq = (a: any, b: any) => {
    for (const k in b) {
      if (k != '_loadMap' && b[k] && a[k] != b[k]) {
        return false
      }
    }
    return true
  }

  //获取根据返回字段映射好的数据
  const getDataFn = () => {
    const list: any = []
    let data: any = []
    if (info.dialog.style == 'list') {
      data = listDialog.value.getDataFn()
    }
    if (info.dialog.style == 'tree') {
      data = treeDialog.value.getDataFn()
    }
    data.forEach((item: any) => {
      const d = {}
      info.dialog.returnFields.forEach((field: any) => {
        d[field.returnName] = item[field.columnName]
      })
      list.push(d)
    })
    return list
  }

  const handleInitData = () => {
    info.initData = []
    const list: any = []
    if (
      !props.modelValue ||
      (Array.isArray(props.modelValue) && props.asmode == 'add')
    ) {
      //空数据 || （数组&&新增模式时）
      return
    }
    // 回显操作主要部分
    if (Array.isArray(props.modelValue)) {
      if (
        props.valueMapping == null ||
        JSON.stringify(props.valueMapping) === '{}'
      ) {
        props.modelValue.forEach((item: any) => {
          const d = {}
          // 反向赋值
          info.dialog.returnFields.forEach((field: any) => {
            d[field.columnName] = item[field.returnName]
          })
          list.push(d)
        })
        info.initData = list
      }

      if (props.valueMapping && JSON.stringify(props.valueMapping) !== '{}') {
        if(info.dialog.displayFields && info.dialog.displayFields.length > 0){
          // 判断props.valueMapping中是否含有右侧回显字段 也就是info.dialog.displayFields[0] 如果没有 默认加上才能回显
          let param = info.dialog.returnFields.find((field:any) => {return field.columnName == info.dialog.displayFields[0].columnName}).returnName
          if(!props.valueMapping.hasOwnProperty(param)){
            props.valueMapping[param] = 'echoField'
          }
        }
        const arr = []
        props.modelValue.forEach((item: any) => {
          const a = {}
          for (const key in props.valueMapping) {
            const val = props.valueMapping[key]
            a[key] = item[val]
          }
          arr.push(a)
        })
        arr.forEach((item: any) => {
          const d = {}
          // 反向赋值
          info.dialog.returnFields.forEach((field: any) => {
            if(item[field.returnName]){
              d[field.columnName] = item[field.returnName]
            }
          })
          list.push(d)
        })
        info.initData = list
      }
    } else {
      let json
      for (const key in props.valueMapping) {
        const data = props.modelValue[props.valueMapping[key]]
        if (!data) {
          continue
        }
        if (!json) {
          json = {}
        }
        eval('json[key] = data')
      }
      if (!json) {
        return
      }
      //切割json中的,当作多选
      for (const key in json) {
        const val = json[key]
        const list = val.split(',')
        list.forEach((item: any, index: string | number) => {
          if (!info.initData[index]) {
            info.initData[index] = {}
          }
          info.dialog.returnFields.forEach(
            (field: { returnName: string; columnName: string | number }) => {
              if (field.returnName == key) {
                info.initData[index][field.columnName] = item
              }
            }
          )
        })
      }
    }
  }

  const getDialogHeight = () => {
    if (info.dialog.width < 100 || info.dialog.width == 100) {
      info.dialog.width = `${info.dialog.width}%`
    }
    if (info.dialog.height < 100 || info.dialog.height == 100) {
      const heightPx = abTools.getClientHeight()
      const height = heightPx * (Number(info.dialog.height) / 100) - 140
      info.dialogHeight = `${height}px`
    }
    if (info.dialog.height && info.dialog.height > 100) {
      info.dialogHeight = `${Number(info.dialog.height) - 138}px`
    }
  }

  // 打开对话框
  const openDialog = () => {
    getDialogData()
  }

  const addCustom = () => {
    info.addCustomDialog = true
  }
  const closeFn = () => {
    listDialog.value.postPageData()
    info.addCustomDialog = false
  }
  onMounted(() => {
    const slots: any = useSlots()
    if (slots.default) {
      info.hasSlot = slots.default().length > 0
    }
  })
  defineExpose({
    openDialog,
  })
</script>
<style lang="scss">
  .dialogStyleBox {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    .el-dialog__body {
      flex: 1;
      padding: 10px 10px 0 10px;
      background: #f6f8f9;
      border-top: 1px solid #e4e1e1;
      border-bottom: 1px solid #e4e1e1;
      .box {
        // padding: 12px;
        background: #fff;
      }
    }
  }
  .addCustomDrawerStyle {
    .el-drawer__body > section {
      height: 100%;
    }
  }
</style>
