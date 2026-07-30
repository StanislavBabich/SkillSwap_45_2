import { useEffect, useMemo, useState, useCallback } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { DropDownCity } from '@/shared/ui/DropDownCity'; 
import { Dropdown } from '@/shared/ui/Dropdown';
import { Button } from '@/shared/ui/Button';
import { DatePicker } from '@/shared/ui/DatePicker/DatePicker';

import { AvatarUpload } from './components/AvatarUpload';

import {
  initializeCities,
  selectCities,
} from '@/features/cities/slice';

import {
  initializeCategories,
  selectCategories,
  selectSubcategories,
} from '@/features/categories/slice';

import type { StepProps } from '../../types';

import styles from './Step2Profile.module.css';
import userInfoIllustration from '@/assets/user-info.svg';

type Step2ProfileProps = StepProps & {
  embedded?: boolean;
};

export const Step2Profile = ({
  data,
  onUpdate,
  onNext,
  onBack,
  embedded = false,
}: Step2ProfileProps) => {
  const dispatch = useAppDispatch();

  const cities = useAppSelector(selectCities);
  const categories = useAppSelector(selectCategories);
  const subcategories = useAppSelector(selectSubcategories);

  const [errors, setErrors] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    cityId: '',
    categories: '',
    subcategories: '',
  });

  useEffect(() => {
    dispatch(initializeCities());
    dispatch(initializeCategories());
  }, [dispatch]);

  // Раздельное хранение категорий и подкатегорий
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    data.selectedCategories ?? []
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>(
    data.selectedSubcategories ?? []
  );

  // Обновляем данные в родителе при изменении
  useEffect(() => {
    onUpdate({
      selectedCategories,
      selectedSubcategories,
    });
  }, [selectedCategories, selectedSubcategories, onUpdate]);

  // Фильтруем подкатегории по выбранным категориям
  const availableSubcategories = useMemo(() => {
    if (selectedCategories.length === 0) return [];
    return subcategories.filter(sub => 
      selectedCategories.includes(sub.categoryId)
    );
  }, [subcategories, selectedCategories]);

  const handleAvatarChange = useCallback(
    (seed: string | null) => {
      onUpdate({ avatarSeed: seed });
    },
    [onUpdate]
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ name: e.target.value });
  };

  const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ about: e.target.value });
  };

  const handleDateChange = (value: string) => {
    onUpdate({ dateOfBirth: value });
  };

  const handleGenderChange = (value: string) => {
    onUpdate({ gender: value as 'male' | 'female' | 'other' });
  };

   const handleCityChange = (value: string) => {
    onUpdate({ cityId: value ? Number(value) : undefined });
  };

  const handleCategoriesChange = (categoryIds: string[]) => {
    const ids = categoryIds.map(Number);
    setSelectedCategories(ids);
    
    // Очищаем подкатегории, которые не относятся к выбранным категориям
    setSelectedSubcategories(prev => 
      prev.filter(subId => {
        const sub = subcategories.find(s => s.id === subId);
        return sub && ids.includes(sub.categoryId);
      })
    );
  };

  const handleSubcategoriesChange = (subIds: string[]) => {
    setSelectedSubcategories(subIds.map(Number));
  };

  const validate = () => {
    const newErrors = {
      name: '',
      dateOfBirth: '',
      gender: '',
      cityId: '',
      categories: '',
      subcategories: '',
    };

    if (!data.name.trim()) newErrors.name = 'Введите имя';
    if (!data.dateOfBirth) newErrors.dateOfBirth = 'Выберите дату рождения';
    if (!data.gender) newErrors.gender = 'Выберите пол';
    if (!data.cityId) newErrors.cityId = 'Выберите город';
    if (selectedCategories.length === 0) newErrors.categories = 'Выберите хотя бы одну категорию';
    if (selectedSubcategories.length === 0) newErrors.subcategories = 'Выберите хотя бы одну подкатегорию';

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onNext();
  };

  return (
    <div className={clsx(styles.wrapper, embedded && styles.wrapperEmbedded)}>
      <div className={styles.left}>
        <div className={styles.avatarSection}>
          <AvatarUpload
            email={data.email}
            gender={data.gender}
            value={data.avatarSeed}
            onChange={handleAvatarChange}
            variant="iconOnly"
            avatarSize={164}
          />
        </div>
        <p className={styles.avatarCaption}>
          Аватар генерируется автоматически. <br />Нажимайте на кнопку чтобы изменить
        </p>

        <div className={styles.formContainer}>
          <Input
            label="Имя"
            placeholder="Введите ваше имя"
            value={data.name}
            onChange={handleNameChange}
            error={errors.name}
            hideHelper={!errors.name}
          />

          <div className={styles.row}>
            <DatePicker
              label="Дата рождения"
              value={data.dateOfBirth || ''}
              onChange={handleDateChange}
              placeholder="дд.мм.гггг"
              error={errors.dateOfBirth}
              instantSave={true}      
              closeOnSelect={true}    
            />

            <div className={styles.genderWrapper}>
              <Select
                size="short"
                label="Пол"
                value={data.gender || ''}
                onChange={handleGenderChange}
                options={[
                  { value: 'male', label: 'Мужской' },
                  { value: 'female', label: 'Женский' },
                  { value: 'other', label: 'Другое' },
                ]}
                error={errors.gender}
              />
            </div>
          </div>

          <DropDownCity
            label="Город"
            value={data.cityId ? String(data.cityId) : ''}
            onChange={handleCityChange}
            options={cities.map((c) => ({
              value: String(c.id),
              label: c.name,
            }))}
            placeholder="Не указан"
            error={errors.cityId}
            minSearchLength={1}
            maxResults={50}
          />

          <div className={styles.field}>
            <label className={styles.label} htmlFor="about">
              О себе
            </label>
            <textarea
              id="about"
              className={styles.textarea}
              placeholder="Расскажите немного о себе"
              value={data.about || ''}
              onChange={handleAboutChange}
              rows={3}
            />
          </div>

          <Dropdown
            mode="multiple"
            label="Категории, которым хотите научиться"
            placeholder="Выберите категории"
            value={selectedCategories.map(String)}
            onChange={handleCategoriesChange}
            options={categories.map((c) => ({
              value: String(c.id),
              label: c.name,
            }))}
            error={errors.categories}
            showCounter={true}
            counterText="Выбрано: {count}"
          />

          <Dropdown
            mode="multiple"
            label="Подкатегории"
            placeholder="Выберите подкатегории"
            disabled={selectedCategories.length === 0}
            value={selectedSubcategories.map(String)}
            onChange={handleSubcategoriesChange}
            options={availableSubcategories.map((sub) => ({
              value: String(sub.id),
              label: sub.name,
            }))}
            error={errors.subcategories}
            showCounter={true}
            counterText="Выбрано: {count}"
          />

          <div className={styles.buttons}>
            <Button variant="secondary" onClick={onBack} fullWidth>
              Назад
            </Button>

            <Button onClick={handleSubmit} fullWidth>
              Продолжить
            </Button>
          </div>
        </div>
      </div>

      {!embedded && (
        <div className={styles.right}>
          <div className={styles.infoContainer}>
            <img src={userInfoIllustration} className={styles.illustrationImage} alt="" />
            <div className={styles.infoText}>
              <h3 className={styles.infoTitle}>
                Расскажите немного о себе
              </h3>
              <p className={styles.infoSubtitle}>
                Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};