export function encodeBase64(raw: string) {
  // encode before base64 to avoid non-latin Unicode issues
  return btoa(unescape(encodeURIComponent(raw)));
}

export function decodeBase64(encoded: string) {
  return decodeURIComponent(escape(atob(encoded)));
}
