<template>
  <div class="comprehensive-table-container">
    <div style="height: 35px">
      <router-link :to="{ name: 'userInfoEdit' }">
        <el-button size="default" type="primary">编辑</el-button>
      </router-link>
    </div>
    <el-divider class="dividermar" />
    <el-main>
      <div class="content">
        <el-avatar
          v-if="info.data.user.photo"
          style="margin-bottom:10px"
          :src="sysApi.sysFile.getViewFileUrl(info.data.user.photo)"
          size="large"
          shape="circle"
        />
        <el-avatar
          v-if="info.data.user.fullname && !info.data.user.photo"
          style="margin-bottom:10px"
          size="large"
          shape="circle"
        >
          {{ info.data.user.fullname.slice(-2) }}
        </el-avatar>
        <strong class="name">{{ info.data.user.fullname }}</strong>
        <div class="info">
          <div>
            <label>手机号：</label>
            <span>{{ info.data.user.mobile }}</span>
          </div>
          <div>
            <label>性别：</label>
            <span>{{ info.data.user.sex }}</span>
          </div>
          <div>
            <label>账号：</label>
            <span>{{ info.data.user.account }}</span>
          </div>
          <div>
            <label>邮箱：</label>
            <span>{{ info.data.user.email }}</span>
          </div>
          <div>
            <label>微信：</label>
            <span>{{ info.data.user.weixin }}</span>
          </div>
          <div>
            <label>组织：</label>
            <span>
              <el-tag
                v-for="(relation, index) in info.data.user.orgRelationList"
                v-show="relation.type === 'groupUser'"
                :key="index"
              >
                {{ relation.groupName }}
              </el-tag>

              <el-tag
                v-for="(relation, index) in info.data.user.orgRelationList"
                v-show="relation.type === 'groupUserRole' && relation.groupName"
                :key="index"
              >
                {{ relation.groupName }}
              </el-tag>
            </span>
          </div>
          <div>
            <label>岗位：</label>
            <span>
              <el-tag
                v-for="(relation, index) in info.data.user.orgRelationList"
                v-show="relation.type === 'groupUserRole'"
                :key="index"
              >
                {{ relation.postName }}
              </el-tag>
            </span>
          </div>
          <div>
            <label>地址：</label>
            <span>{{ info.data.user.address }}</span>
          </div>
          <div>
            <label>签名：</label>
            <span
              v-if="
                info.data.user.signature == null ||
                info.data.user.signature === ''
              "
            >
              请您编辑生成签名
            </span>
            <div v-else>
              <img
                :src="sysApi.sysFile.getViewFileUrl(info.data.user.signature)"
                style="width: 60%; height: 60%"
              />
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import { orgApi, sysApi, getData, abTools } from '~/agilebpm'

  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()

  const info: any = reactive({
    data: {
      user: {},
      photo: '',
      mySignature: '',
      blob: '',
    },
  })

  onMounted(() => {
    getData(orgApi.user.getUserInfo).then((data) => {
      info.data.user = data.data
    })
  })
</script>
<style scoped>

  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .info > div {
    margin-bottom: 15px;
  }

  .name {
    margin-bottom: 20px;
  }

  label {
    margin-right: 5px;
    font-weight: 600;
  }
</style>
