<template>
  <el-main>
    <el-scrollbar height="220px">
      <el-form
        ref="formRef"
        label-suffix="："
        label-width="135px"
        :model="info.data"
        :status-icon="false"
      >
        <el-form-item
          :label="
            info.dialogConf.authType == 'infWhiteList'
              ? '公共资源配置'
              : info.dialogConf.authType == 'infIngores'
              ? '匿名接口配置'
              : info.dialogConf.authType == 'infCsrfIngores'
              ? 'csrf忽略地址'
              : info.dialogConf.authType == 'signIngores'
              ? '接口签名配置'
              : '资源配置'
          "
          prop="url"
          :rules="[{ required: true, message: '必填' }]"
        >
          <el-input v-model="info.data.url" placeholder="请输入资源路径" />
        </el-form-item>

        <el-form-item
          v-if="info.dialogConf.authType == 'infIngores'"
          label="ip白名单"
          prop="ipMatches"
        >
          <el-input
            v-model="info.data.ipMatches"
            placeholder="请输入ip白名单(为空时默认允许所有ip访问)"
          />
        </el-form-item>

        <el-form-item label="接口签名鉴权" prop="signEncrypt" v-if="info.dialogConf.authType == 'signIngores'">
          <el-switch
            v-model="info.data.signEncrypt"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="info.data.comment" placeholder="请输入备注" />
        </el-form-item>

        <el-form-item label="可用状态" prop="status">
          <el-switch
            v-model="info.data.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <el-scrollbar style="float: right">
      <el-button text @click="info.dialogConf.dialogVisable = false">
        取消
      </el-button>
      <el-button type="primary" @click="save(formRef)">保存</el-button>
    </el-scrollbar>
  </el-main>
</template>

<script setup lang="ts">
  import { FormInstance } from 'element-plus'
  import { getCurrentInstance, reactive, ref } from 'vue'
  import { sysApi, postData } from '~/agilebpm'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    data: { type: Object, required: true },
    dialogConf: { type: Object },
  })
  const { dialogConf } = toRefs(props)
  const formRef = ref()
  const info: any = reactive({
    type: '',
    isEdit: false,
    dialogConf: props.dialogConf,
    data: props.data,
  })
  if (!info.data) {
    info.data = {
      url: '',
      comment: '',
      ipMatches: '',
      status: 1,
      authType: info.dialogConf.authType,
    }
  }
  const emit = defineEmits(['callback'])
  const save = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
      if (valid) {
        postData(sysApi.resourceAuth.publicResourceSave, info.data).then(
          (data) => {
            ElMessage({
              message: '添加成功！',
              type: 'success',
            })
            info.dialogConf.dialogVisable = false
            emit('callback')
          },
          () => {}
        )
      }
    })
  }

  //通过参数获取详情或编辑的标记(只读/修改)
</script>
