import styles from './home.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <h1>中国老师</h1>
      <p>Chinese Laoshi</p>
      <p>
        <a href="/app">Open the study app</a>
      </p>
    </main>
  );
}
