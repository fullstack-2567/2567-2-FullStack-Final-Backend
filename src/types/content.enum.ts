export const contentCategoriesArray = [
  'cybersecurity',
  'frontend_development',
  'backend_development',
  'fullstack_development',
  'food',
  'fashion',
  'language',
] as const;
export type ContentCategory = (typeof contentCategoriesArray)[number];
