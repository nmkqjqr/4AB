<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="DataSourceList"
        :before-save-fn="beforeSaveFn"
        :form-ref="formRef"
        :save-data="info.data"
        :url="sysApi.dataSource.dataSourceSave"
      />
      <ab-load v-model="info.data" :url="sysApi.dataSource.dataSourceGet" />
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
          <el-form-item
            label="名称"
            placeholder="请输入名称"
            prop="name"
            :rules="[{ required: true, message: '必填' }]"
          >
            <ab-pinyin v-model="info.data.name" v-model:to="info.data.alias" />
          </el-form-item>
          <el-form-item
            label="别名"
            placeholder="请输入别名"
            prop="alias"
            :rules="[{ required: true, message: '必填' }, info.validatorMap]"
          >
            <el-input v-model="info.data.alias" :disabled="!!info.data.id" />
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="info.data.desc" :rows="4" type="textarea" />
          </el-form-item>

          <el-form-item
            label="数据库类型"
            prop="dbType"
            :rules="[{ required: true, message: '必填', trigger: 'change' }]"
          >
            <el-select
              v-model="info.data.dbType"
              placeholder=""
              @change="handleDbTypeChange()"
            >
              <el-option
                v-for="(item, index) in info.pageNeedData.dbTypeList"
                :key="index"
                :label="item.desc"
                :value="item.db"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="数据库模板"
            prop="classPath"
            :rules="[{ required: true, message: '必填', trigger: 'change' }]"
          >
            <el-select
              v-model="info.data.defName"
              @change="dataSourceDefChange"
            >
              <el-option
                v-for="item in info.pageNeedData.dataSourceDefList"
                :key="item.id"
                :label="item.name"
                :value="item.name + ',' + item.classPath + ',' + item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="从库" prop="replica">
            <el-tag
              v-for="(tag, index) in info.data.replicaList"
              :key="index"
              class="mx-1"
              closable
              :disable-transitions="false"
              @close="handleClose(index)"
            >
              {{ tag.name }}
            </el-tag>
            <ab-cust-dialog
              v-model="info.data.replicaList"
              dialog-key="dataSourceSelector"
              style="margin-left: 10px"
              type="primary"
              @ok="chooseReplica"
            >
              选择
            </ab-cust-dialog>
          </el-form-item>
          <el-form-item label="属性列表">
            <el-table
              v-if="info.data.attributeList.length > 0"
              border
              :data="info.data.attributeList"
              style="width: 100%; height: 100%; overflow-y: auto"
            >
              <el-table-column label="描述" min-width="120px" prop="comment" />
              <el-table-column label="名称" prop="name" />
              <el-table-column label="数值类型" prop="type" width="150px" />
              <el-table-column label="是否必填" prop="required" width="100px">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.required"
                    active-text="是"
                    :active-value="true"
                    disabled
                    inactive-text="否"
                    :inactive-value="false"
                    inline-prompt
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="是否加密"
                prop="encryptValue"
                width="100px"
              >
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.encryptValue"
                    active-text="是"
                    :active-value="true"
                    inactive-text="否"
                    :inactive-value="false"
                    inline-prompt
                  />
                </template>
              </el-table-column>
              <el-table-column label="值" prop="value" width="650px">
                <template #default="scope">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="值已加密，如果要修改，双击文本框，输入新值即可"
                    placement="top-start"
                    v-if="scope.row.encryptValue && info.data.id"
                  >
                    <el-input
                      ref="inputRef"
                      v-if="scope.row.candInput"
                      v-model="scope.row.value"
                      class="valInput"
                      :rows="2"
                      type="textarea"
                    />
                    <el-input
                      v-else
                      @click="toggleValue(scope.row)"
                      v-model="info.encryptValue"
                      class="valInput2"
                      readonly
                      :rows="2"
                      type="textarea"
                    />
                  </el-tooltip>
                  <el-input
                    v-else
                    v-model="scope.row.value"
                    class="valInput"
                    :rows="2"
                    type="textarea"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import { sysApi, bizApi } from '~/agilebpm'
  import { Edit } from '@element-plus/icons-vue'
  const formRef = ref()
  const info: any = reactive({
    data: {
      id: '',
      name: '',
      alias: '',
      desc: '',
      dbType: '',
      classPath: '',
      attributeList: [],
      defId: '',
      defName: '',
      replica: '',
      replicaList: [],
    },
    pageNeedData: {
      dbTypeList: [],
      dataSourceDefList: [],
    },
    validatorMap: {},
    encryptValue: '******',
  })

  onMounted(() => {
    //拿出所有的数据库类型
    sysApi.tools
      .getEnum('com.dstz.base.enums.AbDbType', true)
      .then((result) => {
        if (result.data && result.data.length > 0) {
          info.pageNeedData.dbTypeList.push(...result.data)
        }
      })
    //获取所有的数据源模板
    sysApi.dataSource.getDataSourceTemplateList().then((result) => {
      const dataSourceDefList = result.data.rows
      //回填数据源名称
      dataSourceDefList.forEach((item: any) => {
        if (info.data.defId && info.data.defId == item.id) {
          info.data.defName = item.name
        }
      })
      info.pageNeedData.dataSourceDefList = dataSourceDefList
    })
  })

  const dataSourceDefChange = (item: string) => {
    if (!item || item.split(',').length !== 3) {
      return
    }
    const value = item.split(',')
    info.data.classPath = value[1]
    info.data.defName = value[0]
    info.data.defId = value[2]
    //获取数据源属性
    sysApi.dataSource.getTemplateAttrList(info.data.defId).then((result) => {
      const attributeList = result.data.attributeList
      if (attributeList && attributeList.length > 0) {
        attributeList.forEach((item: any) => {
          if (item.defaultValue && !item.value) {
            item.value = item.defaultValue
          }
        })
        info.data.attributeList = attributeList
        setDefaultValue()
      }
    })
  }
  const beforeSaveFn = () => {
    for (let i = 0; i < info.data.attributeList.length; i++) {
      if (
        !info.data.attributeList[i].value &&
        info.data.attributeList[i].required
      ) {
        ElMessage({
          showClose: true,
          duration: 6000,
          message: `请完善数据源属性列表必填项 【${info.data.attributeList[i].name}】的值`,
          type: 'warning',
        })
        return false
      }
    }
  }

  //数据源从库选择
  const chooseReplica = (list: any) => {
    info.data.replicaList = list
    info.data.replica = JSON.stringify(list)
  }
  const handleClose = (tagIndex: number) => {
    info.data.replicaList.splice(tagIndex, 1)
    info.data.replica = JSON.stringify(info.pageNeedData.replicaList)
  }

  const handleDbTypeChange = (value: string) => {
    setDefaultValue()
  }

  const setDefaultValue = () => {
    if (
      !info.data.dbType ||
      !info.data.attributeList ||
      info.data.attributeList.length === 0
    ) {
      return
    }

    let db = {}
    info.pageNeedData.dbTypeList.forEach((item: any) => {
      if (info.data.dbType === item.db) {
        db = item
        return
      }
    })

    if (!db.db) {
      return
    }

    info.data.attributeList.forEach((item: any) => {
      if (item.name === 'driverClassName') {
        item.value = db.driverClassName
      } else if (item.name == 'url' || item.name == 'jdbcUrl') {
        item.value = db.defaultUrl
      }
    })
  }
  const vueContext = getCurrentInstance()
  const toggleValue = (data: any) => {
    if (data.candInput) {
      data.candInput = false
    } else {
      data.candInput = true
    }

    nextTick(() => {
      vueContext.refs?.inputRef[0]?.focus()
    })
  }

  //编码获取校验
  bizApi.bizPattern
    .getAllBizValidator()
    .then((data: any) => (info.validatorMap = data.varirule.rule))
</script>
<style scope lang="scss">
  .valInput .el-textarea__inner {
    width: 630px !important;
  }

  .valInput2 .el-textarea__inner {
    width: 620px !important;
    cursor: pointer !important;
  }
</style>
