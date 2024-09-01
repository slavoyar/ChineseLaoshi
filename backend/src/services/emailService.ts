import { generateTemplate, transporter } from '@configs/mailer';
import { userRepository } from '@repositories';
import { sign } from 'jsonwebtoken';

const { MAILER_USER, JWT_SECRET_KEY } = process.env;

class EmailService {
  async resetPassword(email: string) {
    const user = await userRepository.getByEmail(email);
    const token = sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: '15m' });
    const template = generateTemplate('reset', { locale: 'en', token });

    transporter.sendMail({
      from: `Chinese Laoshi <${MAILER_USER}>`,
      to: email,
      subject: 'Password reset',
      html: template,
    });
  }
}

export const emailService = new EmailService();
