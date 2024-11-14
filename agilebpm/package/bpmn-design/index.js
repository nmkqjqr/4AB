import Designer from './designer.vue'
import { useZIndex } from 'element-plus'
import { watch } from 'vue'
Designer.install = function (Vue) {
  Vue.component(Designer.name, Designer)
}
export function setupZIndex(rootuseZIndex) {
  if (rootuseZIndex) {
    watch(
      [
        () => useZIndex().currentZIndex.value,
        () => rootuseZIndex().currentZIndex.value,
      ],
      ([z1, z2]) => {
        if (z1 < z2) {
         // console.info('z1 < z2', z1, z2)
          useZIndex().nextZIndex()
          /* console.info(
            'z1  z2 after',
            useZIndex().currentZIndex.value,
            rootuseZIndex().currentZIndex.value
          ) */
        } else if (z1 > z2) {
         // console.info('z1 > z2', z1, z2)
          rootuseZIndex().nextZIndex()
         /*  console.info(
            'z1  z2 after',
            useZIndex().currentZIndex.value,
            rootuseZIndex().currentZIndex.value
          ) */
        }
      }
    )
  }
}
export default Designer
