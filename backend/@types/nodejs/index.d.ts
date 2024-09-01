declare namespace NodeJS {
  interface ProcessEnv {
    BASE_URL: string;
    DB_URL: string;
    SESSION_SECRET_KEY: string;
    PORT?: string;
    SALT_ROUNDS: string;
    MAILER_HOST: string;
    MAILER_USER: string;
    MAILER_PASSWORD: string;
    JWT_SECRET_KEY: string;
  }
}
