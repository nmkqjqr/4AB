<template>
  <div>
    <div
      v-if="
        componentConfig.control.tasks &&
        componentConfig.control.tasks.length > 0
      "
      class="gantt-container"
    >
      <div style="margin-top: 20px; margin-bottom: 10px; text-align: right">
        <el-radio-group
          v-model="viewModes"
          size="small"
          @change="changeViewModes"
        >
          <el-radio-button label="Quarter Day">小半天</el-radio-button>
          <el-radio-button label="Half Day">半天</el-radio-button>
          <el-radio-button label="Day">天</el-radio-button>
          <el-radio-button label="Month">月</el-radio-button>
          <el-radio-button label="Week">周</el-radio-button>
        </el-radio-group>
      </div>
      <el-row
        v-if="
          dimension &&
          dimension.length > 0 &&
          componentConfig.control.tasks &&
          componentConfig.control.tasks.length > 0
        "
      >
        <el-col :span="dimension.length * 2">
          <el-table
            border
            class="gantteTableBox"
            :data="componentConfig.control.tasks"
            row-key="id"
            style="width: 100%"
          >
            <el-table-column
              align="center"
              :label="tasksFirst.name"
              prop="key"
              show-overflow-tooltip
            >
              <template #header="scope">
                <el-tooltip :content="tasksFirst.name" placement="top">
                  <div class="headertitle">
                    <span style="font-size: 14px">{{ tasksFirst.name }}</span>
                  </div>
                </el-tooltip>
              </template>
              <template #default="scope">
                <div
                  :style="{
                    height:
                      scope.row.list && scope.row.list.length > 0
                        ? 55 * scope.row.list.length -
                          scope.row.list.length +
                          1 +
                          'px'
                        : '',
                    lineHeight:
                      scope.row.list && scope.row.list.length > 0
                        ? 55 * scope.row.list.length -
                          scope.row.list.length +
                          1 +
                          'px'
                        : '',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    /* 强制文字不换行 */
                    whiteSpace: 'nowrap',
                    /* 将溢出部分进行隐藏 */
                    overflow: 'hidden',
                    /* 溢出文本转换为省略号 */
                    textOverflow: 'ellipsis',
                  }"
                >
                  {{ scope.row.key }}
                </div>
              </template>
            </el-table-column>
            <template v-if="tasksSecond && tasksSecond.length > 0">
              <template v-for="(item, index) in tasksSecond" :key="index">
                <el-table-column
                  align="center"
                  :label="item.name"
                  prop="key"
                  show-overflow-tooltip
                >
                  <template #header="scope">
                    <el-tooltip :content="item.name" placement="top">
                      <div class="headertitle">
                        <span style="font-size: 14px">{{ item.name }}</span>
                      </div>
                    </el-tooltip>
                  </template>
                  <template #default="scope">
                    <div
                      v-for="(itema, index) in scope.row.list"
                      :key="index"
                      :style="{
                        height: '55px',
                        lineHeight: '55px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        /* 强制文字不换行 */
                        whiteSpace: 'nowrap',
                        /* 将溢出部分进行隐藏 */
                        overflow: 'hidden',
                        /* 溢出文本转换为省略号 */
                        textOverflow: 'ellipsis',
                      }"
                    >
                      {{ itema[item.key] }}
                    </div>
                  </template>
                </el-table-column>
              </template>
            </template>
          </el-table>
        </el-col>
        <el-col
          v-if="!globalParams.isPreview"
          :span="24 - dimension.length * 2"
        >
          <div
            v-if="componentConfig.control.gantteShow"
            :class="componentConfig.control.gatteClass"
          ></div>
        </el-col>
        <el-col v-if="globalParams.isPreview" :span="24 - dimension.length * 2">
          <div
            v-if="componentConfig.control.gantteShow"
            :class="componentConfig.control.gatteClassPreview"
          ></div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-empty description="暂无数据" />
    </div>
    <el-drawer
      v-if="paramsData.formCode"
      v-model="drawer"
      append-to-body="#app"
      :destroy-on-close="true"
      :size="900"
      :with-header="false"
    >
      <formPreview
        :component-config="componentConfig"
        :get-flat-component-list="getFlatComponentList"
        :params-data="paramsData"
        @close-drawer="closeDrawer"
      />
    </el-drawer>
  </div>
