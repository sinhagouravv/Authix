import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Sends a premium, branded email from the Authix server.
 */
export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"Authix Security" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || (text ? `<div style="font-family: sans-serif; padding: 20px; color: #052558;">${text}</div>` : undefined),
    });

    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

/**
 * Sends a high-fidelity 3FA verification code email.
 */
export const sendVerificationEmail = async (to: string, code: string) => {
  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f8fafc; border-radius: 24px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-block; padding: 12px; background-color: #052558; border-radius: 16px;">
          <span style="color: white; font-weight: bold; font-size: 24px;">A</span>
        </div>
        <h1 style="color: #052558; margin-top: 20px; font-size: 24px; text-transform: uppercase; letter-spacing: 0.1em;">Security Verification</h1>
      </div>
      
      <div style="background-color: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 12px rgba(5, 37, 88, 0.05); text-align: center;">
        <p style="color: #64748b; font-size: 16px; margin-bottom: 30px;">Your security is our priority. Use the code below to complete your verification.</p>
        
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 16px; font-size: 32px; font-weight: bold; letter-spacing: 0.5em; color: #052558; margin-bottom: 30px;">
          ${code}
        </div>
        
        <p style="color: #94a3b8; font-size: 12px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
        © 2024 Authix Inc. Secure 3FA Infrastructure.
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `[Authix] Your Verification Code: ${code}`,
    html,
  });
};
