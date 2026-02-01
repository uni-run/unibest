import type { PromptResult } from '../types'
import { exec } from 'node:child_process'
import { promises as fsPromises } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { log } from '@clack/prompts'
import { red } from 'kolorist'
import { replacePackageJson } from './replacePackageJson'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const USE_LOCAL_TEMPLATE = process.env.LOCAL_TEMPLATE === 'true'

let TEMPLATE_BASE_PATH: string | null = null

async function getTemplateBasePath(): Promise<string> {
  if (TEMPLATE_BASE_PATH)
    return TEMPLATE_BASE_PATH

  const candidates = [
    join(__dirname, '..', '..', '..', 'packages', 'template-base'),
    join(__dirname, '..', '..', 'packages', 'template-base'),
  ]

  const { existsSync } = await import('node:fs')

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      TEMPLATE_BASE_PATH = candidate
      return candidate
    }
  }

  throw new Error('无法找到 template-base 目录')
}

async function removeGitFolder(localPath: string): Promise<void> {
  const gitFolderPath = join(localPath, '.git')
  await fsPromises.rm(gitFolderPath, { recursive: true, force: true })
}

const REPO_URL = 'https://gitee.com/feige996/unibest.git'

async function cloneRepo(projectName: string, branch: string): Promise<void> {
  log.info('从 Git 克隆基础模板...')

  await new Promise<void>((resolve, reject) => {
    const execStr = `git clone --depth=1 -b ${branch} ${REPO_URL} "${projectName}"`

    exec(execStr, async (error) => {
      if (error) {
        log.error(`${red('克隆模板失败:')} ${error}`)
        reject(error)
        return
      }

      try {
        await removeGitFolder(projectName)
        resolve()
      }
      catch (error) {
        log.error(`${red('移除 .git 文件夹失败:')} ${error}`)
        reject(error)
      }
    })
  })
}

export async function copyLocalTemplate(projectName: string): Promise<string> {
  const projectPath = join(process.cwd(), projectName)
  const sourcePath = await getTemplateBasePath()

  log.info('使用本地模板...')

  await new Promise<void>((resolve, reject) => {
    const execStr = `cp -r "${sourcePath}/." "${projectPath}/"`
    exec(execStr, (error) => {
      if (error) {
        log.error(`${red('复制模板失败:')} ${error}`)
        reject(error)
      }
      else {
        resolve()
      }
    })
  })

  return projectPath
}

export async function cloneRepoByBranch(root: string, name: string, branch: string, options: PromptResult) {
  try {
    if (USE_LOCAL_TEMPLATE) {
      await copyLocalTemplate(name)
    }
    else {
      await cloneRepo(name, 'base')
    }
  }
  catch (error) {
    log.error(`${red(`模板下载失败！`)} ${error}`)
    process.exit(1)
  }

  const projectPath = join(root, name)
  replacePackageJson(projectPath, name, '1.0.0', options)
}