</template>

<script>
  import Gantt from 'frappe-gantt'
  import _ from 'lodash'
  import { onMounted, reactive, toRefs } from 'vue'
  import { abUtil, bizApi, formPreview } from '~/agilebpm'
  import * as abFormat from '~/agilebpm/utils/ab-format'
  export default {
    components: { formPreview },
    // eslint-disable-next-line vue/require-prop-types
    props: ['componentConfig', 'globalParams', 'getFlatComponentList'],
    setup(props) {
      // eslint-disable-next-line vue/no-setup-props-destructure
      const vueConfig = reactive({
        tasksFirst: [],
        tasksSecond: [],
        gantt: null,
        ganttData: null, // 甘特图数据
        dimension: [],
        viewModes: 'Day',
        drawer: false,
        paramsData: {},
        formData: {},
        gantteTableBox: 0,
      })

      const changeViewModes = (value) => {
        props.componentConfig.control.creatGshow = false
        if (props.componentConfig.control.source == 'formDesignSelector') {
          getCustFormData()
          // 主键入参
        } else {
          clearGantte()
        }
      }
      const clearGantte = () => {
        const ganttEl = document.querySelector('.gantt-container .gantt')
        if (ganttEl) {
          if (ganttEl.clientHeight > 0) {
            const nextDom = ganttEl.nextElementSibling
            if (nextDom.offsetLeft > 0) {
              props.componentConfig.control.gantteShow = false
            } else {
              props.componentConfig.control.gantteShow = true
            }
          }
        }
        if (!props.componentConfig.control.gantteShow) {
          setTimeout(() => {
            props.componentConfig.control.gantteShow = true
          }, 0)
          setTimeout(() => {
            createG()
          }, 0)
        } else {
          setTimeout(() => {
            createG()
          }, 0)
        }
      }
      const closeDrawer = () => {
        vueConfig.drawer = false
        props.componentConfig.control.creatGshow = false
        init()
      }

      const getCustFormData = () => {
        const ganttEl = document.querySelector('.gantt-container .gantt')
        if (ganttEl) {
          if (ganttEl.clientHeight > 0) {
            const nextDom = ganttEl.nextElementSibling
            if (nextDom.offsetLeft > 0) {
              props.componentConfig.control.gantteShow = false
            } else {
              props.componentConfig.control.gantteShow = true
            }
          }
        }
        if (
          props.componentConfig.control.relCode.length > 0 &&
          props.componentConfig.control.formKey.length > 0
        ) {
          bizApi.custChart
            .custFormDataByCode({
              designCode: props.componentConfig.control.relCode,
              tableCode: props.componentConfig.control.formKey,
              conditionList:
                props.componentConfig.control.conditionConfig &&
                props.componentConfig.control.conditionConfig.length > 0
                  ? conversion(props.componentConfig.control.conditionConfig)
                  : [],
              limit: props.componentConfig.control.limit,
            })
            .then((result) => {
              props.componentConfig.control.tasks = []
              if (result.data.custData && result.data.custData.length > 0) {
                const key = vueConfig.dimension.filter(
                  (item) => item.checked == true
                )[0].key
                // 通过维度匹配数据
                const categorizedItems = result.data.custData.reduce(
                  (custDataResult, custDataItem) => {
                    if (!custDataResult[custDataItem[key]]) {
                      custDataResult[custDataItem[key]] = []
                    }
                    custDataResult[custDataItem[key]].push(custDataItem)
                    return custDataResult
                  },
                  {}
                )
                for (const i in categorizedItems) {
                  props.componentConfig.control.tasks.push({
                    key: i,
                    list: categorizedItems[i],
                  })
                }

                if (!props.componentConfig.control.gantteShow) {
                  props.componentConfig.control.gantteShow = true
                  setTimeout(() => {
                    createG()
                  }, 0)
                } else {
                  setTimeout(() => {
                    createG()
                  }, 0)
                }
              } else {
                props.componentConfig.control.tasks = []
              }
            })
        }
      }
      const getCustData = () => {
        const ganttEl = document.querySelector('.gantt-container .gantt')
        if (ganttEl) {
          if (ganttEl.clientHeight > 0) {
            const nextDom = ganttEl.nextElementSibling
            if (nextDom.offsetLeft > 0) {
              props.componentConfig.control.gantteShow = false
            } else {
              props.componentConfig.control.gantteShow = true
            }
          }
        }
        if (
          props.componentConfig.control.source &&
          ['custGrid', 'formDesignSelector'].includes(
            props.componentConfig.control.source
          ) &&
          props.componentConfig.control.relCode
        ) {
          bizApi.custChart
            .custGridDataByCode(
              props.componentConfig.control.source == 'custGrid'
                ? props.componentConfig.control.boCode
                : props.componentConfig.control.relCodeNew ||
                    props.componentConfig.control.relCode,
              props.componentConfig.control.source,
              null,
              props.componentConfig.control.limit
            )
            .then((rel) => {
              props.componentConfig.control.tasks = []
              const echarsData = rel.data.custData.reverse()

              // 通过维度匹配数据
              if (echarsData && echarsData.length > 0) {
                const categorizedItems = echarsData.reduce(
                  (custDataResult, custDataItem) => {
                    if (
                      !custDataResult[
                        custDataItem[
                          props.componentConfig.control.dimension[0].key
                        ]
                      ]
                    ) {
                      custDataResult[
                        custDataItem[
                          props.componentConfig.control.dimension[0].key
                        ]
                      ] = []
                    }
                    custDataResult[
                      custDataItem[
                        props.componentConfig.control.dimension[0].key
                      ]
                    ].push(custDataItem)
                    return custDataResult
                  },
                  {}
                )
                for (const i in categorizedItems) {
                  props.componentConfig.control.tasks.push({
                    key: i,
                    list: categorizedItems[i],
                  })
                }
              }
              if (!props.componentConfig.control.gantteShow) {
                props.componentConfig.control.gantteShow = true
                setTimeout(() => {
                  createG()
                }, 0)
              } else {
                setTimeout(() => {
                  createG()
                }, 0)
              }
            })
        }
      }

      const formatGantt = () => {
        const result = []
        const list = []
        const linkage = props.componentConfig.control.linkage
        const tasks = JSON.parse(
          JSON.stringify(props.componentConfig.control.tasks)
        )
        for (const i in tasks) {
          tasks[i].list.forEach((item, index) => {
            list.push(item)
          })
        }

        let th = ''
        let thNew = ''
        if (props.componentConfig.control.source == 'formDesignSelector') {
          th = `${props.componentConfig.control.formKey}.`
          // 主键入参
        }
        thNew = props.componentConfig.control.idKey
          ? `${props.componentConfig.control.idKey}`
          : ''

        if (linkage && linkage.length > 0) {
          for (let i = 0; i < list.length; i++) {
            for (let j = i + 1; j < list.length; j++) {
              if (list[j][linkage] == list[i][linkage]) {
                list[j].newLinkage =
                  list[i][`${th}id`] ||
                  list[i][`${th}id_`] ||
                  list[i][`${th}ID`] ||
                  list[i][`${th}ID_`]
              }
            }
          }
        }

        for (let i = 0; i < list.length; i++) {
          const oneItem = {}
          const element = list[i]
          oneItem.start = element[props.componentConfig.control.beginTime]
          oneItem.end = element[props.componentConfig.control.endTime]
          const title = props.componentConfig.control.title
            ? element[props.componentConfig.control.title]
            : ''
          const assiTitle =
            props.componentConfig.control.assiTitle &&
            props.componentConfig.control.assiTitle.length > 0
              ? `(${element[props.componentConfig.control.assiTitle]})`
              : ''
          oneItem.name = title + assiTitle
          oneItem.id =
            element[`${th}id`] ||
            element[`${th}id_`] ||
            element[`${th}ID`] ||
            element[`${th}ID_`]
          oneItem.idNew = element[thNew] || element[thNew]
          oneItem.progress =
            element[props.componentConfig.control.schedule] ||
            element[props.componentConfig.control.schedule] == 0 ||
            element[props.componentConfig.control.schedule] == '0'
              ? element[props.componentConfig.control.schedule]
              : 100
          oneItem.dependencies =
            element.newLinkage && element.newLinkage.length > 0
              ? element.newLinkage
              : []

          result.push(oneItem)
        }
        vueConfig.ganttData = result
      }

      const createG = () => {
        if (!props.componentConfig.control.creatGshow) {
          formatGantt()
          let timeOut
          const gantt = new Gantt(
            !props.globalParams['isPreview']
              ? `.${props.componentConfig.control.gatteClass}`
              : `.${props.componentConfig.control.gatteClassPreview}`,
            vueConfig.ganttData,
            {
              on_click: function (task) {
                if (
                  !props.componentConfig.control.relCodeNew ||
                  props.componentConfig.control.relCodeNew.length <= 0
                ) {
                  ElMessage({
                    type: 'warning',
                    message: '请先配置更新事件',
                  })
                  return false
                }
                vueConfig.drawer = true
                vueConfig.paramsData = {
                  ...{
                    id: task.idNew || task.id,
                    saveClose: '1',
                  },
                  ...{
                    formCode: props.componentConfig.control.relCodeNew,
                  },
                }
              },
              on_date_change: function (task, start, end) {
                let formCode =
                  props.componentConfig.control.relCodeNew ||
                  props.componentConfig.control.relCode
                if (!formCode.endsWith('_pc')) {
                  formCode = `${formCode}_pc`
                }
                timeOut = setTimeout(async () => {
                  const result = await bizApi.bizForm.getFormData(
                    formCode,
                    task.idNew || task.id
                  )
                  const formData = result.data
                  const boCode =
                    props.componentConfig.control.boCodeNew ||
                    props.componentConfig.control.boCode
                  const beginTime =
                    props.componentConfig.control.beginTime.indexOf('.') > -1
                      ? props.componentConfig.control.beginTime.split('.')[1]
                      : props.componentConfig.control.beginTime
                  const endTime =
                    props.componentConfig.control.endTime.indexOf('.') > -1
                      ? props.componentConfig.control.endTime.split('.')[1]
                      : props.componentConfig.control.endTime
                  if (beginTime[beginTime.length - 1] == '_') {
                    formData.data[boCode][beginTime.slice(0, -1)] =
                      abFormat.ab_dateFormat(start, 'yyyy-MM-dd HH:mm:ss')
                  } else {
                    formData.data[boCode][beginTime] = abFormat.ab_dateFormat(
                      start,
                      'yyyy-MM-dd HH:mm:ss'
                    )
                  }
                  if (endTime[endTime.length - 1] == '_') {
                    formData.data[boCode][endTime.slice(0, -1)] =
                      abFormat.ab_dateFormat(end, 'yyyy-MM-dd HH:mm:ss')
                  } else {
                    formData.data[boCode][endTime] = abFormat.ab_dateFormat(
                      end,
                      'yyyy-MM-dd HH:mm:ss'
                    )
                  }
                  saveForm(formCode, formData.data)
                  task.start = abFormat.ab_dateFormat(
                    start,
                    'yyyy-MM-dd HH:mm:ss'
                  )
                  task.end = abFormat.ab_dateFormat(end, 'yyyy-MM-dd HH:mm:ss')
                }, 2000)
              },
              on_progress_change: function (task, progress) {
                let changeProgress = null
                let formCode =
                  props.componentConfig.control.relCodeNew ||
                  props.componentConfig.control.relCode
                if (!formCode.endsWith('_pc')) {
                  formCode = `${formCode}_pc`
                }
                changeProgress = setTimeout(async () => {
                  const result = await bizApi.bizForm.getFormData(
                    formCode,
                    task.idNew || task.id
                  )
                  const formData = result.data
                  const boCode =
                    props.componentConfig.control.boCodeNew ||
                    props.componentConfig.control.boCode

                  const schedule =
                    props.componentConfig.control.schedule.indexOf('.') > -1
                      ? props.componentConfig.control.schedule.split('.')[1]
                      : props.componentConfig.control.schedule

                  if (schedule[schedule.length - 1] == '_') {
                    formData.data[boCode][schedule.slice(0, -1)] = progress
                  } else {
                    formData.data[boCode][schedule] = progress
                  }
                  saveForm(formCode, formData.data)
                  task.progress = progress
                }, 2000)
              },
              on_view_change: function (mode) {
                console.log('on_view_change', mode)
              },
              language: 'zh',
              header_height: 45,
              column_width: 90,
              step: 24,
              view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
              bar_height: 37,
              bar_corner_radius: 5, // bar 的圆角度
              arrow_curve: 20, //连接子任务的线条曲线度
              padding: 18,
              view_mode: vueConfig.viewModes, // header的日期类型
              date_format: 'YYYY-MM-DD', // 日期格式
              custom_popup_html: function (task) {
                return popupHtml(task)
              },
            }
          )
          setTimeout(() => {
            setHeight()
          }, 0)
        }
        props.componentConfig.control.creatGshow = true
      }
      const popupHtml = (task) => {
        return `
          <div class="details-container" style="width:230px;padding:4px 8px;">
            <h4 style="margin:3px 0;">${task.name}</h4>
            <p style="margin:3px 0;">开始时间：${task.start}</p>
            <p style="margin:3px 0;">结束时间：${task.end}</p>
            <p style="margin:3px 0;">进度：${task.progress}%</p>
          </div>
          `
      }
      const setHeight = () => {
        vueConfig.gantteTableBox =
          document.querySelector('.gantteTableBox').clientHeight
        // // 设置svg高度
        const el = document.querySelector('.gantt-container .gantt')
        el.style.height = vueConfig.gantteTableBox + 30
      }
      const saveForm = (formCode, data) => {
        bizApi.bizForm.saveFormData(formCode, data).then(({ data }) => {})
      }
      const init = () => {
        if (
          props.componentConfig.control.custData &&
          props.componentConfig.control.source !== 'custGrid'
        ) {
          if (!props.globalParams.isPreview) {
            getCustFormData()
          }
        }
        if (
          props.componentConfig.control.custData &&
          props.componentConfig.control.source == 'custGrid'
        ) {
          getCustData()
        }
        vueConfig.viewModes = props.componentConfig.control.defaultModel
      }

      const conversion = (conditionConfig) => {
        const result = abUtil.clone(conditionConfig)
        for (const item in result) {
          if (result[item].value) {
            result[item].value = result[item].value.abArgFormat(
              props.globalParams
            )
          }
          if (/^{.*}$/.test(result[item].value)) {
            result[item].value = ''
          }
        }
        return result
      }

      //旧的全局过滤值
      // eslint-disable-next-line vue/no-setup-props-destructure
      let oldConfig = {}
      if (
        props.componentConfig.control.conditionConfig &&
        props.componentConfig.control.conditionConfig.length > 0
      ) {
        oldConfig = props.componentConfig.control.conditionConfig.map((s) => {
          return {
            key: s.key,
            value: s.value ? s.value.abArgFormat(props.globalParams) : '',
          }
        })
      }

      watch(
        () => props.globalParams,
        (newVal) => {
          const newConfig = props.componentConfig.control.conditionConfig.map(
            (s) => {
              return {
                key: s.key,
                value: s.value ? s.value.abArgFormat(props.globalParams) : '',
              }
            }
          )
          if (!_.isEqual(newConfig, oldConfig)) {
            oldConfig = newConfig
            props.componentConfig.control.creatGshow = false
            if (!props.globalParams.isPreview) {
              getCustFormData()
            }
          }
        },
        { deep: true }
      )

      watch(
        () => props.componentConfig.control.conditionConfig,
        (newVal) => {
          if (
            props.componentConfig.control.custData &&
            props.componentConfig.control.source !== 'custGrid'
          ) {
            props.componentConfig.control.creatGshow = false
            getCustFormData()
          }
        },
        { deep: true }
      )

      watch(
        () => props.componentConfig.control.custData,
        (newVal) => {
          if (newVal && newVal.length > 0) {
            if (
              props.componentConfig.control.custData &&
              props.componentConfig.control.source !== 'custGrid'
            ) {
              // 判断是否有弹框
              const ganttEl = document.querySelector('.gantt-container .gantt')
              if (ganttEl) {
                if (ganttEl.clientHeight > 0) {
                  const nextDom = ganttEl.nextElementSibling
                  if (nextDom.offsetLeft > 0) {
                    // 如果存在信息弹出框
                    props.componentConfig.control.gantteShow = false
                  } else {
                    // 如果不存在信息弹出框
                    props.componentConfig.control.gantteShow = true
                  }
                }
              }
              props.componentConfig.control.tasks = newVal
              props.componentConfig.control.creatGshow = false
              // 时间定时重新刷新props.componentConfig.control.gantteShow 存放甘特图的box
              setTimeout(() => {
                props.componentConfig.control.gantteShow = true
              })
              setTimeout(() => {
                createG()
              }, 100)
            } else {
              props.componentConfig.control.creatGshow = false
              getCustData()
            }
            vueConfig.viewModes = props.componentConfig.control.defaultModel
          }
          // else {
          //   props.componentConfig.control.tasks = []
          // }
        },
        { deep: true, immediate: true }
      )

      watch(
        () => props.componentConfig.control.dimension,
        (newVal) => {
          if (newVal && newVal.length > 0) {
            vueConfig.dimension = newVal
            if (props.componentConfig.control.source == 'custGrid') {
              vueConfig.tasksFirst = []
              vueConfig.tasksFirst = vueConfig.dimension[0]
              vueConfig.tasksSecond = []
              vueConfig.tasksSecond = vueConfig.dimension.filter(
                (item) => item.key !== vueConfig.tasksFirst.key
              )
            } else {
              vueConfig.tasksFirst = []
              vueConfig.tasksFirst = vueConfig.dimension.filter(
                (item) => item.checked == true
              )[0]
              vueConfig.tasksSecond = []
              if (vueConfig.tasksFirst && vueConfig.tasksFirst.name) {
                vueConfig.tasksSecond = vueConfig.dimension.filter(
                  (item) => item.name !== vueConfig.tasksFirst.name
                )
              }
            }
          }
        },
        { deep: true, immediate: true }
      )
      watch(
        () => props.componentConfig.control.defaultModel,
        (newVal) => {
          if (newVal && newVal.length > 0) {
            vueConfig.viewModes = newVal
            if (
              props.componentConfig.control.custData &&
              props.componentConfig.control.custData.length > 0
            ) {
              props.componentConfig.control.creatGshow = false
              createG()
            }
          }
        }
      )

      watch(
        () => props.globalParams.isPreview,
        (newVal) => {
          if (!newVal) {
            props.componentConfig.control.creatGshow = false
            if (props.componentConfig.control.source == 'formDesignSelector') {
              getCustFormData()
              // 主键入参
            } else {
              props.componentConfig.control.creatGshow = false
              getCustData()
            }
          }
        }
      )

      onMounted(() => {
        props.componentConfig.control.gantteShow = true
        props.componentConfig.control.creatGshow = false
        init()
      })
      return {
        formPreview,
        ...toRefs(vueConfig),
        createG,
        formatGantt,
        changeViewModes,
        closeDrawer,
        init,
        clearGantte,
        getCustFormData,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .gantt-container {
    width: 100%;
    margin-left: -1px;
    overflow: hidden;
    background-color: transparent;
  }

  :deep(.gantteTableBox tbody td) {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  :deep(.el-table .el-table__cell) {
    box-sizing: border-box !important;
    height: 55px;
    border: 0;
  }

  :deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
    background: rgb(245, 245, 245);
  }

  :deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
    background: rgb(245, 245, 245);
  }

  .gantt .bar {
    height: 20px;
    background-color: #007bff;
  }

  .el-button--text {
    margin-right: 15px;
  }
  .el-select {
    width: 300px;
  }
  .el-input {
    width: 300px;
  }
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  .details-container {
    width: 300px;
  }
  .headertitle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
