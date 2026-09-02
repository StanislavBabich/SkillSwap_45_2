import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import type { EntityId } from '@/entities/base';
import { initializeFavoriteSkills, selectFavoriteSkillsStatus } from '@/features/favorites/slice';
import { selectFavoriteSkills } from '@/features/skills/selectors';
import { Button, Headline } from '@/shared/ui';
import { SkillCard } from '@/widgets/SkillCard';
import { useNavigate } from 'react-router-dom';
import styles from './FavoritesPage.module.css';
import illustration from '../../assets/school-board.svg';

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const favoriteSkills = useAppSelector(selectFavoriteSkills);
  const status = useAppSelector(selectFavoriteSkillsStatus);
  const favoritesCount = favoriteSkills.length;

  useEffect(() => {
    void dispatch(initializeFavoriteSkills());
  }, [dispatch]);

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
          Favorites: <span>{favoritesCount}</span>
        </Headline>
      </div>
      {status === 'loading' ? (
        <p className={styles.text}>Loading favorites...</p>
      ) : favoritesCount === 0 ? (
        <div className={styles.container}>
        <img src={illustration} alt="No favorite skills" className={styles.images} />
        <p className={styles.text}>You have no favorite skills. Add skills you like</p>
        <Button variant="primary" size="large" onClick={handleGoToCatalog}>
          Go to catalog
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
