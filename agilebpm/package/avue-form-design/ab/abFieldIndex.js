export default [
  {
    title: '布局',
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
        title: '多标签tabs',
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
    ],
  },
  {
    title: '辅助控件',
    list: [
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
      // 暂时搁置，等待将来开启
      // {
      //   type: 'content',
      //   title: '内容',
      //   label: '',
      //   icon: 'icon-title',
      //   span: 24,
      //   labelWidth: '0px',
      //   fixSpan: true,
      //   display: true,
      // },
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
      {
        type: 'verificationCode',
        title: '验证码',
        label: '验证码',
        icon: 'icon-img',
        span: 24,
        sendType: 0,
        display: true,
      },
    ],
  },
]
