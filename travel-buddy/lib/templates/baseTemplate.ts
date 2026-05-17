export const baseTemplate = (content: string) => `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
  ">
    <div style="
      max-width: 600px;
      margin: auto;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    ">
      
      <!-- Header -->
      <div style="
        background: linear-gradient(90deg, #4f46e5, #06b6d4);
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
      ">
        ✈️ Travel Buddy
      </div>

      <!-- Body -->
      <div style="padding: 20px;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #888;
      ">
        © ${new Date().getFullYear()} Travel Buddy. All rights reserved.
      </div>
    </div>
  </div>
`;