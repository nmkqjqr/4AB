<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="NewsList"
        :before-save-fn="handlebeforesaveFn"
        :form-ref="formRef"
        :save-data="info.data"
        :url="cmsApi.news.cmssaveOrUpdateUrl"
      />
      <ab-load v-model="info.data" :url="cmsApi.news.cmsNewsUrl" />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="info.data"
          :status-icon="false"
        >
          <el-form-item
            :label="$abT('page.common.title','标题')"
            placeholder=" "
            prop="title"
            :rules="[
              {
                required: true,
                message: $abT('page.common.required','必填'),
              },
              {
                message: $abT('page.news.length','长度为100以内'),
                max: 100,
              },
            ]"
          >
            <el-input v-model="info.data.title" />
          </el-form-item>
          <el-form-item
            :label="$abT('page.common.content','内容')"
            prop="content"
            :rules="[{ required: true, message: $abT('page.common.required','必填') }]"
          >
            <ab-rich-editor v-model="info.data.content" />
          </el-form-item>
          <el-form-item
            :label="$abT('page.news.rotatingPictures','轮播图片')"
            :rules="[{ required: true, message: $abT('page.common.required','必填') }]"
          >
            <UploadImg
              v-if="id && info.data.images.length > 0"
              dic-code="news"
              :images="info.data.images"
              @update-file-list="updateimages"
            />
            <UploadImg
              v-else
              dic-code="news"
              @update-file-list="updateimages"
            />
          </el-form-item>
          <el-form-item :label="$abT('page.common.upload','上传')">
            <ab-upload-file
              v-if="id && info.data.attachments.length > 0"
              v-model="info.data.attachments"
              dic-code="news"
              size="small"
            />
            <ab-upload-file
              v-else
              v-model="info.data.attachments"
              dic-code="news"
              size="small"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { abT } from '@/i18n'
  import { ElMessage } from 'element-plus'
  import { reactive, ref } from 'vue'
  import { abRichEditor, abTools, abUploadFile, cmsApi } from '~/agilebpm'
  import UploadImg from './components/uploadImg.vue'
  const formRef = ref()
  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()
  const id = proxy.$route.query.id
  const info: any = reactive({
    data: {
      title: '',
      content: '',
      attachments: '',
      images: [],
    },
  })
  //保存前对各个提交字段 非空校验
  const handlebeforesaveFn = () => {
    if (info.data.title.length <= 0) {
      ElMessage({
        message: abT('page.news.titleTip','请填写标题'),
        type: 'warning',
      })
      return false
    }
    if (!info.data.content || info.data.content.length <= 0) {
      ElMessage({
        message:abT('page.news.commentContent','请先输入内容'),
        type: 'warning',
      })
      return false
    }
    if (info.data.images.length <= 0) {
      ElMessage({
        message: abT('page.news.uploadTip','请上传轮播图片'),
        type: 'warning',
      })
      return false
    }
    return true
  }

  // 更新轮播图文件
  const updateimages = (fileList: any) => {
    info.data.images = []
    fileList.forEach((element: any) => {
      if (element.response) {
        info.data.images.push({
          name: element.raw.name,
          id: element.response.data,
        })
      } else {
        info.data.images.push({
          name: element.name,
          id: element.id,
        })
      }
    })
    info.data.images = JSON.stringify(info.data.images)
  }
</script>
