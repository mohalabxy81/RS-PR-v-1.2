const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'apps/api/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Insert relation arrays into Tenant
schema = schema.replace('  communicationLogs  CommunicationAuditLog[]\n}', `  communicationLogs  CommunicationAuditLog[]

  // Recommendation Phase 4
  recommendationProfiles RecommendationProfile[]
  recommendationSignals  RecommendationSignal[]
  recommendationResults  RecommendationResult[]
  recommendationModels   RecommendationModel[]
  recommendationExperiments RecommendationExperiment[]
  recommendationMetrics  RecommendationMetric[]
}`);

// Insert relation arrays into User
schema = schema.replace('  messagesSent          Message[]      @relation("MessageSender")\n\n  @@index([tenantId])', `  messagesSent          Message[]      @relation("MessageSender")
  recommendationSignals RecommendationSignal[]

  @@index([tenantId])`);

// Insert relation arrays into Property
schema = schema.replace('  appointments Appointment[]\n\n  @@index([tenantId])', `  appointments Appointment[]
  recommendationProfiles RecommendationProfile[]
  propertyVectors PropertyVector[]

  @@index([tenantId])`);

// Insert relation arrays into Customer
schema = schema.replace('  contactLinks  Contact[]\n\n  @@index([tenantId])', `  contactLinks  Contact[]
  recommendationProfiles RecommendationProfile[]
  customerVectors CustomerVector[]

  @@index([tenantId])`);

