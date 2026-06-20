/**
 * DTO validazione webhook partner — campi obbligatori per audit trail affidabile.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsISO8601, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

const PARTNER_EVENT_TYPES = ['rp_nomination', 'epr_registration', 'status_update'] as const;
const PARTNER_STATUSES = ['pending', 'in_progress', 'completed', 'failed', 'cancelled'] as const;

/** Esportazione `PartnerWebhookDto` — vedi implementazione sotto. */
export class PartnerWebhookDto {
  @ApiProperty({ description: 'Tipo evento partner' })
  @IsString()
  @IsIn(PARTNER_EVENT_TYPES)
  event!: string;

  @ApiPropertyOptional({ description: 'UUID richiesta partner interna' })
  @IsOptional()
  @IsUUID()
  partner_request_id?: string;

  @ApiProperty({ description: 'Riferimento esterno partner' })
  @IsString()
  @MinLength(1)
  external_ref!: string;

  @ApiProperty({ description: 'Tipo servizio (RP, EPR, ecc.)' })
  @IsString()
  @MinLength(1)
  type!: string;

  @ApiProperty({ description: 'Codice paese ISO (es. DE)' })
  @IsString()
  @MinLength(2)
  country!: string;

  @ApiProperty({ description: 'Stato elaborazione partner' })
  @IsString()
  @IsIn([...PARTNER_STATUSES])
  status!: string;

  @ApiPropertyOptional({ description: 'UUID SKU Varco associato' })
  @IsOptional()
  @IsUUID()
  sku_id?: string | null;

  @ApiProperty({ description: 'Timestamp evento ISO-8601' })
  @IsISO8601()
  occurred_at!: string;
}
