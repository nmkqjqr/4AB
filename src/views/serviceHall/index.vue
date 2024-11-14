<template>
  <div
    class="hall"
    :style="{
      background: 'url(' + info.backgroundUrl + ') no-repeat center center',
      backgroundSize: '100% 100%',
    }"
  >
    <Header />
    <div class="hall-container">
      <div class="hall-search">
        <h3>一站式网上办事大厅</h3>
        <div class="searchInput">
          <el-autocomplete
            v-model="info.search"
            class="inline-input w-50 inputStyle"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="人事档案查询"
            style="width: 500px"
            :trigger-on-focus="false"
            @select="handleSelect"
          >
            <template #suggestion="{ item }">
              <div class="custom-item">{{ item.value }}</div>
            </template>
          </el-autocomplete>
          <el-button type="primary">查询</el-button>
        </div>
      </div>
      <div class="hallClass">
        <el-card class="box-card cardWidth100">
          <el-tabs v-model="info.activeClass" class="demo-tabs">
            <el-tab-pane
              v-for="(item, index) in info.list"
              :key="index"
              :label="item.tabsName + '办事'"
              :name="item.tabs"
            >
              <div class="listBox">
                <h5>按主题分类</h5>
                <div class="itemBox">
                  <div
                    v-for="(itemc, indexc) in item.theme"
                    :key="indexc"
                    class="listItem"
                    @click="toList(item, itemc)"
                  >
                    <div v-if="itemc.icon" class="img">
                      <img
                        alt=""
                        :src="require('./style/img/' + itemc.icon + '.png')"
                      />
                    </div>
                    <div v-else class="img">
                      <img alt="" :src="require('./style/img/default.png')" />
                    </div>
                    <div class="title">
                      <h4>{{ itemc.name }}</h4>
                    </div>
                    <div
                      v-if="itemc.children && itemc.children.length > 0"
                      class="content"
                    >
                      <span class="contentSpan">
                        {{ itemc.children[0].name }}
                      </span>
                      <span>等{{ itemc.children.length }}个事项</span>
                    </div>
                    <div v-else class="content">
                      <p>暂无事项</p>
                    </div>
                  </div>
                  <div
                    v-if="info.more"
                    class="listItem"
                    @click="moreToList(item, 'theme')"
                  >
                    <div class="img">
                      <img alt="" :src="require('./style/img/more.png')" />
                    </div>
                    <div class="title">
                      <h4>更多事项</h4>
                    </div>
                    <div class="content">
                      <p>办理更多{{ item.tabsName }}相关事项</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="listBox">
                <h5>按部门分类</h5>
                <div class="itemBox">
                  <div
                    v-for="(itemc, indexc) in item.dept"
                    :key="indexc"
                    class="listItem"
                    @click="toList(item, itemc)"
                  >
                    <div v-if="itemc.icon" class="img">
                      <img
                        alt=""
                        :src="require('./style/img/' + itemc.icon + '.png')"
                      />
                    </div>
                    <div v-else class="img">
                      <img alt="" :src="require('./style/img/default.png')" />
                    </div>
                    <div class="title">
                      <h4>{{ itemc.name }}</h4>
                    </div>
                    <div
                      v-if="itemc.children && itemc.children.length > 0"
                      class="content"
                    >
                      <span class="contentSpan">
                        {{ itemc.children[0].name }}
                      </span>
                      <span>等{{ itemc.children.length }}个事项</span>
                    </div>
                    <div v-else class="content">
                      <p>暂无事项</p>
                    </div>
                  </div>
                  <div
                    v-if="info.more"
                    class="listItem"
                    @click="moreToList(item, 'dept')"
                  >
                    <div class="img">
                      <img alt="" :src="require('./style/img/more.png')" />
                    </div>
                    <div class="title">
                      <h4>更多事项</h4>
                    </div>
                    <div class="content">
                      <p>办理更多{{ item.tabsName }}相关事项</p>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { request, sysApi, abTools, getData } from '~/agilebpm'
  import Header from './header.vue'
  const { proxy } = abTools.useCurrentInstance()
  const info: any = reactive({
    search: '',
    activeClass: 'serviceObject_student',
    children: [],
    list: [
      {
        tabs: 'serviceObject_student',
        tabsName: '学生',
        theme: [],
        dept: [],
        tag: [],
        consumer: [],
      },
      {
        tabs: 'serviceObject_visitor',
        tabsName: '访客',
        theme: [],
        dept: [],
        tag: [],
        consumer: [],
      },
      {
        tabs: 'serviceObject_teacher',
        tabsName: '教师',
        theme: [],
        dept: [],
        tag: [],
        consumer: [],
      },
    ],
    iconList: [
      'dag',
      'ggfw',
      'itfw',
      'tsg',
      'wlyxxzx',
      'xcc',
      'xlzx',
      'xsgzc',
      'xssw',
      'xyy',
      'yysp',
      'zcfgd',
    ],
    more: false,
    backgroundUrl: require('./style/img/bg.png'),
  })
  interface RestaurantItem {
    value: string
    id: string
  }
  const restaurants = ref<RestaurantItem[]>([])
  const getAll = () => {
    getData(sysApi.serviceHall.getAll, {}).then(({ data }) => {
      info.more = true
      if (data && data.length > 0) {
        restaurants.value = JSON.parse(JSON.stringify(data))
        restaurants.value.forEach((item: any) => {
          item.value = item.name
        })
        data.forEach((dataItem: any, dataIndex: any) => {
          info.list.forEach((item: any, index: any) => {
            if (dataItem.consumerCode.indexOf(item.tabs) !== -1) {
              item.theme.push({
                name: dataItem.themeName ? dataItem.themeName : '-',
                code: dataItem.themeCode ? dataItem.themeCode : '-',
                icon:
                  dataItem.themeCode &&
                  dataItem.themeCode.split('_')[2] &&
                  info.iconList.indexOf(dataItem.themeCode.split('_')[2]) !== -1
                    ? dataItem.themeCode.split('_')[2]
                    : 'default',
                type: 'theme',
                children: [],
              })
              item.theme = unique(item.theme)
              item.theme.forEach((item1: any) => {
                if (dataItem.themeCode && dataItem.themeCode == item1.code) {
                  item1.children.push({
                    code: dataItem.code,
                    name: dataItem.name,
                    id: dataItem.id,
                    flowKey:
                      dataItem.flowKey && dataItem.flowKey.length > 0
                        ? dataItem.flowKey
                        : '',
                    deptName: dataItem.deptName,
                    themeName: dataItem.themeName,
                    consumerName: dataItem.consumerName,
                    visitTimes: dataItem.visitTimes,
                  })
                }
              })
              item.dept.push({
                name: dataItem.deptName,
                code: dataItem.deptCode,
                icon:
                  dataItem.deptCode.split('_')[2] &&
                  info.iconList.indexOf(dataItem.deptCode.split('_')[2]) !== -1
                    ? dataItem.deptCode.split('_')[2]
                    : 'default',
                type: 'dept',
                children: [],
              })
              item.dept = unique(item.dept)

              item.dept.forEach((item1: any) => {
                if (dataItem.deptCode == item1.code) {
                  item1.children.push({
                    code: dataItem.code,
                    name: dataItem.name,
                    id: dataItem.id,
                    flowKey:
                      dataItem.flowKey && dataItem.flowKey.length > 0
                        ? dataItem.flowKey
                        : '',
                    deptName: dataItem.deptName,
                    themeName: dataItem.themeName,
                    consumerName: dataItem.consumerName,
                    visitTimes: dataItem.visitTimes,
                  })
                }
              })

              item.tag.push({
                name: dataItem.tagName,
                code: dataItem.tagCode,
                type: 'tag',
                children: [],
              })
              item.tag = unique(item.dept)
              item.tag.forEach((item1: any) => {
                if (dataItem.tagCode == item1.code) {
                  item1.children.push({
                    code: dataItem.code,
                    name: dataItem.name,
                    id: dataItem.id,
                    flowKey:
                      dataItem.flowKey && dataItem.flowKey.length > 0
                        ? dataItem.flowKey
                        : '',
                    deptName: dataItem.deptName,
                    themeName: dataItem.themeName,
                    consumerName: dataItem.consumerName,
                    visitTimes: dataItem.visitTimes,
                  })
                }
              })
              item.consumer.push({
                name: dataItem.consumerName,
                code: dataItem.consumerCode,
              })
            }
          })
        })
      }
    })
  }
  getAll()
  const handleSelect = (item: RestaurantItem) => {
    const { href } = proxy.$router.resolve({
      path: '/workGuide',
      query: {
        id: item.id,
      },
    })
    window.open(href, '_blank')
  }
  const unique = (arr: any) => {
    const res = new Map()
    return arr.filter(
      (a: any) =>
        !res.has(a.code) &&
        res.set(a.code, 1) &&
        !res.has(a.name) &&
        res.set(a.name, 1)
    )
  }

  const querySearch = (queryString: string, cb: any) => {
    const results = queryString
      ? restaurants.value.filter(createFilter(queryString))
      : restaurants.value
    // call callback function to return suggestions
    cb(results)
  }
  const createFilter = (queryString: string) => {
    return (restaurant: RestaurantItem) => {
      return restaurant.value.indexOf(queryString) !== -1
    }
  }

  const toList = (item: any, itemc: any) => {
    localStorage.setItem('serviceHallData', JSON.stringify(item))
    localStorage.setItem('serviceClickData', JSON.stringify(itemc))
    proxy.$router.push({ path: '/serviceHallList' })
  }

  const moreToList = (item: any, type: any) => {
    localStorage.setItem('serviceHallData', JSON.stringify(item))
    localStorage.setItem(
      'serviceClickData',
      JSON.stringify(type == 'theme' ? item.theme[0] : item.dept[0])
    )
    proxy.$router.push({ path: '/serviceHallList' })
  }
</script>
<style lang="scss" scoped>
  @import './style/index.scss';
</style>
