<template>
  <el-card shadow="hover">
    <template #header>
      <span class="fontweight">{{ $abT('page.home.news', '新闻') }}</span>
      <span style="cursor: pointer">
        <router-link :to="{ name: 'NewsIndexList' }">
          <el-icon
            v-if="info.newsList.length > 0"
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
      v-if="!info.newsList.length || info.newsList.length == 0"
      :description="$abT('page.common.notflowData', '暂无数据')"
      :image-size="120"
      style="height: 280px"
    />
    <div v-else style="height: 280px">
      <div v-for="(item, index) in info.newsList" :key="item.id">
        <div class="divStyle">
          <el-carousel height="100px" indicator-position="outside">
            <el-carousel-item v-for="image in item.imagesurl" :key="image">
              <img class="imgStyle" :src="image" />
            </el-carousel-item>
          </el-carousel>
        </div>

        <router-link
          :to="{
            name: 'NewsDetails',
            query: { id: item.id, type: props.router },
          }"
        >
          <div class="titleDiv commonDiv">
            {{ item.title }}
          </div>
          <div class="contentDiv commonDiv">
            {{ filterHTMLTag(item.content) }}
          </div>
          <div class="dateDiv commonDiv">
            {{ item.releaseTime }} &nbsp; &nbsp; &nbsp; &nbsp;
            {{ $abT('page.news.read', '阅读') }} ({{ item.visitNum }}) &nbsp;
            &nbsp; {{ $abT('page.news.comment', '评论') }} ({{
              item.commentsNum
            }})
          </div>
        </router-link>
        <el-divider v-if="index == 0" />
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
  import { FullScreen } from '@element-plus/icons-vue'
  import { cmsApi, sysApi } from '~/agilebpm'
  // // 指定组件命名
  // defineOptions({
  //   name: 'AbNews',
  // })

  const props = defineProps({
    //组件的code
    router: {
      type: String,
      default: null,
    },
  })

  const info = reactive({
    newsList: [] as {
      id: string
      content: string
      images: string
      releaseTime: string
      imagesurl: string[]
      title: string
      commentsNum: string
      visitNum: string
    }[],
  })

  cmsApi.news.getNewsList().then((result) => {
    info.newsList = result.data.rows
    if (info.newsList) {
      for (const i in info.newsList) {
        info.newsList[i].imagesurl = []
        JSON.parse(info.newsList[i].images).forEach((element: any) => {
          if (element.id) {
            info.newsList[i].imagesurl.push(
              sysApi.sysFile.getViewFileUrl(element.id)
            )
          }
        })
      }
    }
  })

  const filterHTMLTag = (msg: string) => {
    msg = msg || ''
    msg = msg.replace(/<\/?[^>]*>/g, '') //去除HTML Tag
    msg = msg.replace(/[|]*\n/, '') //去除行尾空格
    msg = msg.replace(/&npsp;/gi, '') //去掉npsp
    return msg
  }
</script>

<style scoped>
  .fontweight {
    font-size: 20px;
    font-weight: bolder;
    letter-spacing: 2px;
  }
  .titleDiv {
    display: -webkit-box;
    overflow: hidden;
    font-size: 17px;
    font-weight: bold;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .contentDiv {
    height: 50px;
    margin-top: 12px;
    overflow: auto;
    font-size: 15px;
    line-height: 160%;
  }
  .dateDiv {
    margin-top: 20px;
    font-size: 12px;
  }
  .imgStyle {
    width: 135px;
    height: 100px;
  }
  .divStyle {
    float: left;
    width: 135px;
    height: 120px;
  }

  .commonDiv {
    margin-left: 150px;
    color: #3e3a39;
    letter-spacing: 1.3px;
  }
</style>
