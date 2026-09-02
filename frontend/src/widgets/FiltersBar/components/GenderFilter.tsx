import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { selectGender, setGenderFilter } from '@/features/filters/slice';
import type { GenderFilter as GenderFilterType } from '@/features/filters/slice';
import { Radio, RadioGroup } from '@/shared/ui';

const OPTIONS = [
  { value: 'any', label: "Doesn't matter" },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
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
      label="Author's gender" 
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