<template>
  <el-button
    :disabled="disabled"
    :icon="Check"
    :loading="info.loading"
    type="primary"
    @click="submitForm()"
  >
    {{ text || $abT('page.common.save', '保存') }}
  </el-button>
  <slot></slot>
  <el-button v-if="backBtn" :icon="Back" @click="back">
    {{ $abT('page.common.back', '返回') }}
  </el-button>

  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    title="提示"
    width="600px"
  >
    <span v-if="info.isAdd">保存成功，继续以下哪种操作</span>
    <span v-else>保存成功，是否继续操作</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="info.isAdd" text type="primary" @click="add">
          {{ $abT('page.common.add', '添加') }}
        </el-button>
        <el-button text type="primary" @click="edit">
          <span v-if="info.isAdd">{{ $abT('page.common.edit', '编辑') }}</span>
          <span v-else>{{ $abT('page.common.ok', '确定') }}</span>
        </el-button>
        <el-button text type="primary" @click="back">
          {{ $abT('page.common.back', '返回') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { Back, Check } from '@element-plus/icons-vue'
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { PropType, defineComponent, reactive, watch } from 'vue'
  import { getDataUrl, postData } from './../../../../api/ab-request'
  import * as abTools from './../../../../utils/ab-tools'
  import { abT } from '@/i18n'
  export default defineComponent({
    name: 'AbSave',
    props: {
      //是否禁用保存按钮
      disabled: { default: false, type: Boolean },
      // 表单引用
      formRef: {
        required: false,
        default: null,
        type: Object as PropType<FormInstance>,
      },
      // 是否展示loading
      showLoading: { default: true, type: Boolean },
      // 保存的数据
      saveData: { required: true, type: Object },
      // url 地址
      url: { required: true, type: String },
      // 保存前置function
      beforeSaveFn: { required: false, type: Function, default: null },
      // 保存后 function，如果返回 false，则不继续关闭页面操作，可用于自定义保存提示，自定义页面跳转等逻辑
      afterSaveFn: { required: false, type: Function, default: null },
      // 点击保存后通过了验证 但是有其他需要验证的表单
      validAfterFn: { required: false, type: Function, default: null },
      //“保存的数据 saveData”的主键key
      idKey: {
        type: String,
        default: 'id',
      },
      //是否显示返回按钮
      backBtn: {
        type: Boolean,
        default: true,
      },
      /**
       * 返回的路由name
       */
      backName: {
        type: String,
        default: null,
      },
      /**
       * 编辑时是否刷新页面
       * 不刷新时只会弹框提示
       */
      editRefresh: {
        type: Boolean,
        default: false,
      },
      /**
       * 保存后停留在当前页
       */
      afterSaveStay: {
        type: Boolean,
        default: false,
      },
      /**
       * 保存按钮的文本
       */
      text: {
        type: String,
      },
      // 点击返回执行其他操作
      backOtherFn: { required: false, type: Function, default: null },
      custom: {
        type: Boolean,
        default: false,
      },
      urlParam: { required: false, type: Object, default: null },
    },
    // 保存成功后事件
    emits: ['afterSave'],

    setup(props, context) {
      const info = reactive({
        loading: false,
        dialogVisible: false,
        serveData: null, //服务器返回的数据
        isAdd: false,
      })
      info.isAdd = !props.saveData[props.idKey]
      //可能异步加载，所以要监控
      watch(
        () => props.saveData,
        () => {
          info.isAdd = !props.saveData[props.idKey]
        }
      )

      const submitForm = async () => {
        // 如果存在前置事件，且返回值等于 false return
        if (props.beforeSaveFn) {
          const r = props.beforeSaveFn()
          if (typeof r === 'boolean') {
            if (!r) return
          } else if (r instanceof Promise) {
            if ((await r) === false) return
          }
        }

        if (!props.formRef) {
          save()
          return
        }

        props.formRef.validate((valid) => {
          if (!valid) {
            ElMessage({
              showClose: true,
              message: abT('page.common.completeForm', '请完善表单！'),
              type: 'warning',
            })
            info.loading = false
            return
          }
          // 新加通过校验后，如果需要校验其他表单或者内容
          if (props.validAfterFn) {
            const r = props.validAfterFn()
            if (typeof r === 'boolean') {
              if (!r) return
            }
          }
          save()
        })
      }

      const save = () => {
        info.loading = true
        const url = getDataUrl(props.url, props.urlParam)

        const rtn = postData(url, props.saveData)

        rtn
          .then(
            ({ data, message }) => {
              message = message || '保存成功'
              info.serveData = data
              // 事件方式，始终都不会阻碍 提示返回页面
              context.emit('afterSave', data)
              // 用户自定义 提示逻辑
              if (props.afterSaveFn) {
                if (false === props.afterSaveFn(data)) return
              }

              if (props.afterSaveStay) {
                if (info.isAdd) {
                  info.dialogVisible = true
                } else {
                  ElMessage({
                    showClose: true,
                    message: message,
                    type: 'success',
                  })
                  if (props.editRefresh) {
                    $pub('reload-router-view')
                  }
                }
              } else {
                ElMessage({
                  showClose: true,
                  message: message,
                  type: 'success',
                })
                back()
              }

              info.loading = false
            },
            () => {
              info.loading = false
            }
          )
          .catch(() => (info.loading = false))
          .finally(() => (info.loading = false))
      }

      const { proxy } = abTools.useCurrentInstance()
      const $pub: any = inject('$pub')
      const add = () => {
        info.dialogVisible = false
        $pub('reload-router-view')
      }

      const edit = () => {
        info.dialogVisible = false
        //新增的话修改当前id
        if (info.isAdd) {
          const query = {}
          query[props.idKey] = info.serveData
          proxy.$router.push({
            name: proxy.$route.name || '',
            query: query,
          })
        }

        $pub('reload-router-view')
      }

      const back = () => {
        // 如果被内嵌时，抛出个事件让外部人员帮忙关闭
        if (proxy.$route.query.abIframeType == 'iframe') {
          window.parent.postMessage({ type: 'abCloseIframe' }, '*')
          if (proxy.$route.query.outerClose) {
            console.info(`outerClose,不在执行路由返回`)
            return
          }
        }

        if (props.custom) {
          props.backOtherFn()
        } else {
          info.dialogVisible = false
          abTools.closeTab(proxy.$route.path)
          if (props.backName) {
            proxy.$router.push({
              name: props.backName,
            })
          } else {
            proxy.$router ? proxy.$router.back() : window.history.back()
          }
        }
      }

      return { submitForm, info, add, edit, back, Check, Back, save }
    },
  })
</script>
