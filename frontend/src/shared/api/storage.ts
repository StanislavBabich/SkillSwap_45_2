import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const BUCKET_SKILL_IMAGES = 'skill-images';

const getClient = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL and Anon Key must be set (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)');
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

/**
 * Загружает файл в Supabase Storage и возвращает публичный URL.
 */
export async function uploadSkillImage(file: File): Promise<string> {
  const supabase = getClient();
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET_SKILL_IMAGES).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET_SKILL_IMAGES).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Загружает массив файлов и возвращает массив publicUrl.
 */
export async function uploadSkillImages(files: File[]): Promise<string[]> {
  const urls = await Promise.all(files.map((file) => uploadSkillImage(file)));
  return urls;
}

/** Валидация изображений перед загрузкой: только image/*. */
function validateImageFiles(files: File[]): void {
  const invalid = files.find((f) => !f.type.startsWith('image/'));
  if (invalid) {
    throw new Error(`Недопустимый тип файла: ${invalid.name}. Разрешены только изображения.`);
  }
}

/**
 * Загрузка изображений в Supabase Storage с откатом при ошибке:
 * при провале удаляет уже загруженные файлы.
 */
export async function uploadSkillImagesWithRollback(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  validateImageFiles(files);

  const supabase = getClient();
  const urls: string[] = [];
  const paths: string[] = [];

  for (const file of files) {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET_SKILL_IMAGES).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      if (paths.length > 0) {
        await supabase.storage.from(BUCKET_SKILL_IMAGES).remove(paths);
      }
      throw new Error(`Не удалось загрузить изображения: ${error.message}`);
    }

    paths.push(path);
    const { data } = supabase.storage.from(BUCKET_SKILL_IMAGES).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}

export const storageService = {
  uploadSkillImage,
  uploadSkillImages,
  uploadSkillImagesWithRollback,
};
