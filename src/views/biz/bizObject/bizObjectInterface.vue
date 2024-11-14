<template>
  <el-tag
    v-for="item in interfaceList"
    :key="item.alias"
    style="margin-right: 5px"
    type="success"
  >
    {{ item.name }}
  </el-tag>
  <el-button :icon="Edit" text type="primary" @click="open">设置</el-button>
  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    destroy-on-close
    title="业务对象接口定义"
    width="70%"
  >
    <el-button :icon="Plus" text type="primary" @click="openDialog(null)">
      添加
    </el-button>
    <el-table border :data="info.data" row-key="alias">
      <el-table-column label="接口名" prop="name" />
      <el-table-column label="请求路径" prop="alias" />
      <el-table-column label="描述" prop="desc" />
      <el-table-column label="关联流程" width="290">
        <template #default="{ row }">
          <el-switch
            v-model="row.flow"
            active-text="是"
            class="ml-2"
            inactive-text="否"
            inline-prompt
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="管理" width="290">
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            text
            type="primary"
            @click="openDialog(row, $index)"
          >
            修改
          </el-button>
          <el-button
            :icon="DocumentCopy"
            text
            type="primary"
            @click="copyUrl(row)"
          >
            地址
          </el-button>
          <el-button
            v-if="!row.defualt"
            :icon="Delete"
            text
            type="danger"
            @click="abUtil.Arrays.del($index, info.data)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-space wrap>
          <el-button text type="primary" @click="info.dialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="ok">确定</el-button>
        </el-space>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="info.editDialog"
    append-to-body
    title="接口定义"
    width="50%"
  >
    <el-form label-suffix="：" label-width="120px">
      <el-form-item label="名字" required>
        <ab-pinyin v-model="info.jiekou.name" v-model:to="info.jiekou.alias" />
      </el-form-item>
      <el-form-item label="接口名" required>
        <el-input v-model="info.jiekou.alias" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="info.jiekou.desc" />
      </el-form-item>
      <el-form-item
        empty-text="无需校验"
        label="入参校验"
        style="max-width: 600px"
      >
        <el-table :data="info.jiekou.params" empty-text="暂无校验参数">
          <el-table-column label="参数别名" prop="name">
            <template #default="{ row }">
              <el-input v-model="row.name" />
            </template>
          </el-table-column>
          <el-table-column label="是否必填" prop="value">
            <template #default="{ row }">
              <el-switch v-model="row.required" />
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="55">
            <template #default="{ $index }">
              <el-icon
                :size="22"
                style="cursor: pointer"
                @click="info.jiekou.params.splice($index, 1)"
              >
                <Delete />
              </el-icon>
            </template>
          </el-table-column>
        </el-table>
        <el-button text type="primary" @click="addParam">添加</el-button>
      </el-form-item>
      <el-form-item label="脚本">
        <codemirror
          v-model="info.jiekou.script"
          :extensions="[java()]"
          :indent-with-tab="true"
          placeholder="请输入 groovy 脚本"
          style="width: 100%; height: 200px"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-space wrap>
          <el-button text type="primary" @click="info.editDialog = false">
            取消
          </el-button>
          <el-button type="primary" @click="editDialogOk">确定</el-button>
        </el-space>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import { abUtil, abApiPrefix } from '~/agilebpm'
  import { Plus, Delete, Edit, DocumentCopy } from '@element-plus/icons-vue'
  import { Codemirror } from 'vue-codemirror'
  import { java } from '@codemirror/lang-java'

  interface Jiekou {
    id?: number
    alias: string
    name: string
    script?: string
    desc?: string
    params: any
  }

  const props = defineProps({
    interfaceList: {
      type: Array<Jiekou>,
      required: true,
    },
    boCode: {
      type: String,
      required: true,
    },
  })

  const info: any = reactive({
    dialogVisible: false,
    editDialog: false,
    jiekou: {},
    jiekouIdx: -1,
    data: [],
  })

  //声明事件
  const emit = defineEmits(['update:interfaceList'])

  onMounted(() => {})

  const open = () => {
    info.data = abUtil.clone(props.interfaceList)
    info.dialogVisible = true
  }

  const ok = () => {
    emit('update:interfaceList', info.data)
    info.dialogVisible = false
  }
  const openDialog = (jiekou: any, jiekouIdx = -1) => {
    if (!jiekou) {
      jiekou = {
        params: [{ name: 'id', required: true }],
      }
    }
    info.jiekouIdx = jiekouIdx
    info.jiekou = abUtil.clone(jiekou)
    info.editDialog = true
  }
  const editDialogOk = () => {
    if (!info.jiekou.alias || !info.jiekou.name) {
      ElMessage({
        message: '请完善必填项',
        type: 'warning',
      })
      return
    }
    let has = false
    info.data.forEach((item: any) => {
      if (item.id != info.jiekou.id && item.alias === info.jiekou.alias) {
        ElMessage({
          message: '别名已经存在，请修改!',
          type: 'warning',
        })
        has = true
        return
      }
    })
    if (has) return

    info.editDialog = false
    if (info.jiekou.id) {
      info.data[info.jiekouIdx] = info.jiekou
      return
    }

    info.jiekou.id = abUtil.Arrays.getNextSn(info.data, 'id')
    info.data.push(info.jiekou)
  }

  const addParam = () => {
    if (!info.jiekou.params) {
      info.jiekou.params = [{}]
    } else {
      info.jiekou.params.push({})
    }
  }

  const copyUrl = (row: Jiekou) => {
    let url = `${abApiPrefix.bizServicePrefix}/bizObject/executeInterface/${props.boCode}/${row.alias}?`

    row.params.forEach((item: any) => {
      if (url.includes('=')) {
        url += '&'
      }
      if (item.name) {
        url = `${url}${item.name}=\${${item.name}}`
      }
    })

    abUtil.handleClipboard(url)
  }
</script>
