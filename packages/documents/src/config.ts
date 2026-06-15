export type S3Config = {
  endpoint: string;
  bucket: string;
  accessKey: string;
  secretKey: string;
  region: string;
};

export function getS3Config(): S3Config {
  const accessKey = process.env.S3_ACCESS_KEY ?? 'minioadmin';
  const secretKey = process.env.S3_SECRET_KEY ?? 'minioadmin';

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
      throw new Error('S3_ACCESS_KEY e S3_SECRET_KEY devono essere configurati in produzione.');
    }
    if (accessKey === 'minioadmin' || secretKey === 'minioadmin') {
      throw new Error('Le credenziali S3 di default (minioadmin) non possono essere usate in produzione.');
    }
  }

  return {
    endpoint: process.env.S3_ENDPOINT ?? 'http://localhost:9000',
    bucket: process.env.S3_BUCKET ?? 'varco-documents',
    accessKey,
    secretKey,
    region: process.env.S3_REGION ?? 'us-east-1',
  };
}
