import type { FeatureContext } from '../../packages/cli/src/features/interface'

export async function preApply(ctx: FeatureContext) {
  console.log(`[i18n] Pre-apply for ${ctx.projectPath}`)
}

export async function postApply(ctx: FeatureContext) {
  console.log(`[i18n] Post-apply for ${ctx.projectPath}`)
}
