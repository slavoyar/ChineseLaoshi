import { generateEmail } from './reset';

type TemplateName = 'reset' | 'verify';

export const generateTemplate = (
  name: TemplateName,
  options: { token: string; locale: string },
) => {
  switch (name) {
    case 'reset':
      return generateEmail(options.locale, options.token);
    case 'verify':
      throw new Error('Verify email is not imlemented');
    default:
      throw new Error(`${name} is not correct template name`);
  }
};
