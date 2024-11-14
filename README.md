## 关键目录介绍

- 后台服务接口，代理服务配置：`src/config/net.config.js`
- 通用配置：`src/config/setting.config.js`
- 基础组件目录，会全局引入：`src\agilebpm\base-component\`
- 业务组件目录，禁止全局引入，需页面按需引入： `src\agilebpm\componets\`
- 页面目录： `src\views\模块\功能\` eg:数据字典 \src\views\sys\dataDict\dataDictList.vue
- 前台 API 接口目录：`src\api\ab-模块.ts` eg:组织模块所有功能的 api 定义 src\api\ab-org.ts（模块服务前缀请勿忘记定义）
- 路由目录：`src\router\modules\模块.ts`

## 起步

1. 安装依赖
   `yarn install`

cnpm，则必须用 cnpm8.2.0 版本 cnpm 安装教程 npm install cnpm@8.2.0 -g --registry=https://registry.npmmirror.com

2. 启动服务

   `npm run dev`

3. 其他提示：

- 如果提示 警告：warning Delete `␍` prettier/prettier 执行 `npm run lint --fix`
  在 window 系统中，clone 代码，会自动把换行符 LF 转换成回车符 CRLF
  所以我们可以 执行 git 命令关掉自动转化 `git config --global core.autocrlf false`

## 添加页面菜单

### 1、添加页面路由

在 `src\router\modules` 目录，选择所属模块，添加页面路由。请注意 name 需要唯一。更多参考路由说明文档。

### 2、后台添加资源菜单

系统管理-资源管理 ，选择平台为流程平台，在指定目录添加菜单
菜单资源别名建议与路由 name 一致，如果不一致，请配置请求地址与路由地址一致，如果路由和 name 都无法匹配将无法正确访问页面。

## 页面通用组件介绍

### 列表关键组件

以用户列表为例，userList.vue
混入通用列表页功能 abTableMix ` import abTableMix from '@/agilebpm/component/ab-table/ab-table-mix.vue'`

##### abTableMix 通用能力介绍

1. 查询表单 Data 默认 以`query`为名字，若 ts 需要定义 query 属性
2. 搜索表单 ref 默认为 `ref="queryForm"`
3. 列表搜索函数 `@click="search()"`
4. 搜索框重置函数 `reset()`
5. 搜索默认为两行，若多行请设置 `const paramLine = 2`,用于计算表单 table 高度

##### abTable 组件介绍

1. abTable ref 默认为 `ref="abTable"`
2. abTable 已选数据 会赋值为 v-model ` v-model="selectedData"`
3. abTableMix 会计算 abTable 高度 ，存储于 `tableHeight` 中
4. 列表入参 需要传入 `:query-param="query"`
5. url 为列表页的后台地址，请在 api 接口中定义下
6. abTable 封装了 el-table，在 ab-colunm 上可以使用 el-column 的所有属性

abTable 支持一些格式化(待完善)

- `ab-date-formatter`
- `ab-text-formatter`
- ``

## 编辑页关键组件

### 1、AbPageHeader

用于设置返回按钮相关功能

- back-router-name : 编辑页返回的路由
- content 标题
- tab-title 顶部 tab 页的标题，支持动态设置

### 2、ab-save

- `:form-ref="formRef"` 保存时需要校验的表单
- `:save-data="data"` 需要保存的数据
- `:url` 保存的服务器地址，必须在 API 定义一下

### 3、ab-load 加载数据组件

- `:url` 获取数据的接口地址
- `v-model="data"` 加载数据后，赋值对象
- `:get-param="id"` 如果是 get 入参，请赋值该参数，id 为具体参数的值，会拼接到 url 上
- `:params="id"` 如果 getParam 没值，则默认会以 post 请求加载数据，若 params 为空，则会直接使用路由的 params 作为参数请求后台

## git 提交 规范

### git 规范 【禁止强推】

1. 默认开发均在 develop 分支，除非特殊的功能分支（如果存在重大新特性，请拉 Feature 分支可以参考 http://www.agilebpm.cn/zh-cn/docs/upgrade.html AgileBPM Git 开发协作流程 ）

2. 代码冲突时，务必查看对比下，禁止直接替换成自己的提交。

3. 确保 git 日志起到本次提交说明作用，拒绝无效说明 （更多请看提交代码骚操作）

4. 某个完整独立功能尽量一次 commit

5. 多个小 bug，可以记录一起，也可以多次本地提交后，一并 push。（但不允许一个小问题多次 commit 的情况，本地测试通过后再提交代码）

6. 养成好习惯提交时预览下自己提交内容情况，也算检查下。

### 冲突场景：提交有冲突提交失败时

1. 本地提交
2. 更新，更新后解决冲突【务必对比、合并冲突内容】
3. 此时再提交会显示很多别人提交的内容，需要一并 提交上去

### 提交代码骚操作

代码提交时，【必须】明确类型，如：

- 🐛fix: 用户登录异常解决
- 🎨feat: 用户新增密码重试次数
- 📝docs: 新增用户表说明
- ♻refactor：用户编辑新增锁

- ⬆️ (版本升级) :arrow_up:
- 🎉 (庆祝) :tada:
- 🔥 (火焰) :fire:
- ⚡ (闪电)🐎 (赛马) :zap:“:racehorse: 提升性能

更多图标 https://zhuanlan.zhihu.com/p/139600720
