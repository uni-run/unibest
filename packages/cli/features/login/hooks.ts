import type { FeatureContext } from '../../packages/cli/src/features/interface'

export async function preApply(ctx: FeatureContext) {
  console.log(`[login] Pre-apply for ${ctx.projectPath}`)
}

export async function postApply(ctx: FeatureContext) {
  console.log(`[login] Post-apply for ${ctx.projectPath}`)
}
