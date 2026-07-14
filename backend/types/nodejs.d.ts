declare namespace NodeJS {
  interface ProcessEnv {
    BASE_URL: string;
    DB_URL: string;
    DEFAULT_USER_EMAIL?: string;
    PORT?: string;
  }
}
