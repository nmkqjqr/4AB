<template>
  <div v-if="data.onlineDocConfig">
    <label class="el-form-item__label" style="padding: 0">在线文档配置：</label>
    <!--文档类型-->
    <el-form-item label="文档格式">
      <el-select
      v-model="data.onlineDocConfig.docType"
      collapse-tags
      collapse-tags-tooltip
      :max-collapse-tags="4"
      placeholder="请选择文档格式"
    >
      <el-option-group
      v-for="group in docTypeOptions"
      :key="group.label"
      :label="group.label"
      >
        <el-option
          v-for="(item,index) in group.options.split(',')"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-option-group>
    </el-select>
    </el-form-item>
    <!--展现形式-->
    <el-form-item label="展现形式">
      <el-radio-group v-model="data.onlineDocConfig.showType" class="ml-4">
      <el-radio label="inner" size="large">表单内嵌</el-radio>
      <el-radio label="dialog" size="large">弹出框</el-radio>
    </el-radio-group>
    </el-form-item>
    <!--表单内嵌宽高设置-->
    <el-form-item label="宽度（px）" label-width="100px" v-if="data.onlineDocConfig.showType === 'inner'">
      <el-input-number v-model="data.onlineDocConfig.innerStyle.width" controls-position="right" :min="500" :step="100"  placeholder="请输入宽"></el-input-number>
    </el-form-item>
    <el-form-item label="高度（px）" label-width="100px" v-if="data.onlineDocConfig.showType === 'inner'">
      <el-input-number v-model="data.onlineDocConfig.innerStyle.height" controls-position="right" :min="500" :step="100" placeholder="请输入高"></el-input-number>
    </el-form-item>
    <!--是否可修订-->
    <el-form-item label="可修订" v-if="data.onlineDocConfig.docType === '.docx'">
      <el-switch
        v-model="data.onlineDocConfig.canReview"
        inline-prompt
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <!--是否多选-->
    <el-form-item label="多选">
      <el-switch
        v-model="data.onlineDocConfig.multiple"
        inline-prompt
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <!--最大文件上传个数-->
    <el-form-item label-width="120px" label="最大文件数" v-if="data.onlineDocConfig.multiple === 1">
      <el-input-number v-model="data.onlineDocConfig.docMax" controls-position="right" :min="2" placeholder="请输入最大文件上传个数"></el-input-number>
    </el-form-item>
  
    <el-form-item label="开启水印" v-if="data.onlineDocConfig.docType === '.docx'">
      <el-switch
        v-model="data.onlineDocConfig.showWatermark"
        inline-prompt
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <div v-if="data.onlineDocConfig.showWatermark === 1 && data.onlineDocConfig.docType === '.docx'" >
      <el-form-item label="水印类型">
        <el-radio-group v-model="data.onlineDocConfig.watermark.type">
          <el-radio-button :label="2" >文本</el-radio-button>
          <el-radio-button :label="1" :disabled="true" >图片</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!--图片水印-->
      <div v-if="data.onlineDocConfig.watermark.type === 1">
        <el-form-item label="图片">
            <el-upload
              action="#"
              :http-request="uploadFn"
              :limit="1"
              accept="image/*"
              list-type="picture-card"
              :on-error="handleError"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
        </el-form-item>
       
        <el-form-item label="缩放">
          <el-select
            v-model="data.onlineDocConfig.watermark.scaling"
            filterable
            allow-create
            default-first-option
          >
            <el-option
              v-for="item in scalingOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="冲蚀">
          <el-switch
            v-model="data.onlineDocConfig.watermark.erosion"
            inline-prompt
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </div>
      <!--文本水印-->
      <div v-if="data.onlineDocConfig.watermark.type === 2">
        <el-form-item label="文字">
          <el-select
            v-model="data.onlineDocConfig.watermark.text"
            filterable
            allow-create
            default-first-option
          >
            <el-option
              v-for="item in textOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="字号">
          <el-input-number v-model="data.onlineDocConfig.watermark.fontSize" controls-position="right" :min="20" :step="10" ></el-input-number>
        </el-form-item>

        <el-form-item label="颜色">
          <el-input v-model="data.onlineDocConfig.watermark.fontColor" placeholder=""></el-input>
           <el-color-picker v-model="data.onlineDocConfig.watermark.fontColor" :predefine="predefineColors"/>
        </el-form-item>
      </div>
     
    </div>
  </div>
