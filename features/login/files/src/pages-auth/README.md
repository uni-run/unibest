# 登录页

需要输入账号、密码/验证码的登录页。

## 适用性

本页面主要用于 `h5` 和 `APP`。

小程序通常有平台的登录方式 `uni.login` 通常用不到登录页，所以不适用于 `小程序`。

如果需要在小程序中使用，设置 `LOGIN_PAGE_ENABLE_IN_MP = true` 在 `src/router/config.ts`。

## 登录跳转

登录的跳转逻辑主要在 `src/router/interceptor.ts` 和 `src/pages-auth/login.vue`。
