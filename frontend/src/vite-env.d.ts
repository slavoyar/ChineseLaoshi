/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INITIAL_AUTH?: 'demo' | 'authenticated';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
