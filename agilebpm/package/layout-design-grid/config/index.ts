import {
  layoutComponents,
  commonCompon,
  bizCompon,
  chartCompon,
} from './layoutconfig'

export const groupCompon = [
  {
    title: '布局',
    components: layoutComponents,
  },
  {
    title: '通用',
    components: commonCompon,
  },
  {
    title: '业务',
    components: bizCompon,
  },
  {
    title: '图表',
    components: chartCompon,
  },
]

export const formCombinationDefaultJson = {
  name: '',
  code: '',
  id: '',
  designJson: { params: [], list: [] },
}
