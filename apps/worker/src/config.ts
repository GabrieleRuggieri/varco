export function getMockServerUrl(): string {
  return process.env.MOCK_SERVER_URL ?? 'http://localhost:4010';
}
