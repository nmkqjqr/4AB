<template>
  <el-form
    style="margin-top: 15px"
    :model="data"
    label-suffix="："
    labelPosition="left"
    labelWidth="80px"
    @submit.prevent
  >
    <el-form-item
      :rules="[{ required: true, message: '必填' }]"
      label="url地址"
      prop="url"
    >
      <el-input @blur="changeParams" v-model="urlRef" />
    </el-form-item>
    <el-form-item label="高度">
      <el-slider
        style="width: 90%"
        v-model="data.height"
        :min="50"
        :step="10"
        :max="2000"
      />
    </el-form-item>
    <el-form-item label="控件栅格">
      <el-slider
        v-model="data.span"
        :max="24"
        :min="4"
        show-stops
        :step="1"
        style="width: 90%"
      />
      <el-radio-group v-model.number="data.span">
        <el-radio-button label="24">一列</el-radio-button>
        <el-radio-button label="12">两列</el-radio-button>
        <el-radio-button label="8">三列</el-radio-button>
        <el-radio-button label="6">四列</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <template #label>
        <div>
          url参数:
          <el-tooltip
            class="box-item"
            content="将填写的参数动态添加到url后。例：属性id值123和属性status值1，将会在后拼?id=123&status=1。 属性和值均可以手动填写，也可以设置为表单字段（属性为表单字段code，值为表单字段的动态值）"
            effect="dark"
            placement="top-start"
          >
            <el-icon>
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-button
        :icon="Plus"
        round
        size="small"
        type="primary"
        @click="addParam"
      >
        添加
      </el-button>
    </el-form-item>
    <span
      class="myStyle"
      v-if="
        data.param && data.param.length > 0 && data.url && data.url.length > 0
      "
    >
      <el-table
        :cell-style="cellStyle"
        :data="data.param"
        :header-cell-style="{ height: '10px' }"
        :row-key="rowKeyFunc"
        :row-style="cellStyle"
        style="padding: 0; margin-bottom: 40px"
      >
        <el-table-column align="center" label="属性">
          <template #default="{ row, $index }">
            <el-select
              clearable
              allow-create
              filterable
              v-model="row.key"
              @change="updateData(row.key, $index)"
              placeholder="请选择"
            >
              <el-option
                v-for="item in allSelect"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="参数值">
          <template #default="{ row }">
            <el-select
              @change="updateDataValue(row)"
              clearable
              filterable
              allow-create
              v-model="row.value"
              placeholder="请选择"
            >
              <el-option
                v-for="item in allSelect"
                :key="item.param"
                :label="item.name"
                :value="item.param"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column width="35">
          <template #default="{ $index }">
            <el-button link type="danger">
              <el-icon :size="22" @click="() => data.param.splice($index, 1)">
                <Delete />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item
        label="预览地址"
        v-if="data.tempUrl && data.tempUrl.length > 0"
        style="color: #969696"
      >
        {{ data.tempUrl }}
      </el-form-item>
    </span>
  </el-form>
</template>

<script lang="ts">
  export default {
    name: 'ab-iframe-config',
  }
</script>

<script lang="ts" setup>
  import { Plus } from '@element-plus/icons-vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { getDesign } from '~/agilebpm/package/avue-form-design/ab/config/dateUtil'
  //继承的属性data
  const props = defineProps({
    data: { type: Object, required: true },
    form: { type: Object, required: true },
  })
  //将data内的属性转为响应式数据
  const { data } = toRefs(props)
  //最终地址预览
  const urlRef = ref(data.value.url)

  //是否是简式流程
  const isEasy =
    abTools.useCurrentInstance().proxy.$route.query.mode === 'diyBo'

  //简式流程获取bo的方法
  const jsonToBo = inject('jsonToBo') as any

  let bo: any
  if (isEasy) {
    bo = jsonToBo(props.form.isMb)
  } else {
    bo = window.getBo()
  }

  let rel = getDesign(bo, isEasy, data.value)
  let currentTable = rel.currentTable

  let allSelect = rel.allArr.filter(
    (s) =>
      s.code != data.value.code &&
      (s.table == currentTable.tableCode || s.table == bo.rel.tableCode)
  )

  const rowKeyFunc = (row: any) => row.key

  const cellStyle = () => {
    return {
      height: '40px',
      padding: '0',
    }
  }
  const updateData = (code: any, index: number) => {
    var obj = allSelect.find((s) => code == s.code)
    if (obj) {
      data.value.param[index].value = obj.param
    }
  }

  const updateDataValue = (row: any) => {
    let obj = allSelect.find((s) => s.param == row.value)
    //是否时是静态字段,找的到表单字段时obj为对象，因此不是静态字段isParam为0，找到表单字段则isParam为1。
    row.isParam = obj ? '0' : '1'
  }

  const addParam = () => {
    if (!urlRef.value || urlRef.value.length == 0) {
      ElMessage.error('请先填写url地址')
    } else {
      if (!data.value.param || data.value.param.length == 0) {
        data.value.param = [
          {
            key: '',
            value: '',
          },
        ]
      } else {
        data.value.param.push({
          key: '',
          value: '',
        })
      }
    }
  }

  const changeParams = () => {
    data.value.url = urlRef.value
    if (
      data.value.param &&
      data.value.url &&
      data.value.url.length > 0 &&
      data.value.param.length > 0
    ) {
      let paramStr = ''
      data.value.param.forEach((s: any) => {
        let findOne = allSelect.find((item) => item.param == s.value)
        if (s.key && s.key.length > 0) {
          paramStr += `${s.key}=${
            findOne ? '{' + findOne.name + '的值}' : s.value
          }&`
        }
      })
      let sign = ''
      if (paramStr && paramStr.length > 0) {
        paramStr = paramStr.substring(0, paramStr.length - 1)
        sign = data.value.url.includes('?') ? '&' : '?'
      }
      data.value.tempUrl = data.value.url + sign + paramStr
    } else {
      data.value.tempUrl = data.value.url
    }
  }

  watch(() => data.value.param, changeParams, {
    immediate: true,
    deep: true,
  })
</script>

<style scoped lang="scss">
  :deep(.myStyle .el-table .cell) {
    padding: 0 !important;
  }
</style>
