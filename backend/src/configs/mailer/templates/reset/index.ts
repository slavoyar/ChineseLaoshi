import { loadTranslations } from '@configs/mailer/i18n';

const { BASE_URL } = process.env;

export const generateEmail = (locale: string, token: string) => {
  const t = loadTranslations(__dirname, locale);

  const resetLink = `${BASE_URL}/reset-password?token=${token}`;

  return `
  <!DOCTYPE html>
  <html lang="${locale}">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.subject}</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333333;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 50px auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
              color: #333333;
          }
          p {
              line-height: 1.6;
          }
          .btn {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 20px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
          }
          .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #999999;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>${t.subject}</h1>
          <p>${t.greeting}</p>
          <p>${t.intro}</p>
          <a href="${resetLink}" class="btn">${t.reset_button}</a>
          <p>${t.ignore}</p>
          <p>${t.thanks}<br>${t.team}</p>
          <div class="footer">
              <p>${t.trouble_clicking}</p>
              <p>${resetLink}</p>
          </div>
      </div>
  </body>
  </html>
  `;
};
