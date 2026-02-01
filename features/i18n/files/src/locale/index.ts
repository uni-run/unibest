import { createI18n } from 'vue-i18n'

import en from './en.json'
import zhHans from './zh-Hans.json'

const messages = {
  en,
  'zh-Hans': zhHans,
}

const i18n = createI18n({
  locale: uni.getLocale(),
  messages,
  allowComposition: true,
})

export function getTemplateByKey(key: string) {
  if (!key) {
    console.error(`[i18n] Function getTemplateByKey(), key param is required`)
    return ''
  }
  const locale = uni.getLocale()
  const message = messages[locale]
  if (Object.keys(message).includes(key)) {
    return message[key]
  }

  try {
    const keyList = key.split('.')
    return keyList.reduce((pre, cur) => {
      return pre[cur]
    }, message)
  }
  catch (error) {
    console.error(`[i18n] Function getTemplateByKey(), key param ${key} is not existed.`)
    return ''
  }
}

function formatI18n(template: string, data?: any) {
  return template.replace(/\{([^}]+)\}/g, (match, key: string) => {
    const arr = key.trim().split('.')
    let result = data
    while (arr.length) {
      const first = arr.shift()
      result = result[first]
    }
    return result
  })
}

export function t(key: string, data?: any) {
  return formatI18n(getTemplateByKey(key), data)
}

export default i18n
