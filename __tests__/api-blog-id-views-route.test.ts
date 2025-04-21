import { POST, GET } from '../src/app/api/blog/[id]/views/route';
import prisma from '@/lib/db';

describe('api/blog/[id]/views/route', () => {
  const mockPostId = 'test-post-id';
  const mockParams = { params: { id: mockPostId } };
  let updateSpy: jest.SpyInstance;

  beforeEach(() => {
    updateSpy = jest.spyOn(prisma.post, 'update').mockResolvedValue({} as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('increments the view count for a post and returns success', async () => {
      const req = {} as any; // NextRequest is not used in logic
      const res = await POST(req, mockParams);
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: mockPostId },
        data: { views: { increment: 1 } },
      });
      const json = await res.json();
      expect(json).toEqual({ success: true });
    });
  });

  describe('GET', () => {
    it('returns 405 Method Not Allowed', () => {
      const res = GET();
      expect(res.status).toBe(405);
      expect(res.statusText).toBe('');
      // NextResponse sets content-type to text/plain by default for string bodies
      expect(res.headers.get('content-type')).toBe('text/plain;charset=UTF-8');
    });
  });
});
