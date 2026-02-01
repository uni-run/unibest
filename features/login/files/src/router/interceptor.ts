import { isMp } from '@uni-helper/uni-env'
import { useTokenStore } from '@/store/token'
import { isPageTabbar, tabbarStore } from '@/tabbar/store'
import { getAllPages, getLastPage, HOME_PAGE, parseUrlToObj } from '@/utils/index'
import { EXCLUDE_LOGIN_PATH_LIST, isNeedLoginMode, LOGIN_PAGE, LOGIN_PAGE_ENABLE_IN_MP } from './config'

export const FG_LOG_ENABLE = false

export function judgeIsExcludePath(path: string) {
  const isDev = import.meta.env.DEV
  if (!isDev) {
    return EXCLUDE_LOGIN_PATH_LIST.includes(path)
  }
  const allExcludeLoginPages = getAllPages('excludeLoginPath')
  return EXCLUDE_LOGIN_PATH_LIST.includes(path) || (isDev && allExcludeLoginPages.some(page => page.path === path))
}

export const navigateToInterceptor = {
  invoke({ url, query }: { url: string, query?: Record<string, string> }) {
    if (url === undefined) {
      return
    }
    let { path, query: _query } = parseUrlToObj(url)

    FG_LOG_ENABLE && console.log('\n\n路由拦截器:-------------------------------------')
    FG_LOG_ENABLE && console.log('路由拦截器 1: url->', url, ', query ->', query)
    const myQuery = { ..._query, ...query }

    if (!path.startsWith('/')) {
      const currentPath = getLastPage()?.route || ''
      const normalizedCurrentPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
      const baseDir = normalizedCurrentPath.substring(0, normalizedCurrentPath.lastIndexOf('/'))
      path = `${baseDir}/${path}`
    }

    tabbarStore.setAutoCurIdx(path)

    if (isMp && !LOGIN_PAGE_ENABLE_IN_MP) {
      return true
    }

    const tokenStore = useTokenStore()

    if (tokenStore.hasLogin) {
      if (path !== LOGIN_PAGE) {
        return true
      }
      else {
        const url = myQuery.redirect || HOME_PAGE
        if (isPageTabbar(url)) {
          uni.switchTab({ url })
        }
        else {
          uni.navigateTo({ url })
        }
        return false
      }
    }
    let fullPath = path

    if (Object.keys(myQuery).length) {
      fullPath += `?${Object.keys(myQuery).map(key => `${key}=${myQuery[key]}`).join('&')}`
    }
    const redirectUrl = `${LOGIN_PAGE}?redirect=${encodeURIComponent(fullPath)}`

    if (isNeedLoginMode) {
      if (judgeIsExcludePath(path)) {
        return true
      }
      else {
        if (path === LOGIN_PAGE) {
          return true
        }
        FG_LOG_ENABLE && console.log('1 isNeedLogin(白名单策略) redirectUrl:', redirectUrl)
        uni.navigateTo({ url: redirectUrl })
        return false
      }
    }
    else {
      if (judgeIsExcludePath(path)) {
        FG_LOG_ENABLE && console.log('2 isNeedLogin(黑名单策略) redirectUrl:', redirectUrl)
        uni.navigateTo({ url: redirectUrl })
        return false
      }
      return true
    }
  },
}

export const chooseLocationInterceptor = {
  invoke(options: any) {
    FG_LOG_ENABLE && console.log('chooseLocation 调用，直接放行:', options)
    return true
  },
}

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor)
    uni.addInterceptor('reLaunch', navigateToInterceptor)
    uni.addInterceptor('redirectTo', navigateToInterceptor)
    uni.addInterceptor('switchTab', navigateToInterceptor)
    uni.addInterceptor('chooseLocation', chooseLocationInterceptor)
  },
}
