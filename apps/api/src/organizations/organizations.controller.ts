import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista organizzazioni' })
  @ApiOkResponse({ description: 'Organizzazioni nel database' })
  async list() {
    const items = await this.organizationsService.findAll();
    return { organizations: items };
  }
}
