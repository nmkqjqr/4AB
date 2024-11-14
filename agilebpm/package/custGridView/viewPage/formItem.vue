<template>
  <el-form-item
    v-if="props.item.showType === '1' || props.item.showType === '3'"
    :label="props.item.fieldDesc"
    :prop="props.item.fieldName"
    :style="{
      width:
        props.item.extendConf.width && props.item.extendConf.width == '100%'
          ? '100%'
          : '',
    }"
  >
    <el-input
      v-if="
        (props.item.controlType === 'decimal' &&
          props.item.cntype == '>=,<=' &&
          props.item.dataType !== 'decimal') ||
        (props.item.controlType === 'decimal' &&
          props.item.cntype !== '>=,<=' &&
          props.item.dataType == 'decimal') ||
        (props.item.controlType === 'decimal' &&
          props.item.cntype !== '>=,<=' &&
          props.item.dataType !== 'decimal')
      "
      v-model.trim="props.item['val']"
      :disabled="props.item.showType === '3'"
      :placeholder="
        props.item.extendConf.queryPlaceHolder.length > 0
          ? props.item.extendConf.queryPlaceHolder
          : $abT('page.common.placeholder','请输入') + props.item.fieldDesc
      "
      style="width: 200px"
      @keyup.enter.native="handleQuery"
    />
    <!-- 数字范围 -->
    <template
      v-if="
        props.item.controlType === 'decimal' &&
        props.item.dataType === 'decimal' &&
        props.item.cntype == '>=,<='
      "
    >
      <el-input-number
        v-model.trim="props.item['numbewValStart']"
        class="numberInput"
        controls-position="right"
        :disabled="props.item.showType === '3'"
        :min="0"
      />
      <span style="margin: 0 10px">-</span>
      <el-input-number
        v-model.trim="props.item['numbewValEnd']"
        class="numberInput"
        controls-position="right"
        :disabled="props.item.showType === '3'"
        :min="0"
      />
    </template>
    <el-date-picker
      v-if="
        props.item.controlType === 'date_picker' &&
        props.item.cntype !== '>=,<='
      "
      v-model="props.item['val']"
      :disabled="props.item.showType === '3'"
      :placeholder="
        props.item.extendConf.queryPlaceHolder.length > 0
          ? props.item.extendConf.queryPlaceHolder
          : $abT('page.common.placeholder','请输入') + props.item.fieldDesc
      "
      style="width: 200px"
      :type="
        props.item.formatConf == 'YYYY-MM-DD'
          ? 'date'
          : props.item.formatConf == 'YYYY-MM-DD HH:mm:ss'
          ? 'datetime'
          : props.item.formatConf == 'yyyy-MM'
          ? 'month'
          : props.item.formatConf == 'yyyy'
          ? 'year'
          : 'date'
      "
      :value-format="
        props.item.formatConf &&
        props.item.formatConf.length > 0 &&
        props.item.formatConf == 'yyyy'
          ? 'YYYY'
          : props.item.formatConf == 'yyyy-MM'
          ? 'YYYY-MM'
          : props.item.formatConf
      "
    />
    <!-- date_picker 日期范围选择器 -->
    <el-date-picker
      v-if="
        props.item.controlType === 'date_picker' && props.item.cntype == '>=,<='
      "
      v-model="props.item['val']"
      :disabled="props.item.showType === '3'"
      :end-placeholder="$abT('page.common.endTime','结束时间')"
      :start-placeholder="$abT('page.common.startTime','开始时间')"
      style="width: 200px"
      :type="
        props.item.formatConf == 'YYYY-MM-DD'
          ? 'daterange'
          : props.item.formatConf == 'YYYY-MM-DD HH:mm:ss'
          ? 'datetimerange'
          : 'daterange'
      "
      :value-format="
        props.item.formatConf && props.item.formatConf.length > 0
          ? props.item.formatConf
          : 'YYYY-MM-DD'
      "
    />
    <template v-if="props.item.controlType === 'dic'">
      <ab-select-tree
        v-if="!props.item.extendConf.tagShow"
        v-model="props.item['val']"
        :disabled="props.item.showType === '3'"
        :operation="false"
        :placeholder="
          props.item.extendConf.queryPlaceHolder.length > 0
            ? props.item.extendConf.queryPlaceHolder
            : $abT('page.common.placeholder','请输入') + props.item.fieldDesc
        "
        style="width: 200px"
        :type-code="
          props.item.formatConf && props.item.formatConf.code
            ? props.item.formatConf.code
            : ''
        "
        @keyup.enter.native="handleQuery"
      />
      <template v-if="props.item.extendConf.tagShow">
        <span v-for="(radioTag, radioIndex) in props.item.formatConf.dicList"
          :key="radioIndex">
          <el-check-tag
            :checked="radioTag.checked"
            class="tagStyle"
            v-if="!radioTag.disable"
            @change="
              clickItemTag(
                $event,
                radioTag,
                props.item,
                props.item.formatConf.dicList,
                radioTag.code
              )
            "
          >
            {{ radioTag.name }}
          </el-check-tag>
        </span>
      </template>
    </template>
    <template v-if="props.item.controlType === 'json'">
      <el-select
        v-if="!props.item.extendConf.tagShow"
        v-model="props.item['val']"
        clearable
        :disabled="props.item.showType === '3'"
        :placeholder="
          props.item.extendConf.queryPlaceHolder.length > 0
            ? props.item.extendConf.queryPlaceHolder
            : $abT('page.common.placeholder','请输入') + props.item.fieldDesc
        "
        style="width: 200px"
        @keyup.enter.native="handleQuery"
      >
        <template
          v-if="
            props.item.formatConfJsonList &&
            props.item.formatConfJsonList.length > 0
          "
        >
          <el-option
            v-for="(itemjson, index) in props.item.formatConfJsonList"
            :key="index"
            :label="itemjson.key"
            :value="itemjson.valuekey"
          />
        </template>
      </el-select>
      <template v-if="props.item.extendConf.tagShow">
        <el-check-tag
          v-for="(radioTag, radioIndex) in props.item.formatConfJsonList"
          :key="radioIndex"
          :checked="radioTag.checked"
          class="tagStyle"
          @change="
            clickItemTag(
              $event,
              radioTag,
              props.item,
              props.item.formatConfJsonList,
              radioTag.valuekey
            )
          "
        >
          {{ radioTag.key }}
        </el-check-tag>
      </template>
    </template>
    <template v-if="props.item.controlType === 'dialog'">
      <el-input
        v-model="props.item.dialogConf.showValueQuery"
        class="input-with-select"
        :placeholder="
          props.item.extendConf.queryPlaceHolder.length > 0
            ? props.item.extendConf.queryPlaceHolder
            : $abT('page.common.placeholder','请输入') + props.item.fieldDesc
        "
        readonly
        style="width: 200px"
        @keyup.enter.native="handleQuery"
      >
        <template #append>
          <ab-cust-dialog
            :dialog-key="dialogKeyFn(props.item)"
            @ok="chooseCustDialog($event, props.item)"
          >
            <el-icon style="vertical-align: middle">
              <Search />
            </el-icon>
          </ab-cust-dialog>
        </template>
      </el-input>
    </template>
    <template v-if="props.item.controlType === 'dynamicSelect'">
      <el-select
        v-bind="$attrs"
        v-model="props.item['val']"
        v-load-more:[info.dialogKey]="loadModelFn"
        class="ab-input"
        clearable
        filterable
        :disabled="item.showType === '3'"
        :popper-class="info.dialogKey"
        :placeholder="
          item.extendConf.queryPlaceHolder.length > 0
            ? item.extendConf.queryPlaceHolder
            : $abT('page.common.choose','请选择') + item.fieldDesc
        "
        style="width: 200px"
      >
        <el-option
          v-for="op in info.options"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
    </template>
  </el-form-item>
