<template>
  <el-dialog
    v-model="dialogVisible"
    title="函数计算"
    width="860px"
    close
    destroy-on-close
  >
    <el-form label-suffix="：" ref="formRef" :model="plugin" label-width="90px">
      <el-form-item label="小数位数" prop="decimals">
        <el-input-number
          v-model="plugin.decimals"
          :min="0"
          :max="5"
          style="width: 120px"
        />
      </el-form-item>
      <el-form-item label="计算条件">
        <div>
          <el-dropdown
            v-for="(tableRel, tablePath) in pageData.canUserTablesMap"
          >
            <div class="el-dropdown-link">
              <el-button link type="primary">
                {{ tableRel.tableComment }}【字段】
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
            </div>
            <template #dropdown>
              <div style="max-height: 400px; overflow-y: auto">
                <el-dropdown-menu>
                  <template
                    v-for="column in tableRel.table.columnsWithoutPrimary"
                    :key="column.code"
                  >
                    <el-dropdown-item @click="addCondition(column, tablePath)">
                      {{ column.comment }}
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </div>
            </template>
          </el-dropdown>
          <calFunctionScript
            placeholder="默认进行计算，可设置满足什么条件下进行计算。脚本为if()括号内的代码"
            v-model="plugin.scriptCondition"
            ref="conditionRef"
          ></calFunctionScript>
        </div>
      </el-form-item>
      <el-form-item label="运算符">
        <el-space wrap>
          <el-button title="加" @click="addScriptData('+')">+</el-button>
          <el-button title="减" @click="addScriptData('-')">-</el-button>
          <el-button title="乘" @click="addScriptData('*')">*</el-button>
          <el-button title="除" @click="addScriptData('/')">/</el-button>
          <el-button title="括号" @click="addScriptData('(')">(</el-button>
          <el-button title="括号" @click="addScriptData(')')">)</el-button>
          <el-switch
            v-model="plugin.easyScript"
            inline-prompt
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
            active-text="描述式脚本"
            inactive-text="原生脚本"
          />
        </el-space>
      </el-form-item>
      <el-form-item
        label="计算脚本"
        prop="script"
        :rules="{ required: true, message: '必填' }"
      >
        <div>
          <el-dropdown
            v-for="(tableRel, tablePath) in pageData.canUserTablesMap"
          >
            <div class="el-dropdown-link">
              <el-button link type="primary">
                {{ tableRel.tableComment }}【字段】
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
            </div>
            <template #dropdown>
              <div style="max-height: 400px; overflow-y: auto">
                <el-dropdown-menu>
                  <template
                    v-for="column in tableRel.table.columnsWithoutPrimary"
                    :key="column.code"
                  >
                    <el-dropdown-item
                      v-if="column.type == 'number'"
                      @click="addColumn(column, tablePath)"
                    >
                      {{ column.comment }}
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </div>
            </template>
          </el-dropdown>
          <calFunctionScript
            v-model="plugin.script"
            ref="calFunctionScriptRef"
          ></calFunctionScript>
        </div>
      </el-form-item>
      <el-form-item label="高级函数">
        <el-space wrap>
          <el-select
            v-model="currentFunc.functionName"
            @change="setCurrentFunctions()"
            placeholder="选择函数"
            style="width: 150px"
          >
            <el-option
              v-for="item in functions"
              :key="item.name"
              :value="item.name"
            />
          </el-select>

          <div v-for="(item, index) in currentFunc.function?.params">
            <!-- 如果是日期计算的函数 -->
            <el-select
              v-if="item.type == 'calculationDate'"
              v-model="currentFunc.param[index]"
              style="width: 120px"
              placeholder="计算类型"
            >
              <el-option label="秒" value="'s'"/>
              <el-option label="分" value="'m'"/>
              <el-option label="时" value="'h'"/>
              <el-option label="日" value="'d'"/>
              <el-option label="周" value="'w'"/>
              <el-option label="月" value="'M'"/>
              <el-option label="年" value="'y'"/>
            </el-select>
            <!-- 如果是输入形式的函数 -->
            <span v-else>
              <el-input
                v-model="currentFunc.param[index]"
                v-if="item.type == 'input'"
                style="width: 120px"
                :placeholder="item.desc"
              ></el-input>
              <!--如果是选择字段形式-->
            <el-space v-else>
              <!-- 选择字段-->
              <el-cascader
                v-model="currentFunc.param[index]"
                :placeholder="item.desc"
                style="width: 160px"
                :options="calFunctionsOptions(item)"
              />
            </el-space>
            </span>

          </div>
          <el-button text :icon="Plus" type="primary" @click="pushFunction()">
            生成
          </el-button>
        </el-space>
      </el-form-item>
      <el-form-item
        label="赋值字段"
        prop="target"
        :rules="{ required: true, message: '必填' }"
      >
        <el-cascader
          v-model="plugin.target"
          :options="pageData.targetOptions"
        />
      </el-form-item>
      <el-form-item
        label="插件描述"
        prop="desc"
        :rules="{ required: true, message: '必填' }"
      >
        <el-input
          v-model="plugin.desc"
          placeholder="请输入插件描述信息"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button text @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="ok()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { ElMessage } from 'element-plus'
  import { ArrowDown, Plus } from '@element-plus/icons-vue'
  import calFunctionScript from './calFunctionScript.vue'
  //  ↓↓↓↓↓↓↓↓ 上面为插件通用逻辑,可复制 ↑↑↑↑↑↑↑↑
  const props = defineProps({
    plugin: {
      type: Object,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
    tableName: {
      type: String,
    },
  })
  const emits = defineEmits(['update:modelValue', 'dialogOk'])

  /**
   * 函数定义
   * params.isStatistica： 是否是统计，统计则只能选子表字段
   * params.type：参数类型  字段类型，限制可选字段类型
   *
   */
  const functions = [
    {
      name: '子表字段统计合计值',
      nameFormat: '合计({0})',
      valueFormat: 'abSubSum({0})',
      params: [
        {
          type: 'number',
          typeDesc: '数字',
          isStatistica: true,
          desc: '请选择统计字段',
        },
      ],
    },
    {
      name: '子表字段统计平均值',
      nameFormat: '平均值({0})',
      valueFormat: 'abSubAvg({0})',
      params: [
        {
          type: 'number',
          typeDesc: '数字',
          isStatistica: true,
          desc: '请选择统计字段',
        },
      ],
    },
    {
      name: '获取身份证的生日',
      nameFormat: '获取身份证生日({0})',
      valueFormat: 'calIdCardDate({0})',
      params: [
        {
          type: 'varchar',
          typeDesc: '字符串',
          isStatistica: false,
          desc: '请选择身份证字段',
        },
      ],
    },
    {
      name: '获取身份证的年龄',
      nameFormat: '获取身份证年龄({0})',
      valueFormat: 'calIdCardYear({0})',
      params: [
        {
          type: 'varchar',
          typeDesc: '字符串',
          isStatistica: false,
          desc: '请选择身份证字段',
        },
      ],
    },
    {
      name: '获取身份证的性别',
      nameFormat: '获取身份证性别({0})',
      valueFormat: 'calIdCardSex({0})',
      params: [
        {
          type: 'varchar',
          typeDesc: '字符串',
          isStatistica: false,
          desc: '请选择身份证字段',
        },
      ],
    },
    {
      name: '获取日期的星期几',
      nameFormat: '获取日期星期({0})',
      valueFormat: 'calDateWeek({0})',
      params: [
        {
          type: 'date',
          typeDesc: '日期',
          isStatistica: false,
          desc: '请选择日期字段',
        },
      ],
    },
    {
      name: '获取出生日期的年龄',
      nameFormat: '获取出生日期的年龄({0})',
      valueFormat: 'calIdDateYear({0})',
      params: [
        {
          type: 'date',
          typeDesc: '日期',
          isStatistica: false,
          desc: '请选择日期字段',
        },
      ],
    },
    {
      name: '日期动态增加天数',
      nameFormat: '日期追加天数({0}，{1})',
      valueFormat: 'calDateAfterDay({0},{1})',
      params: [
        {
          type: 'date',
          typeDesc: '日期',
          isStatistica: false,
          desc: '请选择日期字段',
        },
        {
          type: 'number',
          typeDesc: '数字',
          isStatistica: false,
          desc: '请选择天数字段',
        },
      ],
    },
    {
      name: '日期动态增加月份',
      nameFormat: '日期追加月份({0}，{1})',
      valueFormat: 'calDateAfterMonth({0},{1})',
      params: [
        {
          type: 'date',
          typeDesc: '日期',
          isStatistica: false,
          desc: '请选择日期字段',
        },
        {
          type: 'number',
          typeDesc: '数字',
          isStatistica: false,
          desc: '请选择月数字段',
        },
      ],
    },
    {
      name: '计算时间差',
      nameFormat: '计算时间差({1},{2})',
      valueFormat: 'calculationDate({0},{1},{2})',
      params: [{
        type: 'calculationDate',
        typeDesc: '类型',
        isStatistica: false,
        desc: '请选择数字字段'
      },
        {
          type: 'date',
          typeDesc: '开始日期',
          isStatistica: false,
          desc: '请选择开始字段',
        },
        {
          type: 'date',
          typeDesc: '结束日期',
          isStatistica: false,
          desc: '请选择结束字段',
        }]
    }
  ]
  const currentFunc = ref({ param: {} })
  // 脚本组件引用
  const calFunctionScriptRef = ref()
  const pushFunction = () => {
    let valid = true
    if (!currentFunc.value.function) {
      ElMessage({message: `请选择函数`, type: 'warning'})
      return
    }
    const paramNames = [],
      paramValues = []
    if (currentFunc.value.functionName == "计算时间差") {
      currentFunc.value.function?.params.forEach((param, index) => {
        //这里因为是日期计算，必然长度是3
        if (valid &&
          !currentFunc.value.param[index] 
          
        ) {
          ElMessage({
            message: `请设置高级函数第${index + 1}个入参`,
            type: 'warning',
          })
          valid = false
          return
        }

        paramNames.push(index==0?currentFunc.value.param[index]:currentFunc.value.param[index][1].name)
        paramValues.push(index==0?currentFunc.value.param[index]:currentFunc.value.param[index][1].value)
      })
    } else {
      currentFunc.value.function?.params.forEach((param, index) => {
        // 这里因为是级联选择，必然长度是2
        if (
          valid &&(
          !currentFunc.value.param[index] ||
          currentFunc.value.param[index].length != 2)
        ) {
          ElMessage({
            message: `请设置高级函数第${index + 1}个入参`,
            type: 'warning',
          })
          valid = false
          return
        }
        paramNames.push(currentFunc.value.param[index][1].name)
        paramValues.push(currentFunc.value.param[index][1].value)
      })
    }


    if (!valid) return

    const value =
      currentFunc.value.function.valueFormat.abArgFormat(paramValues)
    const name = currentFunc.value.function.nameFormat.abArgFormat(paramNames)
    currentFunc.value.param = {}
    // 光标设置
    if (plugin.value.easyScript) {
      calFunctionScriptRef.value.setScript(`{{${value}:${name}}}`)
    } else {
      calFunctionScriptRef.value.setScript(value)
    }
    ElMessage({ message: `函数添加成功`, type: 'success' })
  }
  const setCurrentFunctions = () => {

    const currentfunction = functions.filter((item) => {
      return item.name == currentFunc.value.functionName
    })[0]
    // 初始化下参数
    currentFunc.value.param = {}
    currentfunction.params.forEach((item, index) => {
      currentFunc.value.param[index] = ''
    })
    // 赋值
    currentFunc.value.function = currentfunction
  }

  // 是否展示与外部传入的是否展示双向绑定
  const dialogVisible = useVModel(props, 'modelValue', emits)

  const { plugin } = toRefs(props)
  const formRef = ref()
  const conditionRef = ref()
  // 当前表
  const pageData = reactive({
    currnetTableRel: {},
    parentRelTable: {},
    targetOptions: [],
    canUserTablesMap: {},
    bo: {},
  })

  const ok = () => {
    formRef.value.validate((valid) => {
      if (!valid) {
        ElMessage({ showClose: true, message: '请检查表单', type: 'warning' })
        return
      }
      emits('dialogOk', plugin)
    })
  }

  //  ↑↑↑↑↑↑↑↑ 上面为插件通用逻辑,可复制 ↑↑↑↑↑↑↑↑

  const addScriptData = (key) => {
    if (!key) return
    calFunctionScriptRef.value.setScript(key)
  }

  const addColumn = (column, key) => {
    if (plugin.value.easyScript) {
      addScriptData(`{{abGetNumber(${key}.${column.code}):${column.comment}}}`)
    } else {
      addScriptData(`abGetNumber(${key}.${column.code})`)
    }
  }

  const addCondition = (column, key) => {
    if (!key) return
    if (plugin.value.easyScript) {
      conditionRef.value.setScript(
        `{{${key}.${column.code}:${column.comment}}}`
      )
    } else {
      conditionRef.value.setScript(`${key}.${column.code}`)
    }
  }

  watch(dialogVisible, (newX) => {
    // 对话框展示的时候对可用字段，bo进行计算
    if (newX) {
      pageData.bo = window.getBo()
      // 计算可用的字段
      getCanUserTables()
    }
  })

  // 当前表中可用的字段有 1.主表，2.父表，3.一对一子表, 4.当前表，5.父表一对一子表
  const getCanUserTables = () => {
    const tableMap = {}
    let bo = pageData.bo
    // 1.首先是主表 （前缀 data.boCode.字段）
    tableMap['data.' + bo.code] = bo.rel

    // 全局配置下，无表名，既当前表是主表
    if (!props.tableName) {
      pageData.currnetTableRel = bo.rel
    }

    const parentRelTable = props.tableName
      ? getParentTable(bo.rel, props.tableName)
      : bo.rel
    let parentTablePath = parentRelTable.tableCode
    pageData.parentRelTable = parentRelTable

    // 父表是主表，或者本身是主表
    if (!props.tableName || parentRelTable.type == 'main') {
      parentTablePath = 'data.' + bo.code
    } else {
      //2.父表 （tableCode.字段）
      tableMap[parentTablePath] = parentRelTable
    }

    parentRelTable.children.forEach((item) => {
      if (item.tableCode == props.tableName) {
        // 4.当前表(tableCode.字段)
        tableMap[item.tableCode] = item
        pageData.currnetTableRel = item
        item.children.forEach((child) => {
          if (child.type === 'oneToOne') {
            // 3.当前表的一对一子表(tableCode.子表Code.字段)
            tableMap[item.tableCode + '.' + child.tableCode] = child
          }
        })
      }
      if (item.type === 'oneToOne') {
        // 5. 父表一对一子表也可以用(父表tableCode.父表子表Code.字段)
        tableMap[parentTablePath + '.' + item.tableCode] = item
      }
    })

    // 计算赋值对象下拉框
    targetOptions(tableMap)
    pageData.canUserTablesMap = tableMap
  }

  // 获取父表
  const getParentTable = (relation, tableName) => {
    if (relation.children && relation.children.length) {
      for (let i = 0, item; (item = relation.children[i++]); ) {
        if (tableName === item.tableCode) {
          return relation
        }
        const p = getParentTable(item, tableName)
        if (p != null) return p
      }
    }
    return null
  }

  // 计算可赋值对象，可取值对象的cascader option
  const targetOptions = (canUserTablesMap) => {
    pageData.targetOptions.length = 0
    for (const key in canUserTablesMap) {
      const item = canUserTablesMap[key]
      if (!item.table && !item.table.columnsWithoutPrimary.length) continue

      const table = {
        label: item.tableComment,
        value: item.tableCode,
        children: [],
      }

      item.table.columnsWithoutPrimary.forEach((column) => {
        table.children.push({
          label: column.comment,
          value: `${key}.${column.code}`,
        })
      })

      pageData.targetOptions.push(table)
    }
  }

  // 计算可取值的子表字段，主表字段就是可赋值字段
  const calFunctionsOptions = (paramConfig) => {
      const tables = paramConfig.isStatistica
        ? pageData.currnetTableRel.children
        : Object.values(pageData.canUserTablesMap)
      if (!tables) return []

      const tableOptions = []
      tables.forEach((item) => {
        if (!item.table && !item.table.columnsWithoutPrimary.length) return

        const table = {
          label: item.tableComment,
        value: item.tableCode,
        children: [],
      }

      item.table.columnsWithoutPrimary.forEach((column) => {
        // 数据类型不匹配
        if (column.type !== paramConfig.type) return
        let key = getPathByTable(item, paramConfig.isStatistica)

        // 统计：bo.userList,'name',取值字段则为：user.name ，路径预类型有所不同
        const valueScript = paramConfig.isStatistica
          ? `${key},'${column.code}'`
          : `${key}.${column.code}`

        table.children.push({
          label: column.comment,
          value: { value: valueScript, name: column.comment },
        })
      })

        if (table.children.length == 0) {
          table.children.push({
            label: '无可用字段：' + paramConfig.typeDesc,
            value: '',
            disabled: true,
          })
        }
        tableOptions.push(table)
      })
      return tableOptions
  }

  const getPathByTable = (table, isStatistica) => {
    // 如果是统计，那全是子表，主表的子表，或者子表的子表
    if (isStatistica) {
      if (pageData.currnetTableRel.type == 'main') {
        return `data.${pageData.bo.code}.${table.tableCode}List`
      } else {
        return `${pageData.currnetTableRel.tableCode}.${table.tableCode}List`
      }
    }
    // 子表内部的字段，或者主表的字段取值
    if (table.type == 'main') {
      return `data.${pageData.bo.code}`
    } else {
      return table.tableCode
    }
  }

</script>

<style lang="scss" scoped>
  .afd-config-form {
    padding: 10px 0 0 0;
  }
</style>
