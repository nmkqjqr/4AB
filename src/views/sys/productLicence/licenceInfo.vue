<template>
  <div>
    <el-card>
      <el-descriptions border :column="1" title="授权信息">
        <el-descriptions-item label="授权者">
          {{ licenceInfo.issuer }}
        </el-descriptions-item>
        <el-descriptions-item label="授权给">
          {{ licenceInfo.holder }}
        </el-descriptions-item>

        <el-descriptions-item label="起始日">
          {{ licenceInfo.issued }}
        </el-descriptions-item>
        <el-descriptions-item label="到期日">
          {{ licenceInfo.notAfter }}
        </el-descriptions-item>
        <el-descriptions-item label="剩余天数">
          {{ licenceInfo.freeDay }}
        </el-descriptions-item>
        <el-descriptions-item label="授权产品">
          <el-tag size="small">{{ licenceInfo.productCategory }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="描述">
          {{ licenceInfo.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>
<script setup lang="ts">
  import { sysApi } from '~/agilebpm'
  const licenceInfo = ref<any>({})
  sysApi.productLicence
    .getProductLicenceInfo()
    .then(({ data }) => (licenceInfo.value = data))
</script>
