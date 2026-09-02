export interface SeedCreateCategory {
  name: string;
  children?: string[];
}

export const CategoriesData: SeedCreateCategory[] = [
  {
    name: 'Business and career',
    children: [
      'Team management',
      'Marketing and advertising',
      'Sales and negotiations',
      'Personal brand',
      'Resume and interview',
      'Time management',
      'Project management',
      'Entrepreneurship',
    ],
  },
  {
    name: 'Creativity and art',
    children: [
      'Drawing and illustration',
      'Photography',
      'Video editing',
      'Music and sound',
      'Acting',
      'Creative writing',
      'Art therapy',
      'Decor and DIY',
    ],
  },
  {
    name: 'Foreign languages',
    children: [
      'English',
      'French',
      'Spanish',
      'German',
      'Chinese',
      'Japanese',
      'Exam preparation',
    ],
  },
  {
    name: 'Education and development',
    children: [
      'Personal development',
      'Learning skills',
      'Cognitive techniques',
      'Speed reading',
      'Teaching skills',
      'Coaching',
    ],
  },
  {
    name: 'Health and lifestyle',
    children: [
      'Yoga and meditation',
      'Nutrition and healthy lifestyle',
      'Mental health',
      'Mindfulness',
      'Physical training',
      'Sleep and recovery',
      'Work-life balance',
    ],
  },
  {
    name: 'Home and comfort',
    children: [
      'Cleaning and organization',
      'Household finances',
      'Cooking',
      'Houseplants',
      'Home repairs',
      'Storage',
    ],
  },
  {
    name: 'Technology and IT',
    children: [
      'Web development',
      'Mobile development',
      'Data Science',
      'Cybersecurity',
      'DevOps',
      'UI/UX design',
      'Testing (QA)',
      '1C',
    ],
  },
  {
    name: 'Sports and outdoor activities',
    children: [
      'Fitness',
      'Running and triathlon',
      'Team sports',
      'Martial arts',
      'Dance',
      'Extreme sports',
      'Swimming',
      'Winter sports',
    ],
  },
];
