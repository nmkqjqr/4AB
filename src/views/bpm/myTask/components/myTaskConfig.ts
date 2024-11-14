export const flowIconColorList = [
  [
    '#eb2f96',
    '#f5222d',
    '#52c41a',
    '#fa8c16',
    '#f759ab',
    '#9254de',
    '#2f54eb',
    '#722ed1',
  ], //绚丽多彩
  [
    '#F25252',
    '#578AF2',
    '#62E075',
    '#42B36F',
    '#FFD660',
    '#B3DE36',
    '#FA914E',
    '#F25252',
  ], //绚丽多彩
  [
    '#7172AD',
    '#509EE3',
    '#9CC177',
    '#A989C5',
    '#F9D45C',
    '#F1B556',
    '#A6E7F3',
    '#7172AD',
  ], //默认色彩组合
  [
    '#006BC2',
    '#4D8CAE',
    '#AD5601',
    '#324498',
    '#2B5B75',
    '#0FA8E0',
    '#FF8500',
    '#006BC2',
  ], //清新草绿
  [
    '#F06B36',
    '#B3DE36',
    '#5EC663',
    '#4598F0',
    '#13BBAD',
    '#E26735',
    '#F25252',
    '#FA914E',
  ], //第一选择
  [
    '#FBE8E1',
    '#FF9090',
    '#D53872',
    '#B91515',
    '#BBA588',
    '#FFD54F',
    '#FF9800',
    '#FBE8E1',
  ], //热情暖阳
  [
    '#984337',
    '#DB5545',
    '#784029',
    '#E39970',
    '#E0D09F',
    '#A5A187',
    '#474844',
    '#984337',
  ], //英伦酒红
  [
    '#B7D62E',
    '#8AC98B',
    '#A4DED9',
    '#67B9CD',
    '#D6D6D7',
    '#8D9E69',
    '#EB4B5C',
    '#B7D62E',
  ], //蓝橙撞色
  [
    '#7260AF',
    '#C366A1',
    '#503491',
    '#DAA6D6',
    '#A999C9',
    '#D3C3DB',
    '#A563AC',
    '#7260AF',
  ], //神秘魅紫
]

export const showTaskDynamic = (bpmData: any) => {
  if (!bpmData) return false
  if (!bpmData.ensureCandidate) return false
  if (!bpmData.bpmInstance) return false
  if (!bpmData.bpmInstance.status) return false
  if (bpmData.bpmInstance.status == 'draft') return false
  return true
}

export const isSmallScreenWidth = (windowWidth: number) => {
  return windowWidth < 1400
}
