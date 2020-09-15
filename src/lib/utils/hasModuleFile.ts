export default function hasModuleFile(filename: string): boolean {
  try {
    return !!require.resolve(filename)
  } catch (_) {
    return false
  }
}
