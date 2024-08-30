import { CustomError } from '@configs/errors';
import { createTransport, createTestAccount } from 'nodemailer';

export const getTransport = (): Promise => {
  return new Promise((resolve, reject) => {
    createTestAccount((err, account) => {
      if (err) {
        reject(new CustomError('emailSendError'));
      }
      const transporter = createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      resolve(transporter);
    });
  });
};
