import { bold, green, red, yellow, cyan } from 'kolorist'

/**
 * 日志工具类，提供不同级别的日志输出
 */
export const logger = {
  /** 普通信息日志 */
  info: (message: string) => {
    console.log(`${cyan(bold(message))}`)
  },

  /** 成功日志 */
  success: (message: string) => {
    console.log(`${green(bold(message))}`)
  },

  /** 错误日志 */
  error: (message: string) => {
    console.error(`${red(bold(message))}`)
  },

  /** 警告日志 */
  warn: (message: string) => {
    console.log(`${yellow(bold(message))}`)
  },

  /** 提示日志 */
  tip: (message: string) => {
    console.log(`${cyan(bold(message))}`)
  },
}
