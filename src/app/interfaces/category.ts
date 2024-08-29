export interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
  nsfw?: boolean;
  nameTranslate?: string;
  format?: string;
}