</template>
<script lang="ts">
  import loadMore from '~/agilebpm/package/ab-form/components/ab-dynamic-select/load-more-directive'
  export default {
    directives: {
      loadMore,
    },
  }
</script>
<script lang="ts" setup>
  import { bizApi } from '@agilebpm/api'
  const emit = defineEmits(['handleQuery','toItem'])
  const props = defineProps({
    item: { required: true, type: Object },
    queryList:{ type: Array, default:[] },
    queryParam:{type: Object,default:{} }
  })


  const info: any = reactive({
    options: [],
    viewValue: '',
    descValue: '',
    timer: null,
    dialogKey:props.item.controlType === 'dynamicSelect' ? props.item.dialogConf.custDialogList[0].code : ''
  })

  const query = reactive({
    pageSize: 10,
    currentPage: 1,
    queryParam: {},
    noMore: false,
    page: true,
  })


  watch(
    () => props.item,
    (val: any,oldVal:any) => {
      emit('toItem',val)
    },
    { deep: true }
  )
  

  watch(
    () => props.queryParam,
    (val: any) => {
      query.queryParam = val
      query.currentPage = 1
      initOptions()
    },
    { deep: true }
  )

  const closeCustDialog = (queryItem: string, item: any) => {
    item.dialogConf.queryCustDialog.splice(
      item.dialogConf.queryCustDialog.indexOf(queryItem),
      1
    )
    item['val'] = ''
    item.dialogConf.showValueQuery = ''
  }

  const chooseCustDialog = (list: any, item: any) => {
    item.dialogConf.queryCustDialog = list
    // 单选对话框情况下处理数据
    if(list.length == 1){
      item['val'] = list[0][item.dialogConf.value]
      item.dialogConf.showValueQuery = list[0][item.dialogConf.showValue]
    }else{
       // 多选对话框情况下处理数据
      let str = ''
      let strshowValue = ''
      list.forEach((it: any) => {
        str += it[item.dialogConf.value] + ','
        strshowValue += it[item.dialogConf.showValue] + ','
      })
      str = str.substring(0, str.length - 1)
      strshowValue = strshowValue.substring(0, strshowValue.length - 1)
      item['val'] = str
      item.dialogConf.showValueQuery = strshowValue
    }
    emit('handleQuery')
  }

  const handleQuery = () => {
    emit('handleQuery')
  }
  const dialogKeyFn = (item: any) => {
    let a = ''
    if (typeof item.formatConf == 'string') {
      try {
        const obj = JSON.parse(item.formatConf)
        if (typeof obj == 'object' && obj) {
          a = obj.dialogKey
        } else {
          a = obj
        }
      } catch (e) {
        a = item.formatConf
      }
    }
    if (item.formatConf.length <= 0) {
      if (
        item.dialogConf &&
        item.dialogConf.custDialogList &&
        item.dialogConf.custDialogList.length > 0
      ) {
        a = item.dialogConf.custDialogList[0].code
      }
    }
    return a
  }
  // 点选按钮再次点击取消选中
  const clickItemTag = (
    e: any,
    tag: any,
    item: any,
    list: any,
    params: any
  ) => {
    list.forEach((element: any, index: any) => {
      element.checked = false
    })
    item['val'] = ''
    if (e) {
      tag.checked = true
      item['val'] = params
    }
    handleQuery()
  }

  const buildOptions = (dataList: Array<any>) => {
    dataList.forEach((item: any) => {
      info.options.push({
        value: item[props.item.dialogConf.value],
        label: item[props.item.dialogConf.showValue],
      })
    })
  }

  const loadModelFn = async () => {
    if (query.noMore) {
      return
    }
    query.currentPage++
    await bizApi.customDialog
      .getDialogDataList(info.dialogKey, query)
      .then((result: any) => {
        if (!result.data || result.data.length === 0) {
          query.noMore = true
        } else {
          buildOptions(result.data)
        }
      })
  }

  const initOptions = async () => {
    const result = await bizApi.customDialog.getDialogDataList(
      info.dialogKey,
      query
    )
    if (result.isOk && result.data) {
      info.options.splice(0, info.options.length)
      buildOptions(result.data)
    } else {
      ElMessage.error(`获取【${info.dialogKey}】对话框失败，请联系管理员！`)
    }
  }

  const setParam = () => {
    let queryParam = {}
    props.item.dialogConf.custDialogConditionFields.forEach(
      (field: {
        columnName: string
        dbType: string
        condition: string
        searchName: string
        defaultValue: string
        paramsField:string
      }) => {
        let searchName = `${field.columnName}$`
        if (field.dbType === 'number') {
          searchName += 'N'
        } else if (field.dbType === 'date') {
          searchName += 'D'
        } else {
          searchName += 'V'
        }
        searchName += field.condition
        if(field.defaultValue && field.defaultValue.length > 0){
          queryParam[searchName] = field.defaultValue
        }
      }
    )
    return queryParam
  }


  // 加入表单校验
  onMounted(() => {
    if(props.item.controlType === 'dynamicSelect'){
      //获取对话信息，获取分页配置
      bizApi.customDialog.getDialogByCode(info.dialogKey).then((result: any) => {
        if (!result.isOk || !result.data) {
          return
        }
        //如果不分页则就加载一次就好
        if (!result.data.page || result.data.page === 0) {
          query.noMore = true
        }
      })

      query.queryParam = setParam()
      initOptions()
    }
  })

</script>
<style lang="scss">
  .custFormRadioTag {
    .el-radio.is-bordered.el-radio--small {
      margin-right: 2px !important;
      .el-radio__input {
        display: none;
      }
    }
  }
  .tagStyle {
    margin-right: 14px;
  }
  .numberInput {
    width: 88px !important;
    .el-input__wrapper {
      padding-right: 32px !important;
      padding-left: 0 !important;
    }
  }
</style>
