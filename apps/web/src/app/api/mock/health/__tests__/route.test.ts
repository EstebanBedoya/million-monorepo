import { GET } from '../route';

describe('/api/mock/health', () => {
  it('should return health status', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('service');
    expect(data.status).toBe('ok');
    expect(data.service).toBe('mock-properties-api');
    expect(typeof data.timestamp).toBe('string');
  });

  it('should return valid timestamp', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    const timestamp = new Date(data.timestamp);
    expect(timestamp instanceof Date).toBe(true);
    expect(!isNaN(timestamp.getTime())).toBe(true);
  });
});
