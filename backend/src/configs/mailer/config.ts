import { createTransport } from 'nodemailer';

const { MAILER_HOST, MAILER_USER, MAILER_PASSWORD } = process.env;

export const transporter = createTransport({
  host: MAILER_HOST,
  port: 587,
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASSWORD,
  },
});
