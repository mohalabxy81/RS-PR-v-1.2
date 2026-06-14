const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'apps/api/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// We need to inject the relation into Tenant.
// Let's find the end of the Tenant model.
// It usually ends with `recommendationMetrics     RecommendationMetric[]\n}`
schema = schema.replace('  recommendationMetrics     RecommendationMetric[]\n}', `  recommendationMetrics     RecommendationMetric[]

  // White Label & Branding Phase 5
  tenantBrands              TenantBrand[]
  tenantCustomizations      TenantCustomization[]
  tenantPreferences         TenantPreference[]
  tenantIntegrations        TenantIntegration[]
  tenantConfigurations      TenantConfiguration[]
}`);

const phase5Models = `
// ─────────────────────────────────────────────
// WHITE LABEL & BRANDING: PHASE 5
// ─────────────────────────────────────────────

model TenantBrand {
  id               String   @id @default(uuid())
  tenantId         String   @unique
  tenant           Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  companyName      String
  displayName      String?
  shortName        String?
  description      String?
  tagline          String?
  missionStatement String?
  businessDetails  Json?
  contactEmail     String?
  contactPhone     String?
  supportEmail     String?
  salesEmail       String?
  socialLinks      Json?
  legalInfo        Json?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  assets           BrandAsset[]
  logos            BrandLogo[]
  themes           BrandTheme[]
  colors           BrandColor[]
  typography       BrandTypography[]
  domains          BrandDomain[]
  emails           BrandEmail[]
  templates        BrandTemplate[]
  pages            BrandPage[]
  settings         BrandSetting[]
  features         BrandFeature[]
  localizations    BrandLocalization[]
  auditLogs        BrandAuditLog[]
}

model BrandAsset {
  id          String      @id @default(uuid())
  brandId     String
  brand       TenantBrand @relation(fields: [brandId], references: [id], onDelete: Cascade)
  name        String
  url         String
  s3Key       String?
  assetType   String      // IMAGE, VIDEO, PDF, ICON, FONT
  mimeType    String?
  fileSize    Int?
  version     Int         @default(1)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([brandId])
}

model BrandLogo {
  id          String      @id @default(uuid())
  brandId     String
  brand       TenantBrand @relation(fields: [brandId], references: [id], onDelete: Cascade)
  type        String      // PRIMARY, SECONDARY, LIGHT, DARK, FAVICON, APP_ICON, EMAIL, DOCUMENT, WATERMARK
  url         String
  s3Key       String?
  version     Int         @default(1)
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([brandId])
}

model BrandTheme {
  id          String      @id @default(uuid())
  brandId     String
  brand       TenantBrand @relation(fields: [brandId], references: [id], onDelete: Cascade)
  name        String
  isDefault   Boolean     @default(false)
  darkMode    Boolean     @default(false)
  version     Int         @default(1)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([brandId])
}

model BrandColor {
  id          String      @id @default(uuid())
  brandId     String
  brand       TenantBrand @relation(fields: [brandId], references: [id], onDelete: Cascade)
  name        String      // PRIMARY, SECONDARY, ACCENT, BACKGROUND
  value       String      // HEX or RGB
  themeMode   String      // LIGHT, DARK
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([brandId])
}

model BrandTypography {
  id          String      @id @default(uuid())
  brandId     String
  brand       TenantBrand @relation(fields: [brandId], references: [id], onDelete: Cascade)
  element     String      // HEADING_1, BODY, BUTTON
  fontFamily  String
  fontWeight  String?
  fontSize    String?
  lineHeight  String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([brandId])
}

model BrandDomain {
  id          String      @id @default(uuid())
  brandId     String
  brand       TenantBrand @relation(fields: [brandId], references: [id], onDelete: Cascade)
  domain      String      @unique
  isPrimary   Boolean     @default(false)
  status      String      // PENDING, VERIFIED, FAILED
  sslStatus   String      // PROVISIONING, ACTIVE, EXPIRED
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  dnsRecords  BrandDnsRecord[]
  
  @@index([brandId])
}

model BrandDnsRecord {
  id          String      @id @default(uuid())
  domainId    String
  domain      BrandDomain @relation(fields: [domainId], references: [id], onDelete: Cascade)
  type        String      // TXT, CNAME, A
  name        String
  value       String
  isVerified  Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([domainId])
}

model BrandEmail {
  id          String      @id @default(uuid())
  brandId     String
  brand       TenantBrand @relation(fields: [brandId], references: [id], onDelete: Cascade)
  emailType   String      // SUPPORT, SALES, NO_REPLY
  senderName  String
  senderEmail String
  replyTo     String?
  isVerified  Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([brandId])
}

model BrandTemplate {
  id          String      @id @default(uuid())
  brandId     String
  brand       TenantBrand @relation(fields: [brandId], references: [id], onDelete: Cascade)
  name        String
  type        String      // EMAIL, DOCUMENT, INVOICE
  subject     String?
  bodyHtml    String
  variables   Json?
  version     Int         @default(1)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([brandId])
}

model BrandPage {
  id          String      @id @default(uuid())
  brandId     String
  brand       TenantBrand @relation(fields: [brandId], references: [id], onDelete: Cascade)
  slug        String
  title       String
  contentHtml String
  isPublished Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([brandId])
  @@unique([brandId, slug])
}

model BrandSetting {
  id          String      @id @default(uuid())
  brandId     String
  brand       TenantBrand @relation(fields: [brandId], references: [id], onDelete: Cascade)
  key         String
  value       Json
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([brandId])
  @@unique([brandId, key])
}

model BrandFeature {
  id          String      @id @default(uuid())
  brandId     String
  brand       TenantBrand @relation(fields: [brandId], references: [id], onDelete: Cascade)
  featureKey  String
  isEnabled   Boolean     @default(false)
  settings    Json?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([brandId])
  @@unique([brandId, featureKey])
}

model BrandLocalization {
  id          String      @id @default(uuid())
  brandId     String
  brand       TenantBrand @relation(fields: [brandId], references: [id], onDelete: Cascade)
  language    String      // en, ar, fr
  isDefault   Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  translations BrandTranslation[]
  
  @@index([brandId])
}

model BrandTranslation {
  id             String            @id @default(uuid())
  localizationId String
  localization   BrandLocalization @relation(fields: [localizationId], references: [id], onDelete: Cascade)
  key            String
  value          String
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
  
  @@index([localizationId])
  @@unique([localizationId, key])
}

model BrandAuditLog {
  id          String      @id @default(uuid())
  brandId     String
  brand       TenantBrand @relation(fields: [brandId], references: [id], onDelete: Cascade)
  userId      String?
  action      String
  entity      String
  entityId    String?
  details     Json?
  createdAt   DateTime    @default(now())
  
  @@index([brandId])
}

model TenantCustomization {
  id          String      @id @default(uuid())
  tenantId    String
  tenant      Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  module      String      // CRM, PORTAL, AI
  config      Json
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([tenantId])
  @@unique([tenantId, module])
}

model TenantPreference {
  id          String      @id @default(uuid())
  tenantId    String
  tenant      Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  key         String
  value       String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([tenantId])
  @@unique([tenantId, key])
}

model TenantIntegration {
  id          String      @id @default(uuid())
  tenantId    String
  tenant      Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  provider    String      // STRIPE, SENDGRID, AWS
  credentials Json
  isActive    Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([tenantId])
  @@unique([tenantId, provider])
}

model TenantConfiguration {
  id          String      @id @default(uuid())
  tenantId    String
  tenant      Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  key         String
  value       Json
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([tenantId])
  @@unique([tenantId, key])
}
`;

schema += phase5Models;

fs.writeFileSync(schemaPath, schema);
console.log('Phase 5 schema updated successfully.');
