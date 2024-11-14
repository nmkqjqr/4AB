import { VNode } from 'vue'

/**
 * 权限指令
 *  权限，对控件做 权限控制 目前仅处理  是否展示权限
 *  如果仅编辑时展示则需要 设置场景比如 v-ab-permission:edit="r" 此时就会移除
 *  v-ab-permission="permission.kjcs.cskj.xb" v-model=""
 *
 */
export default {
  // 只调用一次，指令第一次绑定到元素时调用
  created(
    el: { hidden: boolean; style: { display: string } },
    binding: { arg: any; value: any }
  ) {
    handleElementPermission(el, binding, null)
  },
  updated(
    el: { hidden: boolean; style: { display: string } },
    binding: { arg: any; value: any; oldValue: any; instance: any },
    vnode: VNode,
    prevVnode: VNode
  ) {
    if (binding.oldValue && binding.oldValue === binding.value) {
      return
    }

    handleElementPermission(el, binding, vnode)
  },
}

const handleElementPermission = (
  el: { hidden: boolean; style: { display: string } },
  binding: { arg: any; value: any },
  vnode: VNode | null
) => {
  if (!binding.value) return

  // 是否为 无权限
  let isHidden = binding.value == 'n'
  // 如果编辑权限时，没有 w 权限，则也隐藏
  if (binding.arg === 'edit' && binding.value == 'r') {
    isHidden = true
  }

  if (!isHidden) {
    el.hidden = false
    el.style.display = ''
  } else {
    el.hidden = true
    el.style.display = 'none'
  }
}
