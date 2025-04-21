jest.mock('next-auth', () => ({
  __esModule: true,
  default: () => jest.fn(), // Mock NextAuth as a function
  getServerSession: jest.fn(),
}));

import { POST, GET, PUT, DELETE } from '../src/app/api/blog/[id]/likes/route';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';

describe('api/blog/[id]/likes/route', () => {
  const mockPostId = 'test-post-id';
  const mockParams = { params: { id: mockPostId } };
  let findUserSpy: jest.SpyInstance;
  let upsertLikeSpy: jest.SpyInstance;
  let deleteManyLikeSpy: jest.SpyInstance;
  let countLikeSpy: jest.SpyInstance;
  let updatePostSpy: jest.SpyInstance;

  beforeEach(() => {
    findUserSpy = jest.spyOn(prisma.user, 'findUnique');
    upsertLikeSpy = jest.spyOn(prisma.like, 'upsert');
    deleteManyLikeSpy = jest.spyOn(prisma.like, 'deleteMany');
    countLikeSpy = jest.spyOn(prisma.like, 'count');
    updatePostSpy = jest.spyOn(prisma.post, 'update');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('returns 401 if not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({});
      const req = { json: jest.fn() } as any;
      const res = await POST(req, mockParams);
      expect(res.status).toBe(401);
    });

    it('returns 404 if user not found', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'test@example.com' } });
      findUserSpy.mockResolvedValue(null);
      const req = { json: jest.fn() } as any;
      const res = await POST(req, mockParams);
      expect(res.status).toBe(404);
    });

    it('likes a post and returns success', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'test@example.com' } });
      findUserSpy.mockResolvedValue({ id: 'user-id' });
      const req = { json: jest.fn().mockResolvedValue({ action: 'like' }) } as any;
      upsertLikeSpy.mockResolvedValue({});
      countLikeSpy.mockResolvedValue(5);
      updatePostSpy.mockResolvedValue({});
      const res = await POST(req, mockParams);
      expect(upsertLikeSpy).toHaveBeenCalledWith({
        where: { userId_postId: { userId: 'user-id', postId: mockPostId } },
        update: {},
        create: { userId: 'user-id', postId: mockPostId },
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ success: true, likes: 5 });
    });

    it('unlikes a post and returns success', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'test@example.com' } });
      findUserSpy.mockResolvedValue({ id: 'user-id' });
      const req = { json: jest.fn().mockResolvedValue({ action: 'unlike' }) } as any;
      deleteManyLikeSpy.mockResolvedValue({});
      countLikeSpy.mockResolvedValue(3);
      updatePostSpy.mockResolvedValue({});
      const res = await POST(req, mockParams);
      expect(deleteManyLikeSpy).toHaveBeenCalledWith({ where: { userId: 'user-id', postId: mockPostId } });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ success: true, likes: 3 });
    });
  });

  describe('GET', () => {
    it('returns 405 Method Not Allowed', () => {
      const res = GET();
      expect(res.status).toBe(405);
      expect(res.statusText).toBe('');
      expect(res.headers.get('content-type')).toBe('text/plain;charset=UTF-8');
    });
  });

  describe('PUT', () => {
    it('returns 405 Method Not Allowed', () => {
      const res = PUT();
      expect(res.status).toBe(405);
      expect(res.statusText).toBe('');
      expect(res.headers.get('content-type')).toBe('text/plain;charset=UTF-8');
    });
  });

  describe('DELETE', () => {
    it('returns 405 Method Not Allowed', () => {
      const res = DELETE();
      expect(res.status).toBe(405);
      expect(res.statusText).toBe('');
      expect(res.headers.get('content-type')).toBe('text/plain;charset=UTF-8');
    });
  });
});
