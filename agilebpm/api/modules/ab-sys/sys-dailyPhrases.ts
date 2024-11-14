const servicePrefix = '/ab-bpm/sys/sysDailyPhrases'

// 常用语管理-分页查询
export const dailyPhrasesListJson = `${servicePrefix}/listJson`
// 常用语管理-通过ID查询
export const dailyPhrasesGet = `${servicePrefix}/get?id=`
// 常用语管理-新增或修改
export const dailyPhrasesSaveOrUpdate = `${servicePrefix}/saveOrUpdate`
// 常用语管理-启动禁用
export const dailyPhrasesUpdateEnable = `${servicePrefix}/updateEnable`
// 常用语管理-删除
export const dailyPhrasesRemove = `${servicePrefix}/remove?id=`
