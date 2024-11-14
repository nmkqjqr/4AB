<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="LogMetadataList"
        :form-ref="formRef"
        :save-data="info.data"
        :url="sysApi.sysAuditlog.logMetadataSave"
      />
      <ab-load v-model="info.data" :url="sysApi.sysAuditlog.logMetadataGet" />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="250px"
          :model="info.data"
          :status-icon="false"
        >
          <el-form-item
            label="分类"
            placeholder="请输入分类"
            prop="typeCode"
            :rules="[{ required: true, message: '必填' }]"
          >
            <ab-select-tree
              v-model="info.data.typeCode"
              :operation="false"
              type-code="auditLogType"
            />
          </el-form-item>
          <el-form-item
            label="动作"
            placeholder="请输入动作"
            prop="action"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="info.data.action" />
          </el-form-item>
          <el-form-item
            label="记录接口地址"
            placeholder="请输入记录接口地址"
            prop="path"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="info.data.path" />
          </el-form-item>
          <el-form-item
            label="记录条件(SPEL表达式)"
            placeholder="请输入记录条件"
            prop="predicateExpr"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="info.data.predicateExpr" />
          </el-form-item>
          <el-form-item
            label="业务主键获取表达式(SPEL表达式)"
            placeholder="请输入主键获取表达式"
            prop="bizIdExpr"
          >
            <el-input v-model="info.data.bizIdExpr" />
          </el-form-item>
          <el-form-item
            label="记录数据获取表达式(SPEL表达式)"
            placeholder="请输入记录数据获取表达式"
            prop="dataExpr"
          >
            <el-input v-model="info.data.dataExpr" />
          </el-form-item>
          <el-form-item
            label="记录日志描述模板(SPEL表达式)"
            placeholder="请输入记录日志描述模板表达式"
            prop="descriptionTpl"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="info.data.descriptionTpl" type="textarea" />
          </el-form-item>
        </el-form>
        <el-divider style="margin-top: 70px">
          <el-tooltip placement="right-end">
            <template #content>
              <p>
                语法参考链接（
                <a
                  href="https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/expressions.html"
                >
                  https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/expressions.html）
                </a>
                <br />
              </p>
              <h4>内置变量</h4>

              <dl>
                <dt><code>currentUser</code></dt>
                <dd>当前操作用户; 示例：#{#currentUser.getFullname()}</dd>
                <dt><code>requestHeader</code></dt>
                <dd>请求头；示例：#{#requestHeader['Referer'][0]}</dd>
                <dt><code>requestMethod</code></dt>
                <dd>请求方式（GET,POST,PUT,DELETE)；示例：#{#requestMethod}</dd>
                <dt><code>requestParam</code></dt>
                <dd>
                  请求参数，可通过该参数名获取到请求参数，@PathVariable
                  标注的参数也通过该项获取；示例：#{#requestParam["account"][0]}
                </dd>
                <dt><code>requestTime</code></dt>
                <dd>
                  请求时间；示例：#{#dateFormat(#requestTime, "yyyy-MM-dd
                  HH:mm:ss")}
                </dd>
                <dt><code>requestBody</code></dt>
                <dd>
                  请求体，对标注@RequestBody对象参数获取；示例：#{#requestBody["id"]}
                </dd>
                <dt><code>responseBody</code></dt>
                <dd>响应结果; 示例：#{#responseBody.data}</dd>
                <dt><code>responseTime</code></dt>
                <dd>
                  响应时间；示例：#{#dateFormat(#responseTime, "yyyy-MM-dd
                  HH:mm:ss")}
                </dd>
                <dt><code>durationMs</code></dt>
                <dd>处理耗时毫秒；示例：#{#durationMs}</dd>
              </dl>
              <h4>内置函数</h4>
              <dt><code>isEmpty</code></dt>
              <dd>
                是否为空，支持字符串、object、map、collection；示例：#{#isEmpty(#requestBody['id'])
                ? '是' : '否'}
              </dd>
              <dt><code>dateFormat</code></dt>
              <dd>
                日期格式化,格式：#{#dateFormat(date, datePattern)},
                示例：#{#dateFormat(#responseTime, "yyyy-MM-dd HH:mm:ss")}
              </dd>
              <dt><code>strContains</code></dt>
              <dd>
                字符串包含，格式：#{#strContains(seq, searchSeq)},
                示例：#{#strContains(#requestHeader['Referer'][0], 'localhost')
                ? '是' : '否'}
              </dd>
            </template>
            <el-button>
              测试SPEL表达式
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-button>
          </el-tooltip>
        </el-divider>
        <div style="margin-top: 50px">
          <div>
            <div style="margin-top: 30px">
              <el-form
                ref="formRef2"
                label-suffix="："
                label-width="250px"
                :model="info.testExpressionData"
                :status-icon="false"
              >
                <el-form-item label="请求参数（JSON字符串）">
                  <el-input v-model="info.testExpressionData.requestParam" />
                </el-form-item>
                <el-form-item label="请求体（JSON字符串）">
                  <el-input v-model="info.testExpressionData.requestBody" />
                </el-form-item>
                <el-form-item label="响应体（JSON字符串）">
                  <el-input v-model="info.testExpressionData.responseBody" />
                </el-form-item>
                <el-form-item label="测试表达式">
                  <el-input
                    v-model="info.testExpressionData.expressionString"
                  />
                </el-form-item>
                <el-form-item label="测试结果" prop="result">
                  <el-input v-model="info.testExpressionData.result" />
                </el-form-item>
              </el-form>
              <el-button
                v-ab-btn-rights:auditLogMetadata_test
                style="margin-left: 250px"
                type="primary"
                @click="testExpression"
              >
                测试
              </el-button>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { sysApi, abTools } from '~/agilebpm'

  const formRef = ref()
  const info: any = reactive({
    data: {
      action: '',
      path: '',
      predicateExpr: '',
      bizIdExpr: '',
      dataExpr: '',
      descriptionTpl: '',
      traceId: '',
      bizId: '',
      data: '',
      typeCode: '',
    },
    testExpressionData: {
      requestParam: '{"account":["admin"]}',
      requestBody: '{"account": "admin"}',
      responseBody: '{"code":"200","isOk":true,"msg":"操作成功"}',
      expressionString: 'hello #{#requestParam["account"][0]}',
      result: '',
    },
  })
  const testExpression = () => {
    sysApi.sysAuditlog
      .logMetadataTestExpression(info.testExpressionData)
      .then((result: any) => {
        info.testExpressionData.result = result.data
      })
  }
  const { proxy } = abTools.useCurrentInstance()
  onMounted(() => {
    info.data.typeCode = proxy.$route.query.typeCode
  })
</script>
