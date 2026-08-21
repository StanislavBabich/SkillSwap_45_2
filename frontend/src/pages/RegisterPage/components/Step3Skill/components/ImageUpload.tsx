import { useCallback, useRef, useState } from 'react';
import galleryAddIcon from '@/assets/gallery-add.svg';
import styles from './ImageUpload.module.css';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

const getFileError = (file: File): string | null => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Только JPEG, PNG, WebP, GIF';
  }
  if (file.size > MAX_SIZE_BYTES) {
    return 'Макс. размер файла 5 МБ';
  }
  return null;
};

export interface ImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles?.length) return;
      setError(null);
      const list = Array.from(newFiles);
      const valid: File[] = [];
      for (const file of list) {
        const err = getFileError(file);
        if (err) {
          setError(err);
          continue;
        }
        if (value.length + valid.length >= MAX_FILES) {
          setError(`Максимум ${MAX_FILES} фото`);
          break;
        }
        valid.push(file);
      }
      if (valid.length) onChange([...value, ...valid]);
    },
    [value, onChange]
  );

  const removeAt = useCallback(
    (index: number) => {
      const next = value.filter((_, i) => i !== index);
      onChange(next);
      setError(null);
    },
    [value, onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = '';
  };

  const canAdd = value.length < MAX_FILES;

  return (
    <div className={styles.root}>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        multiple
        className={styles.input}
        aria-label="Добавить фото"
        onChange={handleInputChange}
        disabled={!canAdd}
      />

      {value.length > 0 && (
        <div className={styles.previewGrid}>
          {value.map((file, index) => (
            <div key={`${file.name}-${index}`} className={styles.previewItem}>
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className={styles.previewImg}
                onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeAt(index)}
                aria-label="Удалить фото"
              >
                ×
              </button>
            </div>
          ))}
          {canAdd && (
            <button
              type="button"
              className={styles.addArea}
              onClick={() => inputRef.current?.click()}
              aria-label="Добавить фото"
            >
              <img src={galleryAddIcon} alt="" className={styles.addIcon} aria-hidden />
            </button>
          )}
        </div>
      )}

      {value.length === 0 && (
        <button
          type="button"
          className={styles.addAreaFull}
          onClick={() => inputRef.current?.click()}
          aria-label="Добавить фото"
        >
          <span className={styles.addCaption}>Перетащите или выберите изображения навыка</span>
          <span className={styles.addRow}>
            <img src={galleryAddIcon} alt="" className={styles.addIcon} aria-hidden />
            <span className={styles.addText}>Выбрать изображения</span>
          </span>
        </button>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
