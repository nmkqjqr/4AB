import { abUtil, abTools } from '~/agilebpm'
// 函数计算
import { formCalculateFunctions } from './form-base/calculateFunctions'
// agileBPM 通用組件庫
import abSubAdd from './form-base/sub-table/ab-sub-add.vue'
import abSubExp from './form-base/sub-table/ab-sub-exp.vue'
import abSubImp from './form-base/sub-table/ab-sub-imp.vue'
import abSubDel from './form-base/sub-table/ab-sub-del.vue'
import abSubMove from './form-base/sub-table/ab-sub-move.vue'
import abSubMoveBtn from './form-base/sub-table/ab-sub-move-btn.vue'
import abSubCopy from './form-base/sub-table/ab-sub-copy.vue'
import abSubSn from './form-base/sub-table/ab-sub-sn.vue'
import abSubScopeTr from './form-base/sub-table/ab-sub-scope-tr.vue'
import abSubTrScope from './form-base/sub-table/ab-sub-tr-scope.vue'
import abSubPage from './form-base/sub-table/ab-sub-page.vue'
import abRequired from './form-base/ab-required.vue'

import abSubScope from './form-base/sub-table/ab-sub-scope.vue'

import abSubDetail from './form-base/sub-table/ab-sub-detail.vue'
import abSubDetailDialog from './form-base/sub-table/ab-sub-detail-dialog.vue'
import abSubEdit from './form-base/sub-table/ab-sub-edit.vue'
import abSubEditDialog from './form-base/sub-table/ab-sub-edit-dialog.vue'
import abSubLoad from './form-base/sub-table/ab-sub-load.vue'

import abFormGroup from './form-base/form-group/ab-form-group.vue'
import abCard from './form-base/ab-card.vue'
import abFormItem from './form-base/form-group/ab-form-item.vue'

import abFormGlobalSetting from './form-base/form-group/ab-form-global-setting.vue'

import abPermission from './form-base/ab-permission'

import { request, postData, getData } from '~/agilebpm/api'

// element 相关原生组件
import {
  ElButtonGroup as abButtonGroup,
  // ElCard as abCard,
  ElButton as abButton,
  ElTag as abTag,
  ElTabs as abTabs,
  ElTabPane as abTabPane,
  ElDivider as abDivider,
  ElAlert as abAlert,
  ElMessage as abMessage,
  ElMessageBox as abMessageBox,
} from 'element-plus'

import abInput from './ab-input/abInput.vue'
import abDate from './ab-date/abDate.vue'
import abRangeDate from './ab-range-date/abRangeDate.vue'
import abMultipleDate from './ab-multiple-date/abMultipleDate.vue'
import abCascader from './ab-cascader/abCascader.vue'
import abCheckboxGroup from './ab-checkbox-group/abCheckboxGroup.vue'
import abDynamicSelect from './ab-dynamic-select/abDynamicSelect.vue'
import abNumber from './ab-number/abNumber.vue'
import abRadioGroup from './ab-radio-group/abRadioGroup.vue'
import abSelect from './ab-select/abSelect.vue'
import abTreeSelect from './ab-tree-select/abTreeSelect.vue'
import abSerialNo from './ab-serial-no/index.vue'
import abSignature from './ab-signature/index.vue'
import abSignatureOpinion from './ab-signature-opinion/abSignatureOpinion.vue'
import abSn from './ab-sn/abSn.vue'
import abSwitch from './ab-switch/abSwitch.vue'
import abRate from './ab-rate/abRate.vue'
import abUpload from './ab-upload/abUpload.vue'
import abCustomDialog from './ab-custom-dialog/abCustomDialog.vue'
import abDataSelector from './ab-data-selector/abDataSelector.vue'

import abTablePlugins from './ab-table-plugins/index.vue'
import abCalculate from './ab-table-plugins/abCalculate.vue'
import abCustomQuery from './ab-table-plugins/abCustomQuery.vue'
import abFlowQuote from './ab-flow-quote/index.vue'
import abQuill from './ab-quill/abQuill.vue'

import abOnlineDoc from './ab-online-doc/abOnlineDoc.vue'
import abFormReference from './ab-form-reference/abFormReference.vue'

import abDynPerm from './ab-table-plugins/abDynPerm.vue'
import abIframe from './ab-iframe/abIframe.vue'
import abSteps from './ab-steps/abSteps.vue'
import abVerificationCode from './ab-verification-code/abVerificationCode.vue'
import abScanTrans from './ab-scan-trans/abScanTrans.vue'
import abOcr from './ab-ocr/abOcr.vue'

import abPosition from './ab-position/abPosition.vue'
// 引入表单主题
import './form-theme/ab-form-style.scss'

import abBtnForm from './ab-btn-form/abBtnForm.vue'

/**
 * 在线表单通用的方法承载位置
 */

export const CustFormBaseImportsUse = {
  extends: {},
  components: {
    abSubCopy,
    abSubDel,
    abSubMove,
    abSubMoveBtn,
    abSubAdd,
    abSubImp,
    abSubExp,
    abSubSn,
    // TODO 发布壹点灵后删掉他，使用abSubTrScope
    abSubScopeTr,
    abSubTrScope,
    abSubPage,
    abSubScope,
    abSubDetail,
    abSubDetailDialog,
    abSubEdit,
    abSubEditDialog,
    abSubLoad,
    abFormGroup,
    abFormItem,
    abFormGlobalSetting,

    abButtonGroup,
    abCard,
    abTag,
    abButton,
    abTabs,
    abTabPane,
    abDivider,
    abAlert,

    abTablePlugins, // 表插件
    abCalculate, // 函数计算
    abDynPerm,

    abInput,
    abDate,
    abRangeDate,
    abMultipleDate,
    abCheckboxGroup,
    abDynamicSelect,
    abNumber,
    abRadioGroup,
    abSelect,
    abTreeSelect,
    abSerialNo,
    abSignature,
    abSignatureOpinion,
    abCascader,
    abSn,
    abSwitch,
    abRate,
    abCustomDialog,
    abCustomQuery,
    abUpload,
    abFlowQuote,
    abRequired,
    abQuill,
    abDataSelector,
    abOnlineDoc,
    abFormReference,
    abIframe,
    abSteps,
    abVerificationCode,
    abScanTrans,
    abOcr,
    abPosition,
    abBtnForm,
  },
  directives: {
    abPermission,
  },
  data() {
    return { subTempData: {}, pageInfo: {} }
  },
  methods: {
    ...formCalculateFunctions,
    request,
    postData,
    getData,
    abMessage,
    abMessageBox,
  },
}
