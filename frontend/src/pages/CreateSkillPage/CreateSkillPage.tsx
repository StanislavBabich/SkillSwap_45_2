import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { initializeCategories, selectCategories } from '@/features/categories/slice';
import { storage } from '@/shared/lib/storage';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import type { SelectOption } from '@/shared/ui/Select';
import { ImageUpload } from '@/pages/RegisterPage/components/Step3Skill/components/ImageUpload';
import styles from './CreateSkillPage.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const DESCRIPTION_MAX_LENGTH = 500;

export const CreateSkillPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const categories = useAppSelector(selectCategories);
  const loadError = useAppSelector((state) => state.categories.error);

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    dispatch(initializeCategories());
  }, [dispatch]);

  const selectedCategory = categories.find((c) => String(c.id) === categoryId);
  const subcategoriesForCategory = selectedCategory?.children ?? [];

  const categoryOptions: SelectOption[] = categories.map((c) => ({ value: String(c.id), label: c.name }));
  const subcategoryOptions: SelectOption[] = subcategoriesForCategory.map((s) => ({ value: String(s.id), label: s.name }));

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryId(value);
    setSubcategoryId('');
  }, []);

  const nameError = submitted && !title.trim() ? 'Введите название навыка' : undefined;
  const categoryError = submitted && !categoryId ? 'Выберите категорию' : undefined;
  const subcategoryError = submitted && categoryId && !subcategoryId ? 'Выберите подкатегорию' : undefined;

  const isFormValid = Boolean(title.trim()) && Boolean(categoryId) && Boolean(subcategoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isFormValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const token = storage.getToken();
      
      // Сначала загружаем изображения (если есть)
      let imageUrls: string[] = [];
      if (images.length > 0) {
        for (const file of images) {
          const formData = new FormData();
          formData.append('file', file);
          const uploadRes = await fetch(`${API_URL}/files/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          if (uploadRes.ok) {
            const { url } = await uploadRes.json();
            imageUrls.push(url);
          }
        }
      }

      // Создаём навык
      const res = await fetch(`${API_URL}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          categoryId: subcategoryId || categoryId,
          images: imageUrls,
        }),
      });

      if (!res.ok) throw new Error('Ошибка создания навыка');

      const skill = await res.json();
      navigate(`/skill/${skill.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать навык');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Создание навыка</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {loadError && <p className={styles.loadError} role="alert">{loadError}</p>}
        
        <Input
          label="Название навыка"
          placeholder="Введите название вашего навыка"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={nameError ?? false}
        />

        <Select
          label="Категория навыка"
          placeholder="Выберите категорию навыка"
          options={categoryOptions}
          value={categoryId}
          onChange={handleCategoryChange}
          error={categoryError}
        />

        <Select
          label="Подкатегория навыка"
          placeholder="Выберите подкатегорию навыка"
          options={subcategoryOptions}
          value={subcategoryId}
          onChange={setSubcategoryId}
          error={subcategoryError}
          disabled={!categoryId}
        />

        <div className={styles.field}>
          <label className={styles.label} htmlFor="skill-description">Описание</label>
          <textarea
            id="skill-description"
            className={styles.textarea}
            placeholder="Коротко опишите, чему можете научить"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, DESCRIPTION_MAX_LENGTH))}
            maxLength={DESCRIPTION_MAX_LENGTH}
            rows={3}
          />
        </div>

        <div className={styles.field}>
          <ImageUpload value={images} onChange={setImages} />
        </div>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Создание...' : 'Создать навык'}
        </Button>
      </form>
    </section>
  );
};