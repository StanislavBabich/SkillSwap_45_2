import { useAppSelector } from '@/app/store/hooks';
import { selectHasAnyFilters } from '@/features/filters/selectors';

export const useSidebarMode = (): 'sections' | 'single' => {
  const hasAnyFilters = useAppSelector(selectHasAnyFilters);

  if (!hasAnyFilters) {
    return 'sections';
  }

  return 'single';
};
