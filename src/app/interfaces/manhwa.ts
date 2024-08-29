export interface Manhwa {
  _id: string;
  id: string;
  title: string;
  title_en: string;
  slug: string;
  coverImage?: string;
  image?: string;
  smallImage?: string;
  description: string;
  description_fr: string;
  synopsis: string;
  endDate: Date;
  startDate: Date;
  nameTranslate?: string;
  type: string;
  status: string;
}
