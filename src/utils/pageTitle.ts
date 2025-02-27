import pinia from '@/store'
import { abT } from '@/i18n'
import { titleReverse, titleSeparator } from '@/config'
import { useSettingsStore } from '@/store/modules/settings'

/**
 * @description 设置标题
 * @param pageTitle
 * @returns {string}
 */
export default function getPageTitle(
  pageTitle: string | undefined,
  i18nKey: any
) {
  const { getTitle } = useSettingsStore(pinia)
  let newTitles = []
  if (pageTitle) newTitles.push(abT(`menu.${i18nKey}`, pageTitle))
  if (getTitle) newTitles.push(getTitle)
  if (titleReverse) newTitles = newTitles.reverse()
  return newTitles.join(titleSeparator)
}
