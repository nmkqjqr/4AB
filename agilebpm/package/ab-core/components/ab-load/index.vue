<template><span></span></template>
<script lang="ts">
  export default { name: 'AbLoad' }
</script>

<script lang="ts" setup>
  import { request } from '~/agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'

  import { ElLoading } from 'element-plus'

  const props = defineProps({
    /**
     * 获取数据请求的url
     */
    url: { required: true, type: String },
    /**
     * 赋值目标对象
     */
    modelValue: { required: true, type: Object },
    /**
     * 请求方式 get
     */
    getParam: { required: false, default: null, type: String },
    /**
     * 请求方式 默认post
     */
    postParam: { required: false, default: null, type: Object }, // 请求方式 默认post
    /**
     * document.querySelector以获取到对应 DOM 节点
     */
    loadingTarget: { default: 'section', type: String },
    /**
     * 加载数据为空时是否设值，默认否
     */
    dataNullable: { default: false, type: Boolean },
  })
  const emit = defineEmits(['afterFn', 'update:modelValue'])
  const { proxy } = abTools.useCurrentInstance()
  let params = abUtil.clone(props.postParam)
  if (!params) {
    params = Object.assign(proxy.$route.params, proxy.$route.query)
  }
  if (!params.$add) {
    let loading: any = false
    loading = ElLoading.service({
      target: props.loadingTarget,
      background: 'rgba(0, 0, 0, 0)',
    })
    let rtn
    //默认用get和id去获取
    if (!props.getParam && !props.postParam && params && params.id) {
      // 如果为Id，且不存在参数拼接则默认拼接
      const url = props.url.indexOf('?') != -1 ? props.url : `${props.url}?id=`
      rtn = request({
        url: url + params.id,
        method: 'get',
      })
    }
    // 如：<ab-load v-model="data.user" :get-param="data.id" url="getUserById?key=" />
    else if (props.getParam) {
      rtn = request({
        url: props.url + props.getParam,
        method: 'get',
      })
    } else if (props.postParam) {
      rtn = request({
        url: props.url,
        method: 'post',
        params: params,
      })
    }

    if (rtn) {
      rtn.then(
        ({ data }) => {
          if (data || props.dataNullable) {
            emit('update:modelValue', data)
          }
          emit('afterFn', data)

          if (loading) {
            loading.close()
          }
        },
        (e) => {
          if (loading) {
            loading.close()
          }
        }
      )
    } else {
      if (loading) {
        loading.close()
      }
    }
  }
</script>
