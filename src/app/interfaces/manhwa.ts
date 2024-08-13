export interface Manhwa {
  _id: string;
  id: number;
  title: string;
  slug: string;
  coverImage?: string;
  image: string;
  description: string;
  synopsis: string;
  endDate: Date;
  startDate: Date;
  nameTranslate?: string;
}
