const fs = require('fs');
const path = require('path');

const CONTROLLERS_DIR = '/home/mohal665544/pr1.2/apps/api/src/enterprise/controllers';
const SERVICES_DIR = '/home/mohal665544/pr1.2/apps/api/src/enterprise/services';

const mapping = {
  'createOrganization': 'CreateOrganizationDto',
  'updateOrganization': 'UpdateOrganizationDto',
  'createRegion': 'CreateRegionDto',
  'createDepartment': 'CreateDepartmentDto',
  'createBusinessUnit': 'CreateBusinessUnitDto',
  'createHierarchy': 'CreateHierarchyDto',
  'createComplianceRecord': 'CreateComplianceRecordDto',
  'createRetentionPolicy': 'CreateRetentionPolicyDto',
  'updateRetentionPolicy': 'UpdateRetentionPolicyDto',
  'createWorkflow': 'CreateWorkflowDto',
  'updateWorkflow': 'UpdateWorkflowDto',
  'createPolicy': 'CreatePolicyDto',
  'updatePolicy': 'UpdatePolicyDto',
  'addRuleToPolicy': 'CreateGovernanceRuleDto',
  'updateRule': 'UpdateGovernanceRuleDto',
  'configureProvider': 'CreateSsoProviderDto', 
  'updateProvider': 'UpdateSsoProviderDto',
  'createIntegration': 'CreateIntegrationDto',
  'updateIntegration': 'UpdateIntegrationDto',
  'addConnector': 'CreateConnectorDto',
  'createReport': 'CreateReportDto',
  'updateReport': 'UpdateReportDto',
  'logSecurityEvent': 'CreateSecurityEventDto',
  'logRiskEvent': 'CreateRiskEventDto',
  'createIncident': 'CreateIncidentDto',
  'addAdministrator': 'CreateAdministratorDto',
  'createAccessReview': 'CreateAccessReviewDto'
};

function processFile(filePath, isController) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const usedDtos = new Set();
  
  for (const [methodName, dtoName] of Object.entries(mapping)) {
    // For services:
    const svcRegex = new RegExp(`(${methodName}\\(.*?)(data):\\s*any`, 'g');
    if (svcRegex.test(content)) {
      content = content.replace(svcRegex, `$1$2: ${dtoName}`);
      usedDtos.add(dtoName);
    }
    // For controllers:
    const methodBlockRegex = new RegExp(`(async ${methodName}\\([\\s\\S]*?@Body\\(\\)\\s*[a-zA-Z]+):\\s*any`, 'g');
    if (methodBlockRegex.test(content)) {
      content = content.replace(methodBlockRegex, `$1: ${dtoName}`);
      usedDtos.add(dtoName);
    }
  }

  // Manual fixes for identity controller since method names differ slightly
  const ssoBlock1 = /(async configureSsoProvider\([\s\S]*?@Body\(\)\s*data):\s*any/g;
  if (ssoBlock1.test(content)) {
    content = content.replace(ssoBlock1, `$1: CreateSsoProviderDto`);
    usedDtos.add('CreateSsoProviderDto');
  }
  const ssoBlock2 = /(async updateSsoProvider\([\s\S]*?@Body\(\)\s*data):\s*any/g;
  if (ssoBlock2.test(content)) {
    content = content.replace(ssoBlock2, `$1: UpdateSsoProviderDto`);
    usedDtos.add('UpdateSsoProviderDto');
  }

  if (usedDtos.size > 0) {
    const importStatement = `import { ${Array.from(usedDtos).join(', ')} } from '../dto/enterprise.dto';\n`;
    if (isController) {
      content = content.replace("import { Version, Controller", importStatement + "import { Version, Controller");
    } else {
      content = content.replace("import { Injectable", importStatement + "import { Injectable");
    }
  }

  if (isController) {
    if (!content.includes('@ApiTags(')) {
      const moduleName = path.basename(filePath, '.controller.ts');
      const titleCase = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
      if (!content.includes('@nestjs/swagger')) {
         content = content.replace(/import \{ Version, Controller/, `import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';\nimport { Version, Controller`);
      }
      content = content.replace(/@Controller\('enterprise\//, `@ApiTags('Enterprise / ${titleCase}')\n@Controller('enterprise/`);
    }
  }

  fs.writeFileSync(filePath, content);
}

const services = fs.readdirSync(SERVICES_DIR).filter(f => f.endsWith('.ts'));
services.forEach(f => processFile(path.join(SERVICES_DIR, f), false));

const controllers = fs.readdirSync(CONTROLLERS_DIR).filter(f => f.endsWith('.ts'));
controllers.forEach(f => processFile(path.join(CONTROLLERS_DIR, f), true));

console.log('Done refactoring');
