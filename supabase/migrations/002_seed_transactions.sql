-- ============================================
-- DEFAULT DEMO TRANSACTIONS
-- ============================================
-- Seeds each new user with the transaction history shown in the reference captures.
-- The opening balance row is omitted because it is not a transaction.
-- Profile balances are not changed by this seed.

CREATE OR REPLACE FUNCTION public.create_default_transactions()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.transactions (user_id, type, description, amount, date, status, iban, reference)
  VALUES
    (NEW.id, 'credit', 'Salary Payout Marlinspike Consulting Sept./26 Elect. Deposit ****45113612572', 6500.00, '2026-09-01T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'credit', 'Salary Payout Millrun Limited Sept./26 Elect. Deposit ****44316662910', 5800.00, '2026-09-02T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'debit', 'Bill Payment to Tiffany&Co Online Store Order 0533284', -3269.77, '2026-09-03T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'debit', 'Debit Card Terminal Checks ****45113612572 Mandarin Hotel Munich', -1028.09, '2026-09-04T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'debit', 'ATM Cash Machine withdrawal at Stadtsparkasse München N/Rail Lothstraße 1', -854.98, '2026-09-07T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'credit', 'Transfer Elect. Deposit from T.Horlick, Payout of Shares Ayanda Capital limited', 4800000.00, '2026-09-07T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'debit', 'Bill Payment to travel agency, London Star Travel LTD, Sort Code 20-32-53, Account *****93525074', -1850.00, '2026-09-08T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'debit', 'Debit Card Terminal Checks ****45113612572 Hyatt Hotel Dubai', -3250.00, '2026-09-08T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'debit', 'Debit Card Purchase ****45113612572, KMF 120816 VISA DDA', -378.67, '2026-09-09T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'debit', 'Bill Payment to Simple XFERS DR N****0000021K6F', -2486.96, '2026-09-10T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'debit', 'STO Bank Fees & charges Sept./2026', -311.45, '2026-09-10T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'credit', 'Salary Payout Marlinspike Consulting 09/26 Elect. Deposit ****45113612572', 16430.50, '2026-09-10T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'credit', 'Salary Payout Millrun Limited Sept./26 Elect. Deposit ****44316662910', 5820.20, '2026-09-11T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'debit', 'Transfer to Alice Horlick, Sort Code 20-32-53 Account ****61475841 For Rental&Business Offices', -4200.00, '2026-09-11T00:00:00Z', 'completed', NULL, NULL),
    (NEW.id, 'debit', 'ATM Cash Machine withdrawal at Lloyds Bank ATM Richmond', -404.98, '2026-09-14T00:00:00Z', 'completed', NULL, NULL);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_transactions();
