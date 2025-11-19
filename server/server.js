// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import uploadRoutes from './routes/upload.js';
import chatSimpleRoutes from './routes/chatSimple.js';
import chatRagRoutes from './routes/chatRag.js'

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected'));

// Use service role key on backend
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatSimpleRoutes); // now /api/chat/simple works
app.use('/api/chat/rag', chatRagRoutes); // now /api/chat/simple works


app.get('/', (req, res) => res.json({ message: 'EduNexus API – MongoDB Auth + Supabase RAG' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
