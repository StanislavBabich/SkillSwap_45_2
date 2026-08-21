import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Tag.module.css';

export type TagVariant = 
  | 'business'
  | 'art'
  | 'language'
  | 'education'
  | 'home'
  | 'health'
  | 'tech'
  | 'sport'
  | 'overflow'
  | 'default';

export interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
  overflow?: number;
  className?: string;
  categoryName?: string;
  color?: string;
}

// Маппинг всех категорий и подкатегорий → variant
const categoryVariantMap: Record<string, TagVariant> = {
  'Бизнес и карьера': 'business',
  'Управление командой': 'business',
  'Маркетинг и реклама': 'business',
  'Продажи и переговоры': 'business',
  'Личный бренд': 'business',
  'Резюме и собеседование': 'business',
  'Тайм-менеджмент': 'business',
  'Проектное управление': 'business',
  'Предпринимательство': 'business',

  'Творчество и искусство': 'art',
  'Рисование и иллюстрация': 'art',
  'Фотография': 'art',
  'Видеомонтаж': 'art',
  'Музыка и звук': 'art',
  'Актёрское мастерство': 'art',
  'Креативное письмо': 'art',
  'Арт-терапия': 'art',
  'Декор и DIY': 'art',

  'Иностранные языки': 'language',
  'Английский': 'language',
  'Английский язык': 'language',
  'Французский': 'language',
  'Французский язык': 'language',
  'Испанский': 'language',
  'Испанский язык': 'language',
  'Немецкий': 'language',
  'Немецкий язык': 'language',
  'Китайский': 'language',
  'Китайский язык': 'language',
  'Японский': 'language',
  'Русский язык': 'language',
  'Подготовка к экзаменам': 'language',

  'Образование и развитие': 'education',
  'Личностное развитие': 'education',
  'Навыки обучения': 'education',
  'Когнитивные техники': 'education',
  'Скорочтение': 'education',
  'Навыки преподавания': 'education',
  'Коучинг': 'education',
  'Методика преподавания': 'education',
  'Онлайн-курсы': 'education',
  'Педагогика': 'education',

  'Здоровье и лайфстайл': 'health',
  'Йога и медитация': 'health',
  'Питание и ЗОЖ': 'health',
  'Ментальное здоровье': 'health',
  'Осознанность': 'health',
  'Физические тренировки': 'health',
  'Сон и восстановление': 'health',
  'Баланс жизни и работы': 'health',

  'Дом и уют': 'home',
  'Уборка и организация': 'home',
  'Домашние финансы': 'home',
  'Приготовление еды': 'home',
  'Домашние растения': 'home',
  'Ремонт': 'home',
  'Хранение вещей': 'home',
  'Личная финансовая грамотность': 'home',
  'Инвестиции': 'home',

  'IT и технологии': 'tech',
  'Веб-разработка': 'tech',
  'Мобильная разработка': 'tech',
  'Data Science': 'tech',
  'Кибербезопасность': 'tech',
  'DevOps': 'tech',
  'UI/UX дизайн': 'tech',
  'Тестирование (QA)': 'tech',
  '1С': 'tech',
  'Frontend': 'tech',
  'Backend': 'tech',
  'GameDev': 'tech',

  'Спорт и активный отдых': 'sport',
  'Фитнес': 'sport',
  'Бег и триатлон': 'sport',
  'Командные виды спорта': 'sport',
  'Боевые искусства': 'sport',
  'Танцы': 'sport',
  'Экстремальный спорт': 'sport',
  'Плавание': 'sport',
  'Зимние виды спорта': 'sport',
  'Бас-гитара': 'sport',
  'Вокал': 'sport',
  'Бисероплетение': 'art',
  'Фитнес для мам': 'sport',
};

export const getTagVariant = (categoryName?: string | null): TagVariant => {
  if (!categoryName) return 'default';
  return categoryVariantMap[categoryName] || 'default';
};

export const Tag = ({
  children,
  overflow,
  variant = 'default',
  className = '',
  categoryName,
  color,
  ...rest
}: TagProps) => {
  const isOverflow = typeof overflow === 'number';
  const displayText = isOverflow ? `+${overflow}` : children;
  
  const effectiveVariant = isOverflow 
    ? 'overflow' 
    : categoryName 
      ? getTagVariant(categoryName) 
      : variant;

  return (
    <span
      className={clsx(styles.tag, styles[`tag_${effectiveVariant}`], className)}
      style={color ? { backgroundColor: color } : undefined}
      {...rest}
    >
      {displayText}
    </span>
  );
};