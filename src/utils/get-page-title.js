import defaultSettings from '@/settings'

const title = defaultSettings.title || '医疗质控中心'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
