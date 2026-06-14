const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'apps/api/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

schema = schema.replace('  tenantConfigurations      TenantConfiguration[]\n}', `  tenantConfigurations      TenantConfiguration[]

  // Enterprise Phase 6
  enterpriseOrganization    EnterpriseOrganization?
}`);

const phase6Models = `
// ─────────────────────────────────────────────
// ENTERPRISE EDITION: PHASE 6
// ─────────────────────────────────────────────

model EnterpriseOrganization {
  id              String   @id @default(uuid())
  tenantId        String   @unique
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name            String
  type            String   // HOLDING, SUBSIDIARY, FRANCHISE, REGIONAL
  parentId        String?
  parent          EnterpriseOrganization? @relation("OrgHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  children        EnterpriseOrganization[] @relation("OrgHierarchy")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  hierarchies     EnterpriseHierarchy[]
  regions         EnterpriseRegion[]
  departments     EnterpriseDepartment[]
  businessUnits   EnterpriseBusinessUnit[]
  policies        EnterprisePolicy[]
  workflows       EnterpriseWorkflow[]
  integrations    EnterpriseIntegration[]
  securityEvents  EnterpriseSecurityEvent[]
  ssoProviders    EnterpriseSsoProvider[]
  administrators  EnterpriseAdministrator[]
  incidents       EnterpriseIncident[]
}

model EnterpriseHierarchy {
  id              String   @id @default(uuid())
  organizationId  String
  organization    EnterpriseOrganization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  name            String
  description     String?
  level           Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
}

model EnterpriseRegion {
  id              String   @id @default(uuid())
  organizationId  String
  organization    EnterpriseOrganization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  name            String
  code            String
  timezone        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
}

model EnterpriseDepartment {
  id              String   @id @default(uuid())
  organizationId  String
  organization    EnterpriseOrganization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  name            String
  costCenter      String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
}

model EnterpriseBusinessUnit {
  id              String   @id @default(uuid())
  organizationId  String
  organization    EnterpriseOrganization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  name            String
  code            String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
}

model EnterprisePolicy {
  id              String   @id @default(uuid())
  organizationId  String
  organization    EnterpriseOrganization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  name            String
  type            String   // ACCESS, DATA, RETENTION, SECURITY
  rules           Json
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  governanceRules EnterpriseGovernanceRule[]
  
  @@index([organizationId])
}

model EnterpriseGovernanceRule {
  id              String   @id @default(uuid())
  policyId        String
  policy          EnterprisePolicy @relation(fields: [policyId], references: [id], onDelete: Cascade)
  name            String
  condition       Json
  action          String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([policyId])
}

model EnterpriseWorkflow {
  id              String   @id @default(uuid())
  organizationId  String
  organization    EnterpriseOrganization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  name            String
  entityType      String   // DEAL, PROPERTY, USER
  triggerType     String   // MANUAL, AUTO
  steps           Json     // Array of step definitions
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  approvals       EnterpriseApproval[]
  
  @@index([organizationId])
}

model EnterpriseApproval {
  id              String   @id @default(uuid())
  workflowId      String
  workflow        EnterpriseWorkflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  entityId        String
  status          String   // PENDING, APPROVED, REJECTED, ESCALATED
  currentStep     Int      @default(0)
  history         Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([workflowId])
}

model EnterpriseIntegration {
  id              String   @id @default(uuid())
  organizationId  String
  organization    EnterpriseOrganization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  name            String
  type            String   // INBOUND, OUTBOUND, SYNC
  config          Json
  status          String   // ACTIVE, ERROR, INACTIVE
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  connectors      EnterpriseConnector[]
  
  @@index([organizationId])
}

model EnterpriseConnector {
  id              String   @id @default(uuid())
  integrationId   String
  integration     EnterpriseIntegration @relation(fields: [integrationId], references: [id], onDelete: Cascade)
  provider        String   // SAP, WORKDAY, SALESFORCE
  credentials     Json
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([integrationId])
}

model EnterpriseSecurityEvent {
  id              String   @id @default(uuid())
  organizationId  String
  organization    EnterpriseOrganization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  eventType       String   // LOGIN_FAILED, UNAUTHORIZED_ACCESS
  severity        String   // LOW, MEDIUM, HIGH, CRITICAL
  details         Json
  sourceIp        String?
  createdAt       DateTime @default(now())
  
  @@index([organizationId])
}

model EnterpriseRiskEvent {
  id              String   @id @default(uuid())
  organizationId  String
  score           Float
  description     String
  entityType      String
  entityId        String
  createdAt       DateTime @default(now())
  
  @@index([organizationId])
}

model EnterpriseComplianceRecord {
  id              String   @id @default(uuid())
  organizationId  String
  type            String   // CONSENT, AUDIT, PRIVACY
  subjectId       String
  evidence        Json
  createdAt       DateTime @default(now())
  
  @@index([organizationId])
}

model EnterpriseRetentionPolicy {
  id              String   @id @default(uuid())
  organizationId  String
  entityType      String
  retentionDays   Int
  action          String   // ARCHIVE, DELETE
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
}

model EnterpriseSsoProvider {
  id              String   @id @default(uuid())
  organizationId  String
  organization    EnterpriseOrganization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  type            String   // SAML, OIDC, OAUTH
  metadataUrl     String?
  clientId        String?
  clientSecret    String?
  domains         String[]
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
}

model EnterpriseAccessReview {
  id              String   @id @default(uuid())
  organizationId  String
  campaignName    String
  reviewerId      String
  status          String   // DRAFT, ACTIVE, COMPLETED
  deadline        DateTime
  results         Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
}

model EnterpriseAuditExport {
  id              String   @id @default(uuid())
  organizationId  String
  format          String   // CSV, JSON, PDF
  status          String   // PENDING, PROCESSING, COMPLETED, FAILED
  url             String?
  query           Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
}

model EnterpriseDataExport {
  id              String   @id @default(uuid())
  organizationId  String
  entityType      String
  format          String
  status          String
  url             String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
}

model EnterpriseAdministrator {
  id              String   @id @default(uuid())
  organizationId  String
  organization    EnterpriseOrganization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  userId          String
  role            String   // SUPER_ADMIN, COMPLIANCE_ADMIN, SECURITY_ADMIN
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
}

model EnterpriseReport {
  id              String   @id @default(uuid())
  organizationId  String
  name            String
  type            String   // EXECUTIVE, OPERATIONAL, COMPLIANCE
  config          Json
  schedule        String?  // Cron expression
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
}

model EnterpriseIncident {
  id              String   @id @default(uuid())
  organizationId  String
  organization    EnterpriseOrganization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  title           String
  description     String
  severity        String   // SEV1, SEV2, SEV3
  status          String   // OPEN, INVESTIGATING, RESOLVED
  resolvedAt      DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
}
`;

schema += phase6Models;

fs.writeFileSync(schemaPath, schema);
console.log('Phase 6 schema updated successfully.');
