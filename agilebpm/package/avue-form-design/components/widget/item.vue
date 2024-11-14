<template>
  <component
    :is="getComponent(item)"
    v-bind="vBind"
    :item="item"
    :json="data"
  />
</template>
<script>
  export default {
    name: 'widget-form-item',
    props: {
      item: {
        type: Object,
        default: () => {
          return {}
        },
      },
      json: {
        type: Object,
        default: () => {
          return {}
        },
      },
      params: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    computed: {
      vBind() {
        const vBind = Object.assign(this.deepClone(this.item), this.params, {})
        return vBind
      },
    },
    data() {
      return {
        form: {},
      }
    },
    methods: {
      getComponent(item) {
        //多组件共用配置的分类
        if (['select', 'multiSelect', 'treeSelect'].includes(item.type)) {
          return 'ab-select'
        }
        if (['date', 'dateRange', 'dateMulti'].includes(item.type)) {
          return 'ab-date'
        }

        //组件和配置命名无规律的分类
        if ('file' === item.type) {
          return 'ab-upload'
        }
        if ('region' === item.type) {
          return 'ab-cascader-select'
        }
        if ('cascadeSelect' === item.type) {
          return 'ab-cascader-select'
        }
        if ('formReference' === item.type) {
          return 'ab-form-reference-item'
        }

        //input
        if (['onetext', 'multitext'].includes(item.type)) {
          return 'ab-input'
        }

        return 'ab-' + item.type.toUnderlineCase().replaceAll('_', '-') //将aBCd转成a-b-cd
      },
    },
  }

  // switch (item.type) {
  //   case 'hidden':
  //     return 'ab-hidden'
  //   case 'sn':
  //     return 'ab-sn'
  //   case 'multitext':
  //   case 'onetext':
  //     return 'ab-input'
  //   case 'editor':
  //     return 'ab-editor'
  //   case 'select':
  //   case 'multiSelect':
  //   case 'treeSelect':
  //     return 'ab-select'
  //   case 'checkbox':
  //     return 'ab-checkbox'
  //   case 'radio':
  //     return 'ab-radio'
  //   case 'date':
  //   case 'dateRange':
  //   case 'dateMulti':
  //     return 'ab-date'
  //   case 'dic':
  //     return 'ab-dic'
  //   case 'serialno':
  //     return 'ab-serialno'
  //   case 'dynamicSelect':
  //     return 'ab-dynamic-select'
  //   case 'signature':
  //     return 'ab-signature'
  //   case 'signatureOpinion':
  //     return 'ab-signature-opinion'
  //   case 'file':
  //     return 'ab-upload'
  //   case 'number':
  //     return 'ab-number'
  //   case 'followerQuote':
  //     return 'ab-follower-quote'
  //   case 'opinion':
  //     return 'ab-opinion'
  //   case 'optimLock':
  //     return 'ab-optimLock'
  //   case 'region':
  //     return 'ab-cascader-select'
  //   case 'switch':
  //     return 'ab-switch'
  //   case 'rate':
  //     return 'ab-rate'
  //   case 'customDialog':
  //     return 'ab-custom-dialog'
  //   case 'cascadeSelect':
  //     return 'ab-cascader-select'
  //   case 'divider':
  //     return 'ab-divider'
  //   case 'title':
  //     return 'ab-title'
  //   case 'alert':
  //     return 'ab-alert'
  //   case 'userSelect':
  //     return 'ab-user-select'
  //   case 'roleSelect':
  //     return 'ab-role-select'
  //   case 'orgSelect':
  //     return 'ab-org-select'
  //   case 'postSelect':
  //     return 'ab-post-select'
  //   case 'dataSelector':
  //     return 'ab-data-selector'
  //   case 'onlineDoc':
  //      return 'ab-online-doc'
  //   case 'formReference':
  //       return 'ab-form-reference-item'
  //   case 'content':
  //     return 'ab-content'
  //   case 'iframe':
  //     return 'ab-iframe'
  //   case 'steps':
  //     return 'ab-steps'
  //   default:
  //     return 'ab-input'
  // }
</script>
