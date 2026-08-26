-- Create OTP codes table for transfer verification
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  transfer_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT false,
  used BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_otp_codes_user_email ON otp_codes(user_email);
CREATE INDEX idx_otp_codes_expires_at ON otp_codes(expires_at);

ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own otp codes"
  ON otp_codes FOR SELECT
  USING (user_email = current_setting('app.current_user_email', true));

CREATE POLICY "Users can insert own otp codes"
  ON otp_codes FOR INSERT
  WITH CHECK (user_email = current_setting('app.current_user_email', true));

CREATE POLICY "Users can update own otp codes"
  ON otp_codes FOR UPDATE
  USING (user_email = current_setting('app.current_user_email', true));

CREATE OR REPLACE FUNCTION cleanup_expired_otp_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_codes
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

GRANT ALL ON otp_codes TO authenticated;
GRANT ALL ON otp_codes TO anon;
