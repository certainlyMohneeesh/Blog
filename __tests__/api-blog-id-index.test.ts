import { GET } from '../src/app/api/blog/[id]/index';
import prisma from '../src/lib/db';

describe('GET /api/blog/[id]', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('returns a blog post if it exists', async () => {
    // Arrange: Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        name: 'Test User',
      },
    });

    // Arrange: Create a test post
    const testPost = await prisma.post.create({
      data: {
        title: 'Test Post',
        content: 'This is a test',
        authorId: testUser.id,
      },
    });

    // Act: Call the handler
    const req = {} as any;
    const params = { id: testPost.id };
    const res = await GET(req, { params });
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.post).toBeDefined();
    expect(json.post.title).toBe('Test Post');

    // Cleanup
    await prisma.post.delete({ where: { id: testPost.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
  }, 20000);

  it('returns 404 if the post does not exist', async () => {
    const req = {} as any;
    const params = { id: 'aaaaaaaaaaaaaaaaaaaaaaaa' };
    const res = await GET(req, { params });
    expect(res.status).toBe(404);
  });
});
