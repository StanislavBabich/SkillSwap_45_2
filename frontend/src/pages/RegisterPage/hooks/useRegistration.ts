import { useState, useCallback } from 'react';
import type { EntityId } from '@/entities/base';

export interface RegistrationData {
  email: string;
  password: string;
  avatarSeed?: string | null;
  name: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  cityId?: EntityId;
  about?: string;
  selectedCategoryIds: EntityId[];
  teachSkill: {
    name: string;
    categoryId: EntityId;
    subcategoryId: EntityId;
    description: string;
    images: File[];
  };
}

export type Step1Data = Pick<RegistrationData, 'email' | 'password'>;
export type Step2Data = Pick<RegistrationData, 'avatarSeed' | 'name' | 'dateOfBirth' | 'gender' | 'cityId' | 'about' | 'selectedCategoryIds'>;
export type Step3Data = Pick<RegistrationData, 'teachSkill'>;

export interface StepProps {
  data: RegistrationData;
  onUpdate: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack?: () => void;
}

interface UseRegistrationReturn {
  currentStep: number;
  data: RegistrationData;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateData: (newData: Partial<RegistrationData>) => void;
  resetData: () => void;
  isStepValid: () => boolean;
}

const TOTAL_STEPS = 3;

const initialData: RegistrationData = {
  email: '',
  password: '',
  avatarSeed: null,
  name: '',
  selectedCategoryIds: [],
  teachSkill: {
    name: '',
    categoryId: '',
    subcategoryId: '',
    description: '',
    images: [],
  },
};

export const useRegistration = (): UseRegistrationReturn => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [data, setData] = useState<RegistrationData>(initialData);

  const nextStep = useCallback(() => setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS)), []);
  const prevStep = useCallback(() => setCurrentStep((prev) => Math.max(prev - 1, 1)), []);
  const goToStep = useCallback((step: number) => setCurrentStep(Math.max(1, Math.min(step, TOTAL_STEPS))), []);

  const updateData = useCallback((newData: Partial<RegistrationData>) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  }, []);

  const resetData = useCallback(() => {
    setData(initialData);
    setCurrentStep(1);
  }, []);

  const isStepValid = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        return !!(data.email && data.password && data.password.length >= 8);
      case 2:
        return !!(data.name && data.selectedCategoryIds.length > 0);
      case 3:
        return !!(data.teachSkill.name && data.teachSkill.categoryId && data.teachSkill.subcategoryId);
      default:
        return true;
    }
  }, [currentStep, data]);

  return { currentStep, data, nextStep, prevStep, goToStep, updateData, resetData, isStepValid };
};

export default useRegistration;