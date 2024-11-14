import useAbStoreAdapter from '../../../api/ab-store'

/**
 *  权限指令，当按钮权限返回时，才展示
 *  例子  : <div v-ab-btn-rights:菜单按钮的code ></div>
 */
export default {
  // 只调用一次，指令第一次绑定到元素时调用
  mounted(
    el: { hidden: boolean; style: { display: string } },
    binding: { arg: any; value: any }
  ) {
    const code = binding.arg || binding.value
    if (!code) return
    try {
      const aclStore = useAbStoreAdapter()
      const btnPermission = aclStore.getButtonPermission
      // const btnPermission = {}
      if (btnPermission && btnPermission[code]) {
        return
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}

    console.info(`${code} no rights`)
    el.hidden = true
    el.style.display = 'none'
  },
}
