import { Manhwa } from './manhwa';
import { ManhwaInfo } from './manhwa-info';

export interface LibrairyInfo {
  name: string;
  slug?: string;
  user: string;
  isRemovable: boolean;
  manhwasPersonnal: ManhwaInfo[];
  _id: string;
}
