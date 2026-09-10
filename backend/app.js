import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/auth.Routes.js';
import expertRoutes from './routes/expertRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import categoryRoutes from './routes/ExpertCategoryRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import userDashboardRoutes from './routes/userDashboardRoutes.js';
import expertDashboardRoutes from './routes/expertDashboardRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import callSessionRoutes from './routes/callSessionRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import payoutRoutes from './routes/payoutRoutes.js';
import adminFilterRoutes from './routes/adminFilterRoutes.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.type('text/html').send('API is running...');
});

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/experts', expertRoutes);
app.use('/categories', categoryRoutes);
app.use('/services', serviceRoutes);
app.use('/bookings', bookingRoutes);
app.use('/reviews', reviewRoutes);
app.use('/payments', paymentRoutes);
app.use('/chat', chatRoutes);
app.use('/user-dashboard', userDashboardRoutes);
app.use('/expert-dashboard', expertDashboardRoutes);
app.use('/availability', availabilityRoutes);

app.use('/call-sessions', callSessionRoutes);
app.use('/disputes', disputeRoutes);
app.use('/notifications', notificationRoutes);
app.use('/payouts', payoutRoutes);
app.use('/admin/filter', adminFilterRoutes);

export default app;