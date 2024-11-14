<template>
  <div>
    <el-form
      ref="formRef"
      :inline="true"
      label-width="0px"
      :model="info.data"
      :status-icon="false"
    >
      <el-tabs
        v-model="info.data.type"
        type="border-card"
        @tab-change="tagChange"
      >
        <el-tab-pane
          :label="$abT('bpm.office.configurationMode', '配置模式')"
          name="config"
        >
          <el-scrollbar :max-height="info.height + 200">
            <el-card
              v-for="(config, index) in info.data.configScript.configs"
              :key="config.sn"
              shadow="always"
              style="margin-bottom: 10px"
            >
              <el-divider content-position="left">
                {{ $abT('bpm.office.orCondition', '或条件') }}
                <el-button
                  v-if="info.data.configScript.configs.length > 1"
                  :icon="Delete"
                  text
                  type="primary"
                  @click="
                    abUtil.Arrays.del(index, info.data.configScript.configs)
                  "
                />
              </el-divider>
              <el-table
                v-if="info.dialogVisible"
                border
                :data="config.list"
                :empty-text="
                  $abT('bpm.office.addAndCondition', '请添加“并”条件')
                "
                :header-cell-style="{ 'text-align': 'center' }"
              >
                <el-table-column :label="$abT('page.common.field', '字段')">
                  <template #default="scope">
                    {{ scope.row.sn }}
                    <el-cascader
                      ref="cascaderRef"
                      v-model="scope.row.keyName"
                      :options="scriptVariables"
                      separator="-"
                      @change="getParamValueType(scope.row)"
                    />
                    <!--                    {{ scope.row.keyName }}-->
                  </template>
                </el-table-column>
                <el-table-column :label="$abT('page.common.condition', '条件')">
                  <template #default="scope">
                    <el-select v-model="scope.row.condition">
                      <el-option
                        v-for="item in getConditionTypeByKeyType(
                          scope.row.keyType
                        )"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                        :disabled="item.disabled"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$abT('page.common.valueType', '值类型')"
                >
                  <template #default="scope">
                    <el-select
                      v-if="
                        scope.row.condition &&
                        !info.ConditionTypeMap[scope.row.condition]
                          ?.notNeedParam
                      "
                      v-model="scope.row.valueType"
                      @change="clearValue(scope.row)"
                    >
                      <el-option
                        v-show="
                          ['varchar', 'number', 'date', 'List'].includes(
                            scope.row.keyType
                          )
                        "
                        :label="$abT('page.common.fixedvalue', '固定值')"
                        value="fixed"
                      />
                      <el-option
                        v-show="'variables' == scope.row.keyType"
                        :label="$abT('page.common.fixedvalue', '固定值')"
                        value="variables"
                      />
                      <el-option
                        v-show="'clob' == scope.row.keyType"
                        :label="$abT('page.common.fixedvalue', '固定值')"
                        value="clob"
                      />
                      <el-option
                        v-show="scope.row.keyType == 'actionType'"
                        :label="
                          $abT(
                            'bpm.office.taskProcessingActions',
                            '任务处理动作'
                          )
                        "
                        value="actionType"
                      />

                      <el-option
                        v-show="scope.row.keyType == 'currentNode'"
                        :label="$abT('bpm.office.currentNode2', '当前节点')"
                        value="currentNode"
                      />

                      <el-option
                        v-show="
                          'varchar,number,date,List'.indexOf(
                            scope.row.keyType
                          ) != -1
                        "
                        :label="$abT('bpm.office.processConstants', '流程常量')"
                        value="flowParam"
                      />
                      <el-option
                        v-show="
                          'userId,varchar'.indexOf(scope.row.keyType) != -1
                        "
                        :label="$abT('page.groupList.orgUser', '用户')"
                        value="userId"
                      />
                      <el-option
                        v-show="
                          'orgId,varchar'.indexOf(scope.row.keyType) != -1
                        "
                        :label="$abT('page.common.group', '组织')"
                        value="orgId"
                      />
                      <el-option
                        v-show="
                          'roleId,varchar'.indexOf(scope.row.keyType) != -1
                        "
                        :label="$abT('page.common.role', '角色')"
                        value="roleId"
                      />
                      <el-option
                        v-show="'varchar'.indexOf(scope.row.keyType) != -1"
                        :label="$abT('page.common.post', '岗位')"
                        value="postId"
                      />
                      <el-option
                        v-show="scope.row.keyType == 'roleList'"
                        :label="$abT('page.common.role', '角色')"
                        value="roleList"
                      />
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column :label="$abT('page.common.value', '值')">
                  <template #default="scope">
                    <span
                      v-if="
                        !info.ConditionTypeMap[scope.row.condition]
                          ?.notNeedParam
                      "
                    >
                      <span v-if="scope.row.valueType == 'fixed'">
                        <!-- 除了大文本之外剩下的需要判断组件类型 -->
                        <ab-widely
                          v-model="scope.row.value"
                          :code="JSON.stringify(scope.row.keyName)"
                          :config="getFieldType(scope.row)"
                        />
                      </span>
                      <el-input
                        v-else-if="
                          scope.row.valueType == 'clob' &&
                          scope.row.keyType == 'clob'
                        "
                        v-model="scope.row.value"
                        :placeholder="
                          $abT('page.common.enterFixedValue', '请输入固定值')
                        "
                        style="width: 100%"
                        type="textarea"
                      />
                      <el-input
                        v-else-if="
                          scope.row.valueType == 'variables' &&
                          scope.row.keyType == 'variables'
                        "
                        v-model="scope.row.value"
                        :placeholder="
                          $abT('page.common.enterFixedValue', '请输入固定值')
                        "
                        style="width: 100%"
                      />
                    </span>
                    <el-space v-if="scope.row.valueType == 'orgId'" wrap>
                      {{ scope.row.valueDesc }}
                      <ab-cust-dialog
                        v-model="scope.row"
                        dialog-key="orgSelector"
                        :dialog-setting="{
                          multiple:
                            '!sysScript.abContains({1},{0})'.indexOf(
                              scope.row.condition
                            ) == -1
                              ? 0
                              : 1,
                        }"
                        size="small"
                        type="primary "
                        :value-mapping="{ id: 'value', name: 'valueDesc' }"
                      >
                        {{
                          $abT('page.groupList.pleaseSelectOrg', '请选择组织')
                        }}
                      </ab-cust-dialog>
                    </el-space>
                    <el-space v-if="scope.row.valueType == 'postId'" wrap>
                      {{ scope.row.valueDesc }}
                      <ab-cust-dialog
                        v-model="scope.row"
                        dialog-key="postSelector"
                        :dialog-setting="{
                          multiple:
                            '!sysScript.abContains({1},{0})'.indexOf(
                              scope.row.condition
                            ) == -1
                              ? 0
                              : 1,
                        }"
                        size="small"
                        type="primary "
                        :value-mapping="{ key: 'value', name: 'valueDesc' }"
                      >
                        {{ $abT('page.common.selectPost', '请选择岗位') }}
                      </ab-cust-dialog>
                    </el-space>

                    <el-space v-if="scope.row.valueType == 'userId'" wrap>
                      {{ scope.row.valueDesc }}
                      <ab-cust-dialog
                        v-model="scope.row"
                        dialog-key="userSelector"
                        :dialog-setting="{
                          multiple:
                            '!sysScript.abContains({1},{0})'.indexOf(
                              scope.row.condition
                            ) == -1
                              ? 0
                              : 1,
                        }"
                        size="small"
                        type="primary "
                        :value-mapping="{ id: 'value', name: 'valueDesc' }"
                      >
                        {{
                          $abT('page.groupList.pleaseSelectUser', '请选择用户')
                        }}
                      </ab-cust-dialog>
                    </el-space>
                    <el-space
                      v-if="
                        'roleId,roleList'.indexOf(scope.row.valueType) != -1
                      "
                      wrap
                    >
                      {{ scope.row.valueDesc }}
                      <ab-cust-dialog
                        v-model="scope.row"
                        dialog-key="roleSelector"
                        :dialog-setting="{
                          multiple:
                            'IN,NI'.indexOf(scope.row.condition) == -1 ? 0 : 1,
                        }"
                        size="small"
                        type="primary "
                        :value-mapping="{ id: 'value', name: 'valueDesc' }"
                      >
                        {{ $abT('page.groupList.selectRole', '选择角色') }}
                      </ab-cust-dialog>
                    </el-space>
                    <span v-if="scope.row.valueType == 'flowParam'">
                      <el-cascader
                        v-model="scope.row.valueDesc"
                        :options="scriptVariables"
                        separator="-"
                        @change="
                          scope.row.value = scope.row.valueDesc.join('.')
                        "
                      />
                    </span>

                    <!--动作-->
                    <el-select
                      v-if="scope.row.valueType == 'actionType'"
                      v-model="scope.row.value"
                    >
                      <el-option
                        v-for="item in info.ActionType"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      />
                    </el-select>

                    <!--当前节点-->
                    <el-select
                      v-if="scope.row.valueType == 'currentNode'"
                      v-model="scope.row.value"
                    >
                      <el-option
                        v-for="item in info.allUserNode"
                        :key="item.nodeKey"
                        :label="item.nodeName"
                        :value="item.nodeKey"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  :label="$abT('page.common.operate', '操作')"
                  width="70"
                >
                  <template #header>
                    <el-button
                      circle
                      :icon="Plus"
                      type="success"
                      @click="addConfig1(config, index)"
                    />
                  </template>
                  <template #default="scope">
                    <!--  <el-tag
                      v-if="config.list.length == 1"
                      effect="dark"
                      type="warning"
                    >
                      无操作
                    </el-tag> -->
                    <el-button
                      v-if="config.list.length > 1"
                      circle
                      :icon="Delete"
                      type="danger"
                      @click="abUtil.Arrays.del(scope.$index, config.list)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
            <el-button :icon="Plus" type="success" @click="addConfigs">
              {{ $abT('bpm.office.addORCondition', '增加“或”条件') }}
            </el-button>
            <el-alert
              :closable="false"
              style="margin-top: 10px"
              :title="`${abT('page.common.script', '脚本')}：${
                info.data.configScript.script
              }`"
              type="info"
            />
            <el-alert
              :closable="false"
              style="margin-top: 10px"
              :title="`${abT('page.common.desc', '描述')}：${
                info.data.configScript.desc
              }`"
              type="info"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          v-if="props.manualScript"
          :label="$abT('bpm.office.handwritingMode ', '手写模式')"
          name="hand"
        >
          <div :style="{ height: info.height + 'px' }">
            <scriptVariableSelect v-model="info.data.handScript.script" />
            {{
              `${abT('page.common.script', '脚本')}${abT(
                'page.common.desc',
                '描述'
              )}：`
            }}
            <el-input
              v-model="info.data.handScript.desc"
              :placeholder="
                $abT(
                  'bpm.office.enterScriptDesc',
                  '请输入更便于别人理解的脚本的描述（为空时取脚本内容）'
                )
              "
            />
            <el-divider />
            <codemirror
              v-model="info.data.handScript.script"
              :autofocus="true"
              :extensions="info.extensions"
              :indent-with-tab="true"
              :placeholder="
                $abT(
                  'bpm.office.enterGroovyCode',
                  '请输入groovy代码（类java语言）'
                )
              "
                           :style="{
                      height: `70%`,
                      border: `0px solid #e4e7ed`,
                      width: `96%`,
                    }"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>
