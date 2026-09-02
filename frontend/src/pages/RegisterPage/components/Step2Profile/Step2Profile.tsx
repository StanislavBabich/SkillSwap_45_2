import { useEffect, useMemo, useState, useCallback } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Dropdown } from '@/shared/ui/Dropdown';
import { Button } from '@/shared/ui/Button';
import { DatePicker } from '@/shared/ui/DatePicker/DatePicker';
import { DropDownCity } from '@/shared/ui/DropDownCity';

import { AvatarUpload } from './components/AvatarUpload';

import { initializeCategories, selectCategories } from '@/features/categories/slice';
import { initializeCities, searchCities, selectCities } from '@/features/cities/slice';

import type { StepProps } from '../../hooks/useRegistration';

import styles from './Step2Profile.module.css';
import userInfoIllustration from '@/assets/user-info.svg';

type Step2ProfileProps = StepProps & {
  embedded?: boolean;
  isSubmitting?: boolean;
};

export const Step2Profile = ({
  data,
  onUpdate,
  onNext,
  onBack,
  embedded = false,
  isSubmitting = false,
}: Step2ProfileProps) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const cities = useAppSelector(selectCities);

  const [errors, setErrors] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    categories: '',
  });

  useEffect(() => {
    dispatch(initializeCategories());
    dispatch(initializeCities());
  }, [dispatch]);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    data.selectedCategoryIds ?? []
  );
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<string[]>([]);

  // Объединяем выбранные категории и подкатегории
  useEffect(() => {
    const allIds = [...selectedCategoryIds, ...selectedSubcategoryIds];
    onUpdate({ selectedCategoryIds: allIds });
  }, [selectedCategoryIds, selectedSubcategoryIds, onUpdate]);

  // Подкатегории, доступные для выбора
  const availableSubcategories = useMemo(() => {
    if (selectedCategoryIds.length === 0) return [];
    return categories
      .filter((cat) => selectedCategoryIds.includes(String(cat.id)))
      .flatMap((cat) => cat.children ?? []);
  }, [categories, selectedCategoryIds]);

  const handleAvatarChange = useCallback((seed: string | null) => onUpdate({ avatarSeed: seed }), [onUpdate]);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ name: e.target.value });
  const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate({ about: e.target.value });
  const handleDateChange = (value: string) => onUpdate({ dateOfBirth: value });
  const handleGenderChange = (value: string) => onUpdate({ gender: value as 'male' | 'female' | 'other' });
  const handleCityChange = (city: string) => onUpdate({ city });
  const handleCitySearch = useCallback(
    (search: string) => {
      void dispatch(searchCities(search));
    },
    [dispatch]
  );
  const handleCategoriesChange = (categoryIds: string[]) => {
    setSelectedCategoryIds(categoryIds);
    // Очищаем выбранные подкатегории, которые не относятся к выбранным категориям
    setSelectedSubcategoryIds((prev) =>
      prev.filter((subId) => {
        const parentCat = categories.find((cat) =>
          (cat.children ?? []).some((child) => String(child.id) === subId)
        );
        return parentCat && categoryIds.includes(String(parentCat.id));
      })
    );
  };
  const handleSubcategoriesChange = (subIds: string[]) => setSelectedSubcategoryIds(subIds);

  const validate = () => {
    const newErrors = { name: '', dateOfBirth: '', gender: '', city: '', categories: '' };
    if (!data.name.trim()) newErrors.name = 'Enter your name';
    if (!data.dateOfBirth) newErrors.dateOfBirth = 'Select date of birth';
    if (!data.gender) newErrors.gender = 'Select gender';
    if (selectedCategoryIds.length === 0) newErrors.categories = 'Select at least one category';
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onNext();
  };

  return (
    <div className={clsx(styles.wrapper, embedded && styles.wrapperEmbedded)}>
      <div className={styles.left}>
        <div className={styles.avatarSection}>
          <AvatarUpload email={data.email} gender={data.gender} value={data.avatarSeed} onChange={handleAvatarChange} variant="iconOnly" avatarSize={164} />
        </div>
        <p className={styles.avatarCaption}>Avatar is generated automatically. <br />Click the button to change it</p>

        <div className={styles.formContainer}>
          <Input label="Name" placeholder="Enter your name" value={data.name} onChange={handleNameChange} error={errors.name} hideHelper={!errors.name} />

          <div className={styles.row}>
            <DatePicker label="Date of birth" value={data.dateOfBirth || ''} onChange={handleDateChange} placeholder="mm/dd/yyyy" error={errors.dateOfBirth} instantSave closeOnSelect />
            <div className={styles.genderWrapper}>
              <Select size="short" label="Gender" value={data.gender || ''} onChange={handleGenderChange}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
                error={errors.gender}
              />
            </div>
          </div>

          <DropDownCity
            label="City"
            value={data.city || ''}
            onChange={handleCityChange}
            onSearch={handleCitySearch}
            options={cities.map((city) => ({ value: city.name, label: city.name }))}
            placeholder="Not specified"
            minSearchLength={1}
            maxResults={50}
          />

          <div className={styles.field}>
            <label className={styles.label} htmlFor="about">About me</label>
            <textarea id="about" className={styles.textarea} placeholder="Tell us a bit about yourself" value={data.about || ''} onChange={handleAboutChange} rows={3} />
          </div>

          <Dropdown mode="multiple" label="Categories you want to learn" placeholder="Select categories"
            value={selectedCategoryIds} onChange={handleCategoriesChange}
            options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
            error={errors.categories} showCounter counterText="Selected: {count}"
          />

          {availableSubcategories.length > 0 && (
            <Dropdown mode="multiple" label="Subcategories" placeholder="Select subcategories"
              value={selectedSubcategoryIds} onChange={handleSubcategoriesChange}
              options={availableSubcategories.map((sub) => ({ value: String(sub.id), label: sub.name }))}
              showCounter counterText="Selected: {count}"
            />
          )}

          <div className={styles.buttons}>
            <Button variant="secondary" onClick={onBack} fullWidth>Back</Button>
            <Button onClick={handleSubmit} fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Complete sign-up'}
            </Button>
          </div>
        </div>
      </div>

      {!embedded && (
        <div className={styles.right}>
          <div className={styles.infoContainer}>
            <img src={userInfoIllustration} className={styles.illustrationImage} alt="" />
            <div className={styles.infoText}>
              <h3 className={styles.infoTitle}>Tell us a bit about yourself</h3>
              <p className={styles.infoSubtitle}>This will help others get to know you better and choose you for a swap</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
