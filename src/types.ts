export type AppState =
  | 'SPLASH'
  | 'AUTH'
  | 'ROLE_SELECTION'
  | 'LANDING'
  | 'REQUEST'
  | 'TRACKING'
  | 'CHARGING'
  | 'PAYMENT'
  | 'SUCCESS'
  | 'HISTORY'
  | 'TECHNOLOGY'
  | 'HOW_IT_WORKS'
  | 'ACCOUNT'
  | 'ADMIN_DASHBOARD';

export interface EnergyOption {
  id: string;
  label: string;
  value: number | 'auto';
  unit: string;
}
