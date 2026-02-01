import type { FeatureContext } from '../../packages/cli/src/features/interface'

export const preApply = async (ctx: FeatureContext) => {
  console.log(`[i18n] Pre-apply for ${ctx.projectPath}`)
}

export const postApply = async (ctx: FeatureContext) => {
  console.log(`[i18n] Post-apply for ${ctx.projectPath}`)
}
