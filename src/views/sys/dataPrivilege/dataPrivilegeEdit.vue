<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="dataPrivilegeList"
        :form-ref="formRef"
        :save-data="info.data"
        :url="sysApi.dataPrivilege.dataPrivilegeSaveUrl"
      />
      <ab-load
        v-model="info.data"
        :get-query="id"
        :url="sysApi.dataPrivilege.dataPrivilegeGetUrl"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="160px"
          :model="info.data"
          :status-icon="false"
        >
          <el-form-item
            :label="$abT('page.common.classification', '分类')"
            prop="typeCode"
            :rules="[
              { required: true, message: $abT('page.common.required', '必填') },
            ]"
          >
            <ab-select-tree
              v-model="info.data.typeCode"
              :operation="false"
              type-code="dataPrivilege"
            />
          </el-form-item>
          <el-form-item
            :label="$abT('page.roleList.resourcesType', '资源类型')"
            prop="resourceType"
            :rules="[
              { required: true, message: $abT('page.common.required', '必填') },
            ]"
          >
            <el-radio-group
              v-model="info.data.resourceType"
              :placeholder="$abT('page.roleList.resourcesType', '资源类型')"
              @change="
                () => {
                  ;(info.data.path = ''),
                    (info.data.filterOrgColumn = ''),
                    (info.data.filterUserColumn = '')
                }
              "
            >
              <el-radio-button label="menu">
                {{ $abT('page.common.menu', '菜单') }}
              </el-radio-button>
              <el-radio-button label="dialog">
                {{ $abT('page.common.custDialog', '自定义对话框') }}
              </el-radio-button>
              <el-radio-button label="grid">
                {{ $abT('page.common.custGrid', '自定义列表') }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="$abT('page.dataAuth.resources', '资源')"
            prop="path"
            :rules="[
              { required: true, message: $abT('page.common.required', '必填') },
            ]"
          >
            <el-input
              v-model="info.data.path"
              :disabled="info.data.resourceType !== 'menu'"
              :placeholder="$abT('page.dataAuth.resources', '资源')"
            />
            <span style="width: 10px"></span>
            <ab-cust-dialog
              v-if="info.data.resourceType === 'dialog'"
              dialog-key="custDialog"
              :dialog-setting="{ multiple: 0 }"
              style="display: inline-block"
              type="primary"
              @ok="dialogSelectorOk"
            >
              {{ $abT('page.dataAuth.selectCustomDialog', '选择自定义对话框') }}
            </ab-cust-dialog>
            <ab-cust-dialog
              v-else-if="info.data.resourceType === 'grid'"
              dialog-key="custGridDb"
              :dialog-setting="{ multiple: 0 }"
              style="display: inline-block"
              type="primary"
              @ok="dialogSelectorOk"
            >
              {{ $abT('page.dataAuth.selectCustomList', '选择自定义列表') }}
            </ab-cust-dialog>
          </el-form-item>
          <div class="pad">
            <el-alert :closable="false" style="max-width: 500px" type="info">
              <p>
                {{
                  $abT(
                    'page.dataAuth.resourcesMsg',
                    '类型为【自定义对话框、自定义列表】时取值为code'
                  )
                }}
              </p>
            </el-alert>
          </div>
          <el-form-item
            :label="$abT('page.common.name', '名称')"
            prop="name"
            :rules="[
              { required: true, message: $abT('page.common.required', '必填') },
            ]"
          >
            <el-input
              v-model="info.data.name"
              :placeholder="$abT('page.common.name', '名称')"
            />
          </el-form-item>
          <el-form-item
            :label="$abT('page.dataAuth.userCode', '筛选字段-用户编号')"
            prop="filterUserColumn"
            :rules="[
              { required: true, message: $abT('page.common.required', '必填') },
            ]"
          >
            <el-select
              v-if="info.data.resourceType !== 'menu'"
              v-model="info.data.filterUserColumn"
              :placeholder="
                $abT(
                  'page.dataAuth.filterTableData',
                  '请选择筛选表数据的字段名'
                )
              "
            >
              <el-option
                v-for="(item, index) in info.conditionFields"
                :key="index"
                :label="item.showName"
                :value="item.columnName"
              />
            </el-select>
            <el-input
              v-else
              v-model="info.data.filterUserColumn"
              :placeholder="
                $abT('page.dataAuth.filterDataUser', '请输入筛选表数据的字段名')
              "
            />
          </el-form-item>
          <div class="pad">
            <el-alert :closable="false" style="max-width: 500px" type="info">
              <p>
                {{
                  $abT(
                    'page.dataAuth.userCodeMsg',
                    '筛选仅本人数据，类型为【自定义列表】时需预定义该条件，操作符[in]'
                  )
                }}
              </p>
            </el-alert>
          </div>
          <el-form-item
            :label="$abT('page.dataAuth.groupCode', '筛选字段-组织编号')"
            prop="filterOrgColumn"
            :rules="[
              { required: true, message: $abT('page.common.required', '必填') },
            ]"
          >
            <el-select
              v-if="info.data.resourceType !== 'menu'"
              v-model="info.data.filterOrgColumn"
              :placeholder="
                $abT(
                  'page.dataAuth.filterTableData',
                  '请选择筛选表数据的字段名'
                )
              "
            >
              <el-option
                v-for="(item, index) in info.conditionFields"
                :key="index"
                :label="item.showName"
                :value="item.columnName"
              />
            </el-select>
            <el-input
              v-else
              v-model="info.data.filterOrgColumn"
              :placeholder="
                $abT('page.dataAuth.filterDataUser', '请输入筛选表数据的字段名')
              "
            />
          </el-form-item>
          <div class="pad">
            <el-alert :closable="false" style="max-width: 500px" type="info">
              <p>
                {{
                  $abT(
                    'page.dataAuth.groupCodeMsg',
                    '筛选所属组织数据，类型为【自定义列表】时需预定义该条件，操作符[in]'
                  )
                }}
              </p>
            </el-alert>
          </div>
          <el-form-item :label="$abT('page.common.enable', '启用')">
            <el-switch
              v-model="info.data.enabled"
              :active-value="1"
              :inactive-value="0"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
            />
          </el-form-item>
          <el-form-item
            :label="$abT('page.common.desc', '描述')"
            prop="description"
          >
            <el-input
              v-model="info.data.description"
              :autosize="{ minRows: 2, maxRows: 5 }"
              :placeholder="$abT('page.common.enterDesc', '请输入描述')"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { sysApi, abTools, bizApi } from '~/agilebpm'
  import { ElMessage } from 'element-plus'
  import { abT } from '@/i18n'
  import { onMounted, reactive, ref } from 'vue'
  const formRef = ref()

  const { proxy } = abTools.useCurrentInstance()
  const id = proxy.$route.params.id
  const info: any = reactive({
    data: {
      name: '',
      description: '',
      resourceType: 'menu',
      path: '',
      typeCode: '',
      filterOrgColumn: '',
      filterUserColumn: '',
      enabled: 1,
    },
    dialogInfo: {},
    conditionFields: [],
  })

  const dialogSelectorOk = (dataList: [any]) => {
    if (dataList && dataList.length) {
      const { name, code } = dataList[0]
      info.data.path = code
      info.data.name = name
      info.data.filterOrgColumn = ''
      info.data.filterUserColumn = ''
    }
  }
  watch(
    () => info.data.path,
    async (newValue) => {
      if (!newValue) {
        return
      }
      info.conditionFields.splice(0, info.conditionFields.length)
      if (info.data.resourceType == 'dialog') {
        getDailogInfo(newValue)
      }
      if (
        info.data.resourceType == 'grid' ||
        info.data.resourceType == 'lcProjectGrid'
      ) {
        getGridInfo(newValue)
      }
    }
  )

  const getDailogInfo = (dialogKey: string) => {
    bizApi.customDialog.getDialogByCode(dialogKey).then((res: any) => {
      if (!res.isOk || !res.data) {
        ElMessage.error(
          abT(
            'page.dataAuth.getDialogMsg',
            '获取{a}对话框失败，请联系管理员！',
            { a: '[' + dialogKey + ']' }
          )
        )
        return
      }

      if (!res.data.conditionFields || res.data.conditionFields.length === 0) {
        ElMessage.warning(
          abT(
            'page.dataAuth.dialogConfigMsg',
            '请配置{a}对话框的条件字段，选择筛选字段！',
            { a: '[' + info.data.name + ']' }
          )
        )
        return
      }
      info.conditionFields.push(...res.data.conditionFields)
      info.dialogInfo = res.data
    })
  }

  const getGridInfo = (gridCode: string) => {
    bizApi.custGrid.getCustGridVo(gridCode).then((res: any) => {
      if (!res.isOk || !res.data) {
        ElMessage.error(
          abT(
            'page.dataAuth.getListMsg',
            '获取{a}自定义列表失败，请联系管理员！',
            { a: '[' + gridCode + ']' }
          )
        )
        return
      }

      if (!res.data.sqlConditionVOS || res.data.sqlConditionVOS.length === 0) {
        ElMessage.warning(
          abT(
            'page.dataAuth.listConfigMsg',
            '请配置{a}自定义列表的查询字段，选择筛选字段！',
            { a: '[' + info.data.name + ']' }
          )
        )
        return
      }

      const conditionFields: { columnName: any; showName: any }[] = []
      res.data.sqlConditionVOS.forEach((e: any) => {
        if (e.cntype == 'in') {
          conditionFields.push({
            columnName: e.name,
            showName: e.fieldDesc,
          })
        }
      })

      if (conditionFields.length === 0) {
        ElMessage.warning(
          abT(
            'page.dataAuth.listConfigInMsg',
            '请配置{a}自定义列表的查询条件为 in 的字段，选择筛选字段！',
            { a: '[' + info.data.name + ']' }
          )
        )
        return
      }
      info.conditionFields.push(...conditionFields)
    })
  }

  onMounted(() => {
    info.data.typeCode = proxy.$route?.query?.typeCode
    if (info.data.path && info.data.resourceType === 'dialog') {
      getDailogInfo(info.data.path)
    }
    if (
      info.data.path &&
      (info.data.resourceType === 'grid' ||
        info.data.resourceType == 'lcProjectGrid')
    ) {
      getGridInfo(info.data.path)
    }
  })
</script>
<style scoped>
  .pad {
    padding: 0px 0px 0 160px;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 1px;
  }

  .perBtn {
    margin-left: 12px;
  }
</style>
