<template>
  <div class="gantt-container">
    <el-row>
      <el-col :span="8">
        <el-table
          border
          :data="tasks"
          lazy
          :load="load"
          row-key="id"
          stripe
          style="width: 100%"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <template v-if="dimension.length > 0">
            <el-table-column
              v-for="(item, index) in dimension"
              :key="index"
              :label="item.name"
              :prop="item.key"
              show-overflow-tooltip
              width="160"
            />
          </template>
          <!-- <el-table-column prop="start" width="140" label="开始日期" show-overflow-tooltip />
          <el-table-column prop="end" width="140" label="结束日期" show-overflow-tooltip />
          <el-table-column prop="date" width="140" label="持续时间" show-overflow-tooltip />
          <el-table-column prop="task" width="80" label="完成" show-overflow-tooltip /> -->
          <el-table-column label="Operations" width="300">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleAddChild(scope.$index, scope.row)"
              >
                添加子任务
              </el-button>
              <el-button
                v-if="scope.$index !== 0"
                size="small"
                type="danger"
                @click="handlemove(scope.$index, scope.row)"
              >
                上移一行
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="16">
        <div class="gantt-target"></div>
      </el-col>
    </el-row>
    <!-- <el-button type="primary" @click="handleADD">新增</el-button> -->
  </div>
</template>

<script>
  import { reactive, toRefs, onMounted } from 'vue'
  export default {
    setup(props) {
      const vueConfig = reactive({
        tasks: [
          // 表格数据
          {
            start: '2023-04-01',
            end: '2023-04-08',
            name: '测试任务1',
            id: '1',
            progress: 26,
            task: '50%',
            date: 3,
            children: [],
          },
          {
            start: '2023-04-03',
            end: '2023-04-06',
            name: '测试任务2',
            id: '2',
            progress: 0,
            task: '50%',
            date: 3,
            children: [],
            // dependencies: '1'
          },
          {
            start: '2023-04-04',
            end: '2023-04-08',
            name: '测试任务3',
            id: '3',
            progress: 0,
            task: '50%',
            date: 3,
            children: [],
            // dependencies: '1'
          },
          {
            start: '2023-04-08',
            end: '2023-04-09',
            name: '测试任务4',
            id: '4',
            progress: 0,
            task: '50%',
            date: 3,
            children: [],
            // dependencies: '2'
          },
          {
            start: '2023-04-08',
            end: '2023-04-10',
            name: '测试任务5',
            id: '5',
            progress: 50,
            task: '50%',
            date: 3,
            children: [],
            // dependencies: '2'
          },
        ],
        gantt: null,
        ganttData: null, // 甘特图数据
        dimension:
          props.componentConfig.control.dimension &&
          props.componentConfig.control.dimension.length > 0
            ? props.componentConfig.control.dimension
            : [],
      })
      const handleADD = () => {
        console.log('新增按钮点击')
        vueConfig.tasks.push({
          start: '2023-04-08',
          end: '2023-04-10',
          name: '测试任务6',
          id: '6',
          progress: 0,
          task: '50%',
          date: 3,
          // dependencies: '2'
        })
        createG()
      }
      console.log('2222', props.componentConfig)
      const handleEdit = (item) => {
        console.log('编辑按钮点击')
        vueConfig.tasks.forEach((element) => {
          if (element.id === item.id) {
            element.start = '2022-04-02'
            element.end = '2022-04-07'
            element.date = 5
            element.task = '60%'
          }
        })
        createG()
      }
      const handleAddChild = (index, item) => {
        console.log('添加子任务按钮点击')
        console.log(index, item)
        vueConfig.tasks.forEach((element) => {
          if (element.id === item.id) {
            element.children.push({
              start: '2022-04-01',
              end: '2022-04-08',
              name: '测试任务子任务1',
              id: '8',
              progress: 0,
              task: '50%',
              date: 3,
              dependencies: '1',
            })
          }
        })
        createG()
      }
      const handlemove = (index, item) => {
        console.log('上移一行按钮点击')
        const tempItem = vueConfig.tasks.splice(index, 1)
        vueConfig.tasks.splice(index - 1, 0, tempItem[0])
        createG()
      }

      const formatGantt = () => {
        let result = []
        const obj = {
          start: '',
          end: '',
          name: '',
          id: '',
          progress: 0,
          task: '',
          date: 0,
          children: [],
        }
        vueConfig.tasks.forEach((element) => {
          if (element.children.length === 0) {
            console.log(element)
            result.push(element)
          } else {
            obj.start = element.start
            obj.end = element.end
            obj.name = element.name
            obj.id = element.id
            obj.progress = element.progress
            obj.task = element.task
            obj.date = element.date
            result.push(obj)
            result = result.concat(element.children)
          }
        })
        vueConfig.ganttData = result
      }
      const createG = () => {
        formatGantt()
        const gantt = new Gantt('.gantt-target', vueConfig.ganttData, {
          on_click: function (task) {
            console.log('双击操作', task)
          },
          on_date_change: function (task, start, end) {
            vueConfig.tasks.forEach((element) => {
              if (element.id === task.id) {
                element.start = start
                element.end = end
                element.data = end - start
              }
            })
          },
          on_progress_change: function (task, progress) {
            console.log(task, progress)
          },
          on_view_change: function (mode) {
            console.log(mode)
          },
          // view_mode: 'Day',
          language: 'zh',
          header_height: 70,
          column_width: 90,
          step: 24,
          view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
          bar_height: 62,
          bar_corner_radius: 5, // bar 的圆角度
          arrow_curve: 20, //连接子任务的线条曲线度
          padding: 18,
          view_mode: 'Day', // header的日期类型
          date_format: 'YYYY-MM-DD', // 日期格式
          custom_popup_html: function (task) {
            return `
          <div class="details-container" style="width:250px;padding:0px 20px;">
            <h5>${task.name}</h5>
            <p>Expected to finish by ${task.end}</p>
            <p>${task.progress}% completed!</p>
          </div>
          `
          },
        })
      }
      onMounted(() => {
        createG()
      })
      return {
        ...toRefs(vueConfig),
        handleADD,
        createG,
        handleEdit,
        handleAddChild,
        handlemove,
        formatGantt,
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

  :v-deep(.el-table .el-table__cell) {
    height: 80px;
  }

  :v-deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
    background: rgb(245, 245, 245);
  }

  :v-deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
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
</style>
