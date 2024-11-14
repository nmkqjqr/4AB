<template>
  <span class="showStyle" @click="showDetailFn(props.data.value)">
    <span v-if="props.selectType === 'user'">
      <el-avatar v-if="props.data.photo" class="iconImg" :size="25">
        <img
          :src="sysApi.sysFile.getViewFileUrl(props.data.photo)"
          style="width: 100%; height: 100%"
        />
      </el-avatar>
      <el-avatar
        v-else
        class="iconImg"
        :size="25"
        style="background-color: rgb(240, 171, 87)"
      >
        {{ props.data.label.charAt(0) }}
      </el-avatar>
    </span>
    <span v-else-if="icon">
      <svg-icon
        class="iconImg"
        class-name="imag"
        :icon="icon"
        style="width: 28px; height: 24px"
      />
    </span>
    <span class="spanText">{{ props.data.label }}</span>
    <slot></slot>
  </span>
  <!--详情展示区域-->
  <el-dialog
    :append-to-body="true"
    :before-close="
      () => {
        pageData.show = false
      }
    "
    :destroy-on-close="true"
    :model-value="pageData.show"
    :title="$abT('abform.customDialog.dataDetail', '数据详情')"
    width="65%"
  >
    <div style="width: 100%; overflow: auto">
      <cust-form
        v-if="pageData.formData.html"
        ref="abFormRef"
        :form-data="pageData.formData"
      />
    </div>
    <template #footer>
      <el-button type="primary" @click="pageData.show = false">
        {{ $abT('page.common.ok', '确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { svgIcon } from '@ab-core'
  import { bizApi, sysApi } from '~/agilebpm/api'
  import custForm from '../index.vue'
  import { abT } from '@/i18n'

  const props = defineProps({
    selectType: {
      type: String,
      default: 'custom',
    },
    icon: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      required: true,
    },
    formCode: { type: String, required: true },
    showDetail: { type: Boolean, default: false },
  })

  const pageData = reactive({
    show: false,
    formData: {} as CustFormData,
  })

  const icon = computed(() => {
    if (props.selectType === 'custom' || props.icon) {
      return props.icon
    }

    if (props.selectType === 'role') return 'circle'
    if (props.selectType === 'post') return 'customer'
    if (props.selectType === 'org') return 'org'
    return ''
  })

  //通过点击的index 来获取dataId
  const showDetailFn = (idValue: string) => {
    if (!props.showDetail) {
      return
    }
    getFormData(props.formCode, idValue)
  }

  const getFormData = async (formCode: any, dataId: any) => {
    // 获取在线表单后，再渲染在线表单
    await bizApi.bizForm
      .getFormData(formCode, dataId, true)
      .then((res: any) => {
        if (res.isOk && res.data) {
          const data = res.data
          const form = data.bizForm
          const formData = {
            html: form.html,
            js: form.js,
            data: data.data,
            tablePermission: data.tablePermission,
            permission: data.permission,
            initData: data.initData,
            boLoadMap: data.boLoadMap,
            permissionType: data.permissionType,
            permissionValue: data.permissionValue,
          }
          pageData.formData = formData
          pageData.show = true
        } else {
          ElMessage.error(
            abT(
              'abform.customDialog.getFormDataFail',
              '获取表单数据失败，请联系管理员'
            )
          )
        }
      })
  }
</script>

<style lang="scss" scoped>
  .showStyle {
    display: inline-block;
    float: left;
    padding: 1px 6px;
    margin: 4px;
    overflow: hidden;
    font-size: 14px;
    cursor: pointer;
    background-color: #f1f1f1;
    border-radius: 5px;
    .iconImg {
      float: left;
      margin-top: 3px;
      margin-right: 3px;
      //background-color: rgb(240, 171, 87);
    }
    .spanText {
      float: left;

      line-height: 32px;
      // margin: 0px 0 0 4px;
    }
  }
</style>
