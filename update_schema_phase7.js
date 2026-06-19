const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'apps/api/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const phase7Models = `
// ─────────────────────────────────────────────
// PLATFORM ECOSYSTEM: PHASE 7
// ─────────────────────────────────────────────

model DeveloperAccount {
  id              String   @id @default(uuid())
  userId          String   @unique
  status          String   // PENDING, ACTIVE, SUSPENDED
  companyName     String?
  website         String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  organizations   DeveloperOrganization[]
  projects        DeveloperProject[]
  apiKeys         DeveloperApiKey[]
  oauthClients    DeveloperOAuthClient[]
}

model DeveloperOrganization {
  id              String   @id @default(uuid())
  ownerId         String
  owner           DeveloperAccount @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  name            String
  billingEmail    String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  teams           DeveloperTeam[]
  projects        DeveloperProject[]
}

model DeveloperTeam {
  id              String   @id @default(uuid())
  organizationId  String
  organization    DeveloperOrganization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  name            String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model DeveloperProject {
  id              String   @id @default(uuid())
  developerId     String
  developer       DeveloperAccount @relation(fields: [developerId], references: [id], onDelete: Cascade)
  organizationId  String?
  organization    DeveloperOrganization? @relation(fields: [organizationId], references: [id], onDelete: SetNull)
  name            String
  description     String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  applications    PlatformApp[]
  webhooks        WebhookEndpoint[]
}

model PlatformApp {
  id              String   @id @default(uuid())
  projectId       String
  project         DeveloperProject @relation(fields: [projectId], references: [id], onDelete: Cascade)
  name            String
  description     String?
  clientId        String   @unique
  clientSecret    String
  redirectUris    String[]
  scopes          String[]
  status          String   // DRAFT, IN_REVIEW, PUBLISHED, SUSPENDED
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  versions        PlatformAppVersion[]
  installations   PlatformAppInstallation[]
  reviews         PlatformAppReview[]
}

model PlatformAppVersion {
  id              String   @id @default(uuid())
  appId           String
  app             PlatformApp @relation(fields: [appId], references: [id], onDelete: Cascade)
  version         String
  changelog       String?
  status          String   // PENDING, APPROVED, REJECTED
  createdAt       DateTime @default(now())
}

model PlatformAppInstallation {
  id              String   @id @default(uuid())
  appId           String
  app             PlatformApp @relation(fields: [appId], references: [id], onDelete: Cascade)
  tenantId        String
  installedBy     String   // userId
  status          String   // ACTIVE, REVOKED
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model PlatformAppReview {
  id              String   @id @default(uuid())
  appId           String
  app             PlatformApp @relation(fields: [appId], references: [id], onDelete: Cascade)
  reviewerId      String   // userId
  rating          Int
  comment         String?
  createdAt       DateTime @default(now())
}

model DeveloperApiKey {
  id              String   @id @default(uuid())
  developerId     String
  developer       DeveloperAccount @relation(fields: [developerId], references: [id], onDelete: Cascade)
  key             String   @unique
  name            String
  scopes          String[]
  expiresAt       DateTime?
  lastUsedAt      DateTime?
  createdAt       DateTime @default(now())
}

model DeveloperOAuthClient {
  id              String   @id @default(uuid())
  developerId     String
  developer       DeveloperAccount @relation(fields: [developerId], references: [id], onDelete: Cascade)
  clientId        String   @unique
  clientSecret    String
  redirectUris    String[]
  name            String
  createdAt       DateTime @default(now())
}

model ApiProduct {
  id              String   @id @default(uuid())
  name            String
  description     String?
  status          String   // ACTIVE, DEPRECATED
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  plans           ApiPlan[]
}

model ApiPlan {
  id              String   @id @default(uuid())
  productId       String
  product         ApiProduct @relation(fields: [productId], references: [id], onDelete: Cascade)
  name            String
  type            String   // FREE, USAGE, SUBSCRIPTION, ENTERPRISE
  price           Float
  currency        String   @default("USD")
  quotaLimit      Int?
  rateLimit       Int?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  subscriptions   ApiSubscription[]
}

model ApiSubscription {
  id              String   @id @default(uuid())
  planId          String
  plan            ApiPlan  @relation(fields: [planId], references: [id], onDelete: Cascade)
  developerId     String
  status          String   // ACTIVE, CANCELED, PAST_DUE
  currentPeriodEnd DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model WebhookEndpoint {
  id              String   @id @default(uuid())
  projectId       String
  project         DeveloperProject @relation(fields: [projectId], references: [id], onDelete: Cascade)
  url             String
  secret          String?
  events          String[] // e.g., ["lead.created", "property.updated"]
  status          String   // ACTIVE, DISABLED
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  deliveries      WebhookDelivery[]
}

model WebhookDelivery {
  id              String   @id @default(uuid())
  endpointId      String
  endpoint        WebhookEndpoint @relation(fields: [endpointId], references: [id], onDelete: Cascade)
  eventId         String
  status          String   // SUCCESS, FAILED, RETRYING
  statusCode      Int?
  payload         Json
  response        Json?
  createdAt       DateTime @default(now())
}

model EventLog {
  id              String   @id @default(uuid())
  eventType       String
  entityId        String
  payload         Json
  source          String   // API, INTERNAL, SYSTEM
  createdAt       DateTime @default(now())
}

model PartnerAccount {
  id              String   @id @default(uuid())
  userId          String   @unique
  companyName     String
  partnerType     String   // TECHNOLOGY, INTEGRATION, AGENCY, RESELLER
  status          String   // PENDING, ACTIVE, SUSPENDED
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  programs        PartnerProgram[]
}

model PartnerProgram {
  id              String   @id @default(uuid())
  partnerId       String
  partner         PartnerAccount @relation(fields: [partnerId], references: [id], onDelete: Cascade)
  name            String
  commissionRate  Float
  status          String   // ACTIVE, INACTIVE
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
`;

// Only append if phase 7 models aren't already there
if (!schema.includes('DeveloperAccount')) {
  schema += phase7Models;
  fs.writeFileSync(schemaPath, schema);
  console.log('Phase 7 schema updated successfully.');
} else {
  console.log('Phase 7 schema already present.');
}
