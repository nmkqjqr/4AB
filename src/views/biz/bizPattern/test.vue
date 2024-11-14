<template>
  <el-container class="layout-container-demo">
    <el-header>
      <el-button
        :icon="Check"
        :loading="loading"
        type="primary"
        @click="save()"
      >
        {{ $abT('page.common.save', '保存') }}
      </el-button>
    </el-header>
    <el-divider class="dividermar" />
    <el-main style="margin-top: 10px">
      <el-scrollbar>
        <ab-form ref="abFormRef">
          <ab-form-global-setting
            label-suffix="："
            :label-width="120"
            :readonly-show-text="false"
          />
          <ab-form-group>
            <ab-form-item
              label="单行文本1"
              :permission="permission.jdzzb_AbBo.jdzzb_AbTable.onetext1"
              :span="12"
            >
              <ab-input
                v-model="data.jdzzb_AbBo.onetext1"
                desc="简单主子表-单行文本1"
                :permission="permission.jdzzb_AbBo.jdzzb_AbTable.onetext1"
                placeholder="请输入单行文本1"
                :rules="[{ max: 50, message: '最多可输入50个字符' }]"
              />
            </ab-form-item>
            <ab-card
              body-style="overflow:auto"
              :permission="tablePermission.jdzzb_AbBo.jdzzb_dynamic0_AbTable"
              shadow="hover"
              style="width: 100%; margin-bottom: 15px"
            >
              <template #header>
                <span class="title">行子表</span>
                <ab-sub-load
                  v-model="data.jdzzb_AbBo"
                  bo-code="jdzzb_AbBo"
                  fk="id"
                  :init-data="initData.jdzzb_AbBo.jdzzb_dynamic0_AbTable"
                  :init-first-row="false"
                  :permission="
                    tablePermission.jdzzb_AbBo.jdzzb_dynamic0_AbTable
                  "
                  :permission-type="permissionType"
                  :permission-value="permissionValue"
                  table-path="jdzzb_dynamic0_AbTableList"
                />
                <ab-sub-add
                  v-model="data.jdzzb_AbBo.jdzzb_dynamic0_AbTableList"
                  class="el-button el-button--primary"
                  :init-data="initData.jdzzb_AbBo.jdzzb_dynamic0_AbTable"
                  :permission="
                    tablePermission.jdzzb_AbBo.jdzzb_dynamic0_AbTable
                  "
                >
                  添加
                </ab-sub-add>
              </template>
              <table class="ab-table">
                <thead>
                  <tr>
                    <th
                      v-ab-permission="
                        permission.jdzzb_AbBo.jdzzb_dynamic0_AbTable.onetext2
                      "
                    >
                      <ab-required
                        :permission="
                          permission.jdzzb_AbBo.jdzzb_dynamic0_AbTable.onetext2
                        "
                      />
                      单行文本2
                    </th>
                    <th
                      v-ab-permission:edit="
                        tablePermission.jdzzb_AbBo.jdzzb_dynamic0_AbTable
                      "
                    >
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <ab-sub-tr-scope
                    v-slot="{ scopePermission, scopeTablePermission }"
                    v-for="(jdzzb_dynamic0_AbTable, index) in data.jdzzb_AbBo
                      .jdzzb_dynamic0_AbTableList"
                    :key="jdzzb_dynamic0_AbTable.$$abHashCode"
                    :permission="permission.jdzzb_AbBo.jdzzb_dynamic0_AbTable"
                    :table-permission="tablePermission"
                  >
                    <td
                      v-ab-permission="
                        permission.jdzzb_AbBo.jdzzb_dynamic0_AbTable.onetext2
                      "
                    >
                      <ab-input
                        v-model="jdzzb_dynamic0_AbTable.onetext2"
                        :desc="'行子表-单行文本2【第' + (index + 1) + '条】'"
                        :permission="scopePermission.onetext2"
                        placeholder="请输入单行文本2"
                        :rules="[{ max: 50, message: '最多可输入50个字符' }]"
                      />
                    </td>
                    <td
                      v-ab-permission:edit="
                        tablePermission.jdzzb_AbBo.jdzzb_dynamic0_AbTable
                      "
                    >
                      <ab-button-group>
                        <ab-sub-del
                          v-model="data.jdzzb_AbBo.jdzzb_dynamic0_AbTableList"
                          :index-obj="jdzzb_dynamic0_AbTable"
                          :permission="
                            scopeTablePermission.jdzzb_AbBo
                              .jdzzb_dynamic0_AbTable
                          "
                        >
                          移除
                        </ab-sub-del>
                      </ab-button-group>
                    </td>
                  </ab-sub-tr-scope>
                </tbody>
              </table>
            </ab-card>
          </ab-form-group>
        </ab-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
  import { bizApi, abTableMix, postData, getData } from '~/agilebpm'
  import { Search, Refresh, Plus, Delete, Check } from '@element-plus/icons-vue'
  //import abForm from '@/../agilebpm/package/ab-form/components/form-base/ab-form.vue'
  //import { CustFormBaseImportsUse } from '@/../agilebpm/package/ab-form/components/custFormBaseImports'
  export default {
    components: {
      //  abForm,
    },
    // extends: CustFormBaseImportsUse,   基础版无ab-form 源码，请注意用完注释掉
    setup() {
      const abFormRef = ref()
      return {
        Check,
        abFormRef,
      }
    },
    data() {
      return {
        loading: false,
        //业务数据
        data: {
          jdzzb_AbBo: {
            onetext1: '',
          },
        },
        //字段权限
        permission: {
          jdzzb_AbBo: {
            jdzzb_AbTable: {
              onetext1: 'b',
            },
            jdzzb_dynamic0_AbTable: {
              onetext2: 'w',
              parentId: 'w',
            },
          },
        },
        //表权限
        tablePermission: {
          jdzzb_AbBo: {
            jdzzb_AbTable: 'w',
            jdzzb_dynamic0_AbTable: 'w',
          },
        },
        //初始数据
        initData: {
          jdzzb_AbBo: {
            jdzzb_AbTable: {
              onetext1: '123',
            },
            jdzzb_dynamic0_AbTable: {
              onetext2: '',
            },
          },
        },
      }
    },
    mounted() {
      this.loadData()
    },
    methods: {
      save() {
        this.abFormRef.doValidate(true, '').then((result) => {
          if (result !== true) {
            return
          }
          this.loading = true
          postData('/ab-bpm/biz/bizPattern/saveTest', this.data).then(
            (resp) => {
              this.loading = false
              ElMessage({
                type: 'success',
                message: resp.message,
                duration: 500,
                onClose: () => {},
              })
            },
            () => {
              this.loading = false
            }
          )
        })
      },
      loadData() {
        getData('/ab-bpm/biz/bizPattern/loadTest', {
          id: '1803351424834752512',
        }).then(({ data }) => {
          this.data = data
        })
      },
    },
  }
</script>
