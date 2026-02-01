import { exec } from 'node:child_process'
import { promises as fsPromises } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { red } from 'kolorist'
import { replacePackageJson } from './replacePackageJson'
import type { PromptResult } from '../types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const USE_LOCAL_TEMPLATE = process.env.LOCAL_TEMPLATE === 'true'

let TEMPLATE_BASE_PATH: string | null = null

async function getTemplateBasePath(): Promise<string> {
  if (TEMPLATE_BASE_PATH) return TEMPLATE_BASE_PATH
  
  const candidates = [
    join(__dirname, '..', '..', '..', 'packages', 'template-base'),
    join(__dirname, '..', '..', 'packages', 'template-base'),
  ]
  
  const { existsSync } = await import('fs')
  
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
  try {
    await new Promise<void>((resolve, reject) => {
      const execStr = `git clone --depth=1 -b ${branch} ${REPO_URL} "${projectName}"`

      exec(execStr, async error => {
        if (error) {
          console.error(`${red('exec error:')} ${error}`)
          reject(error)
          return
        }

        try {
          await removeGitFolder(projectName)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    })
    return
  } catch (error) {
    console.error(`${red('cloneRepo error:')} ${error}`)
    throw new Error('cloneRepo error')
  }
}

export async function copyLocalTemplate(projectName: string): Promise<string> {
  const projectPath = join(process.cwd(), projectName)
  const sourcePath = await getTemplateBasePath()

  await new Promise<void>((resolve, reject) => {
    const execStr = `cp -r "${sourcePath}/." "${projectPath}/"`
    exec(execStr, error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })

  return projectPath
}

export async function cloneRepoByBranch(root: string, name: string, branch: string, options: PromptResult) {
  try {
    if (USE_LOCAL_TEMPLATE) {
      console.log('使用本地模板测试...')
      await copyLocalTemplate(name)
    } else {
      console.log('从 Git 克隆基础模板...')
      await cloneRepo(name, 'base')
    }
  } catch (error) {
    console.error(`${red(`模板下载失败！`)} ${error}`)
    process.exit(1)
  }

  const projectPath = join(root, name)
  replacePackageJson(projectPath, name, '1.0.0', options)
}
