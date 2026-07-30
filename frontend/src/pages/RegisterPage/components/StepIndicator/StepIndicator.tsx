import clsx from 'clsx';
import styles from './StepIndicator.module.css';

export interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className={styles.root}>
      <p className={styles.title}>Шаг {currentStep} из 3</p>
      <div className={styles.bars}>
        <div
          className={clsx(styles.bar, styles.barFirst, currentStep >= 1 && styles.barActive)}
          aria-hidden
        >
          <div className={styles.barFill} />
        </div>
        <div
          className={clsx(styles.bar, currentStep >= 2 && styles.barActive)}
          aria-hidden
        >
          <div className={styles.barFill} />
        </div>
        <div
          className={clsx(styles.bar, currentStep >= 3 && styles.barActive)}
          aria-hidden
        >
          <div className={styles.barFill} />
        </div>
      </div>
    </div>
  );
};
