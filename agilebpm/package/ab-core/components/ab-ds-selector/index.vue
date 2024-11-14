<template>
  <span>
    <el-select
      v-bind="attrs"
      v-model="data.dsKey"
      :style="{ width: props.width }"
      @change="dsKeyChange"
    >
      <el-option
        v-for="item in data.dataSources"
        :key="item.alias"
        :label="`${item.name}(${item.alias})`"
        :value="item.alias"
      />
    </el-select>
  </span>
</template>

<!-- 使用案例：<ab-ds-selector v-model:ds-key="data.dsKey" v-model:ds-name="data.dsName"/> -->
<script lang="ts" setup>
  import { reactive } from 'vue'
  import { sysApi, postData } from '~/agilebpm/api'
  import { useAttrs } from 'vue'

  const attrs = useAttrs()

  const props = defineProps({
    dsKey: {
      type: String,
      default: 'dataSourceDefault',
    },
    dsName: {
      type: String,
      default: '本地数据源',
    },
    dsType: {
      type: String,
      default: 'mysql',
    },
    width: {
      type: String,
      default: '100%',
    },
  })

  watch(
    () => [props.dsKey],
    (now, old) => {
      data.dsKey = now[0]
    }
  )

  const emit = defineEmits(['update:dsKey', 'update:dsName', 'update:dsType'])

  const data: any = reactive({
    dsKey: props.dsKey,
    dsName: props.dsName,
    dataSources: [],
  })

  //获取数据库列表
  postData(sysApi.dataSource.dataSourceList, {
    limit: 100,
    offset: 0,
  }).then((resp) => {
    data.dataSources = resp.data.rows
    dsKeyChange(props.dsKey)
  })

  //数据源改变事件
  const dsKeyChange = (val: string) => {
    const ds = data.dataSources.find((d: any) => d.alias == val)
    data.dsName = ds.name
    emit('update:dsKey', val)
    emit('update:dsName', ds.name)
    emit('update:dsType', ds.dbType)
  }
</script>
