<template>
  <div>
    <el-button
      v-if="props.boCode"
      :icon="View"
      size="small"
      style="margin-left: 5px"
      type="primary"
      @click="openBo"
    >
      便捷复制
    </el-button>

    <!--业务数据对话框-->
    <el-dialog
      v-model="info.dialogVisible"
      destroy-on-close
      :title="`模板可用字段`"
      width="1000px"
    >
      <el-alert
        :closable="false"
        title="使用字段必须是从表格复制出来的内容"
        type="warning"
      />
      <el-tabs type="border-card">
        <el-tab-pane label="表单数据">
          <table
            v-if="info.bo.rel"
            border="1"
            style="width: 100%; border-collapse: collapse"
          >
            <thead>
              <tr>
                <th>字段名称</th>
                <th colspan="2">字段代码</th>
              </tr>
            </thead>
            <!--主表字段-->
            <tr
              v-for="column in info.bo.rel.table.columnsWithoutPrimary"
              :key="column.code"
            >
              <td>
                {{ column.comment }}
                <el-tag effect="plain">字段</el-tag>
              </td>
              <td colspan="2">
                {{ `\$\{data.${info.bo.code}.${column.code}\}` }}
                <el-link
                  :icon="DocumentCopy"
                  style="margin-left: 5px"
                  title="复制"
                  @click="copyStr(`\$\{data.${info.bo.code}.${column.code}\}`)"
                />
              </td>
            </tr>

            <!--子表 一对一-->
            <tbody
              v-for="rel in info.bo.rel.children.filter(
                (r) => r.type == 'oneToOne'
              )"
              :key="rel.tableCode"
            >
              <tr
                v-for="(column, index) in rel.table.columnsWithoutPrimary"
                :key="column.code"
              >
                <td
                  v-if="index == 0"
                  :rowspan="rel.table.columnsWithoutPrimary.length"
                >
                  {{ rel.tableComment }}
                  <el-tag effect="plain" type="warning">
                    {{ `${rel.typeDesc}子表` }}
                  </el-tag>
                </td>
                <td>
                  {{ column.comment }}
                  <el-tag effect="plain">字段</el-tag>
                </td>
                <td colspan="2">
                  {{
                    `\$\{data.${info.bo.code}.${rel.tableCode}.${column.code}\}`
                  }}
                  <el-link
                    :icon="DocumentCopy"
                    style="margin-left: 5px"
                    title="复制"
                    @click="
                      copyStr(
                        `\$\{data.${info.bo.code}.${rel.tableCode}.${column.code}\}`
                      )
                    "
                  />
                </td>
              </tr>
            </tbody>

            <!--子表 一对多-->
            <tbody
              v-for="rel in info.bo.rel.children.filter(
                (r) => r.type == 'oneToMany'
              )"
              :key="rel.tableCode"
            >
              <tr>
                <td :rowspan="rel.table.columnsWithoutPrimary.length + 2">
                  {{ rel.tableComment }}
                  <el-tag effect="plain" type="warning">
                    {{ `${rel.typeDesc}子表` }}
                  </el-tag>
                </td>
                <td>
                  子表循环开始
                  <el-tag effect="plain" type="warning">特殊</el-tag>
                </td>
                <td>
                  {{ `\$\{sub:${rel.tableCode}List\}` }}
                  <el-link
                    :icon="DocumentCopy"
                    style="margin-left: 5px"
                    title="复制"
                    @click="copyStr(`\$\{sub:${rel.tableCode}List\}`)"
                  />
                </td>
              </tr>

              <tr
                v-for="column in rel.table.columnsWithoutPrimary"
                :key="column.code"
              >
                <td>
                  {{ column.comment }}
                  <el-tag effect="plain">字段</el-tag>
                </td>
                <td>
                  {{ `\$\{item.${column.code}\}` }}
                  <el-link
                    :icon="DocumentCopy"
                    style="margin-left: 5px"
                    title="复制"
                    @click="copyStr(`\$\{item.${column.code}\}`)"
                  />
                </td>
              </tr>

              <tr>
                <td>
                  子表循环结束
                  <el-tag effect="plain" type="warning">特殊</el-tag>
                </td>
                <td>
                  {{ `\$\{end\}` }}
                  <el-link
                    :icon="DocumentCopy"
                    style="margin-left: 5px"
                    title="复制"
                    @click="copyStr(`\$\{end\}`)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane label="系统字段">
          <table
            v-if="info.bo.rel"
            border="1"
            style="width: 100%; border-collapse: collapse"
          >
            <thead>
              <tr>
                <th>字段名称</th>
                <th colspan="2">字段代码</th>
              </tr>
            </thead>
            <tbody>
              <!--当前用户-->
              <tr>
                <td rowspan="3">当前用户</td>
                <td>
                  用户ID
                  <el-tag effect="plain">字段</el-tag>
                </td>
                <td>
                  ${currentUserId}
                  <el-link
                    :icon="DocumentCopy"
                    style="margin-left: 5px"
                    title="复制"
                    @click="copyStr(`\$\{currentUserId\}`)"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  用户账户
                  <el-tag effect="plain">字段</el-tag>
                </td>
                <td>
                  ${currentUserAccount}
                  <el-link
                    :icon="DocumentCopy"
                    style="margin-left: 5px"
                    title="复制"
                    @click="copyStr(`\$\{currentUserAccount\}`)"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  用户名称
                  <el-tag effect="plain">字段</el-tag>
                </td>
                <td>
                  ${currentUserName}
                  <el-link
                    :icon="DocumentCopy"
                    style="margin-left: 5px"
                    title="复制"
                    @click="copyStr(`\$\{currentUserName\}`)"
                  />
                </td>
              </tr>
              <!--当前组织-->
              <tr>
                <td rowspan="3">当前组织</td>
                <td>
                  组织ID
                  <el-tag effect="plain">字段</el-tag>
                </td>
                <td>
                  ${currentOrgId}
                  <el-link
                    :icon="DocumentCopy"
                    style="margin-left: 5px"
                    title="复制"
                    @click="copyStr(`\$\{currentOrgId\}`)"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  组织名称
                  <el-tag effect="plain">字段</el-tag>
                </td>
                <td>
                  ${currentOrgName}
                  <el-link
                    :icon="DocumentCopy"
                    style="margin-left: 5px"
                    title="复制"
                    @click="copyStr(`\$\{currentOrgName\}`)"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  组织编码
                  <el-tag effect="plain">字段</el-tag>
                </td>
                <td>
                  ${currentOrgCode}
                  <el-link
                    :icon="DocumentCopy"
                    style="margin-left: 5px"
                    title="复制"
                    @click="copyStr(`\$\{currentOrgCode\}`)"
                  />
                </td>
              </tr>
              <!--其他系统字段-->
              <tr>
                <td>
                  当前时间
                  <el-tag effect="plain">字段</el-tag>
                </td>
                <td colspan="2">
                  ${curDate}
                  <el-link
                    :icon="DocumentCopy"
                    style="margin-left: 5px"
                    title="复制"
                    @click="copyStr(`\$\{curDate\}`)"
                  />
                </td>
              </tr>
              <!--自定义复制-->
              <tr>
                <td>自定义复制</td>
                <td colspan="2">
                  <el-input
                    v-model="info.diy"
                    placeholder="请输入自定义复制属性"
                  />
                  <el-link
                    :icon="DocumentCopy"
                    style="margin-left: 5px"
                    title="复制"
                    @click="copyStr(info.diy)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="info.dialogVisible = false">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { postData, bizApi, abUploadFile, abTools, abUtil } from '~/agilebpm'
  import { ElMessage } from 'element-plus'
  import { View, DocumentCopy } from '@element-plus/icons-vue'

  const props = defineProps({
    boCode: {
      type: String,
      required: true,
    },
  })

  //页面用到的所有信息必须放在这个参数之下，不然双向绑定会有很多问题！
  const info: any = reactive({
    data: {}, //数据对象
    dialogVisible: false,
    boJson: {},
    bo: {
      name: '',
    },
    diy: '',
  })

  const openBo = () => {
    bizApi.bizObject.getBizObject(props.boCode).then(({ data }) => {
      info.bo = data
      info.boJson = getJson(data.rel)
      info.dialogVisible = true
    })
  }

  const getJson = (rel: any) => {
    const json = {}
    rel.table.columns.forEach((c: any) => {
      if (rel.type == 'oneToMany') {
        json[c.comment] = ` \${item.${c.code}} `
      } else {
        json[c.comment] = ` \${data.${info.bo.code}.${c.code}} `
      }
    })
    rel.children.forEach((r: any) => {
      if (r.type == 'oneToMany') {
        //json[`${r.tableCode}List`] = [getJson(r)]
        json[`${r.tableComment}:前`] = ` $sub:${r.tableCode}List `
        json[`${r.tableComment}`] = [getJson(r)]
        json[`${r.tableComment}:后`] = ` $end `
      } else {
        json[`${r.tableCode}`] = getJson(r)
      }
    })

    if (rel.type == 'main') {
      return JSON.stringify(json, null, '\t')
    }

    return json
  }

  const copyStr = (str: any) => {
    abUtil.handleClipboard(str)
  }
</script>
