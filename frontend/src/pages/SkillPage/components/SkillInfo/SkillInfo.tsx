import type { EntityId } from '@/entities/base';
import type { Skill } from '@/entities/skill/types';
import { Headline } from '@/shared/ui';
import { ActionButtons } from '../ActionButtons/ActionButtons';
import SkillGallery from '../SkillGallery';
import { ExchangeButton } from '../ExchangeButton/ExchangeButton';

import style from './SkillInfo.module.css';

type SkillInfoProps = {
  skillId: EntityId;
  skill: Skill;
  onExchangeClick: () => void;
  onIncomingClick?: () => void;
};

export const SkillInfo = ({ skillId, skill, onExchangeClick, onIncomingClick }: SkillInfoProps) => {
  const category = skill.category?.name ?? '';

  return (
    <div className={style.content}>
      <div className={style.header}>
        <ActionButtons skillId={skillId} />
      </div>

      <div className={style.body}>
        <div className={style.info}>
          <div className={style.text}>
            <Headline level={1}>{skill.title}</Headline>
            {category && <p className={style.category}>{category}</p>}
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