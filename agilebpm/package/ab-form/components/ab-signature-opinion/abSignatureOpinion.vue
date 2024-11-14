<template>
  <div>
    <!-- 数据展示   -->
    <el-row
      v-for="(item, index) in info.opinions"
      :key="index"
      style="
        padding-top: 5px;
        margin-bottom: 2px;
        border-bottom: 1px dashed #aaa;
      "
    >
      <!-- 意见展示    -->
      <el-col v-if="item.text" :span="item.imageUrl ? 18 : 24">
        <span
          v-if="item.text && props.permission !== 'n'"
          style="
            display: block;
            overflow: hidden;
            font-size: 16px;
            color: #333;
            word-wrap: break-word;
            white-space: pre-wrap;
          "
          v-html="item.text"
        ></span>
      </el-col>

      <el-col
        v-if="item.imageUrl"
        :span="item.text ? 6 : 24"
        style="min-width: 100px; min-height: 60px"
      >
        <el-image
          v-if="item.imageUrl && props.permission !== 'n'"
          :alt="$abT('abform.signatureOpinion.sign','签字')"
          :src="item.imageUrl"
          style="width: 100px; height: 60px"
        />
      </el-col>

      <span
        style="
          margin-bottom: 5px;
          margin-left: auto;
          font-size: 14px;
          color: blue;
        "
      >
        {{ item.userName }} {{ item.time }}
      </span>
      <el-button
        v-if="
          !item.disabled &&
          (props.permission === 'w' || props.permission === 'b')
        "
        icon="Edit"
        link
        style="margin-bottom: 5px; margin-left: 5px"
        :title="$abT('page.common.edit','编辑')"
        type="primary"
        @click="editFn(item, index)"
      >
        {{ $abT('page.common.edit','编辑') }}
      </el-button>

      <el-button
        v-if="
          !item.disabled &&
          (props.permission === 'w' || props.permission === 'b')
        "
        icon="Delete"
        link
        style="margin-bottom: 5px; margin-left: 5px"
        :title="$abT('page.common.del','删除')"
        type="danger"
        @click="removeFn(index)"
      >
        {{ $abT('page.common.del','删除') }}
      </el-button>
    </el-row>

    <!-- 数据写入   -->
    <el-row v-show="props.permission === 'w' || props.permission === 'b'">
      <el-col :span="24" style="width: 100%">
        <!--  文本输入框      -->
        <el-input
          v-show="info.isEdit && props.patternType !== 'signature'"
          v-model="info.editText"
          :autosize="{ minRows: 3, maxRows: 10 }"
          :placeholder="$abT('abform.signatureOpinion.enterOpinion','请输入意见')"
          style="padding-top: 5px; margin-bottom: 5px"
          type="textarea"
        />

        <!--    图片展示   -->
        <el-image
          v-if="info.imageUrl && props.permission !== 'n'"
          :alt="$abT('abform.signatureOpinion.sign','签字')"
          :src="info.imageUrl"
          style="width: 100px; height: 60px"
        />

        <!--  签字按钮      -->
        <el-button
          v-if="props.patternType !== 'command'"
          v-show="info.isEdit"
          icon="Edit"
          link
          style="margin-bottom: 10px"
          :title="$abT('abform.signatureOpinion.sign','签字')"
          type="primary"
          @click="showMadel()"
        >
          {{ $abT('abform.signatureOpinion.sign','签字') }}
        </el-button>
      </el-col>

      <el-row v-show="props.patternType !== 'signature'">
        <el-col :span="24">
          <ab-daily-phrases
            v-show="info.isEdit"
            style="margin-top: 5px"
            @set-daily-phrases="setOpinionFn"
          />
        </el-col>
      </el-row>

      <el-col
        :span="24"
      >
        <!-- 打开编辑框   -->
        <el-button
          v-show="!info.showEdit"
          :disabled="props.disabled"
          icon="Plus"
          link
          :title="$abT('abform.signatureOpinion.signApprove','签批')"
          type="primary"
          @click="addSignatureOpinion()"
        >
          {{
            props.patternType === 'command'
              ?  $abT('abform.signatureOpinion.instructions','批示')
              : props.patternType === 'signature'
              ? $abT('abform.signatureOpinion.autograph','签名')
              : $abT('abform.signatureOpinion.signApprove','签批')
          }}
        </el-button>

        <!--  提交      -->
        <el-button
          v-show="info.isEdit"
          icon="Check"
          link
          :title="$abT('page.common.submit','提交')"
          type="success"
          @click="addText()"
        >
          {{ $abT('page.common.submit','提交') }}
        </el-button>

        <!--  取消      -->
        <el-button
          v-show="info.isEdit"
          icon="Close"
          link
          :title="$abT('page.common.cancel','取消')"
          type="danger"
          @click="closeFn()"
        >
          {{ $abT('page.common.cancel','取消') }}
        </el-button>
      </el-col>
    </el-row>

    <!-- 签名弹出框   -->
    <el-dialog v-model="info.drawing" :title="$abT('abform.signatureOpinion.sign','签字')" width="660px">
      <canvas
        v-if="info.drawing"
        :canvas-id="props.columnName"
        :class="props.columnName"
        height="360"
        width="600"
      ></canvas>

      <template #footer>
        <el-button
          v-if="!props.onlyWrite"
          type="primary"
          @click="getSignature()"
        >
          {{ $abT('abform.signatureOpinion.obtainexistSignature','获取已有签名') }}
        </el-button>
        <el-button type="primary" @click="saveSignautreFn()">{{ $abT('page.common.save','保存') }}</el-button>
        <el-button type="warning" @click="info.drawing = false">{{ $abT('page.common.cancel','取消') }}</el-button>
        <el-button @click="undoFn()">{{ $abT('page.common.revoke','撤销') }}</el-button>
        <el-button @click="clearFn()">{{ $abT('page.common.clear','清除') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import SignaturePad from 'signature_pad'
  import { Plus, Edit, Delete } from '@element-plus/icons-vue'
  import { signatureOpinionProps } from './abSignatureOpinion'
  import { request, sysApi, abStoreAdaptor } from '~/agilebpm'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import AbDailyPhrases from './components/ab-daily-phrases.vue'
  import {abT} from "@/i18n";

  // 是否只读展示纯文本
  const props = defineProps(signatureOpinionProps)
  const abFormMananger = inject('abForm') as AbFormProvide
  const actionData = inject('actionData') as any

  //当前用户信息
  const userInfo = abStoreAdaptor().getAbUser
  const currentOrg = abStoreAdaptor().getCurrentOrg
  const emit = defineEmits(['update:modelValue'])
  const readonlyShowText =
    props.readShowText != null
      ? props.readShowText
      : abFormMananger?.readonlyShowText

  const info: any = reactive({
    signatureId: '',
    drawing: false, //签名弹出框
    imageUrl: '',
    localSignaturePad: null,
    config: {
      penColor: '#000000', //笔刷颜色
      minWidth: 3, //最小宽度
    },
    isEdit: false, //是否可编辑数据
    editText: '', //修改文本
    editIndex: '',
    showEdit: false, //是否可添加数据
    modelList: [], //页面的意见内容
    editItem: null,
    opinions: [], //获取的意见内容
    isMounted: false,
    signatureRequired: 'bt',
  })

  const test = () => {
    if (props.modelValue && JSON.parse(props.modelValue).length > 0) {
      info.opinions = JSON.parse(props.modelValue) //页面展示数据
      info.modelList = JSON.parse(props.modelValue)
      info.opinions.forEach((item: { disabled: boolean; userId: string }) => {
        item.disabled = true //默认 不可编辑的
        if (userInfo && item.userId === userInfo.userId) {
          item.disabled = false // 自己输入的可以编辑
        }
      })
    }
    checkFn()
    info.isMounted = true
  }

  const checkFn = () => {
    info.isEdit = false
    // 意见控件和签名时 只可以编辑自己的数据
    if (props.patternType === 'signatureOpinion') {
      info.showEdit = false
      //单人只签一次
      if (props.signatureConfig === 'singleOnce' && info.opinions.length > 0) {
        info.showEdit = true
      }
      //多人只签一次
      if (props.signatureConfig === 'moreOnce') {
        info.opinions.forEach((item: { userId: string }) => {
          if (userInfo && item.userId === userInfo.userId) {
            info.showEdit = true
          }
        })
      }

      //单人重复多次
      if (props.signatureConfig === 'singleRepeat') {
        info.opinions.forEach((item: { userId: string }) => {
          if (userInfo && item.userId !== userInfo.userId) {
            info.showEdit = true
          }
        })
      }
    } else {
      info.showEdit = false
    }
  }

  //签批按钮
  const addSignatureOpinion = () => {
    info.showEdit = true
    info.isEdit = true
  }

  //编辑
  const editFn = (item: any, index: number) => {
    info.showEdit = true
    info.isEdit = true
    info.editText = item.text
    info.imageUrl = item.imageUrl
    info.editIndex = index
    info.editItem = item //当前编辑的数据
  }

  //删除
  const removeFn = (index: any) => {
    info.opinions.splice(index, 1)
    info.modelList.splice(index, 1)

    checkFn()
    info.imageUrl = ''
    info.signatureId = ''
    emit('update:modelValue', JSON.stringify(info.modelList))
    abInputField.modelValue = info.modelList
  }

  const setImageUrl = (id: string) => {
    if (id) {
      info.imageUrl = sysApi.sysFile.getViewFileUrl(id)
    }
  }

  //打开弹出框
  const showMadel = () => {
    if (info.localSignaturePad) {
      info.localSignaturePad = null
    }
    info.drawing = true
  }

  //获取画布
  const getCanvas = () => {
    const canvas = document.querySelector(`.${props.columnName}`)
    info.localSignaturePad = new SignaturePad(canvas, info.config)
  }

  //输出图片流
  const dataURItoBlob = (dataURI: string) => {
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0] // mime类型
    const byteString = atob(dataURI.split(',')[1]) //base64 解码
    const arrayBuffer = new ArrayBuffer(byteString.length) //创建缓冲数组
    const intArray = new Uint8Array(arrayBuffer) //创建视图

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i)
    }
    return new Blob([intArray], { type: mimeString })
  }

  //获取当前用户签名
  const getSignature = () => {
    if (userInfo.signature) {
      info.signatureId = userInfo.signature
      setImageUrl(userInfo.signature)
      info.drawing = false
    } else {
      ElMessage.warning(abT('abform.signatureOpinion.noFoundSign','未找到个人签名，请在个人信息中添加。'))
    }
  }

  //保存签名方法
  const saveSignautreFn = () => {
    const isEmpty = info.localSignaturePad.isEmpty()
    if (isEmpty) {
      ElMessage.warning(abT('abform.signatureOpinion.pleaseSign','请签字'))
      return
    }

    const form = new window.FormData()
    const blobData = dataURItoBlob(info.localSignaturePad.toDataURL())
    form.append('file', blobData, `${props.columnName}.png`)
    request({
      url: sysApi.sysFile.uploadUrl,
      method: 'post',
      data: form,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((data: any) => {
      if (data.isOk && data.data) {
        info.signatureId = data.data
        setImageUrl(data.data)
        info.drawing = false
      } else {
        ElMessage.warning(abT('abform.signatureOpinion.saveFailed','保存签名失败。'))
      }
    })
  }

  //签名撤销
  const undoFn = () => {
    const record = info.localSignaturePad.toData()
    if (record) {
      return info.localSignaturePad.fromData(record.slice(0, -1))
    }
  }

  //签名清除
  const clearFn = () => {
    info.localSignaturePad.clear()
  }

  //提交意见方法
  const addText = () => {
    if (!info.editText && props.patternType !== 'signature') {
      ElMessage.error(abT('abform.signatureOpinion.opinionIsEmpty','意见不能为空'))
      return
    }
    if (props.signatureRequired && props.signatureRequired == 'kx') {
      info.signatureRequired = 'kx'
    }
    if (
      info.imageUrl === '' &&
      props.patternType !== 'command' &&
      info.signatureRequired == 'bt'
    ) {
      ElMessage.warning(abT('abform.signatureOpinion.pleaseSign','请签字'))
      return
    }

    const json = {
      text: info.editText,
      userId: userInfo.userId,
      userName: userInfo.fullName,
      orgCode: currentOrg ? currentOrg.groupCode : '',
      orgName: currentOrg ? currentOrg.groupName : '',
      time: new Date().format('yyyy-MM-dd HH:mm'),
      taskId: '',
      imageUrl: info.imageUrl,
    }
    if (actionData) {
      actionData.opinion = info.editText
      json.taskId = actionData.taskId || ''
    }

    if (info.editItem && info.editIndex >= 0) {
      if (info.editItem.text != info.editText) {
        info.opinions[info.editIndex].text = info.editText
        info.modelList[info.editIndex].text = info.editText
      }
      if (info.editItem.imageUrl != info.imageUrl) {
        info.opinions[info.editIndex].imageUrl = info.imageUrl
        info.modelList[info.editIndex].imageUrl = info.imageUrl
      }

      info.editItem = null
    } else {
      info.opinions.push(json)
      info.modelList.push(json)
    }
    info.editText = ''
    info.imageUrl = ''
    info.showEdit = false
    info.isEdit = false

    //检验
    checkFn()
    emit('update:modelValue', JSON.stringify(info.modelList))
    abInputField.modelValue = info.modelList
  }

  //取消
  const closeFn = () => {
    info.editText = ''
    info.imageUrl = ''
    info.showEdit = false
    info.isEdit = false
    checkFn()
  }

  const setOpinionFn = (str: string) => {
    info.editText += str
  }

  //移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
    info.imageUrl = ''
  })

  onMounted(() => {
    //加入表单校验
    AbformValidate.addField2Form(abInputField, props.permission, abFormMananger)
    info.isMounted = false
  })

  /**
   * inputField相关的引用，用于表单abForm
   */
  const abInputField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: props.modelValue ?  props.modelValue : info.modelList,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(abInputField)
  })

  /**
   * 【校验相关】
   */
  const inputBlur = () => {
    AbformValidate.blurValidate(abInputField)
  }

  watch(
    () => props.modelValue,
    (val) => {
      abInputField.modelValue = props.modelValue
      if (info.isMounted) {
        return
      }
      test()
    },
    { immediate: true, deep: true }
  )

  watch(
    () => info.drawing,
    (val) => {
      if (val && !info.localSignaturePad) {
        nextTick(function () {
          getCanvas()
        })
      }
    }
  )

  //动态权限必填切换后，切换校验
  watch(
    () => props.permission,
    (newValue) => {
      // 如果校验 由非必填修改为了必填，此时修改校验功能
      if (newValue && newValue === 'b') {
        AbformValidate.changeRequired(abInputField, true)
      } else {
        AbformValidate.changeRequired(abInputField, false)
      }
    }
  )
</script>
