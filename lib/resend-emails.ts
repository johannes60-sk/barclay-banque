import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Barclays <noreply@barclaiy.co.uk>";

export interface SendOTPEmailParams {
  to: string;
  code: string;
}

export interface SendTransferEmailParams {
  beneficiaryEmail: string;
  beneficiaryName: string;
  amount: number;
  senderName: string;
  reference: string;
  iban: string;
  swift: string;
}

/**
 * Send OTP verification code via email using Resend
 */
export async function sendOTPEmail({ to, code }: SendOTPEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend not configured. Skipping OTP email.");
    return { success: false, error: "Resend not configured" };
  }

  try {
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
    }
    .header {
      background: #00395D;
      padding: 30px 40px;
      text-align: left;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px;
    }
    .greeting {
      font-size: 18px;
      color: #00395D;
      margin: 0 0 20px 0;
      font-weight: 600;
    }
    .intro-text {
      font-size: 15px;
      color: #4a4a4a;
      margin: 0 0 30px 0;
      line-height: 1.6;
    }
    .code-box {
      background: #0068C9;
      padding: 30px;
      margin: 30px 0;
      border-radius: 8px;
      text-align: center;
    }
    .code-label {
      font-size: 13px;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .code-value {
      font-size: 42px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      font-family: monospace;
      letter-spacing: 8px;
    }
    .alert-box {
      background: #00395D;
      color: #ffffff;
      padding: 20px;
      margin: 30px 0;
      border-radius: 6px;
      border-left: 4px solid #0068C9;
    }
    .alert-title {
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 8px 0;
      font-size: 15px;
    }
    .alert-text {
      margin: 0;
      color: #ffffff;
      font-size: 14px;
    }
    .footer {
      background: #00253B;
      color: #ffffff;
      padding: 30px 40px;
      text-align: center;
      font-size: 13px;
      line-height: 1.8;
    }
    .footer-logo {
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
    }
    .footer-text {
      color: #b8c5d0;
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div class="logo-text">Barclays</div>
    </div>

    <div class="content">
      <p class="greeting">Verification code</p>

      <p class="intro-text">
        Use the following code to confirm your transfer.
      </p>

      <div class="code-box">
        <div class="code-label">Your verification code</div>
        <div class="code-value">${code}</div>
      </div>

      <div class="alert-box">
        <p class="alert-title">Security notice</p>
        <p class="alert-text">
          This code is valid for <strong>5 minutes</strong>.<br/>
          Never share this code with anyone.
        </p>
      </div>

      <p class="intro-text" style="margin-bottom: 0;">
        If you did not request this transfer, please ignore this email or contact our customer service.
      </p>
    </div>

    <div class="footer">
      <div class="footer-logo">Barclays</div>
      <p class="footer-text">Your trusted online banking partner</p>
      <p class="footer-text" style="margin-top: 15px; font-size: 12px;">
        This is an automatically generated email. Please do not reply directly to this message.
      </p>
    </div>
  </div>
</body>
</html>`.trim();

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "Barclays – Verification code",
      html: emailHTML,
    });

    if (error) {
      console.error("[OTP Email] Resend error:", error);
      return { success: false, error: error.message || "Failed to send OTP email" };
    }

    console.log("[OTP Email] Sent successfully:", data?.id);
    return { success: true, emailId: data?.id };
  } catch (error: any) {
    console.error("[OTP Email] Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send transfer notification email to beneficiary using Resend
 */
export async function sendTransferEmail({
  beneficiaryEmail,
  beneficiaryName,
  amount,
  senderName,
  reference,
  iban,
  swift,
}: SendTransferEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend not configured. Skipping transfer email.");
    return { success: false, error: "Resend not configured" };
  }

  try {
    const formattedAmount = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);

    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
    }
    .header {
      background: #00395D;
      padding: 30px 40px;
      text-align: left;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px;
    }
    .greeting {
      font-size: 18px;
      color: #00395D;
      margin: 0 0 20px 0;
      font-weight: 600;
    }
    .intro-text {
      font-size: 15px;
      color: #4a4a4a;
      margin: 0 0 30px 0;
      line-height: 1.6;
    }
    .amount-box {
      background: #0068C9;
      padding: 30px;
      margin: 30px 0;
      border-radius: 8px;
      text-align: center;
    }
    .amount-label {
      font-size: 13px;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .amount-value {
      font-size: 36px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
    .alert-box {
      background: #00395D;
      color: #ffffff;
      padding: 20px;
      margin: 30px 0;
      border-radius: 6px;
      border-left: 4px solid #0068C9;
    }
    .alert-title {
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 8px 0;
      font-size: 15px;
    }
    .alert-text {
      margin: 0;
      color: #ffffff;
      font-size: 14px;
    }
    .section-title {
      color: #00395D;
      font-size: 18px;
      font-weight: 700;
      margin: 40px 0 20px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #0068C9;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: #ffffff;
    }
    .details-table tr {
      border-bottom: 1px solid #e9ecef;
    }
    .details-table tr:last-child {
      border-bottom: none;
    }
    .details-table td {
      padding: 16px 0;
      vertical-align: top;
    }
    .details-table td:first-child {
      color: #6c757d;
      font-size: 14px;
      font-weight: 500;
      width: 40%;
    }
    .details-table td:last-child {
      color: #00395D;
      font-size: 14px;
      font-weight: 600;
    }
    .footer {
      background: #00253B;
      color: #ffffff;
      padding: 30px 40px;
      text-align: center;
      font-size: 13px;
      line-height: 1.8;
    }
    .footer-logo {
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
    }
    .footer-text {
      color: #b8c5d0;
      margin: 5px 0;
    }
    .divider {
      height: 1px;
      background: #e9ecef;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div class="logo-text">Barclays</div>
    </div>

    <div class="content">
      <p class="greeting">Hello ${beneficiaryName}</p>

      <p class="intro-text">
        You have just received a transfer from <strong>${senderName}</strong>.
        The amount will be credited to your account shortly.
      </p>

      <div class="amount-box">
        <div class="amount-label">Transferred amount</div>
        <div class="amount-value">${formattedAmount}</div>
      </div>

      <div class="alert-box">
        <p class="alert-title">Crediting information</p>
        <p class="alert-text">
          The amount will be credited to your account within <strong>24 to 72 hours</strong>.
        </p>
      </div>

      <h2 class="section-title">Transfer details</h2>

      <table class="details-table">
        <tr>
          <td>Sender</td>
          <td>${senderName}</td>
        </tr>
        <tr>
          <td>Recipient</td>
          <td>${beneficiaryName}</td>
        </tr>
        <tr>
          <td>Amount</td>
          <td style="color: #00395D;">${formattedAmount}</td>
        </tr>
        <tr>
          <td>IBAN</td>
          <td style="font-family: monospace; font-size: 13px;">${iban}</td>
        </tr>
        <tr>
          <td>SWIFT/BIC</td>
          <td style="font-family: monospace;">${swift}</td>
        </tr>
        <tr>
          <td>Reference</td>
          <td>${reference || "No reference provided"}</td>
        </tr>
        <tr>
          <td>Date</td>
          <td>${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</td>
        </tr>
        <tr>
          <td>Estimated crediting</td>
          <td>${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</td>
        </tr>
      </table>

      <div class="divider"></div>

      <p class="intro-text" style="margin-bottom: 0;">
        If you have any questions about this transfer, please contact our customer service at any time.
      </p>
    </div>

    <div class="footer">
      <div class="footer-logo">Barclays</div>
      <p class="footer-text">Your trusted online banking partner</p>
      <p class="footer-text" style="margin-top: 15px; font-size: 12px;">
        This is an automatically generated email. Please do not reply directly to this message.
      </p>
    </div>
  </div>
</body>
</html>`.trim();

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [beneficiaryEmail],
      subject: `Transfer received: ${formattedAmount} from ${senderName}`,
      html: emailHTML,
    });

    if (error) {
      console.error("[Transfer Email] Resend error:", error);
      return { success: false, error: error.message || "Failed to send transfer email" };
    }

    console.log("[Transfer Email] Sent successfully:", data?.id);
    return { success: true, emailId: data?.id };
  } catch (error: any) {
    console.error("[Transfer Email] Error:", error);
    return { success: false, error: error.message };
  }
}
