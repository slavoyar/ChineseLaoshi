/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCKS: string;
  readonly VITE_INITIAL_AUTH?: 'demo' | 'authenticated';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
