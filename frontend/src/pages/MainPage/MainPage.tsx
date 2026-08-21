import { FiltersBar } from '@widgets/FiltersBar';
import styles from './MainPage.module.css';
import { MainContent } from '@widgets/MainContent';

export const MainPage = () => {
  return (
    <div className={styles.page}>
      <aside className={styles.filters}>
        <FiltersBar />
      </aside>
      <MainContent />
    </div>
  );
};
