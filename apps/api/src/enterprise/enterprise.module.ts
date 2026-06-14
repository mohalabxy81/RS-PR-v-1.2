import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

// Controllers
import { OrganizationController } from './controllers/organization.controller';
import { WorkflowController } from './controllers/workflow.controller';
import { GovernanceController } from './controllers/governance.controller';
import { IdentityController } from './controllers/identity.controller';
import { ComplianceController } from './controllers/compliance.controller';
import { IntegrationController } from './controllers/integration.controller';
import { ReportingController } from './controllers/reporting.controller';

// Services
import { OrganizationService } from './services/organization.service';
import { WorkflowEngineService } from './services/workflow-engine.service';
import { GovernanceService } from './services/governance.service';
import { SsoService } from './services/sso.service';
import { SecurityService } from './services/security.service';
import { ComplianceService } from './services/compliance.service';
import { IntegrationService } from './services/integration.service';
import { ReportingService } from './services/reporting.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    OrganizationController,
    WorkflowController,
    GovernanceController,
    IdentityController,
    ComplianceController,
    IntegrationController,
    ReportingController,
  ],
  providers: [
    OrganizationService,
    WorkflowEngineService,
    GovernanceService,
    SsoService,
    SecurityService,
    ComplianceService,
    IntegrationService,
    ReportingService,
  ],
  exports: [
    OrganizationService,
    WorkflowEngineService,
    GovernanceService,
    SsoService,
    SecurityService,
    ComplianceService,
    IntegrationService,
    ReportingService,
  ],
})
export class EnterpriseModule {}
