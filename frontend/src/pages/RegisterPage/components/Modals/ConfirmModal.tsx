import { useMemo } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import styles from './ConfirmModal.module.css';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;

  data: {
    name: string;
    categoryName: string;
    subcategoryName: string;
    description: string;
    images: File[];
  };

  onEdit: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
  errorMessage?: string | null;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  data,
  onEdit,
  onConfirm,
  isConfirming = false,
  errorMessage = null,
}: ConfirmModalProps) => {
  const { name, categoryName, subcategoryName, description, images } = data;

  // Генерим превью
  const previewUrls = useMemo(
    () => images.map((f) => URL.createObjectURL(f)),
    [images]
  );

  const mainImage = previewUrls[0] ?? null;
  const extraImages = previewUrls.slice(1); // остальные миниатюры

  // Показываем +N только если изображений >= 4
  // (т.е. extraImages >= 3)
  const extraCount =
    extraImages.length > 3 ? extraImages.length - 2 : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Your offer"
      description="Please review and confirm that the details are correct"
      className={styles.modal}
      hideButton
    >
      <div className={styles.content}>
        
        {/* Левая зона */}
        <div className={styles.textBlock}>
          
          <p className={styles.title}>{name}</p>

          <p className={styles.category}>
            {categoryName} / {subcategoryName}
          </p>

          <p className={styles.skillDescription}>{description}</p>

          {errorMessage && (
            <p className={styles.errorMessage} role="alert">
              {errorMessage}
            </p>
          )}

          {/* Кнопки */}
          <div className={styles.buttons}>
            <Button
              variant="secondary"
              size="medium"
              onClick={onEdit}
              disabled={isConfirming}
              endIcon={<Icon name="edit" size={20} className={styles.editIcon} />}
              className={styles.editButton}
            >
              Edit
            </Button>

            <Button
              variant="primary"
              size="medium"
              onClick={onConfirm}
              isLoading={isConfirming}
              disabled={isConfirming}
              className={styles.confirmButton}
            >
              {isConfirming ? 'Saving...' : 'Done'}
            </Button>
          </div>
        </div>

        {/* Правая зона с фото */}
        <div className={styles.imagesBlock}>

          {mainImage && (
            <img src={mainImage} alt="" className={styles.mainImage} />
          )}

          {extraImages.length > 0 && (
            <div className={styles.extraColumn}>
              
              {/* Первые 2 мини-изображения */}
              {extraImages.slice(0, 2).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className={styles.extraImage}
                />
              ))}

              {/* Блок с блюром */}
              {extraImages.length >= 3 && (
                <div className={styles.moreWrapper}>
                  <img src={extraImages[2]} alt="" />

                  {/* Показывать "+N" только если N > 0 */}
                  {extraCount > 0 && (
                    <div className={styles.moreLabel}>+{extraCount}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};