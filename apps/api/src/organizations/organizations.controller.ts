import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type RequestUser } from '../auth/current-user.decorator';
import { OrganizationsService } from './organizations.service';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Organizzazione attiva e membership utente' })
  @ApiOkResponse({ description: 'Contesto tenant corrente' })
  async me(@CurrentUser() user: RequestUser) {
    const memberships = await this.organizationsService.findMembershipsForUser(user.sub);
    return {
      user: {
        id: user.sub,
        email: user.email,
      },
      activeOrganization: {
        id: user.organizationId,
        name: user.organizationName,
      },
      memberships,
    };
  }
}
