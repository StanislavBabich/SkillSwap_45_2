import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';

export type Gender = 'male' | 'female' | 'other';

export interface UseAvatarProps {
  email: string;
  gender?: Gender;
  size?: number;
  /** Сохранённый seed с регистрации — если есть, используется для стабильного аватара */
  avatarSeed?: string | null;
}

// Функция для преобразования email в seed 
const emailToSeed = (email: string): string => {
  const localPart = email.split('@')[0];
  let hash = 0;
  for (let i = 0; i < localPart.length; i++) {
    hash = ((hash << 5) - hash) + localPart.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

export const useAvatar = ({
  email,
  gender = 'other',
  size = 56,
  avatarSeed,
}: UseAvatarProps) => {
  const avatarUrl = useMemo(() => {
    try {
      const normalizedSeed =
        typeof avatarSeed === 'string' && avatarSeed.trim().length > 0 ? avatarSeed : null;
      const seed = normalizedSeed ?? emailToSeed(email);

      // Базовые настройки для всех
      const baseOptions = {
        seed,
        size,
        radius: 50,
        backgroundColor: ['#DEEBC5', '#EBE5C5'],
        skinColor: ['f2d3b1', 'ecad80'],
      };

      // Добавляем настройки в зависимости от пола
      let genderOptions = {};
      if (gender === 'female') {
        genderOptions = {
          hair: ['long06', 'long07', 'long08', 'long09', 'long11', 'long12', 'long13', 'long16', 'long18', 'long19'],
          mouth: ['variant01', 'variant02', 'variant05', 'variant06', 'variant10', 'variant12', 'variant17', 'variant18', 'variant19'],
          earrings: ['variant01', 'variant02'], 
          earringsProbability: 30,
        };
      } else if (gender === 'male') {
        genderOptions = {
          hair: ['short16', 'short15', 'short14', 'short13', 'short12', 'short10', 'short09', 'short08', 'short07', 'short06', 'short04', 'short03', 'long26', 'short01', 'short02'],
          mouth: ['variant02', 'variant01', 'variant10', 'variant29'],
          beard: ['variant01', 'variant02', 'variant03'],
          beardProbability: 20,
        };
      } else {
        genderOptions = {
          // Оставляем без явных указаний, чтобы использовались случайные значения библиотеки
          // или можно задать свой нейтральный набор
        };
      }

      const avatar = createAvatar(adventurer, {
        ...baseOptions,
        ...genderOptions,
      });

      return avatar.toDataUri();
    } catch (error) {
      console.error('Error generating avatar:', error);
      const initials = email.charAt(0).toUpperCase();
      return `https://ui-avatars.com/api/?name=${initials}&background=random&size=${size}`;
    }
  }, [email, gender, size, avatarSeed]);

  return avatarUrl;
};
