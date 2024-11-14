<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query['a.typeCode$VIN']"
          type-code="biz"
          @node-click="searchResetPage()"
        />
      </el-aside>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <!--查询区域-->
            <el-row>
              <el-col class="top-panel" :span="24">
                <el-form ref="queryForm" :inline="true" :model="query">
                  <el-form-item
                    label="名称"
                    label-width="62px"
                    prop="a.name$VLK"
                  >
                    <el-input
                      v-model="query['a.name$VLK']"
                      placeholder="请输入名称"
                    />
                  </el-form-item>
                  <el-form-item
                    label="编码"
                    label-width="62px"
                    prop="a.code$VLK"
                  >
                    <el-input
                      v-model="query['a.code$VLK']"
                      placeholder="请输入编码"
                    />
                  </el-form-item>
                  <el-form-item
                    label="业务对象编码"
                    label-width="118px"
                    prop="a.boCode$VLK"
                  >
                    <el-input
                      v-model="query['a.boCode$VLK']"
                      placeholder="业务对象编码"
                    />
                  </el-form-item>

                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      查询
                    </el-button>
                    <el-button :icon="Refresh" @click="reset()">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <!--按钮区域-->
            <el-button
              v-ab-btn-rights:bizFormDesign_sim
              :icon="Plus"
              type="primary"
              @click="diy"
            >
              简单表单设计
            </el-button>
            <el-popover
              content="专业表单基于业务对象，要求使用者了解数据结构。 专业表单可应用于跨系统的流程协作，支持任意数据结构，如多对多、N层子表等复杂场景。"
              placement="right"
              title="提示"
              trigger="hover"
              :width="300"
            >
              <template #reference>
                <span>
                  <ab-cust-dialog
                    v-ab-btn-rights:bizFormDesign_bpm
                    dialog-key="boSelector"
                    :icon="Plus"
                    style="margin-left: 3px"
                    type="primary"
                    @ok="add"
                  >
                    专业表单设计
                  </ab-cust-dialog>
                </span>
              </template>
            </el-popover>

            <el-button
              v-ab-btn-rights:bizFormDesign_genCode
              :disabled="!selectedData || selectedData.length == 0"
              style="margin-left: 5px"
              type="primary"
              @click="openDialogFormVisible(selectedData)"
            >
              <el-icon class="el-icon--left">
                <Files />
              </el-icon>
              代码生成
            </el-button>
            <!-- 导入 -->
            <span style="margin-left: 5px">
              <span v-ab-btn-rights:bizFormDesign_import>
                <ab-upload-dialog
                  accept=".form"
                  :after-save="afterImp"
                  :data="uploadData"
                  :search="search"
                  :timeout="2 * 60 * 1000"
                />
              </span>
            </span>
            <el-button
              v-ab-btn-rights:bizFormDesign_export
              :disabled="!selectedData || selectedData.length == 0"
              style="margin-left: 5px"
              type="primary"
              @click="exportXml()"
            >
              导出
            </el-button>
            <el-button
              v-ab-btn-rights:bizFormDesign_del
              :disabled="!selectedData || selectedData.length == 0"
              :icon="Delete"
              type="danger"
              @click="delBySeletedIds(bizApi.bizForm.BizFormDesignRemove)"
            >
              批量删除
            </el-button>
          </div>
          <!--列表区域-->
          <ab-table
            ref="abTable"
            v-model="selectedData"
            :checkable="true"
            :height="tableHeight"
            highlight-current-row
            is-have-tree
            :query-param="query"
            row-key="id"
            :url="bizApi.bizForm.BizFormDesignListVOJson"
          >
            <ab-column label="名称" min-width="200" prop="name" />
            <ab-column label="编码" min-width="120" prop="code" />
            <ab-column label="业务对象编码" min-width="180" prop="boCode" />
            <ab-column label="业务对象" min-width="160" prop="boName" />
            <ab-column
              ab-text-formatter="byBo-专业-success-dark|diyBo-简单-warning-dark"
              label="模式"
              prop="mode"
              width="80"
            />
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="更新时间"
              prop="updateTime"
              width="150"
            />
            <ab-column label="更新人" min-width="120" prop="operator" />
            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="320"
            />
            <template #edit="{ scope }">
              <el-button
                v-ab-btn-rights:bizFormDesign_design
                text
                type="primary"
                @click="open(scope.row)"
              >
                设计
              </el-button>
              <el-button
                v-if="scope.row.pcFormCode"
                text
                type="primary"
                @click="codePc(scope.row.pcFormCode)"
              >
                PC表单
              </el-button>
              <el-button
                v-if="scope.row.mbFormCode"
                text
                type="primary"
                @click="codeMb(scope.row.mbFormCode)"
              >
                手机表单
              </el-button>
              <el-dropdown>
                <el-button :icon="ArrowDown" text type="primary">
                  更多
                  <!-- <el-icon class="el-icon--right"><ArrowDown /></el-icon> -->
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <span v-if="scope.row.pcFormCode">
                      <el-dropdown-item @click="codePc(scope.row.pcFormCode)">
                        PC端源码
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="previewPc(scope.row.pcFormCode)"
                      >
                        预览PC端
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <biz-permission
                          :bo-codes="scope.row.boCode"
                          :form-code="scope.row.pcFormCode"
                          type="form"
                          :value="scope.row.pcFormCode"
                        >
                          PC端权限
                        </biz-permission>
                      </el-dropdown-item>
                    </span>
                    <span v-if="scope.row.mbFormCode">
                      <!-- <el-dropdown-item
                        divided
                        @click="previewMb(scope.row.mbFormCode)"
                      >
                        预览移动端
                      </el-dropdown-item> -->
                      <el-dropdown-item
                        divided
                        @click="codeMb(scope.row.mbFormCode)"
                      >
                        移动端源码
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <biz-permission
                          :bo-codes="scope.row.boCode"
                          :form-code="scope.row.mbFormCode"
                          type="form"
                          :value="scope.row.mbFormCode"
                        >
                          移动端权限
                        </biz-permission>
                      </el-dropdown-item>
                    </span>
                    <span v-ab-btn-rights:bizFormDesign_export>
                      <el-dropdown-item
                        divided
                        @click="exportXml(scope.row.code)"
                      >
                        导出
                      </el-dropdown-item>
                    </span>
                    <span v-ab-btn-rights:bizFormDesign_design>
                      <el-dropdown-item @click="copy(scope.row)">
                        <el-popover
                          placement="right"
                          title="提示"
                          trigger="hover"
                          :width="300"
                        >
                          <template #reference>复制</template>
                          <span v-if="scope.row.mode == 'diyBo'">
                            会连同业务对象一并复制
                          </span>
                          <span v-else>共用当前表单业务对象</span>
                        </el-popover>
                      </el-dropdown-item>
                    </span>

                    <span v-ab-btn-rights:bizFormDesign_del>
                      <el-dropdown-item
                        @click="
                          sendAction(
                            bizApi.bizForm.BizFormDesignRemove + scope.row.id,
                            '确定删除' + scope.row.name + '吗?'
                          )
                        "
                      >
                        删除
                      </el-dropdown-item>
                    </span>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>

    <el-dialog
      v-model="dialogFormVisible"
      :before-close="
        () => {
          form = {
            packagePrefix: '',
            moduleName: '',
            authorName: '',
            authorEmail: '',
            enableCtrl: false,
            enableService: false,
            formList: '',
          }
          dialogFormVisible = false
        }
      "
      destroy-on-close
      title="代码生成配置"
      width="850px"
    >
      <el-form ref="formRef" label-suffix="：" label-width="120" :model="form">
        <el-form-item label="已选表单">
          <el-tag v-for="item in selectedData" :key="item.id">
            {{ item.name }}
          </el-tag>
        </el-form-item>
        <el-form-item
          label="包名"
          prop="packagePrefix"
          :rules="[
            {
              required: true,
              message: $abT('page.common.required', '必填'),
            },
          ]"
        >
          <el-input
            v-model="form.packagePrefix"
            placeholder="请输入包名前缀, eg: com.dstz.form"
          />
        </el-form-item>
        <!-- <el-form-item
          label="模块名"
          prop="moduleName"
          :rules="[
            {
              required: true,
              message: $abT('page.common.required', '必填'),
            },
          ]"
        >
          <el-input
            v-model="form.moduleName"
            placeholder="请输入模块名, eg: form"
          />
        </el-form-item> -->
        <el-form-item label="作者姓名">
          <el-input v-model="form.author" placeholder="请输入作者姓名" />
        </el-form-item>
        <el-form-item label="作者邮箱">
          <el-input v-model="form.email" placeholder="请输入您的邮箱" />
        </el-form-item>
        <!-- <el-form-item>
          <template #label>
            <el-tooltip
              class="box-item"
              content="生成持久化服务接口可以在编辑页保存时植入业务逻辑，并修改业务对象持久化方式，使用代码方式保存、更新业务对象等"
              effect="dark"
              placement="top-start"
            >
              <el-icon style="width: 85px; font-style: normal">
                <QuestionFilled />
                其他配置：
              </el-icon>
            </el-tooltip>
          </template>
          <el-checkbox v-model="form.enableCtrl">
            Controller持久化业务对象服务接口
          </el-checkbox>
          <el-checkbox v-model="form.enableService">
            Service持久化业务对象服务接口
          </el-checkbox>
        </el-form-item> -->

        <div class="section">
          <p>
            后端代码：
            <el-tag>src</el-tag>
            目录，可以直接复制到后端工程根目录
          </p>
          <p>
            前端代码：
            <el-tag>views</el-tag>
            目录，开发设计平台放入合适模块目录中
            <el-tag>agilebpm-ui-v5\src\views</el-tag>
          </p>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">生 成</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import { tokenTableName } from '@/config'
  import { getToken } from '@/utils/token'
  import BizPermission from '@/views/biz/bizObject/bizPermission.vue'
  import {
    ArrowDown,
    Files,
    Plus,
    Refresh,
    Search,
  } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import {
    abDictTree,
    abTableMix,
    abTools,
    abUploadDialog,
    bizApi,
    sysApi,
  } from '~/agilebpm'

  export default {
    components: { BizPermission, abDictTree, abUploadDialog },
    mixins: [abTableMix],
    setup() {
      return {
        bizApi,
        abDictTree,
        Search,
        Refresh,
        Plus,
        ArrowDown,
        sysApi,
        abTools,
        abUploadDialog,
      }
    },
    data() {
      return {
        formRef: '',
        dialogFormVisible: false,
        form: {
          packagePrefix: '',
          moduleName: '',
          author: '',
          email: '',
          enableCtrl: false,
          enableService: false,
          formList: '',
        },
        mobileUrl: '',
        uploadData: {
          btnText: '导入',
          tip: '请选择.form文件',
          url: bizApi.bizForm.BizFormDesignImportXml,
        },
        proxy: null,
      }
    },
    created() {
      const { proxy } = abTools.useCurrentInstance()
      this.proxy = proxy
      this.getMobileUrl()
    },
    methods: {
      openDialogFormVisible(selectedData) {
        if (selectedData && selectedData.length > 0) {
          let errorName = ''
          for (const i in selectedData) {
            if (!selectedData[i].boCode) {
              errorName = `${errorName}【${selectedData[i].name}】，`
            }
          }
          if (errorName) {
            ElMessage.error(
              `表单${errorName.slice(0, -1)}等未生成表单，无法生成代码！`
            )
          } else {
            this.dialogFormVisible = true
          }
        }
      },
      submitForm() {
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            this.form.formList = this.selectedData
            bizApi.bizForm.downloadGenCode(this.form).then(() => {})
            // 这里添加提交表单的代码
          } else {
            console.error('表单验证失败')
            return false
          }
        })
      },

      add(data) {
        if (data.length == 0) {
          ElMessage({
            message: '请选择业务对象',
            type: 'warning',
          })
          return
        }
        window.open(
          abTools.getResolveUrl(
            `/formDesigner?boCode=${data[0].code}&typeCode=${
              this.query['a.typeCode$VEQ'] || ''
            }`,
            this.proxy
          )
        )
      },
      diy() {
        window.open(
          abTools.getResolveUrl(
            `/formDesigner?mode=diyBo&typeCode=${
              this.query['a.typeCode$VEQ'] || ''
            }`,
            this.proxy
          )
        )
      },
      open(row) {
        const url = abTools.getResolveUrl(
          `/formDesigner?id=${row.id}&mode=${row.mode}&typeCode=${
            this.query['a.typeCode$VEQ'] || ''
          }`,
          this.proxy
        )

        window.open(url)
      },
      codePc(code) {
        window.open(
          abTools.getResolveUrl(`/bizFormCode?code=${code}`, this.proxy)
        )
      },
      codeMb(code) {
        window.open(
          abTools.getResolveUrl(`/bizFormCode?type=mb&code=${code}`, this.proxy)
        )
      },
      previewMb(code) {
        const token = getToken()
        window.open(
          abTools.getResolveUrl(
            `${this.mobileUrl}/biz/form/preview?code=${code}&${tokenTableName}=${token}`,
            this.proxy
          )
        )
      },
      previewPc(code) {
        window.open(
          abTools.getResolveUrl(`/bizForm/preview/${code}?del=1`, this.proxy)
        )
      },
      copy(row) {
        window.open(
          abTools.getResolveUrl(
            `/formDesigner?copyId=${row.id}&mode=${row.mode}&typeCode=${
              this.query['a.typeCode$VEQ'] || ''
            }`,
            this.proxy
          )
        )
      },
      exportXml(code) {
        if (!code) {
          code = this.selectedData.map((d) => d.code).join(',')
        }
        bizApi.bizForm.exportXml(code).then(({ data }) => {
          let name
          if (!code.includes(',')) {
            name = data[code].design.name
          } else {
            name = `${this.selectedData[0].name}等${this.selectedData.length}个表单`
          }
          abTools.downImgFile(`${name}.form`, JSON.stringify(data))
        })
      },
      async getMobileUrl() {
        this.mobileUrl = await sysApi.property.getMobileUrl()
      },
      afterImp(result) {
        if (!result.isOk) {
          ElMessage({
            message: '导入失败',
            type: 'error',
          })
          return
        }
        ElMessage({
          message: result.data,
          type: 'success',
          dangerouslyUseHTMLString: true,
        })
      },
    },
  }
</script>

<style>
  body {
    padding: 0;
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    background-color: #f4f4f4;
  }

  .content-wrapper {
    width: 50%;
    padding: 20px;
    margin: 0 0 0 20%;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .section {
    padding: 15px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
    border-left: 4px solid #007bff;
  }

  .section p {
    margin-left: 22px;
    font-size: 1em; /* 根据需要调整段落字体大小 */
    line-height: 1.6; /* 优化段落行距 */
  }
</style>
