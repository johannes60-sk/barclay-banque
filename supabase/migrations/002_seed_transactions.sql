-- ============================================
-- DEFAULT DEMO TRANSACTIONS
-- ============================================
-- Seeds each new user with a modest, realistic GBP transaction history
-- spread over the 3 months before signup.

CREATE OR REPLACE FUNCTION public.create_default_transactions()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.transactions (user_id, type, description, amount, date, status, iban, reference)
  VALUES
    (NEW.id, 'credit', 'Salary payment', 1850.00, NOW() - INTERVAL '85 days', 'completed', 'GB29NWBK60161331926819', 'SALARY-001'),
    (NEW.id, 'debit', 'Transfer to James Wilson', 220.00, NOW() - INTERVAL '80 days', 'completed', 'GB94BARC20201530093459', 'TRANSFER-OUT-001'),
    (NEW.id, 'debit', 'Transfer to Emma Clarke', 45.80, NOW() - INTERVAL '74 days', 'completed', 'GB33BUKB20201555555555', 'TRANSFER-OUT-002'),
    (NEW.id, 'credit', 'Transfer from Oliver Bennett', 300.00, NOW() - INTERVAL '68 days', 'completed', 'GB15MIDL40051512345678', 'TRANSFER-IN-001'),
    (NEW.id, 'debit', 'Transfer to Sophie Taylor', 89.50, NOW() - INTERVAL '60 days', 'completed', 'GB76LOYD30949312345678', 'TRANSFER-OUT-003'),
    (NEW.id, 'credit', 'Salary payment', 1850.00, NOW() - INTERVAL '55 days', 'completed', 'GB29NWBK60161331926819', 'SALARY-002'),
    (NEW.id, 'debit', 'Transfer to Liam Harris', 156.30, NOW() - INTERVAL '48 days', 'completed', 'GB98HBUK40127612345678', 'TRANSFER-OUT-004'),
    (NEW.id, 'debit', 'Transfer to Ava Robinson', 17.90, NOW() - INTERVAL '40 days', 'completed', 'GB55RBOS16101312345678', 'TRANSFER-OUT-005'),
    (NEW.id, 'credit', 'Transfer from Noah Walker', 75.00, NOW() - INTERVAL '33 days', 'completed', 'GB12SANT40051512345678', 'TRANSFER-IN-002'),
    (NEW.id, 'debit', 'Transfer to Isla Young', 42.60, NOW() - INTERVAL '25 days', 'completed', 'GB40CLYD82271612345678', 'TRANSFER-OUT-006'),
    (NEW.id, 'credit', 'Salary payment', 1850.00, NOW() - INTERVAL '20 days', 'completed', 'GB29NWBK60161331926819', 'SALARY-003'),
    (NEW.id, 'debit', 'Transfer to Charlie Scott', 300.00, NOW() - INTERVAL '12 days', 'completed', 'GB08CPBK08926912345678', 'TRANSFER-OUT-007');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_transactions();
