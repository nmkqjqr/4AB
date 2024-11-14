import AbHidden from './item/abHidden.vue'
import AbSn from './item/abSn.vue'
import AbSnConfig from './config/abSnConfig.vue'
import AbInput from './item/abInput.vue'
import AbSelect from './item/abSelect.vue'
import AbRadio from './item/abRadio.vue'
import AbCheckbox from './item/abCheckbox.vue'
import AbSwitch from './item/abSwitch.vue'
import AbRate from './item/abRate.vue'
import AbDate from './item/abDate.vue'
import AbSerialno from './item/abSerialno.vue'
import AbNumber from './item/abNumber.vue'
import AbDynamicSelect from './item/abDynamicSelect.vue'
import AbCascaderSelect from './item/abCascaderSelect.vue'
import AbSignature from './item/abSignature.vue'
import AbSignatureOpinion from './item/abSignatureOpinion.vue'
import AbCustomDialog from './item/abCustomDialog.vue'
import AbUpload from './item/abUpload.vue'
import AbFollowerQuote from './item/abFollowerQuote.vue'
import AbEditor from './item/abEditor.vue'
import AbDivider from './item/abDivider.vue'
import AbUserSelect from './item/abUserSelect.vue'
import AbRoleSelect from './item/abRoleSelect.vue'
import AbOrgSelect from './item/abOrgSelect.vue'
import AbPostSelect from './item/abPostSelect.vue'
import AbDataSelector from './item/abDataSelector.vue'
import AbMultitextConfig from './config/abMultitextConfig.vue'
import AbCommonConfig from './config/abCommonConfig.vue'
import AbHiddenConfig from './config/abHiddenConfig.vue'
import AbSelectConfig from './config/abSelectConfig.vue'
import AbTreeSelectConfig from './config/abTreeSelectConfig.vue'
import AbDateConfig from './config/abDateConfig.vue'
import AbDateMultiConfig from './config/abDateMultiConfig.vue'
import AbDateRangeConfig from './config/abDateRangeConfig.vue'
import AbSwitchConfig from './config/abSwitchConfig.vue'
import AbRateConfig from './config/abRateConfig.vue'
import AbSerialnoConfig from './config/abSerialnoConfig.vue'
import AbNumberConfig from './config/abNumberConfig.vue'
import AbDynamicSelectConfig from './config/abDynamicSelectConfig.vue'
import AbCascaderSelectConfig from './config/abCascaderSelectConfig.vue'
import AbSignatureConfig from './config/abSignatureConfig.vue'
import AbSignatureOpinionConfig from './config/abSignatureOpinionConfig.vue'
import AbCustomDialogConfig from './config/abCustomDialogConfig.vue'
import AbUploadConfig from './config/abUploadConfig.vue'
import AbFollowerQuoteConfig from './config/abFollowerQuoteConfig.vue'
import AbEditorConfig from './config/abEditorConfig.vue'
import AbDividerConfig from './config/abDividerConfig.vue'
import AbTitle from './item/abTitle.vue'
import AbTitleConfig from './config/abTitleConfig.vue'
import AbAlert from './item/abAlert.vue'
import AbAlertConfig from './config/abAlertConfig.vue'
import AbContent from './item/abContent.vue'
import AbContentConfig from './config/abContentConfig.vue'
import AbIframe from './item/abIframe.vue'
import AbIframeConfig from './config/abIframeConfig.vue'
import AbUserSelectConfig from './config/abUserSelectConfig.vue'
import AbRoleSelectConfig from './config/abRoleSelectConfig.vue'
import AbOrgSelectConfig from './config/abOrgSelectConfig.vue'
import AbPostSelectConfig from './config/abPostSelectConfig.vue'
import AbDataSelectorConfig from './config/abDataSelectorConfig.vue'
import AbOnlineDocConfig from './config/abOnlineDocConfig.vue'
import AbOnlineDoc from './item/abOnlineDoc.vue'
import AbSteps from './item/abSteps.vue'
import AbStepsConfig from './config/abStepsConfig.vue'
import AbCaptcha from './item/abCaptcha.vue'
import AbCaptchaConfig from './config/abCaptchaConfig.vue'

import AbFormReferenceConfig from './config/abFormReferenceConfig.vue'
import AbFormReferenceItem from './item/abFormReferenceItem.vue'

import AbRegionConfig from './config/abRegionConfig.vue'

import AbButton from './item/abButton.vue'
import AbButtonConfig from './config/abButtonConfig.vue'

import AbVerificationCode from './item/abVerificationCode.vue'
import AbVerificationCodeConfig from './config/abVerificationCodeConfig.vue'

import AbScanTrans from './item/abScanTrans.vue'
import AbScanTransConfig from './config/abScanTransConfig.vue'

import AbOcr from './item/abOcr.vue'
import AbOcrConfig from './config/abOcrConfig.vue'

import AbPosition from './item/abPosition.vue'
import AbPositionConfig from './config/abPositionConfig.vue'
const components = [
  AbHidden,
  AbInput,
  AbSelect,
  AbRadio,
  AbCheckbox,
  AbSwitch,
  AbRate,
  AbDate,
  AbSerialno,
  AbNumber,
  AbDynamicSelect,
  AbCascaderSelect,
  AbSignature,
  AbCustomDialog,
  AbUpload,
  AbFollowerQuote,
  AbEditor,
  AbUserSelect,
  AbRoleSelect,
  AbSignatureOpinion,
  AbOrgSelect,
  AbPostSelect,
  AbDataSelector,
  AbMultitextConfig,
  AbCommonConfig,
  AbSelectConfig,
  AbTreeSelectConfig,
  AbDateConfig,
  AbDateMultiConfig,
  AbDateRangeConfig,
  AbSwitchConfig,
  AbRateConfig,
  AbSerialnoConfig,
  AbNumberConfig,
  AbDynamicSelectConfig,
  AbCascaderSelectConfig,
  AbSignatureConfig,
  AbSignatureOpinionConfig,
  AbCustomDialogConfig,
  AbUploadConfig,
  AbFollowerQuoteConfig,
  AbEditorConfig,
  AbSn,
  AbSnConfig,
  AbDivider,
  AbDividerConfig,
  AbTitle,
  AbTitleConfig,
  AbAlert,
  AbAlertConfig,
  AbUserSelectConfig,
  AbRoleSelectConfig,
  AbOrgSelectConfig,
  AbPostSelectConfig,
  AbDataSelectorConfig,
  AbOnlineDocConfig,
  AbOnlineDoc,
  AbFormReferenceItem,
  AbFormReferenceConfig,
  AbRegionConfig,
  AbContent,
  AbContentConfig,
  AbIframe,
  AbIframeConfig,
  AbSteps,
  AbStepsConfig,
  AbCaptcha,
  AbCaptchaConfig,
  AbHiddenConfig,
  AbButton,
  AbButtonConfig,
  AbVerificationCode,
  AbVerificationCodeConfig,
  AbScanTrans,
  AbScanTransConfig,
  AbOcr,
  AbOcrConfig,

  AbPosition,
  AbPositionConfig,
]

const Ab = {
  install(Vue) {
    if (this.installed) return
    this.installed = true
    components.map((component) => {
      Vue.component(component.name, component)
    })
  },
}

export default Ab
