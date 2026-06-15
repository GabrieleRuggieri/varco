export type S3Config = {
  endpoint: string;
  bucket: string;
  accessKey: string;
  secretKey: string;
  region: string;
};

export function getS3Config(): S3Config {
  const accessKey = process.env.S3_ACCESS_KEY;
  const secretKey = process.env.S3_SECRET_KEY;

  if (!accessKey || !secretKey) {
    throw new Error(
      'S3_ACCESS_KEY e S3_SECRET_KEY devono essere configurati. ' +
        'Copia .env.example in .env e imposta i valori appropriati.',
    );
  }

  return {
    endpoint: process.env.S3_ENDPOINT ?? 'http://localhost:9000',
    bucket: process.env.S3_BUCKET ?? 'varco-documents',
    accessKey,
    secretKey,
    region: process.env.S3_REGION ?? 'us-east-1',
  };
}
