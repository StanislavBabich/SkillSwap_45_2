export const categoryColorMap: Record<string, string> = {
  'Бизнес и карьера': 'var(--color-tag-business)',
  'Творчество и искусство': 'var(--color-tag-art)',
  'Иностранные языки': 'var(--color-tag-language)',
  'Образование и развитие': 'var(--color-tag-education)',
  'Здоровье и лайфстайл': 'var(--color-tag-health)',
  'Дом и уют': 'var(--color-tag-home)',
  'IT и технологии': 'var(--color-tag-tech)',
  'Спорт и активный отдых': 'var(--color-tag-sport)',
};

export const getCategoryColor = (categoryName?: string | null): string => {
  if (!categoryName) return 'var(--color-tag-default)';
  return categoryColorMap[categoryName] || 'var(--color-tag-default)';
};