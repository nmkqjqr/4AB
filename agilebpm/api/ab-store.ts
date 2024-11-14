// 获取所有按钮，用于 权限指令组件，有用到它的则需要适配，登录后会把用户菜单按钮权限放进去
// 如果有自身状态管理这里可能需要适配
const useAbStoreAdapter = () => {
  return (window as any).useAbStoreAdapter()
}

export default useAbStoreAdapter
