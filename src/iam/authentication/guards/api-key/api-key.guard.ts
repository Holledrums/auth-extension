/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST_USER_KEY } from 'src/iam/constants/iam.constants';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ApiKey } from 'src/users/api-keys/entities/api-key.entity/api-key.entity';
import { ApiKeysService } from '../../api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeysService: ApiKeysService,
    @InjectRepository(ApiKey)
    private readonly apiKeysRepository: Repository<ApiKey>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractKeyFromHeader(request);
    if (!apiKey) {
      throw new UnauthorizedException();
    }

    const userId = this.apiKeysService.extractIdFromApiKey(apiKey);
    try {
      const apiKeyEntity = await this.apiKeysRepository.findOne({
        where: { user: { id: parseInt(userId, 10) } },
        relations: { user: true },
      });

      if (!apiKeyEntity) {
        throw new UnauthorizedException();
      }
      await this.apiKeysService.validate(apiKey, apiKeyEntity.key);
      request[REQUEST_USER_KEY] = {
        sub: apiKeyEntity.user.id,
        email: apiKeyEntity.user.email,
        role: apiKeyEntity.user.role,
        permissions: apiKeyEntity.user.permissions,
      } as ActiveUserData;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractKeyFromHeader(request: Request): string | undefined {
    const [type, key] = request.headers.authorization?.split(' ') ?? [];
    return type === 'ApiKey' ? key : undefined;
  }
}
