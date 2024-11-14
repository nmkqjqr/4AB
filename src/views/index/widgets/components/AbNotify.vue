<template>
  <el-card shadow="hover">
    <template #header>
      <span class="fontweight">{{ $abT('page.home.notify', '公告') }}</span>
      <span style="cursor: pointer">
        <router-link :to="{ name: 'NoticeIndexList' }">
          <el-icon
            v-if="info.notifyList.length > 0"
            color="#64890ff"
            :size="15"
            style="position: absolute; top: 30%; right: 2%"
          >
            <FullScreen />
          </el-icon>
        </router-link>
      </span>
    </template>
    <el-empty
      v-if="!info.notifyList.length || info.notifyList.length == 0"
      :description="$abT('page.common.notflowData', '暂无数据')"
      :image-size="120"
      style="height: 280px"
    />
    <div v-else style="height: 280px; overflow: auto">
      <div v-for="item in info.notifyList" :key="item.id" class="divStyle">
        <router-link
          style="width: 100%"
          :to="{
            name: 'NoticeDetails',
            query: { id: item.id, type: props.router },
          }"
        >
          <el-row>
            <el-col :lg="24" :md="24" :sm="24" :xl="11" :xs="24">
              <div class="step title">{{ item.title }}</div>
            </el-col>
            <el-col :lg="24" :md="24" :sm="24" :xl="13" :xs="24">
              <div class="step tap">
                <el-tag v-if="item.isRead == 1" class="ml-2" type="success">
                  {{ $abT('page.common.read', '已读') }}
                </el-tag>
                <el-tag v-else class="ml-2" type="danger">
                  {{ $abT('page.common.unread', '未读') }}
                </el-tag>
              </div>

              <div class="step">{{ item.typeIdName }}</div>
              <div class="step date">{{ item.releaseTime }}</div>
              <div class="step custom">
                {{ $abT('page.news.read', '阅读') }} ({{ item.visitNum }})
              </div>
              <div class="step custom">
                {{ $abT('page.news.comment', '评论') }} ({{ item.commentsNum }})
              </div>
            </el-col>
          </el-row>
        </router-link>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
  import { FullScreen } from '@element-plus/icons-vue'
  import { cmsApi } from '~/agilebpm'
  // // 指定组件命名
  // defineOptions({
  //   name: 'AbNotify',
  // })
  const props = defineProps({
    //组件的code
    router: {
      type: String,
      default: null,
    },
  })

  const info = reactive({
    notifyList: [] as {
      id: string
      title: string
      typeIdName: string
      isRead: number
      commentsNum: number
      visitNum: number
      releaseTime: string
    }[],
  })

  cmsApi.notify
    .getNotifyList()
    .then((result) => (info.notifyList = result.data.rows))
</script>

<style scoped>
  .fontweight {
    font-size: 20px;
    font-weight: bolder;
    letter-spacing: 2px;
  }

  .step {
    display: inline-block;
    height: 50px;
    margin-top: 5px;
    margin-right: 5%;
    overflow: hidden;
    font-size: 14px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .title {
    align-items: center;
    max-width: 100%;
    overflow: hidden;
    font-size: 17px;
    text-align: left;
    text-overflow: ellipsis;
  }
  .tap {
    margin-top: 0px;
  }
  .date {
    align-items: center;

    font-size: 12px;
    color: #3e3a39;
  }
  .custom {
    font-size: 12px;
    color: #3e3a39;
  }
  .divStyle {
    width: 100%;
  }
</style>