<script setup lang="ts">
  import { Delete, Plus } from '@element-plus/icons-vue'
  import { ElMessage, FormInstance } from 'element-plus'
  import { reactive } from 'vue'
  import { Codemirror } from 'vue-codemirror'
  import { bizApi, sysApi } from '~/agilebpm/api'
  import scriptVariableSelect from '~/agilebpm/package/ab-common-resource/bpmDesign/conditionScript/scriptVariableSelect.vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import AbWidely from './abWidely.vue'
  import * as cascaderConfig from './conditionScriptConfig'
  import { abT } from '@/i18n'

  /**
   *  这段代码逻辑比较麻烦，建议读下描述再说操作
   * 1、流程中可用的变量 scriptVariables 在scriptVariablesInit.vue 中做初始化
   * 主要获取业务对象，流程变量，并对它进行一下转化，提供给流程其他配置页面
   * 2、不同类型数据支持不同的条件，在cascaderConfig中配置,条件为两个表达式的格式化模板，如a=b 条件模板为 {0}.equals( {1} )，最终会通过条件模板来格式化
   * 如 数字可以大于小于，数组可以包含不包含，人员id可以选用户，角色id可以选角色
   * 3、综述：字段根据参数类型valueType，决定条件展示，
   * 条件condition + 参数值valueType类型 决定值选择，选择后通过条件模板，生成语句
   * 看一个参数的例子业务对象金额字段>固定值3 { "keyName": [ "ddb", "get('ddje')" ], "key": "ddb.get('ddje')",
   * "keyType": "number", "condition": "{0} > {1} ", "valueType": "fixed", "value": "3", "valueDesc": "" }
   *
   *
   */

  const scriptVariables = inject('scriptVariables') as any

  const props = defineProps({
    modelValue: { required: true, type: Object },
    isSupportScriptVariables: { required: false, type: Boolean, default: true },
    manualScript: { required: false, type: Boolean, default: true },
    flowSetting: { required: false, type: Object, default: () => {} },
    defaultConfig: {
      required: false,
      type: Object,
      default: () => {
        return {
          keyName: ['submitActionName'],
          key: 'submitActionName',
          keyType: 'actionType',
          condition: '{0}.equals( {1} )',
          valueType: 'actionType',
          value: 'agree',
        }
      },
    },
  })

  const cascaderRef = ref()

  const emit = defineEmits(['update:modelValue', 'ok'])

  const info: any = reactive({
    fieldMap: new Map(),
    data: {
      type: 'config',
      handScript: {
        script: '',
        desc: '',
      },
      configScript: {
        script: "return (submitActionName == 'agree')",
        desc: abT(
          'bpm.office.taskProcessingActionEqualsAgreement',
          '任务处理动作 等于 同意'
        ),
        configs: [
          {
            sn: 1,
            list: [
              {
                keyName: ['submitActionName'],
                key: 'submitActionName',
                keyType: 'actionType',
                condition: '{0}.equals( {1} )',
                valueType: 'actionType',
                value: 'agree',
              },
            ],
          },
        ],
      },
    },
    dialogVisible: false,
    tagName: '',
    height: 370,
    extensions: [],
    ConditionType: [],
    ConditionTypeMap: {},
    descMap: {
      submitActionName: abT('bpm.office.taskProcessingActions', '任务处理动作'),
    },
    ActionType: [],
    allUserNode: [],
  })

  onMounted(async () => {
    info.dialogVisible = true
    if (scriptVariables) {
      //获取表单中的字段类型,并转换成map
      getDesignCode()
      if (!props.isSupportScriptVariables) {
        const delIndex = scriptVariables.findIndex((item: any) => {
          return item.value == 'variableScope'
        })
        if (delIndex != -1) {
          scriptVariables.splice(delIndex, 1)
        }
      }
      // 设置级联框名字
      scriptVariables.forEach((item: any) =>
        setCascaderOptionsDesc(item, [], [])
      )

      //获取流程所有的用户节点
      if (props.flowSetting?.nodeMap) {
        Object.keys(props.flowSetting.nodeMap).forEach((key: any) => {
          const node = props.flowSetting.nodeMap[key]
          if (node.nodeType == 'UserTask') {
            info.allUserNode.push(node)
          }
        })
      }
    }

    await sysApi.tools
      .getEnum('com.dstz.bpm.api.enums.ActionType', true)
      .then((resp: { data: any }) => {
        info.ActionType = resp.data
        info.ActionType.forEach((item: any) => {
          info.descMap[item.key] = item.name
        })
      })
    if (props.modelValue && props.modelValue.type) {
      info.data = abUtil.clone(props.modelValue)
    }
  })

  // 讲条件 换种方式，方便取描述
  for (const key in cascaderConfig.conditionMap) {
    const arry = cascaderConfig.conditionMap[key]

    arry.forEach((item: any) => {
      info.ConditionTypeMap[item.value] = item
    })
  }

  const getDesignCode = () => {
    //找到主表单中的全局表单code
    const formCode = scriptVariables.find(
      (s: { type: string }) => s.type == 'main'
    )?.formCode

    if (formCode) {
      //通过全局表单code拿到设计器所有字段以及组件类型
      bizApi.bizForm.getDesignCodeCache(formCode).then((res) => {
        const myMap = new Map()
        jsonToMap(myMap, res.data.pcJson, true, true, '', '')
        info.fieldMap = myMap
      })
    }
  }

  // map要转换/填充的map
  // json数据源json
  // flag是否是主表（主表和子表字段结构不一样）
  // isDiy是否是简易表单
  // 主表BOCODE
  // 主表CODE
  const jsonToMap = (
    map: Map<string, string>,
    json: any,
    flag: boolean,
    isDiy: boolean,
    tableCode: string,
    tableRelCode: string
  ) => {
    if (flag) {
      json.column.forEach((item: any) => {
        if (!['group', 'tabs', 'dynamic'].includes(item.type)) {
          map.set(`${json.boCode}_${item.code}`, item)
        }
        if (
          (item.children &&
            item.children?.column &&
            item.children?.column.length > 0) ||
          (item.tabsColumn && item.tabsColumn.length > 0)
        ) {
          jsonToMap(
            map,
            item,
            false,
            json.mode == 'diyBo',
            json.boCode,
            json.code
          )
        }
      })
    } else {
      const arr = json.children?.column || json.tabsColumn
      arr.forEach((item: any) => {
        if (item.type && !['group', 'tabs', 'dynamic'].includes(item.type)) {
          map.set(
            isDiy
              ? 'dynamic' == json.type ||
                ('group' == json.type && json.subTable)
                ? `${tableRelCode}_${json.code}_AbTable_${item.code}`
                : `${tableCode}_${item.code}`
              : `${json.code ? json.code : tableCode}_${item.code}`,
            item
          )
        }
        if (
          (item.children &&
            item.children?.column &&
            item.children?.column.length > 0) ||
          (item.children?.tabsColumn && item.children?.tabsColumn.length > 0)
        ) {
          jsonToMap(map, item, false, isDiy, tableCode, tableRelCode)
        }
      })
    }
  }

  //获取该字段的组件类型:例如: select,redio 等等
  const getFieldType = (item: any) => {
    /**
   obj =cascaderRef.value[cascaderRef.value.length - 1].getCheckedNodes(true)
   废弃用法,因此在多个值得时候容易有bug,并且因为渲染时机问题
   需要用nextTick包裹,并且nextTick是异步的导致结果无法返回,return出来得数据并不会结束方法, 可以改方法为返回Promise,极其麻烦
   因结构固定,因此改为下方正则表达式截取得方式获取code
   **/
    //如果没选类型,或者只选了第一层(非表单字段),则返回空
    if (item.cType) {
      return item.cType
    }

    if (!item.keyName || item.keyName.length < 2) {
      return ''
    }
    //获取最后一层的叶子节点的数据 例如: get('postSelect28') 并且是引号包裹的内容 例:postSelect28
    const match = item.keyName[item.keyName.length - 1].match(/'([^']*)'/)
    if (!match) {
      return ''
    }
    const code = match[1]

    //取父表单CODE
    let pcode = ''
    if (item.keyName.length == 2) {
      pcode = item.keyName[0]
    } else {
      const match = item.keyName[item.keyName.length - 2].match(/'([^']*)'/)
      if (!match) {
        return ''
      }
      pcode = match[1]
      if (!pcode) {
        return ''
      }
    }

    //最终拿到得code和pcode组成key在map中定位到唯一的组件
    // console.log('item', `${pcode}----------${code}`)
    return info.fieldMap.get(`${pcode}_${code}`)
  }

  const setCascaderOptionsDesc = (
    item: any,
    descArray: any[],
    valueArray: any[]
  ) => {
    descArray.push(item.label)
    valueArray.push(item.value)

    if (item.children) {
      item.children.forEach((item: any) =>
        setCascaderOptionsDesc(
          item,
          JSON.parse(JSON.stringify(descArray)),
          JSON.parse(JSON.stringify(valueArray))
        )
      )
    } else {
      info.descMap[valueArray.join('.')] = descArray.join('-')
    }
  }

  const getConditionTypeByKeyType = (keyType: any) => {
    let type = keyType
    // 其他类型当做 varchar来处理
    if ('varchar,date,number,roleList'.indexOf(keyType) == -1) {
      type = 'varchar'
    }
    return cascaderConfig.conditionMap[type]
  }

  const formRef = ref<FormInstance>()

  const ok = () => {
    if (info.data.type == 'config') {
      if (!formRef.value) return
      formRef.value.validate((valid) => {
        if (valid) {
          info.dialogVisible = false
          emit('update:modelValue', info.data)
          emit('ok', info.data)
        } else {
          ElMessage({
            showClose: true,
            message: abT(
              'bpm.office.checkConfigurationContent',
              '请检查配置内容'
            ),
            type: 'warning',
          })
        }
      })
    }
    if (info.data.type == 'hand') {
      if (!info.data.handScript.script) {
        ElMessage({
          showClose: true,
          message: abT('bpm.office.scriptContentNotEmpty', '脚本内容不能为空'),
          type: 'warning',
        })
        return
      }
      info.dialogVisible = false
      emit('update:modelValue', info.data)
      emit('ok', info.data)
    }
  }

  const tagChange = () => {}

  const addConfig = (config: any) => {
    config.push(props.defaultConfig)
  }

  const addConfig1 = (config: any, index: any) => {
    info.data.configScript.configs[index].list.push(props.defaultConfig)
  }

  const addConfigs = () => {
    const config: any = []
    info.data.configScript.configs.push({
      sn: abUtil.Arrays.getNextSn(info.data.configScript.configs),
      list: config,
    })
    addConfig(config)
  }

  watch(
    () => info.data,
    (newVal, oldVal) => {
      nextTick(() => {
        calConfigScript()
      })

      emit('update:modelValue', info.data)
      emit('ok', info.data)
    },
    { deep: true }
  )

  const calConfigScript = () => {
    if (info.data.type != 'config') {
      return
    }

    const configScript = info.data.configScript
    const orScript: any = []
    const orDesc: any = []
    configScript.configs.forEach((config: any) => {
      const andScript: any = []
      const andDesc: any = []
      config.list.forEach((conf: any) => {
        const r = calConf(conf)
        andScript.push(r.script)
        andDesc.push(r.desc)
      })
      orScript.push(`( ${andScript.join(' && ')} )`)
      orDesc.push(
        `( ${andDesc.join(' ' + abT('bpm.office.and', '且') + ' ')} )`
      )
    })
    configScript.script = `return ${orScript.join(' || ')}`
    configScript.desc = orDesc.join(' ' + abT('bpm.office.or', '或') + ' ')
  }

  const calConf = (conf: any) => {
    let desc = info.descMap[conf.key]

    const cond = info.ConditionTypeMap[conf.condition]
    // 脚本部分
    const value =
      conf.keyType == 'number' || conf.valueType == 'flowParam'
        ? `${conf.value}`
        : `"${conf.value}"`

    const script = conf.condition.abArgFormat(conf.key, value)
    // 描述部分
    desc += ` ${cond?.name} `
    if (!cond?.notNeedParam) {
      if (info.descMap[conf.value]) {
        desc += info.descMap[conf.value]
      } else if (conf.valueDesc) {
        desc += conf.valueDesc
      } else if (conf.value != null || conf.value != undefined) {
        desc += conf.value
      }
    }
    return { script: script, desc: desc }
  }

  /**
   *  设置参数的 类型，以及默认值类型
   * @param row
   */
  // keyType = varchar,number,date, userId, orgId, roleId,
  const getParamValueType = (row: any) => {
    const array = row.keyName
    console.log('!@3312', row)
    let option: any = { children: scriptVariables }
    for (let index = 0; index < array.length; index++) {
      option = option.children.filter(
        (item: any) => item.value == array[index]
      )[0]
    }

    // 设置key 是什么类型，值类型，key值
    row.keyType = (option && option.type) || 'varchar'
    row.valueType = option && option.type ? option.type : 'fixed'

    const obj =
      cascaderRef.value[cascaderRef.value.length - 1].getCheckedNodes(true)

    row.cType = obj[0]?.data?.cType

    if (
      option &&
      option.type &&
      'number，varchar，List'.indexOf(option.type) != -1
    ) {
      row.valueType = 'fixed'
    }

    // 如果是list的 则条件默认为包含
    if (option && option.type && option.type.indexOf('List') !== -1) {
      row.condition = 'sysScript.abContains({0},{1})'
    } else {
      row.condition = '{0}.equals( {1} )'
    }
    if ('number'.indexOf(option.type) != -1) {
      row.condition = '{0} == {1} '
    }
    row.key = row.keyName.join('.')
    clearValue(row)
  }

  const clearValue = (row: any) => {
    row.value = ''
    row.valueDesc = ''
  }
</script>
