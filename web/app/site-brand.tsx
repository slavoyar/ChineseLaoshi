import styles from './site-brand.module.css';

export function SiteBrand() {
  return (
    <a className={styles.brand} href="/" lang="zh-Hans">
      中国老师
    </a>
  );
}
