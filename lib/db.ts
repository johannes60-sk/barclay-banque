/**
 * Database API - Supabase Implementation
 * This file provides a compatibility layer for migrating from IndexedDB to Supabase
 */

import * as SupabaseDB from "./supabase-db"

// Re-export types
export type { Transaction, UserProfile } from "./supabase-db"

// ==================== AUTHENTICATION ====================

/**
 * Register a new user
 */
export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
): Promise<void> {
  const { user, error } = await SupabaseDB.registerUser(email, password, firstName, lastName, phoneNumber)

  if (error) {
    throw error
  }
}

/**
 * Login user - returns the user profile or null
 */
export async function loginUser(email: string, password: string): Promise<any> {
  const { user, error } = await SupabaseDB.loginUser(email, password)

  if (error || !user) {
    return null
  }

  // Return profile data in the expected format
  if (user.profile) {
    return {
      email: user.profile.email,
      name: `${user.profile.first_name} ${user.profile.last_name}`,
      firstName: user.profile.first_name,
      lastName: user.profile.last_name,
      balance: user.profile.balance,
      accountNumber: user.profile.account_number,
      isLoggedIn: true,
      id: user.id,
    }
  }

  return null
}

/**
 * Logout current user
 */
export async function logoutUser(email?: string): Promise<void> {
  await SupabaseDB.logoutUser()
}

/**
 * Get current authenticated user data
 */
export async function getAuthData(): Promise<any> {
  const { user, error } = await SupabaseDB.getCurrentUser()

  if (error || !user || !user.profile) {
    return null
  }

  return {
    email: user.profile.email,
    name: `${user.profile.first_name} ${user.profile.last_name}`,
    firstName: user.profile.first_name,
    lastName: user.profile.last_name,
    balance: user.profile.balance,
    accountNumber: user.profile.account_number,
    isLoggedIn: true,
    id: user.id,
  }
}

/**
 * Get current user (alias for getAuthData)
 */
export async function getCurrentUser(): Promise<any> {
  return getAuthData()
}

/**
 * Save auth data (for backward compatibility - not recommended)
 */
export async function saveAuthData(authData: any): Promise<void> {
  console.warn("saveAuthData is deprecated. Use registerUser instead.")
  // This function is deprecated, but kept for compatibility
  // You should use registerUser instead
  throw new Error("saveAuthData is not supported with Supabase. Use registerUser instead.")
}

/**
 * Clear auth data (alias for logoutUser)
 */
export async function clearAuthData(): Promise<void> {
  await logoutUser()
}

/**
 * Delete current user account
 */
export async function deleteAccount(password: string): Promise<void> {
  const { error } = await SupabaseDB.deleteAccount(password)

  if (error) {
    throw error
  }
}

// ==================== USER PROFILE ====================

/**
 * Update user balance
 */
export async function updateBalance(emailOrUserId: string, newBalance: number): Promise<void> {
  // Get current user to get their ID
  const currentUser = await getAuthData()
  if (!currentUser) {
    throw new Error("User not authenticated")
  }

  const { error } = await SupabaseDB.updateBalance(currentUser.id, newBalance)

  if (error) {
    throw error
  }
}

// ==================== TRANSACTIONS ====================

/**
 * Save a new transaction
 */
export async function saveTransaction(transaction: any): Promise<void> {
  // Get current user to add user_id
  const currentUser = await getAuthData()
  if (!currentUser) {
    throw new Error("User not authenticated")
  }

  const { error } = await SupabaseDB.saveTransaction({
    user_id: currentUser.id,
    type: transaction.type,
    description: transaction.description,
    amount: transaction.amount,
    date: transaction.date,
    status: transaction.status,
    iban: transaction.iban,
    swift: transaction.swift,
    reference: transaction.reference,
  })

  if (error) {
    throw error
  }
}

/**
 * Get all transactions for current user
 */
export async function getTransactions(): Promise<any[]> {
  const currentUser = await getAuthData()
  if (!currentUser) {
    return []
  }

  return SupabaseDB.getTransactions(currentUser.id)
}

/**
 * Get recent transactions (limited)
 */
export async function getRecentTransactions(limit = 10): Promise<any[]> {
  const currentUser = await getAuthData()
  if (!currentUser) {
    return []
  }

  return SupabaseDB.getRecentTransactions(currentUser.id, limit)
}
