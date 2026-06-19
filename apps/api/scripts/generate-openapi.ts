import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

async function generateOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = new DocumentBuilder()
    .setTitle('REIS Enterprise SaaS API')
    .setDescription('Multi-Tenant Real Estate CRM Platform — API v1')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const outputPath = path.resolve(__dirname, '../../openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`OpenAPI specification written to ${outputPath}`);
  await app.close();
}

generateOpenApi().catch((err) => {
  console.error(err);
  process.exit(1);
});
