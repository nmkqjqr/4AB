<template>
  <el-container class="layout-container-demo">
    <el-header>
      <router-link
        v-if="readOnly !== '1'"
        :to="{
          name: info.routerName,
        }"
      >
        <el-button :icon="Back">返回</el-button>
      </router-link>

      <ab-save
        v-else
        :back-name="info.routerName"
        :before-save-fn="beforeSave"
        :form-ref="formRef"
        :save-data="info.data"
        :url="cmsApi.document.cmsDocumentSaveUrl"
        @after-save="afterSave"
      />
      <ab-load v-model="info.data" :url="cmsApi.document.cmsDocumentGetUrl" />
    </el-header>

    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="info.data"
          :status-icon="false"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item
                label="文档名"
                prop="name"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-input
                  v-model="info.data.name"
                  :disabled="readOnly !== '1'"
                  placeholder="请输入名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="所属目录"
                prop="parentId"
                :rules="[{ required: true, message: '必填' }]"
              >
                <ab-select-tree
                  v-if="info.documentTree.length > 0"
                  v-model="info.data.parentId"
                  :disabled="readOnly !== '1'"
                  :expand-on-click-node="false"
                  return-code="id"
                  :tree-data="info.documentTree"
                  @select-data="getSelectData"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1" />
            <el-col :span="3">
              <el-form-item
                label="是否权限继承"
                prop="extend"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-switch
                  v-model="info.data.extend"
                  :disabled="readOnly !== '1'"
                  :rules="[{ required: true, message: '必填' }]"
                  @change="info.authorizationData.authorizationList = []"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="无权限可见"
                prop="visible"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-switch
                  v-model="info.data.visible"
                  :active-value="1"
                  :disabled="readOnly !== '1'"
                  :inactive-value="0"
                  :rules="[{ required: true, message: '必填' }]"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="!info.data.extend" label="选择权限" prop="extend">
            <div v-if="info.authorizationData.authorizationList.length > 0">
              <el-tag
                v-for="item in info.authorizationData.authorizationList"
                :key="item"
              >
                {{ item.rightsIdentityName }}
              </el-tag>
            </div>
            <el-button
              :disabled="readOnly !== '1'"
              :icon="User"
              :style="
                info.authorizationData.authorizationList.length > 0
                  ? 'margin-left: 10px'
                  : ''
              "
              type="primary"
              @click="openAuthorizationDialog()"
            >
              授权
            </el-button>
          </el-form-item>

          <el-form-item label="上传">
            <ab-upload-file
              v-if="id && info.data.files && info.data.files.length > 0"
              v-model="info.data.files"
              dic-code="document"
              :disabled="readOnly !== '1'"
              size="small"
            />
            <ab-upload-file
              v-else
              v-model="info.data.files"
              dic-code="document"
              :disabled="readOnly !== '1'"
              size="small"
            />
          </el-form-item>
          <el-form-item
            label="概要"
            prop="outline"
            :rules="[{ max: 100, message: '概要不能超过100个字符' }]"
          >
            <template #label>
              <div>
                概要
                <el-popover
                  content="若未填写概要, 则从内容或附件中自动获取"
                  placement="bottom-start"
                  trigger="hover"
                  :width="200"
                >
                  <template #reference>
                    <el-icon><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-input
              v-model="info.data.outline"
              :disabled="readOnly !== '1'"
              placeholder="请输入概要"
            />
          </el-form-item>
          <el-form-item v-if="!(readOnly === '1')" label="文档" prop="content">
            <div v-html="info.data.content"></div>
          </el-form-item>

          <el-form-item v-else label="文档" prop="content">
            <ab-rich-editor
              v-model="info.data.content"
              :disabled="readOnly !== '1'"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
    <ab-authorization
      ref="authorizationRef"
      v-model="info.authorizationDialogVisible"
      :authorization-list="info.authorizationData.authorizationList"
      :authorization-type="info.authorizationData.rightsObject"
      :rights-code="info.authorizationData.rightsTarget"
      :save-flsg="false"
      @authorization-data="getAuthorizationList"
    />
  </el-container>
</template>

