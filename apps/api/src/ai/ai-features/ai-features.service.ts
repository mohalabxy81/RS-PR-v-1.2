import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiCoreService } from '../ai-core/ai-core.service';
import { AiPromptsService } from '../ai-prompts/ai-prompts.service';

@Injectable()
export class AiFeaturesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiCore: AiCoreService,
    private readonly aiPrompts: AiPromptsService,
  ) {}

  // ─── PROPERTY DESCRIPTION GENERATOR ───────────────────────────────────

  async generatePropertyDescription(propertyId: string, tenantId: string, userId: string, formats: string[] = ['professional', 'luxury', 'short', 'seo', 'social', 'email']) {
    const property = await this.prisma.property.findFirst({ where: { id: propertyId, tenantId } });
    if (!property) throw new NotFoundException('Property not found');

    const propertyDetails = `
Property Type: ${property.propertyType}
Title: ${property.title}
Price: ${property.price} ${property.currency}
Location: ${property.address}, ${property.district || ''}, ${property.city}
Area: ${property.area ? property.area + ' sqm' : 'N/A'}
Bedrooms: ${property.bedrooms ?? 'N/A'}
Bathrooms: ${property.bathrooms ?? 'N/A'}
Parking: ${property.parkingSpaces ?? 'N/A'}
Listing Type: ${property.listingType}
Status: ${property.status}
    `.trim();

    const prompt = `You are a professional real estate copywriter. Generate property descriptions for the following property in multiple formats. Return a valid JSON object with these keys: professional, luxury, short, seo, social, email. Each value is a string description.

Property Details:
${propertyDetails}

Formats needed: ${formats.join(', ')}

Return ONLY valid JSON, no markdown, no extra text.`;

    const result = await this.aiCore.chatCompletion(
      [{ role: 'user', content: prompt }],
      { tenantId, temperature: 0.7, maxTokens: 2000 },
    );

    await this.trackUsage(tenantId, userId, 'PropertyDescription', result.usage);

    try {
      return JSON.parse(result.content);
    } catch {
      return { professional: result.content };
    }
  }

  // ─── PROPERTY SEO GENERATOR ────────────────────────────────────────────

  async generatePropertySeo(propertyId: string, tenantId: string, userId: string) {
    const property = await this.prisma.property.findFirst({ where: { id: propertyId, tenantId } });
    if (!property) throw new NotFoundException('Property not found');

    const prompt = `You are an SEO expert for real estate. Generate SEO content for this property listing. Return valid JSON with keys: seoTitle (max 60 chars), metaDescription (max 160 chars), keywords (array of 10 strings), h1, contentOutline (array of strings), locationContent (string).

Property: ${property.title}, ${property.propertyType}, ${property.city}, ${property.price} ${property.currency}, ${property.bedrooms ?? 0} BR, ${property.area ?? 0} sqm, ${property.listingType}

Return ONLY valid JSON.`;

    const result = await this.aiCore.chatCompletion(
      [{ role: 'user', content: prompt }],
      { tenantId, temperature: 0.5, maxTokens: 1000 },
    );

    await this.trackUsage(tenantId, userId, 'PropertySeo', result.usage);

    try { return JSON.parse(result.content); }
    catch { return { seoTitle: property.title, metaDescription: result.content }; }
  }

  // ─── LEAD SCORING ──────────────────────────────────────────────────────

  async scoreLeadAi(leadId: string, tenantId: string, userId: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId },
      include: {
        leadNotes: { take: 5, orderBy: { createdAt: 'desc' } },
        activities: { take: 10, orderBy: { createdAt: 'desc' } },
        deals: { select: { id: true, stage: true, value: true } },
        appointments: { select: { id: true, status: true, type: true } },
      },
    });
    if (!lead) throw new NotFoundException('Lead not found');

    const leadData = JSON.stringify({
      source: lead.source, status: lead.status,
      budget: lead.budget, currency: lead.budgetCurrency,
      propertyType: lead.propertyType, preferredLocation: lead.preferredLocation,
      notes: lead.notes, noteCount: lead.leadNotes.length,
      activityCount: lead.activities.length,
      dealCount: lead.deals.length, dealStages: lead.deals.map(d => d.stage),
      appointmentCount: lead.appointments.length,
      appointmentStatuses: lead.appointments.map(a => a.status),
      createdAt: lead.createdAt, updatedAt: lead.updatedAt,
    }, null, 2);

    const prompt = `You are an expert real estate lead scoring AI. Analyze this lead and return a JSON object with:
- score (0-100 integer)
- priority ("HIGH" | "MEDIUM" | "LOW")
- likelihoodToClose ("HIGH" | "MEDIUM" | "LOW")
- reasons (array of 3-5 strings explaining the score)
- recommendedActions (array of 3-5 actionable strings)
- urgency ("IMMEDIATE" | "THIS_WEEK" | "THIS_MONTH" | "NURTURE")

Lead Data:
${leadData}

Scoring factors: source quality, engagement level, budget clarity, activity frequency, deal progression, appointment history, data completeness.

Return ONLY valid JSON.`;

    const result = await this.aiCore.chatCompletion(
      [{ role: 'user', content: prompt }],
      { tenantId, temperature: 0.3, maxTokens: 800 },
    );

    await this.trackUsage(tenantId, userId, 'LeadScoring', result.usage);

    try { return JSON.parse(result.content); }
    catch { return { score: 50, priority: 'MEDIUM', reasons: [result.content] }; }
  }

  // ─── CUSTOMER INSIGHTS ─────────────────────────────────────────────────

  async generateCustomerInsights(customerId: string, tenantId: string, userId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, tenantId },
      include: {
        customerNotes: { take: 5, orderBy: { createdAt: 'desc' } },
        deals: { include: { property: { select: { title: true, propertyType: true, price: true } } } },
        appointments: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!customer) throw new NotFoundException('Customer not found');

    const prompt = `Analyze this real estate customer and provide insights. Return JSON with:
- summary (string, 2-3 sentences)
- buyingIntent ("HIGH" | "MEDIUM" | "LOW")
- interestLevel ("VERY_INTERESTED" | "INTERESTED" | "BROWSING" | "COLD")
- budgetRange (string estimate based on deal history)
- riskIndicators (array of strings, empty if none)
- suggestedPropertyTypes (array of strings)
- communicationRecommendations (array of 3 strings)
- nextBestAction (string)

Customer: ${JSON.stringify({ name: customer.firstName + ' ' + customer.lastName, nationality: customer.nationality, dealCount: customer.deals.length, dealStages: customer.deals.map(d => d.stage), notes: customer.notes, appointmentCount: customer.appointments.length }, null, 2)}

Return ONLY valid JSON.`;

    const result = await this.aiCore.chatCompletion(
      [{ role: 'user', content: prompt }],
      { tenantId, temperature: 0.4, maxTokens: 800 },
    );

    await this.trackUsage(tenantId, userId, 'CustomerInsights', result.usage);

    try { return JSON.parse(result.content); }
    catch { return { summary: result.content, buyingIntent: 'MEDIUM' }; }
  }

  // ─── DEAL ASSISTANT ────────────────────────────────────────────────────

  async generateDealSummary(dealId: string, tenantId: string, userId: string) {
    const deal = await this.prisma.deal.findFirst({
      where: { id: dealId, tenantId },
      include: {
        customer: { select: { firstName: true, lastName: true, nationality: true } },
        property: { select: { title: true, price: true, propertyType: true, city: true, status: true } },
        dealNotes: { take: 5, orderBy: { createdAt: 'desc' } },
        stageHistory: { orderBy: { changedAt: 'asc' } },
        appointments: { orderBy: { startTime: 'desc' }, take: 3 },
      },
    });
    if (!deal) throw new NotFoundException('Deal not found');

    const prompt = `Analyze this real estate deal and provide an assistant summary. Return JSON with:
- summary (string, 3-4 sentences)
- probabilityToClose (0-100 integer)
- riskLevel ("LOW" | "MEDIUM" | "HIGH")
- risks (array of risk strings)
- missingInformation (array of strings — what info is missing to progress)
- negotiationSuggestions (array of 3 strings)
- actionRecommendations (array of 3-5 strings ordered by priority)
- estimatedDaysToClose (integer estimate)

Deal: ${JSON.stringify({ title: deal.title, value: deal.value, currency: deal.currency, stage: deal.stage, forecastCloseDate: deal.forecastCloseDate, stageHistory: deal.stageHistory.length, customer: deal.customer?.firstName, property: deal.property?.title, propertyStatus: deal.property?.status, notes: deal.notes, noteCount: deal.dealNotes.length, appointmentCount: deal.appointments.length }, null, 2)}

Return ONLY valid JSON.`;

    const result = await this.aiCore.chatCompletion(
      [{ role: 'user', content: prompt }],
      { tenantId, temperature: 0.4, maxTokens: 1000 },
    );

    await this.trackUsage(tenantId, userId, 'DealSummary', result.usage);

    try { return JSON.parse(result.content); }
    catch { return { summary: result.content, probabilityToClose: 50 }; }
  }

  // ─── APPOINTMENT ASSISTANT ─────────────────────────────────────────────

  async generateAppointmentAgenda(appointmentId: string, tenantId: string, userId: string) {
    const appt = await this.prisma.appointment.findFirst({
      where: { id: appointmentId, tenantId },
      include: {
        lead: { select: { firstName: true, lastName: true, status: true, budget: true, propertyType: true } },
        customer: { select: { firstName: true, lastName: true } },
        property: { select: { title: true, price: true, propertyType: true, city: true, description: true } },
        deal: { select: { title: true, stage: true, value: true } },
      },
    });
    if (!appt) throw new NotFoundException('Appointment not found');

    const prompt = `Generate a professional meeting agenda for this real estate appointment. Return JSON with:
- meetingAgenda (array of agenda items with time allocations)
- preparation (array of preparation steps for the agent)
- keyTalkingPoints (array of strings)
- anticipatedObjections (array of strings with suggested responses)
- followUpTasks (array of tasks to complete after the meeting)
- nextSteps (array of strings)

Appointment: ${JSON.stringify({ type: appt.type, title: appt.title, description: appt.description, startTime: appt.startTime, location: appt.location, lead: appt.lead?.firstName, customer: appt.customer?.firstName, property: appt.property?.title, deal: appt.deal?.title }, null, 2)}

Return ONLY valid JSON.`;

    const result = await this.aiCore.chatCompletion(
      [{ role: 'user', content: prompt }],
      { tenantId, temperature: 0.5, maxTokens: 1000 },
    );

    await this.trackUsage(tenantId, userId, 'AppointmentAgenda', result.usage);

    try { return JSON.parse(result.content); }
    catch { return { meetingAgenda: [result.content] }; }
  }

  // ─── EMAIL GENERATOR ────────────────────────────────────────────────────

  async generateEmail(params: { type: string; entityType?: string; entityId?: string; tone?: string; language?: string; tenantId: string; userId: string }) {
    const { type, entityType, entityId, tone = 'professional', language = 'English', tenantId, userId } = params;

    let contextData = '';
    if (entityType && entityId) {
      const data = await this.fetchEntityData(entityType, entityId, tenantId);
      if (data) contextData = `\nContext: ${JSON.stringify(data, null, 2)}`;
    }

    const prompt = `Generate a ${tone} ${type} email in ${language} for a real estate agent. Return JSON with:
- subject (string)
- body (string, professional email body with proper greeting, content and sign-off using [Agent Name] placeholder)
- preview (string, first 100 chars)
${contextData}

Email type: ${type}
Tone: ${tone}
Language: ${language}

Return ONLY valid JSON.`;

    const result = await this.aiCore.chatCompletion(
      [{ role: 'user', content: prompt }],
      { tenantId, temperature: 0.6, maxTokens: 800 },
    );

    await this.trackUsage(tenantId, userId, 'EmailGenerator', result.usage);

    try { return JSON.parse(result.content); }
    catch { return { subject: 'Follow Up', body: result.content }; }
  }

  // ─── WHATSAPP GENERATOR ─────────────────────────────────────────────────

  async generateWhatsApp(params: { type: string; entityType?: string; entityId?: string; format?: string; language?: string; tenantId: string; userId: string }) {
    const { type, entityType, entityId, format = 'short', language = 'English', tenantId, userId } = params;

    let contextData = '';
    if (entityType && entityId) {
      const data = await this.fetchEntityData(entityType, entityId, tenantId);
      if (data) contextData = `\nContext: ${JSON.stringify(data, null, 2)}`;
    }

    const prompt = `Generate a ${format} WhatsApp message for a real estate agent. Keep it conversational, friendly, and appropriate for messaging apps. Return JSON with:
- message (string, the WhatsApp message text)
- emoji (suggested emoji to use)
${contextData}

Message type: ${type}
Format: ${format} (${format === 'short' ? 'max 3 lines' : 'max 10 lines'})
Language: ${language}

Return ONLY valid JSON.`;

    const result = await this.aiCore.chatCompletion(
      [{ role: 'user', content: prompt }],
      { tenantId, temperature: 0.7, maxTokens: 400 },
    );

    await this.trackUsage(tenantId, userId, 'WhatsAppGenerator', result.usage);

    try { return JSON.parse(result.content); }
    catch { return { message: result.content }; }
  }

  // ─── CALL SUMMARY ──────────────────────────────────────────────────────

  async summarizeCall(params: { transcript: string; entityType?: string; entityId?: string; tenantId: string; userId: string }) {
    const { transcript, entityType, entityId, tenantId, userId } = params;

    let contextData = '';
    if (entityType && entityId) {
      const data = await this.fetchEntityData(entityType, entityId, tenantId);
      if (data) contextData = `\nContext: ${JSON.stringify(data, null, 2)}`;
    }

    const prompt = `Analyze this real estate call transcript and extract key information. Return JSON with:
- summary (string, 3-4 sentences)
- customerNeeds (array of strings)
- customerObjections (array of strings)
- importantDetails (array of key facts mentioned)
- followUpActions (array of action items)
- tasksToCreate (array of objects with: title, priority, dueInDays)
- crmUpdates (array of strings — what to update in the CRM)
- sentiment ("POSITIVE" | "NEUTRAL" | "NEGATIVE")

Call Transcript:
${transcript.substring(0, 3000)}
${contextData}

Return ONLY valid JSON.`;

    const result = await this.aiCore.chatCompletion(
      [{ role: 'user', content: prompt }],
      { tenantId, temperature: 0.3, maxTokens: 1200 },
    );

    await this.trackUsage(tenantId, userId, 'CallSummary', result.usage);

    try { return JSON.parse(result.content); }
    catch { return { summary: result.content, followUpActions: [] }; }
  }

  // ─── HELPERS ───────────────────────────────────────────────────────────

  private async fetchEntityData(entityType: string, entityId: string, tenantId: string): Promise<any> {
    try {
      switch (entityType.toLowerCase()) {
        case 'lead':
          return this.prisma.lead.findFirst({ where: { id: entityId, tenantId }, select: { firstName: true, lastName: true, email: true, phone: true, status: true, source: true, budget: true, propertyType: true, preferredLocation: true } });
        case 'property':
          return this.prisma.property.findFirst({ where: { id: entityId, tenantId }, select: { title: true, price: true, currency: true, propertyType: true, listingType: true, city: true, bedrooms: true, bathrooms: true, area: true } });
        case 'deal':
          return this.prisma.deal.findFirst({ where: { id: entityId, tenantId }, select: { title: true, value: true, stage: true, currency: true } });
        case 'customer':
          return this.prisma.customer.findFirst({ where: { id: entityId, tenantId }, select: { firstName: true, lastName: true, email: true, phone: true, nationality: true } });
        default:
          return null;
      }
    } catch { return null; }
  }

  private async trackUsage(tenantId: string, userId: string, feature: string, usage: { promptTokens: number; completionTokens: number; totalTokens: number }) {
    try {
      await this.prisma.aiUsage.create({
        data: {
          tenantId,
          userId,
          feature,
          inputTokens: usage.promptTokens,
          outputTokens: usage.completionTokens,
          totalTokens: usage.totalTokens,
        },
      });
    } catch { /* non-critical */ }
  }
}
