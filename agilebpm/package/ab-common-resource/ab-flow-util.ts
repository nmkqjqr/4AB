/**
 * 获取可用的用户任务列表
 * @param nodeMap
 * @returns
 */
export const getUserNodes = (nodeMap: Map<string, NodeConfig>) => {
  return getNodeListByType(nodeMap, 'UserTask,StartEvent')
}

export const getNodeListByType = (
  nodeMap: Map<string, NodeConfig>,
  type: string
) => {
  const nodeList: Array<NodeConfig> = []

  for (const item in nodeMap) {
    const node = nodeMap[item]
    if (!type || type.indexOf(node.nodeType) != -1) {
      nodeList.push(node)
    }
  }

  return nodeList
}

/**
 * 获取条件脚本的描述
 * @param data
 * @returns
 */
export const getScriptDesc = (data: any) => {
  if (!data) {
    return ''
  }
  if (!data.type) {
    return data.desc || data.script
  }

  if (data.type == 'config') {
    return data.configScript.desc
  }
  if (data.type == 'hand') {
    return data.handScript.desc || data.handScript.script
  }
}

export const getScriptScript = (data: any) => {
  if (!data) {
    return ''
  }
  if (!data.type) {
    return data.script
  }

  if (data.type == 'config') {
    return data.configScript.script
  }
  if (data.type == 'hand') {
    return data.handScript.script
  }
}
