export const userPrefixesArray = ['master', 'miss', 'mr', 'mrs', 'ms'] as const;
export type UserPrefix = (typeof userPrefixesArray)[number];

export const educationLevelsArray = [
  'elementary',
  'secondary',
  'bachelor',
  'master',
  'doctoral',
  'vocational_certificate',
  'high_vocational_certificate',
] as const;
export type EducationLevel = (typeof educationLevelsArray)[number];

export const userRolesArray = ['admin', 'user', 'project-approver'] as const;
export type UserRole = (typeof userRolesArray)[number];

export const userSexesArray = ['male', 'female', 'other'] as const;
export type UserSex = (typeof userSexesArray)[number];
