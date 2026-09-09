'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('@app/index').then((mod) => mod.App), { ssr: false });

export function StudyApp() {
  return <App />;
}
