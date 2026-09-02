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

const categoryVariantMap: Record<string, TagVariant> = {
  'Business and career': 'business',
  'Team management': 'business',
  'Marketing and advertising': 'business',
  'Sales and negotiations': 'business',
  'Personal brand': 'business',
  'Resume and interview': 'business',
  'Time management': 'business',
  'Project management': 'business',
  'Entrepreneurship': 'business',

  'Creativity and art': 'art',
  'Drawing and illustration': 'art',
  'Photography': 'art',
  'Video editing': 'art',
  'Music and sound': 'art',
  'Acting': 'art',
  'Creative writing': 'art',
  'Art therapy': 'art',
  'Decor and DIY': 'art',
  'Beadwork': 'art',

  'Foreign languages': 'language',
  'English': 'language',
  'French': 'language',
  'Spanish': 'language',
  'German': 'language',
  'Chinese': 'language',
  'Japanese': 'language',
  'Russian': 'language',
  'Exam preparation': 'language',

  'Education and development': 'education',
  'Personal development': 'education',
  'Learning skills': 'education',
  'Cognitive techniques': 'education',
  'Speed reading': 'education',
  'Teaching skills': 'education',
  'Coaching': 'education',
  'Teaching methodology': 'education',
  'Online courses': 'education',
  'Pedagogy': 'education',

  'Health and lifestyle': 'health',
  'Yoga and meditation': 'health',
  'Nutrition and healthy lifestyle': 'health',
  'Mental health': 'health',
  'Mindfulness': 'health',
  'Physical training': 'health',
  'Sleep and recovery': 'health',
  'Work-life balance': 'health',

  'Home and comfort': 'home',
  'Cleaning and organization': 'home',
  'Household finances': 'home',
  'Cooking': 'home',
  'Houseplants': 'home',
  'Home repairs': 'home',
  'Storage': 'home',
  'Personal financial literacy': 'home',
  'Investments': 'home',

  'Technology and IT': 'tech',
  'Web development': 'tech',
  'Mobile development': 'tech',
  'Data Science': 'tech',
  'Cybersecurity': 'tech',
  'DevOps': 'tech',
  'UI/UX design': 'tech',
  'Testing (QA)': 'tech',
  '1C': 'tech',
  'Frontend': 'tech',
  'Backend': 'tech',
  'GameDev': 'tech',

  'Sports and outdoor activities': 'sport',
  'Fitness': 'sport',
  'Running and triathlon': 'sport',
  'Team sports': 'sport',
  'Martial arts': 'sport',
  'Dance': 'sport',
  'Extreme sports': 'sport',
  'Swimming': 'sport',
  'Winter sports': 'sport',
  'Bass guitar': 'sport',
  'Vocals': 'sport',
  'Fitness for moms': 'sport',
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