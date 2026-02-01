import process from 'node:process'
import { logger } from '../../utils/logger'
import type { PromptResult } from '../../types'
import { log } from '@clack/prompts'
import { cloneRepoByBranch } from '../../utils/cloneRepo'
import { applyUILibraryConfig } from '../../utils/uiLibrary'
import { injectI18n, injectLogin } from '../../utils/injector'
import { getSelectedFeatures } from '../../features'
import { debug } from '../../utils/debug'
import path from 'node:path'

const root = process.cwd()

export async function generateProject(options: PromptResult) {
  debug('generateProject options', options)
  const { projectName, platforms, uiLibrary, loginStrategy, i18n } = options

  const projectPath = path.join(root, projectName)

  // 1. 克隆基础模板（base 分支）
  debug('拉取 base 分支')
  await cloneRepoByBranch(root, projectName, 'base', options)

  // 2. 注入 i18n feature
  if (i18n) {
    debug('注入 i18n feature')
    const results = await injectI18n(projectPath)
    for (const result of results) {
      if (result.success) {
        debug(result.message)
      } else {
        logger.warn(result.message)
      }
    }
  }

  // 3. 注入 login feature
  if (loginStrategy) {
    debug('注入 login feature')
    const results = await injectLogin(projectPath)
    for (const result of results) {
      if (result.success) {
        debug(result.message)
      } else {
        logger.warn(result.message)
      }
    }
  }

  // 4. UI 库配置
  if (uiLibrary === 'none') {
    debug('不引入任何UI库')
  } else {
    debug(`配置 UI 库: ${uiLibrary}`)
    try {
      await applyUILibraryConfig(projectPath, uiLibrary)
      logger.success(`UI 库 ${uiLibrary} 配置完成`)
    } catch (error) {
      logger.warn(`UI 库 ${uiLibrary} 配置失败: ${(error as Error).message}`)
      logger.info('您可以在项目创建后手动配置 UI 库')
    }
  }

  // 5. 收集并安装 feature 依赖
  const selectedFeatures = getSelectedFeatures(options)
  const allDeps: Record<string, string> = {}
  for (const feature of selectedFeatures) {
    if (feature.dependencies) {
      Object.assign(allDeps, feature.dependencies)
    }
  }

  if (Object.keys(allDeps).length > 0) {
    logger.info(`Feature 依赖: ${Object.keys(allDeps).join(', ')}`)
  }

  try {
    log.success(`项目${projectName}创建成功！`)
    logger.info('下一步:')
    logger.info(`  cd ${projectName}`)
    logger.info('  pnpm i')
    logger.info('  pnpm dev')
    logger.info('  运行完以上命令后，再运行其他平台')
    logger.info('  如：pnpm dev:mp, pnpm dev:app 等')
  } catch (error) {
    logger.error(`生成项目失败: ${(error as Error).message}`)
    throw error
  }
}
