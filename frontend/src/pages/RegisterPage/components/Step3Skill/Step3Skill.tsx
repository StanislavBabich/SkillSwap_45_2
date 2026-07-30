import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { initializeCategories } from '@/features/categories/slice';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import type { SelectOption } from '@/shared/ui/Select';
import type { RegistrationData } from '@/pages/RegisterPage/types';
import { ImageUpload } from './components/ImageUpload';
import schoolBoardIcon from '@/assets/school-board.svg';
import styles from './Step3Skill.module.css';

const DESCRIPTION_MAX_LENGTH = 500;

export interface Step3SkillProps {
  data: Pick<RegistrationData, 'teachSkill'>;
  onUpdate: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
  embedded?: boolean;
}

export function Step3Skill({
  data,
  onUpdate,
  onNext,
  onBack,
  embedded = false,
}: Step3SkillProps) {
  const { teachSkill } = data;
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const subcategories = useAppSelector((state) => state.categories.subcategories);
  const loadError = useAppSelector((state) => state.categories.error);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    dispatch(initializeCategories());
  }, [dispatch]);

  const subcategoriesForCategory = subcategories.filter(
    (s) => s.categoryId === teachSkill.categoryId
  );

  const categoryOptions: SelectOption[] = categories.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  const subcategoryOptions: SelectOption[] = subcategoriesForCategory.map((s) => ({
    value: String(s.id),
    label: s.name,
  }));

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ teachSkill: { ...teachSkill, name: e.target.value } });
    },
    [teachSkill, onUpdate]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      const categoryId = value ? Number(value) : 0;
      onUpdate({
        teachSkill: {
          ...teachSkill,
          categoryId,
          subcategoryId: 0,
        },
      });
    },
    [teachSkill, onUpdate]
  );

  const handleSubcategoryChange = useCallback(
    (value: string) => {
      const subcategoryId = value ? Number(value) : 0;
      onUpdate({ teachSkill: { ...teachSkill, subcategoryId } });
    },
    [teachSkill, onUpdate]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value.slice(0, DESCRIPTION_MAX_LENGTH);
      onUpdate({ teachSkill: { ...teachSkill, description: v } });
    },
    [teachSkill, onUpdate]
  );

  const handleImagesChange = useCallback(
    (files: File[]) => {
      onUpdate({ teachSkill: { ...teachSkill, images: files } });
    },
    [teachSkill, onUpdate]
  );

  const nameError =
    submitted && !teachSkill.name.trim() ? 'Введите название навыка' : undefined;
  const categoryError =
    submitted && !teachSkill.categoryId ? 'Выберите категорию' : undefined;
  const subcategoryError =
    submitted && teachSkill.categoryId && !teachSkill.subcategoryId
      ? 'Выберите подкатегорию'
      : undefined;

  const isFormValid =
    Boolean(teachSkill.name.trim()) &&
    teachSkill.categoryId > 0 &&
    teachSkill.subcategoryId > 0 &&
    teachSkill.description.length <= DESCRIPTION_MAX_LENGTH;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      if (!isFormValid) return;
      onNext();
    },
    [isFormValid, onNext]
  );

  return (
    <div className={styles.root}>
      <div className={clsx(styles.columns, embedded && styles.columnsEmbedded)}>
        <div className={styles.left}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input
            label="Название навыка"
            placeholder="Введите название вашего навыка"
            value={teachSkill.name}
            onChange={handleNameChange}
            error={nameError ?? false}
          />
          
          <div className={styles.formBody}>
          {loadError && (
            <p className={styles.loadError} role="alert">
              {loadError}
            </p>
          )}
          <Select
            label="Категория навыка"
            placeholder="Выберите категорию навыка"
            options={categoryOptions}
            value={teachSkill.categoryId ? String(teachSkill.categoryId) : ''}
            onChange={handleCategoryChange}
            error={categoryError}
          />

          <Select
            label="Подкатегория навыка"
            placeholder="Выберите подкатегорию навыка"
            options={subcategoryOptions}
            value={teachSkill.subcategoryId ? String(teachSkill.subcategoryId) : ''}
            onChange={handleSubcategoryChange}
            error={subcategoryError}
            disabled={!teachSkill.categoryId}
          />

          <div className={styles.field}>
            <label className={styles.label} htmlFor="skill-description">
              Описание
            </label>
            <textarea
              id="skill-description"
              className={styles.textarea}
              placeholder="Коротко опишите, чему можете научить"
              value={teachSkill.description}
              onChange={handleDescriptionChange}
              maxLength={DESCRIPTION_MAX_LENGTH}
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <ImageUpload
              value={teachSkill.images}
              onChange={handleImagesChange}
            />
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={onBack}>
              Назад
            </Button>
            <Button type="submit" variant="primary" disabled={!isFormValid}>
              Продолжить
            </Button>
          </div>
          </div>
          </form>
        </div>
        {!embedded && (
          <div className={styles.right}>
            <img
              src={schoolBoardIcon}
              alt=""
              className={styles.illustration}
              aria-hidden
            />
            <div className={styles.copyBlock}>
              <p className={styles.title}>Укажите, чем вы готовы поделиться</p>
              <p className={styles.subtitle}>
                Так другие люди смогут увидеть ваши предложения и предложить вам обмен!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
