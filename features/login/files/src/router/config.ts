import { getAllPages } from '@/utils'

export const LOGIN_STRATEGY_MAP = {
  DEFAULT_NO_NEED_LOGIN: 0,
  DEFAULT_NEED_LOGIN: 1,
}

export const LOGIN_STRATEGY = LOGIN_STRATEGY_MAP.DEFAULT_NO_NEED_LOGIN
export const isNeedLoginMode = LOGIN_STRATEGY === LOGIN_STRATEGY_MAP.DEFAULT_NEED_LOGIN

export const LOGIN_PAGE = '/pages-auth/login'
export const REGISTER_PAGE = '/pages-auth/register'

export const LOGIN_PAGE_LIST = [LOGIN_PAGE, REGISTER_PAGE]

export const excludeLoginPathList = getAllPages('excludeLoginPath').map(page => page.path)

export const EXCLUDE_LOGIN_PATH_LIST = [
  '/pages/xxx/index',
  '/pages-sub/xxx/index',
  ...excludeLoginPathList,
]

export const LOGIN_PAGE_ENABLE_IN_MP = false
