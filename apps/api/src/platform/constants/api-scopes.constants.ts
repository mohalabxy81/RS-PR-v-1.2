/**
 * Canonical registry of all allowed API Key scopes.
 * Security Requirement: API Keys MUST NOT use wildcard (*) scopes.
 * All scopes must be explicitly requested and verified against this registry.
 */
export const API_SCOPES = [
  'leads:read',
  'leads:write',
  'properties:read',
  'properties:write',
  'deals:read',
  'deals:write',
  'customers:read',
  'customers:write',
  'reports:read',
  'webhooks:manage',
  'marketplace:manage',
] as const;

export type ApiScope = (typeof API_SCOPES)[number];

/**
 * Validates that all requested scopes are present in the canonical registry.
 * @param requestedScopes Array of scope strings to validate
 * @returns boolean True if all scopes are valid
 */
export function validateScopes(requestedScopes: string[]): boolean {
  if (!requestedScopes || requestedScopes.length === 0) return true; // Empty scopes is technically valid but useless
  
  // Explicitly deny wildcard
  if (requestedScopes.includes('*')) {
    return false;
  }

  return requestedScopes.every((scope) => API_SCOPES.includes(scope as ApiScope));
}
