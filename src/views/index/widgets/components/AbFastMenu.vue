<template>
  <el-card class="heightpx" shadow="hover">
    <template #header>
      <span class="fontweight">
        {{ $abT('page.home.actions', '快捷操作') }}
      </span>
      <el-button
        :icon="Delete"
        size="small"
        style="float: right"
        text
        type="primary"
        @click="removeAll"
      >
        {{ $abT('page.common.clearToEmpty', '清空') }}
      </el-button>
      <el-button
        :icon="Edit"
        size="small"
        style="float: right"
        text
        type="primary"
        @click="editMenw"
      >
        {{ $abT('page.common.edit', '编辑') }}
      </el-button>
    </template>
    <el-row>
      <el-col class="textcenter" :span="8">
        <router-link :to="{ name: data.notice.link }">
          <el-icon :color="data.notice.color" :size="30">
            <List />
          </el-icon>
          <p class="p">{{ $abT('menu.NoticeList', '公告') }}</p>
        </router-link>
      </el-col>
      <el-col class="textcenter" :span="8">
        <router-link :to="{ name: data.news.link }">
          <el-icon :color="data.news.color" :size="30">
            <HotWater />
          </el-icon>
          <p class="p">{{ $abT('menu.NewsList', '新闻') }}</p>
        </router-link>
      </el-col>
      <el-col class="textcenter" :span="8">
        <router-link :to="{ name: data.innerMsg.link }">
          <el-icon :color="data.innerMsg.color" :size="30">
            <ChatSquare />
          </el-icon>
          <p class="p">{{ $abT('menu.InnerMsgList', '站内信') }}</p>
        </router-link>
      </el-col>
      <el-col class="textcenter" :span="8">
        <router-link :to="{ name: data.todoTask.link }">
          <el-icon class="elcicon" :color="data.todoTask.color" :size="30">
            <Finished />
          </el-icon>
          <p class="p">{{ $abT('menu.BpmMyTaskTodoList', '待办事项') }}</p>
        </router-link>
      </el-col>
      <el-col class="textcenter" :span="8">
        <router-link :to="{ name: data.definition.link }">
          <el-icon class="elcicon" :color="data.definition.color" :size="30">
            <Promotion />
          </el-icon>
          <p class="p">{{ $abT('menu.startFlow', '发起申请') }}</p>
        </router-link>
      </el-col>
      <el-col class="textcenter" :span="8">
        <router-link :to="{ name: data.outline.link }">
          <el-icon class="elcicon" :color="data.outline.color" :size="30">
            <DocumentCopy />
          </el-icon>
          <p class="p">{{ $abT('menu.BpmMyReceiveList', '抄送/传阅') }}</p>
        </router-link>
      </el-col>
    </el-row>
    <el-divider />
    <div class="box">
      <el-row :gutter="24">
        <el-col
          v-for="(item, index) in info.fastMenu"
          :key="index"
          class="textcenter"
          :span="8"
          style="position: relative"
        >
          <span style="cursor: pointer">
            <el-icon
              class="elcicon"
              color="#64890ff"
              :size="15"
              style="position: absolute; top: 0; right: 20%"
              @click.stop="removeOne(item.id, index)"
            >
              <Close />
            </el-icon>
          </span>
          <router-link :to="item.resourceUrl">
            <el-icon :size="28" style="margin-top: 10px">
              <vab-icon
                v-if="item.icon"
                :icon="item.icon"
                style="font-size: 28px"
              />
              <vab-icon v-else icon="file-3-fill" style="font-size: 28px" />
            </el-icon>
            <p class="p">
              {{ abT('menu.' + item.resourceCode, item.resourceName) }}
            </p>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </el-card>
  <el-dialog
    v-model="info.dialogVisible"
    draggable
    :title="$abT('page.home.shortcutMenu', '选择快捷菜单')"
    width="30%"
  >
    <el-tree
      ref="selection"
      :data="info.menuTree"
      :default-expanded-keys="info.expandedList"
      node-key="id"
      :props="info.defaultProps"
      show-checkbox
    />
    <template #footer>
      <span class="dialog-footer">
        <el-space wrap>
          <el-button text type="primary" @click="info.dialogVisible = false">
            {{ $abT('page.common.cancel', '取消') }}
          </el-button>
          <el-button :loading="info.saveLoading" type="primary" @click="save">
            {{ $abT('constant.ActionType.SAVE.name', '保存') }}
          </el-button>
        </el-space>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { useAclStore } from '@/store/modules/acl'
  import {
    ChatSquare,
    Close,
    Delete,
    DocumentCopy,
    Edit,
    Finished,
    HotWater,
    List,
    Promotion,
  } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { cmsApi } from '~/agilebpm'
  import { abT } from '~/src/i18n'

  // // 指定组件命名
  // defineOptions({
  //   name: 'AbFastMenu',
  // })

  //树选中的值,需单独定义出来
  const selection = ref()

  const info = reactive({
    dialogVisible: false,
    saveLoading: false,
    defaultProps: {
      children: 'children',
      label: 'name',
    },
    //展开的数据集合
    expandedList: [] as string[],
    //树绑定的对象
    menuTree: [],
    fastMenu: [] as Array<{
      id: string
      userId: string
      resourceId: string
      resourceName: string
      resourceCode: string
      resourceUrl: string
      icon: string
    }>,
  })

  const data = {
    notice: {
      color: '#13c2c2',
      link: 'NoticeIndexList',
    },
    news: {
      color: '#eb2f96',
      link: 'NewsIndexList',
    },
    innerMsg: {
      color: '#722ed1',
      link: 'InnerMsgList',
    },
    todoTask: {
      color: '#52c41a',
      link: 'BpmMyTaskTodoList',
    },
    definition: {
      color: '#faad14',
      link: 'BpmMyDefinitionList',
    },
    outline: {
      color: '#8870b4',
      link: 'BpmMyReceiveList',
    },
  }

  const editMenw = () => {
    info.dialogVisible = true
    const arr = info.fastMenu.map((item) => item.resourceId)
    info.expandedList = arr
    nextTick(() => selection.value.setCheckedKeys(arr))
  }

  //获取个人快捷菜单
  cmsApi.fastMenu.getFastMenuList().then((data) => (info.fastMenu = data.data))

  //获取拥有权限的所有菜单
  info.menuTree = useAclStore().getUserMenuList

  //保存
  const save = () => {
    info.saveLoading = true
    const arr = selection.value.getCheckedNodes().filter((s: any) => {
      return !s.children || s.children.length === 0
    })
    cmsApi.fastMenu
      .saveFastMenu(arr.map((s: any) => s.id))
      .then(() => {
        info.saveLoading = false
        info.dialogVisible = false
        ElMessage.success(abT('page.common.operateSuccess', '操作成功'))

        cmsApi.fastMenu
          .getFastMenuList()
          .then((data) => (info.fastMenu = data.data))
      })
      .catch(() => (info.saveLoading = false))
  }

  //删除一个
  const removeOne = (id: string, index: number) =>
    ElMessageBox.confirm(
      abT('page.portal.sureDel', '确定删除吗？'),
      abT('page.common.prompt', '提示'),
      {
        confirmButtonText: abT('page.common.ok', '确定'),
        cancelButtonText: abT('page.common.cancel', '取消'),
        type: 'warning',
      }
    ).then(() =>
      cmsApi.fastMenu.deleteOneFastMenu({ id: id }).then(() => {
        info.fastMenu.splice(index, 1)
        ElMessage.success(abT('page.common.operateSuccess', '操作成功'))
      })
    )

  //清空所有
  const removeAll = () => {
    ElMessageBox.confirm(
      abT('page.portal.sureDel', '确定删除吗？'),
      abT('page.common.prompt', '提示'),
      {
        confirmButtonText: abT('page.common.ok', '确定'),
        cancelButtonText: abT('page.common.cancel', '取消'),
        type: 'warning',
      }
    ).then(() =>
      cmsApi.fastMenu.deleteAllFastMenu().then(() => {
        info.fastMenu = []
        ElMessage.success(abT('page.common.operateSuccess', '操作成功'))
      })
    )
  }
</script>

<style scoped>
  .box {
    height: 210px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .heightpx {
    height: 500px;
    overflow-x: scroll !important;
  }

  .fontweight {
    font-size: 20px;
    font-weight: bolder;
  }

  .p {
    margin-top: 5px;
  }

  .elcicon {
    margin-top: 8px;
  }
  .textcenter {
    text-align: center;
  }

  .heightpx.noscrollx {
    overflow-x: hidden !important;
  }

  @media screen and (max-width: 1100px) {
    .heightpx {
      display: none;
    }
  }
</style>
