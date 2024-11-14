<template>
  <div>
    <template
      v-if="
        info.username == 'admin' ||
        fullPathUrl.indexOf('formCustSqlPreView') > -1
      "
    >
      <span
        v-for="(item, index) in props.allButton"
        :key="index"
        style="margin-right: 12px"
      >
        <!-- 导入 -->
        <template
          v-if="item.url == `/ab-bpm/biz/bizCustGrid/view/import_${props.code}`"
        >
          <ab-upload-dialog
            :after-save="importSave"
            :after-save-need-download="true"
            :data="info.uploadData"
            :search="queryListFn"
          />
          <el-button
            style="margin-left: 12px"
            type="primary"
            @click="downTemplate(item)"
          >
            {{ $abT('page.common.templateDownload', '模板下载') }}
          </el-button>
        </template>
        <template
          v-else-if="
            item.hrefSetting.openType == 'eventBtn' &&
            item.hrefSetting.isDialogValue &&
            item.hrefSetting.codeValue &&
            item.hrefSetting.codeValue.length > 0
          "
        >
          <ab-cust-dialog
            :dialog-key="item.hrefSetting.codeValue"
            :dialog-setting="{ multiple: false }"
            type="primary"
            @ok="chooseDialog($event, item)"
          >
            {{ item.name }}
          </ab-cust-dialog>
        </template>
        <template
          v-else-if="
            item.hrefSetting.openType &&
            item.hrefSetting.openType == 'abComponent'
          "
        >
          <template
            v-if="
              item.hrefSetting.abComponentName &&
              item.hrefSetting.abComponentName.length > 0
            "
          >
            <component
              :is="item.hrefSetting.abComponentName"
              :data="item"
              :list="info.list"
              @list-fn="queryListFn"
            />
          </template>
        </template>
        <el-button
          v-else
          :loading="item.btnLoading"
          :type="item.btncss"
          @click="clickFn(item)"
        >
          {{ item.name }}
        </el-button>
      </span>
      <el-button
        v-if="
          fullPathUrl.indexOf('formCustSqlPreView') > -1 &&
          info.username == 'admin'
        "
        :loading="info.debuggerBtn"
        type="primary"
        @click="debuggingSql()"
      >
        {{ $abT('page.common.debuggingSQL', '调试SQL') }}
      </el-button>
    </template>
    <template v-else>
      <span
        v-for="(item, index) in props.allButton"
        :key="index"
        style="margin-right: 6px"
      >
        <template
          v-if="item.url == `/ab-bpm/biz/bizCustGrid/view/import_${props.code}`"
        >
          <template v-if="item.joinBtnRight == 0">
            <ab-upload-dialog
              :after-save="importSave"
              :after-save-need-download="true"
              :data="info.uploadData"
              :search="queryListFn"
            />
            <el-button
              style="margin-left: 6px"
              type="primary"
              @click="downTemplate(item)"
            >
              {{ $abT('page.common.templateDownload', '模板下载') }}
            </el-button>
          </template>
          <template v-else>
            <ab-upload-dialog
              :after-save="importSave"
              :after-save-need-download="true"
              :alias="item.alias"
              :data="info.uploadData"
              :join-btn-right="item.joinBtnRight"
              :search="queryListFn"
            />
            <el-button
              v-ab-btn-rights="item.alias"
              style="margin-left: 6px"
              type="primary"
              @click="downTemplate(item)"
            >
              {{ $abT('page.common.templateDownload', '模板下载') }}
            </el-button>
          </template>
        </template>
        <template v-else>
          <span v-if="item.joinBtnRight == 0">
            <template
              v-if="
                item.hrefSetting.openType == 'eventBtn' &&
                item.hrefSetting.isDialogValue &&
                item.hrefSetting.codeValue &&
                item.hrefSetting.codeValue.length > 0
              "
            >
              <ab-cust-dialog
                :dialog-key="item.hrefSetting.codeValue"
                :dialog-setting="{ multiple: false }"
                type="primary"
                @ok="chooseDialog($event, item)"
              >
                {{ item.name }}
              </ab-cust-dialog>
            </template>
            <template
              v-else-if="
                item.hrefSetting.openType &&
                item.hrefSetting.openType == 'abComponent'
              "
            >
              <template
                v-if="
                  item.hrefSetting.abComponentName &&
                  item.hrefSetting.abComponentName.length > 0
                "
              >
                <component
                  :is="item.hrefSetting.abComponentName"
                  :data="item"
                  :list="info.list"
                  @list-fn="queryListFn"
                />
              </template>
            </template>
            <el-button
              v-else
              :loading="item.btnLoading"
              :type="item.btncss"
              @click="clickFn(item)"
            >
              {{ item.name }}
            </el-button>
          </span>
          <span v-else>
            <template
              v-if="
                item.hrefSetting.openType == 'eventBtn' &&
                item.hrefSetting.isDialogValue &&
                item.hrefSetting.codeValue &&
                item.hrefSetting.codeValue.length > 0
              "
            >
              <ab-cust-dialog
                v-ab-btn-rights="item.alias"
                :dialog-key="item.hrefSetting.codeValue"
                :dialog-setting="{ multiple: false }"
                type="primary"
                @ok="chooseDialog($event, item)"
              >
                {{ item.name }}
              </ab-cust-dialog>
            </template>
            <template
              v-else-if="
                item.hrefSetting.openType &&
                item.hrefSetting.openType == 'abComponent'
              "
            >
              <template
                v-if="
                  item.hrefSetting.abComponentName &&
                  item.hrefSetting.abComponentName.length > 0
                "
              >
                <component
                  :is="item.hrefSetting.abComponentName"
                  v-ab-btn-rights="item.alias"
                  :data="item"
                  :list="info.list"
                  @list-fn="queryListFn"
                />
              </template>
            </template>
            <el-button
              v-else
              v-ab-btn-rights="item.alias"
              :loading="item.btnLoading"
              :type="item.btncss"
              @click="clickFn(item)"
            >
              {{ item.name }}
            </el-button>
          </span>
        </template>
      </span>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { abTools, abUploadDialog } from '~/agilebpm'
  import { bizApi, postData } from '~/agilebpm/api'
  import useAbStoreAdapter from '../../../api/ab-store'
  import { abT } from '@/i18n'
  const abUser = useAbStoreAdapter().getAbUser
  const emit = defineEmits(['update:modelValue', 'hrefSet', 'queryListFn'])
  const props = defineProps({
    allButton: { required: true, type: Object }, // 赋值目标对象
    data: { required: true, type: Object }, // 赋值目标对象
    list: { required: true, type: Object }, // 赋值目标对象
    templateSelection: { required: false, type: Object },
    multipleSelection: { required: false, type: Object },
    query: { type: Object },
    code: { type: String },
  })
  const info: any = reactive({
    data: props.data,
    list: props.list,
    debuggerBtn: false,
    username: abUser.username,
    uploadData: {},
  })

  const { proxy } = abTools.useCurrentInstance()
  const fullPathUrl = proxy.$route.fullPath

  props.allButton.forEach((item: any) => {
    if (item.url == `/ab-bpm/biz/bizCustGrid/view/import_${props.code}`) {
      info.uploadData = {
        url: `/ab-bpm/biz/bizCustGrid/view/import_${props.code}`,
        tip: '导入数据',
        btnText: item.name,
        alias: item.alias,
        customImport:
          item.expand && item.expand.customImport
            ? item.expand.customImport
            : false,
      }
    }
  })
  const queryListFn = () => {
    emit('queryListFn')
  }

  // 点击全局按钮
  const clickFn = (item: any) => {
    // 是否必选
    if (item.mustSelect == 1) {
      // 单选判断是否选中
      if (info.data.chooseType === 1) {
        if (JSON.stringify(props.templateSelection) === '{}') {
          ElMessage({
            message: abT('page.common.pleaseSelectData','请选择数据'),
            type: 'warning',
          })
          return false
        }
      }
      // 多选判断是否选中
      if (info.data.chooseType === 2) {
        if (props.multipleSelection.length <= 0) {
          ElMessage({
            message: abT('page.common.pleaseSelectData','请选择数据'),
            type: 'warning',
          })
          return false
        }
      }
    }
    // 是否有提醒内容
    emit('hrefSet', item, props.multipleSelection)
  }

  // setquery
  const setQuery = () => {
    const queryData: any = []
    info.data.sqlConditionVOS.forEach((item: any, index: any) => {
      if (item.val && item.val.length > 0) {
        queryData.push({
          name: item.tableAlias
            ? `${item.tableAlias}.${item.fieldName}`
            : item.fieldName,
          con: item.cntype,
          val: item.val,
        })
      }
    })
    return queryData
  }
  const debuggingSql = () => {
    info.debuggerBtn = true
    props.query.queryData = setQuery()
    postData(bizApi.custGrid.debuggerUrl + props.code, props.query).then(
      (result) => {
        ElMessageBox.alert(
          abT('page.common.pleaseOpenF','请打开f12查看network或者console控制台'),
          abT('page.common.promptInformation','提示信息'),
          {
            confirmButtonText: 'OK',
            callback: (action: any) => {},
          }
        )
        info.debuggerBtn = false
      },
      () => {
        info.debuggerBtn = false
      }
    )
  }

  const downTemplate = (item: any) => {
    bizApi.custGrid
      .exportTemplateUrl(info.data.code, { btnCode: item.alias })
      .then(
        (result) => {
          abTools.downImgFile(`${info.data.name} - 导入模板.xls`, result)
        },
        () => {}
      )
  }

  const importSave = (result: any) => {
    if (result.size == 0) {
      ElMessage({
        message: abT('page.common.importFailed', ' 导入成功'),
        type: 'success',
      })
    } else {
      ElMessage({
        message: '部分导入失败',
        type: 'error',
      })
      abTools.downImgFile(`失败数据.xls`, result)
    }
  }

  // 点击操作对话框
  const chooseDialog = (list: any, item: any) => {
    if (props.multipleSelection.length <= 0) {
      ElMessage({
        message: abT('page.common.pleaseSelectData','请选择数据'),
        type: 'error',
      })
      return false
    }
    if (item.hrefSetting.dialogList && item.hrefSetting.dialogList.length > 0) {
      item.hrefSetting.dialogList.forEach((dialogItem: any) => {
        const result = item.hrefSetting.returnFields.some(
          (ele) => ele.returnName == dialogItem.value2
        ) //true
        // 判断是固定值还是对话框返回值
        if (result) {
          dialogItem.value = list[0][dialogItem.value2]
        } else {
          dialogItem.value = dialogItem.value2
        }
      })
      let itemList
      let ids = ''
      // 多选判断是否选中
      if (info.data.chooseType === 2) {
        itemList = props.multipleSelection
      }
      if (itemList && itemList.length > 0) {
        itemList.forEach((it: any) => {
          ids = `${ids + it[item.hrefSetting.dataChangeRelWatchField]},`
        })
        ids = ids.substring(0, ids.length - 1)
      }
      let data = {}
      data = {
        refreshFieldList: item.hrefSetting.dialogList,
        buttonAliasStr: item.alias,
        ids: ids,
      }
      // 新配置 值增强
      postData(
        `${bizApi.custGrid.changeDataStatus}/${info.data.code}`,
        data
      ).then(({ data, msg }) => {
        if (data) {
          ElMessage({
            showClose: true,
            message: msg,
            type: 'success',
          })
        } else {
          ElMessage({
            showClose: true,
            message: abT('page.common.operateFailed','操作失败'),
            type: 'error',
          })
        }
        queryListFn()
      })
    }
  }
</script>
