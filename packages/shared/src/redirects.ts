/**
 * Sanitize a callbackUrl query parameter for safe client-side redirect.
 * Only allows relative paths starting with "/".
 * Rejects absolute URLs, protocol-relative URLs, and dangerous schemes.
 */
export function sanitizeCallbackUrl(url: string | null | undefined): string {
  if (!url) return "/";

  const trimmed = url.trim();
  if (!trimmed) return "/";

  // Reject protocol-relative URLs (//evil.com)
  if (trimmed.startsWith("//")) return "/";

  // Reject dangerous schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return "/";
  }

  // Only allow relative paths
  if (trimmed.startsWith("/")) return trimmed;

  // Absolute URLs — reject
  try {
    new URL(trimmed);
    return "/";
  } catch {
    // Not a valid URL, treat as relative
    if (trimmed.startsWith("/")) return trimmed;
    return "/";
  }
}
