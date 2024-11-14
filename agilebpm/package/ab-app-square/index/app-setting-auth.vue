<template>
  <div>
    <el-card shadow="never" class="infoBox">
      <el-card shadow="hover" style="margin-bottom: 20px">
        <template #header>
          <el-row>
            <el-col :span="22">
              <p class="authName">
                <span>{{ info.devAuth.name }}</span>
              </p>

              <p class="authDesc">
                <span>{{ info.devAuth.desc }}</span>
              </p>
            </el-col>
          </el-row>
        </template>
        <el-row style="margin-bottom: 10px">
          <el-col :span="24">
            <el-space wrap>
              <label label-width="80px">权限配置：</label>
              <grant-auth
                :auth-group="info.devAuth"
                @grantSuccess="initProjectAuths"
              />
            </el-space>
          </el-col>
        </el-row>
      </el-card>
      <div style="margin-top: 40px; margin-bottom: 20px">
        <el-divider content-position="left" border-style="dashed">
          <span style="font-size: 16px">访问权限</span>
        </el-divider>
      </div>
      <div style="margin-top: 20px; margin-bottom: 20px" v-if="props.projectId">
        <add-auth-group
          :project-id="props.projectId"
          @saveSuccess="initProjectAuths"
        />
      </div>
      <div v-for="(auth, index) in info.authList" :key="index">
        <el-card shadow="hover" style="margin-bottom: 20px">
          <template #header>
            <el-row>
              <el-col :span="18">
                <p class="authName">
                  <span>{{ auth.name }}</span>
                </p>
                <p class="authDesc">
                  <span>{{ auth.desc }}</span>
                </p>
              </el-col>
              <el-col :span="6">
                <span style="float: right">
                  <el-space>
                    <el-button
                      type="primary"
                      @click="editAuthGroupRef.show(auth)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="danger"
                      style="float: right"
                      @click="deleteAuth(auth)"
                    >
                      删除
                    </el-button>
                  </el-space>
                </span>
              </el-col>
            </el-row>
          </template>
          <el-row class="dataRow">
            <el-col :span="24">
              <el-space wrap>
                <label label-width="80px">权限成员：</label>
                <grant-auth
                  :auth-group="auth"
                  :save-data="true"
                  @grantSuccess="initProjectAuths"
                />
              </el-space>
            </el-col>
          </el-row>
          <el-row class="dataRow">
            <el-col :span="24">
              <el-space>
                <label label-width="80px">资源权限：</label>
                <allocate-resources
                  :auth-group="auth"
                  :save-data="true"
                  :project-id="props.projectId"
                />
              </el-space>
            </el-col>
          </el-row>
          <el-row class="dataRow">
            <el-col :span="24">
              <el-space>
                <label label-width="80px">数据权限：</label>
                <data-auth
                  :auth-group="auth"
                  :save-data="true"
                  :project-id="props.projectId"
                />
              </el-space>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <add-auth-group
        ref="editAuthGroupRef"
        :project-id="props.projectId"
        :show-button="false"
        @saveSuccess="initProjectAuths"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    getProjectAuth,
    authorisation,
    saveAuthGroup,
    deleteAuthGroup,
  } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-authGroup'
  import { abUtil, abTools } from '~/agilebpm'
  import grantAuth from '../components/grantAuth.vue'
  import allocateResources from '../components/allocateResources.vue'
  import addAuthGroup from '../components/addAuthGroup.vue'
  import dataAuth from '../components/dataAuth.vue'

  const { proxy } = abTools.useCurrentInstance()
  const editAuthGroupRef = ref()

  const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    projectId: {
      type: String,
      required: true,
    },
  })
  const vueContext = getCurrentInstance()
  const info = reactive({
    saveLoading: false,
    authList: [],
    devAuth: {},
  })

  const initProjectAuths = () => {
    info.authList.splice(0, info.authList.length)
    const accessAuth = []
    getProjectAuth(props.projectId).then((res) => {
      res.data.forEach((item) => {
        if (item.code == 'dev') {
          info.devAuth = item
        } else {
          accessAuth.push(item)
        }
      })
      console.log('accessAuth', accessAuth)
      info.authList.push(...accessAuth)

      console.log(info.authList)
    })
  }

  const toggleNameDesc = (auth: any, type: String) => {
    if (type == 'name') {
      auth.inputName = !info.inputName
    } else {
      auth.inputDesc = !info.inputDesc
    }
    nextTick(() => {
      vueContext.refs.inputRef[0].focus()
    })
  }
  const blurNameDesc = (auth: any) => {
    saveAuthGroup(auth)
      .then(
        ({ msg }) => {
          initProjectAuths()
        },
        () => {}
      )
      .catch(() => {})
  }

  const deleteAuth = (auth: any) => {
    ElMessageBox.confirm(`确定删除权限组[${auth.name}]吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const res = await deleteAuthGroup(auth.id)
      ElMessage.success(res.msg)
      initProjectAuths()
    })
  }

  onMounted(() => {
    if (props.projectId) {
      initProjectAuths()
    }
  })
</script>
<style lang="scss" scoped>
  .infoBox {
    .title {
      font-size: 18px;
    }
    width: 100%;
    height: 900px;
    padding: 5px;
    margin: 10px;
    overflow: scroll;
  }

  .authName {
    display: flex;
    align-items: center;
    justify-content: start;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    span {
      //margin-left: 10px;
    }
  }

  .authDesc {
    display: flex;
    align-items: center;
    justify-content: start;
    color: darkgray;
    span {
      //margin-left: 10px;
    }
    cursor: pointer;
  }

  .dataRow {
    margin-bottom: 20px;
  }

  .authListBox {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    justify-content: space-around;
    .item {
      width: 780px;
      height: 700px;
      padding: 14px;
      margin: 10px 0; /* 间距也可以根据实际情况调整 */
      p {
        margin-left: 12px;
        font-size: 16px;
        font-weight: bold;
      }
      span {
        font-size: 14px;
        color: rgb(146, 146, 142);
      }
    }
  }
</style>
