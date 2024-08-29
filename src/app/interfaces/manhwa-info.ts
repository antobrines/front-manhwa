import { Manhwa } from './manhwa';

export interface ManhwaInfo {
  user: any;
  manhwa: Manhwa;
  _id: string;
  nbChapterViewed?: number;
  url?: string;
}
