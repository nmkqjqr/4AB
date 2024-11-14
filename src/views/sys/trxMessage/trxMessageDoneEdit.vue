<template>
  <el-container class="layout-container-demo">
    <el-header>
      <router-link
        v-if="1 == 1"
        :to="{
          name: 'trxmMessageDoneList',
        }"
      >
        <el-button :icon="Back">返回</el-button>
      </router-link>
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-row>
        <el-col :span="12">
          <el-form
            ref="formRef"
            label-suffix="："
            label-width="120px"
            :model="info.data"
            :status-icon="false"
          >
            <el-form-item label="消息ID" prop="id">
              <span>{{ info.data.id }}</span>
            </el-form-item>
            <el-form-item label="回调器" prop="caller">
              <span>{{ info.data.caller }}</span>
            </el-form-item>
            <el-form-item label="完成时间" prop="updateTime">
              <span>{{ info.data.updateTime }}</span>
            </el-form-item>
            <el-form-item label="数据" prop="dataObject">
              <el-input
                v-model="info.data.dataObject"
                :disabled="true"
                :rows="6"
                type="textarea"
              />
            </el-form-item>
            <el-form-item>
              <ab-load v-model="info.data" :url="cptApi.trxMessageDoneGetUrl" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { cptApi, abTools } from '~/agilebpm'
  import { Back } from '@element-plus/icons-vue'

  const formRef = ref()
  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()

  const info: any = reactive({
    data: {
      id: '',
      caller: '',
      status: '',
      createTime: '',
      dataObject: '',
      retryCause: '',
    },
  })
</script>
