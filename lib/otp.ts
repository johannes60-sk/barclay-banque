import crypto from "crypto"

/**
 * Generate a random OTP code (6 digits)
 */
export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Hash OTP code using SHA-256
 */
export function hashOTPCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex")
}

/**
 * Verify if provided code matches the hash
 */
export function verifyOTPCode(code: string, hash: string): boolean {
  const providedHash = hashOTPCode(code)
  return providedHash === hash
}

/**
 * Check if OTP has expired
 */
export function isOTPExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

/**
 * Get expiration date (5 minutes from now)
 */
export function getOTPExpirationDate(): Date {
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 5)
  return expiresAt
}

/**
 * Mask phone number for display (e.g., +33 7 ** ** ** 16)
 */
export function maskPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.length < 8) return phoneNumber

  const countryCode = phoneNumber.substring(0, 3) // +33
  const firstDigit = phoneNumber.substring(3, 5) // 7
  const lastTwo = phoneNumber.slice(-2) // 16

  return `${countryCode} ${firstDigit} ** ** ** ${lastTwo}`
}
