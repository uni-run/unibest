import { color } from './color'

/**
 * 打印帮助信息
 */
export function printHelp(): void {
  console.log(color.green('\ncreate-unibest - 跨平台开发框架脚手架'))
  console.log('')
  console.log(color.blue('快速使用:'))
  console.log(color.green('  pnpm create unibest <command> [options]'))
  console.log(color.green('  pnpm create unibest my-project             创建新的unibest项目'))
  console.log(color.green('  pnpm create unibest -v                     查看版本信息'))
  console.log(color.green('  pnpm create unibest -h                     查看帮助信息'))
  console.log('')
  console.log(color.blue('选项:'))
  console.log('  -p, --platform <type>  指定平台 (h5, mp-weixin, app, mp-alipay, mp-toutiao)')
  console.log('                         支持多选: -p h5,mp-weixin 或 -p h5 -p mp-weixin')
  console.log('  -u, --ui <library>     指定UI库 (wot-ui, uview-pro, sard-uniapp, uv-ui, uview-plus, none)')
  console.log('  -l, --login            是否需要登录策略')
  console.log('  -i, --i18n             是否需要多语言')
  console.log('')
  console.log(color.blue('示例:'))
  console.log('  pnpm create unibest my-project -u wot-ui -p h5,mp-weixin')
  console.log('  pnpm create unibest my-project -u uview-plus -l -i')
  console.log('  pnpm create unibest my-project -u none -p h5,app,mp-weixin')
  console.log('')
  console.log(color.blue('全局安装 (可选):'))
  console.log(color.green('  npm i -g create-unibest                    全局安装，得到 best 命令'))
  console.log(color.green('  best <command> [options]'))
  console.log(color.green('  best my-project                            创建新的unibest项目'))
  console.log('')
}

