import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { initializeCategories, selectCategories } from '@/features/categories/slice';
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

export function Step3Skill({ data, onUpdate, onNext, onBack, embedded = false }: Step3SkillProps) {
  const { teachSkill } = data;
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const loadError = useAppSelector((state) => state.categories.error);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    dispatch(initializeCategories());
  }, [dispatch]);

  const selectedCategory = categories.find((c) => String(c.id) === teachSkill.categoryId);
  const subcategoriesForCategory = selectedCategory?.children ?? [];

  const categoryOptions: SelectOption[] = categories.map((c) => ({ value: String(c.id), label: c.name }));
  const subcategoryOptions: SelectOption[] = subcategoriesForCategory.map((s) => ({ value: String(s.id), label: s.name }));

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ teachSkill: { ...teachSkill, name: e.target.value } }),
    [teachSkill, onUpdate]
  );

  const handleCategoryChange = useCallback(
    (value: string) => onUpdate({ teachSkill: { ...teachSkill, categoryId: value, subcategoryId: '' } }),
    [teachSkill, onUpdate]
  );

  const handleSubcategoryChange = useCallback(
    (value: string) => onUpdate({ teachSkill: { ...teachSkill, subcategoryId: value } }),
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
    (files: File[]) => onUpdate({ teachSkill: { ...teachSkill, images: files } }),
    [teachSkill, onUpdate]
  );

  const nameError = submitted && !teachSkill.name.trim() ? 'Enter a skill name' : undefined;
  const categoryError = submitted && !teachSkill.categoryId ? 'Select a category' : undefined;
  const subcategoryError = submitted && teachSkill.categoryId && !teachSkill.subcategoryId ? 'Select a subcategory' : undefined;

  const isFormValid =
    Boolean(teachSkill.name.trim()) && Boolean(teachSkill.categoryId) && Boolean(teachSkill.subcategoryId) && teachSkill.description.length <= DESCRIPTION_MAX_LENGTH;

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
            <Input label="Skill name" placeholder="Enter your skill name" value={teachSkill.name} onChange={handleNameChange} error={nameError ?? false} />
            <div className={styles.formBody}>
              {loadError && <p className={styles.loadError} role="alert">{loadError}</p>}
              <Select label="Skill category" placeholder="Select a skill category" options={categoryOptions} value={teachSkill.categoryId} onChange={handleCategoryChange} error={categoryError} />
              <Select label="Skill subcategory" placeholder="Select a skill subcategory" options={subcategoryOptions} value={teachSkill.subcategoryId} onChange={handleSubcategoryChange} error={subcategoryError} disabled={!teachSkill.categoryId} />
              <div className={styles.field}>
                <label className={styles.label} htmlFor="skill-description">Description</label>
                <textarea id="skill-description" className={styles.textarea} placeholder="Briefly describe what you can teach" value={teachSkill.description} onChange={handleDescriptionChange} maxLength={DESCRIPTION_MAX_LENGTH} rows={3} />
              </div>
              <div className={styles.field}>
                <ImageUpload value={teachSkill.images} onChange={handleImagesChange} />
              </div>
              <div className={styles.actions}>
                <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
                <Button type="submit" variant="primary" disabled={!isFormValid}>Continue</Button>
              </div>
            </div>
          </form>
        </div>
        {!embedded && (
          <div className={styles.right}>
            <img src={schoolBoardIcon} alt="" className={styles.illustration} aria-hidden />
            <div className={styles.copyBlock}>
              <p className={styles.title}>Tell us what you are ready to share</p>
              <p className={styles.subtitle}>This way others can see your offers and propose a swap!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}