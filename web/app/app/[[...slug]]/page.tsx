import { StudyApp } from '../study-app';

export function generateStaticParams() {
  return [{ slug: [] }];
}

export default function StudyPage() {
  return <StudyApp />;
}
