import { request } from '../../../index';
import { connectDB, dropDB } from '../../setupTestDb';

beforeAll(async () => {
        await connectDB();
        await getToken();
});

afterAll(async () => {
        await dropDB();
});

let token = 'bearer ';
let postId = '';

async function getToken() {
        const data = {
                email: 'test-email',
                password: 'test-password',
                firstName: 'test-firstName',
                lastName: 'test-lastName',
                confirmPassword: 'test-password',
        };
        const res = await request.post('/users/signup').send(data).expect(200);

        token += res.body.token;
}

describe('test POST /posts/ root', () => {
        it('should create a new post successfully', async () => {
                const data = {
                        title: 'test-title',
                        message: 'test-message',
                        name: 'test-name',
                        tags: ['tag-1', 'tag-2'],
                        selectedFile: 'test-selectedFile',
                };

                const res = await request.post('/posts/').set({ Authorization: token }).send(data).expect(200);
                postId = res.body._id;

                expect(res.body.title).toEqual(data.title);
                expect(res.body.message).toEqual(data.message);
                expect(res.body.name).toEqual(data.name);
                expect(res.body.tags).toEqual(data.tags);
                expect(res.body.selectedFile).toEqual(data.selectedFile);
        });
        it('should create a new post successfully, because of unauthorized', async () => {
                const data = {
                        title: 'test-title',
                        message: 'test-message',
                        name: 'test-name',
                        tags: ['tag-1', 'tag-2'],
                        selectedFile: 'test-selectedFile',
                };

                await request.post('/posts/').send(data).expect(401);
        });
});

describe('test PATCH /posts/:id root', () => {
        it('should update the post successfully', async () => {
                const data = {
                        _id: postId,
                        title: 'new-test-title',
                        message: 'new-test-message',
                        name: 'new-test-name',
                        tags: ['test-tags-1', 'test-tags-2'],
                        selectedFile: 'test-selectedFile',
                };

                const res = await request
                        .patch(`/posts/${postId}`)
                        .set({ Authorization: token })
                        .send(data)
                        .expect(200);

                expect(res.body.title).toEqual(data.title);
                expect(res.body.message).toEqual(data.message);
                expect(res.body.name).toEqual(data.name);
                expect(res.body.tags).toEqual(data.tags);
                expect(res.body.selectedFile).toEqual(data.selectedFile);
        });
        it('should not update the post successfully, because of unauthorized', async () => {
                const data = {
                        _id: postId,
                        title: 'test-title',
                        message: 'test-message',
                        name: 'test-name',
                        creator: 'test-creator',
                        tags: ['test-tags-1', 'test-tags-2'],
                        selectedFile: 'test-selectedFile',
                };

                await request.patch(`/posts/${postId}`).send(data).expect(401);
        });
        it('should not update the post successfully, because of wrong id', async () => {
                const data = {
                        _id: postId,
                        title: 'test-title',
                        message: 'test-message',
                        name: 'test-name',
                        creator: 'test-creator',
                        tags: ['test-tags-1', 'test-tags-2'],
                        selectedFile: 'test-selectedFile',
                };

                await request.patch(`/posts/not-existing-id`).send(data).set({ Authorization: token }).expect(404);
        });
});

describe('test PATCH /posts/:id/likePost root', () => {
        it('should add like to the post successfully', async () => {
                const res = await request.patch(`/posts/${postId}/likePost`).set({ Authorization: token }).expect(200);

                expect(res.body.likes.length).toEqual(1);
        });
        it('should not add like to the post successfully, because of unauthorized', async () => {
                await request.patch(`/posts/${postId}/likePost`).expect(401);
        });
        it('should not add like to the post successfully, because of wrong id', async () => {
                await request.patch(`/posts/not-existing-id/likePost`).set({ Authorization: token }).expect(404);
        });
});

describe('test POST /posts/:id/likePost root', () => {
        it('should add comment to the post successfully', async () => {
                const data = {
                        value: 'new-comment',
                };

                const res = await request
                        .post(`/posts/${postId}/commentPost`)
                        .set({ Authorization: token })
                        .send(data)
                        .expect(200);

                expect(res.body.likes.length).toEqual(1);
        });
        it('should not add comment to the post successfully, because of unauthorized', async () => {
                const data = {
                        value: 'new-comment',
                };

                await request.post(`/posts/${postId}/commentPost`).send(data).expect(401);
        });
        it('should not add comment to the post successfully, because of wrong id', async () => {
                const data = {
                        value: 'new-comment',
                };
                await request
                        .post(`/posts/not-existing-id/commentPost`)
                        .set({ Authorization: token })
                        .send(data)
                        .expect(404);
        });
});

describe('test GET /posts/ root', () => {
        it('should get list of posts successfully', async () => {
                const res = await request.get('/posts/').expect(200);

                expect(res.body.data.length).toEqual(1);
                expect(res.body.data[0]._id).toEqual(postId);
        });
});

describe('test GET /posts/search root', () => {
        it('should get list of posts by searchQuery successfully', async () => {
                const data = {
                        searchQuery: 'new-test-title',
                        tags: [],
                };

                const res = await request.get('/posts/').send(data).expect(200);

                expect(res.body.data.length).toEqual(1);
                expect(res.body.data[0]._id).toEqual(postId);
        });
        it('should get list of posts by tags successfully', async () => {
                const data = {
                        searchQuery: '',
                        tags: ['tag-1'],
                };

                const res = await request.get('/posts/').send(data).expect(200);

                expect(res.body.data.length).toEqual(1);
                expect(res.body.data[0]._id).toEqual(postId);
        });
});

describe('test GET /posts/:id root', () => {
        it('should get the post successfully', async () => {
                const res = await request.get(`/posts/${postId}`).expect(200);

                expect(res.body._id).toEqual(postId);
        });
        it('should not get the post successfully, because of non-existing _id', async () => {
                await request.get(`/posts/non-existing-id`).expect(404);
        });
});

describe('test DELETE /posts/:id root', () => {
        it('should delete the post successfully', async () => {
                await request.delete(`/posts/${postId}`).set({ Authorization: token }).expect(200);
        });
        it('should not delete the post successfully, because of non-existing _id', async () => {
                await request.delete(`/posts/non-existing-id`).set({ Authorization: token }).expect(404);
        });
        it('should not delete a new post successfully, because of unauthorized', async () => {
                await request.delete(`/posts/${postId}`).expect(401);
        });
});
