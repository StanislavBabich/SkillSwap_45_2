import { useState, type FormEvent } from 'react';
import clsx from 'clsx';
import type { Gender } from '@/entities/base';
import { Button } from '@/shared/ui/Button';
import { DatePicker } from '@/shared/ui/DatePicker/DatePicker';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Icon } from '@/shared/ui/Icon';
import { DropDownCity } from '@/shared/ui/DropDownCity';
import type { City } from '@/entities/city/types';
import styles from './ProfileForm.module.css';

export interface ProfileFormState {
  email: string;
  name: string;
  password: string;
  dateOfBirth: string;
  gender: Gender;
  city: string;
  about: string;
  avatarSeed: string | null;
}

export interface ProfileFormErrors {
  name?: string;
  password?: string;
}

interface ProfileFormProps {
  data: ProfileFormState;
  cities: City[];
  errors: ProfileFormErrors;
  isSaveDisabled: boolean;
  isSaving: boolean;
  saveError: string | null;
  onChange: (patch: Partial<ProfileFormState>) => void;
  onCitySearch: (search: string) => void;
  onSave: () => void;
}

export const ProfileForm = ({
  data,
  cities,
  errors,
  isSaveDisabled,
  isSaving,
  saveError,
  onChange,
  onCitySearch,
  onSave,
}: ProfileFormProps) => {
  const [isPasswordInputVisible, setIsPasswordInputVisible] = useState(false);
  const editAdornment = <Icon name="edit" size={20} className={styles.editIcon} aria-hidden="true" />;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.emailPasswordGroup}>
        <Input
          type="email"
          label="Почта"
          value={data.email}
          readOnly
          hideHelper
          endAdornment={editAdornment}
        />

        <button
          type="button"
          className={styles.changePasswordButton}
          aria-expanded={isPasswordInputVisible}
          aria-controls="profile-password-field"
          onClick={() => setIsPasswordInputVisible(true)}
        >
          Изменить пароль
        </button>
      </div>

      {isPasswordInputVisible ? (
        <Input
          id="profile-password-field"
          type="password"
          label="Пароль"
          placeholder="Введите новый пароль"
          value={data.password}
          onChange={(event) => onChange({ password: event.target.value })}
          error={errors.password}
          helperText="Оставьте пустым, если не хотите менять пароль"
        />
      ) : null}

      <Input
        label="Имя"
        value={data.name}
        onChange={(event) => onChange({ name: event.target.value })}
        error={errors.name}
        hideHelper
        endAdornment={editAdornment}
      />

      <div className={styles.row}>
        <DatePicker
          className={clsx(styles.rowField, styles.dateField)}
          inputClassName={styles.rowField}
          label="Дата рождения"
          value={data.dateOfBirth}
          onChange={(value) => onChange({ dateOfBirth: value })}
          placeholder="дд.мм.гггг"
        />

        <Select
          size="short"
          className={styles.rowField}
          labelClassName={styles.selectFieldLabel}
          triggerClassName={styles.selectFieldTrigger}
          valueClassName={styles.compactFieldValue}
          label="Пол"
          value={data.gender}
          onChange={(value) => onChange({ gender: value as Gender })}
          options={[
            { value: 'male', label: 'Мужской' },
            { value: 'female', label: 'Женский' },
            { value: 'other', label: 'Другое' },
          ]}
        />
      </div>

      <DropDownCity
        label="Город"
        value={data.city}
        onChange={(city) => onChange({ city })}
        onSearch={onCitySearch}
        options={[
          ...(data.city && !cities.some((city) => city.name === data.city)
            ? [{ value: data.city, label: data.city }]
            : []),
          ...cities.map((city) => ({ value: city.name, label: city.name })),
        ]}
        placeholder="Не указан"
        minSearchLength={1}
        maxResults={50}
      />

      <div className={styles.textareaGroup}>
        <label htmlFor="profile-about" className={styles.label}>
          О себе
        </label>
        <div className={styles.textareaWrapper}>
          <textarea
            id="profile-about"
            className={styles.textarea}
            value={data.about}
            onChange={(event) => onChange({ about: event.target.value })}
            rows={6}
          />
          <span className={styles.textareaEdit} aria-hidden="true">
            <Icon name="edit" size={20} className={styles.editIcon} />
          </span>
        </div>
      </div>

      {saveError ? (
        <p className={styles.saveError} role="alert" aria-live="polite">
          {saveError}
        </p>
      ) : null}

      <Button
        type="submit"
        fullWidth
        className={styles.saveButton}
        disabled={isSaveDisabled}
        isLoading={isSaving}
      >
        Сохранить
      </Button>
    </form>
  );
};
