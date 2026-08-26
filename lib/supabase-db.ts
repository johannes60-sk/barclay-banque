import { supabase } from "./supabase"

// Types
export interface Transaction {
  id: string
  user_id: string
  type: "debit" | "credit"
  description: string
  amount: number
  date: string
  status: string
  iban?: string
  swift?: string
  reference?: string
}

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  balance: number
  account_number: string
  phone_number?: string
  created_at?: string
}

// ==================== AUTHENTICATION ====================

/**
 * Register a new user with Supabase Auth
 */
export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
): Promise<{ user: any; error: any }> {
  // Sign up with Supabase Auth
  // A database trigger will automatically create the profile
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      },
    },
  })

  if (authError) {
    return { user: null, error: authError }
  }

  if (!authData.user) {
    return { user: null, error: new Error("No user returned from signup") }
  }

  // The trigger creates the profile automatically
  // Just return the user
  return { user: authData.user, error: null }
}

/**
 * Sign in an existing user
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: any; error: any }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { user: null, error }
  }

  // Get user profile
  if (data.user) {
    const profile = await getUserProfile(data.user.id)
    return { user: { ...data.user, profile }, error: null }
  }

  return { user: data.user, error: null }
}

/**
 * Sign out the current user
 */
export async function logoutUser(): Promise<{ error: any }> {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Delete the current user account
 */
export async function deleteAccount(password: string): Promise<{ error: any }> {
  try {
    // First verify the password by attempting to sign in
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return { error: new Error("No user logged in") }
    }

    // Re-authenticate to verify password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    })

    if (signInError) {
      return { error: new Error("Incorrect password") }
    }

    // Delete the user account (this will cascade delete profile and transactions)
    const { error: deleteError } = await supabase.rpc("delete_user")

    if (deleteError) {
      return { error: deleteError }
    }

    return { error: null }
  } catch (error: any) {
    return { error }
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<{ user: any; error: any }> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { user: null, error }
  }

  // Get user profile
  const profile = await getUserProfile(user.id)
  return { user: { ...user, profile }, error: null }
}

// ==================== USER PROFILE ====================

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

/**
 * Update user balance
 */
export async function updateBalance(userId: string, newBalance: number): Promise<{ error: any }> {
  const { error } = await supabase.from("profiles").update({ balance: newBalance }).eq("id", userId)

  return { error }
}

/**
 * Get user profile data (legacy compatibility)
 */
export async function getAuthData(): Promise<UserProfile | null> {
  const { user } = await getCurrentUser()
  return user?.profile || null
}

// ==================== TRANSACTIONS ====================

/**
 * Save a new transaction
 */
export async function saveTransaction(transaction: Omit<Transaction, "id">): Promise<{ error: any }> {
  const { error } = await supabase.from("transactions").insert(transaction)

  return { error }
}

/**
 * Get all transactions for the current user
 */
export async function getTransactions(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching transactions:", error)
    return []
  }

  return data || []
}

/**
 * Get recent transactions (limited)
 */
export async function getRecentTransactions(userId: string, limit = 10): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent transactions:", error)
    return []
  }

  return data || []
}
