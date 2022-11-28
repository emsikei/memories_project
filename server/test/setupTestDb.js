import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo = null;

export async function connectDB() {
        mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();

        await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
        });
}

export async function dropDB() {
        if (mongo) {
                await mongoose.connection.dropDatabase();
                await mongoose.connection.close();
                await mongo.stop();
        }
}
