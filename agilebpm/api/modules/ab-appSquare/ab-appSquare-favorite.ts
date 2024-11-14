import request, { getData, postData } from '../../ab-request'
import { lcProjectServicePrefix } from '../../ab-api-prefix'
// 收藏应用
export const saveFavoriteUrl = `${lcProjectServicePrefix}/favorite/save`
