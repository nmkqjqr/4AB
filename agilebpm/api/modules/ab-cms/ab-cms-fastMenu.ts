import { getData, postData } from './../../ab-request'

const servicePrefix = '/ab-bpm/cms/cmsFastMenu'

// 快捷菜单（快捷操作） 获取list
export function getFastMenuList() {
  return getData(servicePrefix + '/fastMenuList')
}

// 批量保存或修改
export function saveFastMenu(idList: string[]) {
  return postData(servicePrefix + '/saveBatch', idList)
}

// 快捷菜单（快捷操作）清空指定
export function deleteAllFastMenu() {
  return getData(servicePrefix + '/removeAll')
}

// 快捷菜单（快捷操作）清空指定
export function deleteOneFastMenu(fastMenu: FastMenu) {
  return getData(servicePrefix + '/remove', fastMenu)
}

//授权对象泛型
interface FastMenu {
  id: string
}
