<template>
  <div class="field" :key="info.key">
    <div v-for="field in info.fields">
      <div class="title">{{ field.title }}</div>
      <draggable
        class="field-group"
        tag="ul"
        :list="field.list"
        :move="move"
        :group="{ name: 'form', pull: 'clone', put: false }"
        ghost-class="ghost"
        :sort="false"
        item-key="label"
      >
        <template #item="{ element }">
          <li class="field-item">
            <i class="icon iconfont" :class="element.icon || 'icon-info'"></i>
            <span>{{ element.title || element.label }}</span>
          </li>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
  import Draggable from 'vuedraggable'
  import importAbFields from '~/agilebpm/package/avue-form-design/ab/abFieldIndex.js'
  import importAbFieldsDiy from '~/agilebpm/package/avue-form-design/ab/abFieldIndexDiy.js'
  import { bizApi } from '@agilebpm/api'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  // Props
  const props = defineProps({
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    mbData: {
      type: Object,
      default: () => {
        return {}
      },
    },
    tab: {
      type: String,
      default: 'pc',
    },
  })

  const { proxy } = abTools.useCurrentInstance()
  const info = reactive({
    //业务对象
    bo: null,
    //左侧字段
    fields: [],
    fieldMap: {
      main: [],
      sub: [],
    },
    tableMap: {},
    //CreateForm 应用广场创建表单页面
    // && proxy.$route.name !== 'CreateForm'
    isBo:
      proxy.$route.query.mode != 'diyBo',
    iconMap: {},
    key: 0,
    confirming: false,
  })
  // Emits
  defineEmits(['field-click'])

  //初始化逻辑
  onMounted(() => {
    window.ab_bo_getRel = getRel
    window.ab_bo_getCol = getCol
    //业务对象模式需要去获取BO结构
    if (info.isBo) {
      let boCode = proxy.$route.query.boCode || props.data.boCode
      bizApi.bizObject.getBizObject(boCode).then((resp) => {
        window.ab_bo = resp.data
        window.ab_bo.getRel = getRel
        window.ab_bo.getCol = getCol
        info.bo = resp.data
        props.data.boName = info.bo.name
        handleFields()
        window.ab_tableMap = info.tableMap
        initData()
        handleColumnsWithoutPrimary()
      })
    } else {
      //diy
      handleExpandField()
    }
    initIconMap()
  })

  const getBo = inject('getBo')

  const getRel = (tableCode, rel, showErrorMsg = true) => {
    if (!tableCode) {
      return null
    }
    let top = false
    if (!rel) {
      top = true
      rel = window.ab_bo.rel
    }
    if (rel.tableCode === tableCode) {
      return rel
    }
    let result
    for (let i = 0; i < rel.children.length; i++) {
      rel.children[i].parent = rel
      const r = getRel(tableCode, rel.children[i])
      if (r) result = r
    }

    if (top && !result && showErrorMsg) {
      ElMessage({
        dangerouslyUseHTMLString: true,
        type: 'error',
        message: `当前业务对象已不存在表【${tableCode}】`,
      })
    }

    return result
  }

  const getCol = (tableCode, columnCode, showErrorMsg = false, r) => {
    if (!columnCode || !tableCode) {
      return null
    }
    const rel = getRel(tableCode, r, showErrorMsg)
    if (!rel) {
      return null
    }
    let result
    rel.table.columns.forEach((c) => {
      if (c.code === columnCode) {
        result = c
      }
    })
    if (!result && showErrorMsg) {
      ElMessage({
        dangerouslyUseHTMLString: true,
        type: 'error',
        message: `业务表【${tableCode}】已不存在字段【${columnCode}】`,
      })
    }

    return result
  }

  //初始化字段布局
  const initData = () => {
    let id = proxy.$route.query.id
    if (id || props.data.column.length != 0) return
    initDataSpan(props.data)
    initDataSpan(props.mbData, 24)
  }

  //默认全局span的赋值
  const initDataSpan = (option, span = props.data.span) => {
    //主表字段
    info.fieldMap.main.forEach((c) => {
      const data = proxy.deepClone(c)
      data.prop = 'ab' + Date.now() + Math.ceil(Math.random() * 99999)
      delete data.icon
      delete data.subfield
      data.span = span
      option.column.push(data)
    })
    //子表
    info.fieldMap.sub.forEach((c) => {
      const data = proxy.deepClone(c)
      data.prop = 'ab' + Date.now() + Math.ceil(Math.random() * 99999)
      delete data.icon
      delete data.subfield
      data.children.column.forEach((cc) => {
        if (!cc.prop) {
          cc.prop = 'ab' + Date.now() + Math.ceil(Math.random() * 99999)
        }
        cc.span = span
      })
      option.column.push(data)
    })
  }

  const handleFields = () => {
    //设置为初始化字段
    info.fields = abUtil.clone(importAbFields)

    /**
     * 业务对象的子表信息
     */
    let subTable = []
    let rels = getSubRels(info.bo.rel)
    if (rels.length > 0) {
      rels.forEach((rel) => {
        let json = {
          type: 'dynamic',
          label: `${rel.tableComment || rel.table.comment}`,
          icon: 'icon-group',
          display: true,
          arrow: false,
          collapse: true,
          children: {
            column: getTableColumn(rel),
          },
          //下面字段由ab定义
          code: rel.tableCode, //子表编码
          //abRel: rel, //ab的关系
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
          ],
        }
        subTable.push(json)
        info.tableMap[rel.tableCode] = json
      })
      info.fields.push({
        title: '子表',
        list: subTable,
      })
      info.fieldMap.sub = subTable
    }

    /**
     * 业务对象的主表字段信息
     */
    let main = getTableColumn(info.bo.rel)
    info.fieldMap.main = main
    info.fields.push({
      title: '主表字段',
      list: main,
    })
    info.tableMap[info.bo.rel.tableCode] = main
  }

  const getSubRels = (rel) => {
    let rels = []
    rel.children.forEach((rl) => {
      rl.parent = rel
      if (rl.type == 'oneToMany') {
        rels.push(rl)
      }
      getSubRels(rl).forEach((r) => {
        if (r.type == 'oneToMany') {
          rels.push(r)
        }
      })
    })
    return rels
  }

  const getColumns = (rel) => {
    let columns = []
    let list = rel.table.columnsWithoutPrimary || rel.table.columns
    list.forEach((c) => {
      c.tableCode = rel.tableCode
      c.tableComment = rel.tableComment
      c.tableType = rel.type
      c.table = rel.table
      columns.push(c)
    })
    rel.children.forEach((r) => {
      if (r.type == 'oneToOne') {
        getColumns(r).forEach((c) => {
          c.tableCode = r.tableCode
          c.tableComment = r.tableComment
          c.tableType = r.type
          c.table = r.table
          columns.push(c)
        })
      }
    })
    return columns
  }

  window.ab_getColumns = getColumns

  const getTableColumn = (rel) => {
    let column = []
    getColumns(rel).forEach((c) => {
      let title = c.comment
      if (c.tableType == 'oneToOne') {
        //一对一子表
        title = `${c.comment}（${c.tableComment}）`
      }
      if (c.primary || (c.setting && c.setting.includes('optimLock'))) {
        //不显示主键和乐观速
        return
      }
      if (
        rel.fks &&
        rel.fks.filter((f) => f.type == 'parentField' && f.from == c.code)
          .length
      ) {
        //不显示外键
        return
      }

      let cjson = {
        //prop: c.code,这里不是用c.code，而是保留avue生成的随机数，这样表单就能拖拽两个相同字段进去（prop在avue设定中是唯一键）
        type: 'onetext', //控件类型，这里改用了ab的BizColumnCtrlType枚举
        title: title,
        label: c.comment,
        icon: 'icon-input',
        span: 24,
        display: true,
        maxlength: c.length,
        decimal: c.decimal,
        //placeholder: `请输入${c.comment}`,
        //下面字段由ab定义
        code: c.code, //字段编码
        //abColumn: c, //字段详情
        defaultValue: '', //默认值
        rules: c.validRule ? c.validRule.split(',') : [], //校验
        fieldType: c.type, //字段类型
        readOnly: false, //是否只读
      }
      if (info.isBo) {
        cjson.tableCode = c.tableCode //表编码
      }
      if (cjson.fieldType == 'date') {
        cjson.type = 'date'
        cjson.dateType = 'date'
        cjson.dateFormat = 'YYYY-MM-DD'
      }
      if (cjson.fieldType == 'clob') {
        cjson.type = 'multitext'
      }

      if (c.json) {
        //存在json代表是“简式”且“PC端和移动端”且在编辑移动端，需要把pc端的字段配置映射过来
        let j = abUtil.clone(c.json)
        delete j.prop
        delete j.title
        delete j.label
        abUtil.easyClone(j, cjson)
        cjson.icon = info.iconMap[cjson.type]
      }

      column.push(cjson)
    })
    return column
  }

  const initIconMap = () => {
    importAbFieldsDiy.forEach((item) => {
      item.list.forEach((ite) => {
        info.iconMap[ite.type] = ite.icon
      })
    })
  }

  const move = (e, originalEvent) => {
    //演示环境才拦截
    if (!abUtil.checkIsPublicProject(true)) {
      return true
    }
    let targetField
    info.fields.forEach((field) => {
      field.list.forEach((item) => {
        if (item.type == e.draggedContext.element.type) {
          targetField = field
        }
      })
    })
    if (targetField && ['高级控件', '动态控件'].includes(targetField.title)) {
      if (!info.confirming) {
        info.confirming = true
        ElMessageBox.confirm(
          '体验高级功能需要技术指导，即将跳转客服联系页...',
          '注意',
          {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }
        )
          .then(() => {
            window.location.href = 'https://www.tongzhouyun.com/contact'
            info.confirming = false
          })
          .catch((action) => {
            info.confirming = false
          })
      }

      return false
    }

    return true
  }

  const handleColumnsWithoutPrimary = (rel) => {
    if (!rel) {
      rel = info.bo.rel
    }
    if (rel.table.columnsWithoutPrimary && rel.fks) {
      rel.table.columnsWithoutPrimary = rel.table.columnsWithoutPrimary.filter(
        (c) => !rel.fks.find((f) => f.from == c.code)
      )
    }
    rel.children.forEach((r) => handleColumnsWithoutPrimary(r))
  }

  const handleExpandField = () => {
    info.fields = abUtil.clone(importAbFieldsDiy)
    if (proxy.expandFields) {
      abUtil.clone(proxy.expandFields).forEach((item) => {
        const target = info.fields.find((ite) => ite.title == item.title)
        if (target) {
          target.list.push(...item.list)
        }
      })
    }
  }

  watch(
    () => props.tab,
    (newVal, oldVal) => {
      if (info.isBo) {
        return
      }

      info.key++

      if (newVal == 'mb') {
        //简式移动端时只能用pc端的字段
        info.bo = getBo()
        let rels = getSubRels(info.bo.rel)
        rels.forEach((r) => {
          let list = r.tableCode
            .substring(info.bo.designCode.length + 1)
            .split('_')
          r.tableCode = list.slice(0, list.length - 1).join('_')
          r.tableComment = r.tableComment.substring(
            info.bo.designName.length + 1
          )
        })
        handleFields()
        console.info(info.fields)
      } else {
        handleExpandField()
      }
    }
  )
</script>

<style lang="scss" scoped>
  @import '../../styles/theme.scss';
  @import '../../styles/font.css';
  .field {
    width: 100%;
    height: 100%;
    padding: 10px 0;
    background: #fff;

    .title {
      padding: 8px 12px;
      font-size: 13px;
    }

    .field-group {
      position: relative;
      padding: 0 10px 10px;
      margin: 0;
      overflow: hidden;

      .field-item {
        position: relative;
        left: 0;
        display: flex;
        align-items: center;
        float: left;
        width: 47%;
        padding: 5px 0;
        margin: 1%;
        overflow: hidden;
        font-size: 12px;
        color: #333;
        color: #333;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: move;
        background: #f4f6fc;
        border: 1px solid #f4f6fc;

        &:hover {
          color: $primary-color;
          outline: 1px dashed $primary-color;
        }

        .icon {
          display: inline-block;
          margin-right: 6px;
          margin-left: 8px;
          font-size: 14px;
          vertical-align: middle;
        }
      }
    }
  }
</style>
