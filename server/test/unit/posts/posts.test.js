import { connectDB, dropDB } from '../../setupTestDb';
import PostMessage from '../../../models/postMessage';

beforeAll(async () => {
        await connectDB();
});

afterAll(async () => {
        await dropDB();
});

describe('Post Model', () => {
        it('should validate a post successfully', async () => {
                const post = {
                        title: 'test-title',
                        message: 'test-message',
                        name: 'test-name',
                        creator: 'test-creator',
                        tags: ['test-tags-1', 'test-tags-2'],
                        selectedFile: 'test-selectedFile',
                        likes: ['test-likes-1', 'test-likes-2'],
                        comments: ['test-comments-1', 'test-comments-2'],
                        createdAt: new Date(),
                };

                const newPost = await PostMessage(post);
                await newPost.save();
        });
        it('should not validate a post successfully, because of required fields', async () => {
                let post = {
                        title: 'test-title',
                        name: 'test-name',
                        creator: 'test-creator',
                        tags: ['test-tags-1', 'test-tags-2'],
                        selectedFile: 'test-selectedFile',
                        likes: ['test-likes-1', 'test-likes-2'],
                        comments: ['test-comments-1', 'test-comments-2'],
                        createdAt: new Date(),
                };

                const newPost = await PostMessage(post);
                await expect(newPost.save()).rejects.toThrowError('Path `message` is required');

                post = {
                        message: 'test-message',
                        name: 'test-name',
                        creator: 'test-creator',
                        tags: ['test-tags-1', 'test-tags-2'],
                        selectedFile: 'test-selectedFile',
                        likes: ['test-likes-1', 'test-likes-2'],
                        comments: ['test-comments-1', 'test-comments-2'],
                        createdAt: new Date(),
                };

                const newPost2 = await PostMessage(post);
                await expect(newPost2.save()).rejects.toThrowError('Path `title` is required');
        });
});
