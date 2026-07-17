export function getSafeRedirectPath(path: string | undefined, fallback: string) {
  if (!path?.startsWith('/') || path.startsWith('//')) {
    return fallback
  }

  return path
}