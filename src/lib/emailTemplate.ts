/**
 * Neobrutalist Email HTML Template Generator for GCSRM OTP emails.
 *
 * Designed with inline CSS and table layouts for maximum email client compatibility.
 * Uses an absolute production URL for the mascot logo so it renders properly in email clients.
 */

export interface EmailTemplateOptions {
  otpCode: string;
}

export function getOtpEmailHtml({
  otpCode,

}: EmailTemplateOptions): string {
  const mascotUrl = `https://raw.githubusercontent.com/SRM-IST-KTR/gcsrm-rec26/staging/public/assets/snlogo.png`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your GCSRM Login OTP</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #fffdf0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e1b24;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 3px solid #1e1b24; border-radius: 16px; box-shadow: 6px 6px 0px #1e1b24; overflow: hidden;">
    <!-- Header Banner -->
    <tr>
      <td style="padding: 24px 28px; background-color: #4ec37b; border-bottom: 3px solid #1e1b24; text-align: center;">
        <span style="display: inline-block; background-color: #1e1b24; color: #ffffff; font-size: 12px; font-weight: 800; letter-spacing: 2px; padding: 4px 14px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 8px;">
          Recruitment '26
        </span>
        <h1 style="margin: 6px 0 0 0; color: #1e1b24; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase;">
          GitHub Community SRM
        </h1>
      </td>
    </tr>

    <!-- Content Body -->
    <tr>
      <td style="padding: 32px 28px; text-align: center;">
        <!-- Mascot Image (Absolute URL) -->
        <img 
          src="${mascotUrl}" 
          alt="GCSRM Mascot" 
          width="120" 
          height="auto" 
          style="display: block; margin: 0 auto 20px auto; max-width: 120px; height: auto;" 
        />

        <h2 style="margin: 0 0 12px 0; color: #1e1b24; font-size: 22px; font-weight: 800; text-align: center;">
          Verification Code
        </h2>
        <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 15px; line-height: 1.5; text-align: center;">
          Use the following 6-digit One-Time Password (OTP) to proceed with your verification:
        </p>

        <!-- OTP Display Box -->
        <div style="background-color: #fffdf0; border: 3px solid #1e1b24; border-radius: 12px; box-shadow: 4px 4px 0px #1e1b24; padding: 18px 24px; text-align: center; margin: 0 auto 24px auto; max-width: 320px;">
          <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 12px; color: #1e1b24; margin-left: 12px;">
            ${otpCode}
          </div>
        </div>

        <!-- Notice Box -->
        <div style="background-color: #eff6ff; border: 2px solid #1e1b24; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; text-align: left;">
          <p style="margin: 0; color: #1e1b24; font-size: 13px; font-weight: 600; line-height: 1.4;">
            This code is valid for <strong>5 minutes</strong>. If you did not request this OTP, you can safely ignore this email.
          </p>
        </div>

        <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.4; text-align: left;">
          Best regards,<br />
          <strong style="color: #1e1b24;">GitHub Community SRM Team</strong>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 16px 28px; background-color: #fffdf0; border-top: 2px solid #1e1b24; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          &copy; 2026 GitHub Community SRM. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default getOtpEmailHtml;
