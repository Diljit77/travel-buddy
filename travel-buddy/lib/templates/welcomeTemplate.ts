import { baseTemplate } from "./baseTemplate";


export const welcomeTemplate = (name: string) => {
  const content = `
    <h2 style="color:#333;">Welcome, ${name}! 🎉</h2>
    
    <p style="color:#555;">
      We're excited to have you on board with <b>Travel Buddy</b>.
    </p>

    <p style="color:#555;">
      Start planning your trips, explore destinations, and make your journey smarter 🚀
    </p>

    <div style="text-align:center; margin: 20px 0;">
      <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/home" style="
        background:#4f46e5;
        color:white;
        padding:10px 20px;
        text-decoration:none;
        border-radius:5px;
        display:inline-block;
      ">
        Start Exploring
      </a>
    </div>

    <p style="color:#777;">
      If you have any questions, feel free to reach out anytime.
    </p>
  `;

  return baseTemplate(content);
};