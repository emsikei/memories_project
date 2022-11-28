import { connectDB, dropDB } from '../../setupTestDb';
import userSchema from '../../../models/user';

beforeAll(async () => {
        await connectDB();
});

afterAll(async () => {
        await dropDB();
});

describe('User Model', () => {
        it('should validate a user successfully', async () => {
                const user = {
                        name: 'test-name',
                        email: 'test-email',
                        password: 'test-password',
                        id: 'test-id',
                };

                const newUser = await userSchema(user);
                await newUser.save();
        });
        it('should not validate a user successfully, because of required fields', async () => {
                let user = {
                        email: 'test-email',
                        password: 'test-password',
                        id: 'test-id',
                };

                const newUser = await userSchema(user);
                await expect(newUser.save()).rejects.toThrowError(
                        'User validation failed: name: Path `name` is required.'
                );

                user = {
                        name: 'test-name',
                        password: 'test-password',
                        id: 'test-id',
                };

                const newUser2 = await userSchema(user);
                await expect(newUser2.save()).rejects.toThrowError(
                        'User validation failed: email: Path `email` is required.'
                );

                user = {
                        name: 'test-name',
                        email: 'test-email',
                        id: 'test-id',
                };

                const newUser3 = await userSchema(user);
                await expect(newUser3.save()).rejects.toThrowError(
                        'User validation failed: password: Path `password` is required.'
                );
        });
});
