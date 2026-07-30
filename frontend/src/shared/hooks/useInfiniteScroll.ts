import { useState, useEffect, useCallback, useRef } from 'react';

export const INITIAL_VISIBLE_ITEMS = 21; //при первом рендере отображение 7 рядов по три карточки

interface UseInfiniteScrollProps<T> {
  items: T[];
  initialLimit?: number;
  step?: number;
}

export const useInfiniteScroll = <T>({
  items,
  initialLimit = INITIAL_VISIBLE_ITEMS,
  step = 21,
}: UseInfiniteScrollProps<T>) => {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  // Инициализация - показываем первые initialLimit элементов
  useEffect(() => {
    setDisplayedItems(items.slice(0, initialLimit));
    setHasMore(items.length > initialLimit);
  }, [items, initialLimit]);

  // Функция загрузки следующих элементов
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Имитируем задержку сети (можно убрать в реальном проекте)
    setTimeout(() => {
      setDisplayedItems(prev => {
        const nextItems = items.slice(0, prev.length + step);
        setHasMore(nextItems.length < items.length);
        return nextItems;
      });
      setIsLoading(false);
    }, 300);
  }, [items, isLoading, hasMore, step]);

  // Настройка Intersection Observer
  useEffect(() => {
    if (!lastElementRef.current || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observerRef.current.observe(lastElementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore]);

  return {
    displayedItems,
    hasMore,
    isLoading,
    lastElementRef,
  };
};