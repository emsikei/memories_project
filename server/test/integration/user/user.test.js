import { request } from '../../../index';
import { connectDB, dropDB } from '../../setupTestDb';

beforeAll(async () => {
        await connectDB();
});

afterAll(async () => {
        await dropDB();
});

describe('test POST /users/signup root', () => {
        it('should create a new user successfully', async () => {
                const data = {
                        email: 'test-email',
                        password: 'test-password',
                        firstName: 'test-firstName',
                        lastName: 'test-lastName',
                        confirmPassword: 'test-password',
                };
                await request.post('/users/signup').send(data).expect(200);
        });
        it('should not create a new user successfully, because of already existing email', async () => {
                const data = {
                        email: 'test-email',
                        password: 'test-password',
                        firstName: 'test-firstName',
                        lastName: 'test-lastName',
                        confirmPassword: 'test-password',
                };
                await request.post('/users/signup').send(data).expect(404, { message: 'User already exists.' });
        });
        it("should not create a new user successfully, because of password and password confirmation doesn't matching", async () => {
                const data = {
                        email: 'new-test-email',
                        password: 'test-password-1',
                        firstName: 'test-firstName',
                        lastName: 'test-lastName',
                        confirmPassword: 'test-password-2',
                };
                await request.post('/users/signup').send(data).expect(404, { message: "Passwords don't match." });
        });
});

describe('test POST /users/signin root', () => {
        it('should login with existing credentials successfully', async () => {
                const data = {
                        email: 'test-email',
                        password: 'test-password',
                };
                await request.post('/users/signin').send(data).expect(200);
        });
        it('should not login successfully, because of non-existing user', async () => {
                const data = {
                        email: 'non-existing email',
                        password: 'test-password',
                };
                await request.post('/users/signin').send(data).expect(404, { message: "User doesn't exist." });
        });
        it('should not login successfully, because of wrong password', async () => {
                const data = {
                        email: 'test-email',
                        password: 'wrong password',
                };
                await request.post('/users/signin').send(data).expect(404, { message: 'Invalid credentials.' });
        });
});
