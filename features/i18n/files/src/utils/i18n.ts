import { t } from '@/locale/index'

export function testI18n() {
  uni.showModal({
    title: 'i18n 测试',
    content: t('i18n.title'),
  })
}
