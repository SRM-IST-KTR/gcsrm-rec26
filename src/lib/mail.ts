import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(toEmail: string, otpCode: string) {
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!fromEmail) {
    throw new Error("Sender email environment variable is missing.");
  }

  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: "Your GCSRM Login OTP",
    text: `Your GCSRM login OTP is: ${otpCode}\n\nThis code is valid for 5 minutes (300 seconds). If you did not request this OTP, please ignore this email.`,
    html: `
      <!DOCTYPE html>
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
              <span style="display: inline-block; background-color: #1e1b24; color: #ffffff; font-size: 13px; font-weight: 800; letter-spacing: 2px; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 8px;">
                Recruitment '26
              </span>
              <h1 style="margin: 6px 0 0 0; color: #1e1b24; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase;">
                GitHub Community SRM
              </h1>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="margin: 0 0 12px 0; color: #1e1b24; font-size: 20px; font-weight: 800;">
                Verification Code
              </h2>
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 15px; line-height: 1.5;">
                Use the following 6-digit One-Time Password (OTP) to proceed with your login or application verification:
              </p>

              <!-- OTP Display Box -->
              <div style="background-color: #fffdf0; border: 3px solid #1e1b24; border-radius: 12px; box-shadow: 4px 4px 0px #1e1b24; padding: 20px; text-align: center; margin: 0 0 24px 0;">
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #1e1b24; margin-left: 10px;">
                  ${otpCode}
                </div>
              </div>

              <!-- Notice Box -->
              <div style="background-color: #eff6ff; border: 2px solid #1e1b24; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #1e1b24; font-size: 13px; font-weight: 600; line-height: 1.4;">
                  ⏱ This code is valid for <strong>5 minutes</strong>. If you did not request this OTP, you can safely ignore this email.
                </p>
              </div>

              <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.4;">
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
      </html>
    `,
  };

  return await transporter.sendMail(mailOptions);
}
