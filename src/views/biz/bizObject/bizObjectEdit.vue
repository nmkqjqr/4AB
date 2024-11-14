<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="BizObjectList"
        :form-ref="formRef"
        :save-data="info.data"
        :url="bizApi.bizObject.BizObjectSave"
      />
      <ab-load
        v-model="info.data"
        :url="bizApi.bizObject.BizObjectGet"
        @after-fn="initTableMap(info.data.rel)"
      />
    </el-header>
    <el-main>
      <el-scrollbar>
        <el-form
          v-if="info.BizValidatorMap"
          ref="formRef"
          :inline="true"
          label-suffix="："
          label-width="140px"
          :model="info.data"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="分类"
                prop="typeCode"
                :rules="[{ required: true, message: '必填' }]"
              >
                <ab-select-tree
                  v-model="info.data.typeCode"
                  :operation="false"
                  type-code="biz"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="名称"
                prop="name"
                :rules="[
                  { required: true, message: '必填' },
                  { max: 50, message: '最多可输入50个字符' },
                ]"
              >
                <ab-pinyin
                  v-model="info.data.name"
                  v-model:to="info.data.code"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="编码"
                prop="code"
                :rules="[
                  { required: true, message: '必填' },
                  { max: 50, message: '最多可输入50个字符' },
                  info.BizValidatorMap.varirule.rule,
                ]"
              >
                <ab-code
                  v-model="info.data.code"
                  :disabled="!!info.data.id"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item
                label="业务主表"
                prop="rel.tableCode"
                :rules="[
                  {
                    required: true,
                    message: '请选择业务主表',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-tag
                  v-if="info.data.rel.tableComment"
                  class="ml-2"
                  type="success"
                >
                  {{
                    `${info.data.rel.tableComment}（${info.data.rel.tableCode}）`
                  }}
                </el-tag>
                <ab-cust-dialog
                  dialog-key="bizTableSelector"
                  :dialog-setting="{ multiple: 0 }"
                  :icon="Search"
                  size="small"
                  style="margin-left: 5px"
                  type="primary"
                  @ok="selectTable"
                >
                  选择
                </ab-cust-dialog>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维护外键索引" prop="saveIndex">
                <el-switch
                  v-model="info.data.saveIndex"
                  active-color="#13ce66"
                  active-text="是"
                  :active-value="1"
                  inactive-color="#ff4949"
                  inactive-text="否"
                  :inactive-value="0"
                  inline-prompt
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="描述"
                prop="desc"
                :rules="[{ max: 50, message: '最多可输入250个字符' }]"
              >
                <el-input
                  v-model="info.data.desc"
                  autosize
                  placeholder="回车可增加行数"
                  resize="none"
                  style="min-width: 220px"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item
                label="持久化方式"
                prop="persistenceType"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-select v-model="info.data.persistenceType">
                  <el-option
                    v-for="item in info.BizDataPersistenceService"
                    :key="item.type"
                    :label="item.name"
                    :value="item.type"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <span v-if="info.data.persistenceType == 'http'">
              <el-form-item
                label="保存数据链接"
                prop="perTypeConfigJson.saveDataUrl"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-input v-model="info.data.perTypeConfigJson.saveDataUrl" />
              </el-form-item>
              <el-form-item
                label="加载数据链接"
                prop="perTypeConfigJson.loadDataUrl"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-input v-model="info.data.perTypeConfigJson.loadDataUrl" />
              </el-form-item>
              <el-form-item
                label="删除数据链接"
                prop="perTypeConfigJson.removeDataUrl"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-input v-model="info.data.perTypeConfigJson.removeDataUrl" />
              </el-form-item>
            </span>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="服务接口定义">
                <bizObjectInterface
                  v-if="!!info.data.code"
                  v-model:interface-list="info.data.interfaceList"
                  :bo-code="info.data.code"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item>
              <ab-cust-dialog
                v-if="info.data.rel.children"
                dialog-key="bizTableSelector"
                :dialog-setting="{ multiple: 1 }"
                :extra-data="info.data.rel.children"
                :icon="Plus"
                type="primary"
                @ok="addSubTable"
              >
                添加业务子表
              </ab-cust-dialog>
            </el-form-item>
          </el-row>

          <el-row v-if="info.data.rel.children">
            <el-table
              border
              :data="info.data.rel.children"
              empty-text="请添加业务子表"
              style="width: 100%"
            >
              <el-table-column label="关系类型" width="150">
                <template #default="scope">
                  <el-form-item>
                    <el-select
                      v-model="scope.row.type"
                      style="width: 126px !important"
                    >
                      <el-option label="一对一" value="oneToOne" />
                      <el-option label="一对多" value="oneToMany" />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="描述" prop="tableComment" width="150" />
              <el-table-column label="编码" prop="tableCode" width="150" />
              <el-table-column label="表名" width="150">
                <template #default="scope">
                  <span v-if="info.tableMap[scope.row.tableCode]">
                    {{ info.tableMap[scope.row.tableCode].name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="外键">
                <template #default="scope">
                  <el-row v-for="(fk, index) in scope.row.fks" :key="index">
                    <el-col :span="7">
                      <el-form-item
                        :prop="`rel.children.${scope.$index}.fks.${index}.from`"
                        :rules="[{ required: true, message: '必填' }]"
                      >
                        <el-select
                          v-if="info.tableMap[scope.row.tableCode]"
                          v-model="fk.from"
                        >
                          <el-option
                            v-for="column in info.tableMap[scope.row.tableCode]
                              .columns"
                            :key="column.code"
                            :label="`${column.comment}（${column.code}）`"
                            :value="column.code"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="7">
                      <el-form-item>
                        <el-select v-model="fk.type" @change="fk.value = ''">
                          <el-option
                            v-for="item in info.BizObjectRelFkType"
                            :key="item.key"
                            :label="item.desc"
                            :value="item.key"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="7">
                      <el-form-item
                        :prop="`rel.children.${scope.$index}.fks.${index}.value`"
                        :rules="[{ required: true, message: '必填' }]"
                      >
                        <el-select
                          v-if="
                            info.tableMap[info.data.rel.tableCode] &&
                            fk.type != 'fixedValue'
                          "
                          v-model="fk.value"
                        >
                          <el-option
                            v-for="column in info.tableMap[
                              info.data.rel.tableCode
                            ].columns"
                            :key="column.code"
                            :label="`${column.comment}（${column.code}）`"
                            :value="column.code"
                          />
                        </el-select>

                        <el-input v-else v-model="fk.value" />
                      </el-form-item>
                    </el-col>

                    <el-col :span="3">
                      <el-form-item>
                        <el-button
                          v-if="index > 0"
                          circle
                          :icon="Delete"
                          plain
                          type="danger"
                          @click="abUtil.Arrays.del(index, scope.row.fks)"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-button
                    circle
                    :icon="Plus"
                    plain
                    type="primary"
                    @click="addFk(scope.row.fks)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="加载方式" width="100">
                <template #default="scope">
                  <el-switch
                    v-if="scope.row.type == 'oneToMany'"
                    v-model="scope.row.sync"
                    active-text="同步"
                    class="ml-2"
                    inactive-text="异步"
                    inline-prompt
                    width="50px"
                  />
                  <el-tag v-else>同步</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button
                    :icon="Delete"
                    plain
                    type="danger"
                    @click="
                      abUtil.Arrays.del(scope.$index, info.data.rel.children)
                    "
                  />
                  <sub-setting
                    v-model="scope.row.children"
                    :parent="scope.row"
                    :root-info="info"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { Search, Plus, Delete, Edit } from '@element-plus/icons-vue'
  import SubSetting from './subSetting.vue'
  import { bizApi, getData, abUtil, sysApi, abTools } from '~/agilebpm'
  import bizObjectInterface from './bizObjectInterface.vue'
  const { proxy } = abTools.useCurrentInstance()
  //页面用到的所有信息必须放在这个参数之下，不然双向绑定会有很多问题！
  const defaultInterfaceList = [
    {
      id: 1,
      alias: 'save',
      name: '保存',
      script: '',
      desc: '系统默认,保存接口',
      params: [{ name: 'data', required: true }],
      defualt: true,
    },
    {
      id: 2,
      alias: 'delete',
      name: '删除',
      script: '',
      desc: '系统默认,删除接口',
      params: [{ name: 'id', required: true }],
      defualt: true,
    },
    {
      id: 3,
      alias: 'get',
      name: '获取数据',
      script: '',
      desc: '系统默认,获取数据接口',
      params: [{ name: 'id', required: true }],
      defualt: true,
    },
  ]
  const info: any = reactive({
    data: {
      rel: {},
      persistenceType: 'db',
      perTypeConfigJson: {},
      interfaceList: defaultInterfaceList,
      saveIndex: 1,
      typeCode: proxy.$route.query.typeCode || '',
    }, //数据对象
    BizValidatorMap: null,
    tableMap: {},
    BizObjectRelFkType: [],
    BizObjectRelType: [],
    BizObjectRelTypeMap: {},
    BizDataPersistenceService: [],
    tableLoading: 0,
  })

  const formRef = ref<FormInstance>()

  bizApi.bizPattern.getAllBizValidator().then((data) => {
    info.BizValidatorMap = data
    console.info(info.BizValidatorMap)
  })

  sysApi.tools
    .getEnum('com.dstz.biz.api.object.BizObjectRelFkType', true)
    .then((resp) => {
      info.BizObjectRelFkType = resp.data
      console.info(info.BizObjectRelFkType)
    })

  sysApi.tools
    .getEnum('com.dstz.biz.api.object.BizObjectRelType', true)
    .then((resp) => {
      info.BizObjectRelType = resp.data
      info.BizObjectRelType.forEach((e: any) => {
        info.BizObjectRelTypeMap[e.key] = e.desc
      })
      console.info(info.BizObjectRelType)
    })

  sysApi.tools
    .InterFaceImpls('com.dstz.biz.object.persistence.BizDataPersistenceService')
    .then((resp) => {
      info.BizDataPersistenceService = resp
    })

  const selectTable = (data: Array<any>) => {
    info.data.rel.tableCode = data[0].code
    info.data.rel.type = 'main'
    info.data.rel.tableComment = data[0].comment
    info.data.rel.sync = true
    // 选择主表后、将子表全部置为空数组
    info.data.rel.children = []
    putTableMap(data[0].code)
  }

  const putTableMap = (code: string) => {
    const table = info.tableMap[code]
    if (table) {
      return
    }
    info.tableLoading++
    info.tableMap[code] = 'loading' //让后续来的不要加载了
    getData(`${bizApi.bizTable.BizTableGet}&code=${code}`).then((resp: any) => {
      info.tableLoading--
      info.tableMap[code] = resp.data
    })
  }
  info.putTableMap = putTableMap

  const addSubTable = (data: Array<any>, children: Array<any>) => {
    if (!data.length) {
      ElMessage({
        message: '请选择业务子表',
        type: 'warning',
      })
      return
    }

    const list = getList(info.data.rel)
    data.forEach((d) => {
      if (list.find((r: any) => r.tableCode == d.code)) {
        ElMessage({
          message: `业务表【${d.comment}（${d.code}）】已存在`,
          type: 'warning',
        })
        return
      }

      children.push({
        tableCode: d.code,
        tableComment: d.comment,
        fks: [
          {
            from: '',
            type: 'parentField',
            value: '',
          },
        ],
        type: 'oneToMany',
        children: [],
        sync: true,
      })
      putTableMap(d.code)
    })
  }
  info.addSubTable = addSubTable

  const addFk = (fks: Array<any>) => {
    fks.push({
      from: '',
      type: 'parentField',
      value: '',
    })
  }
  info.addFk = addFk

  const initTableMap = (rel: any) => {
    info.tableMap[rel.tableCode] = rel.table
    rel.children.forEach((c: any) => {
      initTableMap(c)
    })
    if (!info.data.interfaceList) {
      info.data.interfaceList = defaultInterfaceList
    }
  }

  const getList = (row: any) => {
    const list: any = []
    list.push(row)
    if (row.children) {
      row.children.forEach((child: any) => {
        const l = getList(child)
        l.forEach((c: any) => {
          list.push(c)
        })
      })
    }
    return list
  }
</script>
