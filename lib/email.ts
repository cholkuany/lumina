import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Email Templates
export const emailTemplates = {
  verifyEmail: (url: string, name: string) => ({
    subject: "Verify your email address",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #4F46E5, #7C3AED); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Verify Your Email</h1>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #ddd; border-top: none;">
            <p>Hi ${name},</p>
            <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" style="background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="background: #eee; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">${url}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">This email was sent by Your App Name</p>
          </div>
        </body>
      </html>
    `,
  }),

  resetPassword: (url: string, name: string) => ({
    subject: "Reset your password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #DC2626, #F97316); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Reset Your Password</h1>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #ddd; border-top: none;">
            <p>Hi ${name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" style="background: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="background: #eee; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">${url}</p>
            <p>This link will expire in 1 hour.</p>
            <p><strong>If you didn't request a password reset, please ignore this email or contact support if you're concerned.</strong></p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">This email was sent by Your App Name</p>
          </div>
        </body>
      </html>
    `,
  }),
};

interface EmailTemplateProps {
  recipientName: string
  subject: string
  message: string
  storeName?: string
  storeUrl?: string
}

export function buildEmailTemplate({
  recipientName,
  subject,
  message,
  storeName = "Lumina",
  storeUrl = process.env.NEXT_PUBLIC_APP_URL ?? "#",
}: EmailTemplateProps): string {
  // Convert newlines to <br> so plain textarea line breaks are preserved
  const formattedMessage = message
    .trim()
    .split("\n")
    .map((line) => (line.trim() === "" ? "<br/>" : `<p>${line}</p>`))
    .join("")

  return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFDF9;font-family:'DM Sans',system-ui,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFDF9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- Logo / Brand Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <a href="${storeUrl}" style="text-decoration:none;">
                <span style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#B8956C;letter-spacing:0.04em;">
                  ${storeName}
                </span>
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:12px;border:1px solid #D6D0C7;overflow:hidden;">

              <!-- Gold accent bar -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height:4px;background:linear-gradient(90deg,#B8956C,#D4B896);"></td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:36px 40px 32px;">

                    <!-- Greeting -->
                    <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#232323;font-family:Georgia,serif;">
                      Hi ${recipientName},
                    </p>

                    <div style="width:40px;height:2px;background-color:#B8956C;margin-bottom:24px;"></div>

                    <!-- Message body -->
                    <div style="font-size:15px;line-height:1.7;color:#444444;">
                      ${formattedMessage}
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 40px;">
                    <div style="height:1px;background-color:#E8E4DD;"></div>
                  </td>
                </tr>
              </table>

              <!-- Signature -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:24px 40px 32px;">
                    <p style="margin:0 0 2px;font-size:14px;color:#A8A29E;">
                      Warm regards,
                    </p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#232323;">
                      The ${storeName} Team
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 0 0;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#A8A29E;">
                You're receiving this email because you have an account with ${storeName}.
              </p>
              <p style="margin:0;font-size:12px;color:#A8A29E;">
                &copy; ${new Date().getFullYear()} ${storeName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim()
}