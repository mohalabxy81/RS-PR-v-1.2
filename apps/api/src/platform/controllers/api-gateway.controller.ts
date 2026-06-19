import { Version, Controller, Get, Post, Body, Param, Req, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ApiGatewayService } from '../services/api-gateway.service';
import { ApiUsageInterceptor } from '../interceptors/api-usage.interceptor';
import { GenerateApiKeyDto, RegisterOAuthClientDto, CreateApiProductDto, CreateApiPlanDto, SubscribeToPlanDto } from '../dto/api-gateway.dto';

@ApiTags('platform-gateway')
@ApiBearerAuth('access-token')
@Controller({ path: 'platform/gateway', version: '1' })
@UseInterceptors(ApiUsageInterceptor)
export class ApiGatewayController {
  constructor(private readonly gatewayService: ApiGatewayService) {}

  // --- API Keys & Auth ---

  @Post('developers/:developerId/keys')
  @ApiOperation({ summary: 'Generate a new API key for a developer' })
  @ApiResponse({ status: 201, description: 'API Key generated successfully' })
  @ApiBody({ type: GenerateApiKeyDto })
  async generateApiKey(
    @Param('developerId') developerId: string,
    @Body() body: GenerateApiKeyDto
  ) {
    return this.gatewayService.generateApiKey(developerId, body.name, body.scopes);
  }

  @Post('developers/:developerId/oauth-clients')
  @ApiOperation({ summary: 'Register a new OAuth client' })
  @ApiResponse({ status: 201, description: 'OAuth client registered successfully' })
  @ApiBody({ type: RegisterOAuthClientDto })
  async registerOAuthClient(
    @Param('developerId') developerId: string,
    @Body() data: RegisterOAuthClientDto
  ) {
    return this.gatewayService.registerOAuthClient(developerId, data);
  }

  // --- API Catalog ---

  @Get('products')
  @ApiOperation({ summary: 'List all active API products' })
  @ApiResponse({ status: 200, description: 'List of products' })
  async getApiProducts() {
    return this.gatewayService.getApiProducts();
  }

  @Post('products')
  @ApiOperation({ summary: 'Create a new API product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiBody({ type: CreateApiProductDto })
  async createApiProduct(@Body() data: CreateApiProductDto) {
    return this.gatewayService.createApiProduct(data);
  }

  @Post('products/:productId/plans')
  @ApiOperation({ summary: 'Add a pricing plan to a product' })
  @ApiResponse({ status: 201, description: 'Plan created successfully' })
  @ApiBody({ type: CreateApiPlanDto })
  async createApiPlan(
    @Param('productId') productId: string,
    @Body() data: CreateApiPlanDto
  ) {
    return this.gatewayService.createApiPlan(productId, data);
  }

  // --- Subscriptions ---

  @Post('developers/:developerId/subscriptions')
  @ApiOperation({ summary: 'Subscribe a developer to an API plan' })
  @ApiResponse({ status: 201, description: 'Subscription successful' })
  @ApiBody({ type: SubscribeToPlanDto })
  async subscribeToPlan(
    @Param('developerId') developerId: string,
    @Body() body: SubscribeToPlanDto
  ) {
    return this.gatewayService.subscribeToPlan(developerId, body.planId);
  }

  @Get('developers/:developerId/subscriptions')
  @ApiOperation({ summary: 'Get all subscriptions for a developer' })
  @ApiResponse({ status: 200, description: 'List of subscriptions' })
  async getSubscriptions(@Param('developerId') developerId: string) {
    return this.gatewayService.getSubscriptions(developerId);
  }
}
