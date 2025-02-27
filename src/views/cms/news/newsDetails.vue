<template>
  <div class="detail-container">
    <el-button :icon="Back" style="margin-left: 20px" @click="back">
      {{ $abT('page.common.back','返回') }}
    </el-button>

    <AbPageHeader
      back-router-name="NewsList"
      :content="$abT('page.news.newsDetail','新闻详情')"
    />
    <div class="detailsbox">
      <h5>{{ info.data.title }}</h5>
      <p v-if="info.data.createTime" class="pspan">
        <span>{{ $abT('page.common.time','时间') }}：{{ info.data.createTime }}</span>
        <span>
          {{ $abT('page.news.readCount','阅读量') }}：（{{ info.data.visitNum }}）
        </span>
        <span>
          {{ $abT('page.news.commentCount','评论量') }}：（{{ info.data.commentsNum }}）
        </span>
      </p>
      <el-divider v-if="info.data.createTime" border-style="dashed" />

      <el-carousel
        v-if="info.data.img && info.data.img.length > 0"
        arrow="always"
        height="400px"
        indicator-position="outside"
        style="
          width: 100%;
          padding: 12px;
          margin-bottom: 40px;
          border: 1px solid #dcdfe6;
          border-radius: 10px;
        "
      >
        <el-carousel-item
          v-for="item in info.data.img"
          :key="item"
          style="text-align: center"
        >
          <div
            class="carouselBox"
            :style="{
              background: `url(${item}) no-repeat center center`,
              backgroundSize: 'auto 100%',
            }"
          ></div>
          <!-- <el-image :src="item" /> -->
        </el-carousel-item>
      </el-carousel>

      <div v-html="info.data.content"></div>
      <div v-if="info.data.attachments && info.data.attachments.length > 0">
        <span>{{ $abT('page.common.attachment','附件') }}:</span>
        <span
          v-for="item in JSON.parse(info.data.attachments)"
          :key="item.id"
          class="linkspan"
          @click="downClickFn(item)"
        >
          {{ item.name }}
        </span>
      </div>
      <div v-if="info.cmsCommentsList.length > 0">
        <h4>{{ $abT('page.news.allComments','所有评论') }}</h4>
        <div
          v-for="item in info.cmsCommentsList"
          :key="item.id"
          style="padding: 12px 8px"
        >
          <div style="overflow: hidden">
            <span style="float: left; font-size: 16px; font-weight: 600">
              {{ item.creator }}
            </span>
            <span style="float: right; font-size: 14px; color: #666">
              {{ item.createTime }}
            </span>
          </div>
          <div
            style="padding: 12px 0; font-size: 16px; color: #666"
            v-html="item.commentContent"
          ></div>
          <div style="padding-bottom: 10px; text-align: right">
            <el-button
              v-if="form"
              size="small"
              type="danger"
              @click="deleteComment(item)"
            >
              {{ $abT('page.common.del','删除') }}
            </el-button>
          </div>
          <el-divider style="margin: 8px 0" />
        </div>
      </div>
      <div v-if="!form">
        <h3>{{ $abT('page.news.comment','评论') }}</h3>
        <ab-rich-editor v-model="ruleFrom.commentContent" :height="150" />
        <div style="margin-top: 12px; text-align: right">
          <el-button type="primary" @click="savecommentContent">
            {{ $abT('page.common.publish','发表') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { abT} from '@/i18n'
  import { Back } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    abRichEditor,
    abTools,
    cmsApi,
    getData,
    postData,
    sysApi,
  } from '~/agilebpm'
  //判断是从哪个页面进来得, 返回则回应回相当的页面
  const type = getCurrentInstance()?.proxy?.$route.query.type //定义的请求参数对象泛型

  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()
  const id = proxy.$route.query.id
  const form = proxy.$route.query.form

  const ruleFrom: any = reactive({
    commentContent: '',
  })
  const info: any = reactive({
    data: {},
    cmsCommentsList: [],
  })
  // 下载附件
  const downClickFn = (file: any) => {
    abTools.downFile(file)
  }

  const back = () => {
    abTools.closeTab(proxy.$route.path)
    if (!type) {
      proxy.$router.push({
        name: 'Root',
      })
    } else if (type == 'NewsIndexList') {
      proxy.$router.push({
        name: 'NewsIndexList',
      })
    } else if (type == 'NewsList') {
      proxy.$router.push({
        name: 'NewsList',
      })
    } else {
      proxy.$router.push({
        name: 'Portal',
        params: {
          code: type,
        },
      })
    }
  }

  // 发表评论
  const savecommentContent = () => {
    const reg = /(?!<(img|video).*?>)<.*?>/g
    // strings 是解析出来的内容，不包含标签
    const strings = ruleFrom.commentContent.replace(reg, '')
    if (strings <= 0) {
      ElMessage({
        message: abT('page.news.commentContent','请先输入内容'),
        type: 'error',
      })
      return false
    }
    postData(cmsApi.comments.savecmsCommentsUrl, {
      msgId: id,
      commentType: 1,
      commentContent: ruleFrom.commentContent,
    }).then((result) => {
      ElMessage({
        message: result.message,
        type: 'success',
      })
      getCommentsList()
      ruleFrom.commentContent = '<p><br></p>'
    })
  }
  // 删除
  const deleteComment = (row: any) => {
    ElMessageBox.confirm(abT('page.portal.sureDel','确定删除吗？'),abT('page.common.prompt','提示'), {
      confirmButtonText: abT('page.common.ok','确定'),
      cancelButtonText: abT('page.common.cancel','取消'),
      type: 'warning',
    })
      .then(() => {
        postData(cmsApi.comments.removecmsCommentsUrl + row.id, {}).then(
          (result) => {
            ElMessage({
              message: result.message,
              type: 'success',
            })
            getCommentsList()
          }
        )
      })
      .catch(() => {})
  }
  const getCommentsList = () => {
    getData(cmsApi.news.cmsNewsUrl + id, {}).then((result) => {
      info.cmsCommentsList = result.data.cmsCommentsList
    })
  }
  onMounted(() => {
    getData(cmsApi.news.cmsNewsUrl + id, {}).then((result) => {
      info.data = result.data
      info.cmsCommentsList = info.data.cmsCommentsList
      info.data.img = []
      JSON.parse(info.data.images).forEach((element: any) => {
        if (element.id) {
          info.data.img.push(sysApi.sysFile.getViewFileUrl(element.id))
        }
        // request({
        //   url: downloadUrl + element.id,
        //   method: 'get',
        //   responseType: 'blob',
        // }).then((result) => {
        //   const blob = new Blob([result])
        //   const imageUrl = window.URL.createObjectURL(blob)
        //   info.data.img.push(imageUrl)
        //   info.data.img.forEach((item: any) => {
        //     const img = new Image()
        //     // 图片地址
        //     img.src = item
        //     img.onload = function () {
        //       console.log('width:' + img.width + ',height:' + img.height)
        //     }
        //   })
        // })
      })
    })
  })
</script>
<style lang="scss" scoped>
  .detailsbox {
    width: 1000px;
    margin: 0 auto;
    h5 {
      margin: 12px 0;
      font-size: 20px;
      color: #3892f2;
      text-align: center;
    }
    .pspan {
      font-size: 14px;
      color: #afafaf;
      text-align: center;
      span {
        margin: 0 10px;
      }
    }
    .linkspan {
      margin-left: 18px;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .el-carousel__item {
    overflow: auto;
  }
  .carouselBox {
    height: 100%;
  }
</style>
