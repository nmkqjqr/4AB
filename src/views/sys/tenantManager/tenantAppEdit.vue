<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="TenantMgrAppList"
        :before-save-fn="saveBeforeFn"
        edit-refresh
        :form-ref="formRef"
        :save-data="info.data"
        :url="sysApi.tenant.appSaveUrl"
      />
      <ab-load
        v-model="info.data"
        :url="`${sysApi.tenant.appGetUrl}?id=`"
        @after-fn="loadAfter"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="info.data"
        >
          <el-form-item
            label="分类"
            prop="typeCode"
            :rules="[{ required: true, message: '必填' }]"
          >
            <ab-select-tree
              v-model="info.data.typeCode"
              type-code="tenantAppType"
            />
          </el-form-item>
          <el-form-item
            label="名称"
            prop="name"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="info.data.name" placeholder="名称" />
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="info.data.desc" :rows="2" type="textarea" />
          </el-form-item>
          <el-form-item
            label="价格"
            prop="price"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input-number
              v-model="info.data.price"
              controls-position="right"
              :min="0"
              size="large"
            />
          </el-form-item>
          <el-form-item label="图片" prop="image">
            <el-upload
              ref="imageUploadRef"
              v-model:file-list="imageUploadConf.items"
              accept=".png,.jpeg,.gif,.jpg,.webp,.bmp"
              action="#"
              :auto-upload="true"
              :http-request="imageUploadConf.uploadRequest"
              list-type="picture-card"
            >
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="对外开放"
            prop="isOpen"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-checkbox
              v-model="info.data.isOpen"
              border
              :false-label="0"
              size="large"
              :true-label="1"
            />
          </el-form-item>
          <el-form-item label="详情" prop="detail">
            <ab-rich-editor v-model="info.data.detail" />
          </el-form-item>
          <el-form-item
            label="安装器"
            prop="installer"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-radio-group v-model="info.data.installer">
              <el-radio label="default">Default</el-radio>
              <el-radio label="freemarker">Freemarker</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="安装脚本"
            prop="installScript"
            :rules="[{ required: true, message: '必填' }]"
          >
            <codemirror
              v-model="info.data.installScript"
              :autofocus="true"
              :indent-with-tab="true"
              placeholder="安装脚本"
              :style="{
                border: `1px solid #e4e7ed`,
                width: `calc(100% - 20px) `,
                minHeight: '500px',
              }"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>
<script lang="ts" setup>
import {
  FormInstance,
  UploadInstance,
  UploadRequestOptions,
} from 'element-plus'
import { Codemirror } from 'vue-codemirror'
import { sysApi, request, abRichEditor } from '~/agilebpm'
import { Plus } from '@element-plus/icons-vue'

const formRef = ref<FormInstance>()
const imageUploadRef = ref<UploadInstance>()

const info = reactive({
  data: {
    name: '',
    image: '',
    desc: '',
    detail: '',
    price: 0,
    isOpen: 1,
    typeCode: '',
    installer: 'default',
    installScript: '',
  },
})

const imageUploadConf = reactive({
  items: [] as any[],
  uploadRequest(options: UploadRequestOptions) {
    return new Promise((resovle, reject) => {
      request
        .postForm(sysApi.sysFile.uploadUrl, {
          file: options.file,
        })
        .then(({ data }) => {
          resovle(data)
        })
    })
  },
  remove(file: any) {},
})

const saveBeforeFn = () => {
  // 上传文件
  info.data.image = imageUploadConf.items
    .map((file: any) => (file.response ? file.response : file.id))
    .join(',')
  return true
}
const loadAfter = (data: any) => {
  if (data && data.image) {
    imageUploadConf.items = data.image.split(',').map((fileId: string) => ({
      id: fileId,
      url: sysApi.sysFile.getViewFileUrl(fileId),
    }))
  }
}
</script>
