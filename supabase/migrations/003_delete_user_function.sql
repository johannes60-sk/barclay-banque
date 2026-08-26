-- ============================================
-- FUNCTION: Delete current user
-- ============================================
-- Allows a signed-in user to self-delete their account
-- (CASCADE deletes their profile and transactions automatically).

CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
