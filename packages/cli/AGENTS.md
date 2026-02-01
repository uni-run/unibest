# NPM 发布工作流

## 发布步骤

### 1. 检查登录状态
```bash
npm whoami
```
- 如果返回用户名 → 已登录，继续步骤 2
- 如果返回错误或空 → 未登录，执行 `npm login`

### 2. 登录 npm（如果未登录）
```bash
npm login
# 输入用户名、密码，然后等待 OTP 验证码
```
- 密码输入不会显示，是正常的
- OTP 会通过邮箱或 Authenticator app 发送
- 如果登录失败（如 401），说明会话过期，需要重新登录

### 3. 升级版本号
```bash
cd /path/to/package
npm version patch --no-git-tag-version
```

### 4. 构建项目
```bash
pnpm build
# 或 npm run build
```

### 5. 发布到 npm
```bash
npm publish --no-workspaces
```

### 6. 处理 OTP 验证码
发布命令可能返回 `EOTP` 错误，要求提供一次性验证码：
- **首次发布时直接需要 OTP**：询问用户 OTP 后加 `--otp` 参数重试
- **首次发布不需要 OTP**：等待 npm 返回 EOTP 后再询问

### 7. OTP 验证后重新发布
```bash
npm publish --no-workspaces --otp=<验证码>
```

## 完整命令序列

```bash
# 1. 检查登录状态
npm whoami || npm login

# 2. 进入项目目录
cd /path/to/package

# 3. 升级版本
npm version patch --no-git-tag-version

# 4. 构建
pnpm build

# 5. 发布（如果需要 OTP，会返回 EOTP）
npm publish --no-workspaces

# 6. 等待用户提供 OTP，然后用 OTP 重新发布
npm publish --no-workspaces --otp=<用户提供的验证码>
```

## 关键点

1. **先检查登录** - `npm whoami` 可以快速验证登录状态
2. **只问 OTP** - 不需要重复执行发布命令，让用户直接提供 OTP
3. **`--no-workspaces`** - monorepo 项目需要加这个参数避免发布所有 workspace
4. **`--no-git-tag-version`** - 只更新 package.json 版本，不创建 git tag
5. **版本号递增** - 如果版本已存在，需要先执行 `npm version patch`
6. **npm 源** - 确保是官方源 `https://registry.npmjs.org/`

## 常见错误处理

| 错误码 | 原因 | 解决 |
|--------|------|------|
| E401/UNAUTHENTICATED | 未登录或登录过期 | 执行 `npm login` 重新登录 |
| EOTP | 需要一次性验证码 | 询问用户 OTP 后加 `--otp` 参数重试 |
| E403 | 版本已发布 | 执行 `npm version patch` 升级版本号后重试 |
| ENOWORKSPACES | workspace 项目 | 添加 `--no-workspaces` 参数 |