// Append Phase 4 models
const phase4Models = `
// ─────────────────────────────────────────────
// RECOMMENDATION: PHASE 4 - AI PROPERTY MATCHING
// ─────────────────────────────────────────────

enum RecommendationProfileType {
  CUSTOMER
  PROPERTY
}

enum RecommendationSignalType {
  VIEW
  SAVE
  SHARE
  CLICK
  APPOINTMENT_REQUEST
  WHATSAPP_INTERACTION
  DEAL_PROGRESSION
  SEARCH
}

enum RecommendationFeedbackStatus {
  ACCEPTED
  REJECTED
  VIEWED
  SAVED
  IGNORED
  CLOSED_DEAL
}

enum IntentStatus {
  HOT
  WARM
  COLD
  EXPLORING
  READY_TO_BUY
}

// -- PROFILES & VECTORS --

model RecommendationProfile {
  id              String                    @id @default(uuid())
  tenantId        String
  tenant          Tenant                    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  profileType     RecommendationProfileType
  customerId      String?
  customer        Customer?                 @relation(fields: [customerId], references: [id], onDelete: Cascade)
  propertyId      String?
  property        Property?                 @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  features        Json?                     // Extracted attributes
  intentStatus    IntentStatus?
  engagementScore Float                     @default(0)
  createdAt       DateTime                  @default(now())
  updatedAt       DateTime                  @updatedAt

  featureVectors  FeatureVector[]

  @@index([tenantId])
  @@index([customerId])
  @@index([propertyId])
}

model PropertyVector {
  id              String   @id @default(uuid())
  tenantId        String
  propertyId      String
  property        Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  embedding       Unsupported("vector(1536)")
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([propertyId])
}

model CustomerVector {
  id              String   @id @default(uuid())
  tenantId        String
  customerId      String
  customer        Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  embedding       Unsupported("vector(1536)")
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([customerId])
}

model SearchVector {
  id              String   @id @default(uuid())
  tenantId        String
  userId          String?
  query           String
  embedding       Unsupported("vector(1536)")
  filters         Json?
  createdAt       DateTime @default(now())

  @@index([tenantId])
}

model FeatureVector {
  id                      String                @id @default(uuid())
  tenantId                String
  recommendationProfileId String
  profile                 RecommendationProfile @relation(fields: [recommendationProfileId], references: [id], onDelete: Cascade)
  featureType             String                // 'BEHAVIOR', 'PREFERENCE', 'MARKET_FIT'
  embedding               Unsupported("vector(1536)")
  createdAt               DateTime              @default(now())

  @@index([recommendationProfileId])
}

// -- SIGNALS & EVENTS --

model RecommendationSignal {
  id              String                   @id @default(uuid())
  tenantId        String
  tenant          Tenant                   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userId          String?
  user            User?                    @relation(fields: [userId], references: [id], onDelete: SetNull)
  customerId      String?
  type            RecommendationSignalType
  entityType      String                   // 'Property', 'Message', etc
  entityId        String
  weight          Float                    @default(1.0)
  metadata        Json?
  createdAt       DateTime                 @default(now())

  @@index([tenantId])
  @@index([customerId])
}

model RecommendationEvent {
  id              String   @id @default(uuid())
  tenantId        String
  eventType       String   // 'INTENT_CHANGE', 'SCORE_UPDATE'
  targetId        String
  payload         Json
  createdAt       DateTime @default(now())

  @@index([tenantId])
}

model RecommendationFeedback {
  id              String                       @id @default(uuid())
  tenantId        String
  recommendationResultId String
  result          RecommendationResult         @relation(fields: [recommendationResultId], references: [id], onDelete: Cascade)
  status          RecommendationFeedbackStatus
  comments        String?
  createdAt       DateTime                     @default(now())

  @@index([recommendationResultId])
}

// -- RESULTS & SCORING --

model RecommendationResult {
  id              String   @id @default(uuid())
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  targetType      String   // 'CUSTOMER', 'PROPERTY'
  targetId        String
  recommendedType String   // 'PROPERTY', 'CUSTOMER'
  recommendedId   String
  compositeScore  Float
  confidenceScore Float?
  rank            Int
  createdAt       DateTime @default(now())

  feedbacks       RecommendationFeedback[]
  explanations    RecommendationExplanation[]
  scores          RecommendationScore[]

  @@index([tenantId])
  @@index([targetType, targetId])
}

model RecommendationScore {
  id                     String               @id @default(uuid())
  recommendationResultId String
  result                 RecommendationResult @relation(fields: [recommendationResultId], references: [id], onDelete: Cascade)
  componentName          String               // 'LOCATION_MATCH', 'BUDGET_MATCH'
  score                  Float
  weight                 Float                @default(1.0)

  @@index([recommendationResultId])
}

model RecommendationExplanation {
  id                     String               @id @default(uuid())
  recommendationResultId String
  result                 RecommendationResult @relation(fields: [recommendationResultId], references: [id], onDelete: Cascade)
  explanationText        String
  language               String               @default("en_US")
  createdAt              DateTime             @default(now())

  @@index([recommendationResultId])
}

// -- MODELS & EXPERIMENTS --

model RecommendationModel {
  id              String   @id @default(uuid())
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name            String
  version         String
  modelType       String   // 'RULE_BASED', 'VECTOR', 'HYBRID'
  weights         Json?
  isActive        Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([tenantId])
}

model RecommendationExperiment {
  id              String   @id @default(uuid())
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name            String
  variantA_Id     String   // Refers to RecommendationModel
  variantB_Id     String
  trafficSplit    Float    @default(0.5)
  status          String   // 'RUNNING', 'STOPPED', 'COMPLETED'
  startDate       DateTime @default(now())
  endDate         DateTime?
  metrics         Json?

  @@index([tenantId])
}

model RecommendationMetric {
  id              String   @id @default(uuid())
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  date            DateTime @db.Date
  metricName      String   // 'CTR', 'ACCEPTANCE_RATE'
  value           Float
  modelId         String?

  @@index([tenantId])
  @@unique([tenantId, date, metricName, modelId])
}

model RecommendationAuditLog {
  id              String   @id @default(uuid())
  tenantId        String
  action          String
  details         Json?
  createdAt       DateTime @default(now())

  @@index([tenantId])
}
`;

schema += phase4Models;

fs.writeFileSync(schemaPath, schema);
console.log('Phase 4 schema updated successfully.');
