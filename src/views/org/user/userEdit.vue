<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="UserList"
        :form-ref="formRef"
        :save-data="info.data"
        :url="orgApi.user.OrgUserSaveUrl"
      />
      <ab-load
        v-model="info.data"
        :get-query="id"
        :url="orgApi.user.OrgUserGetUrl"
      />
    </el-header>

    <el-divider class="dividermar" />

    <el-main>
      <el-form
        ref="formRef"
        label-suffix="："
        label-width="100px"
        :model="info.data"
        :rules="rules"
        :status-icon="false"
      >
        <el-form-item :label="$abT('page.userList.fullname','姓名')" prop="fullname">
          <ab-pinyin
            v-model="info.data.fullname"
            v-model:to="info.data.account"
          />
        </el-form-item>

        <el-form-item :label="$abT('page.userList.account','账户')" prop="account">
          <el-input
            v-model="info.data.account"
            :disabled="Boolean(info.data.id)"
          />
        </el-form-item>

        <el-form-item
          v-if="!info.data.id"
          :label="$abT('page.userList.password','密码')"
          prop="password"
          show-password
        >
          <el-input v-model="info.data.password" password type="password" />
        </el-form-item>

        <el-form-item :label="$abT('page.userList.email','邮箱')" prop="email">
          <el-input v-model="info.data.email" />
        </el-form-item>
        <el-form-item :label="$abT('page.userList.mobile','手机号')" prop="mobile">
          <el-input v-model="info.data.mobile" />
        </el-form-item>
        <el-form-item :label="$abT('page.userList.weChat','微信')" prop="weixin">
          <el-input v-model="info.data.weixin" />
        </el-form-item>
        <el-form-item :label="$abT('page.userList.sex','性别')" prop="sex">
          <el-radio-group v-model="info.data.sex" class="ml-4">
            <el-radio :value="$abT('page.common.man','男')" size="large">{{ $abT('page.common.man','男') }}</el-radio>
            <el-radio :value="$abT('page.common.woman','女')" size="large">{{ $abT('page.common.woman','女') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$abT('page.common.status','状态')" prop="status">
          <el-switch
            v-model="info.data.status"
            :active-text="$abT('page.common.enable','启用')"
            :active-value="1"
            :inactive-text="$abT('page.common.disable','禁用')"
            :inactive-value="0"
            inline-prompt
            size="large"
          />
        </el-form-item>
        <el-form-item :label="$abT('page.common.role','角色')" prop="orgRelationList">
          <el-tag
            style="margin-left: 0;margin-right: 10px;"
            v-for="(relation, index) in info.data.orgRelationList"
            v-show="relation.type === 'userRole'"
            :key="index"
            :closable="true"
            @close="deleteRel(index)"
          >
            {{ relation.roleName }}
          </el-tag>

          <!--          <el-tag-->
          <!--            v-for="(relation, index) in info.data.orgRelationList"-->
          <!--            v-show="relation.type === 'groupUserRole' && relation.roleName"-->
          <!--            type="info"-->
          <!--            :key="index"-->
          <!--            :index="index"-->
          <!--          >-->
          <!--            {{ relation.roleName }}-->
          <!--          </el-tag>-->

          <ab-cust-dialog
            v-model="info.orgRoleList"
            dialog-key="roleSelector"
            :param="{}"
            size="small"
            style="margin-left: 3px"
            :value-mapping="{ id: 'id', name: 'name' }"
          >
            {{ $abT('page.common.select','选择') }}
          </ab-cust-dialog>
        </el-form-item>
        <el-form-item :label="$abT('page.common.group','组织')" prop="orgRelationList">
          <el-tag
            style="margin-left: 0;margin-right: 10px;"
            v-for="(relation, index) in info.data.orgRelationList"
            v-show="relation.type === 'groupUser'"
            :key="index"
            :closable="true"
            :index="index"
            @close="deleteRel(index)"
          >
            {{ relation.groupName }}
          </el-tag>

          <!--          <el-tag-->
          <!--            v-for="(relation, index) in info.data.orgRelationList"-->
          <!--            v-show="relation.type === 'groupUserRole' && relation.groupName"-->
          <!--            type="info"-->
          <!--            :key="index"-->
          <!--            :index="index"-->
          <!--          >-->
          <!--            {{ relation.groupName }}-->
          <!--          </el-tag>-->

          <ab-cust-dialog
            v-model="info.orgGroupList"
            dialog-key="orgSelector"
            size="small"
            style="margin-left: 3px"
            :value-mapping="{ id: 'id', name: 'name' }"
          >
            {{ $abT('page.common.select','选择') }}
          </ab-cust-dialog>
        </el-form-item>
        <el-form-item :label="$abT('page.common.post','岗位')" prop="orgRelationList">
          <el-tag
            style="margin-left: 0;margin-right: 10px;"
            v-for="(relation, index) in info.data.orgRelationList"
            v-show="relation.type === 'groupUserRole'"
            :key="index"
            :closable="true"
            :index="index"
            @close="deleteRel(index)"
          >
            {{ relation.postName }}
          </el-tag>
          <ab-cust-dialog
            v-model="info.orgRelList"
            dialog-key="postSelector"
            size="small"
            style="margin-left: 3px"
            :value-mapping="{
              groupId: 'groupId',
              roleId: 'roleId',
              name: 'postName',
              groupName: 'groupName',
              roleName: 'roleName',
            }"
          >
            {{ $abT('page.common.select','选择') }}
          </ab-cust-dialog>
        </el-form-item>
        <el-form-item :label="$abT('page.userList.address','地址')" prop="address">
          <el-input
            v-model="info.data.address"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :placeholder="$abT('page.userList.pleaseEnterAddress','请输入地址')"
            type="textarea"
          />
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { abT } from '@/i18n'
import { onMounted, reactive, ref } from 'vue'
import { orgApi, abTools, abUtil } from '~/agilebpm'
import type { FormRules } from 'element-plus'

//引入 当前实例
const { proxy } = abTools.useCurrentInstance()
const formRef = ref()
const id = proxy.$route.params.id
const info: any = reactive({
  data: {
    id: '',
    fullname: '',
    account: '',
    password: '',
    email: '',
    weixin: '',
    mobile: '',
    sex: abT('page.common.man','男'),
    status: 1,
    orgRelationList: [],
    address: '',
  },
  orgRoleList: [],
  orgGroupList: [],
  orgRelList: [],
  patt: '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
})

/**
 *新增用户时默认角色普通用户
 */
onMounted(() => {
  if (!proxy.$route.params.id) {
    info.data.orgRelationList.push({
      roleId: '1605464389708218368',
      roleName: '普通用户',
      type: 'userRole',
    })
  }
})

const checkRegExp = (rule: any, value: string, callback: any) => {
  const myRegex = new RegExp(info.patt)
  if (value) {
    if (!myRegex.test(value)) {
      callback(new Error(abT('rules.pleaseEnterAddress','请输入正确的邮箱')))
    }
  }
  callback()
}

const rules = reactive<FormRules>({
  fullname: [
    { required: true, message: abT('rules.required','必填'), trigger: 'blur' },
    { max: 50, message: abT('rules.max','最多可输入{a}个字符',{ a : 50 }) },
  ],
  account: [
    { required: true, message: abT('rules.required','必填'), trigger: 'blur' },
    { max: 50, message: abT('rules.max','最多可输入{a}个字符',{ a : 50 }) },
  ],
  password: [
    { required: true, message: abT('rules.required','必填'), trigger: 'blur' },
    { max: 50, message: abT('rules.max','最多可输入{a}个字符',{ a : 50 }) },
  ],
  email: [{ validator: checkRegExp, trigger: 'change' }],
})

/**
 * 角色添加岗位信息
 *
 * @param dataArr  岗位信息
 * @param type   类型  组织 角色 岗位
 */

const pushRelationList = (dataArr: any[], type: string, infoArr: any[]) => {
  if (dataArr.length === 0) return
  dataArr.forEach((item: any) => {
    if (infoArr.length > 0) {
      //校验是否重复存在
      for (let i = 0, relation; (relation = infoArr[i++]); ) {
        if (type === 'userRole') {
          if (relation.roleId === item.id && relation.type == 'userRole') {
            return
          }
        }
        if (type === 'groupUser') {
          if (relation.groupId === item.id && relation.type == 'groupUser') {
            return
          }
        }
        if (type === 'groupUserRole') {
          if (
            relation.roleId === item.roleId &&
            relation.groupId === item.groupId &&
            relation.type == 'groupUserRole'
          ) {
            return
          }
        }
      }
    }
    if (infoArr.length === 0) {
      infoArr.splice(0)
    }

    if (type === 'userRole') {
      infoArr.push({
        type: type,
        roleId: item.id,
        roleName: item.name,
      })
    }
    if (type === 'groupUser') {
      infoArr.push({
        type: type,
        groupId: item.id,
        groupName: item.name,
      })
    }
    if (type === 'groupUserRole') {
      infoArr.push({
        type: type,
        groupId: item.groupId,
        roleId: item.roleId,
        postName: item.postName,
        groupName: item.groupName,
        roleName: item.roleName,
      })
    }
  })
}

const deleteRel = (index: number) =>
  abUtil.Arrays.del(index, info.data.orgRelationList)

watch(
  () => info.orgRoleList,
  (val: any) => {
    if (val) {
      pushRelationList(val, 'userRole', info.data.orgRelationList)
    }
    info.orgRoleList.splice(0)
  }
)

watch(
  () => info.orgGroupList,
  (val: any) => {
    if (val) {
      pushRelationList(val, 'groupUser', info.data.orgRelationList)
    }
    info.orgGroupList.splice(0)
  }
)

watch(
  () => info.orgRelList,
  (val: any) => {
    if (val) {
      pushRelationList(val, 'groupUserRole', info.data.orgRelationList)
    }
    info.orgRelList.splice(0)
  }
)
</script>