</template>

<script lang="ts">
  export default {
      name: "ab-online-doc-config",
  };
  </script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { request, sysApi } from '~/agilebpm/api'
   import {
    ElButton,
    ElMessage,
    ElUpload,
    UploadFiles,
    UploadFile,
    ElColorPicker
  } from 'element-plus'

  const props = defineProps({data:{type:Object,required:true},})
  const {data} = toRefs(props)

  const initData = ()=>{
    if(!data.value.onlineDocConfig){
      data.value.onlineDocConfig = {
        docType:'.docx',
        canReview:1,
        multiple:0,
        docMax:1,
        showWatermark:0,
        showType:'inner',
        innerStyle:{
          height: 500,
          width: 500
        },
        watermark:{
          type:2,
          picId:'',
          scaling:'0',
          erosion:1,
          text:'',
          fontSize:50,
          fontColor:'#409EFF',
        }
      }
    }
  }

  //文件上传
  const uploadFn = (options: any) => {
    const formData = new FormData()
    formData.append('file', options.file)
    formData.append('dicCode', 'default')
    request({
      url: sysApi.sysFile.uploadUrl,
      method: 'post',
      data: formData,
      timeout: 60000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress(progressEvent) {
        const complete = parseInt(
          `${((progressEvent.loaded / progressEvent.total) * 100) | 0}`,
          10
        )
        options.onProgress({ percent: complete })
      },
    })
      .then(
        (result: { data: any }) => {
          if (result.data) {
            options.onSuccess(result.data)
          }
        },
        () => {
          ElMessage.error('文件上传失败')
        }
      )
      .catch((err: any) => {
        if (err) {
          options.onError(err)
          ElMessage.error('文件上传失败')
        }
      })
  }

  //文件删除，删除后台文档
  const handleRemove = (uploadFile: any, uploadFiles: UploadFiles) => {
    const ids = [] as any[]
    uploadFiles.forEach((item: any) => {
      ids.push(item.id)
    })

    data.value.onlineDocConfig.watermark.picId = ids.join('')

    sysApi.sysFile.deleteFile(uploadFile.id)
  }

  // 文件上传失败
  const handleError = (files: File[], fileList: UploadFile[]) => {
    ElMessage.warning(`文件上传失败,请稍后再试`)
  }
  //文件上传成功
  const handleSuccess = (
    response: any,
    uploadFile: any,
    uploadFiles: UploadFiles
  ) => {
    uploadFile.id = response
    const ids = [] as any[]
    uploadFiles.forEach((item: any) => {
      ids.push(item.id)
    })
    data.value.onlineDocConfig.watermark.picId = ids.join('')
  }
  onMounted(()=>{
    initData()
  })

  const docTypeOptions = [
    {
      label: 'word',
      options:'.docx'
    },
    {
      label: '电子表格',
      options:'.xlsx'
    },
    {
      label: 'ppt',
      options:'.pptx',
    }
  ]

  const scalingOptions = [
    {
      label:"自动",
      value:'0'
    },
    {
      label:"500%",
      value:'500%'
    },
    {
      label:"200%",
      value:'200%'
    },
    {
      label:"150%",
      value:'150%'
    },
    {
      label:"100%",
      value:'100%'
    },
    {
      label:"50%",
      value:'50%'
    },
  ]
  const textOption = [
    {
      label:"当前用户名",
      value:'${currentUserName}'
    },
    {
      label:"前用户组织名",
      value:'${currentOrgName}'
    },
    {
      label:"保密",
      value:'保密'
    },
    {
      label:"严禁拷贝",
      value:'严禁拷贝'
    }]

    const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
</script>
