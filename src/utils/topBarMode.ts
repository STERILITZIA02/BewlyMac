export type TopBarModeSource = 'original' | 'bewly' | 'custom'

export function resolveUseOriginalBilibiliTopBar(
  mode: TopBarModeSource,
  customUseOriginalBilibiliTopBar: boolean,
): boolean {
  if (mode === 'original')
    return true
  if (mode === 'bewly')
    return false
  return customUseOriginalBilibiliTopBar
}
