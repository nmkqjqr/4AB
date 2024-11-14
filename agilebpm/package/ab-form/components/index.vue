<template>
  <ab-form ref="abFormRef">
    <Suspense>
      <CustForm ref="custForm" />
      <template #fallback>
        <div v-loading="true" element-loading-text="HTML 编译异常"></div>
      </template>
    </Suspense>
  </ab-form>
</template>
<script lang="ts" setup>
  import { defineAsyncComponent, PropType } from 'vue'
  import { CustFormBaseImportsUse } from './custFormBaseImports'
  import abForm from './form-base/ab-form.vue'

  const props = defineProps({
    formData: { required: true, type: Object as PropType<CustFormData> },
  })
  provide('actionData', props.formData.actionData)

  // 在线表单动态组件的引用
  const custForm = ref()
  // 在线表单动态组件的引用
  const abFormRef = ref()
  provide('abFormRef', abFormRef)

  // 获取在线表单数据的异步方法
  const getData = (isValidate: boolean) => {
    return Promise.resolve({
      then: async function (resolve: (arg0: any) => void, _reject: any) {
        if (isValidate) {
          // 自定义校验 ====
          if (
            custForm.value.custValid &&
            custForm.value.custValid() === false
          ) {
            // 自定义校验不通过
            resolve(false)
            return
          }
          if (custForm.value.asyncCustValid) {
            const result = await custForm.value.asyncCustValid()
            if (result === false) {
              resolve(false)
              return
            }
          }
          // 自定义校验 end ====

          abFormRef.value.doValidate(true, '').then((result: any) => {
            // 表單校驗不通過
            if (result !== true) {
              // 异常提示 调用内部已经提示啦
              resolve(false)
            } else {
              const data = custForm.value.data
              resolve(data)
            }
          })
        } else {
          const data = custForm.value.data
          resolve(data)
        }
      },
    })
  }
  /**
   * 【在线表单组件实现入口】
   * 异步加载在线表单，并且继承 CustFormCommonUse 在线表单组件
   */
  const CustForm = defineAsyncComponent({
    loader: () => {
      return new Promise((resolve, _reject) => {
        // 通过在线表单Data 渲染页面
        ;(window as any).custFormComponentMixin = {}

        if (props.formData.js) {
          try {
            eval(props.formData.js)
          } catch (e) {
            //@ts-ignore
            e.message = `JavaScript 脚本异常 ${e.message}`
            throw e
          }
        }
        // 表单BASE组件(负责组件引入，最通用 function 定义 ) 并继承 服务器的表单 JS 部分
        CustFormBaseImportsUse.extends = (window as any).custFormComponentMixin
        // 在线表单组件返回
        const onlineForm = {
          extends: CustFormBaseImportsUse,
          data() {
            const data = { ...props.formData }
            delete data.html
            delete data.js
            return data
          },
          template: props.formData.html,
        }

        // 返回在线表单组件
        resolve(onlineForm as any)
      })
    },
    onError(error, _retry, _fail, _attempts) {
      console.info(error)
    },
  })

  // 将外部允许调用的方法
  defineExpose({ getData })
</script>

<style lang="scss" scoped>
  .ab-invalid.input {
  }
</style>
