export const sdgTypesArray = [
  'SDG1',
  'SDG2',
  'SDG3',
  'SDG4',
  'SDG5',
  'SDG6',
  'SDG7',
  'SDG8',
  'SDG9',
  'SDG10',
  'SDG11',
  'SDG12',
  'SDG13',
  'SDG14',
  'SDG15',
  'SDG16',
  'SDG17',
] as const;
export type SDGType = (typeof sdgTypesArray)[number];

export const projectTypesArray = [
  'energy_and_environment',
  'construction_and_infrastructure',
  'agriculture_and_food',
  'materials_and_minerals',
  'finance_and_investment',
  'technology_and_innovation',
  'medicine_and_health',
  'human_resource_development',
  'manufacturing_and_automotive',
  'electronics_and_retail',
  'real_estate_and_urban_development',
  'media_and_entertainment',
  'tourism_and_services',
  'society_and_community',
] as const;
export type ProjectType = (typeof projectTypesArray)[number];

export const projectUpdateActionsArray = ['approve', 'reject'] as const;
export type ProjectUpdateAction = (typeof projectUpdateActionsArray)[number];

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
