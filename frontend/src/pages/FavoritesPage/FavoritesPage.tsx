import { useAppSelector } from '@/app/store/hooks';
import type { EntityId } from '@/entities/base';
import { selectFavoriteSkills } from '@/features/skills/selectors';
import { Button, Headline } from '@/shared/ui';
import { SkillCard } from '@/widgets/SkillCard';
import { useNavigate } from 'react-router-dom';
import styles from './FavoritesPage.module.css';
import illustration from '../../assets/school-board.svg';

export const FavoritesPage = () => {
  const navigate = useNavigate();

  const favoriteSkills = useAppSelector(selectFavoriteSkills);
  const favoritesCount = favoriteSkills.length;

  const handleGoToCatalog = () => {
    navigate('/');
  };

  const handleSkillClick = (skillId: EntityId) => {
    navigate(`/skill/${skillId}`)
  }

  return (
    <div className={styles.page}>
      <div className={styles.title}>
        <Headline level={1}>
          Избранное: <span>{favoritesCount}</span>
        </Headline>
      </div>
      {favoritesCount === 0 ? (
        <div className={styles.container}>
        <img src={illustration} alt="Нет избранных навыков" className={styles.images} />
        <p className={styles.text}>У вас нет избранных навыков. Добавьте понравившиеся навыки</p>
        <Button variant="primary" size="large" onClick={handleGoToCatalog}>
          Перейти к каталогу
        </Button>
      </div>
      ): (
        <div className={styles.grid}>
        {favoriteSkills.map((skill) => (
          <SkillCard key={skill.id} skillId={skill.id} variant="default" onClick={handleSkillClick}/>
        ))}
      </div>
      )}

    </div>
  );
};
