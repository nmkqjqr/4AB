<template>
  <div class="comprehensive-table-container">
    <div class="systemListBox">
      <template v-for="(item, index) in lists" :key="item">
        <el-card
          v-if="item.imgUrl"
          :body-style="{ padding: '0px' }"
          class="item"
          shadow="hover"
        >
          <div style="display: flex; align-items: center">
            <img :src="item.imgUrl" width="40" />
            <p>{{ item.name }}</p>
          </div>
          <div style="margin-top: 12px">
            <div
              style="
                display: -webkit-box;
                height: 50px;
                overflow: hidden;
                line-height: 16px;
                text-overflow: ellipsis;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
              "
            >
              <span>{{ item.desc }}</span>
            </div>
            <div class="bottom" style="overflow: hidden; margin-top: 10px">
              <el-switch
                v-if="info.codes.indexOf(item.code) < 0 && item.isOpen"
                v-model="item.isEnable"
                active-text="启用"
                :disabled="item.isDisabled || !item.isOpen"
                inactive-text="禁用"
                inline-prompt
                :loading="item.loading"
                style="
                  --el-switch-on-color: #13ce66;
                  --el-switch-off-color: #ff4949;
                  float: left;
                "
                @change="changeSwitch(item)"
              />
              <el-button
                link
                style="margin-top: 5px; float: right"
                :type="item.isOpen ? 'primary' : 'success'"
                @click="edit(item)"
              >
                {{ item.isOpen ? '编辑' : '开启' }}
              </el-button>
            </div>
          </div>
        </el-card>
      </template>
    </div>

    <loginPolicy
      v-if="info.code === 'loginPolicy'"
      :model-value="info.concurrent"
      :show-dialog="info.code === 'loginPolicy'"
      @close-fn="closeFn"
    />

    <passwordPolicy
      v-if="info.code === 'passwordPolicy'"
      :model-value="info.concurrent"
      :show-dialog="info.code === 'passwordPolicy'"
      @close-fn="closeFn"
    />

    <personalization
      v-if="info.code === 'companyConfig'"
      :model-value="info.concurrent"
      :show-dialog="info.code === 'companyConfig'"
      @close-fn="closeFn"
    />

    <mailSendConfig
      v-if="info.code === 'mailSendConfig'"
      :model-value="info.concurrent"
      :show-dialog="info.code === 'mailSendConfig'"
      @close-fn="closeFn"
    />

    <dingTalk
      v-if="info.code === 'dingTalk'"
      :model-value="info.concurrent"
      :show-dialog="info.code === 'dingTalk'"
      @close-fn="closeFn"
    />

    <workWeChat
      v-if="info.code === 'qywx'"
      :model-value="info.concurrent"
      :show-dialog="info.code === 'qywx'"
      @close-fn="closeFn"
    />

    <aliyunConfig
      v-if="info.code === 'aliyunConfig'"
      :model-value="info.concurrent"
      :show-dialog="info.code === 'aliyunConfig'"
      @close-fn="closeFn"
    />

    <flowConf
      v-if="info.code === 'flowConf'"
      :model-value="info.concurrent"
      :show-dialog="info.code === 'flowConf'"
      @close-fn="closeFn"
    />
    <baiDuAi
      v-if="info.code === 'baiduAi'"
      :model-value="info.concurrent"
      :show-dialog="info.code === 'baiduAi'"
      @close-fn="closeFn"
    />
    <aMap
      v-if="info.code === 'aMap'"
      :model-value="info.concurrent"
      :show-dialog="info.code === 'aMap'"
      @close-fn="closeFn"
    />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  import passwordPolicy from './properties/passwordPolicy.vue'
  import loginPolicy from './properties/loginPolicy.vue'
  import personalization from './properties/personalization.vue'
  import mailSendConfig from './properties/mailSendConfig.vue'
  import dingTalk from './properties/dingTalk.vue'
  import workWeChat from './properties/workWeChat.vue'
  import aliyunConfig from './properties/aliyunConfig.vue'
  import flowConf from './properties/flowConf.vue'
  import baiDuAi from './properties/baiDuAi.vue'
  import aMap from './properties/aMap.vue'
  import { sysApi } from '~/agilebpm'

  const lists = ref<ListItem[]>([])
  const loading = ref(true)
  const info = reactive({
    code: '',
    lists: [] as any,
    concurrent: {},
    codes: ['loginPolicy', 'passwordPolicy', 'companyConfig', 'flowConf'],
  })
  interface ListItem {
    imgUrl: string
    name: string
    desc: string
    code: string
    isOpen: boolean
    isEnable: boolean
    isDisabled: boolean
    loading: boolean
  }

  const codes =
    'loginPolicy,passwordPolicy,companyConfig,mailSendConfig,dingTalk,qywx,aliyunConfig,flowConf,baiduAi,aMap'
  onMounted(() => {
    lists.value = [
      {
        imgUrl: require('@/assets/sysSecurity_images/dl.png'),
        name: '登录安全策略',
        desc: '用于防止暴力破解密码，强制用户修改密码等',
        code: 'loginPolicy',
        isOpen: false,
        isEnable: true,
        isDisabled: true,
        loading: false,
      },
      {
        imgUrl: require('@/assets/sysSecurity_images/pwd.png'),
        name: '密码安全策略',
        desc: '密码强度要求，密码有效期，以及是否允许自动找回密码等',
        code: 'passwordPolicy',
        isOpen: false,
        isEnable: true,
        isDisabled: true,
        loading: false,
      },
      {
        imgUrl: require('@/assets/sysSecurity_images/gxh.png'),
        name: '系统个性化',
        desc: '配置系统名，LOGO，公司名，水印',
        code: 'companyConfig',
        isOpen: false,
        isEnable: true,
        isDisabled: true,
        loading: false,
      },
      {
        imgUrl: require('@/assets/sysSecurity_images/flowConfig.png'),
        name: '流程全局配置',
        desc: '流程全局配置，如：定时启动间隔、催办重试次数、连续处理任务、流程非默认按钮、每日任务提醒等配置',
        code: 'flowConf',
        isOpen: false,
        isEnable: true,
        isDisabled: true,
        loading: false,
      },
      {
        imgUrl: require('@/assets/sysSecurity_images/email.png'),
        name: '邮件发送配置',
        desc: '配置邮箱服务信息',
        code: 'mailSendConfig',
        isOpen: false,
        isEnable: false,
        isDisabled: false,
        loading: false,
      },
      {
        imgUrl: require('@/assets/sysSecurity_images/dingding.png'),
        name: '钉钉对接',
        desc: '钉钉免登集成，钉钉组织同步，钉钉免登，卡片消息推送',
        code: 'dingTalk',
        isOpen: false,
        isEnable: false,
        isDisabled: false,
        loading: false,
      },
      {
        imgUrl: require('@/assets/sysSecurity_images/qywx.png'),
        name: '企业微信对接',
        desc: '企业微信免登，消息推送',
        code: 'qywx',
        isOpen: false,
        isEnable: false,
        isDisabled: false,
        loading: false,
      },
      {
        imgUrl: require('@/assets/sysSecurity_images/aliyun.png'),
        name: '阿里云配置',
        desc: '阿里云相关配置',
        code: 'aliyunConfig',
        isOpen: false,
        isEnable: false,
        isDisabled: false,
        loading: false,
      },
      {
        imgUrl: require('@/assets/sysSecurity_images/baiduai.png'),
        name: '百度AI配置',
        desc: '用于OCR文字识别等功能',
        code: 'baiduAi',
        isOpen: false,
        isEnable: false,
        isDisabled: false,
        loading: false,
      },
      {
        imgUrl: require('@/assets/sysSecurity_images/aMap.png'),
        name: '高德地图配置',
        desc: '高德地图API相关配置',
        code: 'aMap',
        isOpen: false,
        isEnable: false,
        isDisabled: false,
        loading: false,
      },
    ]
    loading.value = false
    sysApi.configuration.getSysProperties(codes).then(({ data }) => {
      if (data && data.length > 0) {
        data.forEach(
          (item: {
            code: string
            name: string
            desc: string
            enable: boolean
          }) => {
            lists.value.forEach(
              (it: {
                code: string
                name: string
                desc: string
                isOpen: boolean
                imgUrl: string
                isEnable: boolean
              }) => {
                if (it.code == item.code) {
                  if (item.name) {
                    it.name = item.name
                  }
                  if (item.desc) {
                    it.desc = item.desc
                  }
                  it.isEnable = item.enable
                  it.isOpen = true
                }
              }
            )
          }
        )
      }
    })
  })

  const changeSwitch = (item: any) => {
    loading.value = false
    sysApi.configuration.changeEnableByCode(item.code).then((data) => {
      if (data.isOk) {
        loading.value = true
        if (item.isEnable) {
          if (item.code == 'qywx' || item.code == 'dingTalk') {
            lists.value.forEach((it: { code: string; isEnable: boolean }) => {
              if (item.code == 'qywx' && it.code == 'dingTalk') {
                it.isEnable = false
              }
              if (item.code == 'dingTalk' && it.code == 'qywx') {
                it.isEnable = false
              }
            })
          }
        }
      }
    })
  }

  const closeFn = (flg: boolean) => {
    info.code = ''
    info.concurrent = {}
    if (flg) {
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
  }
  const edit = (item: any) => {
    console.log('item', item)
    info.code = item.code
    info.concurrent = item
  }
</script>
<style lang="scss" scoped>
  .systemListBox {
    display: grid;
    grid-template-columns: repeat(auto-fill, 320px);
    grid-gap: 20px;
    justify-content: space-around;
    .item {
      width: 320px;
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
