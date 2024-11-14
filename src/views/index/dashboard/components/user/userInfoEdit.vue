<template>
  <div class="comprehensive-table-container">
    <el-header>
      <ab-save
        back-name="UserInfo"
        :form-ref="formRef"
        :save-data="info.user"
        :url="orgApi.user.saveUserInfo"
      />
      <ab-load v-model="info.user" :url="orgApi.user.getUserInfo" />
    </el-header>
    <el-divider class="dividermar" />

    <el-main>
      <el-form
        ref="formRef"
        label-suffix="："
        label-width="100px"
        :model="info.user"
        :rules="rules"
      >
        <el-form-item label="头像">
          <UploadImg
            v-if="info.user.photo"
            dic-code="user"
            :images="Array.from(imageList)"
            :is-only-upload="true"
            @update-file-list="updateImages"
          />
          <UploadImg
            v-else
            dic-code="user"
            :is-only-upload="true"
            @update-file-list="updateImages"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="fullname">
          <el-input v-model="info.user.fullname" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="info.user.account" disabled />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="info.user.email" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="info.user.mobile" />
        </el-form-item>
        <el-form-item label="微信" prop="weixin">
          <el-input v-model="info.user.weixin" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="info.user.sex" class="ml-4">
            <el-radio value="男" size="large">男</el-radio>
            <el-radio value="女" size="large">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="info.user.address"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入地址"
            type="textarea"
          />
        </el-form-item>

        <el-form-item label="签名">
          <div>
            <div v-if="mySignature">
              <img
                :src="sysApi.sysFile.getViewFileUrl(mySignature)"
                style="width: 60%; height: 60%"
              />
            </div>
            <div>
              <Signature column-name="签名" @aboutSignature="aboutSignature" />
            </div>
            <br />
            <div>
              <UploadImg
                :is-only-upload="false"
                @update-file-list="aboutSignature"
              />
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>

<script lang="ts" setup>
  import UploadImg from './components/uploadImg.vue'
  import Signature from './components/signature.vue'
  import { orgApi, sysApi, getData, abTools } from '~/agilebpm'
  import { reactive, ref } from 'vue'
  import type { FormRules } from 'element-plus'

  const formRef = ref()
  const { proxy } = abTools.useCurrentInstance()
  const imageList: any = ref([])
  const mySignature: any = ref('')
  const info: any = reactive({
    user: {
      photo: '',
      fullname: '',
      account: '',
      email: '',
      mobile: '',
      weixin: '',
      sex: '',
      address: '',
      signature: '',
    },
    patt: '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
  })

  const checkRegExp = (rule: any, value: string, callback: any) => {
    const myRegex = new RegExp(info.patt)
    if (value) {
      if (!myRegex.test(value)) {
        callback(new Error('请输入正确的邮箱'))
      }
    }
    callback()
  }

  const rules = reactive<FormRules>({
    fullname: [{ required: true, message: '必填', trigger: 'blur' }],
    email: [{ validator: checkRegExp, trigger: 'change' }],
  })

  const aboutSignature = (newSignature: any) => {
    if (newSignature) {
      mySignature.value = newSignature
      info.user.signature = newSignature
    }
  }
  const updateImages = (fileList: any) => {
    imageList.value = ''
    if (!fileList || fileList.length == 0) {
      info.user.photo = ''
      return
    }
    info.user.photo = fileList
    imageList.value = fileList
  }

  onMounted(() => {
    getData(orgApi.user.getUserInfo).then((data) => {
      info.user = data.data
    })
  })

  watch(
    () => info.user,
    (val: any) => {
      if (val.photo) {
        imageList.value = val.photo
      }

      if (val.signature) {
        mySignature.value = val.signature
      } else {
        mySignature.value = ''
      }
    }
  )
</script>
