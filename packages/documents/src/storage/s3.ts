import { createHash } from 'node:crypto';
import {
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getS3Config } from '../config.js';

let client: S3Client | null = null;
let bucketReady = false;

function getClient(): S3Client {
  if (!client) {
    const config = getS3Config();
    client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
      forcePathStyle: true,
    });
  }
  return client;
}

async function ensureBucket(): Promise<void> {
  if (bucketReady) return;
  const { bucket } = getS3Config();
  try {
    await getClient().send(new HeadBucketCommand({ Bucket: bucket }));
  } catch {
    // MinIO init container crea il bucket; in dev riproviamo al primo upload
  }
  bucketReady = true;
}

export function sha256Hex(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

export async function uploadPdf(params: {
  key: string;
  body: Buffer;
  metadata?: Record<string, string>;
}): Promise<{ checksum: string; bytes: number }> {
  await ensureBucket();
  const { bucket } = getS3Config();
  const checksum = sha256Hex(params.body);

  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body,
      ContentType: 'application/pdf',
      Metadata: {
        ...params.metadata,
        checksum,
      },
    }),
  );

  return { checksum, bytes: params.body.length };
}

export async function getDownloadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
  const { bucket } = getS3Config();
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(getClient(), command, { expiresIn: expiresInSeconds });
}

/** Reset client — utile nei test. */
export function resetS3Client(): void {
  client = null;
  bucketReady = false;
}
