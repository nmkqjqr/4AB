<template>
  <!--分页-->
  <el-pagination
    style="margin-bottom:20px;"
    v-if="props.subTable && props.subTable.length > 0"
    :background="true"
    :current-page="currentPage"
    :disabled="false"
    layout="prev,pager,next,total,sizes"
    :page-size="pageSize"
    :page-sizes="[2, 5, 10, 20, 30, 40, 50]"
    :total="
      props.subTable && props.subTable.length > 0 ? props.subTable.length : 0
    "
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>
<script setup lang="ts">
  import { Plus } from '@element-plus/icons-vue'
  import field from '~/agilebpm/package/avue-form-design/components/field'
  import rules from '~/agilebpm/package/bpmn-js/lib/features/rules'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const props = defineProps({
    // 子表原数据
    subTable: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: 10,
    },
    page: {
      type: Object,
      default: () => {
        return {}
      },
    },
    tableCode: {
      type: String,
      default: '',
    },
  })

  const currentPage = ref(1)
  // emit 事件定义
  const emit = defineEmits(['update:modelValue', 'update:page'])
  // eslint-disable-next-line vue/no-setup-props-destructure
  let pageSize = props.pageSize

  const abFormRef = inject('abFormRef') as any
  const abFormMananger = inject('abForm') as any
  const validateInfo: any = reactive({
    initFieldMap: false,
    fieldMap: {},
  })

  onMounted(() => {
    emit(
      'update:modelValue',
      getNeedArr(props.subTable, pageSize || 10)[currentPage.value - 1]
    ) //当前页的表格数据
    emit('update:page', {
      currentPage: 1,
      pageSize: pageSize,
    })
  })

  // 切换当前页
  const handleCurrentChange = async (val: any) => {
    currentPage.value = val
    props.page.currentPage = currentPage.value
    emit('update:page', props.page)
    emit(
      'update:modelValue',
      getNeedArr(props.subTable, pageSize || 10)[currentPage.value - 1]
    ) //当前页的表格数据
  }

  // 切换每页条数
  const handleSizeChange = (val: any) => {
    currentPage.value = 1
    pageSize = val
    props.page.pageSize = pageSize
    props.page.currentPage = 1
    emit(
      'update:modelValue',
      getNeedArr(props.subTable, pageSize)[currentPage.value - 1]
    ) //当前页的表格数据
    emit('update:page', props.page)
  }

  // 前端处理分页
  const getNeedArr = (array: any, size: any) => {
    //获取所需指定长度分割的数组;参数1为用于分割的总数组,参数2为分割数组后每个小数组的长度
    const length = array ? array.length : false
    //判断不是数组，或者size没有设置，size小于1，就返回空数组
    if (!length || !size || size < 1) {
      return []
    }
    let index = 0 //用来表示切割元素的范围start
    let resIndex = 0 //用来递增表示输出数组的下标

    //根据length和size算出输出数组的长度，并且创建它。
    const result = new Array(Math.ceil(length / size))
    //进行循环
    while (index < length) {
      //循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
      result[resIndex++] = array.slice(index, (index += size))
    }
    //输出到新数组
    return result
  }

  // 处理页数
  const calculatePageCount = (totalItems: any, itemsPerPage: any) => {
    // 计算整除运算的结果
    let pageCount = totalItems / itemsPerPage
    // 如果有余数，则需要额外一页容纳剩余的物品
    if (totalItems % itemsPerPage > 0) {
      pageCount++
    }
    return Math.floor(pageCount)
  }

  watch(
    () => props.subTable?.length,
    (newValue: any, oldValue: any) => {
      if (newValue > oldValue && oldValue.length > 0) {
        const pag = calculatePageCount(newValue, pageSize || 10)
        currentPage.value = pag
        props.page.currentPage = currentPage.value
      }
      emit(
        'update:modelValue',
        getNeedArr(props.subTable, pageSize || 10)[currentPage.value - 1]
      ) //当前页的表格数据
      emit('update:page', props.page)
    }
  )

  const unWatchFieldTemp = watch(
    () => abFormMananger.getFields()?.length,
    (newValue: any, oldValue: any) => {
      if (!abFormMananger.getFields() || !props.tableCode) return

      const list: any = []
      for (const item of abFormMananger.getFields()) {
        if (props.tableCode != item.tableCode) continue

        list.push({
          columnCode: item.columnCode,
          name: item.name.substring(0, item.name.lastIndexOf('【')),
          rules: item.rules,
          tableCode: item.tableCode,
        })
        validateInfo.initFieldMap = true
      }

      if (validateInfo.initFieldMap) {
        abFormMananger.addElmField({
          tableCode: props.tableCode,
          subTable: props.subTable,
          fields: list,
        })
        unWatchFieldTemp()
      }
    }
  )
</script>
