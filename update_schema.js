const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'apps/api/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Insert relation arrays into Tenant
schema = schema.replace('  aiAuditLogs        AiAuditLog[]\n}', '  aiAuditLogs        AiAuditLog[]\n\n  // Communication Phase 3\n  providerAccounts   ProviderAccount[]\n  contacts           Contact[]\n  conversations      Conversation[]\n  messages           Message[]\n  templates          MessageTemplate[]\n  campaigns          Campaign[]\n  automations        AutomationRule[]\n  communicationLogs  CommunicationAuditLog[]\n}');

// Insert relation arrays into Branch
schema = schema.replace('  leads      Lead[]\n\n  @@index([tenantId])', '  leads      Lead[]\n  conversations Conversation[]\n\n  @@index([tenantId])');

// Insert relation arrays into User
schema = schema.replace('  aiAuditLogs           AiAuditLog[]\n\n  @@index([tenantId])', '  aiAuditLogs           AiAuditLog[]\n  conversationsAssigned Conversation[] @relation("ConversationAssignee")\n  messagesSent          Message[]      @relation("MessageSender")\n\n  @@index([tenantId])');

// Insert relation arrays into Lead
schema = schema.replace('  deals        Deal[]\n\n  @@index([tenantId])', '  deals        Deal[]\n  contactLinks Contact[]\n\n  @@index([tenantId])');

// Insert relation arrays into Customer
schema = schema.replace('  appointments  Appointment[]\n\n  @@index([tenantId])', '  appointments  Appointment[]\n  contactLinks  Contact[]\n\n  @@index([tenantId])');

