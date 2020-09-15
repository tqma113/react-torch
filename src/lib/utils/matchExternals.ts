export default function matchExternals(
  externals: string[],
  modulePath: string
): boolean {
  for (let i = 0; i < externals.length; i++) {
    if (modulePath.startsWith(externals[i])) {
      return true
    }
  }
  return false
}
