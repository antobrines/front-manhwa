import { Manhwa } from './manhwa';

export interface ManhwaList {
  count: number;
  page: number;
  limit: string;
  manhwas: Manhwa[];
}
