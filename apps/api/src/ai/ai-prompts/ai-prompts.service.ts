import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiPromptsService {
  constructor(private readonly prisma: PrismaService) {}

  async getActivePromptContent(name: string, tenantId?: string): Promise<string> {
    const prompt = await this.prisma.aiPrompt.findFirst({
      where: {
        name,
        OR: [
          { tenantId },
          { tenantId: null }
        ]
      },
      include: {
        versions: {
          where: { isActive: true },
          take: 1
        }
      },
      orderBy: {
        tenantId: 'desc' // Prioritize tenant-specific prompt over system-wide (null)
      }
    });

    if (!prompt || prompt.versions.length === 0) {
      throw new NotFoundException(`Active prompt version for ${name} not found`);
    }

    return prompt.versions[0].content;
  }

  async createPrompt(data: { tenantId?: string; name: string; category: string; description?: string }) {
    return this.prisma.aiPrompt.create({
      data,
    });
  }

  async createPromptVersion(promptId: string, content: string, createdById?: string) {
    // Get highest version
    const lastVersion = await this.prisma.aiPromptVersion.findFirst({
      where: { promptId },
      orderBy: { version: 'desc' },
    });

    const nextVersion = lastVersion ? lastVersion.version + 1 : 1;

    return this.prisma.aiPromptVersion.create({
      data: {
        promptId,
        version: nextVersion,
        content,
        createdById,
        isActive: false, // Default to false, needs explicit activation
      },
    });
  }

  async activatePromptVersion(promptId: string, versionId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Deactivate all
      await tx.aiPromptVersion.updateMany({
        where: { promptId },
        data: { isActive: false },
      });

      // Activate one
      return tx.aiPromptVersion.update({
        where: { id: versionId },
        data: { isActive: true },
      });
    });
  }
}
