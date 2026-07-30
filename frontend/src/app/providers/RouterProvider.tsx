import { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '../router';
import { initializeCategories } from '@/features/categories/slice.ts';
import { initializeCities } from '@/features/cities/slice.ts';
import { initializeSkills } from '@/features/skills/slice.ts';
import { initializeUsers } from '@/features/users/slice.ts';
import { useAppDispatch } from '@/app/store/hooks.ts';

export const RouterProvider = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(initializeUsers());
    void dispatch(initializeSkills());
    void dispatch(initializeCities());
    void dispatch(initializeCategories());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Загрузка...</div>}>
        <AppRouter />
      </Suspense>
    </BrowserRouter>
  );
};
