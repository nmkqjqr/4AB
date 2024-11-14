<template>
  <div class="tableBox">
    <el-row class="boxRow" :gutter="20">
      <el-col v-if="props.activeType !== 'tag'" class="leftBox" :span="6">
        <div>
          <el-input
            v-model="info.typeSearch"
            class="input-with-select"
            clearable
            placeholder="请输入"
            @clear="clearTypeFn"
            @keyup.enter.native="searchTypeFn"
          >
            <template #append>
              <el-button :icon="Search" @click="searchTypeFn" />
            </template>
          </el-input>
          <el-tabs
            v-model="info.activeName"
            class="table-left-tabs"
            tab-position="left"
            @tab-click="handleClick"
          >
            <el-tab-pane
              v-for="(item, indexc) in info.list"
              :key="indexc"
              class="tabs-item"
              :name="item.code"
            >
              <template #label>
                <span class="custom-tabs-label">
                  <img
                    v-if="item.icon"
                    alt=""
                    :src="require('./style/img/' + item.icon + '.png')"
                  />
                  <img
                    v-else
                    alt=""
                    :src="require('./style/img/default.png')"
                  />
                  <span>{{ item.name }}</span>
                </span>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col class="rightBox" :span="props.activeType == 'tag' ? 24 : 18">
        <h2 v-if="props.activeType !== 'tag'" class="title">
          {{ info.title }}
        </h2>
        <div>
          <el-input
            v-model="info.listSearch"
            clearable
            placeholder="请输入服务事项名称"
            style="width: 300px"
            @clear="clearListFn"
            @keyup.enter.native="searchListFn"
          >
            <template #append>
              <el-button type="primary" @click="searchListFn">搜索</el-button>
            </template>
          </el-input>
          <el-checkbox
            v-model="info.checked"
            label="可在线办理事项"
            size="large"
            style="margin-left: 24px"
          />
        </div>
        <div
          v-if="props.activeType == 'tag'"
          class="tagRadio"
          style="margin-top: 20px"
        >
          <el-radio-group v-model="info.tagRadio">
            <el-radio :label="1">全部事项</el-radio>
            <el-radio
              v-for="(item, indexc) in info.list"
              :key="indexc"
              :label="item.code"
            >
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </div>
        <el-table
          class="tableBox"
          :data="info.tableData"
          height="360"
          style="width: 100%"
        >
          <el-table-column label="服务事项名称" prop="name" />
          <el-table-column label="所属部门" prop="deptName" />
          <el-table-column label="所属主题" prop="themeName" />
          <el-table-column label="服务角色" prop="consumerName" />
          <el-table-column align="center" label="访问次数" prop="visitTimes" />
          <el-table-column label="操作" prop="address" width="180">
            <template #default="scope">
              <el-button
                link
                size="small"
                type="primary"
                @click.prevent="toWorkguide(scope.row)"
              >
                办事指南
              </el-button>
              <el-button
                v-if="scope.row.flowKey && scope.row.flowKey.length > 0"
                link
                size="small"
                type="primary"
                @click.prevent="toWork(scope.row.flowKey)"
              >
                在线办理
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-pagination
            background
            class="paginationStyle"
            :current-page="info.page.currentPage"
            layout="prev, pager, next"
            :page-size="info.page.pageSize"
            :total="info.total"
            @current-change="handleCurrentChange"
          />
          <span class="total">共{{ info.total }}条</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  import { abTools } from '~/agilebpm'
  const { proxy } = abTools.useCurrentInstance()
  const props = defineProps({
    list: { required: true, type: Object },
    clickData: { required: true, type: Object },
    activeType: { required: true, type: String },
  })
  const info: any = reactive({
    typeSearch: '',
    listSearch: '',
    activeName: props.clickData.code,
    checked: false,
    list: props.list,
    title: props.clickData.name,
    tagRadio: 1,
    allData: props.clickData.children,
    tableData: [],
    total: props.clickData.children.length,
    page: {
      currentPage: 1,
      pageSize: 10,
    },
  })
  const initData = () => {
    const data = JSON.parse(JSON.stringify(info.allData))
    info.tableData = data.splice(0, 10)
  }
  initData()
  watch(
    () => props.activeType,
    (newValue) => {
      info.activeName = info.list[0].code
      info.allData = info.list[0].children
      info.total = info.allData.length
      info.title = info.list[0].name
      info.listSearch = ''
      if (newValue == 'tag') {
        info.tagRadio = 1
        let arr = []
        info.list.forEach((item: any) => {
          arr = arr.concat(item.children)
        })
        info.allData = JSON.parse(JSON.stringify(arr))
        info.total = info.allData.length
      }
      initData()
    }
  )
  watch(
    () => info.tagRadio,
    (newValue) => {
      if (newValue == 1) {
        let arr = []
        info.list.forEach((item: any) => {
          arr = arr.concat(item.children)
        })
        info.allData = JSON.parse(JSON.stringify(arr))
      } else {
        info.list.forEach((item: any) => {
          if (item.code == newValue) {
            info.allData = item.children
          }
        })
      }
      info.total = info.allData.length
      initData()
    }
  )
  watch(
    () => info.checked,
    (newValue) => {
      if (info.listSearch && info.listSearch.length > 0) {
        info.total = 0
        if (!newValue) {
          info.tableData = info.allData.filter(function (item: any) {
            if (item.name.indexOf(info.listSearch) > -1) {
              info.page.currentPage = 1
              info.total = info.total + 1
              return item.name.indexOf(info.listSearch) > -1
            }
          })
        } else {
          info.tableData = info.allData.filter(function (item: any) {
            if (
              item.name.indexOf(info.listSearch) > -1 &&
              item.flowKey &&
              item.flowKey.length > 0
            ) {
              info.page.currentPage = 1
              info.total = info.total + 1
              return (
                item.name.indexOf(info.listSearch) > -1 &&
                item.flowKey &&
                item.flowKey.length > 0
              )
            }
          })
        }
        const data = JSON.parse(JSON.stringify(info.tableData))
        info.tableData = data.splice(0, 10)
      } else {
        if (!newValue) {
          info.page.currentPage = 1
          info.total = info.allData.length
          initData()
        } else {
          info.total = 0
          info.tableData = info.allData.filter(function (item: any) {
            if (item.flowKey && item.flowKey.length > 0) {
              info.page.currentPage = 1
              info.total = info.total + 1
              return item.flowKey && item.flowKey.length > 0
            }
          })
          const data = JSON.parse(JSON.stringify(info.tableData))
          info.tableData = data.splice(0, 10)
        }
      }
    }
  )
  const toWorkguide = (row: any) => {
    proxy.$router.push({
      name: 'WorkGuide',
      query: { id: row.id },
    })
  }

  const toWork = (flowKey: any) => {
    if (localStorage.getItem('ab-token')) {
      proxy.$router.push({
        path: `/bpm/flowStart/${flowKey}`,
      })
    } else {
      proxy.$router.push({
        path: `/login`,
        query: { redirect: `/bpm/flowStart/${flowKey}` },
      })
    }
  }

  const handleClick = (value: any, event: any) => {
    info.list.forEach((item: any) => {
      if (item.code == value.props.name) {
        info.allData = item.children
        info.title = item.name
        info.total = info.allData.length
      }
    })
    initData()
  }

  const handleCurrentChange = (currentPage: any) => {
    //页码切换
    info.page.currentPage = currentPage
    currentChangePage(info.allData, currentPage)
  }

  //分页方法（重点）
  const currentChangePage = (list: any, currentPage: any) => {
    let from = (currentPage - 1) * info.page.pageSize
    const to = currentPage * info.page.pageSize
    info.tableData = []
    for (; from < to; from++) {
      if (list[from]) {
        info.tableData.push(list[from])
      }
    }
  }

  const searchTypeFn = () => {
    if (info.typeSearch && info.typeSearch.length > 0) {
      info.list = props.list.filter(function (item: any) {
        if (item.name.indexOf(info.typeSearch) > -1) {
          info.activeName = item.code
          info.allData = item.children
          info.title = item.name
          info.total = info.allData.length
          initData()
          return item.name.indexOf(info.typeSearch) > -1
        }
      })
    } else {
      info.list = props.list
      info.activeName = info.list[0].code
      info.allData = info.list[0].children
      info.total = info.allData.length
      info.title = info.list[0].name
      initData()
    }
  }
  const clearTypeFn = () => {
    info.list = props.list
    info.activeName = info.list[0].code
    info.allData = info.list[0].children
    info.title = info.list[0].name
    info.total = info.allData.length
    initData()
  }

  const searchListFn = () => {
    if (info.listSearch && info.listSearch.length > 0) {
      info.total = 0
      info.tableData = info.allData.filter(function (item: any) {
        if (item.name.indexOf(info.listSearch) > -1) {
          info.page.currentPage = 1
          info.total = info.total + 1
          return item.name.indexOf(info.listSearch) > -1
        }
      })
      const data = JSON.parse(JSON.stringify(info.tableData))
      info.tableData = data.splice(0, 10)
    } else {
      info.page.currentPage = 1
      info.total = info.allData.length
      initData()
    }
  }

  const clearListFn = () => {
    info.page.currentPage = 1
    info.total = info.allData.length
    initData()
  }
</script>
<style lang="scss" scoped>
  @import './style/index.scss';
</style>
