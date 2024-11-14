<template>
  <div class="tabs_main_padding">
    <el-form label-position="top" label-width="100px" :model="bizLogicProgram">
      <el-form-item label="设计备注">
        <el-input v-model="bizLogicProgram.desc" rows="6" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-tag type="primay">{{ bizLogicProgram.boName }}}</el-tag>
        <ab-cust-dialog
          dialog-key="boSelector"
          :dialog-setting="{ multiple: 1 }"
          extra-data="pc"
          :icon="Search"
          size="small"
          style="display: inline-block; margin-top: 5px; margin-left: 5px"
          type="primary"
          :value-mapping="{ id: bizId, name: bizName }"
        >
          选择
        </ab-cust-dialog>
      </el-form-item>
    </el-form>
    <br />
    <el-divider content-position="center">引入参数</el-divider>
    <el-form label-position="top">
      <el-form-item>
        <el-table :data="bizLogicProgram.designJson.params">
          <el-table-column label="参数名" prop="name">
            <template #default="{ row }">
              <el-input v-model="row.name" />
            </template>
          </el-table-column>
          <el-table-column label="值" prop="value">
            <template #default="{ row }">
              <el-select
                v-model="row.value"
                allow-create
                default-first-option
                filterable
                placeholder="手输固定值"
                :reserve-keyword="false"
              >
                <el-option label="SQL 参数" value="sqlParam" />
                <el-option label="当前用户ID" value="${currentUserId}" />
                <el-option label="当前用户账户" value="${currentUserAccount}" />
                <el-option label="当前组织ID" value="${currentOrgId}" />
                <el-option label="当前组织编码" value="${currentOrgCode}" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="55">
            <template #default="{ $index }">
              <el-icon
                :size="22"
                @click="bizLogicProgram.designJson.params.splice($index, 1)"
              >
                <Delete />
              </el-icon>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          text
          type="primary"
          @click="
            bizLogicProgram.designJson.params.push({ name: '', value: '' })
          "
        >
          添加
        </el-button>
      </el-form-item>
      <el-form-item label="SQL扩充参数">
        <el-input
          v-model="bizLogicProgram.designJson.paramsExpandSql"
          rows="6"
          type="textarea"
        />
      </el-form-item>
      <el-alert
        :closable="false"
        title="SQL仅允许返回一条数据，以属性Map形式扩充到全局参数中，支持使用业务对象字段作为入参，如：select * from org_user where id_ = {userId}"
        type="info"
      />
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { Delete } from '@element-plus/icons-vue'

  const bizLogicProgram = inject('bizLogicProgram') as BizLogicProgram
</script>

<style lang="scss" scoped></style>
