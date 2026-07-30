import { useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';
import { Icon } from '@/shared/ui/Icon';
import styles from './DatePicker.module.css';

interface DatePickerProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  error?: string;
  /** Сохранять дату сразу при выборе дня (без кнопки "Выбрать") */
  instantSave?: boolean;
  /** Закрывать календарь после выбора даты */
  closeOnSelect?: boolean;
}

export const DatePicker = ({
  label,
  value,
  onChange,
  placeholder = 'дд.мм.гггг',
  className,
  inputClassName,
  error,
  instantSave = true, // По умолчанию сохраняем сразу
  closeOnSelect = true, // По умолчанию закрываем после выбора
}: DatePickerProps) => {
  const fieldId = useId();
  const labelId = useId();
  const parsed = value ? new Date(value) : undefined;

  const [open, setOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const [tempDate, setTempDate] = useState<Date | undefined>(parsed);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const monthBtnRef = useRef<HTMLButtonElement | null>(null);
  const yearBtnRef = useRef<HTMLButtonElement | null>(null);

  const [monthPos, setMonthPos] = useState({ top: 0, left: 0 });
  const [yearPos, setYearPos] = useState({ top: 0, left: 0 });

  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  const years = Array.from({ length: 151 }, (_, i) => 1900 + i);

  const formatAriaDate = (date: Date) =>
    date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;

      if (!wrapperRef.current?.contains(target)) {
        setOpen(false);
        setMonthOpen(false);
        setYearOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Обновляем tempDate при изменении value извне
  useEffect(() => {
    if (value) {
      setTempDate(new Date(value));
    } else {
      setTempDate(undefined);
    }
  }, [value]);

  // Функция сохранения даты
  const saveDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
  };

  // Обработчик выбора дня
  const handleDaySelect = (date: Date) => {
    setTempDate(date);
    
    if (instantSave) {
      saveDate(date);
    }
    
    if (closeOnSelect) {
      setOpen(false);
      setMonthOpen(false);
      setYearOpen(false);
    }
  };

  // Обработчик выбора месяца
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(current.getFullYear(), monthIndex, current.getDate());
    setTempDate(newDate);
    
    if (instantSave) {
      saveDate(newDate);
    }
    
    setMonthOpen(false);
  };

  // Обработчик выбора года
  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, current.getMonth(), current.getDate());
    setTempDate(newDate);
    
    if (instantSave) {
      saveDate(newDate);
    }
    
    setYearOpen(false);
  };

  const apply = () => {
    if (tempDate) {
      saveDate(tempDate);
    }
    setOpen(false);
    setMonthOpen(false);
    setYearOpen(false);
  };

  const cancel = () => {
    setTempDate(parsed);
    onChange('');
    setOpen(false);
    setMonthOpen(false);
    setYearOpen(false);
  };

  const formatInput = (date?: Date) => {
    if (!date) return '';
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  const makeCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const first = new Date(year, month, 1);
    const dayOfWeek = (first.getDay() + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells: { day: number; date: Date; outside: boolean }[] = [];

    for (let i = 0; i < dayOfWeek; i++) {
      const d = prevMonthDays - (dayOfWeek - 1) + i;
      cells.push({ day: d, date: new Date(year, month - 1, d), outside: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, date: new Date(year, month, d), outside: false });
    }

    while (cells.length < 42) {
      const next = cells.length - (dayOfWeek + daysInMonth) + 1;
      cells.push({
        day: next,
        date: new Date(year, month + 1, next),
        outside: true,
      });
    }

    return cells;
  };

  const current = tempDate ?? parsed ?? new Date();
  const days = makeCalendar(current);

  const disableFuture = (d: Date) => d > new Date();

  const toggleMonthPopup = () => {
    if (!monthBtnRef.current) return;

    if (monthOpen) {
      setMonthOpen(false);
      return;
    }

    const rect = monthBtnRef.current.getBoundingClientRect();
    setMonthPos({ top: rect.bottom + 2, left: rect.left });

    setMonthOpen(true);
    setYearOpen(false);
  };

  const toggleYearPopup = () => {
    if (!yearBtnRef.current) return;

    if (yearOpen) {
      setYearOpen(false);
      return;
    }

    const rect = yearBtnRef.current.getBoundingClientRect();
    setYearPos({ top: rect.bottom + 2, left: rect.left });

    setYearOpen(true);
    setMonthOpen(false);
  };

  return (
    <div className={clsx(styles.wrapper, className)} ref={wrapperRef}>
      {label && (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      )}

      <button
        id={fieldId}
        type="button"
        className={clsx(styles.input, error && styles.inputError, inputClassName)}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : 'Выбрать дату'}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        onClick={() => {
          setOpen((prev) => !prev);
          setMonthOpen(false);
          setYearOpen(false);
        }}
      >
        <span
          className={clsx(styles.inputField, !formatInput(tempDate) && styles.inputPlaceholder)}
        >
          {formatInput(tempDate) || placeholder}
        </span>
        <Icon name="calendar" size={24} className={styles.icon} aria-hidden="true" />
      </button>

      {error && (
        <span id={`${fieldId}-error`} className={styles.error}>
          {error}
        </span>
      )}

      {monthOpen && (
        <div className={styles.monthPopup} style={{ top: monthPos.top, left: monthPos.left }}>
          {months.map((m, i) => (
            <button
              key={m}
              type="button"
              className={styles.popupItem}
              onClick={() => handleMonthSelect(i)}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {yearOpen && (
        <div className={styles.yearPopup} style={{ top: yearPos.top, left: yearPos.left }}>
          {years.map((y) => (
            <button
              key={y}
              type="button"
              className={styles.popupItem}
              onClick={() => handleYearSelect(y)}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          id={`${fieldId}-calendar`}
          role="dialog"
          aria-modal="false"
          aria-label="Календарь"
          className={styles.popover}
        >
          <div className={styles.header}>
            <div className={styles.headerItem}>
              <span>{months[current.getMonth()]}</span>

              <button
                type="button"
                ref={monthBtnRef}
                className={styles.chevronBtn}
                onClick={toggleMonthPopup}
                aria-label="Выбрать месяц"
                aria-expanded={monthOpen}
              >

                <Icon
                  name="chevron-down"
                  size={24}
                  className={clsx(styles.chevron, monthOpen && styles.rotated)}
                  aria-hidden="true"
                />

              </button>
            </div>

            <div className={styles.headerItem}>
              <span>{current.getFullYear()}</span>

              <button
                type="button"
                ref={yearBtnRef}
                className={styles.chevronBtn}
                onClick={toggleYearPopup}
                aria-label="Выбрать год"
                aria-expanded={yearOpen}
              >

                <Icon
                  name="chevron-down"
                  size={24}
                  className={clsx(styles.chevron, yearOpen && styles.rotated)}
                  aria-hidden="true"
                />
                
              </button>
            </div>
          </div>

          <div className={styles.weekRow}>
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
              <div key={d} className={styles.weekday}>
                {d}
              </div>
            ))}
          </div>

          <div className={styles.grid}>
            {days.map(({ day, date, outside }, i) => {
              const selected = tempDate && tempDate.toDateString() === date.toDateString();
              const disabled = disableFuture(date);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && handleDaySelect(date)}
                  aria-label={formatAriaDate(date)}
                  aria-pressed={Boolean(selected)}
                  className={clsx(styles.day, outside ? styles.outside : styles.inside, selected && styles.selected)}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={cancel}>
              Отменить
            </button>
            <button type="button" className={styles.applyBtn} onClick={apply}>
              Выбрать
            </button>
          </div>
        </div>
      )}
    </div>
  );
};