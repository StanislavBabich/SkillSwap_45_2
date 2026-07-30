import { useMemo } from 'react';

import type { EntityId } from '@/entities/base';
import { useAppSelector } from '@/app/store/hooks';
import { selectSkillWithDetails } from '@/features/skills/selectors';
import { Headline } from '@/shared/ui';
import { ActionButtons } from '../ActionButtons/ActionButtons';
import SkillGallery from '../SkillGallery';
import { ExchangeButton } from '../ExchangeButton/ExchangeButton';

import style from './SkillInfo.module.css';

type SkillInfoProps = {
  skillId: EntityId;
  onExchangeClick: () => void;
  onIncomingClick?: () => void; // Добавляем обработчик для входящих заявок
};

export const SkillInfo = ({ skillId, onExchangeClick, onIncomingClick }: SkillInfoProps) => {
  const skillSelector = useMemo(() => selectSkillWithDetails(skillId), [skillId]);
  const skill = useAppSelector(skillSelector);

  if (!skill) return null;

  const category = [skill.category?.name, skill.subcategory?.name].filter(Boolean).join(' / ');

  return (
    <div className={style.content}>
      <div className={style.header}>
        <ActionButtons skillId={skillId} />
      </div>

      <div className={style.body}>
        <div className={style.info}>
          <div className={style.text}>
            <Headline level={1}>{skill.name}</Headline>
            <p className={style.category}>{category}</p>
            <p className={style.description}>{skill.description}</p>
          </div>

          <ExchangeButton
            skillId={skillId}
            onClick={onIncomingClick || onExchangeClick}
          />
        </div>

        <div className={style.right}>
          <SkillGallery images={skill.images ?? []} />
        </div>
      </div>
    </div>
  );
};