declare namespace NodeJS {
  interface ProcessEnv {
    DB_URL: string;
    SESSION_SECRET_KEY: string;
    PORT?: string;
    SALT_ROUNDS: string;
  }
}
