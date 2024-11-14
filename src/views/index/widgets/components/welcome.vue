<template>
  <el-card header="欢迎" shadow="hover">
    <div class="welcome">
      <div class="tips">
        <div class="tips-item">
          <div class="tips-item-icon">
            <el-icon />
          </div>
          <div class="tips-item-message">
            这里是项目控制台，你可以点击右上方的“自定义”按钮来添加移除或者移动部件。
          </div>
        </div>
        <div class="tips-item">
          <div class="tips-item-icon">
            <el-icon />
          </div>
          <div class="tips-item-message">
            在提高前端算力、减少带宽请求和代码执行力上多次优化，并且持续着。
          </div>
        </div>
        <div class="tips-item">
          <div class="tips-item-icon">
            <el-icon />
          </div>
          <div class="tips-item-message">项目目的：让前端工作更快乐</div>
        </div>
      </div>
      <div class="actions">
        <el-button
          icon="el-icon-check"
          size="large"
          type="primary"
          @click="godoc"
        >
          文档
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
  export default {
    title: '欢迎',
    icon: 'el-icon-present',
    description: '项目特色以及文档链接',
    data() {
      return {}
    },
    methods: {
      godoc() {
        window.open('https://lolicode.gitee.io/scui-doc/')
      },
    },
  }
</script>

<style scoped>
  .welcome {
  }
  .welcome .logo {
    text-align: center;
  }
  .welcome .logo img {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
    vertical-align: bottom;
  }
  .welcome .logo h2 {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: normal;
  }

  .tips {
    padding: 0 40px;
    margin-top: 20px;
  }
  .tips-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7.5px 0;
  }
  .tips-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-right: 20px;
    font-size: 18px;
    color: var(--el-color-primary);
    background: rgba(180, 180, 180, 0.1);
    border-radius: 50%;
  }
  .tips-item-message {
    flex: 1;
    font-size: 14px;
  }

  .actions {
    margin: 40px 0 20px 0;
    text-align: center;
  }
</style>
