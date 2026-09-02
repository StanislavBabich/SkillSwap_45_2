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

  const nameError = submitted && !title.trim() ? 'Enter a skill name' : undefined;
  const categoryError = submitted && !categoryId ? 'Select a category' : undefined;
  const subcategoryError = submitted && categoryId && !subcategoryId ? 'Select a subcategory' : undefined;

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

      if (!res.ok) throw new Error('Failed to create skill');

      const skill = await res.json();
      navigate(`/skill/${skill.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Create a skill</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {loadError && <p className={styles.loadError} role="alert">{loadError}</p>}
        
        <Input
          label="Skill name"
          placeholder="Enter your skill name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={nameError ?? false}
        />

        <Select
          label="Skill category"
          placeholder="Select a skill category"
          options={categoryOptions}
          value={categoryId}
          onChange={handleCategoryChange}
          error={categoryError}
        />

        <Select
          label="Skill subcategory"
          placeholder="Select a skill subcategory"
          options={subcategoryOptions}
          value={subcategoryId}
          onChange={setSubcategoryId}
          error={subcategoryError}
          disabled={!categoryId}
        />

        <div className={styles.field}>
          <label className={styles.label} htmlFor="skill-description">Description</label>
          <textarea
            id="skill-description"
            className={styles.textarea}
            placeholder="Briefly describe what you can teach"
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
          {isSubmitting ? 'Creating...' : 'Create skill'}
        </Button>
      </form>
    </section>
  );
};