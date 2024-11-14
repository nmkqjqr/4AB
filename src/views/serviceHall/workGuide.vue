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
      <div class="hall-title">
        <h3>{{ info.detailsData.name }}</h3>
      </div>
      <div class="hallClass">
        <el-card class="box-card cardWidth100">
          <div class="message-item">
            <div>
              <el-button :icon="ArrowLeft" @click="back">返回</el-button>
            </div>
            <h2>基本信息</h2>
            <el-divider class="dividerStyle" />
            <table border="1" class="tableBox">
              <tbody>
                <tr>
                  <td class="title">事项名称</td>
                  <td class="content">{{ info.detailsData.name }}</td>
                  <td class="title">责任部门</td>
                  <td class="content">{{ info.detailsData.deptName }}</td>
                </tr>
                <tr>
                  <td class="title">服务对象</td>
                  <td class="content">{{ info.detailsData.consumerName }}</td>
                  <td class="title">服务主题</td>
                  <td class="content">{{ info.detailsData.themeName }}</td>
                </tr>
                <tr>
                  <td class="title">服务内容</td>
                  <td class="contentLang" colspan="3">
                    <p>{{ info.detailsData.content }}</p>
                  </td>
                </tr>
                <tr>
                  <td class="title">主要业务周期</td>
                  <td class="contentLang" colspan="3">
                    {{ info.detailsData.businessCycleName }}
                  </td>
                </tr>
                <tr>
                  <td class="title">内容标签</td>
                  <td class="contentLang" colspan="3">
                    {{ info.detailsData.tagName }}
                  </td>
                </tr>
                <tr>
                  <td class="title">办理地点</td>
                  <td class="contentLang" colspan="3">
                    {{ info.detailsData.location }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            v-if="
              info.detailsData.flowKey && info.detailsData.flowKey.length > 0
            "
            class="message-item"
          >
            <h2>办理入口</h2>
            <el-divider class="dividerStyle" />
            <div style="margin-top: 14px">
              <el-button
                text
                type="primary"
                @click="toWork(info.detailsData.flowKey)"
              >
                <span>{{ info.detailsData.name }}</span>
                <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
          <div class="message-item">
            <h2>办理须知</h2>
            <el-divider class="dividerStyle" />
            <p v-html="info.detailsData.notice"></p>
          </div>
          <!-- <div class="message-item">
            <h2>办理流程</h2>
            <el-divider class="dividerStyle" />
            <p v-html="info.detailsData.process"></p>
          </div> -->
          <div class="message-item">
            <h2>咨询电话</h2>
            <el-divider class="dividerStyle" />
            <p class="phone">
              <span v-html="info.detailsData.phoneInfoName"></span>
            </p>
            <!-- <p class="phone">
              <span style="margin-right: 100px">23366500</span>
              <span>现代教育技术部</span>
            </p> -->
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
  import { reactive, ref } from 'vue'
  import Header from './header.vue'
  import Table from './table.vue'
  import { getData, sysApi, abTools } from '~/agilebpm'
  const { proxy } = abTools.useCurrentInstance()

  const info: any = reactive({
    detailsData: {},
    backgroundUrl: require('./style/img/bg.png'),
  })
  const getDetail = () => {
    getData(sysApi.serviceHall.detail, { id: proxy.$route.query.id }).then(
      ({ data }) => {
        if (data) {
          info.detailsData = data
        }
      }
    )
  }
  getDetail()

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

  const back = () => {
    proxy.$router.go(-1)
  }
</script>
<style lang="scss" scoped>
  @import './style/index.scss';
</style>