<script setup lang="ts">
  import {
    abRichEditor,
    cmsApi,
    abUploadFile,
    abAuthorization,
    sysApi,
  } from '~/agilebpm'
  import { ElMessage } from 'element-plus'
  import { Back, User, QuestionFilled } from '@element-plus/icons-vue'

  const info: any = reactive({
    //窗口返回时的页面名称
    routerName: '',
    //授权窗口展示标记
    authorizationDialogVisible: false,
    //授权最终的数据
    authorizationData: {
      rightsObject: 'DOCUMENT',
      rightsTarget: '',
      authorizationList: [] as any[],
    } as any,
    //下拉树的数据对象
    documentTree: {},
    //最终保存的文档
    data: {
      id: '',
      name: '',
      parentId: '',
      createOrgName: '',
      visible: 1,
      type: 'doc',
      extend: true,
      outline: '',
      content: '',
      readNum: 0,
      borrowNum: 0,
      rightsId: '',
      rightsName: '',
      secretLevel: '1',
      files: '',
      fileSize: 0,
    },
  })

  const formRef = ref()
  const authorizationRef = ref()

  //获取列表页选中目录的信息
  const pid = getCurrentInstance()?.proxy?.$route.query.parentId
  if (pid && pid != '0') {
    info.data.parentId = pid
  }

  console.log('123132132', pid)
  //获取进入编辑页的源头类型
  const source = getCurrentInstance()?.proxy?.$route.query.source

  info.routerName = source
  //获取编辑页ID
  const id = getCurrentInstance()?.proxy?.$route.query.id

  info.authorizationData.rightsTarget = id
  //是否只读的标记
  const readOnly = getCurrentInstance()?.proxy?.$route.query.type

  sysApi.sysAuthorization
    .getAuthorization(info.authorizationData)
    .then((r: any) => {
      info.authorizationData.authorizationList = r.data
      info.dialogVisibleloading = false
    })

  //获取下拉树组件返回的数据
  const getSelectData = (row: any) => {
    info.data.parentId = row.id
    info.data.parentName = row.name
  }

  cmsApi.document.fieldListJson(source == 'SuperDocumentList').then((rel) => {
    const treeData = []
    treeData.push({
      id: '0',
      name: '所有数据',
      children: rel.data,
      rightsId: '0',
    })
    info.documentTree = treeData
  })

  //从授权组件获取未保存的暂存数据
  const getAuthorizationList = (dataList: any) => {
    info.authorizationData.authorizationList = dataList
  }

  //打开授权对话框
  const openAuthorizationDialog = () => {
    info.authorizationData.rightsTarget = info.data.id
    info.authorizationDialogVisible = true
  }

  //保存文档前校验文件和补充其他内容
  const beforeSave = () => {
    //校验文档和附件不能同时为空
    if (validate()) {
      return false
    }
    //填充富文本大小
    info.data.fileSize = info.data.content ? info.data.content.length : 0
    let title = info.data.outline
    //如果标题未填写，则从内容中或文件中取前100位
    if (!info.data.outline || info.data.outline.length == 0) {
      //如果有内容，则从内容中获取标题， 没有则从附件中获取标题
      if (info.data.content && info.data.content.length > 0) {
        title = info.data.content.replace(/<\/?.+?>/g, '').replace(/ /g, '')
        info.data.outline = title.slice(
          0,
          title.length > 200 ? 200 : title.length
        )
        //在文件json中填充富文本的大小
      } else {
        title = JSON.parse(info.data.files)
          .map((s: { name: any }) => s.name.slice(0, s.name.lastIndexOf('.')))
          .join(',')
      }
      info.data.outline = title.slice(
        0,
        title.length > 200 ? 200 : title.length
      )
    }
    fillRightsName()
    //填充权限名称
    if (!info.data.extend && info.data.id) {
      info.authorizationData.rightsTarget = info.data.id
      return sysApi.sysAuthorization
        .saveAuthorization(info.authorizationData)
        .then(() => true)
    }
  }

  //校验附件和内容不能同时为空
  const validate = () => {
    if (info.data.content == '<p><br></p>') {
      info.data.content = ''
    }
    if (info.data.files == '[]') {
      info.data.files = ''
    }
    const isNone =
      !(info.data.content && info.data.content.length > 0) &&
      !(info.data.files && info.data.files.length > 0)
    if (isNone) {
      ElMessage({
        showClose: true,
        message: '请上传文件或填写内容!',
        type: 'warning',
      })
    }
    return isNone
  }

  //如果不继承,则填充继承信息
  const fillRightsName = () => {
    if (!info.data.extend) {
      info.data.rightsId = info.data.id
      info.data.rightsName = info.authorizationData.authorizationList
        .map((s: any) => s.rightsIdentityName)
        .join(',')
    }
  }

  //保存文档后返回来的id保存授权关系
  const afterSave = (id: any) => {
    if (!info.data.extend && !info.data.id) {
      info.authorizationData.rightsTarget = id
      sysApi.sysAuthorization.saveAuthorization(info.authorizationData)
    }
  }
</script>
