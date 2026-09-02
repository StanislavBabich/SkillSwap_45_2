export const categoryColorMap: Record<string, string> = {
  'Business and career': 'var(--color-tag-business)',
  'Creativity and art': 'var(--color-tag-art)',
  'Foreign languages': 'var(--color-tag-language)',
  'Education and development': 'var(--color-tag-education)',
  'Health and lifestyle': 'var(--color-tag-health)',
  'Home and comfort': 'var(--color-tag-home)',
  'Technology and IT': 'var(--color-tag-tech)',
  'Sports and outdoor activities': 'var(--color-tag-sport)',
};

export const getCategoryColor = (categoryName?: string | null): string => {
  if (!categoryName) return 'var(--color-tag-default)';
  return categoryColorMap[categoryName] || 'var(--color-tag-default)';
};