<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        :after-save-fn="saveAfter"
        :before-save-fn="saveBefore"
        :form-ref="formRef"
        :save-data="info.data"
        :url="bpmApi.bpmPluginMatrix.matrixDirectorSaveUrl"
      />
      <ab-load
        v-model="info.data"
        :url="bpmApi.bpmPluginMatrix.matrixDirectorGetUrl"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-position="left"
          label-suffix="："
          :model="info.data"
          :status-icon="false"
        >
          <el-form-item
            :label="$abT('page.common.desc', '描述')"
            label-width="120px"
            :placeholder="$abT('page.common.enterDesc', '请输入描述')"
            prop="desc"
            :rules="[
              { required: true, message: $abT('rules.required', '必填') },
            ]"
          >
            <el-input v-model="info.data.desc" />
          </el-form-item>
          <el-form-item
            v-for="(item, index) in info.data.reportLine"
            :key="index"
            :label="item.roleName"
            label-width="120px"
            :placeholder="
              $abT('page.businessMatrix.enterSetting', '请输入{a}设置', {
                a: item,
              })
            "
            prop="reportLine"
            :rules="[
              { required: true, message: $abT('rules.required', '必填') },
            ]"
          >
            <el-tag
              v-if="!item.items || item.items.length === 0"
              type="warning"
            >
              {{ $abT('page.common.notSelect', '未选择') }}
            </el-tag>
            <el-tag
              v-for="(identity, index2) in item.items"
              :key="index2"
              closable
              @close="deleteIdentity(index2, item)"
            >
              {{ identity.name }}
            </el-tag>
            <el-button tag-type="success" text type="primary">
              <el-select
                v-model="item.roleType"
                style="width: 90px"
                @change="roleTypeChange(item)"
              >
                <el-option
                  v-for="(itemRole, indexRole) in roleTypeInfo"
                  :key="indexRole"
                  :label="itemRole.desc"
                  :value="itemRole.type"
                />
              </el-select>
            </el-button>
            <ab-cust-dialog
              v-if="item.roleType === 'user'"
              v-model="item.items"
              dialog-key="userSelector"
              :extra-data="{ type: 'user', index: index }"
              label-width="120px"
              type="primary"
              :value-mapping="{ id: 'id', name: 'name', account: 'key' }"
              @ok="choseIdentity"
            >
              {{ $abT('page.groupList.selectUser', '选择用户') }}
            </ab-cust-dialog>
            <ab-cust-dialog
              v-if="item.roleType === 'role'"
              v-model="item.items"
              dialog-key="roleSelector"
              :extra-data="{ type: 'role', index: index }"
              label-width="120px"
              type="primary"
              :value-mapping="{ id: 'id', name: 'name', key: 'key' }"
              @ok="choseIdentity"
            >
              {{ $abT('page.groupList.selectRole', '选择角色') }}
            </ab-cust-dialog>
            <ab-cust-dialog
              v-if="item.roleType === 'post'"
              v-model="item.items"
              dialog-key="postSelector"
              :extra-data="{ type: 'post', index: index }"
              label-width="120px"
              type="primary"
              :value-mapping="{ id: 'id', name: 'name', key: 'key' }"
              @ok="choseIdentity"
            >
              {{ $abT('page.common.postSelector', '选择岗位') }}
            </ab-cust-dialog>
            <ab-cust-dialog
              v-if="item.roleType === 'org'"
              v-model="item.items"
              dialog-key="orgSelector"
              :extra-data="{ type: 'org', index: index }"
              label-width="120px"
              type="primary"
              :value-mapping="{ id: 'id', name: 'name', key: 'key' }"
              @ok="choseIdentity"
            >
              {{ $abT('page.groupList.selectOrg', '选择组织') }}
            </ab-cust-dialog>
          </el-form-item>
          <ab-cust-dialog
            v-if="info.matrixInfo"
            v-model="info.data.busItems"
            :dialog-key="info.matrixInfo.datasourceKey"
            :dialog-setting="{ multiple: 1 }"
            type="primary"
            :value-mapping="{
              [info.matrixInfo.dataNameFiled]: 'busName',
              [info.matrixInfo.dataKeyFiled]: 'busKey',
            }"
            @ok="choseBus"
          >
            {{ $abT('page.businessMatrix.batchAddBusiness', '批量添加业务') }}
          </ab-cust-dialog>
          <el-table
            v-if="info.data.busItems && info.data.busItems.length > 0"
            :data="info.data.busItems"
            style="width: 800px; margin-top: 10px"
          >
            {{ info.data.busItems }}
            <el-table-column
              :label="$abT('page.businessMatrix.businessName', '业务名称')"
              prop="busName"
            />
            <el-table-column
              :label="$abT('page.businessMatrix.businessPK', '业务主键')"
              prop="busKey"
            />
            <el-table-column :label="$abT('page.common.operate', '操作')">
              <template #default="scope">
                <el-button
                  text
                  type="primary"
                  @click="removeBusItem(scope.$index)"
                >
                  {{ $abT('page.common.del', '删除') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { bpmApi, abTools } from '~/agilebpm'
  import { ElMessage } from 'element-plus'
  import { abT } from '@/i18n'
  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()
  const matrixId = proxy.$route.query.matrixId
  const id = proxy.$route.query.id
  const formRef = ref()
  const info: any = reactive({
    data: {
      id: null,
      reportLine: [],
      desc: '',
      matrixId: matrixId,
      busItems: [] as any,
    },
    matrixInfo: {
      reportLine: [],
      datasourceKey: '',
    },
  })
  const roleTypeInfo = [
    {
      type: 'user',
      desc: abT('page.common.user', '用户'),
    },
    {
      type: 'role',
      desc: abT('page.common.role', '角色'),
    },
    {
      type: 'post',
      desc: abT('page.common.post', '岗位'),
    },
    {
      type: 'org',
      desc: abT('page.common.group', '组织'),
    },
  ]

  const roleTypeChange = (reportLineInfo: any) => {
    if (reportLineInfo.items && reportLineInfo.items.length > 0) {
      reportLineInfo.items.splice(0, reportLineInfo.items.length)
    }
  }

  const deleteIdentity = (index: number, reportLineInfo: any) => {
    if (reportLineInfo.items && reportLineInfo.items.length > 0) {
      reportLineInfo.items.splice(index, 1)
    }
  }
  const getReportLineFn = async () => {
    //如果有id，并且reportLine有值，则不请求
    if (!matrixId) {
      return
    }
    const result: any = await bpmApi.bpmPluginMatrix.getMatrixInfo(matrixId)
    if (result.isOk && result.data) {
      info.matrixInfo = result.data
      if (info.data.id) return
      info.matrixInfo.reportLine.forEach((str: string) => {
        info.data.reportLine.push({
          roleName: str,
          roleType: 'user',
          showNames: '',
          items: [],
        })
      })
    } else {
      ElMessage.error(
        abT('page.businessMatrix.failedWithPK', '获取id为{a}的矩阵失败', {
          a: matrixId,
        })
      )
    }
  }
  onMounted(() => {
    getReportLineFn()
  })

  const removeBusItem = (index: number) => {
    info.data.busItems.splice(index, 1)
  }
  const addBusItem = () => {
    info.data.busItems.push({})
  }
  const choseIdentity = (list: any, typeInfo: any) => {
    const showNames = []
    const items = []
    if (list && list.length > 0) {
      for (const temp in list) {
        const roleInfo = list[temp]
        showNames.push(roleInfo.name)
        let key = roleInfo.key
        if (typeInfo.type === 'user') {
          key = roleInfo.account
        }
        items.push({
          id: roleInfo.id,
          name: roleInfo.name,
          key: key,
        })
      }
    }
    info.data.reportLine[typeInfo.index].items = items
    info.data.reportLine[typeInfo.index].showNames = showNames.join(',')
    info.data.reportLine[typeInfo.index].type = typeInfo.type
  }

  const choseBus = (list: any) => {
    info.data.busItems = []
    for (const index in list) {
      const row = list[index]
      const item = {
        busName: row[info.matrixInfo.dataNameFiled],
        busKey: row[info.matrixInfo.dataKeyFiled],
        matrixId: matrixId,
      }
      console.log(info.data)
      info.data.busItems.push(item)
    }
  }

  const saveAfter = (data: any) => {
    proxy.$router.push({
      name: 'BusMatrixDirectorList',
      query: { matrixId: matrixId },
    })
  }
  const saveBefore = () => {
    let vaild = true
    info.data.reportLine.forEach(
      (item: { items: string | any[]; roleName: any }) => {
        if (!item.items || item.items.length === 0) {
          ElMessage.warning(
            abT(
              'page.businessMatrix.personnelIsEmpty',
              '汇报线{a}，人员设置不能为空',
              { a: item.roleName }
            )
          )
          vaild = false
          return
        }
      }
    )
    return vaild
  }
</script>
