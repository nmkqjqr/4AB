<template>
  <div
    class="t-a-c"
    style="z-index: 9999; display: flex; justify-content: center"
  >
    <div
      class="t-a-l"
      style="
        display: inline-block;
        width: 600px;
        padding: 20px;
        background-color: white;
      "
    >
      <el-form ref="flowSettingRef" label-width="130px" :model="flowSetting">
        <el-form-item
          label="名字："
          prop="name"
          :rules="[
            { required: true, message: '必填' },
            { max: data.isOracle ? 12 : 40, message: '输入字符超过最大限制' },
          ]"
        >
          <ab-pinyin
            v-model="flowSetting.name"
            v-model:to="flowSetting.flowKey"
          />
          <!-- <el-input v-model="flowSetting.name" placeholder="请输入名字" /> -->
        </el-form-item>
        <el-form-item
          label="编码："
          prop="flowKey"
          :rules="[
            { required: true, message: '必填' },
            { max: (data.isOracle&&!flowSetting.id)?12:50, message: '输入字符超过最大限制' },
            {
              pattern: /^[a-zA-Z]\w*$/,
              message: '只能以字母开头,允许字母、数字和下划线',
            },
          ]"
        >
          <ab-code v-model="flowSetting.flowKey" :disabled="!!flowSetting.id" />
        </el-form-item>
        <el-form-item
          label="图标："
          prop="iconStyle"
          :rules="[{ max: 50, message: '输入字符超过最大限制' }]"
        >
          <ab-choose-svg v-model="flowSetting.iconStyle" />
        </el-form-item>
        <el-form-item
          label="状态："
          prop="status"
          :rules="[
            { required: true, message: '必填' },
            { max: 200, message: '最多可输入50个字符' },
          ]"
        >
          <div style="console-align: left">
            <el-radio-group v-model="flowSetting.status">
              <el-radio label="draft">草稿</el-radio>
              <el-radio label="deploy">发布</el-radio>
              <el-radio label="forbidden">禁用</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item
          label="分类："
          prop="typeId"
          :rules="[{ required: true, message: '必填' }]"
        >
          <ab-select-tree
            v-model="flowSetting.typeId"
            type-code="flowType"
          />
        </el-form-item>
        <el-form-item
          label="描述："
          prop="desc"
          :rules="[
            { required: false, message: '必填' },
            { max: 200, message: '最多可输入50个字符' },
          ]"
        >
          <el-input
            v-model="flowSetting.desc"
            placeholder="请输入描述"
            type="textarea"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { abChooseSvg } from '@ab-core'
  import { sysApi } from '@agilebpm/api'

  const props = defineProps({
    flowSetting: { required: true, type: Object },
  })
  const { flowSetting } = toRefs(props)

  const data: any = reactive({
    validateMsg: {},
    treeData: [],
    treeMap: {},
    isOracle: false,
  })
  onMounted(() => {
    if (!flowSetting.value.status) {
      flowSetting.value.status = 'draft'
    }
    const formdata = new FormData()
    formdata.append('treeKey', 'flow')
    /*   if (!flowSetting.value.flowKey) {
    flowSetting.value.flowKey =
      'sf_' + Date.now() + Math.ceil(Math.random() * 99999)
  } */

    //获取当前数据库类型
    sysApi.tools.getCurrentDataSource().then((resp: any) => {
      data.isOracle = resp.data.dbType == 'oracle'
    })
  })

  const validate = () => {
    const validateMsg = []
    if (!flowSetting.value.name) {
      validateMsg.push({ msgType: '基础设置', msg: '流程名字必填！' })
    }
    if (
      (data.isOracle && flowSetting.value.name?.length > 12) ||
      (!data.isOracle && flowSetting.value.name?.length > 12)
    ) {
      validateMsg.push({ msgType: '基础设置', msg: '流程名字超过最大限制！' })
    }
    if (
      (!flowSetting.value.id &&
        data.isOracle &&
        flowSetting.value.flowKey?.length > 12) ||
      (!data.isOracle &&
        flowSetting.value.flowKey?.length > 50 &&
        !flowSetting.value.id)
    ) {
      const numStr = data.isOracle ? '12' : '50'
      validateMsg.push({
        msgType: '基础设置',
        msg: `流程编码超过最大限制！(${numStr}位)`,
      })
    }
    if (!flowSetting.value.typeId) {
      validateMsg.push({ msgType: '基础设置', msg: '流程分类必填！' })
    }

    return validateMsg
  }

  const buildTree = (data: any, parentId: any) => {
    if (!parentId) {
      //找到根节点
      data.forEach((item: any) => {
        let root = true
        data.treeMap[item.key] = item
        data.forEach((ite: any) => {
          if (item.parentId == ite.id) {
            root = false
          }
        })
        if (root) {
          parentId = item.parentId
        }
      })
    }

    const tree = []
    let temp
    for (let i = 0; i < data.length; i++) {
      if (data[i].parentId == parentId) {
        const obj = data[i]
        temp = buildTree(data, data[i].id)
        if (temp.length > 0) {
          obj.children = temp
        }
        obj.label = obj.name
        obj.id = obj.id
        tree.push(obj)
      }
    }
    return tree
  }

  /* watch(
  () => flowSetting.value.flowKey,
  (newVal) => {
    if (!newVal.includes('sf_')) {
      flowSetting.value.flowKey = 'sf_' + newVal
    }
  }
) */

  defineExpose({
    validate,
  })
</script>
<style>
  .e-icon {
    font-size: 18px;
  }
</style>
