import { layoutComponents, customCompon } from './layoutconfig'

export const groupCompon = [
  {
    title: '基础控件',
    components: layoutComponents,
  },
  {
    title: '业务组件',
    components: customCompon,
  },
]

export const defaultJson = {
  name: '',
  code: '',
  id: '',
  designJson: { params: [], list: [] },
}
