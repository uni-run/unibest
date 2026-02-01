import type { FeatureContext } from '../../packages/cli/src/features/interface'

export const preApply = async (ctx: FeatureContext) => {
  console.log(`[login] Pre-apply for ${ctx.projectPath}`)
}

export const postApply = async (ctx: FeatureContext) => {
  console.log(`[login] Post-apply for ${ctx.projectPath}`)
}
