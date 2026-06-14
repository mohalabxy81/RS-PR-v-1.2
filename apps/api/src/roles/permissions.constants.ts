// All system permissions in the platform.
// These are seeded into the database on startup.
// Permissions follow the pattern: action:resource

export const PERMISSIONS = {
  // Leads
  CREATE_LEAD: 'create:lead',
  READ_LEAD: 'read:lead',
  UPDATE_LEAD: 'update:lead',
  DELETE_LEAD: 'delete:lead',
  ASSIGN_LEAD: 'assign:lead',
  EXPORT_LEAD: 'export:lead',
  IMPORT_LEAD: 'import:lead',

  // Customers
  CREATE_CUSTOMER: 'create:customer',
  READ_CUSTOMER: 'read:customer',
  UPDATE_CUSTOMER: 'update:customer',
  DELETE_CUSTOMER: 'delete:customer',

  // Properties
  CREATE_PROPERTY: 'create:property',
  READ_PROPERTY: 'read:property',
  UPDATE_PROPERTY: 'update:property',
  DELETE_PROPERTY: 'delete:property',
  PUBLISH_PROPERTY: 'publish:property',

  // Deals
  CREATE_DEAL: 'create:deal',
  READ_DEAL: 'read:deal',
  UPDATE_DEAL: 'update:deal',
  DELETE_DEAL: 'delete:deal',

  // Appointments
  CREATE_APPOINTMENT: 'create:appointment',
  READ_APPOINTMENT: 'read:appointment',
  UPDATE_APPOINTMENT: 'update:appointment',
  DELETE_APPOINTMENT: 'delete:appointment',

  // Tasks
  CREATE_TASK: 'create:task',
  READ_TASK: 'read:task',
  UPDATE_TASK: 'update:task',
  DELETE_TASK: 'delete:task',

  // Users
  CREATE_USER: 'create:user',
  READ_USER: 'read:user',
  UPDATE_USER: 'update:user',
  DELETE_USER: 'delete:user',

  // Branches
  CREATE_BRANCH: 'create:branch',
  READ_BRANCH: 'read:branch',
  UPDATE_BRANCH: 'update:branch',
  DELETE_BRANCH: 'delete:branch',

  // Roles
  CREATE_ROLE: 'create:role',
  READ_ROLE: 'read:role',
  UPDATE_ROLE: 'update:role',
  DELETE_ROLE: 'delete:role',

  // Reports
  VIEW_REPORTS: 'view:reports',
  EXPORT_REPORTS: 'export:reports',

  // Audit Logs
  VIEW_AUDIT_LOGS: 'view:audit_logs',

  // Settings
  MANAGE_SETTINGS: 'manage:settings',
  MANAGE_BILLING: 'manage:billing',

  // Files
  UPLOAD_FILE: 'upload:file',
  DELETE_FILE: 'delete:file',
} as const;

export type PermissionAction = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Role-permission mappings for default system roles
export const ROLE_PERMISSIONS: Record<string, PermissionAction[]> = {
  'Company Owner': Object.values(PERMISSIONS),

  'Branch Manager': [
    PERMISSIONS.CREATE_LEAD, PERMISSIONS.READ_LEAD, PERMISSIONS.UPDATE_LEAD,
    PERMISSIONS.ASSIGN_LEAD, PERMISSIONS.EXPORT_LEAD, PERMISSIONS.IMPORT_LEAD,
    PERMISSIONS.CREATE_CUSTOMER, PERMISSIONS.READ_CUSTOMER, PERMISSIONS.UPDATE_CUSTOMER,
    PERMISSIONS.CREATE_PROPERTY, PERMISSIONS.READ_PROPERTY, PERMISSIONS.UPDATE_PROPERTY,
    PERMISSIONS.PUBLISH_PROPERTY,
    PERMISSIONS.CREATE_DEAL, PERMISSIONS.READ_DEAL, PERMISSIONS.UPDATE_DEAL,
    PERMISSIONS.CREATE_APPOINTMENT, PERMISSIONS.READ_APPOINTMENT, PERMISSIONS.UPDATE_APPOINTMENT,
    PERMISSIONS.CREATE_TASK, PERMISSIONS.READ_TASK, PERMISSIONS.UPDATE_TASK,
    PERMISSIONS.READ_USER, PERMISSIONS.CREATE_USER, PERMISSIONS.UPDATE_USER,
    PERMISSIONS.READ_BRANCH,
    PERMISSIONS.READ_ROLE,
    PERMISSIONS.VIEW_REPORTS, PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.UPLOAD_FILE,
  ],

  'Agent': [
    PERMISSIONS.CREATE_LEAD, PERMISSIONS.READ_LEAD, PERMISSIONS.UPDATE_LEAD,
    PERMISSIONS.ASSIGN_LEAD,
    PERMISSIONS.CREATE_CUSTOMER, PERMISSIONS.READ_CUSTOMER, PERMISSIONS.UPDATE_CUSTOMER,
    PERMISSIONS.READ_PROPERTY, PERMISSIONS.UPDATE_PROPERTY,
    PERMISSIONS.CREATE_DEAL, PERMISSIONS.READ_DEAL, PERMISSIONS.UPDATE_DEAL,
    PERMISSIONS.CREATE_APPOINTMENT, PERMISSIONS.READ_APPOINTMENT, PERMISSIONS.UPDATE_APPOINTMENT,
    PERMISSIONS.CREATE_TASK, PERMISSIONS.READ_TASK, PERMISSIONS.UPDATE_TASK,
    PERMISSIONS.UPLOAD_FILE,
  ],

  'Read Only': [
    PERMISSIONS.READ_LEAD,
    PERMISSIONS.READ_CUSTOMER,
    PERMISSIONS.READ_PROPERTY,
    PERMISSIONS.READ_DEAL,
    PERMISSIONS.READ_APPOINTMENT,
    PERMISSIONS.READ_TASK,
  ],
};
