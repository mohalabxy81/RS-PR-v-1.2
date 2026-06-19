import { SetMetadata } from '@nestjs/common';

export const OWNERSHIP_KEY = 'ownership';

export interface OwnershipMetadata {
  resourceType: 'Lead' | 'Deal' | 'Property' | 'Customer' | 'Task' | 'Appointment';
  resourceParamKey: string; // The route param key, e.g., 'id'
}

export const EnforceOwnership = (resourceType: OwnershipMetadata['resourceType'], resourceParamKey = 'id') => 
  SetMetadata(OWNERSHIP_KEY, { resourceType, resourceParamKey });
