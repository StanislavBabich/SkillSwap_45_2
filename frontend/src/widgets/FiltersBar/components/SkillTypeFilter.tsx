import { RadioGroup } from '@/shared/ui/RadioGroup';
import { Radio } from '@/shared/ui/Radio';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setSkillTypeFilter, selectSkillType } from '@/features/filters/slice';
import type { SkillType } from '@/entities/skill/types';

export const SkillTypeFilter = () => {
  const dispatch = useAppDispatch();
  const skillType = useAppSelector(selectSkillType);

  const handleChange = (value: string) => {
    dispatch(setSkillTypeFilter(value as SkillType));
  };

  return (
    <RadioGroup 
      name="skillType" 
      value={skillType} 
      onChange={handleChange} 
      orientation="vertical"
    >
      <Radio value="all">
        Все
      </Radio>
      <Radio value="learn">
        Хочу научиться
      </Radio>
      <Radio value="teach">
        Могу научить
      </Radio>
    </RadioGroup>
  );
};