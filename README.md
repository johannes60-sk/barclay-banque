# Barclays Banque

A Barclays-styled demo online banking site: a marketing site (Home + About with real content,
other product pages as placeholders) plus a full register/login/dashboard flow. Built as a
sibling project to `v0-online-banking-app`, reusing the same Supabase auth/data approach and
dashboard functionality, restyled with Barclays' navy/blue palette and priced in GBP.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the env template and fill in your keys:

   ```bash
   cp .env.local.example .env.local
   ```

   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`:
     from your Supabase project settings.
   - `RESEND_API_KEY`: from [resend.com](https://resend.com), used to send the transfer OTP
     email and the beneficiary transfer-received email.

3. Run the SQL migrations in `supabase/migrations/` **in order** (001 → 004) against your
   Supabase project's SQL editor. They create the `profiles`, `transactions`, and `otp_codes`
   tables, the auto-profile-creation trigger (with a starting balance of £2,500 and a demo
   transaction history), and the account-deletion function.

4. Start the dev server:

   ```bash
   npm run dev
   ```

## Route map

**Public:**
- `/` — Home (content adapted from barclays.co.uk)
- `/about` — About us
- `/current-accounts`, `/credit-cards`, `/savings`, `/loans`, `/mortgages`, `/insurance`,
  `/investments` — placeholder pages ("coming soon")
- `/login`, `/register` — Supabase-backed auth, redirect to `/dashboard` on success

**Authenticated (`/dashboard/*`):**
- `/dashboard` — balance card, recent transactions, quick actions, delete-account
- `/dashboard/transactions` — full transaction history
- `/dashboard/transfer` — send a transfer (email OTP confirmation)
- `/dashboard/transfer/success` — confirmation screen
- `/dashboard/admin/transactions` — manual transaction seeding tool (direct-URL only, not linked
  from the nav)

## Notes

- English is the default language; a language switcher (navbar + footer) toggles English/French,
  persisted to `localStorage`. See `lib/language-context.tsx` for all copy.
- All amounts are in GBP — there is no currency selector.
- Auth guard is client-side only (`useEffect` + redirect), matching `v0-online-banking-app` — no
  server middleware.
