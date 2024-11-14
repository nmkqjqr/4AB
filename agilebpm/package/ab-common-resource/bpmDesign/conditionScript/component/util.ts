export const formatDictList = (dicList: any) => {
  return dicList.map((s: any) => {
    return {
      disable: s.disable,
      key: s.code || s.value,
      text: s.name || s.label,
    }
  })
}

export default {
  mounted(el: any, binding: any) {
    // 获取element-ui定义好的scroll盒子
    if (!binding.arg) return
    const selectDom = document.querySelector(
      `.${binding.arg} .el-select-dropdown__wrap`
    )
    if (!selectDom) return
    el.selectDomInfo = selectDom
    /*
     * scrollHeight 获取元素内容高度(只读)
     * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
     * clientHeight 读取元素的可见高度(只读)
     * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
     * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
     */
    function loadMoreFn() {
      const isBase =
        el.selectDomInfo.scrollHeight - el.selectDomInfo.scrollTop <=
        el.selectDomInfo.clientHeight
      if (isBase) {
        binding.value && binding.value()
      }
    }
    el.loadMoreFn = loadMoreFn
    selectDom.addEventListener('scroll', loadMoreFn)
  },
  beforeUnmount(el: any) {
    if (el.loadMoreFn) {
      el.selectDomInfo.removeEventListener('scroll', el.loadMoreFn)
      delete el.selectDomInfo
      delete el.loadMoreFn
    }
  },
}
