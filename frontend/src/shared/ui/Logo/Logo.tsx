import React from 'react';
import styles from './Logo.module.css';
import { Link } from 'react-router-dom';
import logoIcon from '../../../assets/logo.svg';

interface LogoProps {
  isLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ isLink = false }) => {
  const logoContent = (
    <div className={styles.logo}>
      <img
        src={logoIcon}
        alt="SkillSwap Logo"
        className={styles.logoIcon}
      />
      <span className={styles.logoText}>SkillSwap</span>
    </div>
  );

  return isLink ? <Link to="/">{logoContent}</Link> : logoContent;
};

