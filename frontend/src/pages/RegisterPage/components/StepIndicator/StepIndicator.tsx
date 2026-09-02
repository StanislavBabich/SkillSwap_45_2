import clsx from 'clsx';
import styles from './StepIndicator.module.css';

export interface StepIndicatorProps {
  currentStep: 1 | 2;
  totalSteps?: number;
}

export const StepIndicator = ({ currentStep, totalSteps = 2 }: StepIndicatorProps) => {
  return (
    <div className={styles.root}>
      <p className={styles.title}>Step {currentStep} of {totalSteps}</p>
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
      </div>
    </div>
  );
};