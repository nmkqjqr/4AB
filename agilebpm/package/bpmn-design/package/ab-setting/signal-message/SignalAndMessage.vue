<template>
  <div class="panel-tab__content">
    <div class="panel-tab__content--title">
      <span>
        <i class="el-icon-menu" style="margin-right: 8px; color: #555555"></i>
        消息列表
      </span>
      <el-button
        icon="el-icon-plus"
        size="small"
        type="primary"
        @click="openModel('message')"
      >
        创建新消息
      </el-button>
    </div>
    <el-table border :data="messageList" size="small">
      <el-table-column label="序号" type="index" width="60px" />
      <el-table-column
        label="消息ID"
        max-width="300px"
        prop="id"
        show-overflow-tooltip
      />
      <el-table-column
        label="消息名称"
        max-width="300px"
        prop="name"
        show-overflow-tooltip
      />
    </el-table>
    <div
      class="panel-tab__content--title"
      style="padding-top: 8px; margin-top: 8px; border-top: 1px solid #eeeeee"
    >
      <span>
        <i class="el-icon-menu" style="margin-right: 8px; color: #555555"></i>
        信号列表
      </span>
      <el-button
        icon="el-icon-plus"
        size="small"
        type="primary"
        @click="openModel('signal')"
      >
        创建新信号
      </el-button>
    </div>
    <el-table border :data="signalList" size="small">
      <el-table-column label="序号" type="index" width="60px" />
      <el-table-column
        label="信号ID"
        max-width="300px"
        prop="id"
        show-overflow-tooltip
      />
      <el-table-column
        label="信号名称"
        max-width="300px"
        prop="name"
        show-overflow-tooltip
      />
    </el-table>

    <el-dialog
      v-model:visible="modelVisible"
      append-to-body
      :close-on-click-modal="false"
      destroy-on-close
      :title="modelConfig.title"
      width="400px"
    >
      <el-form label-width="90px" :model="modelObjectForm" size="small">
        <el-form-item :label="modelConfig.idLabel">
          <el-input v-model="modelObjectForm.id" clearable />
        </el-form-item>
        <el-form-item :label="modelConfig.nameLabel">
          <el-input v-model="modelObjectForm.name" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="modelVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addNewObject">
          保 存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'SignalAndMassage',
    data() {
      return {
        signalList: [],
        messageList: [],
        modelVisible: false,
        modelType: '',
        modelObjectForm: {},
      }
    },
    computed: {
      modelConfig() {
        if (this.modelType === 'message') {
          return { title: '创建消息', idLabel: '消息ID', nameLabel: '消息名称' }
        } else {
          return { title: '创建信号', idLabel: '信号ID', nameLabel: '信号名称' }
        }
      },
    },
    mounted() {
      this.initDataList()
    },
    methods: {
      initDataList() {
        this.rootElements =
          window.bpmnInstances.modeler.getDefinitions().rootElements
        this.messageIdMap = {}
        this.signalIdMap = {}
        this.messageList = []
        this.signalList = []
        this.rootElements.forEach((el) => {
          if (el.$type === 'bpmn:Message') {
            this.messageIdMap[el.id] = true
            this.messageList.push({ ...el })
          }
          if (el.$type === 'bpmn:Signal') {
            this.signalIdMap[el.id] = true
            this.signalList.push({ ...el })
          }
        })
      },
      openModel(type) {
        this.modelType = type
        this.modelObjectForm = {}
        this.modelVisible = true
      },
      addNewObject() {
        if (this.modelType === 'message') {
          if (this.messageIdMap[this.modelObjectForm.id]) {
            return this.$message.error('该消息已存在，请修改id后重新保存')
          }
          const messageRef = window.bpmnInstances.moddle.create(
            'bpmn:Message',
            this.modelObjectForm
          )
          this.rootElements.push(messageRef)
        } else {
          if (this.signalIdMap[this.modelObjectForm.id]) {
            return this.$message.error('该信号已存在，请修改id后重新保存')
          }
          const signalRef = window.bpmnInstances.moddle.create(
            'bpmn:Signal',
            this.modelObjectForm
          )
          this.rootElements.push(signalRef)
        }
        this.modelVisible = false
        this.initDataList()
      },
    },
  }
</script>
