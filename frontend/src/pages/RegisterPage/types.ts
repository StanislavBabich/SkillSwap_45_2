export interface Step1Data {
  email: string;
  password: string;
}

export interface Step2Data {
  avatarSeed?: string | null;
  name: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  cityId?: number;
  about?: string;
  selectedCategories: number[];       
  selectedSubcategories: number[];    
}

export interface Step3Data {
  teachSkill: {
    name: string;
    categoryId: number;
    subcategoryId: number;
    description: string;
    images: File[];
  };
}

export interface RegistrationData extends Step1Data, Step2Data, Step3Data {}

export interface StepProps {
  data: RegistrationData;
  onUpdate: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}