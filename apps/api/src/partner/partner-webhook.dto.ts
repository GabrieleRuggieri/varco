import { IsOptional, IsString } from 'class-validator';

export class PartnerWebhookDto {
  @IsOptional()
  @IsString()
  event?: string;

  @IsOptional()
  @IsString()
  partner_request_id?: string;

  @IsOptional()
  @IsString()
  external_ref?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  sku_id?: string | null;

  @IsOptional()
  @IsString()
  occurred_at?: string;
}
