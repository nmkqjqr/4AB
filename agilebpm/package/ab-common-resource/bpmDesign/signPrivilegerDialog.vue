<template>
  <el-button type="primary" @click="open">
    {{ $abT('bpm.office.configurePersion', ' 配置') }}
    <span v-show="modelValue.length > 0">
      {{ `（${modelValue.length}${abT('bpm.office.people', '人')}）` }}
    </span>
  </el-button>

  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    draggable
    :title="$abT('bpm.office.PrivilegedPersonConfiguration', '特权人配置')"
    top="5vh"
    width="900px"
  >
    <el-table border :data="info.data" style="width: 100%">
      <el-table-column
        :label="$abT('bpm.office.privilegedPerson', '特权人')"
        prop="name"
      />
      <el-table-column v-if="approvalType == 'vote'" width="150">
        <template #header>
          {{ $abT('bpm.office.votingWeight', '投票权重') }}
          <el-tooltip placement="top">
            <template #content>
              {{
                $abT(
                  'bpm.office.votingWeightTip',
                  '设置用户拥有的票数，普通用户默认拥有一票，特权人可拥有多票'
                )
              }}
              <br />
              {{
                $abT(
                  'bpm.office.votingWeightEg',
                  '例子：用户A和用户B是普通用户都投了反对票，用户C是特权人权重是3，C投了同意票，则整体投票通过'
                )
              }}
            </template>
            <el-icon :size="20"><Warning /></el-icon>
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-input-number
            v-model="scope.row.weight"
            controls-position="right"
            :min="1"
            :placeholder="$abT('page.value.weightValue', '权重值')"
            style="width: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column width="210">
        <template #header>
          {{ $abT('bpm.office.addSignaturePermission', '加签权限') }}
          <el-tooltip placement="top">
            <template #content>
              {{
                $abT(
                  'bpm.office.mangeIncreasePersonnel',
                  '对参与会签人员的管理来进行增加人员'
                )
              }}
            </template>
            <el-icon :size="20"><Warning /></el-icon>
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-switch
            v-model="scope.row.reduceRights"
            :active-text="$abT('page.common.yes', '是')"
            :active-value="true"
            :inactive-text="$abT('page.common.no', '否')"
            :inactive-value="false"
            inline-prompt
          />
        </template>
      </el-table-column>
      <el-table-column width="230">
        <template #header>
          {{ $abT('bpm.office.reduceSigningPermissions', '减签权限') }}
          <el-tooltip placement="top">
            <template #content>
              {{
                $abT(
                  'bpm.office.reducePersonnelByManaging',
                  '对参与会签人员的管理来进行减少人员'
                )
              }}
            </template>
            <el-icon :size="20"><Warning /></el-icon>
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-switch
            v-model="scope.row.addRights"
            :active-text="$abT('page.common.yes', '是')"
            :active-value="true"
            :inactive-text="$abT('page.common.no', '否')"
            :inactive-value="false"
            inline-prompt
          />
        </template>
      </el-table-column>
      <el-table-column :width="props.from == 'setting' ? 60 : 120">
        <template #header>
          <ab-cust-dialog
            v-if="props.from == 'setting'"
            circle
            dialog-key="userSelector"
            :icon="Plus"
            type="primary"
            @ok="add"
          />
          <el-dropdown
            v-else
            size="small"
            split-button
            type="primary"
            @command="command"
          >
            {{ $abT('page.common.select', '选择') }}
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="user in userList"
                  :key="user.id"
                  :command="user"
                >
                  {{ user.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template #default="scope">
          <el-button
            circle
            :icon="Delete"
            type="danger"
            @click="abUtil.Arrays.del(scope.$index, info.data)"
          />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button text type="primary" @click="info.dialogVisible = false">
          {{ $abT('page.common.cancel', '取消') }}
        </el-button>
        <el-button type="primary" @click="ok">
          {{ $abT('page.common.ok', '确定') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { Plus, Delete, Warning } from '@element-plus/icons-vue'
  import { abStoreAdaptor } from '@agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { abT } from '@/i18n'

  const props = defineProps({
    modelValue: {
      required: true,
      type: Array as () => Array<SignPrivileger>,
      default: () => {
        return []
      },
    },
    approvalType: {
      required: true,
      type: String,
    },
    /**
     * 来源
     */
    from: {
      required: false,
      type: String,
      default: 'setting', //start：人为会签发起；setting：流程配置
    },
    users: {
      required: false,
      type: Array,
      default: () => {
        return []
      },
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const info: any = reactive({
    data: [] as Array<SignPrivileger>,
    dialogVisible: false,
  })

  onMounted(() => {})

  const userList = computed(() => {
    const abUser = abStoreAdaptor().getAbUser
    const list = abUtil.clone(props.users)
    list.push({
      type: 'user',
      name: abUser.fullName,
      id: abUser.userId,
    })
    return list
  })

  const open = () => {
    info.dialogVisible = true
    info.data = abUtil.clone(props.modelValue)
  }

  const formRef = ref<FormInstance>()
  const ok = () => {
    info.dialogVisible = false
    emit('update:modelValue', info.data)
  }

  const add = (users: any) => {
    users.forEach((user: any) => {
      let b = false
      info.data.forEach((u: any) => {
        if (u.key == user.id) {
          b = true
        }
      })
      if (b) return

      info.data.push({
        type: 'user', //目前先支持用户
        key: user.id,
        name: user.name,
        weight: 1,
        addRights: true,
        reduceRights: true,
      })
    })
  }

  const command = (user: any) => {
    add([user])
  }
</script>
