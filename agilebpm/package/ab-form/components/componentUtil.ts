//将字典数据转换成指定的格式
export function formatDictList(
  dicList: { code: string; name: string; disable: number }[]
) {
  return dicList.map((s) => {
    return {
      disable: s.disable,
      key: s.code,
      text: s.name,
    }
  })
}