// Append Phase 3 models
const phase3Models = `
// ─────────────────────────────────────────────
// COMMUNICATION: PHASE 3 - WHATSAPP & OMNICHANNEL
// ─────────────────────────────────────────────

enum ProviderType {
  WHATSAPP
  SMS
  EMAIL
  MESSENGER
  INSTAGRAM
  TELEGRAM
  WEBCHAT
  VOICE
}

enum MessageStatusType {
  QUEUED
  SENT
  DELIVERED
  READ
  FAILED
  REJECTED
  EXPIRED
}

enum ConversationStatusType {
  OPEN
  SNOOZED
  CLOSED
  ARCHIVED
}

enum MessageDirection {
  INBOUND
  OUTBOUND
}

enum MessageType {
  TEXT
  IMAGE
  DOCUMENT
  VIDEO
  AUDIO
  LOCATION
  CONTACTS
  TEMPLATE
  INTERACTIVE
}

enum WebhookStatus {
  RECEIVED
  PROCESSING
  PROCESSED
  FAILED
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  RUNNING
  PAUSED
  COMPLETED
  FAILED
}

enum TemplateStatus {
  DRAFT
  PENDING
  APPROVED
  REJECTED
}

// -- PROVIDERS --

model ProviderAccount {
  id              String       @id @default(uuid())
  tenantId        String
  tenant          Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  providerType    ProviderType
  name            String
  providerId      String?      // e.g. WABA ID
  phoneNumberId   String?
  phoneNumber     String?
  accessToken     String?      // Encrypted in practice
  isActive        Boolean      @default(true)
  metadata        Json?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  webhooks        ProviderWebhook[]
  healthLogs      ProviderHealthLog[]
  messages        Message[]
  templates       MessageTemplate[]

  @@index([tenantId])
}

model ProviderWebhook {
  id                String          @id @default(uuid())
  providerAccountId String
  providerAccount   ProviderAccount @relation(fields: [providerAccountId], references: [id], onDelete: Cascade)
  payload           Json
  status            WebhookStatus   @default(RECEIVED)
  error             String?
  processedAt       DateTime?
  createdAt         DateTime        @default(now())

  @@index([providerAccountId])
}

model ProviderHealthLog {
  id                String          @id @default(uuid())
  providerAccountId String
  providerAccount   ProviderAccount @relation(fields: [providerAccountId], references: [id], onDelete: Cascade)
  status            String          // 'UP', 'DOWN', 'DEGRADED'
  latencyMs         Int?
  error             String?
  createdAt         DateTime        @default(now())

  @@index([providerAccountId])
}

// -- CONTACTS & CHANNELS --

model Contact {
  id             String    @id @default(uuid())
  tenantId       String
  tenant         Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  leadId         String?
  lead           Lead?     @relation(fields: [leadId], references: [id], onDelete: SetNull)
  customerId     String?
  customer       Customer? @relation(fields: [customerId], references: [id], onDelete: SetNull)
  primaryName    String
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  channels       ContactChannel[]
  conversations  Conversation[]
  campaigns      CampaignContact[]

  @@index([tenantId])
}

model ContactChannel {
  id             String       @id @default(uuid())
  contactId      String
  contact        Contact      @relation(fields: [contactId], references: [id], onDelete: Cascade)
  providerType   ProviderType
  identifier     String       // Phone number, Email, etc.
  isOptedIn      Boolean      @default(false)
  lastContactedAt DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@unique([contactId, providerType, identifier])
  @@index([contactId])
}

// -- CONVERSATIONS --

model Conversation {
  id             String                 @id @default(uuid())
  tenantId       String
  tenant         Tenant                 @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  branchId       String?
  branch         Branch?                @relation(fields: [branchId], references: [id], onDelete: SetNull)
  contactId      String
  contact        Contact                @relation(fields: [contactId], references: [id], onDelete: Cascade)
  assigneeId     String?
  assignee       User?                  @relation("ConversationAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)
  status         ConversationStatusType @default(OPEN)
  providerType   ProviderType
  unreadCount    Int                    @default(0)
  lastMessageAt  DateTime?
  metadata       Json?                  // e.g. AI Summary
  createdAt      DateTime               @default(now())
  updatedAt      DateTime               @updatedAt

  messages       Message[]
  labels         ConversationLabel[]

  @@index([tenantId])
  @@index([contactId])
  @@index([assigneeId])
  @@index([status])
}

model ConversationLabel {
  id             String       @id @default(uuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  name           String
  color          String?
  createdAt      DateTime     @default(now())

  @@index([conversationId])
}

// -- MESSAGES --

model Message {
  id                String            @id @default(uuid())
  tenantId          String
  tenant            Tenant            @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  conversationId    String
  conversation      Conversation      @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  providerAccountId String
  providerAccount   ProviderAccount   @relation(fields: [providerAccountId], references: [id], onDelete: Cascade)
  senderId          String?
  sender            User?             @relation("MessageSender", fields: [senderId], references: [id], onDelete: SetNull)
  direction         MessageDirection
  type              MessageType       @default(TEXT)
  content           String?
  providerMessageId String?           @unique // ID from WhatsApp/Provider
  status            MessageStatusType @default(QUEUED)
  metadata          Json?             // Context for AI, template args, etc
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  attachments       MessageAttachment[]
  statusLogs        MessageStatusLog[]
  campaignMessages  CampaignMessage[]

  @@index([tenantId])
  @@index([conversationId])
  @@index([providerMessageId])
}

model MessageAttachment {
  id          String   @id @default(uuid())
  messageId   String
  message     Message  @relation(fields: [messageId], references: [id], onDelete: Cascade)
  url         String
  mimeType    String
  fileSize    Int?
  providerId  String?  // ID from Provider (e.g. WhatsApp Media ID)
  createdAt   DateTime @default(now())

  @@index([messageId])
}

model MessageStatusLog {
  id        String            @id @default(uuid())
  messageId String
  message   Message           @relation(fields: [messageId], references: [id], onDelete: Cascade)
  status    MessageStatusType
  reason    String?
  createdAt DateTime          @default(now())

  @@index([messageId])
}

// -- TEMPLATES --

model MessageTemplate {
  id                String          @id @default(uuid())
  tenantId          String
  tenant            Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  providerAccountId String
  providerAccount   ProviderAccount @relation(fields: [providerAccountId], references: [id], onDelete: Cascade)
  name              String
  category          String
  language          String          @default("en_US")
  status            TemplateStatus  @default(DRAFT)
  providerTemplateId String?
  metadata          Json?           // Required variables
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  versions          TemplateVersion[]

  @@index([tenantId])
  @@index([providerAccountId])
}

model TemplateVersion {
  id          String          @id @default(uuid())
  templateId  String
  template    MessageTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)
  version     Int             @default(1)
  components  Json            // WhatsApp Template Components format
  isApproved  Boolean         @default(false)
  createdAt   DateTime        @default(now())

  @@index([templateId])
}

// -- CAMPAIGNS --

model Campaign {
  id          String         @id @default(uuid())
  tenantId    String
  tenant      Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name        String
  description String?
  status      CampaignStatus @default(DRAFT)
  scheduledAt DateTime?
  metadata    Json?          // Segmentation rules
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  contacts    CampaignContact[]
  messages    CampaignMessage[]
  results     CampaignResult[]

  @@index([tenantId])
}

model CampaignContact {
  id         String   @id @default(uuid())
  campaignId String
  campaign   Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  contactId  String
  contact    Contact  @relation(fields: [contactId], references: [id], onDelete: Cascade)
  status     String   @default("PENDING") // PENDING, SENT, FAILED
  createdAt  DateTime @default(now())

  @@index([campaignId])
}

model CampaignMessage {
  id         String   @id @default(uuid())
  campaignId String
  campaign   Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  messageId  String
  message    Message  @relation(fields: [messageId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())

  @@index([campaignId])
}

model CampaignResult {
  id         String   @id @default(uuid())
  campaignId String
  campaign   Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  metric     String   // 'SENT', 'DELIVERED', 'READ', 'FAILED', 'REPLIED'
  count      Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([campaignId])
}

// -- AUTOMATION --

model AutomationRule {
  id          String         @id @default(uuid())
  tenantId    String
  tenant      Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name        String
  description String?
  isActive    Boolean        @default(true)
  priority    Int            @default(0)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  triggers    AutomationTrigger[]
  actions     AutomationAction[]
  executions  AutomationExecution[]

  @@index([tenantId])
}

model AutomationTrigger {
  id        String          @id @default(uuid())
  ruleId    String
  rule      AutomationRule  @relation(fields: [ruleId], references: [id], onDelete: Cascade)
  type      String          // AutomationTriggerType stringified
  config    Json            // Config for the trigger condition
  createdAt DateTime        @default(now())

  @@index([ruleId])
}

model AutomationAction {
  id        String          @id @default(uuid())
  ruleId    String
  rule      AutomationRule  @relation(fields: [ruleId], references: [id], onDelete: Cascade)
  type      String          // AutomationActionType stringified
  config    Json            // Config for the action
  order     Int             @default(0)
  createdAt DateTime        @default(now())

  @@index([ruleId])
}

model AutomationExecution {
  id        String          @id @default(uuid())
  ruleId    String
  rule      AutomationRule  @relation(fields: [ruleId], references: [id], onDelete: Cascade)
  status    String          // SUCCESS, FAILED
  error     String?
  metadata  Json?           // Event payload that triggered it
  createdAt DateTime        @default(now())

  @@index([ruleId])
}

// -- ANALYTICS & AUDIT --

model CommunicationAuditLog {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  action      String   // 'SEND_MESSAGE', 'TEMPLATE_CREATED'
  entity      String   // 'Message', 'Template'
  entityId    String
  userId      String?
  metadata    Json?
  createdAt   DateTime @default(now())

  @@index([tenantId])
}
`;

schema += phase3Models;

fs.writeFileSync(schemaPath, schema);
console.log('Schema updated successfully.');
