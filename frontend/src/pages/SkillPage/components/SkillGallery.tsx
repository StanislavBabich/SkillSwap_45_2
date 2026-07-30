import { useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/image-gallery.css';
import styles from './SkillGallery.module.css';
import LeftIcon from '@/assets/chevron-left.svg';
import RightIcon from '@/assets/chevron-right.svg';

interface SkillGalleryProps {
  images: string[];
}

const getThumbnailUrl = (url: string): string => {
  if (url.includes('dummyimage.com')) {
    return url.replace('400x400', '100x75');
  }
  return url;
};

// Кастомная левая стрелка — библиотека передаёт просто функцию onClick
const CustomLeftNav = (onClick: () => void) => (
  <button 
    className={styles.customArrowLeft} 
    onClick={onClick}
    aria-label="Предыдущее изображение"
  >
    <img src={LeftIcon} alt="" width={16} height={16} />
  </button>
);

// Кастомная правая стрелка
const CustomRightNav = (onClick: () => void) => (
  <button 
    className={styles.customArrowRight} 
    onClick={onClick}
    aria-label="Следующее изображение"
  >
    <img src={RightIcon} alt="" width={16} height={16} />
  </button>
);

const SkillGallery = ({ images }: SkillGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.gallery}>
        <div className={styles.mainImageContainer}>
          <img src="/images/placeholder.jpg" alt="Нет изображения" />
        </div>
      </div>
    );
  }

  const galleryItems = images.map((url) => ({
    original: url,
    thumbnail: getThumbnailUrl(url),
    originalAlt: `Изображение навыка`,
    thumbnailAlt: `Миниатюра`,
  }));

  return (
    <div className={styles.gallery}>
      <ImageGallery
        items={galleryItems}
        startIndex={currentIndex}
        onSlide={setCurrentIndex}
        showPlayButton={false}
        showFullscreenButton={true}
        showThumbnails={true}
        thumbnailPosition="right"
        showNav={true}
        showBullets={false}
        renderLeftNav={CustomLeftNav}
        renderRightNav={CustomRightNav}
        additionalClass={styles.customGallery}
      />
    </div>
  );
};

export default SkillGallery;