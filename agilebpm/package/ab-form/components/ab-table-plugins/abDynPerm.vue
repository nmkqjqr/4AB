<template><span></span></template>
<script lang="ts" setup>
  import { abUtil } from '~/agilebpm'
  import * as abDynPermTools from './../../../ab-common-resource/form/ab-dyn-perm-tools'
  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    config: {
      type: Array,
      required: true,
    },
    permission: {
      type: Object,
      required: true,
    },
    tablePermission: {
      type: Object,
      default: null,
    },
    parentData: {
      type: Object,
      default: () => {
        return {}
      },
    },
    tableCode: {
      type: String,
      default: '',
    },
    parentCode: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:modelValue', 'update:permission'])
  const abFormMananger = inject('abForm') as AbFormProvide
  const info = reactive({
    sourcePerimission: null, //备份原后台来的权限，预防越级授权，例如不能支持后端权限是r只读，动态权限改成w编辑、b只读
    sourceTablePerimission: null, //备份原后台来的权限，预防越级授权，例如不能支持后端权限是r只读，动态权限改成w编辑、b只读
  })

  onMounted(() => {
    info.sourcePerimission = abUtil.clone(props.permission)
    info.sourceTablePerimission = abUtil.clone(props.tablePermission)
    //console.info(props)
    handle()
  })

  const handle = () => {
    if (!info.sourcePerimission) {
      return
    }

    let isChange = false
    props.config.forEach((conf: any, index) => {
      let js
      if (conf.isJs) {
        js = conf.js
      } else {
        js = `${abDynPermTools.toJs(conf, props.tableCode)}`
      }
      console.info(`动态权限配置生成的js脚本：${js}`)
      const func = () => {
        return false
      }
      eval(`func = function() { ${js} };`)

      conf.column.forEach((col: any) => {
        const sourceP = 'n'
        let colName
        let isTable = false
        let tableCode

        //表权限
        if (col.includes('|')) {
          isTable = true
          if (!info.sourceTablePerimission) {
            return
          }
          colName = col.replace('|', '.')
          eval(`sourceP = info.sourceTablePerimission.${colName}`)
        } else {
          //字段权限
          colName = col.substring(col.lastIndexOf('.') + 1)
          tableCode = col.substring(0, col.lastIndexOf('.'))
          //目前只支持单层一对一
          if (info.sourcePerimission && info.sourcePerimission[tableCode]) {
            colName = col
          }
          eval(`sourceP = info.sourcePerimission.${colName}`)
        }

        if (func()) {
          //权限越界检查
          if (
            sourceP == 'n' ||
            (sourceP == 'r' && (conf.rights == 'w' || conf.rights == 'b'))
          ) {
            console.error(
              `字段【${col}】不能从配置权限【${sourceP}】越级修改成【${conf.rights}】`
            )
            return
          }
          if (!isTable) {
            console.info(
              `动态权限的赋值脚本：props.permission.${colName} = conf.rights`
            )
            eval(`props.permission.${colName} = conf.rights`)
          } else {
            console.info(
              `动态权限的赋值脚本：props.tablePermission.${colName} = conf.rights`
            )
            eval(`props.tablePermission.${colName} = conf.rights`)
          }
          isChange = true
          abFormMananger.key++
        } else if (conf.recove) {
          if (!isTable) {
            eval(`props.permission.${colName} = sourceP`)
          } else {
            eval(`props.tablePermission.${colName} = sourceP`)
          }
          isChange = true
          abFormMananger.key++
        }
      })
      console.info(props.permission)
    })
    if (isChange) {
      //abFormMananger.key++
    }
  }

  const createWatch = () => {
    props.config.forEach((conf: any, index) => {
      createConfWatch(conf)
    })
  }

  const createConfWatch = (conf: any) => {
    const columnName = conf.valCol.substring(conf.valCol.lastIndexOf('.') + 1)

    if (conf.valColRelType == 'oneToOne') {
      watch(
        () => props.modelValue[conf.valCol],
        (value, oldval) => {
          handle()
        }
      )
    } else if (conf.valColRelType == 'oneToMany') {
      watch(
        () => props.modelValue[columnName],
        (value, oldval) => {
          handle()
        }
      )
    } else {
      //主表
      watch(
        () => props.data[columnName],
        (value, oldval) => {
          handle()
        }
      )
    }

    conf.children.forEach((c: any) => {
      createConfWatch(c)
    })
  }

  createWatch()
</script>
