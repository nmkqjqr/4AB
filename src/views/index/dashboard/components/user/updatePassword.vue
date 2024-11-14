<template>
  <div class="comprehensive-table-container">
    <el-header>
      <ab-save
        :after-save-fn="afterSaveFn"
        back-name="Index"
        :before-save-fn="beforeSaveFn"
        :form-ref="formRef"
        :save-data="info.userInfo"
        :url="orgApi.user.updateUserPassWorldUrl"
      />
    </el-header>

    <el-divider class="dividermar" />
    <el-main>
      <el-form
        ref="formRef"
        label-suffix="："
        label-width="100px"
        :model="info"
        :rules="rules"
        status-icon
      >
        <el-form-item label="姓名" prop="fullname">
          <el-input v-model="info.userInfo.fullname" disabled />
        </el-form-item>

        <el-form-item label="账号" prop="account">
          <el-input v-model="info.userInfo.account" disabled />
        </el-form-item>

        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="info.oldPassword"
            placeholder="请输入原密码"
            show-password
            type="password"
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="info.newPassword"
            placeholder="请输入新密码"
            show-password
            type="password"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="info.confirmPassword"
            placeholder="请再次确认新密码"
            show-password
            type="password"
          />
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user'
  import { abTools, orgApi, abStoreAdaptor, postData } from '~/agilebpm'
  import { ElMessage, FormRules } from 'element-plus'
  import { reactive, ref } from 'vue'

  const userStore = useUserStore()
  const router = useRouter()
  const { exitSystem } = userStore
  const { proxy } = abTools.useCurrentInstance()
  const formRef = ref()
  const abUser = useUserStore().getAbUser
  const info = reactive({
    ruleKey: '^[A-Za-z0-9_!@#$%&*]{6,20}$',
    ruleTxt: '密码长度在6-20位之间由数字、字母组合',
    isLogOut: false,
    isNoCheck: false,
    oldPassword: '',
    confirmPassword: '',
    newPassword: '',
    userInfo: {
      fullname: '',
      account: '',
      oldPassword: '',
      confirmPassword: '',
      newPassword: '',
    },
  })

  const checkRegExp = (rule: any, value: string, callback: any) => {
    if (info.isNoCheck) {
      callback()
    }
    const myRegex = new RegExp(info.ruleKey)
    if (!myRegex.test(value)) {
      callback(new Error(info.ruleTxt))
    }
    callback()
  }

  const rules = reactive<FormRules>({
    oldPassword: [
      { required: true, message: '必填', trigger: 'blur' },
      { required: true, message: '必填', trigger: 'change' },
    ],
    confirmPassword: [
      { required: true, message: '必填', trigger: 'blur' },
      { required: true, message: '必填', trigger: 'change' },
      { validator: checkRegExp, trigger: 'change' },
      { validator: checkRegExp, trigger: 'blur' },
    ],
    newPassword: [
      { required: true, message: '必填', trigger: 'blur' },
      { required: true, message: '必填', trigger: 'change' },
      { validator: checkRegExp, trigger: 'change' },
      { validator: checkRegExp, trigger: 'blur' },
    ],
  })

  onMounted(() => {
    postData(orgApi.user.getPwdCheckRule).then((response:any) => {
      if (response && response.data) {
        for (const key in response.data) {
          if (response.data.hasOwnProperty(key)) { // 避免遍历原型链上的属性
            info.ruleKey = key
            info.ruleTxt = response.data[key]
          }
        }
      }
    })
    postData(orgApi.user.updatePwdIsLogOut).then((response:any) => {
      info.isLogOut = response.data
    })

    if (abUser['username'] && abUser['fullName']) {
      info.userInfo.fullname = abUser['username']
      info.userInfo.account = abUser['fullName']
    }
  })

  const afterSaveFn =  () => {
    if (info.isLogOut) {
      isLogOut()
      return false
    }
  }

  const isLogOut = async () => {
    if (info.isLogOut) {
      await exitSystem()
      await router.push('/login')
    }
  }


  const beforeSaveFn = () => {
    info.isNoCheck = false
    if (info.oldPassword === '') {
      ElMessage.error('原密码不能为空')
      return false
    }

    if (info.oldPassword === info.newPassword) {
      ElMessage.error('新密码和原密码不能相同')
      return false
    }

    if (info.newPassword !== info.confirmPassword) {
      ElMessage.error('新密码和确认密码不相同')
      return false
    }
    info.isNoCheck = true
    info.userInfo.oldPassword = abTools.encrypt(info.oldPassword)
    info.userInfo.newPassword = abTools.encrypt(info.newPassword)
    info.userInfo.confirmPassword = abTools.encrypt(info.confirmPassword)
  }
</script>
