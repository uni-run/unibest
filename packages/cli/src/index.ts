#!/usr/bin/env node
import process from 'node:process'
import minimist from 'minimist'
import { createCommand } from './commands/create'
import { printHelp } from './utils/help'
import { debug } from './utils/debug' // 导入我们的debug工具函数
import { getUnibestVersionFromGitee as getUnibestVersion } from './utils/unibestVersion'
import { version } from '../package.json'
import { color } from './utils/color'
import { green, red } from 'kolorist'
import { yellow } from 'kolorist'
/**
 * unibest-cli 主入口函数
 */
function main() {
  const args = minimist(process.argv.slice(2))
  const command = args._[0]
  debug('command:', command)
  debug('args:', args)

  // 首先检查版本相关的选项
  if (args.v || args.version) {
    printVersion()
    return
  }
  if (args.h || args.help) {
    printHelp()
    return
  }

  // 根据命令执行不同的功能
  switch (command) {
    case 'create':
    case 'new':
      createCommand(args)
      break
    case '-h':
    case '--help':
      printHelp()
      break
    case '-v':
    case '--version':
      printVersion()
      break
    default:
      // 不使用 new 关键字也可以直接创建项目
      createCommand(args)
      break
  }
}

/**
 * 打印版本信息
 */
async function printVersion() {
  const cliVersion = version
  const latestVersion = await getUnibestVersion()

  if (latestVersion && latestVersion !== cliVersion) {
    console.log(`unibest-cli ${cliVersion} ${yellow(`->`)} ${green(`最新版本: ${latestVersion}`)}`)
    console.log(`使用 ${green(`npm update -g create-unibest`)} 或 ${green(`pnpm add -g create-unibest`)} 更新`)
    console.log()
  } else {
    console.log(`unibest-cli ${cliVersion}`)
    console.log()
  }
}

// 执行主函数
main()
