<template>
  <el-cascader
    v-model="pageData.viewValue"
    collapse-tags
    collapse-tags-tooltip
    :props="propsLazy"
    @change="valueChange"
  />
  <p m="t-0 b-2">
    {{ $abT('bpm.office.selectedCandidates', '已选候选人：') }}
    <el-tag v-for="(identity, index) in pageData.viewValue" :key="index">
      {{ identity.assign }}
    </el-tag>
  </p>
</template>

<script lang="ts" setup>
  import { bizApi } from '~/agilebpm/api'
  import type { CascaderProps } from 'element-plus'
  import { abT } from '@/i18n'

  const props = defineProps({
    modelValue: {
      type: Array,
      required: true,
    },
    taskNode: {
      type: Object,
      required: true,
    },
  })

  const pageData = reactive({
    groupDataCache: [] as any[],
    viewValue: [] as any[],
  })

  const emit = defineEmits(['update:modelValue'])
  const valueChange = (value: any) => {
    emit('update:modelValue', value)
  }
  const buildOptions = (dataList: Array<any>) => {
    const optionsTemp = []
    for (let i = 0, item: any; (item = dataList[i++]); ) {
      const opstion = {
        value: item,
        label: item.assign,
        leaf: item.type == 'user',
      }
      optionsTemp.push(opstion)
    }
    return optionsTemp
  }

  const getUserList = async (type: string, id: string) => {
    let userList = [] as any[]
    const typeName = type
    const result = await bizApi.dialogDataSource.getUserByGroup({
      groupType: typeName,
      groupId: id,
    })
    if (result.data && result.data.length > 0) {
      const tempData = [] as any[]
      result.data.forEach((item: any) => {
        tempData.push({
          id: item.userId,
          name: item.fullName,
          type: 'user',
          assign: `(${abT('page.groupList.orgUser', '用户')})${item.fullName}`,
        })
      })
      userList = tempData
    }
    return userList
  }

  const getOptionsData = async (type: string, id: string) => {
    //先从缓存中去，缓存没有去请求接口
    let result = [] as any[]
    const resultGroup = pageData.groupDataCache.find((item: any) => {
      if (item.id == `${id}-${type}`) {
        return item
      }
    })
    if (!resultGroup || !resultGroup.data || resultGroup.data.length == 0) {
      //后台请求组中的人员数据
      result = await getUserList(type, id)
      //加到缓存中，下次可以直接用
      if (!result || result.length > 0) {
        pageData.groupDataCache.push({
          id: `${id}-${type}`,
          data: result,
        })
      }
    } else {
      result = resultGroup.data
    }
    return result
  }

  const propsLazy: CascaderProps = {
    multiple: true,
    lazy: true,
    checkStrictly: true,
    emitPath: false,
    expandTrigger: 'click',
    async lazyLoad(node: any, resolve) {
      const { level } = node
      //加载父节点，找到一个节点的所有配置人员
      if (level == 0) {
        resolve(buildOptions(props.taskNode.identityList))
      } else {
        const result = await getOptionsData(node.value.type, node.value.id)
        resolve(buildOptions(result))
      }
    },
  }
</script>

<style></style>
