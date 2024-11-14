export default [
  {
    title: '子表',
    list: [
      {
        type: 'dynamic',
        label: '行子表',
        icon: 'icon-table',
        display: true,
        arrow: false,
        collapse: true,
        children: {
          column: [],
        },
        //下面字段由ab定义
        subTable: true, //是否子表
        buttons: [
          {
            key: 'add',
            name: '添加',
          },
          {
            key: 'del',
            name: '移除',
          },
          {
            key: 'copy',
            name: '复制',
          },
        ],
      },
      {
        type: 'group',
        label: '块子表',
        icon: 'icon-table',
        display: true,
        arrow: false,
        collapse: true,
        children: {
          column: [],
        },
        //下面字段由ab定义
        subTable: true, //是否子表
        buttons: [
          {
            key: 'add',
            name: '添加',
          },
          {
            key: 'del',
            name: '移除',
          },
          {
            key: 'copy',
            name: '复制',
          },
        ],
        subtableMode: false, // 是否开启行子表模式
      },
      {
        type: 'sn',
        title: '排序',
        label: '排序',
        icon: 'icon-number',
        span: 24,
        display: true,
        maxlength: 10,
        decimal: 0,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'number', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
    ],
  },
  {
    title: '辅助',
    list: [
      {
        type: 'group',
        label: '分组',
        icon: 'icon-group',
        display: true,
        arrow: false,
        collapse: true,
        children: {
          column: [],
        },
        //下面字段由ab定义
        subTable: false, //是否子表
      },
      {
        type: 'tabs',
        label: '多标签tabs',
        icon: 'icon-group',
        display: true,
        arrow: true,
        collapse: true,
        control: 1,
        tabsType: '',
        defaultValue: 1,
        tabsColumn: [
          {
            label: '标签1',
            index: 1,
            children: {
              column: [],
            },
          },
        ],
      },
      {
        type: 'title',
        title: '标题',
        label: '',
        icon: 'icon-title',
        span: 24,
        fixSpan: true,
        display: true,
        fontSize: 20,
        fontColor: '#000000',
        text: '标题',
        labelWidth: '0px',
        position: 'left',
      },
      {
        type: 'divider',
        title: '分割线',
        label: '',
        icon: 'icon-url',
        span: 24,
        fixSpan: true,
        display: true,
        text: '分割线',
        labelWidth: '0px',
        contentPosition: 'left',
      },
      {
        type: 'alert',
        title: '提示',
        label: '',
        icon: 'icon-title',
        span: 24,
        fixSpan: true,
        display: true,
        text: '提示',
        textType: 'success',
        effect: 'light',
        showIcon: true,
        labelWidth: '0px',
      },
      {
        type: 'iframe',
        title: '外部页面',
        label: '',
        icon: 'icon-img',
        span: 24,
        height: 600,
        labelWidth: '0px',
        fixSpan: true,
        display: true,
      },

      {
        type: 'verificationCode',
        title: '验证码',
        label: '验证码',
        icon: 'icon-img',
        span: 24,
        sendType: 0,
        display: true,
      },

      {
        type: 'button',
        title: '按钮',
        label: '',
        icon: 'icon-input',
        span: 2,
        labelWidth: '0px',
        display: true,
        text: '按钮',
        btnType: 'primary',
        round: false,
        fixSpan: true,
        action: 'dialog',
      },
    ],
  },
  {
    title: '常用控件',
    list: [
      {
        type: 'onetext', //控件类型，这里改用了ab的BizColumnCtrlType枚举
        title: '单行文本',
        label: '单行文本',
        icon: 'icon-input',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'multitext',
        title: '多行文本',
        label: '多行文本',
        icon: 'icon-textarea',
        span: 24,
        display: true,
        maxlength: 512,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'select',
        title: '下拉框',
        label: '下拉框',
        icon: 'icon-select',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'multiSelect',
        title: '下拉框多选',
        label: '下拉框多选',
        icon: 'icon-select',
        span: 24,
        display: true,
        maxlength: 256,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'checkbox',
        title: '复选框',
        label: '复选框',
        icon: 'icon-checkbox',
        span: 24,
        display: true,
        maxlength: 256,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
        buttonStyle: 'marquee',
      },
      {
        type: 'radio',
        title: '单选按钮',
        label: '单选按钮',
        icon: 'icon-radio',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
        buttonStyle: 'marquee',
      },
      {
        type: 'date',
        title: '日期控件',
        label: '日期控件',
        icon: 'icon-date',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'date', //字段类型
        dateType: 'date',
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'serialno',
        title: '流水号',
        label: '流水号',
        icon: 'icon-input',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'file',
        title: '附件上传',
        label: '附件上传',
        icon: 'icon-upload',
        span: 24,
        display: true,
        maxlength: 2048,
        fieldType: 'clob', //字段类型
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
        readNonDownload: false,
      },
      {
        type: 'number',
        title: '数字控件',
        label: '数字控件',
        icon: 'icon-number',
        span: 24,
        display: true,
        maxlength: 10,
        decimal: 2,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'number', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'switch',
        title: '开关',
        label: '开关',
        icon: 'icon-switch',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'rate',
        title: '评分',
        label: '评分',
        icon: 'icon-star',
        span: 24,
        display: true,
        maxlength: 10,
        decimal: 2,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'number', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'steps',
        title: '步骤条',
        label: '步骤条',
        icon: 'icon-select',
        span: 24,
        display: true,
        maxlength: 10,
        decimal: 0,
        //下面字段由ab定义
        rules: [], //校验
        fieldType: 'number', //字段类型
        isName: true, //是否前端设置name逻辑
        fixSpan: true,
      },
      {
        type: 'editor',
        title: '富文本',
        label: '富文本',
        icon: 'icon-img',
        span: 24,
        display: true,
        fixSpan: true,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'clob', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
        hideTitle: false, //是否隐藏标题
        height: 250,
        maxHeight: 400,
      },
      {
        type: 'hidden',
        title: '隐藏',
        label: '隐藏',
        icon: 'icon-password',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
    ],
  },
  {
    title: '高级控件',
    list: [
      {
        type: 'userSelect',
        title: '用户选择',
        label: '用户选择',
        icon: 'icon-number',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'roleSelect',
        title: '角色选择',
        label: '角色选择',
        icon: 'icon-icon',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'orgSelect',
        title: '组织选择',
        label: '组织选择',
        icon: 'icon-richtext',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'postSelect',
        title: '岗位选择',
        label: '岗位选择',
        icon: 'icon-slider',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'dataSelector',
        title: '自定义数据选择',
        label: '自定义数据选择',
        icon: 'icon-checkbox',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'dateRange',
        title: '日期范围控件',
        label: '日期范围控件',
        icon: 'icon-date',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'date', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'dateMulti',
        title: '日期多选控件',
        label: '日期多选控件',
        icon: 'icon-date',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'signature',
        title: '在线签名',
        label: '在线签名',
        icon: 'icon-img',
        span: 24,
        display: true,
        maxlength: 500,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'signatureOpinion', //控件定义code
        title: '签批', //控件名称
        label: '签批', //字段描述
        icon: 'icon-img', //控件图标
        span: 24, //是否显示
        display: true,
        maxlength: '',
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'clob', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      // {
      //   type: 'scanCode',
      //   title: '扫码(移动端)',
      //   label: '扫码(移动端)',
      //   icon: 'icon-img',
      //   span: 24,
      //   display: true,
      //   maxlength: 64,
      //   //下面字段由ab定义
      //   defaultValue: '', //默认值
      //   rules: [], //校验
      //   fieldType: 'varchar', //字段类型
      //   readOnly: false, //是否只读
      //  isName: true, //是否前端设置name逻辑
      // },

      {
        type: 'followerQuote',
        title: '流程引用控件',
        label: '流程引用控件',
        icon: 'icon-array',
        span: 24,
        display: true,
        maxlength: 500,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      // {
      //   type: 'opinion',
      //   title: '意见控件',
      //   label: '意见控件',
      //   icon: 'icon-map',
      //   span: 24,
      //   display: true,
      //   maxlength: 64,
      //   //下面字段由ab定义
      //   defaultValue: '', //默认值
      //   rules: [], //校验
      //   fieldType: 'clob', //字段类型
      //   readOnly: false, //是否只读
      //  isName: true, //是否前端设置name逻辑
      // },
      {
        type: 'region',
        title: '行政区域选择',
        label: '行政区域选择',
        icon: 'icon-map',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'treeSelect',
        title: '字典分类',
        label: '字典分类',
        icon: 'icon-select',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'onlineDoc',
        title: '在线文档',
        label: '在线文档',
        icon: 'icon-textarea',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'formReference',
        title: '表单引用',
        label: '表单引用',
        icon: 'icon-array',
        span: 24,
        display: true,
        maxlength: 500,
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'scanTrans',
        title: '扫码',
        label: '扫码',
        icon: 'icon-select',
        span: 24,
        display: true,
        maxlength: 64,
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'ocr',
        title: '文字识别',
        label: '文字识别',
        icon: 'icon-select',
        fieldType: 'clob', //字段类型
        span: 24,
        isName: true, //是否前端设置name逻辑
        display: true,
        fixSpan: true,
        uploadType: 'mrfl',
        hideTitle: false, //是否隐藏标题
      },
      {
        type: 'position',
        title: '定位',
        label: '定位',
        icon: 'icon-select',
        fieldType: 'varchar', //字段类型
        span: 24,
        isName: true, //是否前端设置name逻辑
        display: true,
        maxlength: 64,
      },
    ],
  },
  {
    title: '动态控件',
    list: [
      {
        type: 'dynamicSelect',
        title: '动态下拉框',
        label: '动态下拉框',
        icon: 'icon-select',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'cascadeSelect',
        title: '动态级联选择',
        label: '动态级联选择',
        icon: 'icon-select',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
      {
        type: 'customDialog',
        title: '数据选择框',
        label: '数据选择框',
        icon: 'icon-link',
        span: 24,
        display: true,
        maxlength: 64,
        //下面字段由ab定义
        defaultValue: '', //默认值
        rules: [], //校验
        fieldType: 'varchar', //字段类型
        readOnly: false, //是否只读
        isName: true, //是否前端设置name逻辑
      },
    ],
  },
]
