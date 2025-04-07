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
