<script>
  import { getData, postData } from '@agilebpm/api/ab-request'
  import { ElMessageBox, ElMessage } from 'element-plus'
  export default {
    components: {},
    data() {
      return {
        // 查询入参，会直接利用QueryFilter查询，默认分页
        query: {},
        // 搜索是否展开更多
        collapse: false,
        // 如果根据查询条件行数计算table多少高度，默认两行，可覆盖设置自己展开的高度
        paramLine: 2,
        // 表格宽高
        tableHeight: 600,
        // 列表已选数据
        selectedData: [],
        // 分页的layout
        pageLayout: 'total, sizes, prev, pager, next, jumper',
        isFirst: true,
      }
    },
    // 浏览器自适应相关的内容
    computed: {},
    // 列表页，从缓存中取出时默认重新加载下数据
    activated() {
      if (!this.isFirst) {
        this.search()
      }
      this.isFirst = false
    },
    // 初始化事件，默认调用 ab-grid 的加载数据方法
    mounted() {
      // document.onkeydown = (e) => {
      //   console.log('e',e)
      //   if (e.code != 'Enter') return
      //   this.search()
      // }

      //监听页面回车事件
      window.addEventListener('keyup', this.handleKeyUp);

      window.abTableSearch = this.search
    },
    // 卸载时移除keyup事件
    beforeDestroy() {
      window.removeEventListener('keyup', this.handleKeyUp);
    },
    // 布局发生变化时自动计算宽高
    beforeMount() {
      this.handleHeight()
      window.addEventListener('resize', this.handleHeight)
    },
    onBeforeUnmount() {
      window.removeEventListener('resize', this.handleHeight)
    },
    methods: {
      search(tableRefKey = 'abTable') {
        if (!this.$refs[tableRefKey] || !this.$refs[tableRefKey].getData) {
          return
        }
        this.$refs[tableRefKey].getData()
      },
      searchResetPage(tableRefKey = 'abTable') {
        this.$refs[tableRefKey].tableData.page = 1
        this.$refs[tableRefKey].getData()
      },
      reset(tableRefKey = 'abTable', formRefKey = 'queryForm') {
        this.$refs[formRefKey].resetFields()
        this.$refs[tableRefKey].tableData.page = 1
        this.$refs[tableRefKey].getData()
      },
      clearSelectedData(tableRefKey = 'abTable') {
        this.selectedData.splice(0, this.selectedData.length)
      },
      delBySeletedIds(url, tips, paramName = 'id', endMethod) {
        this.sendAction(
          url + this.selectedData.map((row) => row[paramName]).join(','),
          tips ||
            this.$abT('page.common.benchDelMsg','确定批量删除{a}条数据吗?', { a: this.selectedData.length }),
          null,
          endMethod
        )
      },
      sendAction(url, confirmMsg, data, endMethod, tableRefKey = 'abTable') {
        if (confirmMsg) {
          //如果取消弹窗的方法为null,则空实现避免报错
          if (!endMethod) {
            endMethod = () => {}
          }
          ElMessageBox.confirm(confirmMsg, this.$abT('page.common.confirm','请确认'), {
            confirmButtonText: this.$abT('page.common.ok','确定'),
            cancelButtonText: this.$abT('page.common.cancel','取消'),
            type: 'warning',
          })
            .then(() => {
              let request
              if (data) {
                request = postData(url, data)
              } else {
                request = getData(url)
              }
              request.then((result) => {
                ElMessage({
                  type: 'success',
                  message: result.msg || this.$abT('page.common.operateSuccess','操作成功'),
                  onClose: () => {},
                })
                this.selectedData.splice(0, this.selectedData.length)
                this.search(tableRefKey)
              })
            })
            .catch(endMethod)
          return
        }
        getData(url).then(() => {
          ElMessage({
            type: 'success',
            message: this.$abT('page.common.operateSuccess','操作成功'),
          })
          // this.selectedData.splice(0, this.selectedData.length)
          // this.search(tableRefKey)
        })
      },
      handleHeight() {
        window.setTimeout(() => {
          if (this.collapse) this.tableHeight = this.calTableHeight(2)
          else this.tableHeight = this.calTableHeight(this.paramLine)
        }, 30)
      },
      handleCollapse() {
        this.collapse = !this.collapse
        this.handleHeight()
      },
      calTableHeight() {
        const isInIframe = this.$route?.query?.abIframeType == 'iframe'
        let height = window.innerHeight //- 100
        // 如果是内嵌的Iframe场景，列表页高度计算不再减去100顶部高度，而是只减去padding即可
        const topHeight = isInIframe ? 20 : 110
        // 110 顶部高度，32 增删改查高度，20 padding，55 底部版权，50 已选择 60 分页+俩panding
        let paddingHeight = topHeight + 32 + 20 * 2 + 55 + 50 + 60
        if (this.$refs.titleForm) {
          const clientHeight =
            this.$refs.titleForm.clientHeight ||
            (this.$refs.titleForm.$el && this.$refs.titleForm.$el.clientHeight)
          if (clientHeight) {
            // 搜索表单高度 padding+ 55 底部版权 + 60 分页 + 50 已选择 +60 三个padding (底部版权默认折叠，可以+70展示出来)
            paddingHeight = topHeight + clientHeight + 55 + 60 + 50 + 20
            return height - paddingHeight
          }
        }
        const formHeight = 50
        if (this.collapse) {
          height = height - paddingHeight - formHeight * this.paramLine
        } else {
          height = height - paddingHeight - formHeight * 1
        }
        return height
      },
      handleKeyUp(event) {
        if (event.key === 'Enter') {
          this.search()
        }
      }
    },
  }
</script>
