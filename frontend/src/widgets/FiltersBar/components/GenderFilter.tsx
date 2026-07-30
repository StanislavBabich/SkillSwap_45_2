import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { selectGender, setGenderFilter } from '@/features/filters/slice';
import type { GenderFilter as GenderFilterType } from '@/features/filters/slice';
import { Radio, RadioGroup } from '@/shared/ui';

const OPTIONS = [
  { value: 'any', label: 'Не имеет значения' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
];

export const GenderFilter = () => {
  const dispatch = useAppDispatch();
  const selectedGender = useAppSelector(selectGender);

  const handleChange = (value: string) => {
    dispatch(setGenderFilter(value as GenderFilterType));
  };

  return (
    <RadioGroup 
      name="gender" 
      label="Пол автора" 
      value={selectedGender} 
      onChange={handleChange}
      orientation="vertical" 
    >
      {OPTIONS.map((option) => (
        <Radio 
          key={option.value} 
          value={option.value}
        >
          {option.label}
        </Radio>
      ))}
    </RadioGroup>
  );
};