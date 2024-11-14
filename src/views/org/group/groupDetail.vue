<template>
  <div v-loading="info.loading">
    <ab-save
      v-if="!info.readonly"
      :after-save-fn="saveAfter"
      after-save-stay
      :back-btn="false"
      back-name="groupDetail"
      :before-save-fn="saveBefore"
      :form-ref="formRef"
      :save-data="info.group"
      :url="orgApi.group.saveOrgGroupUrl"
    />
    <el-button
      v-show="info.readonly"
      v-ab-btn-rights:groupList_edit
      style="margin-left: 10px"
      @click="editOrg"
    >
      {{ $abT('page.common.edit','编辑') }}
    </el-button>
    <el-button
      v-if="props.operationType !== 'add'"
      v-show="!info.readonly"
      style="margin-left: 10px"
      @click="cancel"
    >
      {{ $abT('page.common.cancel','取消') }}
    </el-button>
    <el-form
      ref="formRef"
      :label-width="100"
      :model="info.group"
      style="margin-top: 20px"
    >
      <el-form-item :label="$abT('page.groupList.superiorOrg','上级组织')" prop="parentName">
        <el-input v-model="info.group.parentName" :disabled="true" />
      </el-form-item>
      <el-form-item
        :label="$abT('page.groupList.orgName','组织名称')"
        prop="name"
        :rules="[
          { required: true, message: $abT('rules.required','必填'), trigger: 'blur' },
          { max: 50, message:  $abT('rules.max','最多可输入{a}个字符',{ a : 50 })  },
        ]"
      >
        <ab-pinyin
          v-model="info.group.name"
          v-model:to="info.group.code"
          clearable
          :disabled="info.readonly"
        />
      </el-form-item>
      <el-form-item
        :label="$abT('page.groupList.orgCode','组织编码')"
        prop="code"
        :rules="[
           { required: true, message: $abT('rules.required','必填'), trigger: 'blur' },
           { max: 50, message:  $abT('rules.max','最多可输入{a}个字符',{ a : 50 })  },
        ]"
      >
        <el-input
          v-model="info.group.code"
          :disabled="info.readonly || !!info.group.id"
        />
      </el-form-item>
      <el-form-item :label="$abT('page.groupList.sort','排序')">
        <el-input-number
          v-model="info.group.sn"
          clearable
          controls-position="right"
          :disabled="info.readonly"
          :max="100"
          :min="1"
          size="default"
        />
        <el-tooltip
          class="box-item"
          :content="$abT('page.groupList.sortTips','默认值1，数字越大同级组织排序越靠前')"
          effect="light"
          placement="right-start"
        >
          <el-icon color="#409EFF" size="20" style="margin-left: 12px">
            <WarningFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$abT('page.groupList.orgType','组织类型')">
        <abSelectTree
          v-model="info.group.type"
          :desc="$abT('page.groupList.orgType','组织类型')"
          :disabled="info.readonly"
          :has-root="false"
          :multiple="false"
          type-code="groupGrade"
        />
        <el-tooltip
          class="box-item"
          :content="$abT('page.groupList.orgTypeTips','对组织划分不同类型以便查找对应类型的人员')"
          effect="light"
          placement="right-start"
        >
          <el-icon color="#409EFF" size="20" style="margin-left: 12px">
            <WarningFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$abT('page.groupList.orgPost','组织岗位')">
        <el-tag
          v-for="(relation, index) in info.group.orgRelationList"
          v-show="relation.type === 'groupRole'"
          :key="index"
          :closable="!info.readonly"
          :index="index"
          @close="removeRelation(index)"
        >
          {{ relation.roleName }}
        </el-tag>
        <ab-cust-dialog
          v-if="!info.readonly"
          dialog-key="roleSelector"
          :param="{}"
          size="small"
          style="margin-left: 3px"
          @ok="pushOrgRelationList"
        >
          {{ $abT('page.common.select','选择') }}
        </ab-cust-dialog>
        <el-tooltip class="box-item" effect="light" placement="right-start">
          <template #content>
            {{ $abT('page.groupList.orgPostTips1','定义该组织下的岗位，岗位 = 组织 + 角色') }}
            <br />
            {{ $abT('page.groupList.orgPostTips2','当您需要指派工作给某个部门的某个岗位的时候，岗位会非常有用，') }}
            <br />
            {{ $abT('page.groupList.orgPostTips3','比如：部门负责人处理该部门的员工请假申请。') }}
          </template>
          <el-icon color="#409EFF" size="20" style="margin-left: 12px">
            <WarningFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        :label="$abT('page.common.desc','描述')"
        prop="desc"
        :rules="[{ max: 300, message:  $abT('rules.max','最多可输入{a}个字符',{ a : 300 }) }]"
      >
        <el-input
          v-model="info.group.desc"
          autosize
          clearable
          :disabled="info.readonly"
          type="textarea"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import {abT} from "@/i18n";
  import {
    ChatDotRound,
    ChatSquare,
    WarningFilled,
  } from '@element-plus/icons-vue'
  import { ref } from 'vue'
  import {ElMessage, FormInstance} from 'element-plus'
  import {
    orgApi,
    sysApi,
    getData,
    postData,
    abUtil,
    abSelectTree,
  } from '~/agilebpm'

  const { proxy } = getCurrentInstance() as any
  const name = 'groupDetail'
  const formRef = ref<FormInstance>()
  const props = defineProps({
    orgId: {
      type: String,
      required: true,
    },
    parentOrg: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: false,
    },
    operationType: {
      type: String,
      required: true,
    },
    readonlyTmp: {
      type: Boolean,
      required: false,
    },
  })

  const info: any = reactive({
    group: {},
    readonly: true,
    loading: false,
    isAdd: true,
  })

  const emit = defineEmits([
    'appendChildMsgEvent',
    'reloadTree',
    'editOrg',
    'cancel',
  ])

  const loadOrg = (orgId: string) => {
    info.loading = true
    if (orgId) {
      getData(orgApi.group.getOrgGroupUrl + orgId).then((result) => {
        info.loading = false
        info.group = result.data
      })
    }
  }

  const editOrg = () => {
    info.readonly = false
    emit('editOrg')
  }

  const cancel = () => {
    info.readonly = true
    emit('cancel')
  }

  /*
  删除组织上的角色
  删除前先检查关系信息
  * 前端使用 AbUtil.Arrays.del删除
  * 后端调用删除组织关系接口
  * */
  const removeRelation = (index: number) => {
    postData(orgApi.post.removeCheckGroupUrl, {
      roleId: info.group.orgRelationList[index].roleId,
      groupId: info.group.orgRelationList[index].groupId,
    }).then((result) => {
      if (result.isOk) {
        abUtil.Arrays.del(index, info.group.orgRelationList)
      } else {
        ElMessage.warning( abT('page.common.delFail','删除失败'))
      }
    })
  }

  const saveBefore = () => {}
  const saveAfter = (data: string) => {
    info.loading = false
    info.readonly = true
    info.group.id = info.group.id ? info.group.id : data
    emit('reloadTree')
    // proxy.$emit('getDataTree')
    // 如果是新增则继续新增
    emit(
      'appendChildMsgEvent',
      abUtil.clone(info.group),
      proxy.operationType === 'add'
    )
  }
  const pushOrgRelationList = (dataArr: []) => {
    if (!dataArr) return
    if (!info.group.orgRelationList) {
      info.group.orgRelationList = []
    }

    dataArr.forEach((item: any) => {
      //校验是否重复存在
      let i = 0,
        relation
      for (; (relation = info.group.orgRelationList[i++]); ) {
        if (relation.roleId === item.id) {
          return
        }
      }
      info.group.orgRelationList.push({
        type: 'groupRole',
        roleId: item.id,
        roleName: item.name,
        groupId: info.group.id || 'asdf',
      })
    })
  }

  watch(
    () => props.orgId,
    (orgId) => {
      if (props.operationType === 'add') {
        info.readonly = false
        if (orgId == '0') {
          info.group = {
            parentName: '',
            parentId: '0',
            sn: 1,
          }
        } else {
          info.group = {
            parentName: props.parentOrg.name,
            parentId: props.parentOrg.id,
            sn: 1,
          }
        }
        return
      }
      if (orgId) {
        loadOrg(orgId)
      }
    }
  )

  watch(
    () => props.operationType,
    (operationType, oldValue) => {
      //edit情况
      if (operationType === 'edit') {
        if (oldValue === 'add') {
          loadOrg(proxy.orgId)
        }
        info.readonly = false
      }
      //add情况
      else if (operationType === 'add') {
        info.readonly = false
        info.group = {
          parentName: proxy.parentOrg.name,
          parentId: proxy.parentOrg.id,
          sn: 1,
        }
      }
      // detail 情况，即点击树的时候
      else {
        loadOrg(proxy.orgId)
        info.readonly = true
      }
    }
  )

  watch(
    () => props.readonlyTmp,
    () => {
      info.readonly = !info.readonly
    }
  )
  onMounted(() => {
    if (!info.id) {
      info.id = 1
    }
    if (info.isEdit) {
      info.readonly = false
    }
  })
</script>
<style scoped>
  :deep(.el-input-number .el-input__inner) {
    text-align: left;
  }
</style>
