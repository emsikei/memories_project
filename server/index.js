import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import supertest from 'supertest';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;

const request = supertest(app);
const isInTestMode = typeof process.env.NODE_ENV === 'string' && process.env.NODE_ENV.toLowerCase() === 'test';
if (!isInTestMode) {
        mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
                .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
                .catch((error) => console.log(error.message));
}
export { request };
