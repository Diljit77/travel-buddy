import { baseTemplate } from "./baseTemplate";

export const forgotPasswordTemplate = (name: string, resetLink: string) => {
  const content = `
    <h2 style="color:#333;">Reset Your Password 🔐</h2>
    
    <p style="color:#555;">
      Hi ${name},
    </p>

    <p style="color:#555;">
      We received a request to reset your password.
    </p>

    <div style="text-align:center; margin: 20px 0;">
      <a href="${resetLink}" style="
        background:#ef4444;
        color:white;
        padding:12px 20px;
        text-decoration:none;
        border-radius:5px;
        display:inline-block;
      ">
        Reset Password
      </a>
    </div>

    <p style="color:#777;">
      This link will expire in 10 minutes.
    </p>

    <p style="color:#777;">
      If you didn’t request this, you can safely ignore this email.
    </p>
  `;

  return baseTemplate(content);
};