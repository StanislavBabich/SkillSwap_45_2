import type { EntityId } from '@/entities/base.ts';

export interface City {
  id: EntityId;
  name: string;
}

export type CitiesResponse = City[];
